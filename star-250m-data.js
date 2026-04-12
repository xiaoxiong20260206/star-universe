// ============================================================
//  star-250m-data.js
//  100 M☉ / 250 M☉ 超大质量恒星演化数据
// ============================================================

const STAR_100M = {
  key: "black-hole",
  name: "超大质量恒星",
  massLabel: "100 M☉",
  massRatio: 100,
  category: "star",
  themeColor: "#7b8dff",
  gradientFrom: "#b8c3ff",
  gradientTo:   "#10081f",
  summary: "质量达到太阳 100 倍，寿命极短，最终核心坍缩成黑洞，是『会留下残骸』的大质量恒星代表。",
  funFact: "这类恒星可能在几百万年内就走完一生，最后留下一个事件视界，把一切光都锁在里面。",
  fate: "🕳️ 黑洞",
  fateColor: "#c8d2ff",

  phases: [
    {
      key: "cloud",
      name: "分子云坍缩",
      ageStartMyr: 0, ageEndMyr: 0.06,
      spanLabel: "0 ~ 6 万年",
      state: "极速引力收缩",
      lumLsun: 0.08, tempK: 4200, radiusRsun: 12,
      color: "#aab8ff", halo: "rgba(130,150,255,0.42)",
      note: "100 倍太阳质量让它一开始就拥有极强引力，气体云坍缩速度远快于太阳。",
      teach: {
        emoji: "🌌",
        title: "诞生得飞快",
        caption: "对这种超大质量恒星来说，『出生』几乎是一个暴力过程。引力极强，气体在极短时间里被拽向中心，点火倒计时非常快。"
      }
    },
    {
      key: "protostar",
      name: "原恒星",
      ageStartMyr: 0.06, ageEndMyr: 0.18,
      spanLabel: "6 ~ 18 万年",
      state: "预主序快速收缩",
      lumLsun: 30000, tempK: 12000, radiusRsun: 7,
      color: "#97a8ff", halo: "rgba(120,145,255,0.48)",
      note: "还没正式点燃聚变，就已经亮得惊人，周围气体盘开始被强辐射吹散。",
      teach: {
        emoji: "⚡",
        title: "青春期几乎不存在",
        caption: "普通恒星会有一个相对漫长的原恒星阶段，但 100 M☉ 级别的恒星几乎是『刚成型就上场』。它太重了，根本不允许自己慢慢来。"
      }
    },
    {
      key: "zams",
      name: "零龄主序点火",
      ageStartMyr: 0.18, ageEndMyr: 0.4,
      spanLabel: "18 ~ 40 万年",
      state: "CNO 聚变全面启动",
      lumLsun: 1200000, tempK: 42000, radiusRsun: 18,
      color: "#8ea1ff", halo: "rgba(110,140,255,0.54)",
      note: "核心启动极高效率的 CNO 循环，表面温度和亮度都远超普通主序星。",
      teach: {
        emoji: "🔥",
        title: "真正的蓝白巨兽",
        caption: "一旦点火，它就不再是『亮一点的太阳』，而是彻底不同层级的恒星：极蓝、极热、极亮，而且烧得非常狠。"
      }
    },
    {
      key: "o-supergiant",
      name: "O 型超巨星",
      ageStartMyr: 0.4, ageEndMyr: 2.2,
      spanLabel: "40 万 ~ 220 万年",
      state: "极端主序阶段",
      lumLsun: 2200000, tempK: 45000, radiusRsun: 22,
      color: "#7d93ff", halo: "rgba(100,130,255,0.5)",
      note: "稳定期依旧非常短暂，恒星风猛烈地带走外层物质。",
      teach: {
        emoji: "💙",
        title: "主序，但像开着推进器",
        caption: "它也有主序阶段，但并不『稳定安静』。高亮度带来的辐射压会强烈驱动恒星风，让它一边燃烧，一边疯狂减重。"
      }
    },
    {
      key: "wolf-rayet",
      name: "沃夫-拉叶星",
      ageStartMyr: 2.2, ageEndMyr: 2.9,
      spanLabel: "220 万 ~ 290 万年",
      state: "外层被剥离，核心裸露",
      lumLsun: 1800000, tempK: 90000, radiusRsun: 9,
      color: "#9f86ff", halo: "rgba(168,110,255,0.5)",
      note: "大量外层氢被吹走，暴露出更热、更致密的内核区域。",
      teach: {
        emoji: "☄️",
        title: "把外衣都吹掉了",
        caption: "这时候它看起来像是被『剥壳』的恒星：外层被恒星风持续吹掉，只剩炽热的核心区暴露在宇宙里。"
      }
    },
    {
      key: "collapse",
      name: "核心坍缩前夕",
      ageStartMyr: 2.9, ageEndMyr: 3.0,
      spanLabel: "最后 10 万年",
      state: "铁核形成，支撑失败",
      lumLsun: 2800000, tempK: 180000, radiusRsun: 6,
      color: "#c79bff", halo: "rgba(220,150,255,0.6)",
      note: "核心最终走到铁元素，聚变不再产能，引力开始彻底接管。",
      special: "critical",
      teach: {
        emoji: "⚠️",
        title: "燃料烧到头了",
        caption: "聚变像一个不断向上爬楼梯的过程，但铁是终点：再往后就不是释放能量，而是倒贴能量。到了这里，恒星已经没法靠核聚变撑住自己。"
      }
    },
    {
      key: "failed-sn",
      name: "坍缩 / 失败超新星",
      ageStartMyr: 3.0, ageEndMyr: 3.0001,
      spanLabel: "几秒到几分钟",
      state: "核心塌缩，外层回落",
      lumLsun: 600000000, tempK: 1000000000, radiusRsun: 300000,
      color: "#efe6ff", halo: "rgba(255,245,255,0.82)",
      note: "可能伴随一次短暂但不彻底的爆发；更多物质最终回落，核心继续坍缩。",
      special: "supernova",
      teach: {
        emoji: "💥",
        title: "不是所有大质量恒星都能炸得漂亮",
        caption: "对 100 M☉ 这种级别，核心坍缩后未必会形成『典型超新星』。很多模型认为它更可能发生失败超新星：亮一下，然后大部分物质又掉回去。"
      }
    },
    {
      key: "black-hole",
      name: "黑洞",
      ageStartMyr: 3.0001, ageEndMyr: 30,
      spanLabel: "诞生后长期存在",
      state: "事件视界形成",
      lumLsun: 0.00000001, tempK: 0, radiusRsun: 0.0002,
      color: "#05060c", halo: "rgba(110,130,255,0.18)",
      note: "核心继续坍缩到连光也逃不出的程度，形成黑洞；周围可能存在炽热吸积盘。",
      special: "blackhole",
      teach: {
        emoji: "🕳️",
        title: "终局：黑洞",
        caption: "这里不再是一颗会发光的恒星，而是一个事件视界。光、气体、甚至信息都会被它拖进更深的引力井里。舞台上剩下的亮环，是周围掉落物质最后的挣扎。"
      }
    }
  ],

  endingTitle: "终章：核心坍缩成黑洞",
  endingDesc: "100 M☉ 恒星没有像 250 M☉ 那样完全炸碎，而是在核心坍缩后留下一个黑洞，成为真正的引力深井。",
  endingBadge: "🕳️ 黑洞",
  endingNote: "⚫ 黑洞不是『黑色的球』，而是一个连光都逃不出的区域。你看到的亮环通常来自吸积盘，而不是黑洞本体。",
  quiz: [
    {
      q: "100 M☉ 恒星为什么会变成黑洞？",
      a: "因为它在晚期形成高质量铁核后，聚变无法继续支撑引力，核心会不可逆坍缩，最终形成事件视界。",
      ok: true, icon: "🕳️"
    },
    {
      q: "黑洞会发光吗？",
      a: "黑洞本体不发光；真正亮的是掉进黑洞前被加热到极高温的吸积盘物质。",
      ok: false, icon: "💡"
    },
    {
      q: "为什么 100 M☉ 和 250 M☉ 的结局不同？",
      a: "250 M☉ 处在 PISN 质量窗口内，会被热核爆轰完全炸碎；100 M☉ 更典型的结局是核心坍缩并留下黑洞残骸。",
      ok: true, icon: "⚖️"
    }
  ]
};

