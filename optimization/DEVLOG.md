# Dev Log — Optimization

A day-by-day, plain-language log of building this project. No jargon
required to follow along — the goal is that anyone can read an entry and
understand what got built and why.

---

## Day 1 — 2026-09-12

**What this project is:** A hands-on way to actually learn how optimization
algorithms work, by building each one from scratch instead of just calling a
library function and trusting it.

**What "optimization" means here:** Lots of real problems boil down to
"find the input that makes this number as small (or as large) as possible" —
the cheapest route, the most accurate model, the least wasted material.
Optimization algorithms are the general-purpose recipes for finding that
best input, even when there's no way to just solve for it directly.

**What I built today:** The first algorithm — **gradient descent** — one of
the most widely used optimization methods (it's literally how most machine
learning models are trained).

- **The core idea:** if you're standing on a hilly landscape and want to
  reach the lowest point, the simplest strategy is: look at which direction
  is downhill from where you're standing, take a step that way, and repeat.
  Gradient descent is exactly that, expressed as math — the "slope" at any
  point is called the gradient, and it always points toward the steepest
  increase, so stepping in the *opposite* direction walks downhill.
- **The implementation** (`gradient_descent/gradient_descent.py`) takes a
  starting point and a function that reports the slope at any point, then
  repeatedly steps downhill until the slope is nearly flat (meaning it's
  found a minimum) or it runs out of allowed steps.
- **A demo** (`demo.py`) runs it on a simple example — a bowl-shaped
  function with a known lowest point — and prints out each step so you can
  watch it walk downhill and land exactly on the right answer.
- **Tests** (`test_gradient_descent.py`) check that it actually reaches the
  known correct answer, that it reports the right final value, and that it
  correctly gives up (rather than hanging forever) if it's not making
  progress fast enough.

**How I checked it worked:** Ran the demo directly and confirmed it landed
on the known correct minimum. Then wrote and ran a small test suite —
4 tests, all passing — covering the normal case, a case with only one
variable, a case designed to *not* converge (to check it stops cleanly
instead of looping forever), and that it records every step it takes along
the way.

**Why start here:** Gradient descent is the simplest of the "walk toward a
better answer" family of algorithms, and most of the fancier ones (the ones
planned next) are built on the same basic idea with an extra trick added —
so this is the right foundation to build on.

**What's next:**
- Simulated annealing — a strategy that sometimes takes a worse step on
  purpose, so it doesn't get stuck in a shallow dip that isn't the true
  lowest point
- Genetic algorithms — an entirely different approach, based on
  "breeding" better and better candidate solutions
- Visualizing the descent path on an actual plot, not just printed numbers

---

<!--
Template for future entries — copy this below the newest entry:

## Day N — YYYY-MM-DD

**What I built today:**
-

**Why:**
-

**What's next:**
-
-->
