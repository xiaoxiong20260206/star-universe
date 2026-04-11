// =========================================================
// 0.09 M☉ Red Dwarf — Lifecycle Data  (complete lifecycle)
// =========================================================

const PHASES = [
  {
    key: "cloud-core",
    name: "分子云核心",
    ageStartMyr: 0,
    ageEndMyr: 1,
    spanLabel: "0 — 1 百万年",
    state: "引力收缩",
    lumLsun: 0.001,
    tempK: 2400,
    radiusRsun: 0.85,
    color: "#ffb58d",
    halo: "rgba(255,140,90,0.55)",
    note: "气体尘埃在引力作用下坍缩，核心升温，尚未触发稳定核聚变。",
    teach: {
      emoji: "🌌",
      title: "第一章：诞生之前",
      caption:
        "在银河系的某个角落，一大团气体和尘埃悄悄地向中心聚拢。" +
        "这不是一场爆炸，而是一次漫长的「拥抱」。" +
        "核心越来越热，就像你用力捏紧一个气球，气球会发热一样——这颗未来的红矮星正在孕育之中。"
    }
  },
  {
    key: "protostar",
    name: "原恒星阶段",
    ageStartMyr: 1,
    ageEndMyr: 80,
    spanLabel: "1 — 8000 万年",
    state: "预主序收缩",
    lumLsun: 0.004,
    tempK: 2700,
    radiusRsun: 0.62,
    color: "#ffb178",
    halo: "rgba(255,160,95,0.58)",
    note: "原恒星持续缓慢收缩，能量来自引力势能释放，核聚变尚未稳定开启。",
    teach: {
      emoji: "🔥",
      title: "第二章：还差一点点",
      caption:
        "核心温度爬升到几百万度，但就是差那么一步，无法点燃氢聚变的「炉子」。" +
        "对于这颗质量只有太阳 9% 的小星来说，这段等待期长达 8000 万年。" +
        "此时的太阳早已在 40 Myr 时完成收缩，这颗小星还在「预热」中……"
    }
  },
  {
    key: "zams",
    name: "主序点火",
    ageStartMyr: 80,
    ageEndMyr: 300,
    spanLabel: "8000 万 — 3 亿年",
    state: "氢聚变启动",
    lumLsun: 0.008,
    tempK: 2900,
    radiusRsun: 0.24,
    color: "#ff9f66",
    halo: "rgba(255,142,80,0.55)",
    note: "核心温度突破约 400 万 K，质子-质子链聚变稳定开启，正式成为恒星。",
    teach: {
      emoji: "⚡",
      title: "第三章：终于，点火！",
      caption:
        "核心温度突破约 400 万开尔文——「核炉」点燃了！" +
        "四个氢原子融合成一个氦原子，释放出光和热。" +
        "这颗红矮星正式成为一颗「真正的恒星」。" +
        "此刻，它的亮度只有太阳的 1/125，颜色深红，默默燃烧。"
    }
  },
  {
    key: "stable-red-dwarf",
    name: "稳定红矮星",
    ageStartMyr: 300,
    ageEndMyr: 50000,
    spanLabel: "3 亿 — 500 亿年",
    state: "全对流主序",
    lumLsun: 0.011,
    tempK: 3050,
    radiusRsun: 0.125,
    color: "#ff8a55",
    halo: "rgba(255,120,70,0.5)",
    note: "进入超长寿命稳定期，内部完全对流，燃料利用率极高，寿命可达 500 亿年。",
    teach: {
      emoji: "⏳",
      title: "第四章：最漫长的岁月",
      caption:
        "这是它一生中最长的时期——整整 500 亿年！" +
        "因为内部有充分的「搅拌机」（对流），外层的新鲜氢不断补充进核心，燃料利用率远高于太阳。" +
        "在它还在安稳燃烧的时候，太阳早已在约 54 亿年后膨胀成红巨星，然后死去。" +
        "对这颗小星来说，那一切才刚刚开始。"
    }
  },
  {
    key: "late-main-sequence",
    name: "极晚期主序",
    ageStartMyr: 50000,
    ageEndMyr: 180000,
    spanLabel: "500 亿 — 1.8 万亿年",
    state: "缓慢演化",
    lumLsun: 0.014,
    tempK: 3200,
    radiusRsun: 0.105,
    color: "#ff7a45",
    halo: "rgba(255,108,62,0.46)",
    note: "氢燃料逐渐耗尽，亮度和温度缓慢上升，不会膨胀为红巨星。",
    teach: {
      emoji: "🌅",
      title: "第五章：与众不同的老年",
      caption:
        "普通恒星老了会变成巨大的红巨星；但这颗小星质量不够，" +
        "核心的引力无法触发氦燃烧——它不会膨胀，不会爆炸。" +
        "它只是慢慢变稍亮、稍蓝，像一盏煤油灯里的油快用完时，火焰反而最后跳了一下。"
    }
  },
  {
    key: "helium-star",
    name: "氦核暴露期",
    ageStartMyr: 180000,
    ageEndMyr: 210000,
    spanLabel: "1.8 — 2.1 万亿年",
    state: "氢壳层燃烧末期",
    lumLsun: 0.010,
    tempK: 2900,
    radiusRsun: 0.098,
    color: "#ff9055",
    halo: "rgba(255,130,80,0.38)",
    note: "核心氢燃料基本耗尽，仅剩薄薄氢壳层在燃烧，核心变成纯氦。",
    teach: {
      emoji: "🕯️",
      title: "第六章：最后的燃烧",
      caption:
        "核心的氢几乎烧完了，只剩外层薄薄的一圈氢壳还在燃烧，像蜡烛燃到了烛芯。" +
        "核心此时变成了一团致密的氦，不再发光，只靠外壳维持最后的光热。" +
        "这颗恒星在 2 万亿年的时间里，一直没有爆炸，没有戏剧性——只是慢慢地、安静地走向终点。"
    }
  },
  {
    key: "cooling-onset",
    name: "冷却开始",
    ageStartMyr: 210000,
    ageEndMyr: 240000,
    spanLabel: "2.1 — 2.4 万亿年",
    state: "聚变停止",
    lumLsun: 0.002,
    tempK: 2200,
    radiusRsun: 0.09,
    color: "#e87a50",
    halo: "rgba(220,120,80,0.30)",
    note: "聚变反应停止，恒星开始缓慢冷却，进入「白矮星前体」状态。",
    teach: {
      emoji: "🌑",
      title: "第七章：火焰熄灭",
      caption:
        "聚变停止了。没有爆炸，没有爆闪——就这样，安静地熄灭。" +
        "恒星的核心变成一颗温热的氦白矮星，靠着储存的热量向宇宙缓慢散发余温。" +
        "此时的宇宙年龄已是今天的 160 倍以上，这里几乎没有恒星存在了。"
    }
  },
  {
    key: "helium-white-dwarf",
    name: "氦白矮星",
    ageStartMyr: 240000,
    ageEndMyr: 300000,
    spanLabel: "2.4 — 3 万亿年",
    state: "白矮星冷却中",
    lumLsun: 0.0004,
    tempK: 8000,
    radiusRsun: 0.065,
    color: "#c8b0ff",
    halo: "rgba(180,150,255,0.28)",
    note: "核心成为氦白矮星，体积如地球般大小，靠余热发出微弱蓝白光。",
    teach: {
      emoji: "💜",
      title: "第八章：白矮星的孤独",
      caption:
        "它变成了一颗氦白矮星——体积和地球差不多大，密度极高，每立方厘米重约 1 吨。" +
        "它发出微弱的蓝白色光，靠数十亿年前储存的热量缓慢散热。" +
        "周围几乎什么都没有了，宇宙已经无比黑暗和寒冷。"
    }
  },
  {
    key: "black-dwarf",
    name: "黑矮星终态",
    ageStartMyr: 300000,
    ageEndMyr: 380000,
    spanLabel: "3 万亿年以上",
    state: "黑矮星（理论终态）",
    lumLsun: 0.0000001,
    tempK: 400,
    radiusRsun: 0.062,
    color: "#3a3a5c",
    halo: "rgba(60,60,120,0.12)",
    note: "温度接近宇宙背景温度，几乎完全不发光，成为黑矮星，永远漂流于宇宙中。",
    teach: {
      emoji: "🌑",
      title: "终章：黑矮星——永恒的沉默",
      caption:
        "最终，它变成了一颗「黑矮星」——一块沉默、冰冷、密实的氦球，" +
        "漂浮在几乎空无一物的宇宙深处。" +
        "它不爆炸，不消失，只是安静地存在着，直到宇宙本身都不再有意义。" +
        "注：目前宇宙的年龄约 138 亿年，距离任何恒星变成黑矮星还差千倍以上的时间。" +
        "黑矮星是一种理论存在，宇宙中目前还没有任何一颗。"
    }
  }
];

