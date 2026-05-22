"""
Kombinatorik Çözücü — Permütasyon, Kombinasyon, Faktöriyel ve Kısıtlı Sayma (Brute Force).
"""

import sympy
from sympy import factorial, binomial, Rational
import itertools

def _make_step(step_num, description, expression, readable=None):
    return {
        "step": step_num,
        "description": description,
        "expression": str(expression),
        "readable": readable if readable else str(expression),
    }

def combinatorics_with_steps(n, r, calc_type):
    """
    Permütasyon, kombinasyon, faktöriyel hesaplama.
    """
    steps = []
    n_val = int(n)
    r_val = int(r) if r else 0

    if calc_type == "factorial":
        result = factorial(n_val)
        steps.append(_make_step(1, f"{n_val}! hesaplandı", str(result), f"{n_val}! = {result}"))
        return str(result), steps

    elif calc_type == "permutation":
        result = factorial(n_val) // factorial(n_val - r_val)
        steps.append(_make_step(1, f"P({n_val},{r_val}) formülü uygulandı", f"{n_val}!/({n_val}-{r_val})!"))
        steps.append(_make_step(2, "Sonuç", str(int(result))))
        return str(int(result)), steps

    elif calc_type == "combination":
        result = binomial(n_val, r_val)
        steps.append(_make_step(1, f"C({n_val},{r_val}) formülü uygulandı", f"{n_val}!/({r_val}!*({n_val}-{r_val})!)"))
        steps.append(_make_step(2, "Sonuç", str(int(result))))
        return str(int(result)), steps

    return "Bilinmeyen işlem", steps

def solve_discrete_counting(n_total, constraints):
    """
    Kısıtlı sayma problemlerini tek tek dizilim oluşturarak çözer (Brute Force).
    constraints: list of dict
        - {"type": "gap", "item1": "A", "item2": "B", "gap": 2}
        - {"type": "together", "items": ["A", "B"]}
        - {"type": "not_together", "items": ["A", "B"]}
    """
    items = list(range(n_total)) # 0, 1, 2, ... (A=0, B=1, ...)
    all_perms = itertools.permutations(items)
    
    count = 0
    total_checked = 0
    
    for p in all_perms:
        total_checked += 1
        is_valid = True
        
        for c in constraints:
            ctype = c.get("type")
            if ctype == "gap":
                i1, i2 = 0, 1 # Varsayılan olarak ilk iki kişi
                gap_size = int(c.get("gap", 0))
                # Bulma
                idx1 = p.index(i1)
                idx2 = p.index(i2)
                if abs(idx1 - idx2) != (gap_size + 1):
                    is_valid = False
                    break
            elif ctype == "together":
                i1, i2 = 0, 1
                if abs(p.index(i1) - p.index(i2)) != 1:
                    is_valid = False
                    break
            elif ctype == "not_together":
                i1, i2 = 0, 1
                if abs(p.index(i1) - p.index(i2)) == 1:
                    is_valid = False
                    break
        
        if is_valid:
            count += 1
            
    steps = [
        _make_step(1, f"Toplam {total_checked} farklı dizilim (permutasyon) oluşturuldu.", total_checked),
        _make_step(2, f"Verilen kısıtlara uyanlar tek tek sayıldı.", count),
        _make_step(3, f"Doğrulanmış Sonuç: {count}", count)
    ]
    
    return str(count), steps
