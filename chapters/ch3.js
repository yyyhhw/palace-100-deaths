/* 第三章：宫斗（龙舟宴 · 寿宴 · 巫蛊案 · 第 36–70 天）
   关系值 run.cnt：trust_tao 小桃 / trust_lu 陆峥 / kill 贵妃杀意 / trust_hou 太后信任 / intel 情报 / ayun 阿芸 */
(function (P) {
'use strict';
const N = {};
const LBL = { trust_tao: '🍑 小桃信任', trust_lu: '🛡️ 陆峥信任', kill: '🔪 贵妃杀意', trust_hou: '🙏 太后信任', intel: '🕸️ 情报', ayun: '🧺 阿芸好感' };
const add = (k, by) => G => { G.run.cnt[k] = Math.max(0, (G.run.cnt[k] || 0) + by); if (/^trust|ayun/.test(k)) G.run.cnt[k] = Math.min(100, G.run.cnt[k]); P.UI.toast(`${LBL[k]} ${by > 0 ? '+' : ''}${by}`, 'info', 1400); };
const C = (G, k) => G.cnt(k);
const side = G => G.flag('side');

/* ---------------- 开场 ---------------- */
N.c3_start = [
  G => { G.run.ch = 'ch3'; const c = G.run.cnt;
    if (c.trust_tao == null) { c.trust_tao = 40; c.trust_lu = 20; c.kill = 40; c.intel = 1; }
    if (c.trust_hou == null) c.trust_hou = 10 + (G.flag('pouchOk') ? 10 : 0) + (G.flag('savedEmperor') ? 5 : 0);
    if (c.kill == null) c.kill = 40;
    if (G.flag('guifeiOwe')) c.kill = Math.min(c.kill, 20);
    c.ayun = c.ayun || 0;
    if (!G.run.flags.rank) G.run.flags.rank = '常在'; },
  { hud: true },
  { title: '第三章 · 宫斗', sub: '太液池 · 慈宁宫 · 慎刑司 · 第 36–70 天' },
  { go: 'c3_d36' },
];

/* ---------------- 第 36 天 · 风向 ---------------- */
N.c3_d36 = [
  { day: 36, time: '晨', label: '第36天 · 风向', ch: 'ch3' },
  { bg: 'yonghe', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'smile', 'R']] },
  { s: 'xiaotao', f: 'smile', t: '小主小主！晋封的赏赐送来了，还有——各宫的“贺礼”。' },
  { s: 'n', t: '桌上并排放着两份礼：一匹蓝色云锦，盖着坤宁宫的印；一对金镶红宝石耳坠，红得晃眼。' },
  { s: 'os', f: 'think', t: '皇后送蓝的，贵妃送红的。这不是贺礼，这是两张“入职邀请函”。' },
  { s: 'xiaotao', f: 'sweat', t: '奴婢听说，皇后娘娘和贵妃娘娘最近斗得厉害……谁收了谁的礼，就是谁的人了。' },
  { if: G => G.flag('guifeiOwe'), then: [
    { s: 'xiaotao', t: '对了，翠缕姐姐送耳坠来的时候说：“赏花宴上的人情，娘娘记着呢。”' },
    { s: 'os', f: 'smile', t: '上回给贵妃留了面子，看来没白留。' },
  ] },
  { if: G => G.flag('guifeiGrudge'), then: [
    { s: 'xiaotao', f: 'sweat', t: '翠缕姐姐送耳坠来的时候……是用扔的。' },
    { s: 'os', f: 'sweat', t: '赏花宴上让贵妃丢了脸，这对耳坠怕不是“耳光”的谐音。' },
  ] },
  { if: G => G.flag('taoSaved'), then: [
    { s: 'xiaotao', f: 'cry', t: '小主……奴婢的弟弟上个月平安回乡了。奴婢这条命，以后就是小主的。' },
    add('trust_tao', 10),
  ] },
  { s: 'n', t: '💡 第三章新增「🙏 太后信任」。在属性栏里可以查看。太后信任 ≥ 40 时，她会在关键时刻替你说话。' },
  { go: 'c3_d38' },
];

/* ---------------- 第 38 天 · 站队 ---------------- */
N.c3_d38 = [
  { day: 38, time: '午', label: '第38天 · 坤宁宫召见', ch: 'ch3' },
  { bg: 'kunning', music: 'hall', cast: [['me', 'normal', 'L'], ['huanghou', 'normal', 'R']] },
  { s: 'huanghou', t: '{位份}来了。坐。本宫的云锦，你可还喜欢？' },
  { s: 'huanghou', f: 'smile', t: '后宫要安稳，得有人守规矩。你是个懂规矩的孩子。' },
  { if: G => G.stat('圣眷') >= 50, then: [
    { s: 'os', f: 'think', t: '圣眷够高……现在开口，说不定能搬出永和宫，离宁嫔远一点。' },
    { c: [
      { t: '“娘娘，永和宫偏殿潮湿，嫔妾想求个恩典，换个住处。”', fx: { 警觉: 5 }, set: { movedOut: true }, then: [
        { s: 'huanghou', t: '……也好。景仁宫东配殿空着，你搬过去吧。' },
        { s: 'os', f: 'star', t: '成功逃离狼窝！虽然只隔了两条宫道。' },
      ] },
      { t: '（还是别折腾了，住着吧）' },
    ] },
  ] },
  { s: 'huanghou', f: 'normal', t: '本宫只问你一句：这后宫里，你想站在哪儿？' },
  { checkpoint: '第38天 · 站队' },
  { c: [
    { t: '“嫔妾愿追随皇后娘娘。”', fx: { 规矩: 5 }, set: { side: 'hou' }, then: [add('kill', 20), { s: 'huanghou', f: 'smile', t: '好孩子。' }, { s: 'n', t: '消息传得比风还快。当天下午，长春宫摔碎了一套茶具。' }], go: 'c3_d38b' },
    { t: '转头公开投靠贵妃：“嫔妾觉得，贵妃娘娘更有气魄！”', fx: { 规矩: -5 }, set: { side: 'fei' }, then: [add('kill', -40),
      { s: 'huanghou', f: 'angry', t: '……是吗。那你去长春宫“学气魄”吧。' }, { s: 'n', t: '当晚，贵妃赏了你一盒点心，附言：“识时务。”' }], go: 'c3_d38b' },
    { t: '“嫔妾愚钝，只想好好伺候皇上和太后。”（谁都不站）', fx: { 规矩: 3, 警觉: 5 }, set: { side: 'mid' }, then: [
      { s: 'huanghou', f: 'think', t: '……滑头。罢了，本宫等你想明白。' }], go: 'c3_d38b' },
    { t: '两边都不得罪：给皇后和贵妃各写一封“投名状”', danger: '055', go: 'c3_both' },
  ] },
];
N.c3_both = [
  { s: 'os', f: 'star', t: '鸡蛋不放在一个篮子里，这是投资学常识！' },
  { s: 'n', t: '你写了两封情真意切的信。坤宁宫一封，长春宫一封。' },
  { bg: 'yonghe_night', music: 'danger', cast: [['me', 'smile', 'L']] },
  { s: 'n', t: '三天后。皇后和贵妃在御花园“偶遇”，互相拿出了一封信。' },
  { s: 'n', t: '字迹一样。措辞一样。连“愿为娘娘肝脑涂地”的错别字都一样。' },
  { cast: [['huanghou', 'angry', 'L'], ['me', 'panic', 'C'], ['guifei', 'angry', 'R']] },
  { s: 'guifei', f: 'angry', t: '“肝脑涂地”？本宫成全你。' },
  { s: 'huanghou', f: 'angry', t: '这是本宫和贵妃这十年来，第一次意见一致。', shake: 0.6 },
  { death: '055' },
];
N.c3_d38b = [
  { bg: 'yonghe_night', music: 'night', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'R']] },
  { time: '夜' },
  { s: 'xiaotao', t: '小主，宁嫔娘娘那边今儿又送了安神汤来……奴婢照您的吩咐，倒进花盆了。' },
  { if: G => G.flag('flowerDead'), then: [{ s: 'xiaotao', f: 'sweat', t: '这已经是第三盆了。花匠问咱们是不是在养僵尸花。' }] },
  { s: 'os', f: 'think', t: '宁嫔表面上不站队，可后宫每一次风浪，底下好像都有她。' },
  { s: 'xiaotao', t: '还有……小主，宫外您家里托人捎了句话，说老夫人病了，想问您安好。' },
  { s: 'os', f: 'think', t: '原主的家人。我得想办法回个信——至少让她们知道“我”还活着。' },
  { go: 'c3_d41' },
];

