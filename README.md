# Runoff

Group decisions fail socially, not mathematically: nobody wants to be the one who
picked the restaurant everyone hated. Runoff moves the decision to ranked-choice
voting on a single phone - everyone taps their preference order, then instant-runoff
elimination rounds find the option with real majority support, with every round shown
so the group can see *why* the winner won.

- Pass-the-phone ballot collection (tap to rank, partial rankings fine)
- Instant-runoff rounds visualized: counts, bars, eliminations, vote redistribution
- Handles dead ties honestly (reports them instead of silently picking)
- No signup, nothing to install - pure static HTML/JS
- `engine.js` holds the IRV tally as a pure function, shared between the app and node tests

## Use it

Open `index.html`, or visit the deployed site.

## Run locally

Any static server works:

```
python3 -m http.server
```

Then open http://localhost:8000/.

## Engine tests

The node suite covers round-1 majorities, vote redistribution after elimination,
tied-last elimination (eliminated together), exhausted ballots, dead ties, partial
rankings skipping eliminated options, single-option races, and empty input.
