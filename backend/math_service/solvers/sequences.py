"""
Dizi/Seri Çözücü — Aritmetik ve geometrik diziler, toplam formülleri.

YKS'de sıkça çıkan dizi-seri konuları:
- Aritmetik dizi: a_n = a_1 + (n-1)d
- Geometrik dizi: a_n = a_1 * r^(n-1)
- Toplam formülleri
- Genel terim bulma
"""

import sympy
from sympy import symbols, Rational, simplify, Sum, oo, S, solve, sympify


def _make_step(step_num, description, expression, readable=None):
    return {
        "step": step_num,
        "description": description,
        "expression": str(expression),
        "readable": readable if readable else str(expression),
    }


def sequences_with_steps(seq_type: str, params: dict):
    """
    Dizi/seri işlemleri.

    seq_type: "arithmetic_nth", "arithmetic_sum", "geometric_nth", "geometric_sum", "geometric_infinite_sum"
    params: a1, d, r, n (gerekli olanlar)
    """
    steps = []

    if seq_type == "arithmetic_nth":
        a1 = sympify(params.get("a1", 0))
        d = sympify(params.get("d", 0))
        n = sympify(params.get("n", 1))
        result = a1 + (n - 1) * d
        result = simplify(result)
        steps.append(_make_step(
            1,
            f"Aritmetik dizi: a₁ = {a1}, d = {d}",
            f"a_n = a₁ + (n-1)·d = {a1} + ({n}-1)·{d}",
        ))
        steps.append(_make_step(2, f"a_{n} = {result}", str(result)))
        return str(result), steps

    elif seq_type == "arithmetic_sum":
        a1 = sympify(params.get("a1", 0))
        d = sympify(params.get("d", 0))
        n = sympify(params.get("n", 1))
        an = a1 + (n - 1) * d
        result = n * (a1 + an) / 2
        result = simplify(result)
        steps.append(_make_step(
            1,
            f"Aritmetik dizi toplamı: a₁ = {a1}, d = {d}, n = {n}",
            f"S_n = n·(a₁ + aₙ)/2 = {n}·({a1} + {an})/2",
        ))
        steps.append(_make_step(2, f"S_{n} = {result}", str(result)))
        return str(result), steps

    elif seq_type == "geometric_nth":
        a1 = sympify(params.get("a1", 1))
        r = sympify(params.get("r", 1))
        n = sympify(params.get("n", 1))
        result = a1 * r ** (n - 1)
        result = simplify(result)
        steps.append(_make_step(
            1,
            f"Geometrik dizi: a₁ = {a1}, r = {r}",
            f"a_n = a₁·r^(n-1) = {a1}·{r}^({n}-1)",
        ))
        steps.append(_make_step(2, f"a_{n} = {result}", str(result)))
        return str(result), steps

    elif seq_type == "geometric_sum":
        a1 = sympify(params.get("a1", 1))
        r = sympify(params.get("r", 1))
        n = sympify(params.get("n", 1))
        if r == 1:
            result = a1 * n
        else:
            result = a1 * (1 - r ** n) / (1 - r)
        result = simplify(result)
        steps.append(_make_step(
            1,
            f"Geometrik dizi toplamı: a₁ = {a1}, r = {r}, n = {n}",
            f"S_n = a₁·(1-rⁿ)/(1-r)",
        ))
        steps.append(_make_step(2, f"S_{n} = {result}", str(result)))
        return str(result), steps

    elif seq_type == "geometric_infinite_sum":
        a1 = sympify(params.get("a1", 1))
        r = sympify(params.get("r", Rational(1, 2)))
        if abs(r) >= 1:
            steps.append(_make_step(1, "Sonsuz toplam ıraksıyor (|r| ≥ 1)", "∞"))
            return "Iraksak (Toplam yok)", steps
        result = a1 / (1 - r)
        result = simplify(result)
        steps.append(_make_step(
            1,
            f"Sonsuz geometrik seri: a₁ = {a1}, r = {r}, |r| < 1",
            f"S_∞ = a₁/(1-r) = {a1}/(1-{r})",
        ))
        steps.append(_make_step(2, f"S_∞ = {result}", str(result)))
        return str(result), steps

    return "Bilinmeyen dizi/seri işlemi", steps