// ============================================================
//  250 M☉ 极端大质量恒星演化数据
//  结局：不稳定对超新星（Pair Instability Supernova, PISN）
//  —— 完全炸碎，不留任何残骸！
// ============================================================

const STAR_250M = {
  key: "extreme",
  name: "极端大质量恒星",
  massLabel: "250 M☉",
  massRatio: 250,
  themeColor: "#ff3366",
  gradientFrom: "#ff88aa",
  gradientTo:   "#3a0020",
  summary: "宇宙中最极端的存在！质量是太阳250倍，只活300万年，最终用「不稳定对超新星」彻底湮灭，不留任何残骸！",
  funFact: "它的亮度高达 500 万个太阳！不稳定对超新星爆炸时比普通超新星亮 100 倍，整个星系都能看到！",
  fate: "💥 不稳定对超新星（完全消失）",
  fateColor: "#ffdd88",

  phases: [
    {
      key: "cloud",
      name: "分子云坍缩",
      ageStartMyr: 0, ageEndMyr: 0.05,
      spanLabel: "0 ~ 5 万年",
      state: "极速引力收缩",
      lumLsun: 0.1, tempK: 5000, radiusRsun: 15.0,
      color: "#ff88aa", halo: "rgba(255,100,140,0.55)",
      note: "极端质量在引力下超快速坍缩，仅需5万年——红矮星的千分之一时间！",
      teach: {
        emoji: "🌌",
        title: "极速诞生：5 万年",
        caption: "250 M☉ 的引力是可怕的！这团气体在 5 万年内就完成了从分子云到原恒星的坍缩过程。而红矮星要花 100 万年，太阳要花几十万年。这颗星生来就是「快」。"
      }
    },
    {
      key: "protostar",
      name: "原恒星",
      ageStartMyr: 0.05, ageEndMyr: 0.1,
      spanLabel: "5 ~ 10 万年",
      state: "极速预主序",
      lumLsun: 50000, tempK: 15000, radiusRsun: 10.0,
      color: "#ff6688", halo: "rgba(255,80,120,0.6)",
      note: "原恒星阶段极短，强烈辐射压力已经开始吹散周围的气体尘埃盘。",
      teach: {
        emoji: "⚡",
        title: "诞生就是怪物",
        caption: "才刚形成，光度就已经达到 5 万个太阳！强烈的紫外线辐射在原恒星阶段就开始「蒸发」周围的星云物质。很多科学家认为，正是这种辐射反馈限制了更大质量恒星的形成。"
      }
    },
    {
      key: "zams",
      name: "零龄主序点火",
      ageStartMyr: 0.1, ageEndMyr: 0.3,
      spanLabel: "10 ~ 30 万年",
      state: "CNO 超高效聚变",
      lumLsun: 2000000, tempK: 52000, radiusRsun: 22.0,
      color: "#ff4477", halo: "rgba(255,60,100,0.65)",
      note: "核心点燃 CNO 循环，亮度高达 200 万个太阳！表面温度 52000K，发出大量高能紫外线和 X 射线。",
      teach: {
        emoji: "🔥",
        title: "200 万个太阳的光！",
        caption: "点火成功，亮度是 200 万个太阳。表面温度 52000K，是太阳表面的9倍！它主要辐射紫外线和 X 射线，肉眼看是炽热的蓝白色。这类超大质量恒星叫做「沃夫-拉叶星」的前身，被称为 O 型超巨星。"
      }
    },
    {
      key: "o-supergiant",
      name: "O 型超巨星",
      ageStartMyr: 0.3, ageEndMyr: 1.5,
      spanLabel: "30 ~ 150 万年",
      state: "极端主序阶段",
      lumLsun: 4000000, tempK: 50000, radiusRsun: 25.0,
      color: "#ee3366", halo: "rgba(240,60,100,0.6)",
      note: "宇宙中最亮的主序星之一，极端的辐射压力使恒星风以数千公里/秒速度吹出，每年失去约 1/1000 太阳质量。",
      teach: {
        emoji: "💙",
        title: "宇宙中的「蒸发者」",
        caption: "它以每年 1/1000 M☉ 的速度把自己的外层吹散到宇宙中！这是恒星风驱动的质量损失，速度高达 2000-3000 公里/秒。银河系内能确认的最大质量恒星（R136a1）估计就在 150-300 M☉ 之间，它就是这个级别的。"
      }
    },
    {
      key: "lbv",
      name: "亮蓝变星（LBV）",
      ageStartMyr: 1.5, ageEndMyr: 2.0,
      spanLabel: "150 ~ 200 万年",
      state: "剧烈不稳定脉动",
      lumLsun: 5000000, tempK: 25000, radiusRsun: 180.0,
      color: "#dd4499", halo: "rgba(220,80,160,0.65)",
      note: "辐射压力超过引力，恒星开始剧烈脉动，每隔几十年就爆发性地抛出大量物质——像呼吸一样。",
      teach: {
        emoji: "🌪️",
        title: "亮蓝变星：无法稳定的怪物",
        caption: "辐射压力太大，超过了引力的束缚！恒星进入「亮蓝变星」（LBV）阶段，每隔几十年就发生一次爆炸性喷发，一次性抛出几倍太阳质量的气体壳。著名的「海山二」（船底座η）就是这种星！1843年爆发时比天狼星还亮，肉眼清晰可见。"
      }
    },
    {
      key: "wolf-rayet",
      name: "沃夫-拉叶星",
      ageStartMyr: 2.0, ageEndMyr: 2.8,
      spanLabel: "200 ~ 280 万年",
      state: "外层剥离，核心裸露",
      lumLsun: 3000000, tempK: 100000, radiusRsun: 8.0,
      color: "#cc3377", halo: "rgba(200,60,140,0.6)",
      note: "强烈恒星风将外层氢/氦完全吹走，暴露出炽热的碳氧核心——这就是沃夫-拉叶星。",
      teach: {
        emoji: "☄️",
        title: "脱去外衣：沃夫-拉叶星",
        caption: "外层氢和氦都被吹光了，裸露出碳氧核心，表面温度高达 10 万开！沃夫-拉叶星是宇宙中已知最热的恒星之一。它的恒星风以 3000 公里/秒的速度向外喷射物质，在周围形成美丽的气泡星云。"
      }
    },
    {
      key: "pre-pisn",
      name: "对不稳定前夕",
      ageStartMyr: 2.8, ageEndMyr: 2.9,
      spanLabel: "280 ~ 290 万年（最后 10 万年）",
      state: "电子-正电子对产生",
      lumLsun: 8000000, tempK: 200000, radiusRsun: 5.0,
      color: "#ffcc44", halo: "rgba(255,200,100,0.75)",
      note: "核心温度超过 70 亿 K！γ光子能量足够直接产生电子-正电子对，辐射压力骤降，引力反超——这是毁灭的开始！",
      special: "pre-pisn",
      teach: {
        emoji: "⚠️",
        title: "物理崩溃：正电子对产生",
        caption: "核心温度超过 70 亿 K——普通超新星核心温度的 10 倍！此时光子能量足以直接「变」成电子-正电子对。这消耗了大量支撑恒星的辐射压力，引力突然「赢了」……整个核心开始加速收缩，进入不可逆的毁灭倒计时！"
      }
    },
    {
      key: "pisn",
      name: "不稳定对超新星 💥",
      ageStartMyr: 2.9, ageEndMyr: 2.9001,
      spanLabel: "几秒到几分钟！",
      state: "PISN — 完全湮灭",
      lumLsun: 100000000000, tempK: 10000000000, radiusRsun: 50000000,
      color: "#ffffff", halo: "rgba(255,255,200,0.99)",
      note: "热核爆轰波从核心向外炸穿整颗恒星！不像普通超新星留下中子星，PISN 将恒星完全炸碎，不留任何残骸！",
      special: "pisn",
      teach: {
        emoji: "💥",
        title: "PISN：宇宙最强爆炸，不留任何痕迹",
        caption: "正电子对产生→核心加速坍缩→温度骤升→氧和碳的热核燃烧瞬间引爆！爆炸能量是普通 II 型超新星的 100 倍，比整个银河系还亮数十倍！最关键的一点：整颗恒星被完全炸碎，连中子星、黑洞都不会留下——它就这样彻底消失在宇宙中！"
      }
    },
    {
      key: "pisn-nebula",
      name: "超新星遗迹星云",
      ageStartMyr: 2.9001, ageEndMyr: 30,
      spanLabel: "爆炸后数百万年",
      state: "富含重元素的扩散星云",
      lumLsun: 10000, tempK: 20000, radiusRsun: 10000000,
      color: "#ffaa55", halo: "rgba(255,170,80,0.35)",
      note: "爆炸将富含铁、镍、硅等重元素的物质以约 2 万公里/秒的速度向外抛射，形成巨型扩散星云。",
      special: "pisn-nebula",
      teach: {
        emoji: "🌈",
        title: "星云：重元素的播种机",
        caption: "爆炸产生了大量铁、镍、钴、金、铂等重元素，以 2 万公里/秒的速度向外扩散。这些物质最终会冷却凝结，融入下一代分子云中。数十亿年后，这些原子可能成为一颗新行星——甚至一个生命的一部分。你身体里的铁，就来自这样的爆炸。"
      }
    }
  ],

  endingTitle: "终章：不稳定对超新星——消失在宇宙中",
  endingDesc: "宇宙中最壮烈的死法！整颗恒星被热核爆轰波完全炸碎，不留中子星，不留黑洞——250 M☉ 就这样化为一片扩散的元素云。",
  endingBadge: "💥 PISN · 完全湮灭",
  endingNote: "⚡ PISN vs 普通超新星：普通 II 型超新星留下中子星（铁核坍缩驱动），PISN 是热核爆轰驱动，能量是前者的 100 倍，且完全不留残骸。质量 140-260 M☉ 的恒星走 PISN；>260 M☉ 的恒星可能直接坍缩成黑洞，甚至连 PISN 都撑不住！",

  quiz: [
    {
      q: "PISN 和普通超新星有什么本质区别？",
      a: "普通超新星是铁核坍缩驱动（留下中子星/黑洞），PISN 是热核爆轰驱动（完全摧毁恒星，不留残骸）。能量大约是 100 倍！",
      ok: true, icon: "💥"
    },
    {
      q: "为什么 PISN 会发生在超大质量恒星身上？",
      a: "核心温度超过 70 亿 K 后，光子能量产生电子-正电子对，消耗辐射压力，引力崩塌→温度骤升→热核爆轰，形成正反馈循环。",
      ok: true, icon: "⚛️"
    },
    {
      q: "250 M☉ 恒星死后会留下什么？",
      a: "什么都不留！既无中子星，也无黑洞。只有富含铁、镍、硅等重元素的扩散星云，最终融入宇宙空间。",
      ok: false, icon: "🌌"
    },
    {
      q: "宇宙早期的第一代恒星（Population III 星）是 PISN 吗？",
      a: "很可能是！宇宙早期没有金属，气体云更容易形成超大质量恒星（100-1000 M☉），大量走 PISN 路线，为宇宙播下了第一批重元素种子。",
      ok: true, icon: "🌟"
    }
  ]
};
