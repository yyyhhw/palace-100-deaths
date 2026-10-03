/* 第二章：立足（永和宫偏殿 · 第 11–35 天）
   关系值存在 run.cnt：trust_tao 小桃信任 / trust_lu 陆峥信任 / cat 糯米好感 / kill 贵妃杀意 / intel 情报 / silver 银两 */
(function (P) {
'use strict';
const N = {};
const LBL = { trust_tao: '🍑 小桃信任', trust_lu: '🛡️ 陆峥信任', cat: '🐱 糯米好感', kill: '🔪 贵妃杀意', intel: '🕸️ 情报', silver: '💰 银两' };
const add = (k, by) => G => { G.run.cnt[k] = Math.max(0, (G.run.cnt[k] || 0) + by); P.UI.toast(`${LBL[k]} ${by > 0 ? '+' : ''}${by}`, 'info', 1400); };
const C = (G, k) => G.cnt(k);

/* ---------------- 开场 ---------------- */
N.c2_start = [
  G => { G.run.ch = 'ch2'; const c = G.run.cnt; if (c.trust_tao == null) { c.trust_tao = 30 + (G.flag('taoTrust') ? 10 : 0); c.trust_lu = 0; c.cat = G.flag('catFriend') ? 30 : 10; c.kill = G.flag('guifeiNoticed') ? 30 : 10; c.intel = 0; c.silver = 50; } if (!G.run.flags.rank) G.run.flags.rank = '答应'; },
  { hud: true },
  { title: '第二章 · 立足', sub: '永和宫偏殿 · 第 11–35 天' },
  { if: G => G.flag('rank') === '宫女', go: 'c2_maid' },
  { go: 'c2_d11' },
];
N.c2_maid = [
  { bg: 'kitchen', music: 'day', cast: [['me', 'sweat', 'L'], ['xiaoan', 'normal', 'R']] },
  { s: 'n', t: '御膳房。你蹲在灶台边削第三百个土豆。' },
  { s: 'xiaoan', f: 'shock', t: '{名}姐姐！快洗手！永和宫的宁嫔娘娘来了，指名要见你！' },
  { cast: [['me', 'shock', 'L'], ['ningpin', 'smile', 'R']] },
  { s: 'ningpin', f: 'smile', t: '就是你呀？选秀那天我就瞧着顺眼。本宫向皇后娘娘讨了个恩典——' },
  { s: 'ningpin', t: '封你做答应，住到本宫的永和宫偏殿来，可好？' },
  { s: 'os', f: 'think', t: '天上掉馅饼……在宫斗剧里，通常馅是毒的。' },
  { s: 'me', f: 'smile', t: '谢、谢娘娘恩典！' },
  { set: { rank: '答应', rankName: '答应（宁嫔讨来的）', maidLine: true } },
  { go: 'c2_d11' },
];

/* ---------------- 第 11 天 · 迁居 ---------------- */
N.c2_d11 = [
  { day: 11, time: '晨', label: '第11天 · 迁居永和宫', ch: 'ch2' },
  { bg: 'yonghe_yard', music: 'day', cast: [['xiaotao', 'smile', 'L'], ['me', 'normal', 'C'], ['ningpin', 'smile', 'R']] },
  { s: 'n', t: '永和宫。院子里种满了竹子，风一吹，沙沙响。' },
  { s: 'ningpin', f: 'smile', t: '{名}妹妹来啦~往后你就住偏殿，有什么缺的，尽管跟姐姐说。' },
  { s: 'os', f: 'normal', t: '好温柔的小姐姐……眼睛弯弯的，说话软软的。' },
  { if: G => G.mem('M02'), then: [
    { s: 'os', f: 'think', t: '……等等。🔮 赵如意的安神香和小纸条，背后都是永和宫宁嫔。' },
    { s: 'os', f: 'sweat', t: '我这是——住进狼窝了？还是狼亲自来接的？' },
    { fx: { 警觉: 15 } },
  ] },
  { s: 'ningpin', t: '对了，明儿卯时要去坤宁宫给皇后娘娘请安，新人可千万别迟到。' },
  { s: 'ningpin', f: 'smile', t: '皇后娘娘最讲规矩了。上一个迟到的妹妹，抄《女诫》抄到现在呢~' },
  { exit: 'ningpin' },
  { s: 'xiaotao', f: 'smile', t: '小主，咱们总算有自己的屋子了！奴婢给您铺床去！' },
  { s: 'n', t: '💡 第二章开始，点左上角的属性栏可以查看「小桃信任」「陆峥信任」「贵妃杀意」等关系值。' },
  { time: '夜' },
  { bg: 'yonghe_night', music: 'night', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'R']] },
  { s: 'xiaotao', t: '小主，第一晚住新地方，您……打算做点什么？' },
  { c: [
    { t: '早点睡。小桃，明早记得叫我！', fx: { 健康: 5 }, then: [add('trust_tao', 5), { s: 'xiaotao', f: 'smile', t: '包在奴婢身上！' }], go: 'c2_d12' },
    { t: '趁夜摸清永和宫的地形（夜间行动）', fx: { 警觉: 10, 健康: -5 }, then: [
      { s: 'n', t: '你蹑手蹑脚地把永和宫转了一圈：正殿、偏殿、小厨房……还有一间上了锁的小佛堂。' },
      { s: 'os', f: 'think', t: '佛堂上锁？宁嫔这么温柔的人，佛堂里藏着什么？' },
      { set: { lockedShrine: true } },
    ], go: 'c2_n11_back' },
    { t: '溜去御膳房找小安子叙旧（夜间行动）', fx: { 健康: -5 }, then: [
      { bg: 'kitchen', music: 'night', cast: [['me', 'smile', 'L'], ['xiaoan', 'smile', 'R']] },
      { s: 'xiaoan', f: 'smile', t: '{名}小主！您可算想起奴才了！' },
      { s: 'xiaoan', t: '奴才跟您说，御膳房就是后宫的“消息集散地”——哪个宫要了几斤糖，奴才全知道！' },
      { s: 'os', f: 'star', t: '古代版大数据！这个人脉必须要！' },
      { set: { anNet: true } }, add('intel', 1),
      { bg: 'yonghe_night', music: 'night', cast: [['me', 'normal', 'L'], ['xiaotao', 'sleepy', 'R']] },
    ], go: 'c2_n11_back' },
  ] },
];
N.c2_n11_back = [
  { s: 'n', t: '回到偏殿，已经快三更了。小桃揉着眼睛等你。' },
  { s: 'xiaotao', f: 'sleepy', t: '小主……明早卯时请安，要奴婢叫您吗？' },
  { c: [
    { t: '要要要！一定要叫醒我！', then: [add('trust_tao', 5)], go: 'c2_d12' },
    { t: '不用，我生物钟准得很（并没有闹钟）', danger: '021', go: 'c2_late' },
  ] },
];
N.c2_late = [
  G => { G.run.day = 12; G.run.time = '晨'; P.UI.hud(); },
  { bg: 'yonghe', music: 'danger', cast: [['me', 'sleepy', 'C']] },
  { s: 'n', t: '第二天。阳光很好。好得过分。' },
  { s: 'me', f: 'shock', t: '……现在什么时辰了？！', shake: 0.6 },
  { cast: [['me', 'panic', 'L'], ['xiaotao', 'cry', 'R']] },
  { s: 'xiaotao', f: 'cry', t: '巳时了小主！请安早就散了！皇后娘娘说……说……' },
  { bg: 'kunning', music: 'hall', cast: [['me', 'cry', 'L'], ['huanghou', 'smile', 'R']] },
  { s: 'huanghou', f: 'smile', t: '{位份}睡得可好？不要紧，本宫最体谅新人了。' },
  { s: 'huanghou', t: '《女诫》抄一百遍吧。抄完再睡。' },
  { s: 'n', t: '你抄到第九十九遍的时候，看见孟婆在纸上冲你招手。' },
  { death: '021' },
];

