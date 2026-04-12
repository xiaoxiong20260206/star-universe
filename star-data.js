// ============================================================
// star-data.js — 恒星演化数据库（三种质量恒星的完整生命周期）
// ============================================================

/**
 * 每颗恒星的数据结构：
 * {
 *   key, name, massLabel, massRatio,
 *   color: 整体主题色
 *   summary: 一句话介绍
 *   funFact: 趣味冷知识
 *   fate: 最终命运标签
 *   phases: [ { key, name, spanLabel, ageStartMyr, ageEndMyr,
 *               state, lumLsun, tempK, radiusRsun,
 *               color, halo, note,
 *               teach: { emoji, title, caption },
 *               special?: "supernova"|"pulsar"|"blackdwarf" } ]
 * }
 */

// ============================================================
// 1. 0.09 M☉ — 超低质量红矮星
// ============================================================
const STAR_RED_DWARF = {
  key: "red-dwarf",
  name: "红矮星",
  massLabel: "0.09 M☉",
  massRatio: 0.09,
  themeColor: "#ff7a45",
  gradientFrom: "#ff8a55",
  gradientTo:   "#5a1e0f",
  summary: "宇宙中数量最多的恒星，寿命是太阳的数百倍！",
  funFact: "如果给它每秒1滴汽油，它能燃烧约3万亿年。",
  fate: "🌑 黑矮星",
  fateColor: "#8877cc",
  phases: [
    {
      key: "cloud",
      name: "分子云",
      ageStartMyr: 0, ageEndMyr: 1,
      spanLabel: "0 ~ 100 万年",
      state: "引力收缩",
      lumLsun: 0.001, tempK: 2400, radiusRsun: 0.85,
      color: "#ffb58d", halo: "rgba(255,140,90,0.5)",
      note: "一团气体和尘埃在引力下缓缓向中心聚拢，核心升温。",
      teach: {
        emoji: "🌌",
        title: "诞生之前：宇宙的摇篮",
        caption: "一大团气体和尘埃在万有引力的作用下开始「抱团」，核心温度不断上升。就像捏紧一个气球，里面的空气会变热。这颗未来的红矮星，还只是宇宙中一片模糊的云。"
      }
    },
    {
      key: "protostar",
      name: "原恒星",
      ageStartMyr: 1, ageEndMyr: 80,
      spanLabel: "1 ~ 8000 万年",
      state: "预主序收缩",
      lumLsun: 0.004, tempK: 2700, radiusRsun: 0.62,
      color: "#ffb178", halo: "rgba(255,160,95,0.55)",
      note: "核心持续收缩升温，能量来自引力势能，尚未点燃核聚变。",
      teach: {
        emoji: "🔥",
        title: "还差一步：8000 万年的等待",
        caption: "核心温度慢慢爬升，但对这颗小小的星来说还不够——它需要比太阳更长的时间才能「点火」。太阳在 4000 万年时就点燃了，它还在等待……"
      }
    },
    {
      key: "zams",
      name: "主序点火",
      ageStartMyr: 80, ageEndMyr: 300,
      spanLabel: "8000 万 ~ 3 亿年",
      state: "氢聚变启动",
      lumLsun: 0.008, tempK: 2900, radiusRsun: 0.24,
      color: "#ff9f66", halo: "rgba(255,142,80,0.5)",
      note: "核心突破 400 万K阈值，质子-质子链反应稳定启动，正式成为恒星。",
      teach: {
        emoji: "⚡",
        title: "点火！终于成为恒星",
        caption: "核心温度突破约 400 万开尔文，氢核聚变点燃了！这颗红矮星正式成为一颗恒星。它比太阳暗约 125 倍，颜色深红，安静地燃烧。"
      }
    },
    {
      key: "stable",
      name: "稳定红矮星",
      ageStartMyr: 300, ageEndMyr: 50000,
      spanLabel: "3 亿 ~ 500 亿年",
      state: "全对流主序",
      lumLsun: 0.011, tempK: 3050, radiusRsun: 0.125,
      color: "#ff8a55", halo: "rgba(255,120,70,0.45)",
      note: "进入超长稳定期，内部完全对流，燃料利用率极高，寿命可达500亿年。",
      teach: {
        emoji: "⏳",
        title: "最漫长的岁月：500 亿年",
        caption: "这是它一生中最长的阶段——整整 500 亿年！内部的「搅拌机」（对流）让新鲜氢燃料不断补充进核心。此时太阳早已死去了很久很久，这颗小星还在安静燃烧。"
      }
    },
    {
      key: "late",
      name: "晚期主序",
      ageStartMyr: 50000, ageEndMyr: 200000,
      spanLabel: "500 亿 ~ 2 万亿年",
      state: "缓慢演化",
      lumLsun: 0.014, tempK: 3200, radiusRsun: 0.105,
      color: "#ff7a45", halo: "rgba(255,108,62,0.42)",
      note: "氢燃料渐渐耗尽，亮度温度缓慢上升，不会膨胀成红巨星。",
      teach: {
        emoji: "🌅",
        title: "安静的老年：不会爆炸",
        caption: "普通恒星老了会变成红巨星；但这颗小星质量不够，核心的引力不足以触发氦燃烧。它只是慢慢变稍亮、稍蓝，像一盏快烧完的灯。"
      }
    },
    {
      key: "he-wd",
      name: "氦白矮星",
      ageStartMyr: 200000, ageEndMyr: 300000,
      spanLabel: "2 ~ 3 万亿年",
      state: "白矮星冷却",
      lumLsun: 0.0004, tempK: 8000, radiusRsun: 0.065,
      color: "#c8b0ff", halo: "rgba(180,150,255,0.25)",
      note: "核聚变停止，残留氦核成为白矮星，靠余热发出微弱蓝白光。",
      teach: {
        emoji: "💜",
        title: "白矮星：地球大小的宝石",
        caption: "聚变停止了。核心变成一颗比地球稍大的氦球，密度极高，每茶匙重约 5 吨。它靠着储存的热量发出微弱的蓝白色光，缓缓冷却。"
      }
    },
    {
      key: "black-dwarf",
      name: "黑矮星",
      ageStartMyr: 300000, ageEndMyr: 380000,
      spanLabel: "3 万亿年以上",
      state: "黑矮星（理论终态）",
      lumLsun: 0.0000001, tempK: 400, radiusRsun: 0.062,
      color: "#2a2a4a", halo: "rgba(60,60,120,0.1)",
      note: "温度接近宇宙背景温度，几乎不发光，永远漂流于宇宙深处。",
      special: "blackdwarf",
      teach: {
        emoji: "🌑",
        title: "终章：黑矮星——永恒的沉默",
        caption: "最终，它变成一块沉默、冰冷的氦球，漂浮在黑暗的宇宙中。没有爆炸，没有超新星，只是安静地消失在无尽的黑暗里。注意：目前宇宙中还不存在任何黑矮星，因为宇宙还没足够老！"
      }
    }
  ],
  endingTitle: "终章：永恒的黑矮星",
  endingDesc: "它没有爆炸。漫长 3 万亿年后，静静变成一块冰冷的黑暗。",
  endingBadge: "🌑 黑矮星",
  quiz: [
    { q: "0.09 M☉ 红矮星会变成超新星吗？", a: "不会！它质量太小，不能触发超新星爆炸，只会安静地冷却成黑矮星。", ok: false, icon: "❌" },
    { q: "为什么红矮星寿命比太阳长这么多？", a: "因为它体积小、燃烧慢，而且内部全对流，燃料利用率比太阳高很多！", ok: true, icon: "✅" },
    { q: "黑矮星现在存在吗？", a: "不存在！宇宙只有约 138 亿岁，距离第一颗黑矮星的诞生还差数千亿倍时间。", ok: false, icon: "❓" }
  ]
};

