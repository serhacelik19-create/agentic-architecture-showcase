"""
Normalizer — Gelen ifadeleri güvenli şekilde SymPy formatına dönüştürür.

Eski motorun 1 numaralı sorun kaynağı (fonksiyon isimlerini bozan regex'ler)
burada kökten çözülmüş durumda.

Strateji: KORUMA → DÖNÜŞÜM → GERİ YÜKLEME
1. Bilinen fonksiyon isimlerini ve kullanıcı değişkenlerini placeholder'lara çevir (§PH_SIN§ gibi)
2. Implicit çarpma ve unicode dönüşümleri uygula (regex'ler placeholder'lara dokunmaz)
3. Placeholder'ları geri çevir
4. parse_expr ile SymPy ifadesine çevir
"""

import re
import sympy
from sympy import (
    symbols, pi, E, oo, I,
    sin, cos, tan, log, exp, sqrt, Abs,
    cot, sec, csc, asin, acos, atan,
    sinh, cosh, tanh, factorial, ceiling, floor, sign,
    Rational, S
)
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor,
    function_exponentiation,
)

# ============================================================
# BİLİNEN FONKSİYONLAR (Uzundan kısaya sıralanmış — greedy match)
# ============================================================
KNOWN_FUNCTIONS = [
    'factorial', 'ceiling', 'floor',
    'sqrt', 'cbrt',
    'sinh', 'cosh', 'tanh',
    'asin', 'acos', 'atan',
    'sign',
    'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
    'log', 'ln', 'exp', 'Abs',
    'limit', 'diff', 'integrate',
    'Sum', 'Product',
]

def _protect_words(expr: str, words: list) -> str:
    """
    Kritik kelimeleri placeholder'lara çevirir.
    Regex çakışmasını önlemek için kelimeleri uzunluklarına göre azalan sırada sıralar.
    """
    # Kelimeleri uzunluklarına göre azalan sırada sırala (Greedy Match)
    unique_words = list(set(words))
    sorted_words = sorted(unique_words, key=len, reverse=True)
    
    protected_expr = expr
    for word in sorted_words:
        if not word: continue
        # \b word boundary kullanarak tam kelime eşleşmesi sağlar
        # re.escape ile özel karakterleri (varsa) etkisizleştirir
        placeholder = f"§__PH_{word.upper()}__§"
        protected_expr = re.sub(rf'\b{re.escape(word)}\b', placeholder, protected_expr)
        
    return protected_expr

def _restore_words(expr: str, words: list) -> str:
    """Placeholder'ları geri kelimelere çevirir."""
    restored_expr = expr
    for word in words:
        if not word: continue
        placeholder = f"§__PH_{word.upper()}__§"
        restored_expr = restored_expr.replace(placeholder, word)
    return restored_expr

# ============================================================
# UNICODE VE FORMAT DÖNÜŞÜMLERİ
# ============================================================
UNICODE_MAP = {
    '×': '*', '÷': '/', '·': '*',
    '−': '-', '—': '-', '–': '-',
    '²': '**2', '³': '**3', '⁴': '**4', '⁵': '**5',
    '⁶': '**6', '⁷': '**7', '⁸': '**8', '⁹': '**9',
    '½': '(Rational(1,2))', '¼': '(Rational(1,4))', '¾': '(Rational(3,4))',
    '√': 'sqrt',
    'π': 'pi', 'α': 'alpha', 'β': 'beta', 'θ': 'theta',
    '∞': 'oo',
    '≤': '<=', '≥': '>=', '≠': '!=',
}

