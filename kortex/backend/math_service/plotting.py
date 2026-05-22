"""
Grafik Çizme Motoru — Modern koyu tema, kök ve kritik nokta işaretleme.
"""

import io
import base64
import sympy
from sympy import symbols, solve, diff, lambdify

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    import numpy as np
    PLOT_AVAILABLE = True
except ImportError:
    PLOT_AVAILABLE = False


def generate_plot(expr, variable, x_range=(-10, 10)):
    """
    Fonksiyonun grafiğini çizip Base64 PNG olarak döndürür.
    Kök noktaları ve kritik noktaları işaretler.
    """
    if not PLOT_AVAILABLE:
        return None, "Matplotlib/NumPy yüklü değil."

    x = variable
    try:
        f_numpy = lambdify(x, expr, modules=['numpy'])

        fig, ax = plt.subplots(figsize=(10, 7))

        # Modern koyu tema
        fig.patch.set_facecolor('#1a1a2e')
        ax.set_facecolor('#16213e')
        ax.grid(True, alpha=0.2, color='#e0e0e0')
        for spine in ax.spines.values():
            spine.set_color('#e0e0e0')
        ax.tick_params(colors='#e0e0e0')
        ax.xaxis.label.set_color('#e0e0e0')
        ax.yaxis.label.set_color('#e0e0e0')

        x_vals = np.linspace(x_range[0], x_range[1], 1000)

        try:
            y_vals = f_numpy(x_vals)
            y_vals = np.where(np.isfinite(y_vals), y_vals, np.nan)
        except Exception:
            return None, "Fonksiyon grafik aralığında hesaplanamadı."

        # Ana çizgi
        ax.plot(x_vals, y_vals, color='#00d2ff', linewidth=2.5,
                label=f'f(x) = {str(expr)}', zorder=5)

        # Eksenler
        ax.axhline(y=0, color='#e0e0e0', linewidth=0.8, alpha=0.5)
        ax.axvline(x=0, color='#e0e0e0', linewidth=0.8, alpha=0.5)

        # Kök noktaları
        try:
            roots = solve(expr, x)
            real_roots = [float(r) for r in roots
                          if r.is_real and x_range[0] <= float(r) <= x_range[1]]
            if real_roots:
                ax.scatter(real_roots, [0] * len(real_roots), color='#ff6b6b', s=100,
                           zorder=10, label=f'Kökler: {[round(r, 2) for r in real_roots]}',
                           edgecolors='white', linewidths=2)
        except Exception:
            pass

        # Kritik noktalar
        try:
            derivative = diff(expr, x)
            cps = solve(derivative, x)
            real_cps = [float(cp) for cp in cps
                        if cp.is_real and x_range[0] <= float(cp) <= x_range[1]]
            if real_cps:
                cp_y = [float(expr.subs(x, cp)) for cp in real_cps]
                ax.scatter(real_cps, cp_y, color='#ffd93d', s=100,
                           zorder=10, label='Tepe/Çukur', marker='D',
                           edgecolors='white', linewidths=2)
                for cx, cy in zip(real_cps, cp_y):
                    ax.annotate(f'({round(cx, 2)}, {round(cy, 2)})',
                                xy=(cx, cy), xytext=(10, 15),
                                textcoords='offset points',
                                color='#ffd93d', fontsize=9,
                                arrowprops=dict(arrowstyle='->', color='#ffd93d', lw=1.5))
        except Exception:
            pass

        # Y eksen limitleri
        valid_y = y_vals[np.isfinite(y_vals)]
        if len(valid_y) > 0:
            y_min, y_max = np.percentile(valid_y, [2, 98])
            margin = (y_max - y_min) * 0.15 or 1
            ax.set_ylim(y_min - margin, y_max + margin)

        ax.set_xlabel('x', fontsize=12, fontweight='bold')
        ax.set_ylabel('f(x)', fontsize=12, fontweight='bold')
        ax.set_title(f'f(x) = {str(expr)}', color='#e0e0e0', fontsize=14,
                     fontweight='bold', pad=15)
        ax.legend(loc='upper right', facecolor='#1a1a2e', edgecolor='#e0e0e0',
                  labelcolor='#e0e0e0', fontsize=9)

        # Base64
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=150, bbox_inches='tight',
                    facecolor=fig.get_facecolor(), edgecolor='none')
        plt.close(fig)
        buf.seek(0)
        return base64.b64encode(buf.read()).decode('utf-8'), None

    except Exception as e:
        plt.close('all')
        return None, f"Grafik çizim hatası: {str(e)}"