/* ---------------- 第 41 天 · 雷雨夜 ---------------- */
N.c3_d41 = [
  { day: 41, time: '夜', label: '第41天 · 雷雨夜', ch: 'ch3' },
  { bg: 'storm', music: 'night', cast: [['me', 'think', 'L'], ['xiaotao', 'sweat', 'R']] },
  { s: 'n', t: '轰隆——！窗外电闪雷鸣，雨大得像天漏了。' },
  { s: 'os', f: 'think', t: '宫里的信件都要查。怎么才能把家书送出去……' },
  { s: 'xiaotao', f: 'sweat', t: '小主，您手里拿着风筝做什么？外头打雷呢！' },
  { c: [
    { t: '把信绑在风筝上，趁大风放出宫墙！', fx: { 健康: -5 }, then: [
      { bg: 'storm', cast: [['me', 'star', 'C', { prop: 'kite', pose: 'hold' }]] },
      { s: 'me', f: 'star', t: '风大正好！飞吧，家书！' },
      { s: 'n', t: '风筝越飞越高。湿透的风筝线，在你手里绷得笔直。' },
      { s: 'os', f: 'think', t: '等一下……湿线、高空、雷雨……这个组合，物理课上好像讲过——' },
      { flash: true, sfx: 'thud', shake: 1 },
      { s: 'n', t: '咔嚓！' },
    ], death: '057' },
    { t: '托陆峥悄悄带出宫（需陆峥信任 ≥ 40）', need: G => C(G, 'trust_lu') >= 40, then: [
      { bg: 'lane_night', cast: [['me', 'normal', 'L'], ['luzheng', 'normal', 'R', { pose: 'spear', prop: 'spear' }]] },
      { s: 'luzheng', f: 'normal', t: '……我明日换防出宫。信给我。' },
      { s: 'luzheng', f: 'blush', t: '下这么大雨，你就这么跑出来？伞拿着。' },
      add('trust_lu', 10), add('intel', 1), { set: { letterSent: true } },
      { s: 'os', f: 'blush', t: '陆侍卫……靠谱得让人想哭。' },
    ] },
    { t: '把信藏进给御膳房的空食盒，托小安子带出去', need: G => G.flag('anNet') || C(G, 'intel') >= 2, then: [
      { s: 'n', t: '小安子拍胸脯：“包在奴才身上！御膳房每天进出八十个食盒，没人查得过来！”' },
      { set: { letterSent: true } }, add('intel', 1),
    ] },
    { t: '算了，等雨停了再想办法', fx: { 健康: 5 } },
  ] },
  { go: 'c3_d45' },
];

/* ---------------- 第 45 天 · 端午龙舟宴 ---------------- */
N.c3_d45 = [
  { day: 45, time: '午', label: '第45天 · 端午龙舟宴', ch: 'ch3' },
  { bg: 'taiye', music: 'happy', cast: [['me', 'star', 'L'], ['xiaotao', 'smile', 'R']] },
  { s: 'n', t: '端午。太液池上彩旗招展，两条龙舟一红一绿，鼓声咚咚。' },
  { s: 'xiaotao', f: 'smile', t: '小主您看！红的是内务府的，绿的是侍卫营的！陆侍卫在绿船上打鼓呢！' },
  { if: G => C(G, 'trust_lu') >= 30, then: [{ s: 'os', f: 'blush', t: '鼓打得好有力……咳，我是在看比赛。' }] },
  { if: G => side(G) !== 'fei', go: 'c3_quarrel' },
  { go: 'c3_d45_bet' },
];
N.c3_quarrel = [
  { cast: [['me', 'normal', 'L'], ['guifei', 'smirk', 'R', { pose: 'fan', prop: 'fanGold' }]] },
  { if: G => side(G) === 'hou', then: [{ s: 'guifei', f: 'smirk', t: '哟，这不是皇后新养的小哈巴狗吗？叫两声给本宫听听？' }],
    else: [{ s: 'guifei', f: 'smirk', t: '哟，谁都不站的聪明人？本宫最讨厌聪明人。' }] },
  { if: G => C(G, 'kill') < 30, then: [{ s: 'guifei', f: 'normal', t: '……算了，看在赏花宴的份上，本宫今天心情好。' }, { exit: 'guifei' }], go: 'c3_d45_bet' },
  { s: 'n', t: '贵妃用扇子戳了戳你的肩膀，一步一步，把你逼到了栏杆边。' },
  { c: [
    { t: '她推我，我就推回去！', then: [
      { s: 'me', f: 'angry', t: '娘娘请自重！', shake: 0.5 },
      { s: 'n', t: '你伸手一推。贵妃往后一仰，顺手抓住了你的袖子。' },
      { face: { me: 'shock', guifei: 'shock' } },
      { s: 'n', t: '扑通！扑通！', sfx: 'splash', shake: 0.9 },
      { s: 'n', t: '贵妃将门出身，三下两下游上了岸。你在水里扑腾了两下，想起来自己是旱鸭子。' },
    ], death: '040' },
    { t: '退一步，赔个笑：“娘娘教训的是。”', fx: { 名声: -3 }, then: [add('kill', -10), { s: 'guifei', f: 'smirk', t: '哼，算你识相。' }, { exit: 'guifei' }] },
    { t: '“娘娘的护甲真好看，就是戳人有点疼。”（名声 ≥ 50）', need: G => G.stat('名声') >= 50, fx: { 名声: 5 }, then: [
      { s: 'n', t: '周围几个小嫔妃“噗”地笑出了声。' }, add('kill', 10),
      { s: 'guifei', f: 'angry', t: '你……！哼！', shake: 0.3 }, { exit: 'guifei' }] },
  ] },
  { go: 'c3_d45_bet' },
];
N.c3_d45_bet = [
  { checkpoint: '第45天 · 看龙舟' },
  { cast: [['me', 'normal', 'L'], ['xiaoan', 'smile', 'R']] },
  { s: 'xiaoan', f: 'smile', t: '{位份}小主！底下的小太监都在押红船绿船，一赔三！您玩不玩？' },
  { if: G => side(G) === 'fei', then: [{ enter: 'guifei', face: 'smile', pos: 'RR' }, { s: 'guifei', f: 'smile', t: '押！本宫押绿船一百两！你也来，跟着本宫押！' }] },
  { c: [
    { t: '何止押？我来坐庄！统一收注、按赔率开盘！', danger: '043', then: [
      { s: 'os', f: 'star', t: '赔率、对冲、抽水——我上辈子可是看过很多财经短视频的！' },
      { s: 'n', t: '半个时辰后，你面前堆满了碎银子。赢了一百两。' },
      { s: 'n', t: '又半个时辰后，内务府总管带着人站在了你面前。' },
      { cast: [['me', 'panic', 'L'], ['gao', 'normal', 'R', { pose: 'whisk', prop: 'whisk' }]] },
      { s: 'gao', t: '“宫中聚众赌博，主谋——”他看了看你面前的银子，“就是您吧？”' },
    ], death: '043' },
    { t: '押十两绿船，凑个热闹', then: [{ s: 'n', t: '绿船赢了！陆峥在船上举起鼓槌，好像往你这边看了一眼。' }, add('trust_lu', 5)] },
    { t: '不赌。宫里不许聚赌，别给人留把柄', fx: { 规矩: 5, 警觉: 3 } },
  ] },
  { cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'R']] },
  { s: 'n', t: '龙舟冲到了终点附近，岸边挤满了人。船头那里视野最好，空着。' },
  { c: [
    { t: '站到船头看！顺便摆个《泰坦尼克号》的姿势', danger: '041', then: [
      { bg: 'taiye', cast: [['me', 'star', 'C']] },
      { s: 'me', f: 'star', t: '小桃，扶住我的腰！我要飞了——', jump: true },
      { s: 'xiaotao', f: 'shock', t: '小主您说什么？！' },
      { s: 'n', t: '龙舟冲线。船身一晃。你没有飞。你是直着下去的。', sfx: 'splash', shake: 0.9 },
    ], death: '041' },
    { t: '在岸边找个阴凉处看', fx: { 健康: 3 } },
  ] },
  { go: 'c3_d45_zongzi' },
];
N.c3_d45_zongzi = [
  { checkpoint: '第45天 · 粽子' },
  { cast: [['me', 'normal', 'L'], ['ningpin', 'smile', 'R', { prop: 'zongzi', pose: 'hold' }]] },
  { s: 'ningpin', f: 'smile', t: '妹妹，看得口渴了吧？姐姐亲手包的红枣粽子，尝尝？' },
  { s: 'n', t: '一盘六个粽子，绿油油、胖乎乎，捆着红线。' },
  { if: G => G.mem('M03') || G.mem('M04'), then: [{ s: 'os', f: 'think', t: '🔮 宁嫔的东西……上辈子的汤、胭脂，都有问题。粽子能幸免？' }] },
  { c: [
    { t: '“谢姐姐！”拿起最近的一个就咬', danger: '042', then: [
      { s: 'n', t: '红枣很甜，糯米很软。你吃得很香。' },
      { s: 'ningpin', f: 'smile', t: '好吃吗？好吃就多睡会儿吧。' },
      { s: 'n', t: '你确实睡了很久。' },
    ], death: '042' },
    { t: '“哇，好精致！”仔细看看每一个（观察验毒）', then: [
      { game: 'spot', kind: 'zongzi', dur: 15, tries: 2, failDeath: '042' },
      { s: 'os', f: 'think', t: '就是它。颜色、气泡、味道……这个粽子不对劲。不动声色——' },
      { s: 'me', f: 'smile', t: '这个包得最好看，妹妹舍不得吃，带回去供起来！' },
      { s: 'ningpin', f: 'normal', t: '……妹妹真会说话。' },
      { set: { zongziProof: true } }, add('intel', 1), { fx: { 警觉: 5 } },
    ] },
    { t: '“姐姐，我刚吃了三个粽子，实在撑了。”', then: [{ s: 'ningpin', f: 'smile', t: '那姐姐差人送到你宫里去~' }, { s: 'os', f: 'sweat', t: '……送来我也不吃。' }] },
  ] },
  { go: 'c3_d50' },
];