def normalize(expr_str: str, extra_vars=None) -> str:
    """
    Ham ifadeyi SymPy-uyumlu string'e çevirir.
    extra_vars: Korunacak özel değişkenler (parçalanmamasını istediklerimiz).
    """
    expr = expr_str.strip()

    # 0.1 Çıplak trig yazımları: sinx, cosx, tan2x -> sin(x), cos(x), tan(2*x)
    for fn in ['sin', 'cos', 'tan', 'cot', 'sec', 'csc']:
        expr = re.sub(rf'\b{fn}\s*(\d+)\s*([a-zA-Z])\b', rf'{fn}(\1*\2)', expr)
        expr = re.sub(rf'\b{fn}\s*([a-zA-Z])\b', rf'{fn}(\1)', expr)

    # Korunacak kelime listesi (Fonksiyonlar + Kullanıcı Değişkenleri)
    words_to_protect = list(KNOWN_FUNCTIONS)
    target_vars = []
    if extra_vars:
        if isinstance(extra_vars, str):
            target_vars = [v.strip() for v in extra_vars.split(',')]
        elif isinstance(extra_vars, (list, tuple)):
            target_vars = list(extra_vars)
        words_to_protect.extend(target_vars)

    # 0. Kelimeleri koru (Placeholder stratejisi)
    expr = _protect_words(expr, words_to_protect)

    # 1. Unicode dönüşümleri
    for old, new in UNICODE_MAP.items():
        expr = expr.replace(old, new)

    # 2. ^ → ** (üs alma)
    expr = expr.replace('^', '**')

    # 3. Türkçe fonksiyon isimleri (Placeholder mantığıyla)
    tr_map = {
        'karekök': 'sqrt', 'karekok': 'sqrt',
        'mutlak': 'Abs',
        'türev': 'diff', 'turev': 'diff',
    }
    for tr, en in tr_map.items():
        # Çevrilen fonksiyon zaten words_to_protect içinde (placeholder olarak işlem görsün)
        ph = f"§__PH_{en.upper()}__§"
        expr = re.sub(rf'\b{tr}\b', ph, expr, flags=re.IGNORECASE)

    # 4. sin²x → sin(x)**2 vb. (Placeholder üzerinden)
    for fn in ['sin', 'cos', 'tan', 'cot', 'sec', 'csc']:
        ph = f"§__PH_{fn.upper()}__§"
        expr = re.sub(rf'{re.escape(ph)}\s*\*\*(\d+)\s*\(?([a-zA-Z§])\)?', rf'{ph}(\2)**\1', expr)

    # 5. ln → log (SymPy'de ln = log)
    expr = re.sub(r'\bln\b', f"§__PH_LOG__§", expr)

    # 6. |x| → Abs(x) (mutlak değer)
    expr = re.sub(r'\|([^|]+)\|', f"§__PH_ABS__§(\\1)", expr)

    # 7. Implicit çarpma: sayı-harf (3x → 3*x)
    expr = re.sub(r'(\d)([a-zA-Z§])', r'\1*\2', expr)

    # 8. Parantez çarpmaları: )( → )*( ve )x → )*x
    expr = re.sub(r'\)\s*\(', ')*(', expr)
    expr = re.sub(r'(\))\s*([a-zA-Z0-9§])', r'\1*\2', expr)

    # 9. Harf/rakam sonrası parantez: x( → x*( AMA fonksiyonlar (placeholder) hariç tut
    expr = re.sub(r'([a-zA-Z0-9])(?<!§)\s*\(', r'\1*(', expr)

    # 10. Placeholder'dan sonra gelen *( düzelt: §__PH_SIN__§*( → §__PH_SIN__§(
    expr = re.sub(r'(§__PH_[A-Z_]+__§)\s*\*\s*\(', r'\1(', expr)

    # 11. Kelimeleri geri yükle
    expr = _restore_words(expr, words_to_protect)

    # 12. Denklem formatı: "= 0" veya "= 5" → sola taşı
    if '=' in expr and '==' not in expr and '<=' not in expr and '>=' not in expr:
        parts = expr.split('=')
        if len(parts) == 2:
            left, right = parts[0].strip(), parts[1].strip()
            if right and right != '0':
                expr = f"({left}) - ({right})"
            else:
                expr = left

    return expr

# ============================================================
# GÜVENLİ SYMPIFY
# ============================================================

# parse_expr için local dict
LOCAL_DICT = {
    'x': symbols('x'), 'y': symbols('y'), 'z': symbols('z'),
    'a': symbols('a'), 'b': symbols('b'), 'c': symbols('c'),
    't': symbols('t'), 'n': symbols('n'), 'k': symbols('k'),
    'r': symbols('r'), 'm': symbols('m'),
    'pi': pi, 'E': E, 'I': I,
    'oo': oo, 'inf': oo,
    'sin': sin, 'cos': cos, 'tan': tan,
    'cot': cot, 'sec': sec, 'csc': csc,
    'asin': asin, 'acos': acos, 'atan': atan,
    'sinh': sinh, 'cosh': cosh, 'tanh': tanh,
    'log': log, 'ln': log, 'exp': exp,
    'sqrt': sqrt, 'Abs': Abs,
    'factorial': factorial,
    'ceiling': ceiling, 'floor': floor, 'sign': sign,
    'Rational': Rational,
    'diff': sympy.diff,
    'integrate': sympy.integrate,
    'limit': sympy.limit,
    'Sum': sympy.Sum,
    'Product': sympy.Product,
}

TRANSFORMATIONS = (
    standard_transformations
    + (implicit_multiplication_application,)
    + (convert_xor,)
    + (function_exponentiation,)
)

def safe_sympify(expr_str: str, extra_vars=None):
    """
    Çoklu strateji ile ifadeyi SymPy nesnesine çevirir.
    extra_vars: Kullanıcı tarafından tanımlanan özel değişken listesi.
    """
    # Değişken listesini normalize et
    var_list = []
    if extra_vars:
        if isinstance(extra_vars, str):
            var_list = [v.strip() for v in extra_vars.split(',')]
        elif isinstance(extra_vars, (list, tuple)):
            var_list = list(extra_vars)

    normalized = normalize(expr_str, extra_vars=var_list)
    
    # Yerel sözlüğü hazırla
    local_dict = LOCAL_DICT.copy()
    for v in var_list:
        if v: local_dict[v] = symbols(v)

    # Strateji 1: parse_expr (en güvenli)
    try:
        result = parse_expr(normalized, local_dict=local_dict, transformations=TRANSFORMATIONS)
        return result
    except Exception:
        pass

    # Strateji 2: sympify (fallback)
    try:
        result = sympy.sympify(normalized)
        return result
    except Exception:
        pass

    # Strateji 3: Minimal temizlik + sympify
    try:
        minimal = expr_str.strip().replace('^', '**')
        result = sympy.sympify(minimal)
        return result
    except Exception as e:
        raise ValueError(
            f"İfade parse edilemedi: '{expr_str}' → Normalize: '{normalized}' → Hata: {str(e)}"
        )
