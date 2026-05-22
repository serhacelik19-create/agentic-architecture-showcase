"""
YKS Geometri Motoru v2.0 — Bilgi Tabanlı ve Kısıtlama Odaklı Çözücü.

Bu motor, sadece basit koordinat hesaplamaları yapmak yerine, 
geometrik kısıtlamaları (paralellik, benzerlik, teoremler) bir denklem 
sistemine dönüştürür ve SymPy ile sembolik olarak çözer.
"""

import sympy
from sympy import symbols, solve, simplify, sqrt, Abs, Rational, pi, cos, sin, Eq
from sympy.geometry import Point, Line, Segment, Polygon, Circle, intersection

class UnifiedGeometrySolver:
    def __init__(self):
        self.equations = []
        self.symbols = {}
        self.steps = []
        self._step_counter = 1

    def _add_step(self, description, expression="", readable=""):
        self.steps.append({
            "step": self._step_counter,
            "description": description,
            "expression": str(expression),
            "readable": readable or str(expression)
        })
        self._step_counter += 1

    def get_symbol(self, name):
        if name not in self.symbols:
            self.symbols[name] = symbols(name)
        return self.symbols[name]

    def add_constraint(self, type, *args, **kwargs):
        """Geometrik bir kısıtlama (constraint) ekler."""
        if type == "equal_length":
            # dist(A, B) = dist(C, D) veya dist(A, B) = k
            p1, p2 = args[0], args[1]
            target = args[2] if len(args) > 2 else kwargs.get("value")
            dist_sq = (p2.x - p1.x)**2 + (p2.y - p1.y)**2
            self.equations.append(Eq(dist_sq, target**2))
            self._add_step(f"Uzunluk eşitliği: |{p1}{p2}| = {target}", dist_sq - target**2)

        elif type == "parallel":
            # m1 = m2
            p1, p2, p3, p4 = args[0], args[1], args[2], args[3]
            eq = (p2.y - p1.y) * (p4.x - p3.x) - (p4.y - p3.y) * (p2.x - p1.x)
            self.equations.append(Eq(eq, 0))
            self._add_step(f"Paralellik kısıtlaması: AB // CD", eq)

        elif type == "perpendicular":
            # m1 * m2 = -1 -> (y2-y1)(y4-y3) + (x2-x1)(x4-x3) = 0
            p1, p2, p3, p4 = args[0], args[1], args[2], args[3]
            eq = (p2.y - p1.y) * (p4.y - p3.y) + (p2.x - p1.x) * (p4.x - p3.x)
            self.equations.append(Eq(eq, 0))
            self._add_step(f"Diklik kısıtlaması: AB ⊥ CD", eq)

        elif type == "angle_bisector":
            # Teorem: AB/AC = BD/DC
            # args: A, B, C, D (D, BC üzerinde kesişim noktası)
            a, b, c, d = args[0], args[1], args[2], args[3]
            ab_sq = (b.x - a.x)**2 + (b.y - a.y)**2
            ac_sq = (c.x - a.x)**2 + (c.y - a.y)**2
            bd_sq = (d.x - b.x)**2 + (d.y - b.y)**2
            dc_sq = (c.x - d.x)**2 + (c.y - d.y)**2
            # ab/ac = bd/dc -> ab^2 * dc^2 = ac^2 * bd^2
            eq = ab_sq * dc_sq - ac_sq * bd_sq
            self.equations.append(Eq(eq, 0))
            self._add_step(f"Açıortay Teoremi: |AB|/|AC| = |BD|/|DC|", eq)

        elif type == "similarity":
            # Triangle ABC ~ DEF -> AB/DE = BC/EF = AC/DF
            abc, def_tri = args[0], args[1] # points lists
            a, b, c = abc
            d, e, f = def_tri
            ab_sq = (b.x-a.x)**2 + (b.y-a.y)**2
            de_sq = (e.x-d.x)**2 + (e.y-d.y)**2
            bc_sq = (c.x-b.x)**2 + (c.y-b.y)**2
            ef_sq = (f.x-e.x)**2 + (f.y-e.y)**2
            # ab^2 * ef^2 = bc^2 * de^2
            eq = ab_sq * ef_sq - bc_sq * de_sq
            self.equations.append(Eq(eq, 0))
            self._add_step(f"Benzerlik Teoremi: △ABC ~ △DEF", eq)

        elif type == "on_circle":
            # (x-h)^2 + (y-k)^2 = r^2
            center, radius, point = args[0], args[1], args[2]
            eq = (point.x - center.x)**2 + (point.y - center.y)**2 - radius**2
            self.equations.append(Eq(eq, 0))
            self._add_step(f"Çember denklemi: {point} çember üzerindedir", eq)

        elif type == "euclidean_h2_pk":
            # h^2 = p * k (Dik üçgende yükseklik özelliği)
            h, p, k = args[0], args[1], args[2]
            eq = h**2 - p * k
            self.equations.append(Eq(eq, 0))
            self._add_step(f"Öklid Teoremi: h² = p·k", eq)

        elif type == "centroid":
            # G = (A + B + C) / 3
            a, b, c, g = args[0], args[1], args[2], args[3]
            eq_x = g.x - (a.x + b.x + c.x) / 3
            eq_y = g.y - (a.y + b.y + c.y) / 3
            self.equations.append(Eq(eq_x, 0))
            self.equations.append(Eq(eq_y, 0))
            self._add_step(f"Ağırlık Merkezi kısıtlaması: G = (A+B+C)/3", f"{eq_x}, {eq_y}")

        elif type == "stewart":
            # x^2 = (b^2*m + c^2*n)/(m+n) - m*n
            # point_base, point_left, point_right, point_d (intersection on base)
            a_top, b_left, c_right, d_base = args[0], args[1], args[2], args[3]
            x_sq = (d_base.x - a_top.x)**2 + (d_base.y - a_top.y)**2
            b_sq = (b_left.x - a_top.x)**2 + (b_left.y - a_top.y)**2
            c_sq = (c_right.x - a_top.x)**2 + (c_right.y - a_top.y)**2
            m = sqrt((d_base.x - b_left.x)**2 + (d_base.y - b_left.y)**2)
            n = sqrt((c_right.x - d_base.x)**2 + (c_right.y - d_base.y)**2)
            eq = x_sq - (b_sq * n + c_sq * m) / (m + n) + m * n
            self.equations.append(Eq(eq, 0))
            self._add_step(f"Stewart Teoremi (Kesin uzunluk)", eq)

        elif type == "collinear":
            # Nokta P3, P1P2 doğrusu üzerindedir
            p1, p2, p3 = args[0], args[1], args[2]
            # Alan(p1,p2,p3) = 0 logic
            eq = p1.x*(p2.y - p3.y) + p2.x*(p3.y - p1.y) + p3.x*(p1.y - p2.y)
            self.equations.append(Eq(eq, 0))
            self._add_step(f"Doğrusallık kısıtlaması: {p1}, {p2}, {p3} aynı doğru üzerinde", eq)

    def solve_problem(self, target_symbols):
        """Sistemi çözer ve adımları döndürür."""
        self._add_step("Denklem sistemi çözülüyor...", f"{len(self.equations)} denklem")
        solution = solve(self.equations, target_symbols, dict=True)
        
        if not solution:
            # Fallback: simplify equations
            simplified_eqs = [simplify(eq) for eq in self.equations]
            solution = solve(simplified_eqs, target_symbols, dict=True)

        return solution, self.steps

