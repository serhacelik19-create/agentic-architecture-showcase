from sympy import *
x = symbols('x', real=True)
expr = sin(pi*cos(x))

def layered_trig_roots(expr, var, domain=Interval(0, 2*pi)):
    roots = set()
    n = symbols('n', integer=True)
    if expr.func == sin:
        u = expr.args[0]
        # u = n * pi
        for k in range(-5, 6):
            eq = u - k*pi
            sols = solveset(eq, var, domain)
            if isinstance(sols, FiniteSet):
                roots.update(list(sols))
            else:
                s = solve(eq, var)
                for r in s:
                    if r.is_real and 0 <= float(r) <= 2*float(pi):
                        roots.add(r)
    return roots

print(layered_trig_roots(expr, x))
