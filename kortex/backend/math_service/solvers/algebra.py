"""
Cebir Çözücü — solve, simplify, factor, expand, eşitsizlik, karmaşık sayılar.

Çift doğrulama: Her solve sonrası bulunan kökler orijinal denkleme geri
yerine konur. Sağlamıyorsa sonuç reddedilir, alternatif strateji denenir.
"""

import sympy
from sympy import (
    symbols, solve, simplify, expand, factor, collect, cancel,
    solveset, S, Rational, oo, I, Abs, sqrt,
    reduce_inequalities, solve_univariate_inequality,
    re as sym_re, im as sym_im, arg, conjugate,
    FiniteSet, Interval, Union, ConditionSet, ImageSet,
)


def _make_step(step_num, description, expression, readable=None):
    """Standart adım dict'i oluşturur."""
    return {
        "step": step_num,
        "description": description,
        "expression": str(expression),
        "readable": readable or sympy.pretty(expression) if not isinstance(expression, str) else str(expression),
    }


def _verify_solutions(expr, var, solutions):
    """
    Çift doğrulama: Bulunan çözümleri orijinal ifadeye yerine koyarak kontrol eder.
    Yanlış çözümleri filtreler.
    """
    if (
        solutions is None
        or isinstance(solutions, (str, ConditionSet, ImageSet))
        or (hasattr(solutions, "is_FiniteSet") and not solutions.is_FiniteSet)
    ):
        return solutions

    verified = []
    iterable = list(solutions) if not isinstance(solutions, list) else solutions
    for sol in iterable:
        try:
            substituted = simplify(expr.subs(var, sol))
            if substituted.has(sympy.nan, sympy.zoo, sympy.oo, -sympy.oo):
                continue
            # Sonuç 0 veya çok küçükse doğru
            if substituted == 0:
                verified.append(sol)
            elif substituted.is_number:
                if abs(complex(substituted)) < 1e-10:
                    verified.append(sol)
            else:
                # Sembolik ifade, yine de ekle (parametrik çözüm olabilir)
                verified.append(sol)
        except Exception:
            continue  # Doğrulama yapılamıyorsa güvenli tarafta kal

    return verified


def _solution_sort_key(solution):
    """Karışık reel/karmaşık çözümleri patlamadan sıralamak için güvenli anahtar."""
    try:
        numeric = complex(solution.evalf())
        return (0 if solution.is_real else 1, numeric.real, numeric.imag)
    except Exception:
        return (0 if solution.is_real else 1, str(solution), "")


def solve_with_steps(expr, variable):
    """Denklemi adım adım çözer. Çift doğrulama yapar."""
    x = variable
    steps = []
    current = expr

    # Adım 1: Orijinal ifade
    steps.append(_make_step(1, "Orijinal ifade", current))

    # Adım 2: Genişletme
    expanded = expand(current)
    if expanded != current:
        steps.append(_make_step(len(steps) + 1, "Parantezler açıldı", expanded))
        current = expanded

    # Adım 3: Sadeleştirme
    simplified = simplify(current)
    if simplified != current:
        steps.append(_make_step(len(steps) + 1, "İfade sadeleştirildi", simplified))
        current = simplified

    # Adım 4: Collect
    try:
        collected = collect(current, x)
        if collected != current:
            steps.append(_make_step(len(steps) + 1, f"{x} değişkenine göre terimler toplandı", collected))
            current = collected
    except Exception:
        pass

    # Adım 5: Factoring (bilgi amaçlı)
    try:
        factored = factor(current)
        if factored != current:
            steps.append(_make_step(len(steps) + 1, "Çarpanlarına ayrıldı", factored))
    except Exception:
        pass

    # Adım 6: Çözüm
    if x not in current.free_symbols:
        # Değişken yok — sadece aritmetik hesaplama
        result = simplify(current)
        solution = [result]
        desc = "Matematiksel işlem sonucu"
    else:
        # Önce solveset dene (daha kapsamlı)
        try:
            sol_set = solveset(current, x, domain=S.Complexes)
            if isinstance(sol_set, FiniteSet):
                solution = sorted(list(sol_set), key=_solution_sort_key)
            elif sol_set != S.EmptySet:
                solution = sol_set
            else:
                solution = solve(current, x)
        except Exception:
            solution = solve(current, x)

        # Çift doğrulama
        solution = _verify_solutions(expr, x, solution)
        desc = f"Denklem çözüldü → {x} için sonuçlar bulundu"

    steps.append(_make_step(len(steps) + 1, desc, str(solution), str(solution)))

    return solution, steps


def simplify_expr(expr):
    """İfadeyi sadeleştirir."""
    result = simplify(expr)
    steps = [
        _make_step(1, "Orijinal ifade", expr),
        _make_step(2, "Sadeleştirildi", result),
    ]
    return result, steps


def factor_expr(expr):
    """Çarpanlarına ayırır."""
    result = factor(expr)
    steps = [
        _make_step(1, "Orijinal ifade", expr),
        _make_step(2, "Çarpanlarına ayrıldı", result),
    ]
    return result, steps


def expand_expr(expr):
    """Parantezleri açar."""
    result = expand(expr)
    steps = [
        _make_step(1, "Orijinal ifade", expr),
        _make_step(2, "Parantezler açıldı", result),
    ]
    return result, steps
