import math

from gradient_descent import gradient_descent


def test_converges_on_simple_bowl():
    def grad_f(point):
        x, y = point
        return [2 * (x - 3), 2 * (y + 5)]

    result = gradient_descent(grad_f, x0=[0.0, 0.0], learning_rate=0.1)

    assert result.converged
    assert math.isclose(result.x[0], 3.0, abs_tol=1e-4)
    assert math.isclose(result.x[1], -5.0, abs_tol=1e-4)


def test_reports_objective_value_when_given():
    def f(point):
        (x,) = point
        return (x - 2) ** 2

    def grad_f(point):
        (x,) = point
        return [2 * (x - 2)]

    result = gradient_descent(grad_f, x0=[10.0], f=f, learning_rate=0.2)

    assert result.converged
    assert math.isclose(result.value, 0.0, abs_tol=1e-6)


def test_stops_at_max_iterations_if_not_converged():
    def grad_f(point):
        (x,) = point
        return [2 * (x - 100)]

    # A tiny learning rate combined with a small iteration budget should not
    # be enough to reach the minimum -- this checks the non-convergent path.
    result = gradient_descent(grad_f, x0=[0.0], learning_rate=1e-6, max_iterations=5)

    assert not result.converged
    assert result.iterations == 5


def test_history_records_every_step():
    def grad_f(point):
        (x,) = point
        return [2 * (x - 1)]

    result = gradient_descent(grad_f, x0=[0.0], learning_rate=0.1, max_iterations=3)

    # history includes the starting point plus one entry per step taken
    assert len(result.history) == result.iterations + 1
    assert result.history[0] == [0.0]
