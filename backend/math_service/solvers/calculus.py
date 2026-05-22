"""
Kalkülüs Çözücü — Türev, İntegral, Limit.

- Sağdan/soldan limit karşılaştırması
- Belirli integral desteği
- Leibniz integral kuralı farkındalığı
"""

import sympy
from sympy import (
    symbols, diff, integrate, limit, simplify, expand,
    oo, pi, S, Rational, Abs, Piecewise,
)


def _make_step(step_num, description, expression, readable=None):
    return {
        "step": step_num,
        "description": description,
        "expression": str(expression),
        "readable": readable if readable else (
            sympy.pretty(expression) if not isinstance(expression, str) else str(expression)
        ),
    }


def derivative_with_steps(expr, variable):
    """Türevi adım adım alır."""
    x = variable
    steps = []

    steps.append(_make_step(1, "Orijinal fonksiyon: f(x)", expr))

    # Sadeleştir (varsa)
    simplified = simplify(expr)
    if simplified != expr:
        steps.append(_make_step(2, "Fonksiyon sadeleştirildi", simplified))

    # Türev al
    result = diff(expr, x)
    steps.append(_make_step(len(steps) + 1, f"f'(x) = d/d{x} türevi alındı", result))

    # Türevi sadeleştir
    result_simplified = simplify(result)
    if result_simplified != result:
        steps.append(_make_step(len(steps) + 1, "Türev sonucu sadeleştirildi", result_simplified))
        result = result_simplified

    return result, steps


def integrate_with_steps(expr, variable, lower=None, upper=None):
    """
    İntegrali adım adım alır.
    lower/upper verilmişse belirli integral hesaplar.
    """
    x = variable
    steps = []

    steps.append(_make_step(1, "Orijinal fonksiyon: f(x)", expr))

    if lower is not None and upper is not None:
        # Belirli integral
        result = integrate(expr, (x, lower, upper))
        steps.append(_make_step(
            2,
            f"∫[{lower}, {upper}] f({x})d{x} belirli integrali hesaplandı",
            result
        ))

        result_simplified = simplify(result)
        if result_simplified != result:
            steps.append(_make_step(len(steps) + 1, "Sonuç sadeleştirildi", result_simplified))
            result = result_simplified

        return result, steps
    else:
        # Belirsiz integral
        result = integrate(expr, x)
        steps.append(_make_step(
            2,
            f"∫f({x})d{x} integrali alındı",
            result
        ))

        result_simplified = simplify(result)
        if result_simplified != result:
            steps.append(_make_step(len(steps) + 1, "İntegral sonucu sadeleştirildi", result_simplified))
            result = result_simplified

        steps.append(_make_step(
            len(steps) + 1,
            "Belirsiz integral sabiti eklendi",
            str(result) + " + C",
            str(result) + " + C"
        ))

        return result, steps


def limit_with_steps(expr, variable, point):
    """
    Limiti hesaplar — sağdan ve soldan karşılaştırma yapar.
    point: SymPy ifadesi (oo, -oo, pi, 0, vb.) veya (nokta, yön) tuple'ı
    """
    x = variable
    steps = []
    direction = None

    if isinstance(point, tuple):
        point, direction = point

    steps.append(_make_step(1, "Orijinal ifade", expr))

    # Sonsuzluk limitinde tek yönlü hesap yeterli
    if point in (oo, -oo) and direction is None:
        result = limit(expr, x, point)
        steps.append(_make_step(
            2,
            f"lim({x} → {point}) hesaplandı",
            result
        ))
        return result, steps

    if direction in ('+', '-'):
        result = limit(expr, x, point, dir=direction)
        direction_text = 'sağdan' if direction == '+' else 'soldan'
        steps.append(_make_step(
            2,
            f"lim({x} → {point}) {direction_text} hesaplandı",
            result,
            f"{direction_text.title()} limit: {result}"
        ))
        return result, steps

    # Sağdan ve soldan limit
    try:
        lim_right = limit(expr, x, point, dir='+')
        lim_left = limit(expr, x, point, dir='-')
    except Exception:
        # Tek yönlü limit hesaplanamıyorsa düz limit dene
        result = limit(expr, x, point)
        steps.append(_make_step(2, f"lim({x} → {point}) hesaplandı", result))
        return result, steps

    if lim_right == lim_left:
        result = lim_right
        steps.append(_make_step(
            2,
            f"lim({x} → {point}) sağdan ve soldan eşit",
            result,
            f"Sağdan limit: {lim_right}\nSoldan limit: {lim_left}\nSonuç: {result}"
        ))
    else:
        result = f"Limit Yoktur (Sağdan: {lim_right}, Soldan: {lim_left})"
        steps.append(_make_step(
            2,
            f"lim({x} → {point}) — sağdan ve soldan limitler farklı",
            result,
            f"Sağdan limit: {lim_right}\nSoldan limit: {lim_left}\nSonuç: Limit yoktur!"
        ))

    return result, steps