// ============================================================
// 2. 1.0 M☉ — 太阳型恒星
// ============================================================
const STAR_SUN = {
  key: "sun",
  name: "太阳型恒星",
  massLabel: "1.0 M☉",
  massRatio: 1.0,
  themeColor: "#f5c840",
  gradientFrom: "#ffe066",
  gradientTo:   "#7a4a00",
  summary: "和我们太阳一样的恒星——宇宙中的普通人，有戏剧性的结局！",
  funFact: "太阳每秒钟把 400 万吨物质转化成能量，但这点消耗还能维持约 50 亿年！",
  fate: "💫 白矮星",
  fateColor: "#a8c8ff",
  phases: [
    {
      key: "cloud",
      name: "分子云",
      ageStartMyr: 0, ageEndMyr: 1,
      spanLabel: "0 ~ 100 万年",
      state: "引力收缩",
      lumLsun: 0.001, tempK: 3000, radiusRsun: 3.5,
      color: "#ffe066", halo: "rgba(255,220,80,0.5)",
      note: "气体尘埃在引力下坍缩，初步形成原恒星盘。",
      teach: {
        emoji: "🌌",
        title: "诞生：和红矮星一样的开始",
        caption: "太阳诞生时和红矮星一样，都是从气体尘埃云的坍缩开始。但它的质量大得多，收缩过程更快，点火也更早。"
      }
    },
    {
      key: "protostar",
      name: "原恒星",
      ageStartMyr: 1, ageEndMyr: 40,
      spanLabel: "1 ~ 4000 万年",
      state: "预主序收缩",
      lumLsun: 0.8, tempK: 4500, radiusRsun: 1.5,
      color: "#ffd04a", halo: "rgba(255,210,80,0.55)",
      note: "质量较大，收缩更快，约 4000 万年便可达到氢聚变阈值。",
      teach: {
        emoji: "🔥",
        title: "更快的启动：4000 万年",
        caption: "比红矮星快了整整一倍！质量越大，引力越强，收缩越快，点火也越早。"
      }
    },
    {
      key: "zams",
      name: "主序点火",
      ageStartMyr: 40, ageEndMyr: 200,
      spanLabel: "4000 万 ~ 2 亿年",
      state: "氢聚变启动",
      lumLsun: 1.0, tempK: 5778, radiusRsun: 1.0,
      color: "#ffce45", halo: "rgba(255,210,70,0.5)",
      note: "核心点燃氢聚变，成为类太阳恒星，光度1 L☉，表面温度约5778K。",
      teach: {
        emoji: "☀️",
        title: "正式成为太阳！",
        caption: "核心温度达到约 1500 万开尔文（比红矮星高3倍），氢聚变高效燃烧，黄色温暖的光芒照亮周围。"
      }
    },
    {
      key: "stable",
      name: "稳定主序",
      ageStartMyr: 200, ageEndMyr: 10000,
      spanLabel: "2 亿 ~ 100 亿年",
      state: "稳定氢燃烧",
      lumLsun: 1.1, tempK: 5780, radiusRsun: 1.0,
      color: "#ffca40", halo: "rgba(255,205,65,0.45)",
      note: "稳定燃烧约 100 亿年，此期间地球上进化出了生命。",
      teach: {
        emoji: "🌍",
        title: "生命的摇篮：100 亿年",
        caption: "在这稳定的 100 亿年里，地球上诞生了生命，从单细胞生物进化到了恐龙，到人类。太阳是地球上一切生命的能量来源。"
      }
    },
    {
      key: "subgiant",
      name: "亚巨星膨胀",
      ageStartMyr: 10000, ageEndMyr: 10800,
      spanLabel: "100 ~ 108 亿年",
      state: "核心氦积累",
      lumLsun: 2.5, tempK: 5200, radiusRsun: 2.2,
      color: "#ffaa35", halo: "rgba(255,170,60,0.5)",
      note: "核心氢消耗殆尽，氢壳层点燃，恒星开始缓慢膨胀。",
      teach: {
        emoji: "📈",
        title: "核心变化：膨胀开始",
        caption: "核心的氢耗尽了，但外层的氢壳仍在燃烧。这导致恒星开始膨胀，亮度增加，温度略降。地球的海洋将开始蒸发……"
      }
    },
    {
      key: "red-giant",
      name: "红巨星",
      ageStartMyr: 10800, ageEndMyr: 11200,
      spanLabel: "108 ~ 112 亿年",
      state: "氦壳层燃烧",
      lumLsun: 2300, tempK: 3700, radiusRsun: 170,
      color: "#ff8c33", halo: "rgba(255,120,50,0.6)",
      note: "极度膨胀，半径达170倍太阳，吞噬水星金星，地球也岌岌可危。",
      teach: {
        emoji: "🔴",
        title: "红巨星：吞噬地球的怪物",
        caption: "太阳膨胀到现在半径的170倍！如果它现在是红巨星，它的表面会越过地球的轨道。水星、金星将被彻底吞噬，地球可能也会被吞进去……"
      }
    },
    {
      key: "planetary-nebula",
      name: "行星状星云",
      ageStartMyr: 11200, ageEndMyr: 11500,
      spanLabel: "112 ~ 115 亿年",
      state: "外层抛射",
      lumLsun: 800, tempK: 20000, radiusRsun: 8000,
      color: "#ff99ff", halo: "rgba(255,150,255,0.4)",
      note: "红巨星不稳定，外层被抛射成美丽的星云，向宇宙归还物质。",
      teach: {
        emoji: "💫",
        title: "华丽的谢幕：行星状星云",
        caption: "红巨星的外层被强烈的恒星风吹走，形成一个美丽的气体壳——行星状星云。这是宇宙中最美丽的景象之一！哈勃望远镜拍到了很多这样的照片。"
      }
    },
    {
      key: "white-dwarf",
      name: "白矮星",
      ageStartMyr: 11500, ageEndMyr: 200000,
      spanLabel: "115 亿 ~ 2 万亿年",
      state: "碳氧白矮星冷却",
      lumLsun: 0.0005, tempK: 12000, radiusRsun: 0.012,
      color: "#c8d8ff", halo: "rgba(180,210,255,0.25)",
      note: "外层抛尽后，剩余的碳氧核心成为白矮星，体积如地球，靠余热缓缓发光，历经数万亿年。",
      teach: {
        emoji: "💙",
        title: "白矮星：太阳的遗骸",
        caption: "星云散去后，太阳的核心留下来，变成了白矮星——大约地球大小，但密度超高，每茶匙重约 1 吨。它会缓缓冷却数万亿年，最终温度接近绝对零度……"
      }
    },
    {
      key: "black-dwarf-sun",
      name: "黑矮星（终态）",
      ageStartMyr: 200000, ageEndMyr: 380000,
      spanLabel: "2 万亿年以上",
      state: "碳氧黑矮星",
      lumLsun: 0.0000001, tempK: 400, radiusRsun: 0.011,
      color: "#1e2a3a", halo: "rgba(50,80,120,0.08)",
      note: "白矮星冷却完毕，成为碳氧黑矮星——和红矮星的氦黑矮星相似，同样是不发光的黑暗天体。",
      special: "blackdwarf",
      teach: {
        emoji: "🌑",
        title: "黑矮星：太阳的最终归宿",
        caption: "白矮星冷却完毕后，就变成了黑矮星！太阳的黑矮星是碳氧组成的，红矮星的黑矮星是氦组成的。成分不同，但命运一样——都是宇宙中冰冷沉默的黑暗天体。注意：现在宇宙中还没有任何黑矮星，因为宇宙才 138 亿岁，还不够老！"
      }
    }
  ],
  endingTitle: "终章：白矮星 → 黑矮星",
  endingDesc: "太阳死后变成白矮星，再经过漫长的冷却，最终变成黑矮星——和红矮星的归宿相同。",
  endingBadge: "🌑 黑矮星",
  quiz: [
    { q: "太阳会变成超新星吗？", a: "不会！太阳质量不够大（需要 8 M☉ 以上），它会变成红巨星然后行星状星云。", ok: false, icon: "❌" },
    { q: "太阳红巨星阶段地球会被怎样？", a: "太阳会膨胀到约 170 倍，地球可能被吞噬或表面被炙烤成荒漠，海洋完全蒸发。", ok: true, icon: "🔴" },
    { q: "行星状星云和行星有关系吗？", a: "没有！早期天文学家用望远镜看，觉得它们圆圆的像行星，就叫错了，名字沿用至今。", ok: false, icon: "😄" }
  ]
};