/* ---------------- 第 12 天 · 坤宁宫请安 ---------------- */
N.c2_d12 = [
  { day: 12, time: '晨', label: '第12天 · 坤宁宫请安', ch: 'ch2' },
  { bg: 'yonghe', music: 'day', cast: [['me', 'sleepy', 'L'], ['xiaotao', 'smile', 'R']] },
  { s: 'xiaotao', f: 'smile', t: '小主醒醒！卯时了！奴婢给您梳了个最端庄的头！' },
  { s: 'me', f: 'smile', t: '小桃你是我的神！' },
  { bg: 'kunning', music: 'hall', cast: [['me', 'normal', 'L'], ['huanghou', 'normal', 'C']] },
  { s: 'n', t: '坤宁宫。地砖光可鉴人。皇后娘娘缓步走在前面，裙摆像一条长长的蓝色河流。' },
  { s: 'os', f: 'sweat', t: '离皇后好远……别人都已经进殿了，我是不是该快点？' },
  { c: [
    { t: '快走两步跟上！', then: [
      { s: 'n', t: '你快走了两步。地砖：滑。裙摆：长。你的脚：恰好落在裙摆上。' },
      { sfx: 'slip' }, { face: { me: 'shock', huanghou: 'shock' } },
      { s: 'n', t: '“刺啦——”', shake: 0.9, sfx: 'paper' },
      { s: 'huanghou', f: 'angry', t: '……这是先帝御赐的凤尾裙。', shake: 0.5 },
      { s: 'n', t: '你被拖了下去。据说那条裙子后来补好了，你没有。' },
    ], death: '020' },
    { t: '低头碎步，保持三步距离', fx: { 规矩: 5 }, go: 'c2_d12_hall' },
    { t: '原地站好，等皇后先进殿', fx: { 规矩: 3 }, go: 'c2_d12_hall' },
  ] },
];
N.c2_d12_hall = [
  { cast: [['guifei', 'proud', 'L', { pose: 'fan', prop: 'fanGold' }], ['huanghou', 'normal', 'C'], ['ningpin', 'smile', 'R'], ['me', 'normal', 'RR']] },
  { s: 'huanghou', f: 'normal', t: '新来的{位份}{宫名}，抬起头来。' },
  { s: 'guifei', f: 'smirk', t: '哟，就是选秀那天出风头的那个？长得也就……一般般嘛。' },
  { s: 'os', f: 'sweat', t: '华贵妃。红衣服、金扇子、气场两米八。第一章我就见识过了。' },
  { c: [
    { t: '“贵妃娘娘说得是，臣妾蒲柳之姿。”', fx: { 规矩: 5 }, then: [{ s: 'guifei', f: 'proud', t: '哼，倒是识相。' }] },
    { t: '“娘娘火气这么大，小心长皱纹哦~”', fx: { 名声: 5 }, then: [add('kill', 40), { s: 'guifei', f: 'angry', t: '你——！', shake: 0.5 }, { s: 'huanghou', f: 'smirk', t: '好了，都少说两句。' }, { s: 'os', f: 'sweat', t: '……嘴比脑子快了。贵妃的眼神，像是在挑哪块地埋我。' }] },
    { t: '（微笑，不说话）', then: [{ s: 'guifei', f: 'proud', t: '哑巴？' }] },
  ] },
  { s: 'huanghou', f: 'normal', t: '本宫近日在想，后宫人多事杂，可有什么法子管得更好些？{位份}，你是新人，说说看。' },
  { c: [
    { t: '“可以给各宫做绩效考核！按月打分、末位淘汰！”', then: [
      { s: 'me', f: 'star', t: '比如：请安准时率、宫务完成度、团结姐妹指数……按月打分，末位淘汰！', jump: true },
      { s: 'huanghou', f: 'smile', t: '……妙啊。“末位淘汰”，本宫喜欢。' },
      { s: 'huanghou', f: 'smirk', t: '那就从这个月开始。本月最末一位——新人入宫，宫务完成度零，就是你了。' },
      { s: 'n', t: '你成了大晟后宫第一个被“优化”掉的员工。' },
    ], death: '030' },
    { t: '“娘娘治宫有方，臣妾只管跟着学。”', fx: { 名声: 5, 规矩: 5 }, then: [{ s: 'huanghou', f: 'smile', t: '嗯，是个懂事的。' }] },
    { t: '“臣妾觉得……可以办个读书会？”', fx: { 名声: -3, 圣眷: 2 }, then: [{ s: 'huanghou', f: 'smile', t: '读书会？倒是新鲜。……先读《女诫》吧。' }, { s: 'os', f: 'sweat', t: '自己给自己布置了作业。' }] },
  ] },
  { s: 'n', t: '桌上摆着几碟点心。最中间那盘红枣糕，红得发亮。' },
  { s: 'ningpin', f: 'smile', t: '（小声）妹妹饿了吧？那盘红枣糕可香了，尝一块？' },
  { c: [
    { t: '拿一块红枣糕尝尝', then: [
      { s: 'n', t: '你拿起一块红枣糕，咬了一口。软糯香甜。' },
      { s: 'n', t: '殿里突然很安静。' },
      { s: 'guifei', f: 'angry', t: '本宫的红枣糕。御膳房专为本宫做的。你也配？', shake: 0.6 },
      { bg: 'changchun', music: 'danger', cast: [['me', 'cry', 'C']] },
      { s: 'n', t: '你被罚跪在长春宫门口。太阳很大。你晒成了一块“{现代名}干”。' },
    ], death: '022' },
    { t: '“谢姐姐，我不饿。”（只喝茶）', fx: { 警觉: 5 } },
    { need: G => G.mem('M02') || G.stat('警觉') >= 30, t: '（宁嫔推荐的？那就更不能吃了）', fx: { 警觉: 10 }, then: [{ s: 'os', f: 'think', t: '她推荐的东西，我一口都不碰。' }, { face: { ningpin: 'smirk' } }] },
  ] },
  { s: 'huanghou', f: 'normal', t: '按规矩，新人要给本宫奉茶。{位份}，你来吧。' },
  { s: 'os', f: 'sweat', t: '又是奉茶！这次是在皇后面前……可不能洒。' },
  { game: 'tea', errKey: 'tea2', max: 3, hard: 1.15, dur: 15, who: 'huanghou', whoName: '皇后', gtitle: '奉茶 · 坤宁宫',
    intro: '托盘往哪边歪，就<b>按住另一边</b>！<br>这次是坤宁宫，皇后正看着你呢。', warn: '（洒 3 次……皇后的新衣服就保不住了）' },
  { if: G => (G.flag('game_tea') || {}).fail, then: [
    { cast: [['huanghou', 'shock', 'C'], ['me', 'panic', 'R']] },
    { s: 'n', t: '最后一晃——整杯热茶，稳稳地泼在了皇后的新衣上。', sfx: 'splash', shake: 0.7 },
    { s: 'huanghou', f: 'smile', t: '……没事。本宫不烫。' },
    { s: 'os', f: 'panic', t: '她在笑。她在笑！笑比骂可怕一百倍！' },
  ], death: '026' },
  { if: G => (G.flag('game_tea') || {}).spills === 0, then: [{ s: 'huanghou', f: 'smile', t: '一滴未洒，手很稳。赏。' }, { fx: { 名声: 10 } }, add('silver', 20), { s: 'guifei', f: 'angry', t: '……哼。' }, add('kill', 15)] },
  { s: 'huanghou', t: '都散了吧。' },
  { s: 'guifei', f: 'proud', t: '（经过你身边）新来的，往后见了本宫，记得避着走。' },
  { go: 'c2_d13' },
];