def solve_geometry_v2(problem_data):
    """
    Dış dünyadan gelen JSON verisini işleyen ana giriş noktası.
    Örnek input: {
        "points": {"A": [0,0], "B": [4,0], "C": ["x", "y"]},
        "constraints": [
            {"type": "equal_length", "args": ["A", "C", 5]},
            {"type": "equal_length", "args": ["B", "C", 5]}
        ],
        "target": ["x", "y"]
    }
    """
    solver = UnifiedGeometrySolver()
    pts_map = {}
    
    # 1. Noktaları tanımla
    for name, coords in problem_data.get("points", {}).items():
        x = coords[0] if not isinstance(coords[0], str) else solver.get_symbol(coords[0])
        y = coords[1] if not isinstance(coords[1], str) else solver.get_symbol(coords[1])
        pts_map[name] = Point(x, y)

    # 2. Kısıtlamaları ekle
    for con in problem_data.get("constraints", []):
        ctype = con["type"]
        args = []
        for arg in con["args"]:
            if arg in pts_map:
                args.append(pts_map[arg])
            else:
                args.append(arg)
        solver.add_constraint(ctype, *args)

    # 3. Teoremleri ekle (Otomatik mantık)
    # Gelecekte buraya "Similarity", "AngleBisector" gibi yüksek seviye teoremler eklenecek.

    # 4. Çöz
    targets = [solver.get_symbol(t) for t in problem_data.get("target", [])]
    solution, steps = solver.solve_problem(targets)
    
    return str(solution), steps

# Mevcut API uyumluluğu için eski fonksiyonları güncellenmiş halleriyle koruyoruz
def coordinate_geometry_with_steps(action: str, params: dict):
    # Eğer gelen veri yeni formattaysa yeni motoru kullan
    if "constraints" in params:
        return solve_geometry_v2(params)
    
    # Eskiden gelen basit işlemleri (distance, midpoint vb.) 
    # yeni motorun kısıtlama mantığına çekebiliriz veya 
    # geçiş sürecinde eski kodu burada tutabiliriz.
    # Şimdilik mevcut logic_v1'i buraya import/copy edebiliriz.
    from solvers.geometry import coordinate_geometry_with_steps as v1_solver
    return v1_solver(action, params)