/* ---------------- 第 50 天 · 叶子牌 ---------------- */
N.c3_d50 = [
  { day: 50, time: '午', label: '第50天 · 慈宁宫叶子牌', ch: 'ch3' },
  { bg: 'cining', music: 'mystery', cast: [['me', 'normal', 'L'], ['taihou', 'smile', 'R', { pose: 'beads', prop: 'beads' }]], cat: { pos: 'RR', mood: 'happy' } },
  { s: 'n', t: '慈宁宫派人来请：太后三缺一，点名要你去凑一桌叶子牌。' },
  { s: 'taihou', f: 'smile', t: '来来来，坐。听说你下五子棋把皇帝都赢哭了？今儿陪哀家打几把。' },
  { s: 'os', f: 'think', t: '陪领导打牌，核心原则只有一条：让领导赢，但不能让领导看出来你在让。' },
  { game: 'cards', rounds: 5, failDeath: '048' },
  G => { const r = G.flag('game_cards') || {}; const add2 = r.happy ? 20 : 10; G.run.cnt.trust_hou = Math.min(100, (G.run.cnt.trust_hou || 0) + add2); P.UI.toast('🙏 太后信任 +' + add2, 'info', 1600); },
  { if: G => (G.flag('game_cards') || {}).happy, then: [{ s: 'taihou', f: 'smile', t: '有来有回，这才叫打牌！哀家好久没这么痛快了。' }],
    else: [{ s: 'taihou', f: 'think', t: '你这丫头，放水放得太明显了。……不过哀家赢了，开心。' }] },
  { s: 'n', t: '太后一边洗牌，一边心情很好地哼起了小曲。' },
  { s: 'taihou', f: 'smile', t: '♪ 两只老虎，两只老虎，跑得快…… ♪' },
  { face: { me: 'shock' } },
  { s: 'os', f: 'shock', t: '？？？？？这个调子——这个时代怎么会有《两只老虎》？！' },
  { mem: 'M11' },
  { c: [
    { t: '下意识接了一句：“♪ 一只没有耳朵…… ♪”', then: [
      { face: { taihou: 'shock' } },
      { s: 'n', t: '太后洗牌的手，停住了。' },
      { s: 'taihou', f: 'think', t: '……你从哪儿听来的？' },
      { s: 'me', f: 'sweat', t: '嫔、嫔妾小时候，奶娘唱的！' },
      { s: 'taihou', f: 'smile', t: '是吗。哀家的奶娘……也唱过。' },
      { s: 'n', t: '她看你的眼神，忽然多了点什么。像是在看一个很久没见的老乡。' },
      add('trust_hou', 10), { set: { tigerSong: true } },
    ] },
    { t: '假装没听见，低头理牌', fx: { 警觉: 5 }, then: [{ s: 'os', f: 'think', t: '先别声张。太后……到底是什么人？' }] },
  ] },
  { s: 'taihou', f: 'smile', t: '下个月就是哀家的寿辰了。到时候，你给哀家准备点有意思的。' },
  { go: 'c3_d55' },
];

/* ---------------- 第 55 天 · 太医院 ---------------- */
N.c3_d55 = [
  { day: 55, time: '午', label: '第55天 · 太医院', ch: 'ch3' },
  { bg: 'yonghe', music: 'day', cast: [['me', 'think', 'L'], ['xiaotao', 'normal', 'R']] },
  { if: G => G.flag('zongziProof'), then: [{ s: 'os', f: 'think', t: '龙舟宴上那个粽子还在我柜子里……得找温太医看看里面到底是什么。' }],
    else: [{ s: 'os', f: 'think', t: '宁嫔的汤、胭脂、粽子……我得找个懂药的人问问，宫里到底有哪些毒是银针验不出来的。' }] },
  { s: 'xiaotao', t: '小主想见温太医？太医院白天人多眼杂，晚上倒是清静……' },
  { c: [
    { t: '晚上清静，今晚一个人悄悄去', danger: '060', then: [
      { bg: 'lane_night', music: 'night', cast: [['me', 'normal', 'C']] },
      { s: 'n', t: '亥时。你提着小灯笼，一路摸到了太医院后门。温太医的屋子还亮着灯。' },
      { s: 'me', f: 'smile', t: '（小声）温太医，开门，是我——' },
      { enter: 'taijian', face: 'shock', pos: 'R' },
      { s: 'taijian', f: 'shock', t: '来人啊！有宫嫔深夜私会外臣！！', shake: 0.6 },
      { s: 'os', f: 'panic', t: '我是来问毒的！问毒！不是来私会的——' },
      { s: 'n', t: '没人听。在宫里，“深夜”和“外臣”放在一句话里，就已经是判决书了。' },
    ], death: '060' },
    { t: '白天带上小桃，借口“头疼”去请脉', then: [
      { bg: 'taiyiyuan', music: 'mystery', cast: [['xiaotao', 'normal', 'LL'], ['me', 'normal', 'L'], ['wen', 'normal', 'R', { pose: 'hold', prop: 'soup' }]] },
      { s: 'wen', f: 'normal', t: '{位份}头疼？……嗯，脉象平稳。小主想问的，怕不是头疼吧。' },
      { if: G => G.flag('zongziProof'), then: [
        { s: 'n', t: '你把油纸包着的粽子推过去。温太医剥开一角，闻了闻，脸色变了。' },
        { s: 'wen', f: 'shock', t: '……醉鱼草。量不大，吃了只会“睡得很沉”——沉到叫不醒。' },
        add('intel', 1), { set: { zongziKnown: true } },
      ] },
      { s: 'wen', t: '银针只认砒霜。宫里真正要命的东西，要靠眼睛、鼻子，还有……知道东西是从哪儿来的。' },
      { s: 'wen', f: 'think', t: '小主若真想查下去……三年前，有一桩案子。卷宗不在内务府，在太医院药柜最底层的夹层里。' },
      { mem: 'M20' },
      { s: 'wen', f: 'normal', t: '下官什么都没说。小主请回，药方在这儿：多睡觉，少喝别人的汤。' },
      add('intel', 1),
    ] },
    { t: '算了，太冒险，先不去', fx: { 健康: 3 } },
  ] },
  { go: 'c3_d58' },
];