// ============================================================
// 3. 8 M☉ — 大质量恒星（超新星 → 中子星）
// ============================================================
const STAR_MASSIVE = {
  key: "massive",
  name: "大质量恒星",
  massLabel: "8 M☉",
  massRatio: 8,
  themeColor: "#5580ff",
  gradientFrom: "#88aaff",
  gradientTo:   "#1a1050",
  summary: "站在临界线上的恒星！燃烧猛烈，结局却出人意料——没有超新星，留下宇宙中最危险的白矮星！",
  funFact: "它的质量刚好在「爆炸与不爆炸」的临界线附近，最终留下接近钱德拉塞卡极限的超大质量白矮星！",
  fate: "💎 超大质量白矮星",
  fateColor: "#99bbff",
  phases: [
    {
      key: "cloud",
      name: "分子云",
      ageStartMyr: 0, ageEndMyr: 0.2,
      spanLabel: "0 ~ 20 万年",
      state: "快速引力收缩",
      lumLsun: 0.01, tempK: 4000, radiusRsun: 8.0,
      color: "#aaccff", halo: "rgba(100,160,255,0.5)",
      note: "质量是太阳8倍，引力更强，收缩速度极快，仅需20万年。",
      teach: {
        emoji: "🚀",
        title: "闪电般的诞生：20 万年",
        caption: "质量越大，引力越强，收缩越快！这颗大质量恒星的诞生，比红矮星（需要 1 百万年）快了 5 倍。宇宙中的强者，总是冲劲十足。"
      }
    },
    {
      key: "protostar",
      name: "原恒星",
      ageStartMyr: 0.2, ageEndMyr: 0.5,
      spanLabel: "20 ~ 50 万年",
      state: "快速预主序",
      lumLsun: 50, tempK: 8000, radiusRsun: 3.0,
      color: "#99bbff", halo: "rgba(120,170,255,0.55)",
      note: "原恒星阶段极短，质量大、引力强，快速收缩至核聚变温度。",
      teach: {
        emoji: "⚡",
        title: "极短的青春期",
        caption: "才 30 万年就完成了原恒星阶段！而红矮星需要 8000 万年，太阳需要 4000 万年。大质量恒星就像那种「一入学就毕业」的天才学生。"
      }
    },
    {
      key: "zams",
      name: "主序点火",
      ageStartMyr: 0.5, ageEndMyr: 1.0,
      spanLabel: "50 ~ 100 万年",
      state: "氢 CNO 循环",
      lumLsun: 3000, tempK: 25000, radiusRsun: 4.5,
      color: "#77aaff", halo: "rgba(100,160,255,0.55)",
      note: "核心启动 CNO 循环（更高效的氢聚变），发出炽热的蓝白色光。",
      teach: {
        emoji: "🔵",
        title: "蓝白巨星：3000 个太阳",
        caption: "大质量恒星用的不是质子-质子链，而是 CNO 循环（碳氮氧催化聚变）——效率更高！它的亮度高达 3000 个太阳，颜色是炽热的蓝白色，这就是「蓝超巨星」！"
      }
    },
    {
      key: "blue-supergiant",
      name: "蓝超巨星",
      ageStartMyr: 1.0, ageEndMyr: 8000,
      spanLabel: "100 万 ~ 80 亿年",
      state: "稳定氢主序",
      lumLsun: 4500, tempK: 28000, radiusRsun: 5.0,
      color: "#6699ff", halo: "rgba(90,150,255,0.5)",
      note: "稳定燃烧阶段，极蓝极亮，但寿命只有约 80 亿年——不到太阳的1/10。",
      teach: {
        emoji: "💙",
        title: "短暂的辉煌：只活 80 亿年",
        caption: "太阳能活 100 亿年，它只能活 80 亿年——更亮也更费！一辆跑车油耗远高于家用轿车。质量越大的恒星，燃烧越猛烈，寿命越短。这就是宇宙的代价。"
      }
    },
    {
      key: "red-supergiant",
      name: "红超巨星",
      ageStartMyr: 8000, ageEndMyr: 9500,
      spanLabel: "80 ~ 95 亿年",
      state: "多层核聚变",
      lumLsun: 100000, tempK: 3500, radiusRsun: 700,
      color: "#ff5533", halo: "rgba(255,80,50,0.58)",
      note: "核心氢耗尽后，经历多轮核聚变（He→C→Ne→O→Si），半径膨胀到700倍太阳。",
      teach: {
        emoji: "🔴",
        title: "红超巨星：宇宙中最大的星",
        caption: "它膨胀成了红超巨星——半径约700倍太阳，如果放在太阳位置，外表面超过木星轨道！核心此时在同时燃烧多种元素，像一个「洋葱」，层层叠叠。著名的参宿四就是这种星！"
      }
    },
    {
      key: "agb-massive",
      name: "超级AGB星",
      ageStartMyr: 9500, ageEndMyr: 9600,
      spanLabel: "95 ~ 96 亿年",
      state: "剧烈热脉冲阶段",
      lumLsun: 500000, tempK: 3200, radiusRsun: 900,
      color: "#ff6633", halo: "rgba(255,100,60,0.65)",
      note: "核心多轮核聚变结束，开始剧烈的热脉冲，外层逐渐被强恒星风剥离——这次不会爆炸！",
      teach: {
        emoji: "🌪️",
        title: "悬念时刻：会爆还是不爆？",
        caption: "质量临界线上！8 M☉ 的恒星核心很重，但还不够重到让冲击波「撑过去」引爆超新星。它进入超级渐近巨星支（超级AGB）阶段，开始猛烈地把外层物质吹走——这是个戏剧性的转折！"
      }
    },
    {
      key: "massive-nebula",
      name: "超级行星状星云",
      ageStartMyr: 9600, ageEndMyr: 9700,
      spanLabel: "96 ~ 97 亿年",
      state: "外层大规模抛射",
      lumLsun: 300000, tempK: 50000, radiusRsun: 20000,
      color: "#ffaaff", halo: "rgba(255,160,255,0.5)",
      note: "外层物质以极高速度被抛射出去，形成比普通行星状星云大数倍的巨型星云，内部核心暴露。",
      teach: {
        emoji: "💫",
        title: "大爆发但不是超新星！",
        caption: "外层以每秒数百公里的速度向外炸开，形成一个巨型的发光气体壳！虽然看起来很像爆炸，但这不是超新星——核心还活着，只是把「衣服脱光」了。这种星云比普通行星状星云大十倍以上！"
      }
    },
    {
      key: "ultramassive-wd",
      name: "超大质量白矮星",
      ageStartMyr: 9700, ageEndMyr: 200000,
      spanLabel: "97 亿年 ~ 2 万亿年",
      state: "接近钱德拉塞卡极限",
      lumLsun: 0.01, tempK: 80000, radiusRsun: 0.004,
      color: "#99bbff", halo: "rgba(140,180,255,0.3)",
      note: "核心留下约 1.3 M☉ 的超大质量白矮星——仅比中子星诞生的临界质量低一点！密度极高，半径仅约地球的40%。",
      special: "ultra-wd",
      teach: {
        emoji: "💎",
        title: "宇宙中最危险的白矮星",
        caption: "它的质量约为 1.3 个太阳，仅比「1.4 M☉ 的钱德拉塞卡极限」低一点点。这颗白矮星非常不稳定——如果它从伴星吸收一点点额外的质量，随时可能触发 Ia 型超新星爆炸！天文学家把这类白矮星叫做「定时炸弹」。"
      }
    },
    {
      key: "black-dwarf-massive",
      name: "黑矮星（终态）",
      ageStartMyr: 200000, ageEndMyr: 380000,
      spanLabel: "2 万亿年以上",
      state: "超大质量黑矮星",
      lumLsun: 0.0000001, tempK: 300, radiusRsun: 0.0038,
      color: "#1a2030", halo: "rgba(40,60,100,0.08)",
      note: "超大质量白矮星冷却殆尽，变成黑暗的超大质量黑矮星，依然接近钱德拉塞卡极限，是三种星里最「危险」的黑矮星。",
      special: "blackdwarf",
      teach: {
        emoji: "🌑",
        title: "最重的黑矮星：依然是个定时炸弹",
        caption: "它冷却成了黑矮星——但质量还是约 1.3 M☉，依然无限接近极限。即使在黑暗中沉睡，只要有任何天体靠近给它「喂」一点质量，它就可能在几十亿年后的宇宙深处突然爆炸！三颗星里，只有它的黑矮星是「带电的」。"
      }
    }
  ],
  endingTitle: "终章：超大质量白矮星 → 黑矮星",
  endingDesc: "最终冷却成黑矮星——但质量约 1.3 M☉，依然接近钱德拉塞卡极限。三颗星里最重、最危险的黑矮星。",
  endingBadge: "🌑 超大质量黑矮星",
  endingNote: "💡 三颗星都会变成黑矮星，但成分不同：红矮星→氦黑矮星；太阳→碳氧黑矮星；这颗→超大质量碳氧黑矮星（接近爆炸极限）。注意：现在宇宙中还不存在任何黑矮星，宇宙才 138 亿岁，距离第一颗黑矮星诞生还差万亿倍时间！",
  quiz: [
    { q: "什么是钱德拉塞卡极限？", a: "白矮星的质量上限约 1.4 M☉，超过这个质量电子简并压力撑不住，白矮星会坍缩或爆炸为 Ia 型超新星！", ok: true, icon: "⚖️" },
    { q: "这颗白矮星为什么叫「定时炸弹」？", a: "因为它的质量约 1.3 M☉，非常接近 1.4 的极限。只要从附近天体吸到一点质量，就可能直接爆发为超新星！", ok: true, icon: "💣" },
    { q: "8 M☉ 恒星为什么没有变成超新星？", a: "因为它的质量刚好在临界线附近，核心不够重，铁核坍缩产生的冲击波不够强，无法炸穿外层——最终安静地剥离成白矮星。", ok: true, icon: "🔬" }
  ]
};

