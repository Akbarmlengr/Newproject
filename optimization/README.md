# Optimization

A daily-build learning project working through optimization algorithms from
scratch — implementing each one, not just calling a library, so the point is
understanding how they actually work.

See [`DEVLOG.md`](./DEVLOG.md) for a running, plain-language log of what's
been built and why.

## Structure

Each algorithm gets its own folder: the implementation, a small runnable demo
that shows it working on a concrete example, and a test suite.

```
optimization/
  gradient_descent/
    gradient_descent.py   the algorithm itself
    demo.py                run it on a simple example and see it converge
    test_gradient_descent.py
```

## Running things

```bash
cd optimization
pip install -r requirements.txt

cd gradient_descent
python3 demo.py               # see it converge
python3 -m pytest             # run the tests
```

## Algorithms so far

- [x] **Gradient descent** — fixed-step-size descent for a differentiable
  function, given its gradient. See `gradient_descent/`.
- [ ] Simulated annealing
- [ ] Genetic algorithm
- [ ] Linear programming (simplex)

## Current status

Day 1 of daily work. See `DEVLOG.md` for progress.