// =========================================================
// Sun (1.0 M☉) reference phases  (for comparison mode)
// =========================================================
const SUN_PHASES = [
  {
    key: "sun-cloud",
    name: "分子云",
    ageStartMyr: 0,
    ageEndMyr: 1,
    state: "引力收缩",
    lumLsun: 0.001,
    tempK: 3000,
    radiusRsun: 3.5,
    color: "#ffe066",
    halo: "rgba(255,220,80,0.55)",
    diff: "两者此刻差别不大",
    diffSun: "质量更大，收缩更快"
  },
  {
    key: "sun-protostar",
    name: "原恒星",
    ageStartMyr: 1,
    ageEndMyr: 40,
    state: "预主序收缩",
    lumLsun: 0.8,
    tempK: 4500,
    radiusRsun: 1.5,
    color: "#ffd04a",
    halo: "rgba(255,210,80,0.58)",
    diff: "比红矮星亮 200 倍",
    diffSun: "收缩期仅 4000 万年"
  },
  {
    key: "sun-zams",
    name: "主序点火",
    ageStartMyr: 40,
    ageEndMyr: 200,
    state: "稳定主序",
    lumLsun: 1.0,
    tempK: 5778,
    radiusRsun: 1.0,
    color: "#ffce45",
    halo: "rgba(255,210,70,0.55)",
    diff: "红矮星亮度仅为太阳1%",
    diffSun: "太阳温度是红矮星近两倍"
  },
  {
    key: "sun-main-seq",
    name: "稳定主序",
    ageStartMyr: 200,
    ageEndMyr: 10000,
    state: "氢燃烧",
    lumLsun: 1.1,
    tempK: 5780,
    radiusRsun: 1.0,
    color: "#ffca40",
    halo: "rgba(255,205,65,0.5)",
    diff: "红矮星才刚刚「点火」",
    diffSun: "太阳已燃烧约 50 亿年"
  },
  {
    key: "sun-red-giant",
    name: "红巨星膨胀",
    ageStartMyr: 10000,
    ageEndMyr: 11200,
    state: "红巨星",
    lumLsun: 2300,
    tempK: 3700,
    radiusRsun: 170,
    color: "#ff8c33",
    halo: "rgba(255,120,50,0.62)",
    diff: "红矮星此刻还非常年轻",
    diffSun: "太阳膨胀吞噬地球轨道"
  },
  {
    key: "sun-planetary-nebula",
    name: "行星状星云",
    ageStartMyr: 11200,
    ageEndMyr: 11500,
    state: "外壳抛射",
    lumLsun: 500,
    tempK: 25000,
    radiusRsun: 12000,
    color: "#ff99ff",
    halo: "rgba(255,150,255,0.45)",
    diff: "红矮星仍安静燃烧中",
    diffSun: "太阳外层变成美丽星云"
  },
  {
    key: "sun-white-dwarf",
    name: "白矮星",
    ageStartMyr: 11500,
    ageEndMyr: 380000,
    state: "碳氧白矮星冷却",
    lumLsun: 0.0005,
    tempK: 10000,
    radiusRsun: 0.012,
    color: "#c8d8ff",
    halo: "rgba(180,210,255,0.28)",
    diff: "红矮星还将燃烧数千亿年",
    diffSun: "太阳已成白矮星并冷却"
  }
];

