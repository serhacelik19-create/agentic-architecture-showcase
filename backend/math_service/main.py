"""
YKS Math Solver Service v3.0 — Modüler SymPy Motoru

FastAPI app + 3 endpoint:
- POST /calculate — Ana hesaplama (18 action türü)
- POST /verify    — Ters doğrulama
- POST /validate-geometry — Geometrik tutarlılık kontrolü
- GET  /health    — Sağlık kontrolü

API kontratı ai.service.js ile %100 uyumlu.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Any
import json
import re
import sympy
from sympy import symbols, sympify, simplify, oo, pi, S

# === Kendi modüllerimiz ===
from normalizer import safe_sympify
from solvers.algebra import solve_with_steps, simplify_expr, factor_expr, expand_expr
from solvers.calculus import derivative_with_steps, integrate_with_steps, limit_with_steps
from solvers.analysis import (
    analyze_roots_with_steps,
    find_extrema_with_steps,
    analyze_asymptotes_with_steps,
    area_between_curves_with_steps,
    analyze_derivative_with_steps,
)
from solvers.trigonometry import trig_general_solution_with_steps
from solvers.linear_algebra import solve_system_with_steps, matrix_operations
from solvers.geometry import coordinate_geometry_with_steps, validate_geometry
from solvers.combinatorics import combinatorics_with_steps, solve_discrete_counting
from solvers.sequences import sequences_with_steps
from plotting import generate_plot, PLOT_AVAILABLE
from verification import verify_solution


# ============================================================
# APP
# ============================================================
app = FastAPI(title="YKS Math Solver Service v3.0")


# ============================================================
# MODELLER
# ============================================================
class MathRequest(BaseModel):
    expression: Optional[str] = None
    action: str = "solve"
    variable: Optional[str] = None
    limit_point: Optional[str] = None
    lower: Optional[str] = None
    upper: Optional[str] = None
    equations: Optional[List[str]] = None
    variables: Optional[List[str]] = None
    matrix: Optional[Any] = None
    matrix_action: Optional[str] = None
    params: Optional[dict] = None
    extra: Optional[dict] = {}


class VerifyRequest(BaseModel):
    original_problem: str
    equation: str
    solution: str


class GeometryValidateRequest(BaseModel):
    shape: str
    sides: Optional[List[float]] = None
    angles: Optional[List[float]] = None
    area: Optional[float] = None
    perimeter: Optional[float] = None
    height: Optional[float] = None
    radius: Optional[float] = None
    base: Optional[float] = None


# ============================================================
# SYMPY GELİŞMİŞ FALLBACK MOTORU
# ============================================================
def _advanced_fallback(expr_str: str, var):
    """Standart çözüm başarısız olduğunda alternatif stratejiler."""
    from sympy import solve, solveset, factor, expand, cancel, trigsimp
    strategies = [
        ("trigsimp+solve", lambda e, v: solve(trigsimp(e), v)),
        ("solveset(Reals)", lambda e, v: list(solveset(e, v, S.Reals))),
        ("solveset(Complexes)", lambda e, v: list(solveset(e, v, S.Complexes))),
        ("factor+solve", lambda e, v: solve(factor(e), v)),
        ("expand+solve", lambda e, v: solve(expand(e), v)),
        ("cancel+solve", lambda e, v: solve(cancel(e), v)),
    ]

    for name, strategy in strategies:
        try:
            expr = safe_sympify(expr_str)
            result = strategy(expr, var)
            if result and str(result) not in ['[]', 'EmptySet', 'set()']:
                return str(result), name
        except Exception:
            continue

    return None, None


GEOMETRY_OPERATION_KEYS = {
    "distance",
    "midpoint",
    "line_equation",
    "circle_line_intersection",
    "point_to_line_distance",
}


def _error_response(code: str, message: str, *, hint: Optional[str] = None, details: Optional[dict] = None):
    payload = {
        "status": "error",
        "code": code,
        "message": message,
        "engine": "failed",
    }
    if hint:
        payload["hint"] = hint
    if details:
        payload["details"] = details
    return payload


def _split_balanced_csv(raw: Optional[str]) -> List[str]:
    if not raw:
        return []

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


def _looks_like_assignment_list(expr: Optional[str]) -> bool:
    parts = _split_balanced_csv(expr)
    if len(parts) < 2:
        return False
    return all(re.match(r"^[A-Za-z_][A-Za-z0-9_]*\s*=", part) for part in parts)


def _infer_variables_from_equations(equations: List[str]) -> List[str]:
    names = set()
    for equation in equations:
        parsed = safe_sympify(equation)
        names.update(str(symbol) for symbol in getattr(parsed, "free_symbols", set()))
    return sorted(names)


def _should_infer_variables(explicit_variables: List[str], inferred_variables: List[str]) -> bool:
    if not inferred_variables:
        return False
    if not explicit_variables:
        return True

    explicit_set = set(explicit_variables)
    inferred_set = set(inferred_variables)

    if explicit_set == {"x"} and inferred_set != {"x"}:
        return True
    if len(explicit_variables) < len(inferred_variables):
        return True
    if explicit_set != inferred_set and not inferred_set.issubset(explicit_set):
        return True
    return False


def _normalize_request(request: MathRequest):
    action = (request.action or "solve").strip()
    expression = request.expression.strip() if isinstance(request.expression, str) and request.expression.strip() else None
    variable = request.variable.strip() if isinstance(request.variable, str) and request.variable.strip() else None

    normalized = {
        "action": action,
        "expression": expression,
        "variable": variable,
        "limit_point": request.limit_point,
        "lower": request.lower,
        "upper": request.upper,
    }

    if action == "solve_system":
        equations = [eq.strip() for eq in (request.equations or []) if isinstance(eq, str) and eq.strip()]
        if not equations and expression:
            equations = _split_balanced_csv(expression)
        if not equations:
            return None, _error_response(
                "MISSING_EQUATIONS",
                "solve_system için denklem listesi bulunamadı.",
                hint="equations alanını dizi olarak ya da expression alanını virgülle ayrılmış denklemler olarak gönder."
            )

        explicit_variables = [var.strip() for var in (request.variables or []) if isinstance(var, str) and var.strip()]
        if not explicit_variables and variable:
            explicit_variables = [var.strip() for var in variable.split(",") if var.strip()]

        try:
            inferred_variables = _infer_variables_from_equations(equations)
        except Exception as exc:
            return None, _error_response(
                "PARSE_ERROR",
                f"Denklem sistemi ayrıştırılamadı: {exc}",
                hint="Denklemleri ayrı string'ler olarak gönder ve SymPy formatını koru."
            )

        active_variables = inferred_variables if _should_infer_variables(explicit_variables, inferred_variables) else explicit_variables
        if not active_variables:
            return None, _error_response(
                "MISSING_VARIABLES",
                "Denklem sistemindeki bilinmeyenler belirlenemedi.",
                hint="variables alanını açıkça gönder veya denklemlerde değişkenleri net yaz."
            )

        normalized["expression"] = ", ".join(equations)
        normalized["variable"] = ",".join(active_variables)
        normalized["equations"] = equations
        normalized["variables"] = active_variables
        return normalized, None

    if action == "solve_geometry":
        normalized["params"] = request.params or {}
        return normalized, None

    if action == "matrix":
        if expression is None and request.matrix is not None:
            expression = request.matrix if isinstance(request.matrix, str) else json.dumps(request.matrix)
        if variable is None and isinstance(request.matrix_action, str) and request.matrix_action.strip():
            variable = request.matrix_action.strip()
        if not expression:
            return None, _error_response(
                "MISSING_MATRIX",
                "matrix işlemi için matris verisi bulunamadı.",
                hint="matrix alanını dizi olarak ya da expression alanını matris string'i olarak gönder."
            )
        normalized["expression"] = expression
        normalized["variable"] = variable or "determinant"
        return normalized, None

    if action == "coordinate_geometry":
        normalized_params = dict(request.params or {})
        if not variable:
            nested_geometry_key = next(
                (
                    key for key, value in normalized_params.items()
                    if key in GEOMETRY_OPERATION_KEYS and isinstance(value, dict)
                ),
                None,
            )
            if nested_geometry_key:
                variable = nested_geometry_key
                normalized_params = dict(normalized_params[nested_geometry_key] or {})

        if isinstance(normalized_params.get("type"), str) and not variable:
            variable = normalized_params["type"].strip()

        if isinstance(normalized_params.get("p1"), list) and len(normalized_params["p1"]) >= 2:
            normalized_params["x1"] = normalized_params["p1"][0]
            normalized_params["y1"] = normalized_params["p1"][1]
            normalized_params.pop("p1", None)

        if isinstance(normalized_params.get("point1"), list) and len(normalized_params["point1"]) >= 2:
            normalized_params["x1"] = normalized_params["point1"][0]
            normalized_params["y1"] = normalized_params["point1"][1]
            normalized_params.pop("point1", None)

        if isinstance(normalized_params.get("p2"), list) and len(normalized_params["p2"]) >= 2:
            normalized_params["x2"] = normalized_params["p2"][0]
            normalized_params["y2"] = normalized_params["p2"][1]
            normalized_params.pop("p2", None)

        if isinstance(normalized_params.get("point2"), list) and len(normalized_params["point2"]) >= 2:
            normalized_params["x2"] = normalized_params["point2"][0]
            normalized_params["y2"] = normalized_params["point2"][1]
            normalized_params.pop("point2", None)

        if isinstance(normalized_params.get("point"), list) and len(normalized_params["point"]) >= 2:
            normalized_params["x0"] = normalized_params["point"][0]
            normalized_params["y0"] = normalized_params["point"][1]
            normalized_params.pop("point", None)

        if (
            not variable
            and {"a", "b", "c"}.issubset(normalized_params.keys())
            and (
                {"x0", "y0"}.issubset(normalized_params.keys())
                or {"x1", "y1"}.issubset(normalized_params.keys())
            )
        ):
            variable = "point_to_line_distance"

        if (
            variable == "point_to_line_distance"
            and ("x0" not in normalized_params or "y0" not in normalized_params)
            and {"x1", "y1"}.issubset(normalized_params.keys())
        ):
            normalized_params["x0"] = normalized_params["x1"]
            normalized_params["y0"] = normalized_params["y1"]
            normalized_params.pop("x1", None)
            normalized_params.pop("y1", None)

        normalized_params.pop("type", None)

        if expression is None and normalized_params:
            expression = json.dumps(normalized_params)
        if not expression:
            return None, _error_response(
                "MISSING_GEOMETRY_PARAMS",
                "coordinate_geometry için parametre bulunamadı.",
                hint="params alanını nesne olarak ya da expression alanını JSON string olarak gönder."
            )
        if not variable:
            # v2/Unified desteği: Eğer 'points' veya 'constraints' varsa variable 'unified' olarak atanabilir.
            if "points" in normalized_params or "constraints" in normalized_params:
                variable = "unified"
            else:
                return None, _error_response(
                    "MISSING_GEOMETRY_OPERATION",
                    "coordinate_geometry için alt işlem belirlenemedi.",
                    hint="variable veya params.type alanına distance, midpoint, line_equation gibi bir değer gönder."
                )
        normalized["expression"] = expression
        normalized["variable"] = variable
        normalized["params"] = normalized_params
        return normalized, None

    if action == "combinatorics":
        if not expression:
            return None, _error_response(
                "MISSING_EXPRESSION",
                "combinatorics işlemi için expression gerekli.",
                hint="expression alanına '10,3' veya '5' gibi bir giriş gönder."
            )

        parts = _split_balanced_csv(expression)
        inferred_variable = variable if variable and variable != "x" else None
        if inferred_variable is None:
            inferred_variable = "factorial" if len(parts) <= 1 else "combination"

        normalized["expression"] = expression
        normalized["variable"] = inferred_variable
        return normalized, None

    if action == "solve" and _looks_like_assignment_list(expression):
        return None, _error_response(
            "INVALID_SOLVE_INPUT",
            "Bu giriş bir denklem değil, değişken atama listesi içeriyor.",
            hint="solve için çözmek istediğin denklemi gönder; denklem sistemi ise solve_system kullan."
        )

    if action not in ["coordinate_geometry"] and not expression:
        return None, _error_response(
            "MISSING_EXPRESSION",
            f"{action} işlemi için expression gerekli.",
            hint="İlgili matematiksel ifadeyi SymPy formatında gönder."
        )

    normalized["expression"] = expression
    normalized["variable"] = variable or "x"
    return normalized, None


def _is_zero_like(value) -> bool:
    if value == 0:
        return True
    if getattr(value, "is_number", False):
        try:
            return abs(complex(value)) < 1e-10
        except Exception:
            return False
    return False


def _auto_verify(action: str, expression: Optional[str], result) -> Optional[dict]:
    if action not in {"solve", "solve_system"} or not expression:
        return None
    if result in (None, [], "[]", "{}"):
        return None

    if action == "solve":
        verification = verify_solution("automatic_check", expression, str(result))
        return verification if verification.get("status") == "success" else None

    try:
        equations = [safe_sympify(item) for item in _split_balanced_csv(expression)]
        parsed_result = sympify(str(result))
        candidates = parsed_result if isinstance(parsed_result, list) else [parsed_result]
        details = []

        for candidate in candidates:
            if not isinstance(candidate, dict):
                return None

            substitutions = {}
            for key, value in candidate.items():
                symbol_key = key if getattr(key, "is_Symbol", False) else symbols(str(key))
                substitutions[symbol_key] = sympify(value)

            per_equation = []
            for equation in equations:
                substituted = simplify(equation.subs(substitutions))
                per_equation.append({
                    "equation": str(equation),
                    "substitution_result": str(substituted),
                    "is_zero": _is_zero_like(substituted),
                })

            details.append({
                "candidate": str(candidate),
                "equations": per_equation,
                "is_zero": all(item["is_zero"] for item in per_equation),
            })

        all_verified = all(item["is_zero"] for item in details)
        return {
            "status": "success",
            "is_verified": all_verified,
            "details": details,
            "message": "✅ Çözüm doğrulandı!" if all_verified
                       else "❌ Çözüm doğrulanamadı! Denklem sistemi sağlanmıyor."
        }
    except Exception:
        return None


# ============================================================
# ANA ENDPOINT: /calculate
# ============================================================
@app.post("/calculate")
async def calculate(request: MathRequest):
    """
    Ana hesaplama endpoint'i.
    18 action türünü destekler, adım adım çözüm döndürür.
    """
    engine_used = "sympy"
    steps = []
    normalized, validation_error = _normalize_request(request)
    if validation_error:
        print(f"[SYMPY VALIDATION] {request.action}: {validation_error['code']} → {validation_error['message']}", flush=True)
        return validation_error

    action = normalized["action"]
    expression = normalized["expression"]
    variable_name = normalized["variable"]

    try:
        var = symbols(variable_name or 'x')
        expr = None
        if action not in ["coordinate_geometry", "sequences", "solve_system", "matrix", "combinatorics", "solve_geometry"]:
            expr = safe_sympify(expression, extra_vars=variable_name)

        result = None

        # ==========================================
        # TEMEL İŞLEMLER
        # ==========================================
        if action == "solve":
            result, steps = solve_with_steps(expr, var)

        elif action == "simplify":
            result, steps = simplify_expr(expr)

        elif action == "derivative":
            result, steps = derivative_with_steps(expr, var)

        elif action == "integrate":
            result, steps = integrate_with_steps(expr, var, normalized["lower"], normalized["upper"])

        elif action == "factor":
            result, steps = factor_expr(expr)

        elif action == "expand":
            result, steps = expand_expr(expr)

        elif action == "limit":
            # Limit noktasını parse et
            limit_pt = _parse_limit_point(normalized["limit_point"])
            result, steps = limit_with_steps(expr, var, limit_pt)

        # ==========================================
        # GELİŞMİŞ ANALİZ
        # ==========================================
        elif action == "analyze_roots":
            result, steps = analyze_roots_with_steps(expr, var)

        elif action == "find_extrema":
            result, steps = find_extrema_with_steps(expr, var)

        elif action == "analyze_asymptotes":
            result, steps = analyze_asymptotes_with_steps(expr, var)

        elif action == "area_between_curves":
            result, steps = area_between_curves_with_steps(expr, var)

        elif action == "analyze_derivative":
            result, steps = analyze_derivative_with_steps(expr, var)

        elif action == "trig_general_solution":
            result, steps = trig_general_solution_with_steps(expr, var)

        # ==========================================
        # LİNEER CEBİR
        # ==========================================
        elif action == "solve_system":
            result, steps = solve_system_with_steps(expression, variable_name)

        elif action == "matrix":
            result, steps = matrix_operations(expression, variable_name or "determinant")

        # ==========================================
        # KOORDİNAT GEOMETRİSİ
        # ==========================================
        elif action == "coordinate_geometry":
            params = json.loads(expression)
            sub_action = variable_name
            result, steps = coordinate_geometry_with_steps(sub_action, params)

        # ==========================================
        # YAPILANDIRILMIŞ GEOMETRİ (v3.0)
        # ==========================================
        elif action == "solve_geometry":
            params = normalized.get("params", {})
            result_data = solve_geometry_structured(
                params.get("shapes", []),
                params.get("shared_sides", []),
                params.get("constraints", [])
            )
            if result_data.get("status") != "success":
                return result_data

            result_data["normalized_request"] = {
                "action": action,
                "expression": expression,
                "variable": variable_name,
            }
            return result_data

        # ==========================================
        # KOMBİNATORİK
        # ==========================================
        elif action == "combinatorics":
            parts = expression.split(',')
            n_val = parts[0].strip()
            r_val = parts[1].strip() if len(parts) > 1 else "0"
            result, steps = combinatorics_with_steps(n_val, r_val, variable_name or "combination")

        elif action == "discrete_counting":
            params = json.loads(expression)
            n_total = int(params.get("n", 6))
            constraints = params.get("constraints", [])
            result, steps = solve_discrete_counting(n_total, constraints)

        # ==========================================
        # DİZİLER / SERİLER
        # ==========================================
        elif action == "sequences":
            params = json.loads(expression)
            seq_type = variable_name or "arithmetic_nth"
            result, steps = sequences_with_steps(seq_type, params)

        # ==========================================
        # GRAFİK
        # ==========================================
        elif action == "plot":
            img_base64, plot_error = generate_plot(expr, var)
            try:
                from sympy import solve as _solve
                solution = _solve(expr, var)
            except Exception:
                solution = None

            if plot_error:
                return _error_response("PLOT_ERROR", plot_error)

            return {
                "status": "success",
                "expression": expression,
                "result": str(solution) if solution else "Grafik oluşturuldu",
                "readable_result": sympy.pretty(expr) if expr else "",
                "steps": [],
                "plot_base64": img_base64,
                "engine": "sympy",
                "normalized_request": {
                    "action": action,
                    "expression": expression,
                    "variable": variable_name,
                },
            }

        else:
            return _error_response(
                "UNSUPPORTED_ACTION",
                f"Geçersiz action: {action}",
                hint="Desteklenen action listesinden birini kullan."
            )

        # Log
        verification = _auto_verify(action, expression, result)
        print(f"[SYMPY OK] {action}: {expression} | variable={variable_name} → {str(result)[:200]}", flush=True)

        return {
            "status": "success",
            "expression": expression,
            "result": str(result),
            "readable_result": _safe_pretty(result),
            "steps": steps,
            "engine": engine_used,
            "verification": verification,
            "normalized_request": {
                "action": action,
                "expression": expression,
                "variable": variable_name,
            },
        }

    except Exception as e:
        print(f"[SYMPY HATA] {action}: {expression} | variable={variable_name} → {type(e).__name__}: {str(e)}", flush=True)

        if action != "solve":
            return _error_response(
                "SOLVER_ERROR",
                f"İfade çözülemedi: {str(e)}",
                hint="Action ile payload formatının uyumlu olduğundan emin ol."
            )

        fallback_var = symbols(variable_name or 'x')
        fallback_result, strategy_name = _advanced_fallback(expression, fallback_var)

        if fallback_result:
            return {
                "status": "success",
                "expression": expression,
                "result": fallback_result,
                "readable_result": fallback_result,
                "steps": [
                    {"step": 1, "description": f"Alternatif strateji: {strategy_name}",
                     "expression": expression, "readable": expression},
                    {"step": 2, "description": "Sonuç",
                     "expression": fallback_result, "readable": fallback_result},
                ],
                "engine": "sympy_fallback",
                "normalized_request": {
                    "action": action,
                    "expression": expression,
                    "variable": variable_name,
                },
            }

        return _error_response(
            "SOLVER_ERROR",
            f"İfade çözülemedi: {str(e)}",
            hint="İfadeyi SymPy formatında sadeleştirip yeniden dene."
        )


# ============================================================
# VERİFY ENDPOINT
# ============================================================
@app.post("/verify")
async def verify_endpoint(request: VerifyRequest):
    """Ters doğrulama: çözümü denkleme geri koyarak kontrol eder."""
    return verify_solution(request.original_problem, request.equation, request.solution)


# ============================================================
# GEOMETRY VALIDATE ENDPOINT
# ============================================================
@app.post("/validate-geometry")
async def validate_geometry_endpoint(request: GeometryValidateRequest):
    """Geometrik verilerin tutarlılığını kontrol eder."""
    return validate_geometry(request.dict())


# ============================================================
# HEALTH CHECK
# ============================================================
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "3.0",
        "engines": {
            "sympy": True,
            "sympy_fallback": True,
            "plot": PLOT_AVAILABLE,
        },
        "actions": [
            "solve", "simplify", "derivative", "integrate", "factor", "expand", "limit",
            "analyze_roots", "find_extrema", "analyze_asymptotes", "area_between_curves",
            "analyze_derivative", "trig_general_solution",
            "solve_system", "matrix", "coordinate_geometry",
            "combinatorics", "sequences", "plot",
        ],
    }


# ============================================================
# YARDIMCI FONKSİYONLAR
# ============================================================
def _parse_limit_point(limit_point_str):
    """Limit noktası string'ini SymPy ifadesine çevirir."""
    if not limit_point_str:
        return 0

    lp = limit_point_str.strip().lower()

    # Özel değerler
    special = {
        'oo': oo, 'inf': oo, 'infinity': oo, 'sonsuz': oo,
        '-oo': -oo, '-inf': -oo, '-infinity': -oo, '-sonsuz': -oo,
        'pi': pi, '-pi': -pi,
        'e': sympy.E,
    }

    if lp in special:
        return special[lp]

    if len(lp) > 1 and lp[-1] in {"+", "-"}:
        direction = lp[-1]
        base = limit_point_str.strip()[:-1].strip()
        if not base:
            raise ValueError("limit_point direction içeriyor ama nokta eksik")

        base_lower = base.lower()
        if base_lower in special:
            return special[base_lower], direction

        try:
            return safe_sympify(base), direction
        except Exception:
            return sympify(base), direction

    try:
        return safe_sympify(limit_point_str)
    except Exception:
        return sympify(limit_point_str)


