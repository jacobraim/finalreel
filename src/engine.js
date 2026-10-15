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
  [ // Leader
    "went to scout for a new hideout and never came back",
    "tried to rally the group from the front line, and the front line moved",
    "refused to leave anyone behind, including the one who was already bitten",
    "gave a big speech on the roof. The horde heard every word",
    "split the group up to cover more ground. Classic mistake",
    "volunteered to go first, every time, until the last time",
  ],
  [ // Brains
    "went back for the research notes",
    "was sure the cure would work and tested it on themselves",
    "tried to study a zombie up close. Very close",
    "got the radio working, and something answered",
    "was rewiring the generator when the lights came back on",
    "insisted the map was right. The map was wrong",
  ],
  [ // Brawn
    "held the door so everyone else could run",
    "took on one zombie too many in the stairwell",
    "tried to bench-press a car off the barricade",
    "punched first and counted later. There were forty of them",
    "carried the wounded to safety, then went back for more",
    "wrestled the big one off the bridge and went over with it",
  ],
  [ // Wildcard
    "tried something truly unexpected. It did not work",
    "pressed the big red button to see what it does",
    "wandered off chasing a weird noise. It was a zombie",
    "tried to tame one as a pet",
    "bet everything on a plan nobody else understood",
    "improvised at the worst possible moment",
  ],
  [ // Scout
    "took the shortcut through the hospital",
    "scouted one block too far on a supply run",
    "climbed the water tower for a better view. So did they",
    "checked the last room on the floor. It was occupied",
    "went quiet on the radio and never checked back in",
    "found the back way out. It was a dead end",
  ],
  [ // Marksman
    "ran out of ammo on the rooftop",
    "stayed behind to cover the retreat",
    "took the long shot and missed for the first time ever",
    "had their weapon jam at exactly the wrong moment",
    "went looking for more ammo at the sporting goods store",
    "drew the whole horde with one very loud shot",
  ],
];
const FATE_GENERIC_DEATHS = [
  "got bitten on a midnight snack run",
  "trusted a stranger at the gas station",
  "said \"I'll be right back\"",
  "fell asleep on watch",
  "went into the basement alone",
  "stopped to pet a very suspicious dog",
  "ran back into the house for one last thing",
  "hid a bite for two days. Bad call",
  "went to check on that noise",
  "lost the coin toss for night watch",
  "tripped. In the movies, someone always trips",
  "split off to find a working car",
  "got stuck in a revolving door",
  "opened the door for someone who wasn't really someone anymore",
  "took a nap in the back of the van. The van got surrounded",
  "went for a swim in the quarry. Zombies can't swim, everyone said",
];
const FATE_TRAIT_DEATHS = {
  traitor: [
    "tried to sell out the group and got left outside the gate",
    "stole the truck and drove straight into a horde",
    "cut a deal with a rival crew. The rival crew kept the truck",
  ],
  reckless: [
    "ran toward the horde instead of away from it",
    "jumped the fence to prove a point",
    "decided the safe plan was boring",
  ],
  heart: [
    "gave up their seat on the last truck so someone else could live",
    "went back for a friend and didn't make it out",
    "gave away the last of the food and the last of their luck",
  ],
  loner: [
    "decided they'd be safer on their own. They were not",
    "slipped away in the night without telling anyone",
  ],
  ego: [
    "refused to take orders and went their own way",
    "insisted on doing it alone so they'd get the credit",
  ],
};
const FATE_ROLE_LIVES = [
  ["ended up running the new settlement", "got everyone to the coast and onto the last boat"],
  ["helped engineer the first working cure", "kept the lights on at the safe zone for a whole year"],
  ["built the wall around the farm by hand", "became the settlement's head of security"],
  ["survived by doing something nobody can explain", "somehow ended up with a pet zombie on a leash"],
  ["mapped every safe road from here to the coast", "found the island with no zombies on it"],
  ["never missed, not once, all the way to Day 100", "kept the wall clear from the bell tower"],
];
const FATE_LIVES = [
  "made it to Day 100 with a story for every scar",
  "made it to the safe zone without a scratch",
  "survived and still won't talk about the mall",
  "made it out, barely, and somehow kept their sense of humor",
  "lived to see the first harvest at the farm",
  "talked their way onto the last helicopter",
  "learned to farm and never looked back",
  "made it to Day 100 and threw a party",
  "got out with one shoe and zero regrets",
  "survived on canned peaches and spite",
  "came through the whole thing without a single bite",
  "was the last one across the bridge before it blew",
  "hid in a movie theater for a month and watched everything twice",
  "walked out of the city on Day 100 like nothing happened",
];
const FATE_TRAIT_LIVES = {
  survivor: ["did what they always do and lived through it", "has survived worse, and said so constantly"],
  heart: ["kept everyone's spirits up all the way to Day 100"],
  loner: ["vanished into the woods and turned up fine a year later"],
};
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
  const used = new Set();
  // Pick a line nobody else in this roll has used yet
  const pick = list => {
    const open = list.filter(l => !used.has(l));
    if (!open.length) return null;
    const l = open[Math.floor(rng() * open.length)];
    used.add(l);
    return l;
  };
  const traitList = (table, traits) => traits.flatMap(t => table[t] || []);
  const odds = fateOdds(result);
  return result.rows.map((r, i) => {
    const lived = rng() < odds[i];
    const traits = r.char.traits;
    let line = null;
    if (lived) {
      const tl = traitList(FATE_TRAIT_LIVES, traits);
      if (tl.length && rng() < 0.35) line = pick(tl);
      if (!line && rng() < 0.45) line = pick(FATE_ROLE_LIVES[r.slot]);
      if (!line) line = pick(FATE_LIVES);
    } else {
      const td = traitList(FATE_TRAIT_DEATHS, traits);
      if (td.length && rng() < 0.5) line = pick(td);
      if (!line && rng() < 0.55) line = pick(FATE_DEATHS[r.slot]);
      if (!line) line = pick(FATE_GENERIC_DEATHS) || pick(FATE_DEATHS[r.slot]);
    }
    return { slot: r.slot, lived, day: lived ? 100 : 1 + Math.floor(rng() * 60), line, p: Math.round(odds[i] * 100) };
  });
}
const FATE_VERDICTS = ["Total wipeout", "Last one standing", "A few made it", "A few made it", "Most of the crew made it", "Most of the crew made it", "Everybody made it"];

if (typeof module !== "undefined") module.exports = { scoreTeam, verdict, story, TUNE, fateOdds, rollFate, FATE_VERDICTS };