// =========================================================
// DOM refs
// =========================================================
const progressEl   = document.getElementById("progress");
const playBtn      = document.getElementById("playBtn");
const resetBtn     = document.getElementById("resetBtn");
const speedSelect  = document.getElementById("speedSelect");

const stageTitleEl = document.getElementById("stageTitle");
const stageSpanEl  = document.getElementById("stageSpan");
const stageNoteEl  = document.getElementById("stageNote");
const ageTagEl     = document.getElementById("ageTag");

const metricAgeEl    = document.getElementById("metricAge");
const metricLumEl    = document.getElementById("metricLum");
const metricTempEl   = document.getElementById("metricTemp");
const metricRadiusEl = document.getElementById("metricRadius");
const metricStateEl  = document.getElementById("metricState");

const starCoreEl       = document.getElementById("starCore");
const starHaloEl       = document.getElementById("starHalo");
const timelineStopsEl  = document.getElementById("timelineStops");

// teach mode
const teachBtn     = document.getElementById("teachBtn");
const teachBar     = document.getElementById("teachBar");
const teachEmojiEl = document.getElementById("teachEmoji");
const teachTitleEl = document.getElementById("teachTitle");
const teachCaptionEl = document.getElementById("teachCaption");

// compare mode
const compareBtn   = document.getElementById("compareBtn");
const sunWrap      = document.getElementById("sunWrap");
const comparePanel = document.getElementById("comparePanel");
const sunCoreEl    = document.getElementById("sunCore");
const sunHaloEl    = document.getElementById("sunHalo");
const sunAgeTagEl  = document.getElementById("sunAgeTag");
const compareRedDwarfEl = document.getElementById("compareRedDwarf");
const compareSunEl = document.getElementById("compareSun");
const sceneLabelEls = document.querySelectorAll(".scene-label");

