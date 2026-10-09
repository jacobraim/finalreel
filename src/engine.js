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
  [90, "Built to last", "On paper, this crew could outlast the apocalypse. Now the dice get a say."],
  [75, "Strong contenders", "Most crews would kill for these odds. Don't get cocky."],
  [50, "Better than a coin flip", "A solid crew with a couple of soft spots the horde will find."],
  [25, "Long shot", "There's a path to Day 100. It's narrow, and it's dark."],
  [10, "Grim forecast", "It'll take some lucky rolls to get anyone out of this alive."],
  [0,  "The zombies like these odds", "This crew needs a miracle. Still, dice are dice."],
];
function verdict(pct) { return VERDICTS.find(v => pct >= v[0]); }

const WEAK_LINES = [
  "Biggest worry: nobody is really in charge, and crews like that split up.",
  "Biggest worry: nobody here can fix the radio, the generator, or the plan.",
  "Biggest worry: when the fence comes down, nobody can hold the door.",
  "Biggest worry: there's no backup plan for when everything goes sideways.",
  "Biggest worry: nobody knows the back way out.",
  "Biggest worry: plenty of courage, not a lot of aim.",
];
const STRONG_LINES = [
  "Best asset: a leader who can keep everyone moving in the same direction.",
  "Best asset: brains who can rig the water, the power, and a great alarm system.",
  "Best asset: muscle that clears doorways like it's a hobby.",
  "Best asset: a wildcard who might pull off the move nobody sees coming.",
  "Best asset: a scout who always finds the back way out.",
  "Best asset: a marksman who makes every shot count from the rooftop.",
];
function story(result) {
  const sorted = [...result.rows].sort((a, b) => a.eff - b.eff);
  const lines = [STRONG_LINES[sorted[5].slot]];
  if (sorted[0].eff < 7) lines.push(WEAK_LINES[sorted[0].slot]);
  const tr = result.rows.find(r => r.char.traits.includes("traitor") && result.rows.some(o => o.mods.some(m => m[0].startsWith("Can't trust"))));
  if (tr) lines.push("Keep an eye on " + tr.char.name + ". They may not be fully on your side.");
  return lines;
}

// ---------- Fate roll (random) ----------
// Each member rolls against their own odds: the team's odds, nudged up or down by how well they fit their role.
const FATE_DEATHS = [
  ["went to scout for a new leader's hideout and never came back", "tried to rally the group from the front line, and the front line moved"],
  ["went back for the research notes", "was sure the cure would work and tested it on themselves"],
  ["held the door so everyone else could run", "took on one zombie too many in the stairwell"],
  ["tried something truly unexpected. It did not work", "pressed the big red button to see what it does"],
  ["took the shortcut through the hospital", "scouted one block too far on a supply run"],
  ["ran out of ammo on the rooftop", "stayed behind to cover the retreat"],
];
const FATE_GENERIC_DEATHS = [
  "got bitten on a midnight snack run",
  "trusted a stranger at the gas station",
  "said \"I'll be right back\"",
  "fell asleep on watch",
  "went into the basement alone",
  "stopped to pet a very suspicious dog",
];
const FATE_LIVES = [
  "made it to Day 100 with a story for every scar",
  "made it to the safe zone without a scratch",
  "ended up running the new settlement",
  "survived and still won't talk about the mall",
  "made it out, barely, and somehow kept their sense of humor",
  "lived to see the first harvest at the farm",
];
function fateOdds(result) {
  const P = Math.min(0.99, Math.max(0.01, result.pct / 100));
  const base = Math.log(P / (1 - P));
  const mean = result.rows.reduce((s, r) => s + r.eff, 0) / result.rows.length;
  return result.rows.map(r => {
    let x = base + 0.5 * (r.eff - mean);
    if (r.char.traits.includes("survivor")) x += 0.4;
    if (r.char.traits.includes("reckless")) x -= 0.4;
    return Math.min(0.99, Math.max(0.01, 1 / (1 + Math.exp(-x))));
  });
}
function rollFate(result, rng) {
  rng = rng || Math.random;
  const pick = a => a[Math.floor(rng() * a.length)];
  const odds = fateOdds(result);
  return result.rows.map((r, i) => {
    const lived = rng() < odds[i];
    let line;
    if (lived) line = pick(FATE_LIVES);
    else if (r.char.traits.includes("traitor") && rng() < 0.6) line = "tried to sell out the group and got left outside the gate";
    else if (r.char.traits.includes("reckless") && rng() < 0.6) line = "ran toward the horde instead of away from it";
    else line = rng() < 0.5 ? pick(FATE_DEATHS[r.slot]) : pick(FATE_GENERIC_DEATHS);
    return { slot: r.slot, lived, day: lived ? 100 : 1 + Math.floor(rng() * 60), line, p: Math.round(odds[i] * 100) };
  });
}
const FATE_VERDICTS = ["Total wipeout", "Last one standing", "A few made it", "A few made it", "Most of the crew made it", "Most of the crew made it", "Everybody made it"];

if (typeof module !== "undefined") module.exports = { scoreTeam, verdict, story, TUNE, fateOdds, rollFate, FATE_VERDICTS };
