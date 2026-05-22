import sympy
from sympy import *
x = symbols('x', real=True)
expr = sympify("sin(pi*cos(x))")
domain = Interval(0, 2 * pi)
temp_roots = set()
if expr.func == sin:
    u = expr.args[0]
    for k in range(-10, 11):
        eq = u - k * pi
        s = solveset(eq, x, domain)
        print(f"k={k}: {s}")
        if isinstance(s, FiniteSet):
            temp_roots.update(list(s))
print(temp_roots)