// ending overlay
const endingOverlay = document.getElementById("endingOverlay");

// =========================================================
// State
// =========================================================
const MAX = 1000;
let progress  = 0;
let playing   = false;
let speed     = 1;
let rafId     = null;
let teachMode = true;
let compareMode = false;

// =========================================================
// Helpers
// =========================================================
const GLOBAL_AGE_END_MYR = PHASES[PHASES.length - 1].ageEndMyr;

function buildRanges(phases) {
  const MIN_PHASE_SPAN = Math.ceil(MAX / phases.length / 2);
  let cursor = 0;
  return phases.map((phase, idx) => {
    const rawEnd = Math.round((phase.ageEndMyr / GLOBAL_AGE_END_MYR) * MAX);
    const start = cursor;
    const end = Math.min(
      MAX,
      idx === phases.length - 1 ? MAX : Math.max(cursor + MIN_PHASE_SPAN, rawEnd)
    );
    cursor = end;
    return { start, end };
  });
}

const PHASE_RANGES     = buildRanges(PHASES);
const SUN_PHASE_RANGES = buildRanges(SUN_PHASES);

function lerp(a, b, t) { return a + (b - a) * t; }

function hexToRgb(hex) {
  const v = hex.replace("#", "");
  return {
    r: parseInt(v.substring(0, 2), 16),
    g: parseInt(v.substring(2, 4), 16),
    b: parseInt(v.substring(4, 6), 16)
  };
}

function mixColor(c1, c2, t) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return `rgb(${Math.round(lerp(a.r,b.r,t))},${Math.round(lerp(a.g,b.g,t))},${Math.round(lerp(a.b,b.b,t))})`;
}

function getPhaseIndexByProgress(ranges, value) {
  return ranges.findIndex((r, idx) => {
    if (idx === ranges.length - 1) return value >= r.start && value <= r.end;
    return value >= r.start && value < r.end;
  });
}

function formatAge(myr) {
  if (myr < 1000)   return `${myr.toFixed(1)} Myr`;
  const gyr = myr / 1000;
  if (gyr < 1000)   return `${gyr.toFixed(2)} Gyr`;
  const tyr = gyr / 1000;
  return `${tyr.toFixed(2)} Tyr（万亿年）`;
}

function formatLum(lsun) {
  if (lsun < 0.0001) return `${(lsun * 1e6).toFixed(2)} × 10⁻⁶ L☉`;
  if (lsun < 0.01)   return `${lsun.toFixed(5)} L☉`;
  if (lsun < 10)     return `${lsun.toFixed(3)} L☉`;
  return `${lsun.toFixed(0)} L☉`;
}

// =========================================================
// Ending overlay
// =========================================================
let endingShown = false;

function showEnding() {
  if (!endingShown) {
    endingShown = true;
    endingOverlay.classList.add("visible");
  }
}

function hideEnding() {
  endingShown = false;
  endingOverlay.classList.remove("visible");
}

// =========================================================
// Timeline stops
// =========================================================
function buildTimelineStops() {
  timelineStopsEl.innerHTML = PHASES
    .map((phase, idx) => `<span class="timeline-stop" data-stop="${idx}">${phase.name}</span>`)
    .join("");
}

function updateTimelineActive(index) {
  timelineStopsEl.querySelectorAll(".timeline-stop").forEach((el) => {
    el.classList.toggle("active", Number(el.dataset.stop) === index);
  });
}