/* ---------------- 第 58 天 · 太后寿宴 ---------------- */
N.c3_d58 = [
  { day: 58, time: '晚', label: '第58天 · 太后寿宴', ch: 'ch3' },
  { bg: 'shouyan', music: 'hall', cast: [['me', 'normal', 'L'], ['taihou', 'smile', 'C', { pose: 'beads', prop: 'beads' }], ['emperor', 'normal', 'R']] },
  { s: 'n', t: '慈宁宫张灯结彩。一个巨大的“寿”字挂在正中，金光闪闪。' },
  { s: 'gao', t: '各宫进献寿礼——{位份}{宫名}，献礼！' },
  { s: 'os', f: 'think', t: '我的寿礼是……' },
  { c: [
    { t: '西洋自鸣钟！到点会“当当”响，稀罕物！', danger: '047', then: [
      { s: 'n', t: '小太监把座钟抬上来。“当——当——”钟声响彻大殿。' },
      { s: 'n', t: '大殿里，安静得能听见礼部尚书的心跳声。' },
      { s: 'taihou', f: 'smile', t: '送……钟。好，好孩子，真是有心了。' },
      { s: 'os', f: 'panic', t: '送钟——送终——我是不是把成语接龙接到太后头上了？！' },
    ], death: '047' },
    { t: '亲手抄的一卷《心经》', fx: { 规矩: 5 }, then: [add('trust_hou', 5), { s: 'taihou', f: 'smile', t: '字写得……很有个性。哀家收下了。' }] },
    { t: '亲手做的“寿桃奶冻”（奶茶铺的手艺）', then: [add('trust_hou', 10), { s: 'taihou', f: 'star', t: '这是什么？软乎乎、甜丝丝的……哀家再来一个！' }, { s: 'emperor', f: 'smile', t: '母后，给儿子留一个。' }] },
  ] },
  { s: 'gao', t: '今儿的寿宴菜品，太后说了，让各宫小主各荐一道——{位份}，您荐什么？' },
  { c: [
    { t: '麻辣火锅！红油翻滚，热热闹闹，多喜庆！', danger: '046', then: [
      { s: 'n', t: '御膳房连夜熬出一锅红油。太后很给面子，吃了三片毛肚，辣得眼泪直流。' },
      { s: 'taihou', f: 'cry', t: '好……好吃……水……' },
      { s: 'n', t: '太后上火三日，嘴角起了两个大泡。你被派去御膳房刷锅。' },
      { s: 'n', t: '那口锅很大，你刷了很久很久。久到再也没有出来。' },
    ], death: '046' },
    { t: '一碗清汤长寿面，软烂好克化', fx: { 规矩: 3 }, then: [add('trust_hou', 5), { s: 'taihou', f: 'smile', t: '还是你懂哀家。这牙口，就爱吃软的。' }] },
    { t: '桂花糕（皇上爱吃甜的）', need: G => G.mem('M01'), mem: 'M01', fx: { 圣眷: 5 }, then: [{ s: 'emperor', f: 'smile', t: '……桂花糕？朕最爱。' }] },
  ] },
  { go: 'c3_d58_show' },
];
N.c3_d58_show = [
  { checkpoint: '第58天 · 寿宴才艺' },
  { bg: 'shouyan', music: 'hall', cast: [['ningpin', 'smile', 'L'], ['me', 'normal', 'C'], ['taihou', 'smile', 'R', { pose: 'beads', prop: 'beads' }]] },
  { s: 'ningpin', f: 'smile', t: '太后娘娘，{宫名}妹妹多才多艺，不如让她给大家表演个节目？' },
  { s: 'os', f: 'sweat', t: '宁嫔又来了。这是把我架在火上烤啊。' },
  { s: 'taihou', f: 'smile', t: '好啊。丫头，你会什么？' },
  { c: [
    { t: '唱一首我最拿手的《青花瓷》', danger: '045', then: [
      { s: 'me', f: 'star', t: '♪ 素胚勾勒出青花笔锋浓转淡—— ♪' },
      { s: 'n', t: '满殿宾客面面相觑。这是什么调？这是什么词？“天青色”是什么色？' },
      { face: { taihou: 'shock' } },
      { s: 'n', t: '只有太后，手里的佛珠“啪”地断了线，珠子滚了一地。' },
      { s: 'ningpin', f: 'smirk', t: '哎呀，妹妹唱的这是……西域妖曲？' },
      { s: 'n', t: '“妖曲惑主”四个字，比你的歌传得还快。' },
    ], death: '045' },
    { t: '跳一支舞，给太后贺寿（节奏小游戏）', then: [
      { game: 'dance', notes: 24, failDeath: '044' },
      { if: G => (G.flag('game_dance') || {}).great, then: [
        { s: 'n', t: '最后一个转身，裙摆像一朵花一样开了。满殿喝彩。' }, add('trust_hou', 15), { fx: { 名声: 10, 圣眷: 5 } },
        { s: 'taihou', f: 'star', t: '好！好！哀家好多年没看过这么好看的舞了！' },
      ], else: [
        { s: 'n', t: '跳得……还算完整。至少没踩到自己的裙子。' }, add('trust_hou', 5),
        { s: 'taihou', f: 'smile', t: '不错不错，心意到了就好。' },
      ] },
      { s: 'ningpin', f: 'normal', t: '……（笑容僵了一下）' },
    ] },
    { t: '背一首贺寿诗：“福如东海长流水，寿比南山不老松！”', fx: { 规矩: 3 }, then: [{ s: 'taihou', f: 'smile', t: '吉利话谁都会说。不过，哀家爱听。' }, add('trust_hou', 3)] },
  ] },
  { checkpoint: '第58天 · 寿宴烟花' },
  { bg: 'shouyan', music: 'happy', cast: [['me', 'normal', 'L'], ['xiaoan', 'smile', 'R']] },
  { s: 'n', t: '入夜，内务府在院子里摆了一排烟花。小安子拿着火折子，手直抖。' },
  { s: 'xiaoan', f: 'sweat', t: '奴、奴才从没点过这么大的……' },
  { c: [
    { t: '“我来点火！”一把抢过火折子', danger: '049', then: [
      { s: 'me', f: 'star', t: '放烟花我最在行了！大学跨年我一个人放了三箱！' },
      { s: 'n', t: '你点燃了引线。引线很短。比你记忆中的现代烟花，短很多。' },
      { flash: '#ffd36b', sfx: 'thud', shake: 1 },
      { s: 'n', t: '砰！夜空中绽开一朵巨大的牡丹。你的头发，也绽开了。' },
    ], death: '049' },
    { t: '退后三步，捂着耳朵鼓掌', then: [{ s: 'n', t: '烟花在夜空中炸开，一朵、两朵、三朵。太后笑得像个小孩。' }] },
  ] },
  { go: 'c3_d58_fo' },
];
N.c3_d58_fo = [
  { checkpoint: '第58天 · 佛堂' },
  { bg: 'cining', music: 'mystery', cast: [['me', 'normal', 'L'], ['taihou', 'smile', 'R', { pose: 'beads', prop: 'beads' }]] },
  { if: G => C(G, 'trust_hou') >= 30, then: [{ s: 'taihou', f: 'smile', t: '丫头，陪哀家去小佛堂上炷香。别人毛手毛脚的，哀家信不过。' }],
    else: [{ enter: 'ningpin', face: 'smile', pos: 'LL' }, { s: 'ningpin', f: 'smile', t: '太后要去佛堂上香？让{宫名}妹妹替您点香吧，妹妹最细心了。' }, { exit: 'ningpin' }] },
  { bg: 'fotang', music: 'mystery', cast: [['me', 'normal', 'L'], ['taihou', 'normal', 'R', { pose: 'beads', prop: 'beads' }]] },
  { s: 'n', t: '小佛堂里檀香袅袅。供桌上摆着一排新换的香，据说是今天才送来的。' },
  { c: [
    { t: '取一支，直接点上', danger: '056', then: [
      { s: 'n', t: '香点燃了。烟雾升起，带着一股……甜腻的苦味。' },
      { s: 'os', f: 'sleepy', t: '这香……怎么……这么……' },
      { s: 'taihou', f: 'shock', t: '丫头？！来人！快来人！' },
      { s: 'n', t: '你离香炉最近。所以你最先倒下。' },
    ], death: '056' },
    { t: '这排香被换过！找出被动过的那支（M12）', mem: 'M12', then: [
      { s: 'os', f: 'think', t: '上辈子就死在这儿。颜色发暗、烟是紫的——那一支！' },
      { set: { incenseProof: true } },
    ] },
    { t: '点之前，先闻一闻、看一看（观察验毒）', need: G => !G.mem('M12'), then: [
      { game: 'spot', kind: 'incense', dur: 15, tries: 2, failDeath: '056' },
      { set: { incenseProof: true } },
    ] },
    { t: '“嫔妾手笨，还是请嬷嬷来点吧。”', then: [{ s: 'taihou', f: 'normal', t: '……也罢。' }, { s: 'n', t: '后来听说，那天替太后点香的嬷嬷，在床上躺了半个月。' }, add('trust_hou', -5)] },
  ] },
  { if: G => G.flag('incenseProof'), then: [
    { s: 'me', f: 'angry', t: '太后，这支香不对。颜色比别的暗，烟里还有股甜腻的怪味。' },
    { face: { taihou: 'think' } },
    { s: 'taihou', f: 'think', t: '……哀家的佛堂，也有人敢伸手了。' },
    { s: 'taihou', f: 'smile', t: '丫头，你救了哀家一回。哀家记着。' },
    add('trust_hou', 20), add('intel', 1),
    { s: 'n', t: '太后把那支香包进了手帕里，没有声张。' },
  ] },
  { go: 'c3_d62' },
];

