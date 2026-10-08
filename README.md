# Final Reel

Spin a movie, draft one of its characters into each of six survival roles (Leader, Brains, Brawn, Medic, Scout, Marksman), and see your odds of surviving the zombie apocalypse. Inspired by Tentpole.

## Play

Open `index.html` in a browser. It's a single static file with no dependencies, so it also works on GitHub Pages, Netlify, or any static host.

## Edit

- `src/data.js` holds the movies, characters, role scores (0-10) and traits.
- `src/engine.js` holds the scoring rules and difficulty (`TUNE`).
- `src/template.html` holds the page layout and game UI.

After editing, rebuild with:

```
node build.js
```

## Tune difficulty

```
node src/sim.js            # current settings
node src/sim.js 9.0 1.8    # try threshold T and steepness k
```

The simulator plays 20,000 games each for random, sensible and expert players, and reports the survival distribution plus a best-possible crew.