// =========================================================
// Render: red dwarf
// =========================================================
function renderRedDwarf(value) {
  const phaseIdx = getPhaseIndexByProgress(PHASE_RANGES, value);
  const phase    = PHASES[phaseIdx];
  const next     = PHASES[Math.min(phaseIdx + 1, PHASES.length - 1)];
  const range    = PHASE_RANGES[phaseIdx];
  const localT   = range.end === range.start ? 0 : (value - range.start) / (range.end - range.start);

  const age    = lerp(phase.ageStartMyr, phase.ageEndMyr, localT);
  const lum    = lerp(phase.lumLsun,    next.lumLsun,    localT * 0.3);
  const temp   = lerp(phase.tempK,      next.tempK,      localT * 0.3);
  const radius = lerp(phase.radiusRsun, next.radiusRsun, localT * 0.3);
  const color  = mixColor(phase.color, next.color, localT * 0.4);

  // Special: black dwarf is nearly invisible
  const isBlackDwarf = phase.key === "black-dwarf";
  const opacity = isBlackDwarf ? Math.max(0.05, 1 - localT * 0.92) : 1;

  const size     = Math.max(32, Math.min(172, 30 + radius * 380));
  const haloSize = size * 2.55;

  stageTitleEl.textContent = phase.name;
  stageSpanEl.textContent  = phase.spanLabel;
  stageNoteEl.textContent  = phase.note;
  ageTagEl.textContent     = `年龄：${formatAge(age)}`;

  metricAgeEl.textContent    = formatAge(age);
  metricLumEl.textContent    = formatLum(lum);
  metricTempEl.textContent   = `${Math.round(temp)} K`;
  metricRadiusEl.textContent = `${radius.toFixed(3)} R☉`;
  metricStateEl.textContent  = phase.state;

  starCoreEl.style.width   = `${size}px`;
  starCoreEl.style.height  = `${size}px`;
  starCoreEl.style.opacity = String(opacity);

  if (isBlackDwarf) {
    starCoreEl.style.background  = `radial-gradient(circle at 38% 30%, #2a2a4a 0%, ${color} 60%, #0a0a18 100%)`;
    starCoreEl.style.boxShadow   = `0 0 ${Math.round(size * 0.3)}px rgba(60,60,120,0.18)`;
    starHaloEl.style.background  = `radial-gradient(circle, rgba(60,60,120,0.1) 0%, transparent 70%)`;
  } else {
    starCoreEl.style.background  = `radial-gradient(circle at 32% 28%, #fff7df 0%, ${color} 55%, #8f2f18 100%)`;
    starCoreEl.style.boxShadow   = `0 0 ${Math.round(size * 0.45)}px ${phase.halo}`;
    starHaloEl.style.background  = `radial-gradient(circle, ${phase.halo} 0%, rgba(255,120,80,0.08) 46%, transparent 72%)`;
  }

  starHaloEl.style.width   = `${haloSize}px`;
  starHaloEl.style.height  = `${haloSize}px`;
  starHaloEl.style.opacity = String(opacity);

  updateTimelineActive(phaseIdx);

  // Teach mode
  if (teachMode && phase.teach) {
    if (teachEmojiEl) teachEmojiEl.textContent = phase.teach.emoji || "🔭";
    teachTitleEl.textContent   = phase.teach.title;
    teachCaptionEl.textContent = phase.teach.caption;
  }

  // Ending overlay
  if (phase.key === "black-dwarf" && localT > 0.4) {
    showEnding();
  } else {
    hideEnding();
  }

  return { phase, age, lum, temp, radius };
}

// =========================================================
// Render: Sun (comparison)
// =========================================================
function renderSun(value, redDwarfAge) {
  const phaseIdx = getPhaseIndexByProgress(SUN_PHASE_RANGES, value);
  const phase    = SUN_PHASES[phaseIdx];
  const next     = SUN_PHASES[Math.min(phaseIdx + 1, SUN_PHASES.length - 1)];
  const range    = SUN_PHASE_RANGES[phaseIdx];
  const localT   = range.end === range.start ? 0 : (value - range.start) / (range.end - range.start);

  const lum    = lerp(phase.lumLsun,    next.lumLsun,    localT * 0.3);
  const temp   = lerp(phase.tempK,      next.tempK,      localT * 0.3);
  const radius = lerp(phase.radiusRsun, next.radiusRsun, localT * 0.3);
  const color  = mixColor(phase.color, next.color, localT * 0.4);

  const rawSize = 30 + radius * 32;
  const size    = Math.max(14, Math.min(210, rawSize));
  const haloSize = size * 2.55;

  sunAgeTagEl.textContent = `同一时刻：${formatAge(redDwarfAge)}`;

  sunCoreEl.style.width   = `${size}px`;
  sunCoreEl.style.height  = `${size}px`;
  sunCoreEl.style.background = `radial-gradient(circle at 32% 28%, #fffbe0 0%, ${color} 55%, #b06800 100%)`;
  sunCoreEl.style.boxShadow  = `0 0 ${Math.round(size * 0.45)}px ${phase.halo}`;
  sunHaloEl.style.width   = `${haloSize}px`;
  sunHaloEl.style.height  = `${haloSize}px`;
  sunHaloEl.style.background = `radial-gradient(circle, ${phase.halo} 0%, rgba(255,200,60,0.08) 46%, transparent 72%)`;

  return { phase, lum, temp, radius };
}

