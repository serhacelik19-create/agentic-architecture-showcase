"""
Ters Doğrulama (Reverse Verification) — Çözüm kontrolü.

Gemini'nin kurduğu denklemi ve Python'un bulduğu sonucu
orijinal problem cümlesiyle karşılaştırarak doğrular.
"""

import sympy
from sympy import symbols, sympify, simplify

from normalizer import safe_sympify


def verify_solution(original_problem: str, equation: str, solution: str):
    """
    Çözümü denkleme geri yerine koyarak doğrular.

    equation: SymPy formatında denklem (sol taraf - sağ taraf)
    solution: "{x: 10}" veya "[2, 3]" veya "10" veya "y = 2*x" formatında
    """
    del original_problem

    equation_str = str(equation or "").strip()
    solution_str = str(solution or "").strip()

    if not equation_str:
        return _error_response(
            "MISSING_EQUATION",
            "Doğrulama için equation alanı boş.",
            hint="verify_equation çağrısında equation alanına çözülen denklemi gönder."
        )

    if not solution_str:
        return _error_response(
            "MISSING_SOLUTION",
            "Doğrulama için solution alanı boş.",
            hint="Çözümü makinece okunabilir sade formatta gönder."
        )

    try:
        parsed_eq = _parse_equation_payload(equation_str)
    except Exception as exc:
        return _error_response(
            "INVALID_EQUATION",
            f"Equation parse edilemedi: {exc}",
            hint="Equation alanını SymPy uyumlu tek bir denklem/fark ifadesi olarak gönder."
        )

    if isinstance(parsed_eq, (list, tuple)):
        return _verify_equation_system(parsed_eq, solution_str)

    assignment_mapping = _maybe_parse_assignment_mapping(solution_str)
    if assignment_mapping is not None:
        parsed_solution = assignment_mapping
    else:
        if _looks_like_equation_solution(solution_str):
            return _verify_equation_form(parsed_eq, solution_str)

        if not getattr(parsed_eq, "free_symbols", set()):
            return _error_response(
                "NON_SYMBOLIC_EQUATION",
                "Doğrulanacak equation serbest değişken içermiyor; çözüm yerine koyma anlamsız.",
                hint="verify_equation için serbest değişken içeren denklem kullan veya trigde yalnızca sonlu kök listesini doğrula."
            )

        try:
            parsed_solution = _parse_solution_payload(solution_str)
        except Exception as exc:
            return _error_response(
                "UNPARSABLE_SOLUTION",
                f"Çözüm formatı parse edilemedi: {exc}",
                hint="Çözümü '10', '[2, 3]', '{x: 5, y: 3}' veya 'y = 2*x' gibi sade formatta gönder."
            )

    try:
        default_symbol = _select_default_symbol(parsed_eq, parsed_solution)
        verification_results = []

        for candidate in _iter_candidates(parsed_solution):
            verification_results.append(_verify_candidate(parsed_eq, candidate, default_symbol))

        all_verified = bool(verification_results) and all(v.get("is_zero", False) for v in verification_results)
        return {
            "status": "success",
            "is_verified": all_verified,
            "details": verification_results,
            "message": "✅ Çözüm doğrulandı!" if all_verified
                       else "❌ Çözüm doğrulanamadı! Denklem yanlış kurulmuş olabilir."
        }
    except ValueError as exc:
        return _error_response(
            "AMBIGUOUS_SOLUTION",
            str(exc),
            hint="Birden fazla değişken varsa çözümü '{x: 5, y: 3}' biçiminde açık mapping olarak gönder."
        )
    except Exception as exc:
        return _error_response(
            "VERIFY_RUNTIME_ERROR",
            f"Doğrulama çalıştırılırken hata oluştu: {exc}"
        )


def _error_response(code: str, message: str, hint=None, details=None):
    payload = {
        "status": "error",
        "code": code,
        "message": message,
    }
    if hint:
        payload["hint"] = hint
    if details:
        payload["details"] = details
    return payload


def _looks_like_equation_solution(solution_str: str) -> bool:
    stripped = solution_str.strip()
    if "=" not in stripped:
        return False
    if stripped.startswith("{") or stripped.startswith("["):
        return False
    return True


def _split_balanced_csv(raw: str):
    parts = []
    current = []
    depth = 0
    openers = {"(", "[", "{"}
    closers = {")", "]", "}"}

    for char in raw:
        if char in openers:
            depth += 1
        elif char in closers and depth > 0:
            depth -= 1

        if char == "," and depth == 0:
            piece = "".join(current).strip()
            if piece:
                parts.append(piece)
            current = []
            continue

        current.append(char)

    tail = "".join(current).strip()
    if tail:
        parts.append(tail)
    return parts


def _parse_equation_payload(equation_str: str):
    try:
        return safe_sympify(equation_str)
    except Exception:
        parts = _split_balanced_csv(equation_str)
        if len(parts) <= 1:
            raise
        return [safe_sympify(part) for part in parts]


def _maybe_parse_assignment_mapping(solution_str: str):
    parts = _split_balanced_csv(solution_str)
    if not parts or not all("=" in part for part in parts):
        return None

    parsed = {}
    for part in parts:
        left, right = part.split("=", 1)
        name = left.strip()
        rhs = right.strip()
        if not name or not rhs:
            return None
        rhs_expr = safe_sympify(rhs)
        if getattr(rhs_expr, "free_symbols", set()):
            return None
        sym = symbols(name)
        if sym in parsed:
            return None
        parsed[sym] = rhs_expr
    return parsed or None