/* ---------------- 第 62 天 · 床底 ---------------- */
const homeBg = G => G.flag('movedOut') ? 'room_night' : 'yonghe_night';
N.c3_d62 = [
  { day: 62, time: '夜', label: '第62天 · 风雨欲来', ch: 'ch3' },
  G => { const bg = homeBg(G); return { go: bg === 'room_night' ? 'c3_d62r' : 'c3_d62y' }; },
];
N.c3_d62r = [{ bg: 'room_night', music: 'night', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'R']] }, { s: 'n', t: '景仁宫东配殿。搬来以后，夜里清静了不少。' }, { go: 'c3_d62b' }];
N.c3_d62y = [{ bg: 'yonghe_night', music: 'night', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'R']] }, { s: 'n', t: '永和宫偏殿。正殿那边的灯，今晚熄得特别晚。' }, { go: 'c3_d62b' }];
N.c3_d62b = [
  { s: 'xiaotao', f: 'sweat', t: '小主……宫里这两天怪怪的。听说慎刑司的刘嬷嬷，在各宫门口转悠。' },
  { if: G => G.died('051'), then: [{ s: 'os', f: 'think', t: '🔮 上辈子，小桃被带去问话，吓得什么都说了……今晚得先跟她交个底。' }] },
  { c: [
    { t: '拉着小桃坐下：“不管谁问你什么，照实说，别怕。我护着你。”', then: [add('trust_tao', 15), { s: 'xiaotao', f: 'cry', t: '小主……奴婢记住了。奴婢什么都不怕。' }] },
    { t: '“没事，早点歇着吧。”' },
  ] },
  { s: 'xiaotao', f: 'think', t: '对了小主，今儿下午，奴婢看见一个面生的宫女，从咱们屋里出来。说是来送新被褥的……' },
  { s: 'os', f: 'think', t: '新被褥？我没要过新被褥啊。' },
  { c: [
    { t: '今天太累了，明天再说，睡觉', danger: '050', then: [
      { s: 'n', t: '你一沾枕头就睡着了。梦里，你在奶茶店打工，客人点了一杯“巫蛊奶盖”。' },
      { bg: 'room_day', music: 'danger', cast: [['me', 'sleepy', 'L'], ['momo', 'angry', 'R', { pose: 'ruler', prop: 'ruler' }]] },
      { s: 'n', t: '第二天一早，门被一脚踹开。' },
      { s: 'momo', f: 'angry', t: '慎刑司奉皇后懿旨搜宫！——床底下，搜！' },
      { s: 'n', t: '一个扎满了针的布娃娃，从你床底下被拎了出来。背后写着太后的生辰八字。' },
      { s: 'me', f: 'panic', t: '这不是我的！我都不知道自己还会扎小人！' },
    ], death: '050' },
    { t: '把灯拿过来——检查床底！', go: 'c3_doll' },
  ] },
];
N.c3_doll = [
  { checkpoint: '第62天 · 床底的东西' },
  { s: 'n', t: '你趴在地上，举着灯往床底一照。' },
  { s: 'n', t: '一个布娃娃。身上扎满了针，背后贴着一张黄纸，写着……太后的生辰八字。', sfx: 'gong', shake: 0.5 },
  { face: { me: 'shock', xiaotao: 'shock' } },
  { s: 'xiaotao', f: 'shock', t: '巫、巫蛊！小主，这是要灭九族的！' },
  { if: G => G.mem('M10'), then: [
    { s: 'os', f: 'think', t: '🔮 这布料——淡青色云纹软烟罗。整个后宫，只有永和宫领过！' },
    { set: { clothId: true } },
  ], else: [{ s: 'os', f: 'think', t: '娃娃身上的布……淡青色，带云纹，摸起来又软又滑。不是寻常料子。' }] },
  { s: 'os', f: 'panic', t: '冷静。这东西不能留在屋里，但也不能乱扔。怎么办？' },
  { c: [
    { t: '藏进恭桶！最脏的地方，谁也不会去翻', danger: '059', then: [
      { s: 'n', t: '你捏着鼻子，把娃娃塞进了恭桶底下。' },
      { bg: 'room_day', music: 'danger', cast: [['me', 'smile', 'L'], ['momo', 'angry', 'R', { pose: 'ruler', prop: 'ruler' }]] },
      { s: 'momo', f: 'angry', t: '慎刑司搜宫！——床底、柜子、恭桶，一处都不许漏！' },
      { s: 'n', t: '恭桶被当着全宫人的面抬到院子正中，倒扣过来。' },
      { s: 'n', t: '娃娃出来了。别的东西也出来了。全宫的人都看见了。' },
    ], death: '059' },
    { t: '她扎我，我也扎她！连夜扎个小人咒宁嫔', danger: '052', then: [
      { s: 'os', f: 'angry', t: '以彼之道，还施彼身！我也会扎！' },
      { s: 'n', t: '你找来布头和针线，照着宁嫔的样子缝了个小人。刚扎下第一针——' },
      { cast: [['me', 'shock', 'L'], ['ningpin', 'smile', 'C'], ['huanghou', 'angry', 'R']] },
      { s: 'ningpin', f: 'smile', t: '皇后娘娘您看，臣妾就说，妹妹这几天神神秘秘的。' },
      { s: 'huanghou', f: 'angry', t: '人赃并获。', shake: 0.6 },
    ], death: '052' },
    { t: '剪下一角布料留作证据，把娃娃连夜送去慈宁宫（太后信任 ≥ 40）', need: G => C(G, 'trust_hou') >= 40, then: [
      { bg: 'cining', music: 'mystery', cast: [['me', 'normal', 'L'], ['taihou', 'think', 'R', { pose: 'beads', prop: 'beads' }]] },
      { s: 'taihou', f: 'think', t: '……哀家的生辰八字。有意思。' },
      { s: 'taihou', f: 'normal', t: '东西留在哀家这儿。谁来问，你就说什么都不知道。' },
      add('trust_hou', 10), { set: { clothScrap: true, dollSafe: 'hou' } },
    ] },
    { t: '剪下一角布料留作证据，把娃娃交给陆峥处理（陆峥信任 ≥ 40）', need: G => C(G, 'trust_lu') >= 40, then: [
      { bg: 'lane_night', cast: [['me', 'normal', 'L'], ['luzheng', 'normal', 'R', { pose: 'spear', prop: 'spear' }]] },
      { s: 'luzheng', f: 'normal', t: '交给我。今晚的事，我没见过你。' },
      add('trust_lu', 5), { set: { clothScrap: true, dollSafe: 'lu' } },
    ] },
    { t: '剪下一角布料留作证据，把娃娃塞进炭盆烧掉', then: [
      { s: 'n', t: '火苗舔上布娃娃，一会儿就只剩一小撮灰。你把剪下的那角布料，缝进了贴身的荷包里。' },
      { set: { clothScrap: true, dollSafe: 'burn' } },
    ] },
  ] },
  { go: 'c3_d63' },
];

