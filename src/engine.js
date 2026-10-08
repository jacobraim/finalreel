// Deterministic survival engine. team: array of 6 (one per ROLES index) of character objects.
const TUNE = { T: 8.4, k: 1.3, wAvg: 0.65, wMin: 0.35 };

function scoreTeam(team, FILMS, ROLES) {
  const leaderBase = team[0].scores[0];
  const leaderIsTraitor = team[0].traits.includes("traitor");
  const egoCount = team.filter(c => c.traits.includes("ego")).length;
  const genres = new Set(team.map(c => FILMS[c.film].genre));
  const crossover = genres.size === 5;

  const rows = team.map((c, slot) => {
    const base = c.scores[slot];
    const mods = [];
    const t = c.traits;
    if (t.includes("survivor")) mods.push(["Seen this before", +1]);
    if (t.includes("reckless") && leaderBase < 8) mods.push(["Reckless, no strong leader", -1.5]);
    if (t.includes("loner") && slot !== 4 && slot !== 5) mods.push(["Loner stuck in a group role", -1]);
    if (t.includes("ego") && egoCount >= 2) mods.push(["Clashing egos", -1.5]);
    // traitors on the team
    let tr = 0;
    team.forEach((o, j) => {
      if (j === slot || !o.traits.includes("traitor")) return;
      const checked = j !== 0 && !leaderIsTraitor && leaderBase >= 9;
      if (!checked) tr += 0.75;
    });
    if (tr) mods.push(["Can't trust " + (tr > 0.75 ? "the traitors" : "the traitor"), -tr]);
    // heart
    let h = 0;
    team.forEach((o, j) => { if (j !== slot && o.traits.includes("heart")) h += 0.4; });
    if (h) mods.push(["Morale boost", Math.min(h, 0.8)]);
    const fr = FILMS[c.film].franchise;
    if (fr && team.some((o, j) => j !== slot && FILMS[o.film].franchise === fr)) mods.push(["Franchise reunion", +0.5]);
    if (crossover) mods.push(["Crossover event", +0.4]);
    const raw = base + mods.reduce((s, m) => s + m[1], 0);
    const eff = Math.max(0, Math.min(11, raw));
    return { char: c, slot, base, mods, eff };
  });

  const wsum = ROLES.reduce((s, r) => s + r.w, 0);
  const avg = rows.reduce((s, r) => s + r.eff * ROLES[r.slot].w, 0) / wsum;
  const min = Math.min(...rows.map(r => r.eff));
  const C = TUNE.wAvg * avg + TUNE.wMin * min;
  const p = 1 / (1 + Math.exp(-TUNE.k * (C - TUNE.T)));
  const pct = Math.round(p * 1000) / 10;
  return { rows, avg, min, C, pct, crossover };
}

const VERDICTS = [
  [90, "Apocalypse? What apocalypse?", "You didn't just survive. You rebuilt society and started a farmers market."],
  [75, "Rebuilt civilization", "A walled town, working generators, and a weekly movie night."],
  [50, "Held the line", "Battered, short on supplies, but still standing at the barricade."],
  [25, "Coin flip at the barricade", "Some nights you hold, some nights you run. Mostly you run."],
  [10, "Didn't make it past week one", "The plan looked great on paper. The zombies did not read the paper."],
  [0,  "Zombie chow", "It was over before the opening credits finished."],
];
function verdict(pct) { return VERDICTS.find(v => pct >= v[0]); }

const WEAK_LINES = [
  "Nobody took charge, and the group split up on Day 2. You know how that goes.",
  "Nobody could figure out how to fix the radio, the generator, or the plan.",
  "When the horde broke through the fence, nobody could hold the door.",
  "Nobody had a trick up their sleeve when the plan fell apart on Day 4.",
  "Nobody scouted the mall before you moved in. It was not empty.",
  "Plenty of courage, not a lot of aim. The ammo ran out fast.",
];
const STRONG_LINES = [
  "Your leader kept everyone moving in the same direction, which is rarer than you'd think.",
  "Your brains rigged the water, the power, and a truly great alarm system.",
  "Your muscle cleared doorways like it was a hobby.",
  "Your wildcard pulled off the move nobody saw coming, and it saved everyone.",
  "Your scout always found the back way out.",
  "Your marksman made every shot count from the rooftop.",
];
function story(result) {
  const sorted = [...result.rows].sort((a, b) => a.eff - b.eff);
  const lines = [STRONG_LINES[sorted[5].slot]];
  if (sorted[0].eff < 7) lines.push(WEAK_LINES[sorted[0].slot]);
  const tr = result.rows.find(r => r.char.traits.includes("traitor") && result.rows.some(o => o.mods.some(m => m[0].startsWith("Can't trust"))));
  if (tr) lines.push(tr.char.name + " was never fully on your side.");
  return lines;
}

if (typeof module !== "undefined") module.exports = { scoreTeam, verdict, story, TUNE };