/* ---------------- 第 13 天 · 御花园 ---------------- */
N.c2_d13 = [
  { day: 13, time: '晨', label: '第13天 · 御花园', ch: 'ch2' },
  { bg: 'yonghe', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'smile', 'R']] },
  { s: 'xiaotao', f: 'smile', t: '小主，今儿天好，各宫娘娘都去御花园赏花。您穿哪件宫装？' },
  { c: [
    { t: '正红色的！喜庆！', go: 'c2_red' },
    { t: '月白色的，素净', fx: { 规矩: 3 }, go: 'c2_garden' },
    { t: '鹅黄色的，嫩嫩的', fx: { 名声: 5 }, then: [add('kill', 10)], go: 'c2_garden' },
    { t: '先问问小桃：今天贵妃穿什么颜色？', then: [{ s: 'xiaotao', f: 'think', t: '奴婢听长春宫的人说，贵妃娘娘今儿穿正红。……小主千万别撞上！' }, { s: 'me', f: 'smile', t: '那我穿月白。' }, add('trust_tao', 5)], go: 'c2_garden' },
  ] },
];
N.c2_red = [
  { bg: 'garden', music: 'day', cast: [['me', 'smile', 'L'], ['guifei', 'proud', 'R', { pose: 'fan', prop: 'fanGold' }]] },
  { s: 'n', t: '御花园。你穿着正红色宫装，迎面走来一位——也穿着正红色宫装的娘娘。' },
  { s: 'n', t: '两朵一模一样的大红花，在花园中央相遇了。' },
  { face: { guifei: 'angry' } },
  { s: 'guifei', f: 'angry', t: '本宫的颜色，你也配？', shake: 0.6, sfx: 'gong' },
  { s: 'guifei', t: '来人，送她去冷宫——给冷宫的墙当个“颜色样板”！' },
  { s: 'os', f: 'cry', t: '撞衫不如撞墙……现在我要去撞冷宫的墙了。' },
  { death: '023' },
];
N.c2_garden = [
  { bg: 'swing', music: 'day', cast: [['me', 'smile', 'C'], ['xiaotao', 'smile', 'R']] },
  { s: 'n', t: '御花园东角有一架秋千，挂着彩绳。' },
  { s: 'xiaotao', f: 'smile', t: '小主，奴婢推您荡秋千吧！' },
  { s: 'me', f: 'star', t: '好呀！', jump: true },
  { s: 'n', t: '秋千荡了起来。风从耳边呼呼吹过。' },
  { c: [
    { t: '再高一点！', go: 'c2_swing2' },
    { t: '好啦好啦，够了够了', fx: { 健康: 5 }, then: [add('trust_tao', 5), { s: 'xiaotao', f: 'smile', t: '小主笑起来真好看！' }], go: 'c2_garden2' },
  ] },
];
N.c2_swing2 = [
  { s: 'xiaotao', f: 'smile', t: '嘿——咻！' },
  { s: 'n', t: '秋千荡得比宫墙还高。你看见了宫外的街道、糖葫芦摊，还有自由。' },
  { s: 'xiaotao', f: 'sweat', t: '小、小主，已经很高了……' },
  { c: [
    { t: '再高一点！！我要看到更远的地方！', then: [
      { s: 'xiaotao', f: 'shock', t: '嘿——咻——！！' },
      { sfx: 'whoosh' }, { s: 'n', t: '彩绳“啪”地断了。你像一颗流星，飞过了宫墙……的一半。', shake: 0.8 },
      { s: 'n', t: '然后挂在了墙外的一棵老槐树上，晃啊晃。' },
    ], death: '036' },
    { t: '好了好了，下来下来！', fx: { 健康: 3 }, go: 'c2_garden2' },
  ] },
];
N.c2_garden2 = [
  { bg: 'garden', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'R']] },
  { s: 'n', t: '路过假山时，里面传来两个宫女的悄悄话。' },
  { s: 'n', name: '宫女甲（假山后）', t: '……你听说没？贵妃身边的翠缕，最近老往永和宫那边跑……' },
  { s: 'n', name: '宫女乙（假山后）', t: '嘘！还有啊，新来的那个{位份}——' },
  { s: 'os', f: 'think', t: '在说我？！' },
  { c: [
    { t: '悄悄凑近，听个完整的', then: [
      { s: 'n', t: '你踮着脚往假山里挪。一步、两步——' },
      { sfx: 'thud' }, { s: 'n', t: '踩断了一根树枝。', shake: 0.4 },
      { s: 'n', name: '宫女甲', t: '谁？！……{位份}？！您躲在这儿偷听？' },
      { s: 'n', name: '宫女乙', t: '来人呐！有人窥探宫闱！' },
      { s: 'n', t: '第二天，全宫都在传一个新八卦：“新来的{位份}，躲在假山后头偷听，被抓了现行。”' },
      { s: 'os', f: 'cry', t: '我本来是吃瓜群众……我怎么成了瓜？' },
    ], death: '032' },
    { t: '听两句就走，记在心里', fx: { 警觉: 5 }, then: [{ s: 'os', f: 'think', t: '翠缕……贵妃的宫女，往永和宫跑？记下了。' }, { set: { intelGossip: true } }, add('intel', 1)] },
    { t: '干咳一声，假装路过', fx: { 规矩: 3 }, then: [{ s: 'n', t: '假山里瞬间安静了。' }] },
  ] },
  { s: 'n', t: '“喵——”一团橘色的毛球从花丛里滚了出来。' },
  { cat: { pos: 'C', from: 'RR', mood: 'happy' } },
  { s: 'xiaotao', f: 'smile', t: '是御猫糯米！' },
  { c: [
    { mem: 'M07', t: '掏出小鱼干（糯米只吃小鱼干）', then: [{ s: 'n', t: '糯米“嗷呜”一口叼走了小鱼干，在你脚边打了三个滚。' }, add('cat', 30)] },
    { t: '摸摸它的头', then: [{ s: 'n', t: '糯米眯起眼睛，用脑袋蹭了蹭你的手。' }, add('cat', 15)] },
    { t: '离它远点（上一世被它坑过）', then: [{ s: 'n', t: '糯米“哼”了一声，甩着尾巴走了。' }] },
  ] },
  { cat: null },
  { go: 'c2_d14' },
];

/* ---------------- 第 14 天 · 宁嫔的安神汤 ---------------- */
N.c2_d14 = [
  { day: 14, time: '夜', label: '第14天 · 宁嫔的安神汤', ch: 'ch2' },
  { bg: 'yonghe_night', music: 'night', cast: [['me', 'normal', 'L'], ['ningpin', 'smile', 'R', { pose: 'hold', prop: 'soup' }]] },
  { s: 'ningpin', f: 'smile', t: '妹妹初来，夜里睡不安稳吧？姐姐亲手熬了一碗安神汤。' },
  { s: 'ningpin', t: '还有这盒西域来的胭脂，香得很，送你~' },
  { item: '西域胭脂' },
  { s: 'os', f: 'think', t: '又是汤又是胭脂……宫斗剧经验告诉我：越温柔，越要命。' },
  { c: [
    { t: '掏出银针验一验——没变黑，喝！', then: [
      { s: 'n', t: '你郑重地把银针插进汤里。拔出来——亮闪闪的，一点没黑。' },
      { s: 'me', f: 'smile', t: '没毒！姐姐对我真好！' }, { s: 'n', t: '咕嘟咕嘟。' },
      { face: { ningpin: 'smirk' } },
      { s: 'ningpin', f: 'smirk', t: '……妹妹好好睡。睡久一点。' },
      { face: { me: 'sleepy' } }, { s: 'n', t: '你睡得很香。香到再也没醒。' },
    ], death: '024' },
    { t: '“姐姐的心意，我直接干了！”', then: [
      { s: 'n', t: '咕嘟咕嘟。有点苦，还有一丝……杏仁味？' }, { face: { me: 'sleepy' } },
      { s: 'ningpin', f: 'smirk', t: '好妹妹。' },
    ], death: '024' },
    { need: G => G.mem('M03') || G.stat('警觉') >= 40, t: '（假装喝下，悄悄吐进袖子里，留一点汤底）', fx: { 警觉: 10 }, then: [
      { s: 'n', t: '你仰头“喝”了一大口，借着擦嘴，全吐进了袖口的帕子里。' },
      { s: 'me', f: 'smile', t: '好喝！谢谢姐姐！' },
      { s: 'ningpin', f: 'smile', t: '……妹妹喜欢就好。' },
      { s: 'os', f: 'think', t: '帕子湿了一角，一股淡淡的苦杏仁味。证据，get。' },
      { set: { soupSample: true } }, { item: '浸了汤的帕子' },
    ] },
    { t: '“今晚有点闹肚子……汤先放着，我待会儿喝。”', then: [
      { s: 'ningpin', f: 'normal', t: '那妹妹记得趁热喝哦。' }, { exit: 'ningpin' },
      { s: 'n', t: '宁嫔一走，你把汤倒进了窗边的兰花盆里。' },
      { s: 'n', t: '第二天早上，兰花枯了。叶子卷得像一张哭脸。' },
      { s: 'os', f: 'shock', t: '……！！这汤，是真的有问题！' },
      { fx: { 警觉: 15 } }, { set: { flowerDead: true } },
    ] },
  ] },
  { go: 'c2_d15' },
];

/* ---------------- 第 15 天 · 胭脂 & 小桃 ---------------- */
N.c2_d15 = [
  { day: 15, time: '晨', label: '第15天 · 西域胭脂', ch: 'ch2' },
  { bg: 'yonghe', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'R']] },
  { s: 'xiaotao', f: 'smile', t: '小主，宁嫔娘娘送的胭脂好香呀！今儿要擦上吗？' },
  { c: [
    { t: '擦上！今天要美美的去请安', then: [
      { s: 'n', t: '你对着铜镜，细细地擦上了胭脂。脸颊粉粉的，香气幽幽的。' },
      { s: 'me', f: 'blush', t: '哇……这也太好看了吧！' },
      { s: 'n', t: '香气越来越浓。镜子里的你越来越美……也越来越模糊。' },
      { face: { me: 'sleepy' } }, { s: 'xiaotao', f: 'shock', t: '小主？小主您怎么了？！' },
    ], death: '025' },
    { t: '收起来，先不用', fx: { 警觉: 5 }, then: [{ s: 'os', f: 'think', t: '宁嫔送的东西，先放着。' }] },
    { need: G => G.mem('M05'), t: '（西域胭脂里掺了慢毒）收好，留作证据', fx: { 警觉: 10 }, then: [{ set: { rougeProof: true } }, { s: 'os', f: 'think', t: '这盒胭脂，将来是能说话的。' }] },
  ] },
  { s: 'n', t: '“啪嚓！”小桃手一抖，打碎了一只茶杯。', sfx: 'spill' },
  { s: 'xiaotao', f: 'cry', t: '小主恕罪！奴婢、奴婢最近总睡不好……' },
  { c: [
    { t: '“没事，人没伤着就好。”', then: [add('trust_tao', 10), { s: 'xiaotao', f: 'cry', t: '小主……' }] },
    { t: '“一只杯子而已，扣你一个月月钱！”', then: [add('trust_tao', -15), { s: 'xiaotao', f: 'cry', t: '……是。' }, add('silver', 5)] },
    { t: '“毛手毛脚的，出去跪着！”', danger: true, then: [add('trust_tao', -25), { s: 'xiaotao', f: 'cry', t: '……奴婢遵命。' }, { s: 'os', f: 'sweat', t: '我是不是……太凶了？' }] },
  ] },
  { go: 'c2_d16' },
];