/* ---------------- 第 63 天 · 搜宫 ---------------- */
N.c3_d63 = [
  { day: 63, time: '晨', label: '第63天 · 巫蛊案', ch: 'ch3' },
  { bg: 'room_day', music: 'danger', cast: [['me', 'normal', 'L'], ['xiaotao', 'sweat', 'C'], ['momo', 'angry', 'R', { pose: 'ruler', prop: 'ruler' }]] },
  { s: 'momo', f: 'angry', t: '慎刑司奉皇后懿旨搜宫！' },
  { s: 'n', t: '刘嬷嬷带人把屋子翻了个底朝天。床底下，空空如也。' },
  { s: 'momo', f: 'think', t: '……哼。这个丫头，带走问话。' },
  { s: 'xiaotao', f: 'shock', t: '小、小主——！' },
  { if: G => C(G, 'trust_tao') < 40 && G.died('051'), then: [
    { s: 'os', f: 'think', t: '🔮 上辈子，小桃就是这样被带走，吓得什么都说了——' },
    { c: [
      { t: '冲上去握住小桃的手：“别怕，照实说，我信你！”', then: [add('trust_tao', 20), { s: 'xiaotao', f: 'cry', t: '……嗯！奴婢不怕！' }] },
      { t: '（不敢出声）', danger: '051' },
    ] },
  ] },
  { if: G => C(G, 'trust_tao') < 40, then: [
    { s: 'n', t: '小桃被带走了。她在慎刑司里待了一个时辰。' },
    { bg: 'shenxing', cast: [['xiaotao', 'cry', 'L'], ['momo', 'angry', 'R', { pose: 'ruler', prop: 'ruler' }]] },
    { s: 'momo', f: 'angry', t: '说！你家主子平日里都干些什么？' },
    { s: 'xiaotao', f: 'cry', t: '小、小主会做奇怪的奶茶……会说听不懂的话……半夜对着月亮说“我想回家”……还、还说自己活了好几辈子……' },
    { s: 'momo', f: 'smirk', t: '妖言、异术、魇镇。齐了。' },
    { s: 'n', t: '小桃说的每一句都是真的。可连在一起，就成了你的罪状。' },
  ], death: '051' },
  { s: 'n', t: '半个时辰后，小桃回来了。眼睛红红的，腰板却挺得笔直。' },
  { s: 'xiaotao', f: 'cry', t: '小主，奴婢什么都没乱说！奴婢说，小主是天底下最好的主子！' },
  add('trust_tao', 5),
  { s: 'xiaoan', t: '（气喘吁吁跑进来）出大事了！慎刑司在长春宫——贵妃娘娘的床底下，搜出了巫蛊娃娃！' },
  { cast: [['me', 'shock', 'L'], ['xiaoan', 'shock', 'R']] },
  { s: 'xiaoan', f: 'shock', t: '贵妃娘娘被禁足了，翠缕姐姐不见了，宁嫔娘娘还说……说那娃娃的针脚，跟{宫名}小主的绣活很像！' },
  { s: 'os', f: 'think', t: '一石二鸟。我床底下那个没搜到，就换个法子把我也拖下水。' },
  { if: G => side(G) === 'fei', then: [{ s: 'os', f: 'panic', t: '而且我是公开投靠贵妃的人……贵妃要是倒了，下一个就是我。' }] },
  { s: 'xiaotao', f: 'think', t: '小主，浣衣局管着各宫的衣物布料，那儿的人什么都知道。奴婢有个同乡叫阿芸，就在浣衣局……' },
  { c: [
    { t: '去浣衣局帮工几天，暗中打听布料和翠缕的下落', fx: { 健康: -5 }, set: { helpFei: true, washStreak: 0, washTotal: 0 }, go: 'c3_w1' },
    { t: '明哲保身，关起门来等慎刑司传唤', fx: { 规矩: 3 }, go: 'c3_d69' },
  ] },
];

/* ---------------- 第 64–68 天 · 浣衣局 ---------------- */
function washNode(i) {
  const day = 63 + i, last = i === 5;
  return [
    { day, time: '晨', label: `第${day}天 · 浣衣局`, ch: 'ch3' },
    { bg: 'laundry', music: 'day', cast: [['me', 'normal', 'L'], ['ayun', 'smile', 'R']] },
    i === 1 ? { s: 'n', t: '浣衣局。院子里晾满了各宫的衣裳，皂角水的味道呛得人直咳嗽。你换上粗布衣裳，混进了洗衣的宫女里。' } : { s: 'n', t: `浣衣局第 ${i} 天。手上的水泡破了又起。` },
    i === 1 ? { s: 'ayun', f: 'smile', t: '你就是小桃说的那位？……嘘，这儿的人只认活儿，不认主子。先洗衣服，洗着洗着，话就多了。' } : { s: 'ayun', t: '今天还有三大盆。' },
    { if: G => G.flag('washStreak') >= 4, then: [{ s: 'os', f: 'sleepy', t: '眼前的衣服……在转圈……我是不是该歇一歇了……' }] },
    { c: [
      { t: '撸起袖子继续搓！边搓边跟阿芸打听', then: [
        G => { const f = G.run.flags; f.washStreak = (f.washStreak || 0) + 1; f.washTotal = (f.washTotal || 0) + 1; G.run.stats.健康 = Math.max(0, G.run.stats.健康 - 8); },
        { if: G => G.flag('washStreak') >= 5, then: [
          { s: 'n', t: '第五天。你搓完了第一千件衣裳，站起来想伸个懒腰。' },
          { s: 'n', t: '眼前一黑。你一头栽进了皂角水里，冒了一串泡泡。' },
        ], death: '058' },
        add('ayun', 15),
        { if: G => G.flag('washTotal') === 2 && G.flag('clothScrap') && !G.flag('clothId'), then: [
          { s: 'n', t: '你装作不经意，把那角布料亮给阿芸看。' },
          { s: 'ayun', f: 'shock', t: '这是云纹软烟罗！今年内务府只进了两匹，全给了……永和宫。' },
          { s: 'os', f: 'think', t: '永和宫。宁嫔。果然是她。' },
          { set: { clothId: true } }, { mem: 'M10' },
        ] },
        { if: G => G.flag('washTotal') === 3, then: [
          { s: 'ayun', f: 'think', t: '你打听翠缕？……她三天前半夜来浣衣局，求我把一件沾了香灰的衣裳洗了。哭得可凶了。' },
          { s: 'ayun', t: '我猜她躲在御花园西边那个废了的绛雪轩里。那儿晚上有侍卫巡逻，你可小心。' },
          { set: { cuilvWhere: true } }, add('intel', 1),
        ] },
      ] },
      { t: '歇一天，揉揉手，喝口热水', fx: { 健康: 10 }, then: [G => { G.run.flags.washStreak = 0; }, { s: 'ayun', f: 'smile', t: '歇着吧。在这儿，倒下的人可不少。' }] },
      { t: '今晚就去绛雪轩找翠缕', need: G => G.flag('cuilvWhere'), go: 'c3_escape' },
      { t: '离开浣衣局，回去准备对质', need: G => G.flag('washTotal') >= 1, go: 'c3_d69' },
    ] },
    last ? { if: G => G.flag('cuilvWhere'), go: 'c3_escape' } : { go: 'c3_w' + (i + 1) },
    { go: 'c3_d69' },
  ];
}
for (let i = 1; i <= 5; i++) N['c3_w' + i] = washNode(i);

