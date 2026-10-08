const { FILMS, ROLES } = require("./data.js");
const E = require("./engine.js");
if (process.argv[2]) E.TUNE.T = +process.argv[2];
if (process.argv[3]) E.TUNE.k = +process.argv[3];

function rnd(n) { return Math.floor(Math.random() * n); }
function play(strategy) {
  const team = Array(6).fill(null), used = new Set(), names = new Set();
  let reshoots = 2;
  const spin = () => { let f; do { f = rnd(FILMS.length); } while (used.has(f)); used.add(f); return FILMS[f]; };
  for (let pick = 0; pick < 6; pick++) {
    let film = spin();
    while (true) {
      const opts = [];
      film.chars.forEach(c => { if (names.has(c.name)) return; team.forEach((t, s) => { if (!t) opts.push([c, s]); }); });
      if (strategy === "random") { const o = opts[rnd(opts.length)]; team[o[1]] = o[0]; names.add(o[0].name); break; }
      const val = ([c, s]) => {
        let v = c.scores[s];
        if (strategy === "expert") {
          if (c.traits.includes("traitor")) v -= 2.5;
          if (c.traits.includes("loner") && s < 4) v -= 1;
          if (c.traits.includes("survivor")) v += 1;
          if (c.traits.includes("ego") && team.some(t => t && t.traits.includes("ego"))) v -= 2;
          if (c.traits.includes("heart")) v += 0.5;
        }
        return v;
      };
      opts.sort((a, b) => val(b) - val(a));
      const thr = strategy === "expert" ? 7.5 : 7;
      if (val(opts[0]) < thr && reshoots > 0) { reshoots--; film = spin(); continue; }
      team[opts[0][1]] = opts[0][0]; names.add(opts[0][0].name); break;
    }
  }
  return E.scoreTeam(team, FILMS, ROLES).pct;
}
function stats(arr) {
  arr.sort((a, b) => a - b);
  const q = p => arr[Math.floor(p * (arr.length - 1))];
  const mean = arr.reduce((s, x) => s + x, 0) / arr.length;
  return `mean ${mean.toFixed(1)}  p10 ${q(.1)}  p50 ${q(.5)}  p90 ${q(.9)}  p99 ${q(.99)}  >=50%: ${(arr.filter(x => x >= 50).length / arr.length * 100).toFixed(1)}%  >=90%: ${(arr.filter(x => x >= 90).length / arr.length * 100).toFixed(2)}%`;
}
const N = 20000;
for (const s of ["random", "greedy", "expert"]) console.log(s.padEnd(7), stats(Array.from({ length: N }, () => play(s))));

// Dream team via hill climbing over all characters
const all = FILMS.flatMap(f => f.chars);
let best = 0, bestTeam;
for (let r = 0; r < 300; r++) {
  let team = []; const fs = new Set();
  while (team.length < 6) { const c = all[rnd(all.length)]; if (!fs.has(c.film)) { team.push(c); fs.add(c.film); } }
  let cur = E.scoreTeam(team, FILMS, ROLES).C;
  for (let it = 0; it < 4000; it++) {
    const t2 = team.slice(); const i = rnd(6);
    if (Math.random() < 0.5) { const j = rnd(6); [t2[i], t2[j]] = [t2[j], t2[i]]; }
    else t2[i] = all[rnd(all.length)];
    const films = new Set(t2.map(c => c.film)), nm = new Set(t2.map(c => c.name));
    if (films.size < 6 || nm.size < 6) continue;
    const v = E.scoreTeam(t2, FILMS, ROLES).C;
    if (v >= cur) { cur = v; team = t2; }
  }
  if (cur > best) { best = cur; bestTeam = team; }
}
const br = E.scoreTeam(bestTeam, FILMS, ROLES);
console.log("dream", br.pct, br.C.toFixed(2), bestTeam.map((c, i) => ROLES[i].name + ":" + c.name).join(", "));