/* ---------------- 第 16 天 · 太医院 & 奶茶铺 ---------------- */
N.c2_d16 = [
  { day: 16, time: '晨', label: '第16天 · 头疼与生意经', ch: 'ch2' },
  { bg: 'yonghe', music: 'day', cast: [['me', 'sweat', 'L'], ['xiaoan', 'smile', 'R', { pose: 'hold', prop: 'plate' }]] },
  { s: 'n', t: '你头疼得厉害。正巧小安子来送点心。' },
  { s: 'xiaoan', f: 'smile', t: '小主脸色不好！要不要奴才跑一趟太医院？奴才腿快！' },
  { c: [
    { t: '“那你去太医院说一声：我要治头疼的药。”', then: [
      { s: 'xiaoan', f: 'smile', t: '好嘞！“小主要药”——奴才记住了！' }, { exit: 'xiaoan' },
      { s: 'n', t: '小安子跟御膳房的小李子说：“{位份}要药。”' },
      { s: 'n', t: '小李子跟太医院的小张说：“{位份}要……那种药。”' },
      { s: 'n', t: '小张跟院判说：“{位份}要毒药！”' },
      { cast: [['me', 'shock', 'L'], ['guard', 'angry', 'R', { pose: 'spear', prop: 'spear' }]] },
      { s: 'guard', t: '奉命搜查！听说{位份}在找毒药——想毒谁啊？！', shake: 0.6 },
      { s: 'os', f: 'cry', t: '古代版传话游戏……输了是要命的！' },
    ], death: '034' },
    { t: '写张纸条：“头疼，求温太医开方”，让小安子带去', fx: { 规矩: 3 }, go: 'c2_wen' },
    { t: '“不麻烦了，我自己去太医院。”', fx: { 健康: -3 }, go: 'c2_wen' },
  ] },
];
N.c2_wen = [
  { bg: 'yonghe', cast: [['me', 'normal', 'L'], ['wen', 'normal', 'R', { pose: 'hold', prop: 'soup' }]] },
  { s: 'wen', f: 'normal', t: '下官温衍，太医院的。{位份}这是思虑过重，喝两帖药就好。' },
  { s: 'os', f: 'blush', t: '眼镜……是古代也有眼镜的吗？算了，好看就行。' },
  { if: G => G.flag('soupSample'), then: [
    { s: 'me', f: 'think', t: '温太医，能帮我看看这块帕子吗？上面沾了点……汤。' },
    { s: 'wen', f: 'shock', t: '……这是苦杏仁。量很小，日积月累，人会“睡”过去。' },
    { s: 'wen', f: 'think', t: '银针验不出来。银针只认砒霜。' },
    { mem: 'M04' }, { set: { soupProof: true } }, add('intel', 1),
    { s: 'wen', f: 'normal', t: '{位份}……谁给您喝的这个？' },
    { s: 'me', f: 'think', t: '……一个很温柔的人。' },
  ] },
  { if: G => G.flag('flowerDead') && !G.flag('soupSample'), then: [{ s: 'me', f: 'think', t: '温太医，什么汤能让兰花一夜枯死？' }, { s: 'wen', f: 'think', t: '……{位份}，以后来路不明的汤，一口都别喝。银针验不出来的毒，多了去了。' }, { mem: 'M04' }] },
  { exit: 'wen' },
  { cast: [['me', 'normal', 'L'], ['xiaoan', 'smile', 'R']] },
  { s: 'xiaoan', f: 'smile', t: '小主，您上回说的那个“奶茶”，奴才偷偷跟御膳房的姐妹们一说，她们都想尝尝！' },
  { s: 'xiaoan', t: '一杯三十文……不，三十两！宫里人有钱没处花！' },
  { s: 'os', f: 'star', t: '在古代开奶茶店？前世我在奶茶店打过工！这是我的主场！' },
  { if: G => !G.flag('anNet'), then: [{ s: 'xiaoan', t: '对了，以后宫里有什么风吹草动，奴才都来告诉您！' }, { set: { anNet: true } }, add('intel', 1)] },
  { set: { teaRound: 0 } },
  { go: 'c2_shop' },
];
N.c2_shop = [
  { s: 'n', t: '永和宫偏殿后门，“宫中第一奶茶铺”悄悄开张了。' },
  { game: 'milktea', customers: 4, patience: 15, price: 30 },
  G => { const r = G.flag('game_milktea') || {}; G.run.cnt.silver = (G.run.cnt.silver || 0) + (r.earned || 0); G.run.flags.teaRound = (G.run.flags.teaRound || 0) + 1; if (r.served) G.run.flags.teaMaker = true; P.UI.toast('💰 银两 +' + (r.earned || 0) + '（共 ' + G.run.cnt.silver + ' 两）', 'item', 1800); },
  { if: G => G.flag('teaRound') === 1 && G.flag('game_milktea').served >= 2, then: [{ s: 'xiaoan', f: 'smile', t: '小主！外头又排起队了！' }, add('kill', 10)] },
  { if: G => G.cnt('silver') > 300, go: 'c2_raid' },
  { if: G => G.flag('teaRound') >= 1, then: [{ s: 'xiaoan', f: 'sweat', t: '小主……听说内务府最近在查“私营商贾”，攒到三百两可就太招摇了。咱们是不是……收着点？' }] },
  { c: [
    { t: '见好就收，今天打烊', go: 'c2_d17' },
    { t: '扩大经营！再卖一批！', danger: '039', go: 'c2_shop' },
  ] },
];
N.c2_raid = [
  { bg: 'yonghe_yard', music: 'danger', cast: [['me', 'shock', 'L'], ['gao', 'smirk', 'R', { pose: 'whisk', prop: 'whisk' }]] },
  { s: 'gao', f: 'smirk', t: '哟，{位份}好兴致。内务府接到举报：永和宫有人“私营商贾、以妖饮惑众”。' },
  { s: 'me', f: 'panic', t: '那、那叫奶茶！不是妖饮！' },
  { s: 'gao', t: '三百多两银子，比咱家一年的月钱还多。来人——连人带锅，一并查抄！' },
  { s: 'n', t: '宫中第一奶茶铺，开业一天，倒闭一天。' },
  { death: '039' },
];

/* ---------------- 第 17 天 · 夜巡的侍卫 ---------------- */
N.c2_d17 = [
  { day: 17, time: '夜', label: '第17天 · 夜里的侍卫', ch: 'ch2' },
  { bg: 'yonghe_night', music: 'night', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'R']] },
  { s: 'xiaotao', f: 'normal', t: '小主，今晚月色好，要不要去外头走走消消食？' },
  { c: [
    { t: '出去走走', go: 'c2_lu' },
    { t: '不了，早点睡', fx: { 健康: 5 }, go: 'c2_d18' },
  ] },
];
N.c2_lu = [
  { bg: 'lane_night', music: 'night', cast: [['me', 'normal', 'L']] },
  { s: 'n', t: '宫道上静悄悄的。你走着走着……迷路了。' },
  { s: 'n', name: '？？？', t: '站住！什么人？' },
  { enter: 'luzheng', face: 'angry', pos: 'R' },
  { s: 'luzheng', f: 'angry', t: '御前侍卫陆峥。宫禁时分，{位份}在此做什么？' },
  { s: 'os', f: 'sweat', t: '剑眉星目，一脸正气……这是标准的“男二”长相啊！' },
  { c: [
    { t: '“我迷路了……能带我回永和宫吗？”（实话）', then: [add('trust_lu', 30), { s: 'luzheng', f: 'normal', t: '……这边走。下次夜里别一个人出来。' }] },
    { need: G => G.flag('teaMaker'), t: '“迷路了。请你喝杯奶茶，当带路费？”', then: [add('trust_lu', 35), { s: 'luzheng', f: 'shock', t: '这是……？' }, { s: 'n', t: '陆峥犹豫着喝了一口，眼睛亮了。' }, { s: 'luzheng', f: 'smile', t: '……卑职送您回去。' }] },
    { t: '“我在梦游。”（翻白眼伸直手臂）', then: [add('trust_lu', 5), { s: 'luzheng', f: 'think', t: '……梦游的人，不会自己说自己在梦游。' }] },
  ] },
  { s: 'n', t: '路过一间屋子。门缝里透出灯光，门楣上写着三个字：敬事房。' },
  { s: 'luzheng', f: 'normal', t: '那是敬事房，放召见名单的地方，闲人勿近。卑职先去前面巡一圈。' },
  { exit: 'luzheng' },
  { s: 'os', f: 'think', t: '召见名单……我的牌子在不在上面？门好像没锁……' },
  { c: [
    { t: '溜进去看一眼，就一眼', then: [
      { bg: 'jingshi', music: 'danger', cast: [['me', 'think', 'L']] },
      { s: 'n', t: '屋里一排排绿色的小木牌，整整齐齐。你在角落找到了自己的——被人翻到了背面。' },
      { s: 'os', f: 'shock', t: '谁把我的牌子翻过去了？！' },
      { enter: 'gao', face: 'smirk', pos: 'R' },
      { s: 'gao', f: 'smirk', t: '小主~您看见什么了？', shake: 0.5, sfx: 'gong' },
      { s: 'gao', t: '也罢。永和宫那边交代过：您的牌子，翻不得。……咱家多嘴了。来人。' },
      { s: 'n', t: '偷看名单的人，名字从此真的不在名单上了——哪张名单都不在了。' },
    ], death: '035' },
    { t: '算了，好奇心害死猫', fx: { 规矩: 3 }, then: [{ s: 'n', t: '你乖乖回了永和宫。' }] },
  ] },
  { go: 'c2_d18' },
];