/* ---------------- 夜探绛雪轩 ---------------- */
N.c3_escape = [
  { time: '夜' },
  { bg: 'garden_night', music: 'danger', cast: [['me', 'sweat', 'C']] },
  { s: 'n', t: '子时。御花园西边。远处有灯笼在晃——巡逻的侍卫。' },
  { s: 'os', f: 'sweat', t: '贴着墙根走，别被灯笼照到……' },
  { game: 'escape', dur: 16, lives: 2, failDeath: '061' },
  { bg: 'garden_night', music: 'mystery', cast: [['me', 'normal', 'L'], ['cuilv', 'cry', 'R']] },
  { s: 'n', t: '绛雪轩里黑漆漆的。角落里缩着一个人影，是翠缕。' },
  { s: 'cuilv', f: 'cry', t: '别、别抓我！……是你？你来做什么？来看我笑话？' },
  { if: G => G.flag('sawCuilv') || G.mem('M09'), then: [{ s: 'os', f: 'think', t: '长春宫台阶上的油，也是她抹的。可她只是个听命行事的宫女。' }] },
  { s: 'cuilv', f: 'cry', t: '是永和宫的人……他们抓了我娘，逼我把那个东西塞到娘娘床底下……我对不起娘娘……' },
  { c: [
    { t: '“跟我去慎刑司作证。陆侍卫会护着你和你娘。”（陆峥信任 ≥ 40）', need: G => C(G, 'trust_lu') >= 40, then: [{ s: 'cuilv', f: 'cry', t: '……真的？好，我去。' }, { set: { cuilvWitness: 'lu' } }] },
    { t: '“你不说，贵妃倒了，你也活不成。说了，还有一线生机。”', then: [{ s: 'cuilv', f: 'cry', t: '……我说。我全都说。' }, { set: { cuilvWitness: 'deal' } }] },
    { t: '“小桃以前也被人要挟过。我帮过她，也能帮你。”', need: G => G.flag('taoSaved'), then: [{ s: 'cuilv', f: 'cry', t: '小桃……她跟我说过你。我信你。' }, { set: { cuilvWitness: 'tao' } }, add('trust_tao', 5)] },
  ] },
  { s: 'os', f: 'star', t: '证人，到手！' },
  { go: 'c3_d69' },
];

/* ---------------- 第 69 天 · 慎刑司对质（Boss） ---------------- */
N.c3_d69 = [
  { day: 69, time: '午', label: '第69天 · 慎刑司对质', ch: 'ch3' },
  { bg: 'shenxing', music: 'danger', cast: [['me', 'normal', 'LL'], ['ningpin', 'smile', 'L'], ['huanghou', 'normal', 'C'], ['momo', 'angry', 'R', { pose: 'ruler', prop: 'ruler' }], ['guifei', 'angry', 'RR']] },
  { s: 'n', t: '慎刑司。阴冷的石墙上，一盏油灯跳个不停。贵妃跪在一边，发髻散了，眼睛却还是红的——气红的。' },
  { s: 'huanghou', f: 'normal', t: '巫蛊魇镇，诅咒太后。此案今日必须有个了结。' },
  { s: 'ningpin', f: 'smile', t: '皇后娘娘，臣妾也不愿相信……可那娃娃的针脚，确实和{宫名}妹妹给太后绣的荷包，一模一样呢。' },
  { s: 'momo', f: 'angry', t: '{位份}{宫名}，你可认罪？' },
  { c: [
    { t: '“我没错，我不说。”', set: { silent: 1 }, go: 'c3_q2' },
    { t: '“嫔妾不认。嫔妾有话要说。”', go: 'c3_proof' },
  ] },
];
N.c3_q2 = [
  { s: 'momo', f: 'angry', t: '不说？慎刑司有的是法子让人开口。再问你一遍——你认不认？', shake: 0.3 },
  { s: 'os', f: 'sweat', t: '（越不说越像心虚……）' },
  { c: [
    { t: '“我没错，我不说。”', set: { silent: 2 }, go: 'c3_q3' },
    { t: '“……嫔妾说。嫔妾有证据。”', go: 'c3_proof' },
  ] },
];
N.c3_q3 = [
  { s: 'momo', f: 'angry', t: '最后一遍。认，还是不认？', shake: 0.5 },
  { s: 'ningpin', f: 'smile', t: '妹妹，你就说句话吧，姐姐看着都心疼。' },
  { c: [
    { t: '“我没错，我不说！”', danger: '053', go: 'c3_dark' },
    { t: '“……好，我说！”', go: 'c3_proof' },
  ] },
];
N.c3_dark = [
  { s: 'momo', f: 'smirk', t: '好硬的骨头。拖去小黑屋，让她慢慢“想”。' },
  { bg: 'coldroom', music: 'night', cast: [['me', 'normal', 'C']] },
  { s: 'n', t: '小黑屋的门关上了。一天、十天、一百天……' },
  { s: 'n', t: '后来，再也没人想起来这间屋子里还关着一个人。只有角落里的蘑菇，一年比一年长得好。' },
  { death: '053' },
];
const BOSS = [['me', 'normal', 'LL'], ['ningpin', 'smile', 'L'], ['huanghou', 'normal', 'C'], ['momo', 'angry', 'R', { pose: 'ruler', prop: 'ruler' }], ['guifei', 'angry', 'RR']];
const showOpts = [
  { t: '📜 出示娃娃身上的布料：云纹软烟罗', need: G => G.flag('clothId') && !G.flag('shownCloth'), set: { shownCloth: true }, then: [
    { s: 'me', f: 'angry', t: '这块布，是从那个娃娃身上剪下来的。云纹软烟罗——今年内务府只进了两匹，全送去了永和宫！' },
    { face: { ningpin: 'shock' } },
    { s: 'huanghou', f: 'think', t: '……刘嬷嬷，去内务府查账。' },
    { s: 'n', t: '一炷香后，刘嬷嬷回来，冲皇后点了点头。' },
  ], go: 'c3_proof' },
  { t: '📜 出示娃娃身上的布料（还不知道是什么料子）', need: G => G.flag('clothScrap') && !G.flag('clothId') && !G.flag('shownScrap'), set: { shownScrap: true }, then: [
    { s: 'me', f: 'normal', t: '这块布是从娃娃身上剪下来的！' },
    { s: 'huanghou', f: 'normal', t: '所以呢？这是什么料子，出自哪个宫？你说不出来，这块布就什么都证明不了。' },
    { s: 'os', f: 'sweat', t: '……早知道先找人认一认布料了。' },
  ], go: 'c3_proof' },
  { t: '🧑 传证人：翠缕', need: G => G.flag('cuilvWitness') && !G.flag('shownCuilv'), set: { shownCuilv: true }, then: [
    { cast: [['me', 'normal', 'L'], ['cuilv', 'cry', 'C'], ['guifei', 'angry', 'R']] },
    { s: 'cuilv', f: 'cry', t: '奴婢招……是永和宫的人抓了奴婢的娘，逼奴婢把娃娃塞到贵妃娘娘床底下的！' },
    { face: { guifei: 'shock', ningpin: 'normal' } },
    { s: 'guifei', f: 'angry', t: '翠缕！你——！……原来如此。', shake: 0.4 },
  ], go: 'c3_proof' },
  { t: '🍙 出示龙舟宴上的毒粽子', need: G => G.flag('zongziProof') && !G.flag('shownZongzi'), set: { shownZongzi: true }, then: [
    { s: 'me', f: 'angry', t: '还有这个！龙舟宴上宁嫔给嫔妾的粽子，里面有醉鱼草！' },
    { s: 'ningpin', f: 'cry', t: '妹妹……姐姐好心给你粽子，你放了一个月，如今拿出来说有毒？谁知道是谁放进去的呢？' },
    { s: 'huanghou', f: 'normal', t: '今日审的是巫蛊，别扯远了。' },
    { s: 'os', f: 'sweat', t: '……时机不对。这个先收着。' },
  ], go: 'c3_proof' },
  { t: '🙏 请太后做主（太后信任 ≥ 40）', need: G => C(G, 'trust_hou') >= 40 && !G.flag('askedHou'), set: { askedHou: true }, then: [
    { cast: [['me', 'normal', 'L'], ['taihou', 'normal', 'C', { pose: 'beads', prop: 'beads' }], ['huanghou', 'normal', 'R']] },
    { s: 'taihou', f: 'normal', t: '这么热闹，怎么不叫上哀家？' },
    { s: 'taihou', f: 'think', t: '哀家的八字，扎在一个娃娃身上。哀家倒想问问，是谁这么惦记哀家。' },
    { if: G => G.flag('dollSafe') === 'hou', then: [{ s: 'taihou', f: 'smile', t: '这丫头前夜就把床底的东西送到了哀家手上——真要害哀家，会自己送上门来？' }] },
    { if: G => G.flag('incenseProof'), then: [{ s: 'taihou', f: 'smile', t: '寿宴那天，佛堂的香被人换了，是她替哀家挑出来的。' }] },
    { s: 'taihou', f: 'smile', t: '这孩子，哀家信得过。' },
  ], go: 'c3_proof' },
  { t: '“……嫔妾没有别的要说了。”', then: [], go: 'c3_verdict' },
];
N.c3_proof = [
  { if: G => G.flag('shownCloth') && G.flag('shownCuilv'), go: 'c3_verdict' },
  { cast: BOSS },
  { s: 'huanghou', f: 'normal', t: '你有什么证据，拿出来。' },
  { c: showOpts },
];
N.c3_verdict = [
  { cast: BOSS },
  { if: G => G.flag('shownCloth') && G.flag('shownCuilv'), go: 'c3_win' },
  { if: G => G.flag('askedHou') && (G.flag('shownCloth') || G.flag('shownCuilv') || G.flag('dollSafe') === 'hou' || G.flag('incenseProof')), go: 'c3_half' },
  { s: 'momo', f: 'smirk', t: '说来说去，什么都证明不了。' },
  { s: 'huanghou', f: 'normal', t: '证据不足，那便先押着，慢慢审。' },
  { s: 'os', f: 'panic', t: '我还有话……可我还能说什么？说什么都没人信……' },
  { s: 'n', t: '你张了张嘴，最后什么也没说出来。' },
  { go: 'c3_dark' },
];
N.c3_half = [ // 太后保下了你，但贵妃没洗清
  { s: 'huanghou', f: 'think', t: '……既然太后作保，{宫名}暂且无罪。' },
  { if: G => G.flag('shownCuilv'), then: [{ s: 'huanghou', t: '翠缕的口供，本宫会细查。贵妃——也先回长春宫吧。' }, { set: { feiClear: true } }], go: 'c3_ning' },
  { s: 'huanghou', f: 'normal', t: '至于贵妃，娃娃是从长春宫搜出来的，人证物证俱在。降为嫔，禁足长春宫。' },
  { face: { guifei: 'cry' } },
  { s: 'guifei', f: 'angry', t: '本宫没有……本宫没有！', shake: 0.5 },
  { set: { feiFall: true } },
  { if: G => side(G) === 'fei', then: [
    { s: 'n', t: '贵妃被拖了下去。宁嫔转过头，温柔地看向你。' },
    { s: 'ningpin', f: 'smile', t: '妹妹，你不是一直跟着贵妃“学气魄”吗？' },
    { s: 'n', t: '三天后，一道懿旨：{位份}{宫名}，党附罪妃，迁居冷宫。' },
    { s: 'n', t: '冷宫的门槛很高。你被抬进去的时候，已经不需要迈腿了。' },
  ], death: '054' },
  { go: 'c3_ning' },
];
N.c3_win = [
  { s: 'huanghou', f: 'angry', t: '永和宫的料子，永和宫的人。宁嫔，你作何解释？', shake: 0.4 },
  { face: { ningpin: 'cry' } },
  { s: 'ningpin', f: 'cry', t: '臣妾……臣妾不知道啊！定是宫里的奴才手脚不干净——' },
  { s: 'n', t: '不到一个时辰，永和宫一个叫秋菱的宫女“认了罪”，当晚在柴房里撞了柱。' },
  { s: 'os', f: 'angry', t: '死无对证。宁嫔……连自己的人都下得去手。' },
  { s: 'huanghou', f: 'normal', t: '贵妃受了委屈，回长春宫好生歇着。{宫名}，查案有功。' },
  { set: { feiClear: true, bossWin3: true } }, { fx: { 圣眷: 10, 名声: 10 } },
  { item: '证据卡·永和宫布料' },
  { go: 'c3_ning' },
];
N.c3_ning = [
  { if: G => G.flag('feiClear') && G.flag('helpFei'), then: [
    { bg: 'changchun', music: 'happy', cast: [['me', 'normal', 'L'], ['guifei', 'normal', 'R', { pose: 'fan', prop: 'fanGold' }]] },
    { s: 'guifei', f: 'normal', t: '……本宫这辈子，没欠过谁的人情。' },
    { s: 'guifei', f: 'blush', t: '你冒着被砍头的风险去浣衣局搓衣服，就为了救本宫？傻子。' },
    { s: 'guifei', f: 'smile', t: '从今往后，谁动你，就是动本宫。' },
    { set: { sisters: true } }, G => { G.run.cnt.kill = 0; P.UI.toast('🔪 贵妃杀意 → 0　🤝 解锁「姐妹同盟」', 'mem', 2400); },
  ] },
  { go: 'c3_end' },
];