// =========================================================
// Render: comparison panel
// =========================================================
function renderComparePanel(rdPhase, rdAge, rdLum, rdTemp, rdRadius, sunPhase, sunLum, sunTemp, sunRadius) {
  compareRedDwarfEl.innerHTML = `
    <div class="compare-row"><span>状态</span><strong>${rdPhase.state}</strong></div>
    <div class="compare-row"><span>光度</span><strong>${formatLum(rdLum)}</strong></div>
    <div class="compare-row"><span>温度</span><strong>${Math.round(rdTemp)} K</strong></div>
    <div class="compare-row"><span>半径</span><strong>${rdRadius.toFixed(3)} R☉</strong></div>
    <div class="compare-diff">${rdPhase.note}</div>
  `;
  compareSunEl.innerHTML = `
    <div class="compare-row"><span>状态</span><strong>${sunPhase.state}</strong></div>
    <div class="compare-row"><span>光度</span><strong>${formatLum(sunLum)}</strong></div>
    <div class="compare-row"><span>温度</span><strong>${Math.round(sunTemp)} K</strong></div>
    <div class="compare-row"><span>半径</span><strong>${sunRadius.toFixed(3)} R☉</strong></div>
    <div class="compare-diff sun-diff">${sunPhase.diff}</div>
  `;
}

// =========================================================
// Master render
// =========================================================
function render(value) {
  const rd = renderRedDwarf(value);
  if (compareMode) {
    const sun = renderSun(value, rd.age);
    renderComparePanel(rd.phase, rd.age, rd.lum, rd.temp, rd.radius,
                       sun.phase, sun.lum, sun.temp, sun.radius);
  }
}

// =========================================================
// Playback
// =========================================================
function tick() {
  if (!playing) return;
  progress = Math.min(MAX, progress + speed * 1.1);
  if (progress >= MAX) {
    progress = MAX;
    playing  = false;
    playBtn.textContent = "▶ 播放";
  }
  progressEl.value = String(progress);
  render(progress);
  if (playing) rafId = requestAnimationFrame(tick);
}

function setPlaying(nextPlaying) {
  playing = nextPlaying;
  playBtn.textContent = playing ? "⏸ 暂停" : "▶ 播放";
  if (playing) {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  } else {
    cancelAnimationFrame(rafId);
  }
}

// =========================================================
// Mode toggles
// =========================================================
function setTeachMode(on) {
  teachMode = on;
  teachBtn.classList.toggle("active", on);
  teachBar.classList.toggle("hidden", !on);
}

function setCompareMode(on) {
  compareMode = on;
  compareBtn.classList.toggle("active", on);
  sunWrap.style.display     = on ? "" : "none";
  comparePanel.style.display = on ? "flex" : "none";
  sceneLabelEls.forEach((el) => el.classList.toggle("visible", on));
  render(progress);
}

// =========================================================
// Init
// =========================================================
buildTimelineStops();
setTeachMode(true);
setCompareMode(false);
render(0);

playBtn.addEventListener("click", () => setPlaying(!playing));

resetBtn.addEventListener("click", () => {
  progress = 0;
  progressEl.value = "0";
  setPlaying(false);
  hideEnding();
  render(0);
});

speedSelect.addEventListener("change", (e) => {
  speed = Number(e.target.value || 1);
});

progressEl.addEventListener("input", (e) => {
  progress = Number(e.target.value || 0);
  render(progress);
});

teachBtn.addEventListener("click", () => setTeachMode(!teachMode));
compareBtn.addEventListener("click", () => setCompareMode(!compareMode));

document.getElementById("endingClose").addEventListener("click", () => {
  hideEnding();
  setPlaying(false);
});