// ============================================================
// 导出：所有星种数据
// ============================================================

// ============================================================
// 4. 地球 — 行星演化（不被太阳吞噬版本）
// massRatio 极小，排序时位于所有恒星之前
// ============================================================
const EARTH = {
  key: "earth",
  name: "地球",
  massLabel: "🌍 地球",
  massRatio: 0.000003,
  themeColor: "#4daaff",
  gradientFrom: "#4daaff",
  gradientTo: "#1a5a2f",
  summary: "唯一已知孕育生命的行星，46亿年风雨后静静漂流宇宙深处。",
  funFact: "地球上所有海洋中的水，如果铺平成一层，厚度约 2.7 公里——但对于行星来说，只是薄薄一层「泪水」。",
  fate: "🌑 行星核遗迹",
  fateColor: "#8fa4c8",
  phases: [
    {
      key: "proto-earth",
      name: "原始地球",
      ageStartMyr: 0, ageEndMyr: 100,
      spanLabel: "0 ~ 1 亿年",
      state: "高温岩浆球",
      lumLsun: 0.000001, tempK: 2200, radiusRsun: 0.0091,
      color: "#ff6a30", halo: "rgba(255,100,40,0.6)",
      note: "刚刚从太阳系尘盘中吸积成形，表面全是熔岩海洋，月球也在此时从一次大碰撞中诞生。",
      special: "earth-living",
      teach: {
        emoji: "🔥",
        title: "诞生之初：岩浆球时代",
        caption: "地球刚诞生时是一个灼热的岩浆球，表面温度高达数千度。一颗火星大小的天体「忒伊亚」撞上地球，碎片聚合成了月球。那时候，还没有任何一滴水，更没有任何生命的影子。"
      }
    },
    {
      key: "hadean",
      name: "冥古宙",
      ageStartMyr: 100, ageEndMyr: 600,
      spanLabel: "1 ~ 6 亿年",
      state: "海洋形成",
      lumLsun: 0.0000008, tempK: 700, radiusRsun: 0.0091,
      color: "#3d8cff", halo: "rgba(60,130,255,0.5)",
      note: "地壳冷却，水蒸气凝结降雨，原始海洋形成。小行星轰炸带来大量水分，大气充满甲烷和二氧化碳。",
      special: "earth-living",
      teach: {
        emoji: "🌊",
        title: "冥古宙：第一滴海水",
        caption: "地球表面冷却下来，天空下起了长达百万年的雨。原始海洋就这样形成了！大气层里没有氧气，只有甲烷、氨气和二氧化碳。但恰恰是这锅「毒汤」，准备孕育第一个生命。"
      }
    },
    {
      key: "life-birth",
      name: "生命诞生",
      ageStartMyr: 600, ageEndMyr: 1500,
      spanLabel: "6 ~ 15 亿年",
      state: "微生物纪元",
      lumLsun: 0.0000006, tempK: 420, radiusRsun: 0.0091,
      color: "#22d07a", halo: "rgba(34,200,110,0.45)",
      note: "约38亿年前，第一个能自我复制的分子诞生于热泉旁的浅海。微生物开始漫长地统治地球，蓝藻悄悄开始产氧。",
      special: "earth-living",
      teach: {
        emoji: "🦠",
        title: "生命点火：宇宙最大奇迹",
        caption: "在某个深海热泉口，一个能复制自己的分子突然出现了——这就是生命的起点。此后20亿年，地球属于看不见的微生物世界。它们是无声的英雄，默默地改造着整个星球。"
      }
    },
    {
      key: "great-oxidation",
      name: "大氧化事件",
      ageStartMyr: 1500, ageEndMyr: 2500,
      spanLabel: "15 ~ 25 亿年",
      state: "大气演变",
      lumLsun: 0.0000005, tempK: 320, radiusRsun: 0.0091,
      color: "#a0e060", halo: "rgba(130,210,60,0.4)",
      note: "蓝藻大规模产氧，大气氧含量从几乎为零升至约20%，引发大规模物种灭绝，也为复杂生命铺路。",
      special: "earth-living",
      teach: {
        emoji: "💨",
        title: "大氧化：微生物的「污染」事件",
        caption: "蓝藻拼命呼出氧气，对当时的厌氧生物来说，这是毁灭性的「污染」——第一次大规模灭绝！但对未来的我们来说，这是馈赠。没有这一步，地球永远不会有动物，也不会有你。"
      }
    },
    {
      key: "complex-life",
      name: "复杂生命",
      ageStartMyr: 2500, ageEndMyr: 4000,
      spanLabel: "25 ~ 40 亿年",
      state: "多细胞生物",
      lumLsun: 0.0000005, tempK: 290, radiusRsun: 0.0091,
      color: "#60c8a0", halo: "rgba(80,190,140,0.4)",
      note: "寒武纪大爆发（5.4亿年前）在极短时间内涌现几乎所有动物门类，恐龙繁荣后灭绝，哺乳动物崛起。",
      special: "earth-living",
      teach: {
        emoji: "🦕",
        title: "寒武纪大爆发：进化的\"大提速\"",
        caption: "约5.4亿年前，复杂动物突然在地球上爆炸性出现——海洋里涌现出眼睛、嘴巴、腿……生命的创造力让人叹服。恐龙统治了1.6亿年，然后一颗小行星结束了它们，把地球让给了哺乳动物。"
      }
    },
    {
      key: "civilization",
      name: "现代文明",
      ageStartMyr: 4000, ageEndMyr: 4600,
      spanLabel: "40 ~ 46 亿年（当下）",
      state: "智慧文明",
      lumLsun: 0.0000005, tempK: 288, radiusRsun: 0.0091,
      color: "#4daaff", halo: "rgba(77,170,255,0.5)",
      note: "智人出现约30万年，工业文明仅200年，却已改变大气成分、引发第六次大灭绝，并第一次向星空发出信号。",
      special: "earth-living",
      teach: {
        emoji: "🌆",
        title: "我们的时代：宇宙中的弹指一挥",
        caption: "人类全部历史，在地球46亿年的时间轴上只是最末端的一个像素点。但我们点亮了城市，发射了旅行者号，把信号送入星际空间——第一个知道自己存在的物种，正在仰望自己的星。"
      }
    },
    {
      key: "desertification",
      name: "地球沙漠化",
      ageStartMyr: 4600, ageEndMyr: 5500,
      spanLabel: "46 ~ 55 亿年",
      state: "太阳膨胀辐射",
      lumLsun: 0.0000003, tempK: 380, radiusRsun: 0.0091,
      color: "#c87a30", halo: "rgba(200,110,40,0.45)",
      note: "太阳亮度持续增加，地球表面温度超过液态水沸点，海洋蒸发殆尽，表面变成赤红色荒漠。文明已不复存在。",
      special: "earth-relic",
      teach: {
        emoji: "🏜️",
        title: "末日：海洋消失",
        caption: "太阳越来越亮，地球开始失去海洋。先是浅海干涸，然后是深海，最后连大气中的水汽也在紫外线下被光解逃逸。不被太阳吞噬，但同样因太阳而死——只是以另一种方式。"
      }
    },
    {
      key: "relic",
      name: "行星核遗迹",
      ageStartMyr: 5500, ageEndMyr: 7000,
      spanLabel: "55 ~ 70 亿年",
      state: "大气逃逸",
      lumLsun: 0.0000001, tempK: 120, radiusRsun: 0.0087,
      color: "#445566", halo: "rgba(60,80,110,0.2)",
      note: "大气和地壳挥发性物质基本逃逸，只剩下铁镍核心和致密岩质外壳，在太阳系外围静静漂流，宇宙冷却而终。",
      special: "earth-relic",
      teach: {
        emoji: "🪨",
        title: "遗迹：宇宙中最孤独的石头",
        caption: "经历了46亿年的生机盎然、短暂的智慧文明，地球最终变成一块冰冷的岩石，在空旷的宇宙中默默漂流。没有海洋，没有大气，没有生命——但它曾经是宇宙中最特别的地方。"
      }
    }
  ],
  endingTitle: "终章：行星核遗迹",
  endingDesc: "46亿年的蓝色星球，经历了岩浆、海洋、生命、文明，最终成为一块沉默的岩核，在宇宙中静静漂流。不被太阳吞噬，只是以更缓慢的方式，安静地消逝。",
  endingBadge: "🪨 行星核遗迹",
  endingNote: "💡 这是「乐观版本」——地球如果不被红巨星太阳吞噬，或者有技术文明将地球轨道推远，它的命运就是在几十亿年后以遗迹形式漂浮在宇宙中。而那个曾经的蓝色星球，只在时间轴上留下了一个不到1%宽度的生命窗口。",
  quiz: [
    { q: "地球的月亮是怎么来的？", a: "约45亿年前，一颗火星大小的天体「忒伊亚」撞上地球，撞出的碎片在地球轨道上聚合，形成了月球。这叫「大碰撞假说」。", ok: true, icon: "🌙" },
    { q: "为什么说蓝藻「污染」了地球？", a: "蓝藻大量产氧，对当时的厌氧生物来说氧气是毒素，引发了地球历史上第一次大规模灭绝事件——「大氧化事件」，约24亿年前发生。", ok: true, icon: "🦠" },
    { q: "人类在地球历史上占多大比例？", a: "地球约46亿岁，智人出现约30万年前，仅占地球历史的约0.007%——如果地球历史是1天，人类文明只出现在最后2秒钟！", ok: true, icon: "⏱️" }
  ]
};

