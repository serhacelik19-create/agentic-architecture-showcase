"""
Lineer Cebir Çözücü — Denklem sistemi, matris işlemleri.
"""

import sympy
from sympy import symbols, solve, simplify, Matrix, sympify, factorial

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from normalizer import safe_sympify


def _make_step(step_num, description, expression, readable=None):
    return {
        "step": step_num,
        "description": description,
        "expression": str(expression),
        "readable": readable if readable else (
            sympy.pretty(expression) if not isinstance(expression, str) else str(expression)
        ),
    }


def _split_balanced(s, delimiter=','):
    """Parantez içindeki delimeter'ları görmezden gelerek ayırır."""
    parts = []
    bracket_level = 0
    current = []
    for char in s:
        if char == '(':
            bracket_level += 1
        elif char == ')':
            bracket_level -= 1
        
        if char == delimiter and bracket_level == 0:
            parts.append("".join(current).strip())
            current = []
        else:
            current.append(char)
    parts.append("".join(current).strip())
    return [p for p in parts if p]


def _infer_variable_names(equations):
    names = set()
    for equation in equations:
        names.update(str(symbol) for symbol in getattr(equation, "free_symbols", set()))
    return sorted(names)


def _should_reinfer_variables(requested_names, inferred_names):
    if not inferred_names:
        return False
    if not requested_names:
        return True

    requested_set = set(requested_names)
    inferred_set = set(inferred_names)

    if requested_set == {"x"} and inferred_set != {"x"}:
        return True
    if len(requested_names) < len(inferred_names):
        return True
    if requested_set != inferred_set and not inferred_set.issubset(requested_set):
        return True
    return False


def _ensure_symbol_list(var_names):
    if not var_names:
        return []
    raw = symbols(var_names)
    if isinstance(raw, (tuple, list)):
        return list(raw)
    return [raw]


def _verify_system_solution(equations, solution_map):
    try:
        for equation in equations:
            substituted = simplify(equation.subs(solution_map))
            if substituted != 0:
                if substituted.is_number:
                    if abs(complex(substituted)) >= 1e-10:
                        return False
                else:
                    return False
        return True
    except Exception:
        return False


def solve_system_with_steps(equations_str: str, variables_str: str):
    """
    Çok bilinmeyenli denklem sistemi çözücü.
    equations_str: Virgülle ayrılmış denklemler (her biri = 0 formatında)
    variables_str: Virgülle ayrılmış değişken isimleri
    """
    steps = []
    requested_var_names = [v.strip() for v in (variables_str or "").split(',') if v.strip()]

    # Denklemleri parse et (Dengeli ayırıcı kullanarak)
    eq_strs = _split_balanced(equations_str)
    equations = [safe_sympify(e, extra_vars=requested_var_names or None) for e in eq_strs]
    inferred_var_names = _infer_variable_names(equations)

    var_names = inferred_var_names if _should_reinfer_variables(requested_var_names, inferred_var_names) else requested_var_names
    var_symbols = _ensure_symbol_list(var_names)

    if requested_var_names != var_names:
        steps.append(_make_step(
            1,
            "Bilinmeyenler ifadeden yeniden çıkarıldı",
            f"{requested_var_names} -> {var_names}",
            ", ".join(var_names)
        ))

    steps.append(_make_step(
        len(steps) + 1,
        f"{len(equations)} denklem, {len(var_symbols)} bilinmeyen",
        str(eq_strs),
        "\n".join([f"  {i + 1}) {e} = 0" for i, e in enumerate(eq_strs)])
    ))

    raw_solution = solve(equations, var_symbols, dict=True)
    solution_list = raw_solution if isinstance(raw_solution, list) else ([raw_solution] if raw_solution else [])
    verified_solutions = [sol for sol in solution_list if _verify_system_solution(equations, sol)]

    if solution_list and not verified_solutions:
        steps.append(_make_step(
            len(steps) + 1,
            "Bulunan çözümler doğrulamadan geçmedi",
            str(solution_list),
            "Çözüm adayları denklemlere geri konduğunda sistemi sağlamadı."
        ))
        return "[]", steps

    if verified_solutions:
        sol = verified_solutions[0] if len(verified_solutions) == 1 else verified_solutions
        first_solution = verified_solutions[0]
        readable_parts = [f"{k} = {v}" for k, v in first_solution.items()]
        steps.append(_make_step(
            len(steps) + 1, "Denklem sistemi çözüldü ve doğrulandı",
            str(sol), ", ".join(readable_parts)
        ))
    else:
        steps.append(_make_step(
            len(steps) + 1, "Çözüm bulunamadı",
            "Ø", "Sistem çözümsüz veya sonsuz çözümlü."
        ))

    return str(verified_solutions), steps


def matrix_operations(matrix_str: str, action: str):
    """
    Matris işlemleri: determinant, inverse, eigenvalues, rank, rref.
    """
    steps = []

    m = Matrix(sympify(matrix_str))
    steps.append(_make_step(
        1, f"Matris ({m.rows}x{m.cols})",
        str(m.tolist()), sympy.pretty(m)
    ))

    if action == "determinant":
        det = m.det()
        steps.append(_make_step(2, "Determinant hesaplandı", str(det), f"det(A) = {det}"))
        return str(det), steps

    elif action == "inverse":
        if m.det() == 0:
            steps.append(_make_step(
                2, "Matrisin tersi yok (det = 0)",
                "Yok", "Determinant = 0 → Tekil matris, ters yok."
            ))
            return "Tekil matris, ters yok", steps
        inv = m.inv()
        steps.append(_make_step(2, "Ters matris", str(inv.tolist()), sympy.pretty(inv)))
        return str(inv.tolist()), steps

    elif action == "eigenvalues":
        eigenvals = m.eigenvals()
        readable = ", ".join([f"λ = {val} (katlılık: {mult})" for val, mult in eigenvals.items()])
        steps.append(_make_step(2, "Özdeğerler", str(eigenvals), readable))
        return str(eigenvals), steps

    elif action == "rank":
        r = m.rank()
        steps.append(_make_step(2, f"Rank: {r}", str(r), f"rank(A) = {r}"))
        return str(r), steps

    elif action == "rref":
        rref, pivots = m.rref()
        steps.append(_make_step(2, "Satır indirgenmiş eşelon formu (RREF)", str(rref.tolist()), sympy.pretty(rref)))
        return str(rref.tolist()), steps

    return "Bilinmeyen matris işlemi", steps
