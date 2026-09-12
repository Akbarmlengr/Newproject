"""Run gradient descent on a simple bowl-shaped function and show it converge.

f(x, y) = (x - 3)^2 + (y + 5)^2
The minimum is obviously at (3, -5) with value 0 -- gradient descent should
find that without being told the answer, just from the slope at each point.
"""

from gradient_descent import gradient_descent


def f(point):
    x, y = point
    return (x - 3) ** 2 + (y + 5) ** 2


def grad_f(point):
    x, y = point
    return [2 * (x - 3), 2 * (y + 5)]


def main():
    result = gradient_descent(grad_f, x0=[0.0, 0.0], f=f, learning_rate=0.1)

    print(f"Converged: {result.converged}")
    print(f"Iterations: {result.iterations}")
    print(f"Final point: ({result.x[0]:.4f}, {result.x[1]:.4f})")
    print(f"Final value: {result.value:.8f}")
    print()
    print("First few steps:")
    for step in result.history[:5]:
        print(f"  ({step[0]:.4f}, {step[1]:.4f})")
    print("...")
    print(f"  ({result.history[-1][0]:.4f}, {result.history[-1][1]:.4f})")


if __name__ == "__main__":
    main()