// ============================================================
// 5. 太阳系行星 — 水星到海王星（简化的演化阶段）
// ============================================================

const PLANET_MERCURY = {
  key: "mercury",
  name: "水星",
  massLabel: "0.055 M⊕",
  massRatio: 0.055,
  category: "planet",
  themeColor: "#b8b8b8",
  gradientFrom: "#d0d0d0",
  gradientTo: "#606060",
  summary: "太阳系最小、离太阳最近的行星，一天比一年还长。",
  funFact: "水星表面温差可达600°C！白天430°C，夜晚-180°C。",
  fate: "🔥 被太阳吞噬",
  fateColor: "#ff8844",
  phases: [
    {
      key: "formation",
      name: "形成期",
      ageStartMyr: 0, ageEndMyr: 10,
      spanLabel: "0 ~ 1000 万年",
      state: "原行星吸积",
      lumLsun: 0.00000001, tempK: 1500, radiusRsun: 0.0038,
      color: "#ff9966", halo: "rgba(255,140,90,0.4)",
      note: "从太阳系尘盘中吸积成形，离太阳最近，原始大气很快被太阳风吹散。",
      teach: {
        emoji: "🔥",
        title: "水星的诞生：在烈火旁成长",
        caption: "水星形成于太阳系最内圈，承受着最猛烈的太阳风和辐射。它的原始大气层很快被剥离，只剩下一个裸露的岩石核心。从诞生起，它就是一颗「裸奔」的行星。"
      }
    },
    {
      key: "stable",
      name: "稳定期",
      ageStartMyr: 10, ageEndMyr: 8000,
      spanLabel: "1000万 ~ 80 亿年",
      state: "极端温差行星",
      lumLsun: 0.00000001, tempK: 440, radiusRsun: 0.0038,
      color: "#a8a8a8", halo: "rgba(150,150,150,0.25)",
      note: "自转周期59天，公转周期88天，导致表面昼夜温差极大。",
      teach: {
        emoji: "☀️",
        title: "双重极端：白天炼狱，夜晚冰窖",
        caption: "水星的一天比一年还长！自转极慢，一面烤了88天太阳，另一面则沉入-180°C的黑夜。表面布满陨石坑，没有任何大气保护。这是太阳系温差最大的地方。"
      }
    },
    {
      key: "engulfed",
      name: "太阳膨胀吞噬",
      ageStartMyr: 8000, ageEndMyr: 12000,
      spanLabel: "80 ~ 120 亿年",
      state: "被红巨星吞噬",
      lumLsun: 0.0000001, tempK: 2000, radiusRsun: 0.0038,
      color: "#ff6644", halo: "rgba(255,80,40,0.6)",
      note: "太阳进入红巨星阶段，水星第一个被吞没，化为太阳大气的离子。",
      special: "earth-relic",
      teach: {
        emoji: "🔥",
        title: "终章：第一个消失的行星",
        caption: "当太阳膨胀成红巨星时，水星首当其冲。它被太阳外层大气完全吞没，在数千年内被蒸发殆尽。距离太阳最近，也最先消失——水星的命运，就是离太阳太近的代价。"
      }
    }
  ],
  endingTitle: "终章：被红巨星太阳吞噬",
  endingDesc: "离太阳最近，也最先消失。水星在太阳红巨星阶段被完全吞没，化为离子气体，成为太阳大气的一部分。",
  endingBadge: "🔥 水星终结",
  endingNote: "💡 水星是第一个被红巨星太阳吞噬的行星，之后依次是金星、地球。火星可能存活，气态巨行星则可能被推远。",
  quiz: [
    { q: "水星的一天比一年长吗？", a: "是的！水星自转周期约59天，公转周期约88天，自转比公转慢！", ok: true, icon: "🔄" },
    { q: "水星有大气层吗？", a: "几乎没有。太阳风把原始大气全部吹跑了，只剩极稀薄的外逸层。", ok: false, icon: "💨" },
    { q: "水星为什么温差这么大？", a: "因为几乎没有大气保温，加上自转极慢，向阳面持续暴晒，背阳面长期黑暗。", ok: true, icon: "🌡️" }
  ]
};

