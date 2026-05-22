"""
Trigonometri Çözücü — Genel çözüm kümesi, belirli aralıkta kökler.

Özellikler:
- solveset ile genel çözüm (n∈Z)
- [0, 2π] veya kullanıcı tanımlı aralıkta spesifik kökler
- Radyan ↔ derece dönüşümü
"""

import sympy
from sympy import (
    symbols, solve, solveset, simplify,
    sin, cos, tan, pi, S, Rational,
    Interval, FiniteSet, Union, ImageSet, ConditionSet,
    deg,
)
from sympy.calculus.util import function_range


def _make_step(step_num, description, expression, readable=None):
    return {
        "step": step_num,
        "description": description,
        "expression": str(expression),
        "readable": readable if readable else (
            sympy.pretty(expression) if not isinstance(expression, str) else str(expression)
        ),
    }


def _collect_finite_roots(solution_set):
    if isinstance(solution_set, FiniteSet):
        return list(solution_set)
    if isinstance(solution_set, Union):
        roots = []
        for part in solution_set.args:
            if isinstance(part, FiniteSet):
                roots.extend(list(part))
        return roots
    return []


def _fallback_specific_trig_roots(expr, variable, interval):
    """
    SymPy ConditionSet döndürdüğünde sin(u)=0 / cos(u)=0 / tan(u)=0
    tiplerini sınırlı aralıkta elle aç.
    """
    if expr.func not in (sin, cos, tan) or not expr.args:
        return []

    inner = expr.args[0]
    try:
        inner_range = function_range(inner, variable, interval)
    except Exception:
        return []

    if not isinstance(inner_range, Interval) or inner_range.start is S.NegativeInfinity or inner_range.end is S.Infinity:
        return []

    offset = {sin: 0, tan: 0, cos: pi / 2}[expr.func]
    start = int(sympy.floor((inner_range.start - offset) / pi)) - 1
    end = int(sympy.ceiling((inner_range.end - offset) / pi)) + 1

    roots = set()
    for k in range(start, end + 1):
        target = offset + k * pi
        try:
            candidate_set = solveset(inner - target, variable, interval)
        except Exception:
            continue
        roots.update(_collect_finite_roots(candidate_set))

    return sorted(roots, key=lambda root: float(root))


def trig_general_solution_with_steps(expr, variable):
    """
    Trigonometrik denklem çözümü.
    - Genel çözüm kümesi (n∈Z)
    - [0, 2π] aralığındaki kökler
    - Radyan ve derece cinsinden gösterim
    """
    x = variable
    steps = [_make_step(1, "Trigonometrik denklem", expr)]

    # 1. Genel çözüm
    general_sol = None
    try:
        general_sol = solveset(expr, x, S.Reals)
        steps.append(_make_step(
            2, "Genel çözüm kümesi",
            str(general_sol),
            sympy.pretty(general_sol)
        ))
    except Exception:
        steps.append(_make_step(
            2, "Genel çözüm hesaplanamadı, spesifik çözümler deneniyor",
            "", ""
        ))

    # 2. [0, 2π] aralığındaki kökler
    specific_roots = []
    try:
        specific_sol = solveset(expr, x, Interval(0, 2 * pi))
        specific_roots = sorted(_collect_finite_roots(specific_sol), key=lambda r: float(r))
        if not specific_roots and isinstance(specific_sol, ConditionSet):
            specific_roots = _fallback_specific_trig_roots(expr, x, Interval(0, 2 * pi))
    except Exception:
        # Fallback: solve ile dene
        try:
            basic_roots = solve(expr, x)
            for r in basic_roots:
                if r.is_real:
                    val = float(r)
                    if 0 <= val <= 2 * float(pi):
                        specific_roots.append(r)
            specific_roots = sorted(specific_roots, key=lambda r: float(r))
        except Exception:
            pass

    # Derece dönüşümü
    degree_roots = []
    for r in specific_roots:
        try:
            deg_val = simplify(deg(r))
            degree_roots.append({"radian": str(r), "degree": str(deg_val)})
        except Exception:
            degree_roots.append({"radian": str(r), "degree": "hesaplanamadı"})

    if specific_roots:
        steps.append(_make_step(
            len(steps) + 1,
            "[0, 2π] aralığındaki kökler",
            str(specific_roots),
            ", ".join([f"x = {r} ({d.get('degree', '?')}°)" for r, d in zip(specific_roots, degree_roots)])
        ))
    else:
        steps.append(_make_step(
            len(steps) + 1,
            "[0, 2π] aralığındaki kökler",
            "[]", "Bu aralıkta kök bulunamadı"
        ))

    # Özet
    steps.append(_make_step(
        len(steps) + 1,
        "Trigonometrik çözüm tamamlandı",
        str({"general": str(general_sol), "specific_0_2pi": [str(r) for r in specific_roots]}),
        f"Genel Çözüm: {general_sol}\n[0°, 360°]: {', '.join([d.get('degree', '?') + '°' for d in degree_roots]) if degree_roots else 'Kök yok'}"
    ))

    return str({"general_solution": str(general_sol), "roots_0_2pi": degree_roots}), steps