/* ---------------- 第 18–19 天 · 给太后绣荷包 ---------------- */
N.c2_d18 = [
  { day: 18, time: '晨', label: '第18天 · 绣荷包', ch: 'ch2' },
  { bg: 'yonghe', music: 'day', cast: [['me', 'normal', 'L'], ['ningpin', 'smile', 'R']] },
  { s: 'ningpin', f: 'smile', t: '妹妹，太后娘娘最喜欢小辈们亲手绣的荷包。各宫都在赶呢，你也绣一个吧？' },
  { s: 'ningpin', t: '后天就要交，可得抓紧哦~' },
  { s: 'os', f: 'sweat', t: '后天？！我上辈子连扣子都没缝过！' },
  { set: { lateNights: 0 } },
  { time: '夜' },
  { bg: 'yonghe_night', music: 'night', cast: [['me', 'think', 'C']] },
  { s: 'n', t: '夜深了。荷包才绣了个边。' },
  { c: [
    { t: '熬夜赶工！今晚不睡了！', fx: { 健康: -40 }, then: [G => { G.run.flags.lateNights++; }, { s: 'n', t: '你绣到了鸡叫。眼睛里的血丝，比绣线还红。' }] },
    { t: '睡觉。明天再说', fx: { 健康: 5 } },
  ] },
  { s: 'n', t: '第二天夜里。' },
  { c: [
    { t: '继续熬！最后一晚了！', fx: { 健康: -40 }, then: [G => { G.run.flags.lateNights++; }, { face: { me: 'sleepy' } }, { s: 'n', t: '你的手开始抖，针扎了自己三回。' }] },
    { t: '睡觉。手稳比时间多重要', fx: { 健康: 5 } },
  ] },
  { bg: 'yonghe', music: 'day', cast: [['me', 'normal', 'C']] },
  { s: 'n', t: '交荷包的日子到了。最后几针，就看现在！' },
  G => { G.run.flags.tiredHands = G.flag('lateNights') >= 2; },
  { if: G => G.flag('tiredHands'), then: [{ game: 'embroider', dur: 20, need: 0.85, tired: true }], else: [{ game: 'embroider', dur: 25, need: 0.85 }] },
  { if: G => !(G.flag('game_embroider') || {}).ok && G.flag('lateNights') >= 2, then: [
    { face: { me: 'sleepy' } },
    { s: 'n', t: '最后一针扎歪了。你盯着那只“鸳鸭”，眼前一黑——' },
    { s: 'n', t: '连熬两宿的身体，终于罢工了。你一头栽在了绣架上。' },
  ], death: '027' },
  { if: G => (G.flag('game_embroider') || {}).ok, then: [{ s: 'n', t: '荷包送到了慈宁宫。太后摸着那对胖鸳鸯，笑出了声。' }, { fx: { 名声: 10 } }, { item: '太后的回礼·玉镯' }, { set: { pouchOk: true } }],
    else: [{ s: 'n', t: '荷包送到了慈宁宫。太后端详了半天：“这……鸭子，挺精神。”' }, { fx: { 名声: -3 } }] },
  { go: 'c2_d20' },
];

/* ---------------- 第 20 天 · 召见下棋 ---------------- */
N.c2_d20 = [
  { day: 20, time: '午', label: '第20天 · 养心殿召见', ch: 'ch2' },
  { bg: 'yonghe_yard', music: 'day', cast: [['me', 'normal', 'L'], ['gao', 'normal', 'R', { pose: 'whisk', prop: 'whisk' }]] },
  { s: 'gao', t: '皇上口谕——宣{位份}{宫名}，养心殿陪驾下棋！' },
  { if: G => G.flag('chess'), then: [{ s: 'os', f: 'star', t: '选秀那天的“下棋”，原来皇上记着呢！' }] },
  { s: 'os', f: 'think', t: '下棋……古代的围棋我不会，但五子棋我是小区冠军！' },
  { bg: 'yangxin', music: 'hall', cast: [['luzheng', 'normal', 'LL', { pose: 'spear', prop: 'spear' }], ['me', 'normal', 'L'], ['emperor', 'normal', 'R']] },
  { if: G => G.cnt('trust_lu') > 0, then: [{ s: 'luzheng', f: 'normal', t: '（低声）{位份}。' }, { s: 'me', f: 'smile', t: '（低声）陆侍卫！又见面了。' }] },
  { c: [
    { t: '冲门口的陆峥眨眨眼，打个招呼', then: [add('trust_lu', 10), { s: 'luzheng', f: 'blush', t: '……（耳朵红了）' }] },
    { t: '目不斜视，规规矩矩进殿', fx: { 规矩: 3 } },
  ] },
  { s: 'emperor', f: 'normal', t: '听说你会一种“五子连珠”的棋？陪朕下几局。' },
  { if: G => G.stat('健康') < 30 && G.died('028'), then: [
    { s: 'os', f: 'sleepy', t: '🔮 上辈子……就是在这张棋盘上睡着的。眼皮又开始打架了……' },
    { c: [
      { t: '狠狠掐自己一把，再灌一大口浓茶提神', fx: { 健康: 20 }, then: [{ s: 'n', t: '浓茶苦得你龇牙咧嘴。但眼睛，睁开了。' }] },
      { t: '硬撑，应该没事', danger: '028' },
    ] },
  ] },
  { if: G => G.stat('健康') < 30, go: 'c2_doze' },
  { game: 'gomoku', games: 3 },
  { if: G => (G.flag('game_gomoku') || {}).sweep, go: 'c2_sweep' },
  G => { const r = G.flag('game_gomoku') || {}; const w = r.wins || 0; G.run.cnt.kill = (G.run.cnt.kill || 0) + w * 15; if (w) P.UI.toast('🔪 贵妃杀意 +' + (w * 15) + '（皇上夸你棋下得好，传到了长春宫）', 'info', 1800); },
  { if: G => (G.flag('game_gomoku') || {}).wins === 0, then: [{ s: 'emperor', f: 'smile', t: '哈哈哈！三局全胜！朕的棋艺，天下无双！' }, { s: 'os', f: 'sweat', t: '（输得我好辛苦……）' }, { fx: { 圣眷: 10 } }],
    else: [{ s: 'emperor', f: 'smile', t: '有输有赢，才有意思。你这棋，下得有趣。' }, { fx: { 圣眷: 15 } }] },
  { go: 'c2_choke' },
];
N.c2_doze = [
  { s: 'n', t: '棋盘摆好了。皇上落下第一子。' },
  { face: { me: 'sleepy' } },
  { s: 'n', t: '你连熬了两宿的眼皮，比棋子还重。' },
  { s: 'emperor', f: 'normal', t: '该你了。' },
  { s: 'me', f: 'sleepy', t: '呼——噜——呼——噜——', emote: '💤' },
  { s: 'emperor', f: 'angry', t: '……', shake: 0.4 },
  { s: 'n', t: '你趴在棋盘上睡着了，呼噜声传出了养心殿。第二天全宫都知道了：新来的{位份}，在御前打呼噜。' },
  { death: '028' },
];
N.c2_sweep = [
  { s: 'n', t: '三局。三比零。你赢得干净利落。' },
  { s: 'me', f: 'star', t: '耶！五连！小区冠军名不虚传！', jump: true },
  { face: { emperor: 'angry' } },
  { s: 'emperor', f: 'angry', t: '…………' },
  { s: 'n', t: '皇上沉默地站起来，拂袖而去。' },
  { s: 'n', t: '从那天起，皇上再也没想起过你。冷宫的老鼠都比你先吃上饭。' },
  { death: '031' },
];
N.c2_choke = [
  { s: 'n', t: '皇上心情大好，拈起一块桂花糕——' },
  { face: { emperor: 'shock' } },
  { s: 'emperor', f: 'panic', t: '咳！咳咳……！！', shake: 0.6 },
  { s: 'os', f: 'shock', t: '噎住了！！皇上被桂花糕噎住了！！' },
  { c: [
    { t: '从背后抱住他——海姆立克急救法！', then: [
      { move: { me: 'R' } },
      { s: 'me', f: 'angry', t: '皇上别动！我来——', jump: true },
      { if: G => G.cnt('trust_lu') >= 40, then: [
        { s: 'luzheng', f: 'shock', t: '{位份}？！……（他认得我，没动手）' },
        { s: 'n', t: '你双手抱拳，在皇上腹部一顶——“噗”，桂花糕飞了出去。', sfx: 'pop' },
        { face: { emperor: 'shock' } },
        { s: 'emperor', f: 'normal', t: '……这是什么功夫？' },
        { s: 'me', f: 'smile', t: '回皇上，这叫……海、海氏救驾法。' },
        { s: 'emperor', f: 'smile', t: '救驾有功！赏！' },
        { fx: { 圣眷: 20, 名声: 10 } }, add('kill', 20), { set: { savedEmperor: true } }, add('silver', 50),
        { s: 'luzheng', f: 'smile', t: '（小声）……刚才那招，能教卑职吗？' },
      ], else: [
        { s: 'luzheng', f: 'angry', t: '大胆！竟敢从背后勒住皇上——有刺客！！', shake: 0.9 },
        { s: 'n', t: '陆峥一个箭步冲上来，把你结结实实按在了地上。' },
        { s: 'n', t: '皇上咳出了那块桂花糕，得救了。你没有。' },
        { s: 'me', f: 'cry', t: '我是在救人啊——！！' },
        { death: '029' },
      ] },
    ] },
    { t: '大喊：“快传太医！！”', then: [{ s: 'n', t: '太医还在路上，皇上自己把桂花糕咳出来了。' }, { s: 'emperor', f: 'normal', t: '……咳。没事。' }] },
    { t: '用力拍他的背', then: [{ s: 'n', t: '“啪啪啪！”桂花糕咳出来了。' }, { s: 'emperor', f: 'normal', t: '……手劲不小。' }, { fx: { 圣眷: 5 } }] },
  ] },
  { go: 'c2_d22' },
];