const PLANET_VENUS = {
  key: "venus",
  name: "金星",
  massLabel: "0.815 M⊕",
  massRatio: 0.815,
  category: "planet",
  themeColor: "#ffcc66",
  gradientFrom: "#ffe080",
  gradientTo: "#cc8833",
  summary: "地球的「姐妹星」，却是太阳系最热的地方——失控温室效应的教科书。",
  funFact: "金星的一天比水星还长！自转243天，公转225天，而且是倒着转。",
  fate: "🔥 被太阳吞噬",
  fateColor: "#ff8844",
  phases: [
    {
      key: "formation",
      name: "形成期",
      ageStartMyr: 0, ageEndMyr: 10,
      spanLabel: "0 ~ 1000 万年",
      state: "原行星吸积",
      lumLsun: 0.00000001, tempK: 1200, radiusRsun: 0.0095,
      color: "#ffbb55", halo: "rgba(255,180,80,0.45)",
      note: "从太阳系尘盘中成形，离太阳较近，可能曾有过液态水海洋。",
      teach: {
        emoji: "🌊",
        title: "金星的诞生：可能曾有海洋",
        caption: "金星刚形成时，离太阳比地球近一些，温度稍高。早期可能拥有液态水海洋，持续数亿年。但好景不长——太阳越来越亮，金星开始了它的「失控温室」之路。"
      }
    },
    {
      key: "runaway-greenhouse",
      name: "失控温室效应",
      ageStartMyr: 10, ageEndMyr: 500,
      spanLabel: "1000万 ~ 50 亿年",
      state: "地表460°C高温",
      lumLsun: 0.00000001, tempK: 735, radiusRsun: 0.0095,
      color: "#ff9944", halo: "rgba(255,140,60,0.5)",
      note: "太阳亮度增加，海洋蒸发，水汽加剧温室效应，形成92倍大气压的炼狱。",
      teach: {
        emoji: "🌋",
        title: "失控温室：地球的「黑暗未来」",
        caption: "金星海洋蒸发后，水汽锁住了更多热量，温度越高蒸发越快——失控了！现在金星地表460°C，大气压是地球的92倍，下着硫酸雨。这是地球10亿年后的可能命运。"
      }
    },
    {
      key: "engulfed",
      name: "太阳膨胀吞噬",
      ageStartMyr: 8000, ageEndMyr: 12000,
      spanLabel: "80 ~ 120 亿年",
      state: "被红巨星吞噬",
      lumLsun: 0.0000001, tempK: 2500, radiusRsun: 0.0095,
      color: "#ff5533", halo: "rgba(255,80,40,0.65)",
      note: "太阳进入红巨星阶段，金星第二个被吞没，在太阳大气中解体。",
      special: "earth-relic",
      teach: {
        emoji: "🔥",
        title: "终章：第二个消失的行星",
        caption: "水星消失后，轮到金星。它被红巨星太阳的外层大气吞没，在数千年的过程中被逐渐加热、蒸发、解体。曾经的「地球姐妹」，化为太阳大气的离子尘埃。"
      }
    }
  ],
  endingTitle: "终章：被红巨星太阳吞噬",
  endingDesc: "曾经可能拥有海洋的「地球姐妹」，经历了失控温室效应的炼狱，最终在红巨星太阳中解体。",
  endingBadge: "🔥 金星终结",
  endingNote: "💡 金星是地球的「反面教材」：同样的岩石行星，只因离太阳稍近，就走向了完全不同的命运——温室失控，万劫不复。",
  quiz: [
    { q: "金星为什么这么热？", a: "失控温室效应！海洋蒸发后水汽加剧保温，形成460°C的炼狱。", ok: true, icon: "🌡️" },
    { q: "金星自转有什么特别？", a: "它是倒着转的！自转243天，公转225天，一天比一年长，而且是逆行。", ok: true, icon: "🔄" },
    { q: "金星和地球有什么共同点？", a: "大小和质量非常接近，都叫「姐妹星」。但命运截然不同。", ok: true, icon: "👯" }
  ]
};

const PLANET_MARS = {
  key: "mars",
  name: "火星",
  massLabel: "0.107 M⊕",
  massRatio: 0.107,
  category: "planet",
  themeColor: "#ff5533",
  gradientFrom: "#ff7755",
  gradientTo: "#992211",
  summary: "曾经的「蓝色火星」，磁场消失后失去了液态水，现在是寒冷的红色荒漠。",
  funFact: "火星上的奥林帕斯山是太阳系最高的山，高度是珠峰的近3倍！",
  fate: "🔥 可能被太阳吞噬",
  fateColor: "#ff8844",
  phases: [
    {
      key: "formation",
      name: "形成期",
      ageStartMyr: 0, ageEndMyr: 100,
      spanLabel: "0 ~ 1 亿年",
      state: "原行星吸积",
      lumLsun: 0.00000001, tempK: 1000, radiusRsun: 0.0053,
      color: "#ff8866", halo: "rgba(255,120,80,0.4)",
      note: "在太阳系外圈成形，比地球小，可能曾有浓厚大气和液态水。",
      teach: {
        emoji: "🌊",
        title: "火星的诞生：可能曾是蓝色星球",
        caption: "火星形成时可能拥有浓厚的大气和液态水海洋。它的重力比地球小，但足以留住水。数十亿年前，火星可能和地球一样，是一个蓝色的世界——只是更小、更冷。"
      }
    },
    {
      key: "magnetic-death",
      name: "磁场消失",
      ageStartMyr: 100, ageEndMyr: 1000,
      spanLabel: "1 ~ 10 亿年",
      state: "大气逃逸",
      lumLsun: 0.00000001, tempK: 210, radiusRsun: 0.0053,
      color: "#dd5533", halo: "rgba(200,70,40,0.35)",
      note: "核心冷却，磁场消失，太阳风逐渐剥离大气，水分蒸发逃逸。",
      teach: {
        emoji: "🧲",
        title: "致命转折：磁场的消失",
        caption: "火星比地球小，核心更快冷却。当磁场消失后，太阳风开始一点点剥离大气层。没有了大气保护，水蒸发后逃逸到太空，曾经的「蓝色火星」变成了红色荒漠。"
      }
    },
    {
      key: "desert",
      name: "红色荒漠",
      ageStartMyr: 1000, ageEndMyr: 8000,
      spanLabel: "10 ~ 80 亿年",
      state: "寒冷干燥",
      lumLsun: 0.00000001, tempK: 210, radiusRsun: 0.0053,
      color: "#cc4422", halo: "rgba(180,60,30,0.3)",
      note: "现在的火星：稀薄大气、寒冷地表、干涸河床、两极冰盖。",
      teach: {
        emoji: "🏜️",
        title: "火星的现在：寒冷的红色死星",
        caption: "今天的火星大气只有地球的1%，平均温度-60°C。但我们可以看到干涸的河床、三角洲——它们证明火星曾有液态水。我们正在寻找生命痕迹，探索是否曾有火星人。"
      }
    },
    {
      key: "fate",
      name: "终局",
      ageStartMyr: 8000, ageEndMyr: 12000,
      spanLabel: "80 ~ 120 亿年",
      state: "被太阳吞噬或存活",
      lumLsun: 0.00000001, tempK: 800, radiusRsun: 0.0053,
      color: "#ff6644", halo: "rgba(255,100,60,0.55)",
      note: "红巨星太阳可能吞没火星，也可能因为质量流失而让火星轨道外移。",
      special: "earth-relic",
      teach: {
        emoji: "⚡",
        title: "悬念：火星能活下来吗？",
        caption: "当太阳膨胀成红巨星时，火星的命运悬而未决。它可能被吞没，也可能因太阳流失质量导致轨道外移而存活。如果活下来，火星会成为太阳系的「最后堡垒」，见证太阳熄灭的全过程。"
      }
    }
  ],
  endingTitle: "终章：悬念结局",
  endingDesc: "火星的命运充满悬念——可能被红巨星太阳吞没，也可能存活下来，成为太阳系的最后见证者。",
  endingBadge: "⚡ 火星悬念",
  endingNote: "💡 火星的命运取决于太阳红巨星阶段的质量流失速度。如果太阳损失足够多质量，火星轨道会外移，可能逃过一劫。",
  quiz: [
    { q: "火星为什么是红色的？", a: "表面富含氧化铁（铁锈），反射阳光后呈现红色。", ok: true, icon: "🔴" },
    { q: "火星曾有过液态水吗？", a: "有的！探测器发现了干涸河床、三角洲、甚至可能的古湖泊遗迹。", ok: true, icon: "💧" },
    { q: "火星磁场消失后发生了什么？", a: "太阳风剥离大气，水蒸发逃逸，从「蓝色星球」变成红色荒漠。", ok: true, icon: "🧲" }
  ]
};