def _parse_solution_payload(solution_str: str):
    try:
        parsed = safe_sympify(solution_str)
    except Exception:
        parsed = sympify(solution_str)

    if isinstance(parsed, tuple):
        return list(parsed)
    if isinstance(parsed, set):
        return list(parsed)
    if isinstance(parsed, sympy.FiniteSet):
        return list(parsed)
    return parsed


def _iter_candidates(parsed_solution):
    if isinstance(parsed_solution, list):
        return parsed_solution
    return [parsed_solution]


def _verify_equation_system(equations, solution_str: str):
    parsed_solution = _maybe_parse_assignment_mapping(solution_str)
    if parsed_solution is None:
        try:
            parsed_solution = _parse_solution_payload(solution_str)
        except Exception as exc:
            return _error_response(
                "UNPARSABLE_SOLUTION",
                f"Sistem çözümü parse edilemedi: {exc}",
                hint="Sistem çözümünü '{x: 5, y: 3}' veya '[{x: 5, y: 3}]' biçiminde gönder."
            )

    candidates = _iter_candidates(parsed_solution)
    details = []

    for candidate in candidates:
        if not isinstance(candidate, dict):
            return _error_response(
                "AMBIGUOUS_SOLUTION",
                "Denklem sistemi için açık değişken eşlemesi gerekli.",
                hint="Sistem çözümünü '{x: 5, y: 3}' biçiminde gönder."
            )

        substitutions = {}
        for key, value in candidate.items():
            sym = key if getattr(key, "is_Symbol", False) else symbols(str(key))
            substitutions[sym] = sympify(value)

        equation_results = []
        for equation in equations:
            substituted = simplify(equation.subs(substitutions))
            equation_results.append({
                "equation": str(equation),
                "substitution_result": str(substituted),
                "is_zero": _check_zero(substituted),
            })

        details.append({
            "candidate": str(candidate),
            "equations": equation_results,
            "is_zero": all(item["is_zero"] for item in equation_results),
        })

    all_verified = bool(details) and all(item["is_zero"] for item in details)
    return {
        "status": "success",
        "is_verified": all_verified,
        "details": details,
        "message": "✅ Çözüm doğrulandı!" if all_verified
                   else "❌ Çözüm doğrulanamadı! Denklem sistemi sağlanmıyor."
    }


def _select_default_symbol(parsed_eq, parsed_solution):
    if isinstance(parsed_solution, dict):
        return None

    free_symbols = sorted(parsed_eq.free_symbols, key=lambda item: str(item))
    if len(free_symbols) == 1:
        return free_symbols[0]

    if len(free_symbols) > 1:
        raise ValueError("Tek bir sayısal değer, çok değişkenli denklem için yeterli değil.")

    return symbols('x')


def _verify_equation_form(parsed_eq, solution_str: str):
    if not getattr(parsed_eq, "free_symbols", set()):
        return _error_response(
            "NON_SYMBOLIC_EQUATION",
            "Doğrulanacak equation serbest değişken içermiyor; denklem eşdeğerliği kontrolü anlamsız.",
            hint="verify_equation için serbest değişken içeren denklem kullan."
        )

    try:
        candidate_eq = safe_sympify(solution_str)
    except Exception as exc:
        return _error_response(
            "UNPARSABLE_SOLUTION",
            f"Denklem biçimindeki çözüm parse edilemedi: {exc}",
            hint="Çözümü 'y = 2*x' gibi tek bir denklem ya da '{x: 5, y: 3}' gibi mapping olarak gönder."
        )

    reference = simplify(parsed_eq)
    candidate = simplify(candidate_eq)
    difference = simplify(reference - candidate)
    is_verified = _are_equivalent_zero_forms(reference, candidate, difference)

    return {
        "status": "success",
        "is_verified": is_verified,
        "details": [{
            "equation": str(reference),
            "candidate": str(candidate),
            "difference": str(difference),
            "is_zero": is_verified,
        }],
        "message": "✅ Denklem eşdeğerliği doğrulandı!" if is_verified
                   else "❌ Verilen denklem, beklenen denklemle eşdeğer değil."
    }


def _are_equivalent_zero_forms(reference, candidate, difference):
    if _check_zero(difference):
        return True

    try:
        ratio = simplify(reference / candidate)
    except Exception:
        return False

    if getattr(ratio, "free_symbols", set()):
        return False
    if not getattr(ratio, "is_number", False):
        return False
    return not _check_zero(ratio)


def _verify_candidate(parsed_eq, candidate, default_symbol):
    if isinstance(candidate, dict):
        substitutions = {}
        readable_items = []
        for key, value in candidate.items():
            sym = key if getattr(key, "is_Symbol", False) else symbols(str(key))
            value_num = sympify(value)
            substitutions[sym] = value_num
            readable_items.append(f"{sym}={value_num}")

        substituted = simplify(parsed_eq.subs(substitutions))
        return {
            "variable": ", ".join(readable_items),
            "value": str(candidate),
            "substitution_result": str(substituted),
            "is_zero": _check_zero(substituted),
        }

    if default_symbol is None:
        raise ValueError("Bu çözüm tipi için açık değişken eşlemesi gerekli.")

    value_num = sympify(candidate)
    substituted = simplify(parsed_eq.subs(default_symbol, value_num))
    return {
        "variable": str(default_symbol),
        "value": str(value_num),
        "substitution_result": str(substituted),
        "is_zero": _check_zero(substituted),
    }


def _check_zero(value):
    """Değerin sıfır (veya sıfıra çok yakın) olup olmadığını kontrol eder."""
    if value == 0:
        return True
    if getattr(value, "is_number", False):
        try:
            return abs(complex(value)) < 1e-10
        except Exception:
            return False
    return False