/* ---------------- 第 22 天 · 午睡 ---------------- */
N.c2_d22 = [
  { day: 22, time: '午', label: '第22天 · 午后', ch: 'ch2' },
  { bg: 'yonghe', music: 'day', cast: [['me', 'sleepy', 'C']] },
  { s: 'n', t: '午后。蝉鸣阵阵，热得人发困。' },
  { s: 'n', t: '窗台上，糯米蹲成一个橘色的面包，眼巴巴地盯着你手里的绿豆糕。' },
  { cat: { pos: 'R', from: 'RR', mood: 'happy' } },
  { c: [
    { t: '掰一半分给它', then: [add('cat', 30), { s: 'n', t: '糯米吃得呼噜呼噜响，尾巴翘成了问号。' }] },
    { t: '护住绿豆糕：“这是我的！”', then: [{ s: 'n', t: '糯米“哼”了一声，跳下窗台走了。' }] },
  ] },
  { cat: null },
  { s: 'os', f: 'sleepy', t: '睡个午觉……' },
  { c: [
    { t: '开着窗睡，凉快', go: 'c2_nap_open' },
    { t: '关好窗再睡', fx: { 健康: 10 }, then: [{ s: 'n', t: '你睡了一个香甜的午觉。窗外好像有猫爪挠了两下，又走了。' }], go: 'c2_d25' },
  ] },
];
N.c2_nap_open = [
  { s: 'n', t: '你睡着了。一阵凉风，一声“喵”。' },
  { cat: { pos: 'C', from: 'RR', mood: 'happy' } },
  { if: G => G.cnt('cat') > 50, then: [
    { s: 'n', t: '糯米从窗户跳了进来，看了看你，觉得你的脸是全宫最软的垫子。' },
    { s: 'n', t: '它趴了上去。呼噜噜……呼噜噜……' },
    { face: { me: 'panic' } },
    { s: 'me', f: 'panic', t: '唔唔唔——！！（被猫肚皮捂住）', shake: 0.5 },
    { s: 'n', t: '糯米爱你，所以在你脸上睡了一整个下午。' },
  ], death: '037' },
  { s: 'n', t: '糯米跳进来，嗅了嗅你，觉得你还不够熟，叼走了桌上的点心就跑了。' },
  { cat: null },
  { s: 'os', f: 'sweat', t: '……我的绿豆糕！' },
  { go: 'c2_d25' },
];

/* ---------------- 第 25 天 · 小桃的眼泪 ---------------- */
N.c2_d25 = [
  { day: 25, time: '晨', label: '第25天 · 小桃的眼泪', ch: 'ch2' },
  { bg: 'yonghe', music: 'night', cast: [['me', 'normal', 'L'], ['xiaotao', 'cry', 'R']] },
  { s: 'n', t: '这几天，小桃总是躲在角落里偷偷抹眼泪。' },
  { c: [
    { t: '“小桃，你怎么了？跟我说说。”', go: 'c2_tao_ask' },
    { t: '没空理她，忙着数银子', then: [add('trust_tao', -25), { s: 'n', t: '你数了三遍银子。小桃默默地退了出去。' }], go: 'c2_tao_check' },
  ] },
];
N.c2_tao_ask = [
  { if: G => G.cnt('trust_tao') < 20 && (G.died('033') || G.mem('M06')), then: [
    { s: 'os', f: 'cry', t: '🔮 上辈子，小桃哭着说“对不起”……是我先对不起她。' },
    { s: 'me', f: 'cry', t: '小桃，之前是我太凶了。对不起。……你有什么难处，告诉我好不好？' },
    { s: 'xiaotao', f: 'cry', t: '小、小主……呜哇——' }, add('trust_tao', 30),
  ] },
  { if: G => G.cnt('trust_tao') < 20, then: [{ s: 'xiaotao', f: 'cry', t: '……没、没什么，奴婢没事。' }, { s: 'os', f: 'think', t: '她不肯说。是我平时对她太凶了吗……' }], go: 'c2_tao_check' },
  { s: 'xiaotao', f: 'cry', t: '小主……长春宫的人抓了奴婢的弟弟，说要奴婢……要奴婢在您的饭菜里……' },
  { s: 'xiaotao', f: 'cry', t: '奴婢不敢！奴婢死也不会害小主！可是弟弟他……呜呜……' },
  { s: 'os', f: 'shock', t: '贵妃这是要从我身边下手！' },
  { c: [
    { need: G => G.flag('anNet'), t: '让小安子托御膳房的路子，把她弟弟救出来', then: [{ s: 'n', t: '小安子拍胸脯：“御膳房送菜的车，哪儿都去得！”当晚，小桃的弟弟就被偷偷送出了宫。' }, add('trust_tao', 30), add('kill', 10), { set: { taoSaved: true } }] },
    { need: G => G.cnt('silver') >= 100, t: '拿一百两银子，替她把弟弟赎出来', then: [G => { G.run.cnt.silver -= 100; }, { toast: '💰 银两 -100' }, add('trust_tao', 30), add('kill', 10), { set: { taoSaved: true } }, { s: 'xiaotao', f: 'cry', t: '小主……奴婢这条命，以后就是小主的！' }] },
    { t: '抱抱她：“别怕，我们一起想办法。”', then: [add('trust_tao', 15), { s: 'xiaotao', f: 'cry', t: '嗯……！' }] },
  ] },
  { go: 'c2_tao_check' },
];
N.c2_tao_check = [
  { if: G => G.cnt('trust_tao') >= 20, go: 'c2_d28' },
  { time: '夜' },
  { bg: 'yonghe_night', music: 'danger', cast: [['me', 'normal', 'L'], ['xiaotao', 'cry', 'R', { pose: 'hold', prop: 'soup' }]] },
  { s: 'xiaotao', f: 'cry', t: '小主……用晚膳了。' },
  { s: 'n', t: '小桃的手一直在抖。汤碗里的勺子，叮叮当当地响。' },
  { s: 'me', f: 'smile', t: '今天的汤好香！' },
  { s: 'n', t: '你喝完了汤。小桃“扑通”一声跪下了。' },
  { s: 'xiaotao', f: 'cry', t: '对不起……对不起小主……他们抓了奴婢的弟弟……' },
  { face: { me: 'sleepy' } },
  { s: 'me', f: 'cry', t: '……没关系……' },
  { s: 'n', t: '然后，就没有然后了。' },
  { death: '033' },
];