const PLANET_JUPITER = {
  key: "jupiter",
  name: "木星",
  massLabel: "317.8 M⊕",
  massRatio: 317.8,
  category: "planet",
  themeColor: "#ffcc88",
  gradientFrom: "#ffd9aa",
  gradientTo: "#cc8844",
  summary: "太阳系最大的行星，质量是其他所有行星总和的2.5倍，是行星中的「王者」。",
  funFact: "木星的大红斑已经持续了至少350年，是一个比地球还大的超级风暴！",
  fate: "🌌 可能存活",
  fateColor: "#8899cc",
  phases: [
    {
      key: "formation",
      name: "形成期",
      ageStartMyr: 0, ageEndMyr: 10,
      spanLabel: "0 ~ 1000 万年",
      state: "气体巨行星吸积",
      lumLsun: 0.0000001, tempK: 800, radiusRsun: 0.10045,
      color: "#ffcc88", halo: "rgba(255,200,130,0.4)",
      note: "在太阳系外围成形，吸收大量氢氦气体，成为最大的行星。",
      teach: {
        emoji: "🌪️",
        title: "木星的诞生：行星中的「巨无霸」",
        caption: "木星在太阳系外围形成，这里有更多的原始气体和尘埃。它疯狂吸积，成为行星中的巨无霸——质量是其他所有行星总和的2.5倍！如果再大几十倍，它可能就变成另一颗恒星了。"
      }
    },
    {
      key: "great-red-spot",
      name: "大红斑时代",
      ageStartMyr: 100, ageEndMyr: 8000,
      spanLabel: "1亿 ~ 80 亿年",
      state: "超级风暴肆虐",
      lumLsun: 0.0000001, tempK: 165, radiusRsun: 0.10045,
      color: "#ff9966", halo: "rgba(255,140,90,0.5)",
      note: "大红斑风暴持续数百年，风速达620 km/h，是地球风暴的3倍。",
      teach: {
        emoji: "🌀",
        title: "大红斑：永不停歇的超级风暴",
        caption: "木星的大红斑是一个比地球还大的超级风暴！持续了至少350年，风速620公里/小时——是地球最强飓风的3倍。而且木星有79颗卫星，其中四颗「伽利略卫星」每个都像小行星一样独特。"
      }
    },
    {
      key: "fate",
      name: "太阳演化",
      ageStartMyr: 8000, ageEndMyr: 15000,
      spanLabel: "80 ~ 150 亿年",
      state: "轨道可能外移",
      lumLsun: 0.0000001, tempK: 200, radiusRsun: 0.10045,
      color: "#ddaa66", halo: "rgba(200,160,90,0.35)",
      note: "红巨星太阳质量流失，木星轨道可能外移，逃离吞噬。",
      special: "earth-relic",
      teach: {
        emoji: "🌌",
        title: "悬念：木星能存活吗？",
        caption: "当太阳膨胀成红巨星时，它会流失大量质量。这可能让木星轨道外移，逃离吞噬。如果木星存活，它会成为白矮星太阳的行星，继续在黑暗中运转。四颗伽利略卫星会变成冰冻世界。"
      }
    }
  ],
  endingTitle: "终章：可能存活",
  endingDesc: "木星的命运充满悬念——可能因太阳质量流失而轨道外移，逃过红巨星吞噬，成为白矮星太阳的行星。",
  endingBadge: "🌌 木星悬念",
  endingNote: "💡 木星质量巨大，有足够的引力保持氢氦大气。即使太阳熄灭，木星内部的热源也可能维持某些卫星的地下海洋。",
  quiz: [
    { q: "木星有多少颗卫星？", a: "至少95颗已确认！其中四颗「伽利略卫星」特别巨大。", ok: true, icon: "🌙" },
    { q: "大红斑是什么？", a: "一个持续了至少350年的超级风暴，大小超过地球。", ok: true, icon: "🌀" },
    { q: "木星会变成恒星吗？", a: "不会。它质量还不够，需要再大几十倍才可能点燃核聚变。", ok: false, icon: "⭐" }
  ]
};

const PLANET_SATURN = {
  key: "saturn",
  name: "土星",
  massLabel: "95.2 M⊕",
  massRatio: 95.2,
  category: "planet",
  themeColor: "#f0d890",
  gradientFrom: "#ffe4a0",
  gradientTo: "#c8a060",
  summary: "以壮观的土星环闻名，是太阳系最美的行星，环系由冰和岩石碎片组成。",
  funFact: "土星的密度比水还低！如果有足够大的水池，土星会漂在水面上。",
  fate: "🌌 可能存活",
  fateColor: "#8899cc",
  phases: [
    {
      key: "formation",
      name: "形成期",
      ageStartMyr: 0, ageEndMyr: 50,
      spanLabel: "0 ~ 5000 万年",
      state: "气体巨行星吸积",
      lumLsun: 0.0000001, tempK: 150, radiusRsun: 0.0837,
      color: "#f0d890", halo: "rgba(240,210,140,0.4)",
      note: "在木星轨道外成形，吸收大量氢氦气体。",
      teach: {
        emoji: "🌪️",
        title: "土星的诞生：木星的「小弟」",
        caption: "土星在木星轨道外侧形成，吸收了大量气体和冰。它比木星小一些，但依然是一个气体巨行星。它的低密度（比水还轻）意味着它主要由轻元素氢和氦组成。"
      }
    },
    {
      key: "ring-formation",
      name: "土星环形成",
      ageStartMyr: 50, ageEndMyr: 500,
      spanLabel: "5000万 ~ 5 亿年",
      state: "环系确立",
      lumLsun: 0.0000001, tempK: 134, radiusRsun: 0.0837,
      color: "#ffe0aa", halo: "rgba(255,220,160,0.5)",
      note: "土星环可能由彗星、小行星或被撕碎的卫星残骸形成。",
      teach: {
        emoji: "💍",
        title: "土星环：宇宙最美的戒指",
        caption: "土星环由数十亿块冰和岩石碎片组成，宽度达28万公里，但厚度只有10米到1公里！它们可能来自被土星引力撕碎的彗星或卫星。而且土星有146颗卫星，其中泰坦有浓厚大气。"
      }
    },
    {
      key: "stable",
      name: "稳定期",
      ageStartMyr: 500, ageEndMyr: 8000,
      spanLabel: "5 ~ 80 亿年",
      state: "光环辉煌",
      lumLsun: 0.0000001, tempK: 134, radiusRsun: 0.0837,
      color: "#e8d090", halo: "rgba(230,200,130,0.35)",
      note: "土星以目前的姿态稳定存在，环系不断碰撞重组。",
      teach: {
        emoji: "✨",
        title: "土星的现在：太阳系的「网红」",
        caption: "土星以壮观的环系闻名，每15年一次环面朝向地球。它还有146颗已确认卫星，其中泰坦有浓厚大气和液态甲烷湖泊，恩克拉多斯有地下海洋——可能孕育生命！"
      }
    },
    {
      key: "fate",
      name: "终局",
      ageStartMyr: 8000, ageEndMyr: 15000,
      spanLabel: "80 ~ 150 亿年",
      state: "可能存活",
      lumLsun: 0.0000001, tempK: 150, radiusRsun: 0.0837,
      color: "#d8c080", halo: "rgba(210,180,110,0.3)",
      note: "红巨星太阳质量流失可能让土星轨道外移。",
      special: "earth-relic",
      teach: {
        emoji: "🌌",
        title: "悬念：土星会失去环吗？",
        caption: "土星环可能在1亿年内逐渐消失——环物质会坠落到土星上。但当太阳变成红巨星时，土星可能因轨道外移而存活。如果如此，它将成为白矮星太阳的行星，但可能已经没有光环了。"
      }
    }
  ],
  endingTitle: "终章：可能存活",
  endingDesc: "土星可能因太阳质量流失而轨道外移，逃过红巨星吞噬。但它壮观的环系可能在太阳熄灭前就消失了。",
  endingBadge: "🌌 土星悬念",
  endingNote: "💡 土星环正在逐渐消失！科学家估计1亿年后它们可能全部坠落到土星上，或者被太阳的辐射压力推开。",
  quiz: [
    { q: "土星环是什么组成的？", a: "主要是冰块和岩石碎片，宽度巨大但厚度极薄。", ok: true, icon: "💍" },
    { q: "土星的密度为什么这么低？", a: "它主要由轻元素氢和氦组成，密度比水还低。", ok: true, icon: "🌡️" },
    { q: "土星有多少颗卫星？", a: "至少146颗已确认！其中泰坦和恩克拉多斯最有名。", ok: true, icon: "🌙" }
  ]
};

