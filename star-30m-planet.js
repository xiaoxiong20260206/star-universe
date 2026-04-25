// =========================================================
// 30 M☉ Massive Star + Planet at 200 AU — Lifecycle Data
// =========================================================

const STAR_PHASES = [
  {
    key: "cloud-collapse",
    name: "分子云坍缩",
    ageStartMyr: 0,
    ageEndMyr: 0.1,
    spanLabel: "0 — 10 万年",
    state: "引力坍缩",
    lumLsun: 0.01,
    tempK: 3500,
    radiusRsun: 200,
    color: "#ffb880",
    halo: "rgba(255,160,80,0.5)",
    note: "质量约 30 倍太阳的气体云在引力作用下急速坍缩。大质量恒星的诞生速度极快——它比太阳的形成快数十倍。",
    teach: {
      emoji: "🌌",
      title: "第一章：一颗怪兽的诞生",
      caption:
        "在宇宙的某片黑暗中，一团巨大的气体云开始坍缩。" +
        "这团气体的质量足足有太阳的 30 倍——这意味着它从一开始就注定要走向一个极端的结局。" +
        "大质量恒星的诞生速度非常快，只需要约 10 万年，而太阳花了 5000 万年。"
    },
    planet: {
      status: "尘埃盘中",
      statusClass: "status-safe",
      detail: "行星正处于原行星盘中，距离中心约 200 AU，还未完全成形。引力场笼罩这片区域。",
      visual: "forming"
    }
  },
  {
    key: "main-sequence",
    name: "主序星（OB型）",
    ageStartMyr: 0.1,
    ageEndMyr: 6,
    spanLabel: "10 万年 — 600 万年",
    state: "氢核聚变",
    lumLsun: 140000,
    tempK: 38000,
    radiusRsun: 8,
    color: "#b8d4ff",
    halo: "rgba(180,210,255,0.65)",
    note: "进入稳定主序阶段，核心氢聚变产生极高能量。表面温度约 38000 K，发出蓝白色强光，光度约太阳的 14 万倍。",
    teach: {
      emoji: "⚡",
      title: "第二章：蓝白巨兽燃烧",
      caption:
        "它正式成为了一颗 OB 型蓝白超巨星。" +
        "光度是太阳的 14 万倍——如果你站在行星上，它的光芒会强烈到几乎令人窒息。" +
        "但这种疯狂的燃烧代价极高：主序寿命只有约 600 万年，" +
        "而太阳会在主序上待足足 100 亿年。这颗星每秒消耗的氢，是太阳的几十万倍。"
    },
    planet: {
      status: "稳定轨道",
      statusClass: "status-safe",
      detail: "行星在 200 AU 的轨道上稳定运行。受恒星强烈辐射影响，大气层被部分电离，但引力束缚完好。",
      visual: "orbit-normal"
    }
  },
  {
    key: "late-main-sequence",
    name: "主序晚期",
    ageStartMyr: 6,
    ageEndMyr: 6.5,
    spanLabel: "600 万 — 650 万年",
    state: "氦核积累",
    lumLsun: 220000,
    tempK: 35000,
    radiusRsun: 14,
    color: "#d4e8ff",
    halo: "rgba(200,225,255,0.6)",
    note: "核心氢燃料即将耗尽，惰性氦核开始积累，外层收到向外的辐射压力，恒星开始缓慢膨胀。",
    teach: {
      emoji: "⏰",
      title: "第三章：倒计时开始",
      caption:
        "核心的氢快烧完了。积累的氦像一块越来越重的「砖头」压在中心，" +
        "迫使外层向外膨胀。光度继续攀升，表面温度开始下降。" +
        "距离这颗星的死亡，只剩下约 50 万年……"
    },
    planet: {
      status: "轨道安全",
      statusClass: "status-safe",
      detail: "恒星亮度增强，行星接收的辐射略微增加，大气上层被加热，但整体轨道依然稳定。",
      visual: "orbit-normal"
    }
  },
  {
    key: "red-supergiant",
    name: "红超巨星",
    ageStartMyr: 6.5,
    ageEndMyr: 7,
    spanLabel: "650 万 — 700 万年",
    state: "壳层燃烧膨胀",
    lumLsun: 300000,
    tempK: 3500,
    radiusRsun: 800,
    color: "#ff6820",
    halo: "rgba(255,100,40,0.62)",
    note: "恒星急剧膨胀为红超巨星，半径达约 800 R☉（约 3.7 AU）。但 200 AU 行星依然处于安全距离之外——是恒星半径的 50 倍以上。",
    teach: {
      emoji: "🔴",
      title: "第四章：膨胀的红色巨兽",
      caption:
        "恒星外层急剧膨胀，体积扩大了一百倍，变成了一颗红超巨星。" +
        "它现在的半径约 800 个太阳半径，换算成距离约 3.7 AU——" +
        "水星到太阳的距离还不到 0.4 AU，所以它能轻松吞噬整个内太阳系。" +
        "但我们的行星在 200 AU 处，比它的表面还远 50 倍，完全安全。" +
        "真正的考验，即将到来……"
    },
    planet: {
      status: "远离膨胀区",
      statusClass: "status-safe",
      detail: "恒星半径约 3.7 AU，而行星在 200 AU 处，距离是恒星半径的 54 倍。行星轨道安全无虞。",
      visual: "orbit-safe"
    }
  },
  {
    key: "supernova",
    name: "核心坍缩超新星",
    ageStartMyr: 7,
    ageEndMyr: 7.001,
    spanLabel: "约 700 万年（持续数天）",
    state: "铁核坍缩 → 超新星",
    lumLsun: 1e10,
    tempK: 6000,
    radiusRsun: 50000,
    color: "#ffffff",
    halo: "rgba(255,240,200,0.9)",
    note: "铁核在 0.1 秒内坍缩，引发 II 型超新星爆炸。能量约 10^44 焦耳，峰值亮度约太阳的 100 亿倍。冲击波以约 10% 光速向外扩散。",
    teach: {
      emoji: "💥",
      title: "第五章：宇宙中最壮烈的死亡",
      caption:
        "铁核积累到约 1.4 倍太阳质量时，再没有任何力量能支撑它——" +
        "它在不到一秒钟内坍缩，反弹产生的冲击波将整个外层以约 10% 光速炸飞。" +
        "这一刻，它的亮度相当于太阳的一百亿倍，在宇宙中的亮度超越整个星系。" +
        "冲击波正在以极速向外扩散，即将抵达 200 AU 处的行星……"
    },
    planet: {
      status: "⚠️ 冲击波来袭！",
      statusClass: "status-crisis",
      detail: "超新星冲击波约在爆发后 3 年抵达 200 AU 处。行星大气受强烈剥蚀，表面被辐射轰击。但引力束缚质量损失~50%，轨道扩大约 2 倍，行星本身不会被瓦解。",
      visual: "shockwave"
    }
  },
  {
    key: "neutron-to-blackhole",
    name: "核心坍缩为黑洞",
    ageStartMyr: 7.001,
    ageEndMyr: 7.01,
    spanLabel: "700 万年（数秒内）",
    state: "直接黑洞形成",
    lumLsun: 100,
    tempK: 20000,
    radiusRsun: 0.00004, // ~90 km 史瓦西半径（视觉放大处理）
    color: "#4a0090",
    halo: "rgba(100,20,200,0.55)",
    note: "对于 30 M☉ 恒星，铁核坍缩很可能直接形成黑洞，而不经过中子星阶段。史瓦西半径约 90 km。",
    teach: {
      emoji: "🕳️",
      title: "第六章：黑洞诞生",
      caption:
        "坍缩并没有停在中子星——这颗质量足够大，铁核直接穿越中子简并压力极限，" +
        "在几秒钟内坍缩成了一个黑洞。" +
        "史瓦西半径约 90 公里——一个城市大小的奇点，" +
        "质量却是太阳的约 15 倍。" +
        "周围的物质被引力吸入，形成旋转的吸积盘，发出紫红色的光。"
    },
    planet: {
      status: "轨道重建中",
      statusClass: "status-warn",
      detail: "恒星质量损失约 50%（从 30M☉ → ~15M☉），开普勒轨道变化：行星轨道半径从 200 AU 扩大到约 400 AU。行星幸存，但开始在更远的轨道上运行。",
      visual: "orbit-expanding"
    }
  },
  {
    key: "black-hole",
    name: "史瓦西黑洞",
    ageStartMyr: 7.01,
    ageEndMyr: 12,
    spanLabel: "700 万年后 →",
    state: "恒星质量黑洞",
    lumLsun: 0.001,
    tempK: 0,
    radiusRsun: 0.00004,
    color: "#060012",
    halo: "rgba(120,40,255,0.45)",
    note: "黑洞质量约 15 M☉，史瓦西半径约 90 km。行星在约 400 AU（因质量损失轨道扩大）继续绕行。这颗行星将围绕黑洞运转数十亿年。",
    teach: {
      emoji: "⚫",
      title: "终章：行星在黑洞轨道上孤独运行",
      caption:
        "一切都归于寂静。黑洞用引力掌控着周围的时空，" +
        "但那颗行星——曾经围绕一颗炽热蓝白巨星运行的行星——" +
        "现在在约 400 AU 的轨道上继续运转，孤独而沉默。" +
        "它不会被黑洞吞噬：200 AU 远超黑洞的潮汐瓦解半径（约 0.000001 AU）。" +
        "它只是默默地绕着这片永恒的黑暗，继续它的旅程。"
    },
    planet: {
      status: "✓ 绕黑洞存活",
      statusClass: "status-survive",
      detail: "行星在约 400 AU 轨道上稳定运行，远超黑洞的潮汐瓦解半径。将持续绕行数十亿乃至万亿年。",
      visual: "orbit-blackhole"
    }
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

const starCoreEl      = document.getElementById("starCore");
const starHaloEl      = document.getElementById("starHalo");
const blackholeCore   = document.getElementById("blackholeCore");
const accretionDisk   = document.getElementById("accretionDisk");
const gravLens        = document.getElementById("gravLens");
const shockwaveRing   = document.getElementById("shockwaveRing");
const supernovaFlash  = document.getElementById("supernovaFlash");
const timelineStopsEl = document.getElementById("timelineStops");

// teach mode
const teachBtn      = document.getElementById("teachBtn");
const teachBar      = document.getElementById("teachBar");
const teachEmojiEl  = document.getElementById("teachEmoji");
const teachTitleEl  = document.getElementById("teachTitle");
const teachCaptionEl = document.getElementById("teachCaption");

// planet
const planetBodyEl    = document.getElementById("planetBody");
const planetAtmoEl    = document.getElementById("planetAtmo");
const planetOrbitEl   = document.getElementById("planetOrbit");
const planetStatusTagEl = document.getElementById("planetStatusTag");
const planetStatusTextEl = document.getElementById("planetStatusText");
const planetDetailEl  = document.getElementById("planetDetail");
const planetIndicatorEl = document.getElementById("planetIndicator");

// ending overlay
const endingOverlay = document.getElementById("endingOverlay");

// =========================================================
// State
// =========================================================
const MAX = 1000;
let progress   = 0;
let playing    = false;
let speed      = 1;
let rafId      = null;
let teachMode  = true;
let supernovaTriggered = false;

// =========================================================
// Helpers
// =========================================================
const GLOBAL_AGE_END_MYR = STAR_PHASES[STAR_PHASES.length - 1].ageEndMyr;

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

const PHASE_RANGES = buildRanges(STAR_PHASES);

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
  if (myr < 1)      return `${(myr * 1000).toFixed(0)} 千年`;
  if (myr < 1000)   return `${myr.toFixed(2)} Myr（百万年）`;
  const gyr = myr / 1000;
  return `${gyr.toFixed(2)} Gyr（十亿年）`;
}

function formatLum(lsun) {
  if (lsun < 0.01)  return `${lsun.toFixed(5)} L☉`;
  if (lsun < 10)    return `${lsun.toFixed(3)} L☉`;
  if (lsun < 1e6)   return `${Math.round(lsun).toLocaleString()} L☉`;
  return `${(lsun / 1e9).toFixed(1)} × 10⁹ L☉`;
}

function formatRadius(rsun) {
  if (rsun < 0.001) return `~90 km（黑洞史瓦西半径）`;
  if (rsun < 0.1)   return `${rsun.toFixed(4)} R☉`;
  if (rsun < 1000)  return `${rsun.toFixed(1)} R☉`;
  return `${Math.round(rsun).toLocaleString()} R☉（~${(rsun * 0.00465).toFixed(1)} AU）`;
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
  timelineStopsEl.innerHTML = STAR_PHASES
    .map((phase, idx) => `<span class="timeline-stop" data-stop="${idx}">${phase.name}</span>`)
    .join("");

  timelineStopsEl.querySelectorAll(".timeline-stop").forEach(el => {
    el.addEventListener("click", () => {
      const idx = Number(el.dataset.stop);
      const range = PHASE_RANGES[idx];
      progress = range.start + 1;
      progressEl.value = String(progress);
      render(progress);
    });
  });
}

function updateTimelineActive(index) {
  timelineStopsEl.querySelectorAll(".timeline-stop").forEach((el) => {
    el.classList.toggle("active", Number(el.dataset.stop) === index);
  });
}

// =========================================================
// Render: Star
// =========================================================
function renderStar(value) {
  const phaseIdx = getPhaseIndexByProgress(PHASE_RANGES, value);
  const phase    = STAR_PHASES[phaseIdx];
  const next     = STAR_PHASES[Math.min(phaseIdx + 1, STAR_PHASES.length - 1)];
  const range    = PHASE_RANGES[phaseIdx];
  const localT   = range.end === range.start ? 0 : (value - range.start) / (range.end - range.start);

  const age    = lerp(phase.ageStartMyr, phase.ageEndMyr, localT);
  const lum    = lerp(phase.lumLsun,    next.lumLsun,    localT * 0.35);
  const temp   = lerp(phase.tempK,      next.tempK,      localT * 0.35);
  const radius = lerp(phase.radiusRsun, next.radiusRsun, localT * 0.35);
  const color  = mixColor(phase.color, next.color, localT * 0.45);

  const isBlackHole = (phase.key === "black-hole");
  const isNewBorn   = (phase.key === "neutron-to-blackhole");
  const isSupernova = (phase.key === "supernova");

  // Update text panels
  stageTitleEl.textContent = phase.name;
  stageSpanEl.textContent  = phase.spanLabel;
  stageNoteEl.textContent  = phase.note;
  ageTagEl.textContent     = `年龄：${formatAge(age)}`;
  metricAgeEl.textContent    = formatAge(age);
  metricLumEl.textContent    = isBlackHole ? "≈ 0（霍金辐射极微弱）" : formatLum(lum);
  metricTempEl.textContent   = isBlackHole ? "约 60 nK（霍金温度）" : `${Math.round(temp).toLocaleString()} K`;
  metricRadiusEl.textContent = formatRadius(radius);
  metricStateEl.textContent  = phase.state;

  if (isBlackHole || isNewBorn) {
    // Hide star, show blackhole visuals
    starCoreEl.style.display = "none";
    starHaloEl.style.display = "none";
    blackholeCore.style.display = "block";
    accretionDisk.style.display = "block";
    gravLens.style.display = "block";

    const bhSize = isNewBorn ? Math.round(lerp(12, 40, localT)) : 40;
    blackholeCore.style.width  = `${bhSize}px`;
    blackholeCore.style.height = `${bhSize}px`;
    accretionDisk.style.width  = `${bhSize * 3.5}px`;
    accretionDisk.style.height = `${bhSize * 3.5}px`;
    accretionDisk.classList.add("visible");
    gravLens.style.width  = `${bhSize * 6}px`;
    gravLens.style.height = `${bhSize * 6}px`;
    shockwaveRing.classList.remove("active");
    supernovaFlash.classList.remove("active");
  } else if (isSupernova) {
    // Supernova: show flash + shockwave, hide normal star
    starCoreEl.style.display = "none";
    starHaloEl.style.display = "none";
    blackholeCore.style.display = "none";
    accretionDisk.style.display = "none";
    gravLens.style.display = "none";

    if (!supernovaTriggered) {
      supernovaTriggered = true;
      supernovaFlash.classList.add("active");
      shockwaveRing.classList.remove("active");
      void shockwaveRing.offsetWidth; // reflow to restart animation
      shockwaveRing.classList.add("active");
    }
    // Also keep small shockwave visible during whole phase
    if (localT > 0.3) {
      shockwaveRing.classList.remove("active");
      void shockwaveRing.offsetWidth;
      shockwaveRing.classList.add("active");
    }
  } else {
    // Normal star
    supernovaTriggered = false;
    starCoreEl.style.display = "block";
    starHaloEl.style.display = "block";
    blackholeCore.style.display = "none";
    accretionDisk.style.display = "none";
    accretionDisk.classList.remove("visible");
    gravLens.style.display = "none";
    shockwaveRing.classList.remove("active");
    supernovaFlash.classList.remove("active");

    const maxR = phase.key === "red-supergiant" ? 200 : 180;
    const rawSize = phase.key === "cloud-collapse" ? lerp(60, 90, localT)
                  : phase.key === "red-supergiant" ? lerp(130, maxR, localT)
                  : Math.max(28, Math.min(110, 28 + Math.log10(radius + 1) * 45));
    const size     = Math.max(20, Math.min(maxR, rawSize));
    const haloSize = size * 2.6;

    starCoreEl.style.width   = `${size}px`;
    starCoreEl.style.height  = `${size}px`;
    starCoreEl.style.background = `radial-gradient(circle at 32% 28%, #fffff8 0%, ${color} 52%, #0a0820 100%)`;
    starCoreEl.style.boxShadow  = `0 0 ${Math.round(size * 0.55)}px ${phase.halo}`;
    starHaloEl.style.width   = `${haloSize}px`;
    starHaloEl.style.height  = `${haloSize}px`;
    starHaloEl.style.background = `radial-gradient(circle, ${phase.halo} 0%, rgba(120,80,255,0.06) 46%, transparent 72%)`;
  }

  updateTimelineActive(phaseIdx);

  // Teach mode update
  if (teachMode && phase.teach) {
    teachEmojiEl.textContent  = phase.teach.emoji || "🔭";
    teachTitleEl.textContent   = phase.teach.title;
    teachCaptionEl.textContent = phase.teach.caption;
  }

  return { phase, age, lum, temp, radius, phaseIdx, localT };
}

// =========================================================
// Render: Planet
// =========================================================
function renderPlanet(starPhase, localT) {
  const pd = starPhase.planet;
  const visual = pd.visual;

  // Update info panel planet status
  if (planetIndicatorEl) {
    planetIndicatorEl.textContent = pd.status;
    planetIndicatorEl.className   = `planet-status-indicator ${pd.statusClass}`;
  }
  if (planetDetailEl) planetDetailEl.textContent = pd.detail;

  // Update scene planet status tag
  if (planetStatusTagEl) planetStatusTagEl.textContent = pd.status;

  // Visual state machine
  const isBlackHole = (visual === "orbit-blackhole");
  const isShockwave = (visual === "shockwave");
  const isForming   = (visual === "forming");

  // Planet body size & color
  let planetSize = 28;
  let planetBg   = "radial-gradient(circle at 35% 30%, #88c4ff 0%, #4a9eff 55%, #1a3a88 100%)";
  let atmoOpacity = 0.55;
  let atmoColor   = "rgba(74,158,255,0.25)";

  if (isForming) {
    planetSize = Math.round(lerp(10, 22, localT));
    planetBg   = "radial-gradient(circle at 38% 32%, #bbddff 0%, #7ab0e0 50%, #2a5080 100%)";
    atmoOpacity = 0.3;
  } else if (isShockwave) {
    planetSize = 28;
    planetBg   = "radial-gradient(circle at 35% 30%, #ffcc80 0%, #e07030 55%, #602010 100%)";
    atmoColor  = "rgba(255,120,60,0.3)";
    if (planetBodyEl && !planetBodyEl.classList.contains("shake")) {
      planetBodyEl.classList.add("shake");
      setTimeout(() => planetBodyEl && planetBodyEl.classList.remove("shake"), 1200);
    }
  } else if (visual === "orbit-expanding") {
    planetSize = 26;
    planetBg   = "radial-gradient(circle at 35% 30%, #e0c8ff 0%, #9060cc 55%, #301860 100%)";
    atmoColor  = "rgba(160,100,255,0.25)";
  } else if (isBlackHole) {
    planetSize = 26;
    planetBg   = "radial-gradient(circle at 35% 30%, #c8d8ff 0%, #6080cc 55%, #102040 100%)";
    atmoColor  = "rgba(100,130,255,0.2)";
  }

  if (planetBodyEl) {
    planetBodyEl.style.width  = `${planetSize}px`;
    planetBodyEl.style.height = `${planetSize}px`;
    planetBodyEl.style.background = planetBg;
    planetBodyEl.style.boxShadow  = isBlackHole
      ? `0 0 ${planetSize * 0.6}px rgba(100,130,255,0.5), 0 0 ${planetSize * 1.5}px rgba(80,100,220,0.18)`
      : `0 0 ${planetSize * 0.6}px rgba(74,158,255,0.6)`;
  }

  if (planetAtmoEl) {
    const atmoSize = planetSize * 2.8;
    planetAtmoEl.style.width  = `${atmoSize}px`;
    planetAtmoEl.style.height = `${atmoSize}px`;
    planetAtmoEl.style.background = `radial-gradient(circle, ${atmoColor} 0%, transparent 65%)`;
    planetAtmoEl.style.opacity = String(atmoOpacity);
  }

  // Orbit ring
  if (planetOrbitEl) {
    const orbitSize = isBlackHole ? 140 : 110;
    planetOrbitEl.style.width  = `${orbitSize}px`;
    planetOrbitEl.style.height = `${orbitSize}px`;
    planetOrbitEl.style.opacity = isForming ? "0.3" : "0.5";
    planetOrbitEl.style.borderColor = isBlackHole
      ? "rgba(140,100,255,0.28)"
      : "rgba(74,158,255,0.28)";
  }

  // Show ending when in black-hole phase with progress > 40%
  if (visual === "orbit-blackhole" && localT > 0.35) {
    showEnding();
  } else if (visual !== "orbit-blackhole") {
    hideEnding();
  }
}

// =========================================================
// Master render
// =========================================================
function render(value) {
  const result = renderStar(value);
  renderPlanet(result.phase, result.localT);
}

// =========================================================
// Playback
// =========================================================
function tick() {
  if (!playing) return;
  progress = Math.min(MAX, progress + speed * 1.0);
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

// =========================================================
// Init
// =========================================================
buildTimelineStops();
setTeachMode(true);
render(0);

playBtn.addEventListener("click", () => setPlaying(!playing));

resetBtn.addEventListener("click", () => {
  progress = 0;
  progressEl.value = "0";
  supernovaTriggered = false;
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

document.getElementById("endingClose").addEventListener("click", () => {
  hideEnding();
  setPlaying(false);
});