/* ---------------- 第 28 天 · 长春宫的台阶 ---------------- */
N.c2_d28 = [
  { day: 28, time: '晨', label: '第28天 · 长春宫的近路', ch: 'ch2' },
  { bg: 'yonghe_yard', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'R']] },
  { s: 'xiaotao', f: 'normal', t: '小主，皇后娘娘召您去坤宁宫商量赏花宴的事。走长春宫门口那条近路，能快一刻钟。' },
  { if: G => G.cnt('kill') >= 70, then: [{ s: 'xiaotao', f: 'sweat', t: '不过……长春宫那边最近看您的眼神，怪吓人的。' }] },
  { c: [
    { t: '走近路，快去快回', danger: G => G.cnt('kill') >= 100, go: 'c2_steps' },
    { t: '绕远路，走御花园', fx: { 健康: -2 }, then: [{ s: 'n', t: '多走了一刻钟。腿有点酸，命还在。' }], go: 'c2_d33' },
  ] },
];
N.c2_steps = [
  { bg: 'changchun', music: 'danger', cast: [['me', 'normal', 'C']] },
  { s: 'n', t: '长春宫门口。九级汉白玉台阶，在阳光下亮晶晶的。' },
  { if: G => G.cnt('kill') >= 100, then: [
    { if: G => G.mem('M09'), then: [
      { s: 'os', f: 'think', t: '🔮 亮晶晶的台阶……上辈子就是在这儿滚下去的！油是翠缕抹的！' },
      { c: [
        { t: '贴着边上的石栏杆，一级一级挪下去', then: [{ s: 'n', t: '你像一只壁虎，贴着栏杆挪完了九级台阶。' }, { s: 'n', t: '台阶底下，翠缕正拎着一只油壶往回走，撞见你，脸都白了。' }, { set: { sawCuilv: true } }, add('intel', 1)] },
      ] },
    ], else: [
      { s: 'n', t: '你迈下第一级台阶。脚底一滑——' },
      { sfx: 'slip' }, { face: { me: 'shock' } },
      { s: 'me', f: 'panic', t: '啊啊啊啊啊——', shake: 0.9 },
      { s: 'n', t: '你像一颗芝麻汤圆，咕噜咕噜滚完了九级台阶。' },
      { s: 'n', name: '长春宫里的笑声', t: '咯咯咯……' },
      { death: '038' },
    ] },
  ], else: [
    { s: 'n', t: '台阶下，一个宫女正蹲着擦什么东西。见你过来，她“嗖”地起身，低头跑了。' },
    { s: 'os', f: 'think', t: '那不是贵妃身边的翠缕吗？擦台阶……用的是油壶？' },
    { set: { sawCuilv: true } }, add('intel', 1),
  ] },
  { go: 'c2_d33' },
];

/* ---------------- 第 33 天 · 赏花宴前夕 ---------------- */
N.c2_d33 = [
  { day: 33, time: '夜', label: '第33天 · 赏花宴前夕', ch: 'ch2' },
  { bg: 'yonghe_night', music: 'night', cast: [['me', 'think', 'C']] },
  { s: 'n', t: '后天，皇后在御花园办赏花宴。各宫都要去。' },
  { s: 'os', f: 'think', t: '宫斗剧定律：宴会必出事。我得提前准备。' },
  { if: G => G.flag('anNet'), then: [
    { enter: 'xiaoan', face: 'normal', pos: 'R' },
    { s: 'xiaoan', f: 'think', t: '小主，奴才打听到一件怪事：贵妃身边的翠缕，前天在御膳房换了一大把碎银子——银锭底下，刻着永和宫的记号。' },
    { s: 'os', f: 'shock', t: '贵妃的宫女，拿着永和宫的钱？！' },
    { set: { anIntel: true } }, add('intel', 1), { exit: 'xiaoan' },
  ] },
  { if: G => G.cnt('trust_lu') >= 40, then: [
    { enter: 'luzheng', face: 'normal', pos: 'R' },
    { s: 'luzheng', f: 'normal', t: '{位份}。赏花宴卑职当值。……有事，喊一声。' },
    { set: { luWatch: true } }, { exit: 'luzheng' },
  ] },
  { if: G => G.cnt('trust_tao') >= 40, then: [{ enter: 'xiaotao', face: 'smile', pos: 'R' }, { s: 'xiaotao', f: 'smile', t: '小主，明儿赏花宴，奴婢寸步不离跟着您！' }, { exit: 'xiaotao' }] },
  { s: 'n', t: '💡 赏花宴是本章的大关。你现在的情报：{情报} 条。' },
  { go: 'c2_d35' },
];