def _safe_pretty(result):
    """Sonucun güvenli pretty-print'i."""
    if result is None:
        return ""
    try:
        if isinstance(result, str):
            return result
        if isinstance(result, list):
            return str(result)
        if isinstance(result, dict):
            return str(result)
        return sympy.pretty(result)
    except Exception:
        return str(result)


# ============================================================
# ÇALIŞTIRMA
# ============================================================

def _sympify_geometry_value(value):
    if isinstance(value, sympy.Basic):
        return value
    if value is None:
        raise ValueError("Bos geometri ifadesi")
    text = str(value).strip()
    if not text:
        raise ValueError("Bos geometri ifadesi")
    return sympy.sympify(text.replace("^", "**"))


def _extract_geometry_equations(constraints):
    equations = []
    for constraint in constraints or []:
        lhs = None
        rhs = None

        if isinstance(constraint, str):
            if "=" not in constraint:
                continue
            lhs, rhs = constraint.split("=", 1)
        elif isinstance(constraint, dict):
            if constraint.get("lhs") is not None and constraint.get("rhs") is not None:
                lhs = constraint.get("lhs")
                rhs = constraint.get("rhs")
            elif constraint.get("equation") and "=" in str(constraint.get("equation")):
                lhs, rhs = str(constraint.get("equation")).split("=", 1)

        if lhs is None or rhs is None:
            continue

        equations.append(sympy.Eq(_sympify_geometry_value(lhs), _sympify_geometry_value(rhs)))

    return equations


