"""Batch gradient descent for unconstrained minimization.

Given a differentiable function f(x) and its gradient, repeatedly steps in
the direction of steepest descent until the gradient is small enough (or a
step budget runs out).
"""

from dataclasses import dataclass, field


@dataclass
class GradientDescentResult:
    x: list[float]
    value: float
    iterations: int
    converged: bool
    history: list[list[float]] = field(default_factory=list)


def gradient_descent(
    grad_f,
    x0,
    f=None,
    learning_rate: float = 0.1,
    tolerance: float = 1e-8,
    max_iterations: int = 10_000,
):
    """Minimize a function given its gradient via fixed-step gradient descent.

    Args:
        grad_f: function mapping a point (list of floats) to its gradient
            (list of floats of the same length).
        x0: starting point.
        f: optional objective function, used only to report the final value
            and to record a per-step history for plotting/inspection.
        learning_rate: fixed step size.
        tolerance: stop once the gradient's magnitude drops below this.
        max_iterations: hard cap so a bad learning rate can't loop forever.

    Returns:
        GradientDescentResult with the final point, its value (if `f` was
        given), how many steps were taken, whether it converged before
        hitting max_iterations, and the path taken.
    """
    x = list(x0)
    history = [list(x)]

    for iteration in range(1, max_iterations + 1):
        grad = grad_f(x)
        grad_norm = sum(g * g for g in grad) ** 0.5

        if grad_norm < tolerance:
            return GradientDescentResult(
                x=x,
                value=f(x) if f else None,
                iterations=iteration - 1,
                converged=True,
                history=history,
            )

        x = [xi - learning_rate * gi for xi, gi in zip(x, grad)]
        history.append(list(x))

    return GradientDescentResult(
        x=x,
        value=f(x) if f else None,
        iterations=max_iterations,
        converged=False,
        history=history,
    )
