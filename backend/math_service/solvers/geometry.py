"""
Geometri Çözücü — Koordinat geometrisi ve geometrik tutarlılık doğrulama.

Koordinat geometrisi: uzaklık, orta nokta, doğru denklemi,
daire-doğru kesişimi, noktadan doğruya uzaklık.

Geometri doğrulama: Üçgen, dikdörtgen, daire, paralelkenar tutarlılık kontrolü.
"""

import math as pymath
import sympy
from sympy import (
    symbols, solve, simplify, expand, sqrt, Abs, Rational, pi, cos, sin,
)
from sympy.geometry import Point, Line, Circle, Polygon, Segment, intersection

# Yeni nesil motoru import et
try:
    from .geometry_v2 import solve_geometry_v2
except ImportError:
    try:
        from geometry_v2 import solve_geometry_v2
    except ImportError:
        solve_geometry_v2 = None


def _make_step(step_num, description, expression, readable=None):
    return {
        "step": step_num,
        "description": description,
        "expression": str(expression),
        "readable": readable if readable else (
            sympy.pretty(expression) if not isinstance(expression, str) else str(expression)
        ),
    }


def coordinate_geometry_with_steps(action: str, params: dict):
    """Koordinat geometrisi işlemleri."""
    # Yeni motoru kontrol et (Constraints varsa)
    if ("constraints" in params or "points" in params) and solve_geometry_v2:
        return solve_geometry_v2(params)

    steps = []

    if action == "distance":
        x1 = sympy.sympify(params["x1"])
        y1 = sympy.sympify(params["y1"])
        x2 = sympy.sympify(params["x2"])
        y2 = sympy.sympify(params["y2"])
        d = sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        d_simplified = simplify(d)
        steps.append(_make_step(
            1, f"İki nokta: ({x1},{y1}) ve ({x2},{y2})",
            f"d = √(({x2}-{x1})² + ({y2}-{y1})²)",
        ))
        steps.append(_make_step(2, "Uzaklık", str(d_simplified), f"d = {d_simplified}"))
        return str(d_simplified), steps

    elif action == "midpoint":
        x1, y1 = params["x1"], params["y1"]
        x2, y2 = params["x2"], params["y2"]
        mx = simplify(Rational(x1 + x2, 2))
        my = simplify(Rational(y1 + y2, 2))
        steps.append(_make_step(1, "Orta nokta", f"({mx}, {my})", f"Orta nokta = ({mx}, {my})"))
        return str((mx, my)), steps

    elif action == "line_equation":
        x1, y1 = params["x1"], params["y1"]
        x2, y2 = params["x2"], params["y2"]
        x = symbols('x')
        if x2 == x1:
            steps.append(_make_step(1, "Düşey doğru", f"x = {x1}"))
            return f"x = {x1}", steps
        m = Rational(y2 - y1, x2 - x1)
        eq = m * (x - x1) + y1
        eq_simplified = simplify(expand(eq))
        steps.append(_make_step(1, f"Eğim: m = {m}", str(m), f"m = {m}"))
        steps.append(_make_step(2, "Doğru denklemi", f"y = {eq_simplified}", f"y = {eq_simplified}"))
        return f"y = {eq_simplified}", steps

    elif action == "circle_line_intersection":
        x, y = symbols('x y')
        cx = params.get("cx", 0)
        cy = params.get("cy", 0)
        r = params["r"]
        m_val = params["m"]
        n_val = params["n"]
        circle_eq = (x - cx) ** 2 + (m_val * x + n_val - cy) ** 2 - r ** 2
        x_sols = solve(expand(circle_eq), x)
        points = [(xs, simplify(m_val * xs + n_val)) for xs in x_sols]
        steps.append(_make_step(
            1,
            f"Daire: (x-{cx})²+(y-{cy})²={r}², Doğru: y={m_val}x+{n_val}",
            str(circle_eq),
        ))
        if len(x_sols) == 0:
            steps.append(_make_step(2, "Kesişim yok", "Ø", "Doğru ve daire kesişmiyor."))
        elif len(x_sols) == 1:
            steps.append(_make_step(2, f"Teğet: {points[0]}", str(points), f"Teğet noktası: {points[0]}"))
        else:
            steps.append(_make_step(2, "2 kesişim noktası", str(points), f"Kesişimler: {points[0]} ve {points[1]}"))
        return str(points), steps

    elif action == "point_to_line_distance":
        x0, y0 = params["x0"], params["y0"]
        a, b, c = params["a"], params["b"], params["c"]
        d = Abs(a * x0 + b * y0 + c) / sqrt(a ** 2 + b ** 2)
        d_simplified = simplify(d)
        steps.append(_make_step(
            1, f"Nokta ({x0},{y0}), Doğru: {a}x+{b}y+{c}=0",
            f"|{a}·{x0}+{b}·{y0}+{c}| / √({a}²+{b}²)",
        ))
        steps.append(_make_step(2, "Uzaklık", str(d_simplified), f"d = {d_simplified}"))
        return str(d_simplified), steps

    elif action == "shortest_path_via_x_axis":
        x1, y1 = params["x1"], params["y1"]
        x2, y2 = params["x2"], params["y2"]
        p1 = Point(x1, y1)
        p2 = Point(x2, y2)
        p1_reflected = Point(x1, -y1)  # x-eksenine göre yansıma
        dist = p1_reflected.distance(p2)
        d_simplified = simplify(dist)
        steps.append(_make_step(1, f"A({x1}, {y1}) noktasının x-ekseni simetriği", str(p1_reflected), f"A' = {p1_reflected}"))
        steps.append(_make_step(2, f"A' ile B({x2}, {y2}) arası doğrusal uzaklık", str(dist), f"|A'B| = {dist}"))
        steps.append(_make_step(3, "En Kısa Yol", str(d_simplified), f"Min = {d_simplified}"))
        return str(d_simplified), steps

    elif action == "shortest_path_via_y_axis":
        x1, y1 = params["x1"], params["y1"]
        x2, y2 = params["x2"], params["y2"]
        p1 = Point(x1, y1)
        p2 = Point(x2, y2)
        p1_reflected = Point(-x1, y1)  # y-eksenine göre yansıma
        dist = p1_reflected.distance(p2)
        d_simplified = simplify(dist)
        steps.append(_make_step(1, f"A({x1}, {y1}) noktasının y-ekseni simetriği", str(p1_reflected), f"A' = {p1_reflected}"))
        steps.append(_make_step(2, f"A' ile B({x2}, {y2}) arası doğrusal uzaklık", str(dist), f"|A'B| = {dist}"))
        steps.append(_make_step(3, "En Kısa Yol", str(d_simplified), f"Min = {d_simplified}"))
        return str(d_simplified), steps

    elif action == "unfold_cylinder":
        r = sympy.sympify(params["r"])
        h = sympy.sympify(params["h"])
        turns = sympy.sympify(params.get("turns", 1))
        horizontal_dist = turns * 2 * pi * r
        vertical_dist = h
        path = sqrt(horizontal_dist**2 + vertical_dist**2)
        path_sim = simplify(path)
        steps.append(_make_step(1, f"Silindir Açınımı ({turns} tur)", f"Yatay: {turns} * 2π * {r} = {horizontal_dist}, Dikey: {h}"))
        steps.append(_make_step(2, "Pisagor (Hipotenüs)", f"√({horizontal_dist}² + {vertical_dist}²)", f"Yol = {path_sim}"))
        return str(path_sim), steps

    elif action == "unfold_cone":
        r = sympy.sympify(params["r"])
        l = sympy.sympify(params["l"])
        # Açınım açısı: alpha / 360 = r / l
        alpha = (r / l) * 360
        # Yan yüzeyde en kısa yol (genelde A'dan orta nokta B'ye gibi)
        # alpha açılı bir daire dilimi
        dist_b = params.get("dist_to_b", l) # Varsayılan olarak ana doğru ucu
        # Kosinüs teoremi: d^2 = l^2 + dist_b^2 - 2*l*dist_b*cos(alpha)
        # Karınca tam tur değil, yarım tur veya spesifik bir noktaya gidiyor olabilir.
        # Varsayılan: Açınımın en uzak iki noktası (yarım tur veya spesifik açı)
        target_angle_deg = params.get("angle_deg", alpha)
        rad = target_angle_deg * pi / 180
        path = sqrt(l**2 + dist_b**2 - 2*l*dist_b*cos(rad))
        path_sim = simplify(path)
        steps.append(_make_step(1, f"Koni Açınımı (r={r}, l={l})", f"Merkez Açı: {alpha}°, Hedef Açı: {target_angle_deg}°"))
        steps.append(_make_step(2, "Kosinüs Teoremi", str(path_sim), f"Yol = {path_sim}"))
        return str(path_sim), steps

    elif action == "rotation_2d":
        x1, y1 = params["x"], params["y"]
        angle_deg = params.get("angle", 0)
        # Pozitif yönde döndürme: (x cos - y sin, x sin + y cos)
        rad = angle_deg * pi / 180
        nx = x1 * cos(rad) - y1 * sin(rad)
        ny = x1 * sin(rad) + y1 * cos(rad)
        res = (simplify(nx), simplify(ny))
        steps.append(_make_step(1, f"({x1}, {y1}) noktasının {angle_deg}° döndürülmesi", str(res)))
        return str(res), steps

    elif action == "reflection_line":
        x1, y1 = params["x"], params["y"]
        # y = mx + n veya ax + by + c = 0
        p = Point(x1, y1)
        if "m" in params:
            m = params["m"]
            n = params.get("n", 0)
            l = Line(Point(0, n), slope=m)
        else:
            a, b, c = params["a"], params["b"], params["c"]
            # Ax + By + C = 0 -> slope = -a/b, intercept = -c/b
            l = Line(Point(0, -Rational(c, b)) if b != 0 else Point(-Rational(c, a), 0), 
                     Point(1, -Rational(a + c, b)) if b != 0 else Point(-Rational(c, a), 1))
        
        p_ref = p.reflect(l)
        res = (simplify(p_ref.x), simplify(p_ref.y))
        steps.append(_make_step(1, f"({x1}, {y1}) noktasının doğruya göre simetriği", str(res)))
        return str(res), steps

    elif action == "polygon_area":
        # points = [(x1,y1), (x2,y2), ...]
        pts = params["points"]
        poly = Polygon(*[Point(p[0], p[1]) for p in pts])
        area = simplify(poly.area)
        steps.append(_make_step(1, f"{len(pts)} gen alanı hesaplaması", str(pts), f"Köşeler: {pts}"))
        steps.append(_make_step(2, "Poligon Alanı (Shoelace / Geometri Nesnesi)", str(area), f"Alan = {area}"))
        return str(area), steps

    return "Bilinmeyen geometri işlemi", steps