/* ---------------- 第 35 天 · 赏花宴（Boss） ---------------- */
const PROOF = G => ['anIntel', 'intelGossip', 'sawCuilv'].filter(k => G.flag('used_' + k)).length;
const WIT = G => ['tao', 'lu'].filter(k => G.flag('used_' + k)).length;
N.c2_d35 = [
  { day: 35, time: '午', label: '第35天 · 赏花宴', ch: 'ch2' },
  { bg: 'banquet', music: 'day', cast: [['guifei', 'proud', 'LL', { pose: 'fan', prop: 'fanGold' }], ['huanghou', 'normal', 'CL'], ['ningpin', 'smile', 'CR'], ['me', 'normal', 'RR']] },
  { s: 'n', t: '御花园，赏花宴。牡丹开得正好，各宫娘娘的衣裳比牡丹还艳。' },
  { s: 'huanghou', f: 'smile', t: '今日只赏花，不论规矩，大家随意些。' },
  { enter: 'cuilv', face: 'normal', pos: 'R' },
  { s: 'n', t: '贵妃的宫女翠缕端着果盘经过，脚下一绊——“哎呀！”撞了你一下。', sfx: 'thud' },
  { s: 'cuilv', f: 'sweat', t: '奴婢该死！奴婢不是故意的！' },
  { exit: 'cuilv' },
  { if: G => G.stat('警觉') >= 60, then: [
    { s: 'os', f: 'think', t: '……袖子，好像忽然沉了一点？' },
    { c: [
      { t: '悄悄摸一摸袖子', go: 'c2_sleeve' },
      { t: '错觉吧，继续赏花', go: 'c2_accuse' },
    ] },
  ] },
  { go: 'c2_accuse' },
];
N.c2_sleeve = [
  { s: 'n', t: '你指尖碰到了一颗圆溜溜、凉丝丝的东西。一颗东珠。' },
  { s: 'os', f: 'shock', t: '栽赃！老套路了！' },
  { c: [
    { t: '趁人不注意，把东珠丢进贵妃座位旁的花盆里', then: [
      { s: 'n', t: '你“不经意”地经过贵妃身后，袖子一抖。东珠滚进了牡丹花盆。' },
      { s: 'guifei', f: 'angry', t: '本宫的东珠呢？！翠缕！刚才是不是有人——', shake: 0.5 },
      { s: 'n', t: '宫人们一阵翻找，最后在贵妃脚边的花盆里找到了东珠。' },
      { s: 'huanghou', f: 'smile', t: '原来是掉在花盆里了。妹妹也太紧张了。' },
      { s: 'guifei', f: 'sweat', t: '……哼。' },
      { s: 'os', f: 'smile', t: '兵不血刃。翠缕的脸都绿了。' },
      { set: { bossWin: 'quiet' } }, add('kill', -30),
    ], go: 'c2_win' },
  ] },
];
N.c2_accuse = [
  { s: 'guifei', f: 'angry', t: '本宫的东珠不见了！那是皇上亲赐的！', shake: 0.6, sfx: 'gong' },
  { music: 'danger' },
  { enter: 'cuilv', face: 'normal', pos: 'R' },
  { s: 'cuilv', f: 'normal', t: '娘娘！奴婢刚才看见{位份}鬼鬼祟祟的，在娘娘座位边上转悠！' },
  { s: 'guifei', f: 'smirk', t: '哦？搜。' },
  { s: 'n', t: '嬷嬷一抖你的袖子。一颗东珠滚了出来，在青石板上“嗒、嗒、嗒”蹦了三下。' },
  { face: { me: 'shock', ningpin: 'shock' } },
  { s: 'ningpin', f: 'shock', t: '妹妹，你怎么……唉，你若是缺什么，跟姐姐说就是了呀。' },
  { s: 'os', f: 'angry', t: '这一出“好姐姐痛心疾首”，演得真好。' },
  { s: 'huanghou', f: 'normal', t: '{位份}，你有什么要说的？' },
  { set: { used_anIntel: false, used_intelGossip: false, used_sawCuilv: false, used_tao: false, used_lu: false } },
  { go: 'c2_defend' },
];
N.c2_defend = [
  { q: '🔎 当众辩白（已出示：证据 {证据} 条 · 证人 {证人} 位）', c: [
    { need: G => G.flag('anIntel') && !G.flag('used_anIntel'), t: '【情报】小安子：翠缕前天换了一大把永和宫的碎银子', then: [{ set: { used_anIntel: true } }, { s: 'me', f: 'angry', t: '翠缕前天在御膳房换了一大把碎银子，银锭底下刻着永和宫的记号。一个宫女，哪来这么多钱？' }, { face: { cuilv: 'sweat', ningpin: 'normal' } }], go: 'c2_defend' },
    { need: G => G.flag('intelGossip') && !G.flag('used_intelGossip'), t: '【情报】假山八卦：翠缕最近总往永和宫跑', then: [{ set: { used_intelGossip: true } }, { s: 'me', f: 'think', t: '御花园的宫女都在传：贵妃娘娘的翠缕，最近老往永和宫跑。她去永和宫做什么？' }, { face: { guifei: 'think' } }], go: 'c2_defend' },
    { need: G => G.flag('sawCuilv') && !G.flag('used_sawCuilv'), t: '【情报】长春宫台阶上的油，是翠缕抹的', then: [{ set: { used_sawCuilv: true } }, { s: 'me', f: 'angry', t: '前几天长春宫台阶上抹了油，我亲眼看见翠缕拎着油壶。她袖口，现在还有桂花头油的味道！' }, { face: { cuilv: 'panic' } }], go: 'c2_defend' },
    { need: G => G.cnt('trust_tao') >= 40 && !G.flag('used_tao'), t: '【证人】请小桃作证', then: [{ set: { used_tao: true } }, { enter: 'xiaotao', face: 'angry', pos: 'CR' }, { s: 'xiaotao', f: 'angry', t: '奴婢亲眼看见！翠缕撞小主那一下，手往小主袖子里塞了东西！奴婢敢拿命担保！' }, { exit: 'xiaotao' }], go: 'c2_defend' },
    { need: G => G.flag('luWatch') && !G.flag('used_lu'), t: '【证人】请当值的陆峥作证', then: [{ set: { used_lu: true } }, { enter: 'luzheng', face: 'normal', pos: 'CR' }, { s: 'luzheng', f: 'normal', t: '卑职当值，看得清楚：翠缕撞上{位份}时，从自己袖中取出一物，塞进了{位份}的袖子。' }, { exit: 'luzheng' }], go: 'c2_defend' },
    { t: '“我说完了，请皇后娘娘明察。”', go: 'c2_judge' },
    { t: '“冤枉啊！不是我！我真的没拿！”（只能喊冤）', danger: 'E03', go: 'c2_e03' },
  ] },
];
N.c2_judge = [
  { if: G => PROOF(G) >= 2 && WIT(G) >= 1, go: 'c2_truth' },
  { s: 'huanghou', f: 'think', t: '……就这些？' },
  { if: G => PROOF(G) < 2, then: [{ s: 'guifei', f: 'smirk', t: '捕风捉影！一个宫女换几两银子，就能说明是她塞的？' }] },
  { if: G => PROOF(G) >= 2 && WIT(G) < 1, then: [{ s: 'guifei', f: 'smirk', t: '说得头头是道——可有谁亲眼看见了？' }] },
  { go: 'c2_e03' },
];
N.c2_e03 = [
  { s: 'guifei', f: 'angry', t: '人赃并获，还敢狡辩！皇后娘娘，这等手脚不干净的，留着也是祸害！' },
  { s: 'huanghou', f: 'normal', t: '……按宫规办吧。' },
  { s: 'n', t: '东珠在青石板上又蹦了一下，像在替你叹气。' },
  { face: { ningpin: 'smirk' } },
  { s: 'n', t: '被拖走前，你看见宁嫔用帕子掩着嘴——帕子下面，是一个笑。' },
  { death: 'E03' },
];
N.c2_truth = [
  { face: { cuilv: 'panic' } },
  { s: 'huanghou', f: 'angry', t: '翠缕！你还有什么话说？', shake: 0.5 },
  { s: 'cuilv', f: 'cry', t: '娘娘饶命！是、是奴婢一时贪心，想陷害{位份}……都是奴婢一个人的主意！' },
  { s: 'n', t: '翠缕说“一个人的主意”时，眼睛往宁嫔那边飘了一下。宁嫔低头喝茶，一口没喝出声。' },
  { s: 'guifei', f: 'sweat', t: '……没用的东西！' },
  { s: 'os', f: 'think', t: '贵妃也被蒙在鼓里？还是在演？……现在怎么收场？' },
  { c: [
    { t: '乘胜追击：“贵妃娘娘御下不严，是不是也该给个说法？”', then: [
      { s: 'guifei', f: 'angry', t: '你——！！', shake: 0.6 },
      { s: 'huanghou', f: 'smirk', t: '贵妃，罚俸三月，回去好好管管你的人。' },
      { s: 'os', f: 'sweat', t: '爽是爽了……贵妃的眼神，已经在给我挑棺材了。' },
      add('kill', 50), { set: { bossWin: 'hard', guifeiGrudge: true } }, { fx: { 名声: 10 } },
    ] },
    { t: '给贵妃台阶：“翠缕糊涂，娘娘想必也是被蒙在鼓里。”', then: [
      { s: 'guifei', f: 'think', t: '……' },
      { s: 'guifei', f: 'proud', t: '哼。算你会说话。翠缕，回去自己领罚。' },
      { s: 'huanghou', f: 'smile', t: '{位份}识大体。' },
      { s: 'os', f: 'smile', t: '给人留面子，就是给自己留后路。' },
      add('kill', -50), { set: { bossWin: 'soft', guifeiOwe: true } }, { fx: { 名声: 15, 规矩: 5 } },
    ] },
  ] },
  { go: 'c2_win' },
];
N.c2_win = [
  { music: 'happy' },
  { s: 'huanghou', f: 'smile', t: '{位份}{宫名}，临危不乱，进退有度。本宫做主——' },
  G => { const up = { 答应: '常在', 常在: '贵人', 贵人: '嫔' }; const r = G.run.flags.rank || '答应'; G.run.flags.rank = up[r] || r; G.run.flags.rankName = '晋封' + G.run.flags.rank; },
  { s: 'huanghou', t: '晋为{位份}！', sfx: 'fanfare' },
  { confetti: true },
  { s: 'me', f: 'star', t: '谢皇后娘娘！', jump: true },
  { s: 'os', f: 'star', t: '活过了第三十五天！还升职了！宫斗剧打工人，KPI 达成！' },
  { go: 'c2_end' },
];
N.c2_end = [
  { bg: 'yonghe_night', music: 'mystery', cast: [['ningpin', 'normal', 'C']] },
  { s: 'n', t: '当晚，永和宫正殿。' },
  { s: 'ningpin', f: 'smile', t: '妹妹今天，真是让姐姐刮目相看呢。' },
  { face: { ningpin: 'normal' } },
  { s: 'n', t: '烛火跳了一下。宁嫔脸上的笑，像退潮一样，一点一点退干净了。' },
  { s: 'ningpin', f: 'angry', t: '……比赵如意那个蠢货，难对付多了。' },
  { s: 'ningpin', f: 'smirk', t: '不急。太后的寿宴，就快到了。' },
  { bg: 'cining', music: 'mystery', cast: [['taihou', 'normal', 'C', { pose: 'beads', prop: 'beads' }]], cat: { pos: 'R', mood: 'happy' } },
  { s: 'taihou', f: 'smile', t: '东珠的事，哀家听说了。那孩子……不错。' },
  { if: G => G.flag('pouchOk'), then: [{ s: 'taihou', f: 'smile', t: '荷包上那对胖鸳鸯，哀家很喜欢。' }] },
  { s: 'taihou', f: 'think', t: '寿宴上，让她来给哀家献个舞吧。哀家……想看看她会不会跳“那个”。' },
  { s: 'n', t: '太后哼起了一段奇怪的调子。♪ 天青色……等烟雨…… ♪' },
  { chapterEnd: 'ch2', next: 'ch3', title: '第二章 · 立足 · 通关！', rankText: '{宫名}，你在永和宫站稳了脚跟！',
    tease: '第三章《寿宴 · 慈宁宫》敬请期待——<br>太后想看你跳舞。宁嫔已经在给你准备“惊喜”了。', teaseNext: '第三章《寿宴 · 慈宁宫》已开放！<br>太后想看你跳舞。宁嫔已经在给你准备“惊喜”了。' },
];

P.registerChapter({
  id: 'ch2', title: '第二章 · 立足', start: 'c2_start', nodes: N, startBg: 'yonghe_yard',
  blurb: '永和宫偏殿 · 第 11–35 天。温柔的宁嫔、红衣的贵妃、会下五子棋的皇上。',
  defaultRun(run) { run.stats = { 圣眷: 20, 名声: 45, 健康: 80, 警觉: 20, 疑心: 0, 规矩: 50 }; run.flags = { rank: '答应', rankName: '封答应', taoTrust: true }; },
  deathMems: { '024': 'M03', '025': 'M05', '033': 'M06', '035': 'M08', '038': 'M09' },
});
})(window.PALACE = window.PALACE || {});