def _infer_geometry_target_symbol(shapes, solution):
    area_names = []
    for shape in shapes or []:
        area = shape.get("area")
        if isinstance(area, str):
            candidate = area.strip()
            if candidate.isidentifier():
                area_names.append(candidate)

    seen = set()
    for name in sorted(area_names, key=lambda item: area_names.count(item), reverse=True):
        if name in seen:
            continue
        seen.add(name)
        symbol = sympy.Symbol(name)
        if symbol in solution:
            return symbol

    for preferred in ("X", "A", "S"):
        symbol = sympy.Symbol(preferred)
        if symbol in solution:
            return symbol

    if len(solution) == 1:
        return next(iter(solution.keys()))

    return None


def _pick_best_geometry_solution(solutions):
    if not solutions:
        return None

    def score(solution):
        non_real_penalty = 0
        negative_penalty = 0
        symbolic_penalty = 0
        for value in solution.values():
            if getattr(value, "free_symbols", None):
                symbolic_penalty += 1
            if getattr(value, "is_real", None) is False:
                non_real_penalty += 1
            if getattr(value, "is_real", None) is True and value.is_number and value.evalf() < 0:
                negative_penalty += 1
        return (non_real_penalty, negative_penalty, symbolic_penalty, len(solution))

    return sorted(solutions, key=score)[0]