def validate_geometry(data):
    """
    Geometrik verilerin tutarlılığını kontrol eder.
    data: dict — shape, sides, angles, area, perimeter, height, radius, base
    """
    try:
        issues = []
        shape = data.get("shape", "").lower()
        sides = data.get("sides") or []
        angles = data.get("angles") or []
        area = data.get("area")
        perimeter = data.get("perimeter")
        height = data.get("height")
        radius = data.get("radius")
        base = data.get("base")

        # --- ÜÇGEN ---
        if shape in ["triangle", "üçgen", "ucgen"]:
            if len(angles) >= 3 and all(a is not None for a in angles[:3]):
                angle_sum = sum(angles[:3])
                if abs(angle_sum - 180) > 0.5:
                    issues.append(f"HATA: İç açılar toplamı {angle_sum}° ≠ 180°")

            if len(sides) >= 3 and all(s is not None for s in sides[:3]):
                a, b, c = sorted(sides[:3])
                if a + b <= c:
                    issues.append(f"HATA: Kenarlar ({a}, {b}, {c}) üçgen eşitsizliğini sağlamıyor")

                # Dik üçgen kontrolü
                if any(a is not None and abs(a - 90) < 0.5 for a in angles):
                    if abs(a ** 2 + b ** 2 - c ** 2) > 0.5:
                        issues.append(f"HATA: Pisagor sağlanmıyor: {a}²+{b}²={a ** 2 + b ** 2} ≠ {c}²={c ** 2}")

            if area and base and height:
                expected = 0.5 * base * height
                if abs(area - expected) > 0.5:
                    issues.append(f"HATA: Alan tutarsız. Verilen: {area}, Hesaplanan: {expected}")

        # --- DİKDÖRTGEN ---
        elif shape in ["rectangle", "dikdörtgen", "dikdortgen"]:
            if angles and not all(abs(a - 90) < 0.5 for a in angles):
                issues.append("HATA: Dikdörtgende tüm açılar 90° olmalı")

            if area and len(sides) >= 2 and all(s is not None for s in sides[:2]):
                expected = sides[0] * sides[1]
                if abs(area - expected) > 0.5:
                    issues.append(f"HATA: Alan tutarsız. Verilen: {area}, Hesaplanan: {expected}")

            if perimeter and len(sides) >= 2 and all(s is not None for s in sides[:2]):
                expected = 2 * (sides[0] + sides[1])
                if abs(perimeter - expected) > 0.5:
                    issues.append(f"HATA: Çevre tutarsız. Verilen: {perimeter}, Hesaplanan: {expected}")

        # --- DAİRE ---
        elif shape in ["circle", "daire"]:
            if radius and area:
                expected = pymath.pi * radius ** 2
                if abs(area - expected) > 0.5:
                    issues.append(f"HATA: Alan tutarsız. Verilen: {area}, Hesaplanan: {round(expected, 2)}")

            if radius and perimeter:
                expected = 2 * pymath.pi * radius
                if abs(perimeter - expected) > 0.5:
                    issues.append(f"HATA: Çevre tutarsız. Verilen: {perimeter}, Hesaplanan: {round(expected, 2)}")

        # --- PARALELKENAR ---
        elif shape in ["parallelogram", "paralelkenar"]:
            if len(angles) >= 2 and all(a is not None for a in angles[:2]):
                if abs(angles[0] + angles[1] - 180) > 0.5:
                    issues.append(f"HATA: Komşu açılar toplamı {angles[0] + angles[1]}° ≠ 180°")

        is_valid = len(issues) == 0
        return {
            "is_valid": is_valid,
            "issues": issues,
            "message": "Geometrik veriler tutarlı ✓" if is_valid else "Geometrik tutarsızlık tespit edildi!"
        }
    except Exception as e:
        return {
            "is_valid": True,
            "issues": [f"Doğrulama hatası: {str(e)}"],
            "message": "Doğrulama yapılamadı, devam et."
        }
