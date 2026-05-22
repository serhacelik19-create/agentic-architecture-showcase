"""
Analiz Çözücü — Kök analizi, ekstremum, asimptot, eğriler arası alan, türev analizi.

Özellikler:
- Kök katlılık tespiti ve işaret testi (teğet vs kesen)
- Kritik noktalar: f'(x)=0 VE f'(x) tanımsız
- Delik (hole) vs düşey asimptot ayrımı
- Abs() içeren türevleri doğru handle edebilme
- Epsilon testi Rational ile (hassasiyet kaybı yok)
"""

import sympy
from sympy import (
    symbols, solve, solveset, diff, integrate, limit, simplify,
    expand, factor, cancel, Abs, sqrt, oo, pi, S, Rational,
    FiniteSet, lambdify, sign, Piecewise, zoo,
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


def _safe_sign_test(f_expr, var, point, eps=Rational(1, 1000)):
    """
    point ± eps'de fonksiyonun işaretini test eder.
    Rational kullanarak hassasiyet kaybını önler.
    """
    try:
        left_val = f_expr.subs(var, point - eps)
        right_val = f_expr.subs(var, point + eps)
        # Simplify ile sayısal değere indir
        left_val = simplify(left_val)
        right_val = simplify(right_val)

        # Float'a çevir
        l = float(left_val) if left_val.is_number else None
        r = float(right_val) if right_val.is_number else None

        return l, r
    except Exception:
        return None, None


def _real_analysis_context(expr, variable):
    """
    Reel analiz aksiyonlarında değişkeni reel kabul ederek Abs gibi ifadeleri stabilize et.
    """
    real_var = symbols(str(variable), real=True)
    if variable == real_var and getattr(variable, "is_real", False):
        return expr, variable
    return expr.xreplace({variable: real_var}), real_var


def _sign_label(value):
    if value is None:
        return "?"
    if value > 0:
        return "+"
    if value < 0:
        return "-"
    return "0"


def analyze_roots_with_steps(expr, variable):
    """
    Kök analizi: kökleri bulur, katlılık belirler, grafik davranışını tespit eder.
    İşaret testi ile kesen/teğet ayrımı yapar.
    """
    x = variable
    steps = [_make_step(1, "İncelenen fonksiyon", expr)]

    # Kökleri bul
    try:
        roots_set = solveset(expr, x, domain=S.Reals)
        if isinstance(roots_set, FiniteSet):
            all_real_roots = sorted(list(roots_set), key=lambda r: float(r))
        else:
            all_real_roots = sorted(
                [r for r in solve(expr, x) if r.is_real],
                key=lambda r: float(r)
            )
    except Exception:
        all_real_roots = sorted(
            [r for r in solve(expr, x) if r.is_real],
            key=lambda r: float(r)
        )

    roots_info = []
    for root in all_real_roots:
        l, r_val = _safe_sign_test(expr, x, root)

        if l is not None and r_val is not None:
            sign_change = (l * r_val < 0)
            if sign_change:
                behavior = "Grafik x eksenini KESİYOR (tek katlı)"
                mult_desc = "Tek katlı"
            else:
                behavior = "Grafik x eksenine TEĞET (çift katlı)"
                mult_desc = "Çift katlı"
        else:
            behavior = "Grafik davranışı belirsiz"
            mult_desc = "Belirlenemedi"

        roots_info.append({
            "value": str(root),
            "numeric": f"{float(root):.4f}",
            "is_real": True,
            "character": mult_desc,
            "graph_behavior": behavior,
        })

    # Özet
    summary = []
    if roots_info:
        summary.append(f"{len(roots_info)} reel kök bulundu:")
        for r in roots_info:
            summary.append(f"  • x = {r['value']} ({r['character']}) → {r['graph_behavior']}")
    else:
        summary.append("Reel kök bulunamadı.")

    steps.append(_make_step(
        2, "Kök analizi tamamlandı",
        str([r["value"] for r in roots_info]),
        "\n".join(summary)
    ))

    return str({"roots": roots_info}), steps


def find_extrema_with_steps(expr, variable):
    """
    Ekstremum analizi: Türev → kritik noktalar → Rational epsilon işaret testi.
    f'(x)=0 ve f'(x) tanımsız noktalarını birlikte ele alır.
    """
    expr, x = _real_analysis_context(expr, variable)
    steps = [_make_step(1, "Orijinal fonksiyon: f(x)", expr)]
    eps = Rational(1, 1000)

    # 1. Türev
    deriv = diff(expr, x)
    steps.append(_make_step(2, "Birinci türev: f'(x)", deriv))

    # 2. Kritik noktalar: f'(x)=0 VE f'(x) tanımsız
    num, den = deriv.as_numer_denom()
    all_criticals = set()

    try:
        zero_set = solveset(num, x, domain=S.Reals)
        if isinstance(zero_set, FiniteSet):
            all_criticals.update(zero_set)
        else:
            all_criticals.update([r for r in solve(num, x) if r.is_real])
    except Exception:
        all_criticals.update([r for r in solve(num, x) if r.is_real])

    # Tanımsızlık noktaları (payda = 0)
    if den != 1:
        try:
            undef_set = solveset(den, x, domain=S.Reals)
            if isinstance(undef_set, FiniteSet):
                all_criticals.update(undef_set)
        except Exception:
            try:
                all_criticals.update([r for r in solve(den, x) if r.is_real])
            except Exception:
                pass

    real_criticals = sorted(list(all_criticals), key=lambda r: float(r))

    steps.append(_make_step(
        3, "Kritik noktalar (f'(x)=0 ve f'(x) tanımsız)",
        str(real_criticals),
        f"Kritik Noktalar: {', '.join(str(cp) for cp in real_criticals) if real_criticals else 'Yok'}"
    ))

    # 3. Her kritik nokta için epsilon işaret testi
    extrema = []
    for cp in real_criticals:
        l_prime, r_prime = _safe_sign_test(deriv, x, cp, eps)

        try:
            y_val = float(simplify(expr.subs(x, cp)))
        except Exception:
            y_val = "hesaplanamadı"

        if l_prime is not None and r_prime is not None:
            import math
            if not (math.isfinite(l_prime) and math.isfinite(r_prime)):
                ext_type = "Tanımsızlık noktası (Ekstremum değil)"
            elif l_prime > 0 and r_prime < 0:
                ext_type = "Yerel Maksimum"
            elif l_prime < 0 and r_prime > 0:
                ext_type = "Yerel Minimum"
            else:
                ext_type = "Büküm Noktası (Ekstremum değil)"
        else:
            ext_type = "Belirlenemedi"

        extrema.append({
            "x": str(cp),
            "y": f"{y_val:.4f}" if isinstance(y_val, float) else str(y_val),
            "type": ext_type,
            "left_derivative_sign": _sign_label(l_prime),
            "right_derivative_sign": _sign_label(r_prime),
        })

        steps.append(_make_step(
            len(steps) + 1,
            f"x = {cp}: f'({float(cp) - float(eps):.3f})={_sign_label(l_prime)}, f'({float(cp) + float(eps):.3f})={_sign_label(r_prime)} → {ext_type}",
            f"f({cp}) = {y_val}",
            f"Nokta: ({cp}, {y_val}) → {ext_type}"
        ))

    # Özet
    maxima = [e for e in extrema if "Maksimum" in e["type"]]
    minima = [e for e in extrema if "Minimum" in e["type"]]
    summary = []
    for m in maxima:
        summary.append(f"Yerel Maksimum: ({m['x']}, {m['y']})")
    for m in minima:
        summary.append(f"Yerel Minimum: ({m['x']}, {m['y']})")
    if not maxima and not minima:
        summary.append("Bu fonksiyonun yerel ekstremum noktası bulunmamaktadır.")

    steps.append(_make_step(
        len(steps) + 1, "Ekstremum analizi tamamlandı",
        str(extrema), "\n".join(summary)
    ))

    return str({"extrema": extrema}), steps


def analyze_asymptotes_with_steps(expr, variable):
    """
    Asimptot analizi: Düşey (delik kontrolüyle), yatay, eğik.
    Delik vs asimptot ayrımı yapar.
    """
    x = variable
    steps = [_make_step(1, "Orijinal fonksiyon", expr)]

    result = {"vertical": [], "horizontal": [], "oblique": [], "holes": []}

    numer, denom = expr.as_numer_denom()
    steps.append(_make_step(
        2, "Pay ve payda ayrıştırıldı",
        f"Pay: {numer}, Payda: {denom}",
        f"Pay: {sympy.pretty(numer)}\nPayda: {sympy.pretty(denom)}"
    ))

    # Düşey asimptotlar
    if denom != 1 and denom != 0:
        try:
            denom_roots = solve(denom, x)
        except Exception:
            denom_roots = []

        for root in denom_roots:
            if not root.is_real:
                continue

            numer_at_root = simplify(numer.subs(x, root))
            if numer_at_root == 0:
                # Delik (hole)
                cancelled = cancel(expr)
                hole_y = simplify(cancelled.subs(x, root))
                result["holes"].append({"x": str(root), "y": str(hole_y)})
                steps.append(_make_step(
                    len(steps) + 1,
                    f"x = {root}: Pay ve payda ikisi de 0 → DELİK",
                    f"Delik noktası: ({root}, {hole_y})",
                    f"⚠️ x = {root} bir delik (hole) noktasıdır, asimptot DEĞİL! Limit: y = {hole_y}"
                ))
            else:
                # Gerçek düşey asimptot
                result["vertical"].append(str(root))
                try:
                    lim_left = limit(expr, x, root, '-')
                    lim_right = limit(expr, x, root, '+')
                    steps.append(_make_step(
                        len(steps) + 1,
                        f"x = {root} düşey asimptot",
                        f"lim(x→{root}⁻) = {lim_left}, lim(x→{root}⁺) = {lim_right}",
                        f"Düşey Asimptot: x = {root}\n  Sol limit: {lim_left}\n  Sağ limit: {lim_right}"
                    ))
                except Exception:
                    steps.append(_make_step(
                        len(steps) + 1,
                        f"x = {root} düşey asimptot",
                        f"x = {root}",
                        f"Düşey Asimptot: x = {root}"
                    ))

    # Yatay asimptotlar
    try:
        lim_pos = limit(expr, x, oo)
        lim_neg = limit(expr, x, -oo)

        if lim_pos.is_finite:
            result["horizontal"].append({"direction": "+∞", "value": str(lim_pos)})
        if lim_neg.is_finite:
            result["horizontal"].append({"direction": "-∞", "value": str(lim_neg)})

        if result["horizontal"]:
            h_desc = ", ".join([f"x→{h['direction']}: y = {h['value']}" for h in result["horizontal"]])
            steps.append(_make_step(len(steps) + 1, "Yatay asimptotlar", h_desc, f"Yatay Asimptot: {h_desc}"))
        else:
            steps.append(_make_step(
                len(steps) + 1, "Yatay asimptot yok",
                f"lim(x→+∞) = {lim_pos}, lim(x→-∞) = {lim_neg}",
                "Yatay asimptot bulunmamaktadır."
            ))

            # Eğik asimptot
            try:
                m = limit(expr / x, x, oo)
                if m.is_finite and m != 0:
                    b = limit(expr - m * x, x, oo)
                    if b.is_finite:
                        result["oblique"].append(f"y = {m}*x + {b}")
                        steps.append(_make_step(
                            len(steps) + 1,
                            "Eğik asimptot bulundu",
                            f"y = {m}x + {b}",
                            f"Eğik Asimptot: y = {m}x + {b}"
                        ))
            except Exception:
                pass
    except Exception:
        pass

    steps.append(_make_step(
        len(steps) + 1, "Asimptot analizi tamamlandı",
        str(result),
        f"Düşey: {result['vertical'] or 'Yok'} | Yatay: {[h['value'] for h in result['horizontal']] or 'Yok'} | Eğik: {result['oblique'] or 'Yok'} | Delikler: {result['holes'] or 'Yok'}"
    ))

    return str(result), steps


def area_between_curves_with_steps(expr, variable):
    """
    Eğriler arası alan: f(x)-g(x) farkı verilir.
    Kesişim noktaları otomatik bulunur, mutlak değer integrali hesaplanır.
    """
    x = variable
    steps = [_make_step(1, "Fonksiyon farkı: f(x) - g(x)", expr)]

    # Kesişim noktaları
    intersections = solve(expr, x)
    real_ints = sorted([r for r in intersections if r.is_real], key=lambda r: float(r))

    steps.append(_make_step(
        2,
        f"Kesişim noktaları: {len(real_ints)} nokta",
        str(real_ints),
        ", ".join([f"x = {r}" for r in real_ints]) if real_ints else "Kesişim noktası yok"
    ))

    if len(real_ints) < 2:
        steps.append(_make_step(
            3, "Yetersiz kesişim noktası",
            "N/A", "En az 2 kesişim noktası gereklidir."
        ))
        return str({"area": "belirlenemedi", "intersections": [str(r) for r in real_ints]}), steps

    # Her aralıkta mutlak değer integrali
    total_area = S.Zero
    partial_areas = []

    for i in range(len(real_ints) - 1):
        a, b = real_ints[i], real_ints[i + 1]
        # Aralık ortasında işaret kontrolü yap
        mid = Rational(a + b, 2)
        mid_val = expr.subs(x, mid)

        if simplify(mid_val) >= 0:
            partial = integrate(expr, (x, a, b))
        else:
            partial = integrate(-expr, (x, a, b))

        partial = simplify(partial)
        total_area += Abs(partial)
        partial_areas.append({"from": str(a), "to": str(b), "area": str(partial)})

        steps.append(_make_step(
            len(steps) + 1,
            f"[{a}, {b}] aralığındaki alan",
            str(partial),
            f"∫|f(x)-g(x)|dx [{a} → {b}] = {partial}"
        ))

    total_simplified = simplify(total_area)
    steps.append(_make_step(
        len(steps) + 1, "Toplam alan",
        str(total_simplified),
        f"Toplam Alan = {total_simplified}"
    ))

    return str({
        "area": str(total_simplified),
        "partial_areas": partial_areas,
        "intersections": [str(r) for r in real_ints]
    }), steps


def analyze_derivative_with_steps(expr, variable):
    """
    Verilen türev ifadesinin (f'(x)) köklerini ve işaret tablosunu analiz eder.
    Abs() içeren ifadeleri doğru handle eder.
    Gemini'nin kurduğu f'(x) ifadesini alıp kritik noktaları belirler.
    """
    expr, x = _real_analysis_context(expr, variable)
    steps = [_make_step(1, "İncelenen türev: f'(x)", expr)]

    # Kökleri bul
    try:
        roots_set = solveset(expr, x, domain=S.Reals)
        if isinstance(roots_set, FiniteSet):
            real_roots = sorted([float(r) for r in roots_set])
        else:
            real_roots = sorted([float(r) for r in solve(expr, x) if r.is_real])
    except Exception:
        try:
            real_roots = sorted([float(r) for r in solve(expr, x) if r.is_real])
        except Exception:
            real_roots = []

    steps.append(_make_step(
        2, "Kritik noktalar",
        str(real_roots),
        f"f'(x) = 0 yapan noktalar: {real_roots}"
    ))

    # Her kök için epsilon işaret testi
    eps = Rational(1, 1000)
    analysis = []

    for r in real_roots:
        l_val, r_val = _safe_sign_test(expr, x, Rational(r).limit_denominator(10**6), eps)

        if l_val is not None and r_val is not None:
            import math
            if not (math.isfinite(l_val) and math.isfinite(r_val)):
                is_extremum = False
                ext_type = "Tanımsızlık / Asimptot (Ekstremum Değil)"
            else:
                is_extremum = (l_val * r_val < 0)
                if is_extremum:
                    ext_type = "Yerel Maksimum" if l_val > 0 else "Yerel Minimum"
                else:
                    ext_type = "Kritik Nokta (İşaret Değişmiyor - Ekstremum Değil)"
        else:
            is_extremum = False
            ext_type = "Hesaplama Hatası"

        analysis.append({
            "x": f"{r:.4f}",
            "is_extremum": is_extremum,
            "type": ext_type,
            "left_sign": _sign_label(l_val),
            "right_sign": _sign_label(r_val),
        })

    steps.append(_make_step(
        3, "İşaret tablosu sonucu",
        str(analysis),
        "\n".join([f"• x = {a['x']}: {a['left_sign']} → {a['right_sign']} ({a['type']})" for a in analysis])
    ))

    return analysis, steps