/* ---------------- 章末 ---------------- */
N.c3_end = [
  { day: 70, time: '夜', label: '第70天 · 余波', ch: 'ch3' },
  { bg: 'yonghe_night', music: 'mystery', cast: [['ningpin', 'normal', 'C']] },
  { s: 'n', t: '永和宫正殿。宁嫔慢慢摘下发间的玉簪。' },
  { s: 'ningpin', f: 'normal', t: '秋菱跟了我七年。' },
  { s: 'ningpin', f: 'smirk', t: '……可惜了。不过没关系，棋子嘛，总是要用的。' },
  { s: 'ningpin', f: 'angry', t: '{宫名}。你到底，是从哪儿来的？' },
  { bg: 'fotang', music: 'mystery', cast: [['me', 'normal', 'L'], ['taihou', 'normal', 'R', { pose: 'beads', prop: 'beads' }]] },
  { s: 'taihou', f: 'normal', t: '丫头，你过来。' },
  { s: 'taihou', f: 'think', t: '你唱的那些曲子，你说的那些怪话……哀家年轻时，也有人这么说过哀家。' },
  { s: 'taihou', f: 'smile', t: '冷宫里住着一位静太妃。她认得你娘——原来那个“你”的娘。去见见她吧。' },
  { s: 'n', t: '佛堂里，太后轻轻哼起了一段调子。这一次，你听清了。' },
  { s: 'n', t: '♪ 天青色等烟雨，而我在等你…… ♪' },
  { s: 'os', f: 'shock', t: '太后……你到底是谁？' },
  { chapterEnd: 'ch3', title: '第三章 · 宫斗 · 通关！', rankText: '{宫名}，你从巫蛊案里活了下来！',
    tease: '第四章《真相 · 冷宫与观星台》敬请期待——<br>冷宫里的静太妃、太医院的旧卷宗、裂成两半的照影镜。还有，太后的秘密。' },
];

P.registerChapter({
  id: 'ch3', title: '第三章 · 宫斗', start: 'c3_start', nodes: N, startBg: 'yonghe',
  blurb: '太液池龙舟宴 · 太后寿宴 · 巫蛊案 · 第 36–70 天。站队、献舞、叶子牌，还有床底下的布娃娃。',
  defaultRun(run) { run.stats = { 圣眷: 40, 名声: 55, 健康: 80, 警觉: 40, 疑心: 0, 规矩: 55 }; run.flags = { rank: '常在', rankName: '晋封常在', pouchOk: true, taoSaved: true }; run.cnt = { trust_tao: 50, trust_lu: 40, kill: 40, intel: 2 }; },
  deathMems: { '045': 'M11', '050': 'M10', '056': 'M12' },
});
})(window.PALACE = window.PALACE || {});