const PLANET_URANUS = {
  key: "uranus",
  name: "天王星",
  massLabel: "14.5 M⊕",
  massRatio: 14.5,
  category: "planet",
  themeColor: "#88ccdd",
  gradientFrom: "#a0ddee",
  gradientTo: "#4488aa",
  summary: "太阳系最奇怪的行星——侧躺着自转，像在宇宙中「打滚」。",
  funFact: "天王星的一年是84个地球年，每个半球会连续42年白天、42年黑夜。",
  fate: "🌌 存活",
  fateColor: "#8899cc",
  phases: [
    {
      key: "formation",
      name: "形成期",
      ageStartMyr: 0, ageEndMyr: 100,
      spanLabel: "0 ~ 1 亿年",
      state: "冰巨行星吸积",
      lumLsun: 0.00000001, tempK: 50, radiusRsun: 0.0363,
      color: "#88ccdd", halo: "rgba(130,200,220,0.35)",
      note: "在太阳系外围成形，富含水、氨、甲烷等「冰」物质。",
      teach: {
        emoji: "🧊",
        title: "天王星的诞生：远日行星",
        caption: "天王星在太阳系极外圈形成，这里温度极低，水、氨、甲烷都凝结成冰。它被称为「冰巨星」，内部是高压冰层，外层是氢氦大气。它是太阳系最冷的行星之一。"
      }
    },
    {
      key: "tilt",
      name: "侧躺自转",
      ageStartMyr: 100, ageEndMyr: 8000,
      spanLabel: "1 ~ 80 亿年",
      state: "极端倾斜",
      lumLsun: 0.00000001, tempK: 76, radiusRsun: 0.0363,
      color: "#88bbcc", halo: "rgba(130,180,200,0.3)",
      note: "自转轴倾斜98°，几乎「躺平」绕太阳公转。",
      teach: {
        emoji: "🔄",
        title: "宇宙中最怪的行星：躺着打滚",
        caption: "天王星的自转轴倾斜了98°，几乎是「躺着」绕太阳转！可能是早期被某个大天体撞歪了。这意味着它的每个极点会连续42年白天、42年黑夜——宇宙中最极端的季节！"
      }
    },
    {
      key: "fate",
      name: "远日存活",
      ageStartMyr: 8000, ageEndMyr: 20000,
      spanLabel: "80 ~ 200 亿年",
      state: "白矮星时代",
      lumLsun: 0.00000001, tempK: 50, radiusRsun: 0.0363,
      color: "#66aacc", halo: "rgba(100,160,200,0.25)",
      note: "离太阳足够远，红巨星阶段可能存活。",
      special: "earth-relic",
      teach: {
        emoji: "🌌",
        title: "终章：成为白矮星的行星",
        caption: "天王星离太阳足够远，几乎肯定能在红巨星阶段存活。当太阳变成白矮星后，天王星会继续在黑暗中绕着这颗熄灭的太阳运转——一个永恒的、寒冷的、无光的太阳系遗物。"
      }
    }
  ],
  endingTitle: "终章：永恒的冰巨星",
  endingDesc: "离太阳足够远，天王星几乎肯定能存活过红巨星阶段，成为白矮星太阳的行星——一个永恒的冰冻世界。",
  endingBadge: "🌌 天王星存活",
  endingNote: "💡 天王星的内部热源异常微弱，它是太阳系唯一「不产热」的巨行星，几乎完全依赖太阳的微弱辐射。",
  quiz: [
    { q: "天王星为什么侧躺着？", a: "可能是早期被一个大天体撞击，把自转轴撞歪了98°。", ok: true, icon: "💥" },
    { q: "天王星一年有多长？", a: "84个地球年！每个半球会连续42年白天、42年黑夜。", ok: true, icon: "📅" },
    { q: "天王星是什么类型的行星？", a: "冰巨星！主要由水、氨、甲烷的「冰」组成，不是气态巨星。", ok: true, icon: "🧊" }
  ]
};

const PLANET_NEPTUNE = {
  key: "neptune",
  name: "海王星",
  massLabel: "17.1 M⊕",
  massRatio: 17.1,
  category: "planet",
  themeColor: "#4466ff",
  gradientFrom: "#6688ff",
  gradientTo: "#223388",
  summary: "太阳系最远的行星，风速达2100 km/h，是太阳系风暴最猛烈的地方。",
  funFact: "海王星的一年是165个地球年，从发现到现在（1846年）它还没绕太阳转完一圈！",
  fate: "🌌 存活",
  fateColor: "#8899cc",
  phases: [
    {
      key: "formation",
      name: "形成期",
      ageStartMyr: 0, ageEndMyr: 100,
      spanLabel: "0 ~ 1 亿年",
      state: "冰巨行星吸积",
      lumLsun: 0.00000001, tempK: 50, radiusRsun: 0.0353,
      color: "#4466ff", halo: "rgba(70,100,255,0.35)",
      note: "在太阳系最外圈成形，富含冰物质。",
      teach: {
        emoji: "🧊",
        title: "海王星的诞生：太阳系的边缘守卫",
        caption: "海王星在太阳系最外圈形成，是最后一颗行星。它和天王星一样是「冰巨星」，主要由水、氨、甲烷组成。它的蓝色来自甲烷吸收红光，反射蓝光。"
      }
    },
    {
      key: "great-dark-spot",
      name: "大黑斑时代",
      ageStartMyr: 100, ageEndMyr: 8000,
      spanLabel: "1 ~ 80 亿年",
      state: "超级风暴肆虐",
      lumLsun: 0.00000001, tempK: 72, radiusRsun: 0.0353,
      color: "#3355dd", halo: "rgba(50,80,220,0.4)",
      note: "拥有太阳系最猛烈的风暴，风速达2100 km/h。",
      teach: {
        emoji: "🌪️",
        title: "宇宙最强风暴：时速2100公里",
        caption: "海王星的风暴是太阳系最猛烈的！风速2100公里/小时，是地球最强飓风的9倍！它内部的热源驱动这些风暴，尽管太阳照射微弱。大黑斑曾像木星的大红斑一样巨大。"
      }
    },
    {
      key: "fate",
      name: "远日存活",
      ageStartMyr: 8000, ageEndMyr: 20000,
      spanLabel: "80 ~ 200 亿年",
      state: "白矮星时代",
      lumLsun: 0.00000001, tempK: 50, radiusRsun: 0.0353,
      color: "#2244cc", halo: "rgba(30,60,200,0.25)",
      note: "离太阳最远，肯定能存活过红巨星阶段。",
      special: "earth-relic",
      teach: {
        emoji: "🌌",
        title: "终章：最后的太阳系行星",
        caption: "海王星离太阳最远，几乎百分之百能在红巨星阶段存活。当太阳变成白矮星后，海王星会继续绕着这个熄灭的太阳运转，成为太阳系最后的行星遗物——见证一个恒星系的消亡。"
      }
    }
  ],
  endingTitle: "终章：永恒的蓝色守护者",
  endingDesc: "离太阳最远，海王星几乎肯定能存活过红巨星阶段，成为白矮星太阳的行星——太阳系最后的蓝色遗物。",
  endingBadge: "🌌 海王星存活",
  endingNote: "💡 海王星的卫星特里同是太阳系最冷的地方之一，表面温度-235°C，但内部可能有地下海洋。",
  quiz: [
    { q: "海王星的风速有多快？", a: "可达2100 km/h，是地球最强飓风的9倍！", ok: true, icon: "🌪️" },
    { q: "海王星为什么是蓝色的？", a: "大气中的甲烷吸收红光，反射蓝光。", ok: true, icon: "🔵" },
    { q: "海王星绕太阳一圈多久？", a: "165个地球年！从1846年发现到现在还没转完一圈。", ok: true, icon: "📅" }
  ]
};

// ============================================================
// 6. 分组目录 — 太阳系行星 + 恒星演化对比
// ============================================================

const PLANETS = [PLANET_MERCURY, PLANET_VENUS, EARTH, PLANET_MARS, PLANET_JUPITER, PLANET_SATURN, PLANET_URANUS, PLANET_NEPTUNE];

const STARS = [STAR_RED_DWARF, STAR_SUN, STAR_MASSIVE, STAR_100M, STAR_250M];

// 为所有对象添加 category 字段
PLANETS.forEach(p => p.category = "planet");
STARS.forEach(s => s.category = "star");

// 完整目录：行星在前，恒星在后
const SOLAR_SYSTEM_CATALOG = [...PLANETS, ...STARS];

// 保留旧名兼容
const STAR_CATALOG = SOLAR_SYSTEM_CATALOG;