def solve_geometry_structured(shapes, shared_sides, constraints):
    """
    Yapılandırılmış geometri paketini denklem bazlı çözer.
    Çözemediği durumda sabit/hayali başarı üretmez.
    """
    equations = _extract_geometry_equations(constraints)
    if not equations:
        return _error_response(
            "UNSUPPORTED_GEOMETRY_PACKAGE",
            "Yapılandırılmış geometri paketi çözülebilir denklem içermiyor.",
            hint="constraints alanına SymPy uyumlu en az bir '=' denklemi ekleyin."
        )

    symbols_in_system = sorted(
        {symbol for equation in equations for symbol in equation.free_symbols},
        key=lambda item: item.name
    )
    if not symbols_in_system:
        return _error_response(
            "MISSING_GEOMETRY_SYMBOLS",
            "Geometri paketindeki bilinmeyenler belirlenemedi.",
            hint="constraints alanında X, A, h gibi sembolik bilinmeyenler kullanın."
        )

    try:
        solutions = sympy.solve(equations, symbols_in_system, dict=True)
    except Exception as exc:
        return _error_response(
            "GEOMETRY_SOLVE_FAILED",
            f"Yapılandırılmış geometri denklemleri çözülemedi: {exc}",
            hint="constraints alanını sade ve SymPy uyumlu denklemler halinde gönderin."
        )

    if not solutions:
        return _error_response(
            "GEOMETRY_NO_SOLUTION",
            "Geometri paketinden anlamlı bir çözüm elde edilemedi.",
            hint="Şekil ilişkilerini eksiksiz ve çelişkisiz olacak şekilde gönderin."
        )

    best_solution = _pick_best_geometry_solution(solutions)
    target_symbol = _infer_geometry_target_symbol(shapes, best_solution)
    target_value = best_solution.get(target_symbol) if target_symbol is not None else None
    result_value = target_value if target_value is not None else best_solution

    readable_parts = [
        f"Denklem sayısı: {len(equations)}",
        f"Çözüm: {best_solution}",
    ]
    if target_symbol is not None and target_value is not None:
        readable_parts.append(f"Hedef {target_symbol} = {target_value}")

    steps = [
        {
            "step": 1,
            "description": "Yapılandırılmış geometri denklemleri ayrıştırıldı",
            "readable": f"{len(equations)} denklem bulundu."
        },
        {
            "step": 2,
            "description": "SymPy ile çözüm üretildi",
            "readable": str(best_solution)
        }
    ]

    return {
        "status": "success",
        "result": str(result_value),
        "readable_result": " | ".join(readable_parts),
        "steps": steps,
        "engine": "neuro-symbolic-v3-structured",
        "solution": str(best_solution),
        "target_symbol": str(target_symbol) if target_symbol is not None else None,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
