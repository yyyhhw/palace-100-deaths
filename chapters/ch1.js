/* 第一章：入宫（储秀宫 · 第 1–10 天） */
(function (P) {
'use strict';
const N = {};
const ROOF = [
  { bg: 'roof', music: 'night', cast: [['me', 'star', 'C']] },
  { s: 'me', f: 'star', t: '月亮好圆！只要翻过这道墙，我就自由了——', jump: true },
  { s: 'n', t: '月亮很圆。瓦片很滑。' },
  { sfx: 'slip' }, { face: { me: 'shock' } },
  { s: 'me', f: 'shock', t: '诶诶诶诶诶——', shake: 0.8 },
  { sfx: 'thud' },
  { s: 'n', t: '第二天，巡夜的侍卫在墙根下发现了一只“大型挂件”。' },
];
const NIGHT_INCENSE = [
  { s: 'n', t: '香烟袅袅。你睡得特别香。' },
  { face: { me: 'sleepy' } },
  { s: 'n', t: '香到……再也没醒。' },
  { s: 'zhao', name: '？？？（门外）', t: '……回禀宁嫔娘娘，事成了。' },
];
const KNEEL = 'c1_kneel';
const err3 = G => G.cnt('err') >= 3;

/* ---------------- 第 1 天 ---------------- */
N.c1_start = [
  G => { G.run.ch = 'ch1'; }, { hud: true },
  { day: 1, time: '晨', label: '第1天 · 宫门验名牌', ch: 'ch1' },
  { bg: 'gate', music: 'day', cast: [['xiaotao', 'normal', 'L'], ['me', 'normal', 'C'], ['taijian', 'normal', 'R', { pose: 'scroll', prop: 'scroll' }]] },
  { s: 'taijian', t: '下一位！名牌拿来——' },
  { s: 'taijian', f: 'think', t: '秀女……' },
  { if: G => G.hasLatin(G.palaceName()), go: 'c1_latin' },
  { if: G => G.hasTaboo(G.palaceName()), go: 'c1_taboo' },
  { s: 'taijian', f: 'normal', t: '秀女{宫名}，验讫——进！' },
  { s: 'xiaotao', f: 'smile', t: '小主，奴婢陪您进去！' },
  { go: 'c1_xiuxiu' },
];
N.c1_latin = [
  { s: 'taijian', f: 'shock', t: '这、这名牌上画的是何方符咒？' },
  { s: 'taijian', f: 'panic', t: '“{姓}”……“{名}”……这字……它会扭……咱家眼睛疼……', emote: '💫' },
  { s: 'n', t: '小太监对着名牌念了三遍，舌头打了个蝴蝶结，两眼一翻，晕了过去。', sfx: 'thud' },
  { cast: [['xiaotao', 'shock', 'L'], ['me', 'panic', 'C'], ['guard', 'angry', 'R', { pose: 'spear', prop: 'spear' }]] },
  { s: 'guard', t: '名牌写蛮夷文字，还把公公念晕了——番邦细作！拿下！', shake: 0.6 },
  { s: 'me', f: 'cry', t: '冤枉啊！这是我的英文名——' },
  { s: 'guard', t: '“英文”？果然是番邦的！' },
  { death: 'E01' },
];
N.c1_taboo = [
  { s: 'taijian', f: 'normal', t: '秀女{宫名}——' },
  { s: 'taijian', f: 'shock', t: '……！！', shake: 0.8, sfx: 'gong' },
  { s: 'n', t: '话音刚落，宫门口所有人“扑通”一声，全跪下了。' },
  { s: 'xiaotao', f: 'cry', t: '小、小姐！您名字里有皇上的名讳啊！' },
  { s: 'taijian', f: 'panic', t: '咱、咱家什么都没念！是她自己写的！' },
  { s: 'n', t: '犯了国讳，大不敬。你成了大晟开国以来，第一个没进宫门就被拖走的秀女。' },
  { death: '098' },
];
N.c1_xiuxiu = [
  { bg: 'courtyard', cast: [['zhao', 'smile', 'L'], ['guimama', 'normal', 'C', { pose: 'ruler', prop: 'ruler' }], ['me', 'normal', 'R']] },
  { s: 'n', t: '储秀宫。二十几个秀女站成一排，叽叽喳喳。' },
  { s: 'guimama', f: 'angry', t: '肃静！我是你们的教引嬷嬷，姓桂。这十天，你们的规矩，归我管。', sfx: 'thud' },
  { s: 'guimama', f: 'normal', t: '十天后太和殿选秀。规矩不好的、名声不好的——撂牌子，回家。' },
  { s: 'os', f: 'sweat', t: '回家……原主家背着冤案，回去估计也是死路一条。' },
  { s: 'guimama', t: '一个个来，自报家门。' },
  { s: 'zhao', f: 'smile', t: '嬷嬷安好~臣女赵如意，家父是礼部的小官。往后还请姐妹们多多照顾呀~' },
  { s: 'os', f: 'think', t: '这位姐姐笑得好甜……甜得有点齁。' },
  { s: 'guimama', t: '下一个。你。' },
  { c: [
    { t: '大家好，我是打工人！打工魂，打工都是人上人！', then: [
      { s: 'me', f: 'star', t: '大家好，我是打工人！打工魂，打工都是人上人！耶！', jump: true },
      { face: { zhao: 'shock', guimama: 'shock' } },
      { s: 'n', t: '空气安静了三秒。秀女们整齐地后退了三步。' },
      { s: 'guimama', f: 'angry', t: '“打……工……人”？此女言语怪异——怕不是中了邪！来人！', shake: 0.5 },
    ], death: '002' },
    { t: '民女{宫名}，见过嬷嬷，见过各位姐姐。', fx: { 规矩: 5, 名声: 5 }, go: 'c1_intro_ok' },
    { t: '我叫{名}，爱好是吃饭、睡觉、看戏！', fx: { 名声: -5 }, go: 'c1_intro_silly' },
    { t: '“这位是桂嬷嬷，那边是李嬷嬷、张嬷嬷、王嬷嬷……”（前世记忆）', know: 'mamaNames', then: [
      { s: 'me', f: 'star', t: '这位是桂嬷嬷，那边是李嬷嬷、张嬷嬷、王嬷嬷，后院还有钱嬷嬷——钱嬷嬷今天腰不好吧？' },
      { fx: { 疑心: 100 } },
      { s: 'guimama', f: 'shock', t: '……你怎么知道？钱嬷嬷今早才闪的腰！' },
      { s: 'n', t: '👁️ 疑心值，瞬间拉满。' },
      { s: 'guimama', f: 'angry', t: '第一天进宫，就把宫里摸得一清二楚——此女是细作！', shake: 0.6 },
    ], death: '015' },
  ] },
];
N.c1_intro_silly = [
  { s: 'n', t: '秀女们捂嘴偷笑。桂嬷嬷的眉毛跳了一下。' },
  { s: 'guimama', f: 'angry', t: '没规矩。' },
  { go: 'c1_intro_after' },
];
N.c1_intro_ok = [{ s: 'guimama', f: 'normal', t: '嗯，还算懂事。' }, { go: 'c1_intro_after' }];
N.c1_intro_after = [
  { s: 'guimama', f: 'normal', t: '都记住了：我身边这几位，是李嬷嬷、张嬷嬷、王嬷嬷，后院还有个钱嬷嬷。见了都要行礼。' },
  { learn: 'mamaNames' },
  { s: 'os', f: 'think', t: '李、张、王、钱……记住了。（说不定以后用得上？）' },
  { time: '夜' },
  { bg: 'room_night', music: 'night', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'C'], ['zhao', 'smile', 'R']] },
  { s: 'zhao', t: '{名}妹妹，咱们住一屋呢~往后有什么事，尽管找姐姐。' },
  { s: 'me', f: 'smile', t: '谢谢赵姐姐！' },
  { exit: 'zhao' },
  { s: 'xiaotao', t: '小主，夜深了。您……打算做点什么？' },
  { c: [
    { t: '早点睡，明天还有规矩课', fx: { 健康: 5 }, go: 'c1_d2' },
    { t: '和小桃聊聊……家里的事', fx: { 警觉: 5 }, go: 'c1_n1_talk' },
    { t: '爬上屋顶，想办法逃出去！', then: ROOF, death: '013' },
  ] },
];
N.c1_n1_talk = [
  { s: 'xiaotao', f: 'cry', t: '小主……老爷是被冤枉的。三年前那桩“巫蛊案”，说老爷扎小人咒皇上……老爷连针都不会拿！' },
  { s: 'xiaotao', f: 'normal', t: '夫人走之前，给了小姐半面铜镜，说是“能照见前世”。小姐一直藏在枕头底下。' },
  { s: 'os', f: 'think', t: '半面铜镜……孟婆手里那块碎片？' },
  { s: 'xiaotao', f: 'smile', t: '小主放心，奴婢会一直陪着您的。' },
  { set: { taoTrust: true } },
  { go: 'c1_d2' },
];

/* ---------------- 第 2 天 ---------------- */
N.c1_d2 = [
  { day: 2, time: '晨', label: '第2天 · 清晨' },
  { bg: 'room_day', music: 'day', cast: [['me', 'sleepy', 'C'], ['xiaotao', 'normal', 'R']] },
  { s: 'n', t: '天刚蒙蒙亮。窗外的麻雀叽叽喳喳。' },
  { s: 'me', f: 'sleepy', t: '（伸懒腰）嗯——这木板床，睡得腰酸背痛……' },
  { c: [
    { t: '做一套瑜伽舒展一下！', then: [
      { s: 'me', f: 'smile', t: '来，下犬式——吸气——呼气——' },
      { enter: 'guimama', face: 'shock', pos: 'L' },
      { s: 'guimama', f: 'shock', t: '这、这是什么邪门姿势？！四脚着地、屁股朝天……中邪了！', shake: 0.5 },
      { s: 'guimama', f: 'angry', t: '快！快去请跳大神的！' },
      { s: 'n', t: '半个时辰后，一位大神绕着你跳了三圈，往你脸上喷了一大口符水。' },
    ], death: '016' },
    { t: '先洗漱，梳个好看的头', fx: { 名声: 3 }, go: 'c1_shoe' },
  ] },
];
N.c1_shoe = [
  { s: 'xiaotao', t: '小主，该穿鞋了，规矩课要迟到啦！' },
  { s: 'os', f: 'think', t: '鞋就在床边。昨晚……赵如意好像在这附近转悠过？' },
  { c: [
    { t: '直接穿上，冲！', then: [
      { s: 'n', t: '脚趾碰到了一团软软的、毛茸茸的、还会动的东西。' },
      { s: 'me', f: 'shock', t: '啊啊啊啊啊啊啊——！！！', sfx: 'scream', shake: 1 },
      { s: 'n', t: '一声尖叫响彻储秀宫。窗外的麻雀全飞了，屋檐上的瓦掉了三片。' },
      { s: 'zhao', name: '某位姐姐（窗外）', t: '哟，尖叫鸡醒啦~' },
    ], death: '003' },
    { t: '先把鞋倒过来抖一抖', go: 'c1_shoe_ok' },
  ] },
];
N.c1_shoe_ok = [
  { s: 'n', t: '一只胖乎乎的毛毛虫掉了出来，在地上扭了扭，像在跳广场舞。' },
  { s: 'me', f: 'shock', t: '……谁放的？！' },
  { fx: { 警觉: 10 } },
  { s: 'xiaotao', f: 'angry', t: '小主，昨晚赵小主在您床边站了好一会儿！' },
  { s: 'os', f: 'angry', t: '赵如意……我记住你了。' },
  { set: { suspectZhao: true } },
  { go: 'c1_lesson' },
];
N.c1_lesson = [
  { time: '午' },
  G => { G.run.cnt.err = 0; },
  { bg: 'courtyard', music: 'day', cast: [['guimama', 'normal', 'L', { pose: 'ruler', prop: 'ruler' }], ['me', 'normal', 'R']] },
  { s: 'guimama', t: '今日学行礼、站姿、奉茶。错三次的——去雨里跪着。' },
  { s: 'os', f: 'sweat', t: '错三次就罚跪……稳住，问题不大。' },
  { s: 'guimama', t: '第一问：见了主子娘娘，如何行礼？' },
  { c: [
    { t: '双手交叠放在腰侧，屈膝，低头', fx: { 规矩: 3 }, then: [{ s: 'guimama', t: '嗯。' }] },
    { t: '双手比个“耶”，露出八颗牙微笑', inc: 'err', danger: '012', then: [{ s: 'guimama', f: 'angry', t: '这是什么妖法手势！错一次！', sfx: 'buzz' }] },
    { t: '抱拳：“承让承让！”', inc: 'err', danger: '012', then: [{ s: 'guimama', f: 'angry', t: '你当这是武林大会？！错一次！', sfx: 'buzz' }] },
  ], q: '📏 规矩课 · 行礼（错 3 次罚跪）' },
  { s: 'guimama', t: '第二问：站着等主子传话，该怎么站？' },
  { c: [
    { t: '单脚站立，抖腿，显得精神', inc: 'err', danger: '012', then: [{ s: 'guimama', f: 'angry', t: '你是金鸡独立的鸡吗？错一次！', sfx: 'buzz' }] },
    { t: '肩平背直，目视脚尖前三尺', fx: { 规矩: 3 }, then: [{ s: 'guimama', t: '嗯。' }] },
    { t: '靠着柱子，玩手指', inc: 'err', danger: '012', then: [{ s: 'guimama', f: 'angry', t: '柱子是给你靠的吗？错一次！', sfx: 'buzz' }] },
  ], q: '📏 规矩课 · 站姿' },
  { if: err3, go: KNEEL },
  { s: 'guimama', t: '第三问：在宫道上走路，该怎么走？' },
  { c: [
    { t: '跑着去，效率第一！', inc: 'err', danger: '012', then: [{ s: 'guimama', f: 'angry', t: '宫道不是跑马场！错一次！', sfx: 'buzz' }] },
    { t: '一蹦一跳，显得活泼可爱', inc: 'err', danger: '012', then: [{ s: 'guimama', f: 'angry', t: '你是兔子成精吗？错一次！', sfx: 'buzz' }] },
    { t: '步子小，裙摆不乱晃', fx: { 规矩: 3 }, then: [{ s: 'guimama', t: '嗯。' }] },
  ], q: '📏 规矩课 · 走路' },
  { if: err3, go: KNEEL },
  { s: 'guimama', t: '最后，奉茶。端着茶走过长廊，到我跟前。洒一次，算错一次。' },
  { game: 'tea' },
  { if: err3, go: KNEEL },
  { s: 'guimama', f: 'smile', t: '……还行。今天没给我丢人。' },
  { fx: { 规矩: 10 } },
  { go: 'c1_n2' },
];
N.c1_kneel = [
  { s: 'guimama', f: 'angry', t: '错了三次！去院子里跪着，跪到想明白为止！', shake: 0.4 },
  { bg: 'rain', music: 'danger', cast: [['me', 'cry', 'C', { pose: 'fold' }]] },
  { s: 'n', t: '天公不作美，下起了大雨。' },
  { s: 'me', f: 'cry', t: '我想明白了……我真的想明白了……能不能先让我起来……' },
  { s: 'n', t: '第二天一早，扫地的小太监绕着你转了三圈：“咦，储秀宫什么时候多了一尊石像？还挺好看。”' },
  { death: '012' },
];
N.c1_n2 = [
  { time: '夜' },
  { bg: 'room_night', music: 'night', cast: [['me', 'sleepy', 'L'], ['xiaotao', 'normal', 'R']] },
  { s: 'me', f: 'sleepy', t: '累死了……明天还有宫规考试。' },
  { s: 'xiaotao', t: '小主，奴婢给您讲讲宫规？明天桂嬷嬷要考的。' },
  { c: [
    { t: '好，临时抱佛脚！', fx: { 规矩: 5 }, then: [
      { s: 'xiaotao', f: 'think', t: '贵妃仪仗要靠边跪下；别人送的东西要先报备；皇上的名讳要避开；夜里宫门落锁不能乱走；还有……别追御猫！' },
      { s: 'os', f: 'smile', t: '（小桃真是宝藏丫头。）' },
    ], go: 'c1_d3' },
    { t: '不听不听，睡觉！', fx: { 健康: 5 }, go: 'c1_d3' },
    { t: '爬上屋顶，看看能不能逃出去', then: ROOF, death: '013' },
  ] },
];

/* ---------------- 第 3 天 ---------------- */
N.c1_d3 = [
  { day: 3, time: '晨', label: '第3天 · 宫规考试' },
  { bg: 'courtyard', music: 'quiz', cast: [['guimama', 'normal', 'C', { pose: 'ruler', prop: 'ruler' }]] },
  { s: 'guimama', t: '今日小考。五道题，答对三道算过。答不过的——退回原籍。' },
  { game: 'quiz' },
  { if: G => !(G.flag('game_quiz') && G.flag('game_quiz').score >= 60), go: 'c1_quizfail' },
  { fx: { 规矩: 10, 名声: 5 } },
  { if: G => G.flag('game_quiz').score === 100, then: [{ fx: { 名声: 5 } }, { s: 'guimama', f: 'smile', t: '满分？……哼，算你用功。' }] },
  { time: '夜' },
  { bg: 'room_night', music: 'night', cast: [['me', 'panic', 'L'], ['xiaotao', 'sleepy', 'R']] },
  { s: 'n', t: '储秀宫的晚饭：一碗清粥，两根咸菜。' },
  { s: 'me', f: 'cry', t: '饿……好饿……我想要奶茶、炸鸡、小龙虾……', emote: '💦' },
  { c: [
    { t: '一个人偷偷去御膳房找吃的', then: [
      { bg: 'kitchen', music: 'danger', cast: [['me', 'star', 'C', { prop: 'cake' }]] },
      { s: 'me', f: 'star', t: '桂花糕！还热乎的！我就吃一块……就一块……' },
      { s: 'n', t: '你刚咬下一口，身后亮起了一排灯笼。' },
      { cast: [['me', 'shock', 'L', { prop: 'cake' }], ['guard', 'angry', 'R', { pose: 'spear', prop: 'spear' }]] },
      { s: 'guard', t: '大胆！竟敢偷吃明日祭祖的贡品！', shake: 0.6 },
      { s: 'me', f: 'cry', t: '我只是饿了……这是桂花糕，又不是金元宝！' },
      { s: 'guard', t: '在祖宗眼里，它比金元宝还金贵！' },
    ], death: '010' },
    { t: '叫上小桃，让她在门口望风', go: 'c1_kitchen' },
    { t: '忍着，睡觉', fx: { 健康: -5 }, go: 'c1_d4' },
    { t: '爬上屋顶，饿死不如逃跑！', then: ROOF, death: '013' },
  ] },
];
N.c1_quizfail = [
  { s: 'guimama', f: 'angry', t: '五道题，错了一大半。来人，退回原籍。' },
  { s: 'os', f: 'panic', t: '退回原籍＝回家＝回到那个背着冤案、随时会被抄的家……' },
  { s: 'n', t: '三天后，{姓}家旧宅门口，抄家的官兵和你同时到达。场面一度十分尴尬。' },
  { death: '004' },
];
N.c1_kitchen = [
  { bg: 'kitchen', music: 'night', cast: [['xiaotao', 'normal', 'L'], ['me', 'normal', 'C'], ['xiaoan', 'shock', 'R']] },
  { s: 'xiaoan', f: 'shock', t: '哎哟！谁？！——吓死咱家了，原来是位小主。' },
  { s: 'xiaoan', f: 'smile', t: '小的小安子，御膳房打杂的。小主是饿了吧？储秀宫那点粥，喂鸟都不够！' },
  { s: 'xiaotao', f: 'think', t: '（小声）小主放心，奴婢在门口盯着，有人来就学猫叫。' },
  { s: 'xiaoan', t: '喏，剩下的桂花糕。还有这个小鱼干，本来是给御猫糯米留的——它挑嘴，只吃这个。' },
  { item: '桂花糕' }, { item: '小鱼干' }, { mem: 'M07' },
  { s: 'xiaoan', f: 'smirk', t: '嘘——小的再告诉小主一个秘密：皇上表面冷冰冰的，其实最爱吃甜的！尤其是桂花糕！' },
  { mem: 'M01' },
  { s: 'os', f: 'star', t: '皇上嗜甜！独家情报，get！' },
  { s: 'xiaoan', f: 'smile', t: '小主以后有空常来。小安子这儿，消息比点心还多！' },
  { set: { metAn: true } },
  { go: 'c1_d4' },
];

/* ---------------- 第 4 天 ---------------- */
N.c1_d4 = [
  { day: 4, time: '午', label: '第4天 · 御花园' },
  { bg: 'garden', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'C']] },
  { s: 'n', t: '规矩课后有一炷香的空闲。你和小桃溜到了御花园一角。' },
  { s: 'me', f: 'star', t: '哇，荷花池！好美！', jump: true },
  { s: 'n', t: '一阵风吹来——你的手帕飞了出去，落在了池中央的荷叶上。', sfx: 'whoosh' },
  { c: [
    { t: '去捞！那可是原主娘亲绣的！', then: [
      { s: 'me', f: 'normal', t: '够得着，够得着……再往前一点点……' },
      { sfx: 'splash' }, { shake: 0.8 },
      { s: 'n', t: '帕子捞到了。你没上来。' },
      { s: 'xiaotao', f: 'cry', t: '小主——！您不会游泳啊——！' },
    ], death: '018' },
    { t: '找根树枝，慢慢勾回来', fx: { 警觉: 5 }, then: [{ s: 'n', t: '你趴在岸边，用树枝一点一点把帕子勾了回来。完美。' }] },
    { t: '算了，一条帕子而已', then: [{ s: 'xiaotao', f: 'smile', t: '小主说得对，帕子没了，奴婢再给您绣一条！' }] },
  ] },
  { cat: { pos: 'R', from: 'RR', mood: 'normal' } },
  { s: 'n', t: '假山后面，滚出来一团橘色的毛球。', sfx: 'meow' },
  { s: 'xiaotao', f: 'shock', t: '是御猫糯米！听说是太后娘娘的心头肉！' },
  { s: 'me', f: 'star', t: '好圆！好胖！好想摸！' },
  { go: 'c1_cat' },
];
N.c1_cat = [
  { c: [
    { t: '追上去摸摸！', need: G => G.cnt('cat') < 2, inc: 'cat', go: 'c1_cat_chase' },
    { t: '继续追！就差一点点了！', need: G => G.cnt('cat') >= 2, inc: 'cat', danger: '009', go: 'c1_cat_chase' },
    { t: '掏出小鱼干，蹲下来轻声唤它', mem: 'M07', need: G => G.item('小鱼干') > 0, go: 'c1_cat_fish' },
    { t: '不追了，太后的猫惹不起', go: 'c1_garden_end' },
  ], q: '糯米歪着头看你……' },
];
N.c1_cat_chase = [
  { if: G => G.cnt('cat') >= 3, go: 'c1_cat_death' },
  { if: G => G.cnt('cat') === 1, then: [{ cat: { pos: 'CR', mood: 'annoyed' } }, { s: 'n', t: '糯米瞥了你一眼，慢悠悠地挪到了假山另一边。' }] },
  { if: G => G.cnt('cat') === 2, then: [{ cat: { pos: 'RR', mood: 'happy', run: true } }, { s: 'n', t: '糯米加速了！它钻过花丛，回头冲你“喵”了一声——像是在说：来呀~', sfx: 'meow' }] },
  { go: 'c1_cat' },
];
N.c1_cat_death = [
  { cat: { pos: 1.4, run: true } },
  { s: 'n', t: '你跟着胖橘一路狂奔，穿过花丛，绕过假山，然后——' },
  { sfx: 'thud' }, { shake: 1 },
  { s: 'n', t: '一头栽进了一口枯井。两条小短腿在井口乱蹬。' },
  { s: 'xiaotao', f: 'cry', t: '小主——！！' },
  { s: 'n', t: '井口，糯米探出圆脑袋，舔了舔爪子：“喵。”（翻译：菜。）' },
  { death: '009' },
];
N.c1_cat_fish = [
  { cat: { pos: 'CL', mood: 'happy', run: false } },
  { s: 'n', t: '糯米的耳朵“唰”地竖了起来。它小跑过来，叼走小鱼干，还用大脑袋蹭了蹭你的手。', sfx: 'meow' },
  { item: '小鱼干', n: -1 }, { fx: { 名声: 10 } },
  { s: 'n', t: '不远处，一位慈宁宫的嬷嬷看见了，笑着点点头：“糯米从不让生人碰，这位小主有福气。”' },
  { s: 'xiaotao', f: 'star', t: '小主！这下太后宫里的人都知道您了！' },
  { set: { catFriend: true } },
  { go: 'c1_garden_end' },
];
N.c1_garden_end = [
  { time: '夜' },
  { bg: 'room_night', music: 'night', cast: [['me', 'normal', 'L'], ['zhao', 'smile', 'R', { prop: 'incense' }]] },
  { s: 'zhao', t: '{名}妹妹~姐姐看你这两天睡不好，特意给你带了安神香。宫外买的，可金贵了。' },
  { s: 'n', t: '一只小巧的香炉，香气甜得发腻。' },
  { c: [
    { t: '谢谢姐姐！今晚就点上', then: [{ s: 'me', f: 'smile', t: '好香呀，谢谢赵姐姐！' }, { s: 'zhao', f: 'smirk', t: '妹妹睡个好觉~' }, { exit: 'zhao' }, ...NIGHT_INCENSE], death: '011' },
    { t: '收下，先凑近闻一闻', go: 'c1_incense_sniff' },
    { t: '婉拒：“我对香料过敏。”', fx: { 名声: -2 }, go: 'c1_incense_refuse' },
    { t: '这香有问题——默默收起来当证据', mem: 'M02', go: 'c1_incense_keep' },
    { t: '当众揭穿：“这香有毒！”', mem: 'M02', go: 'c1_incense_reveal' },
  ] },
];
N.c1_incense_sniff = [
  { if: G => G.stat('警觉') >= 30 || G.mem('M02'), go: 'c1_incense_detect' },
  { s: 'me', f: 'normal', t: '嗯……甜甜的，挺好闻的。' },
  { s: 'zhao', f: 'smirk', t: '对吧~妹妹今晚记得点上哦。' },
  { exit: 'zhao' },
  { s: 'os', f: 'think', t: '（🔍 警觉不够，闻不出什么名堂……）' },
  { c: [
    { t: '点上试试', then: NIGHT_INCENSE, death: '011' },
    { t: '算了，还是收起来吧', then: [{ s: 'os', t: '总觉得哪里怪怪的，先收起来。' }], go: 'c1_d5' },
  ] },
];
N.c1_incense_detect = [
  { s: 'me', f: 'think', t: '等等……甜香底下，有一股淡淡的、发苦的怪味。' },
  { s: 'os', f: 'shock', t: '宫斗剧第 38 集！迷香！这香有问题！' },
  { fx: { 警觉: 5 } },
  { s: 'me', f: 'smile', t: '谢谢姐姐，我留着慢慢用~' },
  { set: { incenseEvidence: true } }, { item: '可疑的安神香' },
  { go: 'c1_d5' },
];
N.c1_incense_keep = [
  { s: 'os', f: 'smirk', t: '（上辈子就是这香送走我的。这辈子——留着当证据。）' },
  { s: 'me', f: 'smile', t: '谢谢姐姐，我留着慢慢用~' },
  { s: 'zhao', f: 'smirk', t: '……' },
  { set: { incenseEvidence: true } }, { item: '可疑的安神香' },
  { go: 'c1_d5' },
];
N.c1_incense_refuse = [
  { s: 'zhao', f: 'angry', t: '……哼，好心当成驴肝肺。' },
  { set: { zhaoAngry: true } },
  { go: 'c1_d5' },
];
N.c1_incense_reveal = [
  { s: 'me', f: 'angry', t: '这香有毒！', shake: 0.3 },
  { s: 'zhao', f: 'shock', t: '妹妹……怎么知道的？' },
  { c: [
    { t: '“我上辈子就是被它毒死的！”', fx: { 疑心: 40 }, then: [{ s: 'zhao', f: 'smirk', t: '上辈子？妹妹莫不是读书读傻了~' }, { s: 'n', t: '屋里的秀女们看你的眼神，像在看一个疯子。（👁️ 别太像先知！）' }] },
    { t: '“我……做了个梦，梦见这香会害人。”', fx: { 疑心: 15 }, then: [{ s: 'zhao', f: 'angry', t: '做梦也能当真？哼。' }] },
    { t: '“我闻出来的——这甜味底下发苦。”', need: G => G.stat('警觉') >= 30, fx: { 名声: 5 }, then: [{ s: 'zhao', f: 'panic', t: '你、你胡说！我、我也是被商人骗了！' }] },
  ], q: '怎么解释你“知道”？' },
  { set: { incenseEvidence: true } }, { item: '可疑的安神香' },
  { go: 'c1_d5' },
];

/* ---------------- 第 5 天 ---------------- */
N.c1_d5 = [
  { day: 5, time: '晨', label: '第5天 · 贵妃仪仗' },
  { bg: 'courtyard', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'C']] },
  { s: 'n', t: '你和小桃刚出储秀宫门，远处传来一声尖细的吆喝——' },
  { s: 'n', name: '太监', t: '华贵妃娘娘驾到——闲人回避——！', sfx: 'gong' },
  { music: 'danger' },
  { cast: [['me', 'shock', 'L'], ['xiaotao', 'panic', 'C'], ['guifei', 'normal', 'R', { pose: 'fan', prop: 'fanGold' }]] },
  { s: 'n', t: '金光闪闪的仪仗缓缓而来。正中间的贵妃，头上一朵牡丹，比脸还大。' },
  { s: 'os', f: 'star', t: '哇……这头饰得有十斤吧？' },
  { c: [
    { t: '我先走！快步从仪仗前面穿过去', then: [
      { s: 'me', f: 'sweat', t: '借过借过，我赶时间——' },
      { s: 'guifei', f: 'angry', t: '站住。哪里来的小丫头？', shake: 0.5 },
      { s: 'guifei', f: 'smirk', t: '敢抢本宫的道……来人，让她以后只能在画像里赶路。' },
    ], death: '008' },
    { t: '赶紧退到路边，跪下，低头', fx: { 规矩: 5 }, go: 'c1_proc_ok' },
    { t: '跪下，但偷偷抬头看贵妃的牡丹', fx: { 名声: -3 }, go: 'c1_proc_peek' },
  ] },
];
N.c1_proc_peek = [
  { s: 'guifei', f: 'angry', t: '看什么看？本宫的牡丹，是你能看的？' },
  { s: 'me', f: 'panic', t: '娘、娘娘的牡丹……好、好看！' },
  { s: 'guifei', f: 'smirk', t: '……哼，算你有眼光。' },
  { set: { guifeiNoticed: true } },
  { go: 'c1_d7' },
];
N.c1_proc_ok = [
  { exit: 'guifei' },
  { s: 'n', t: '仪仗过去了。你膝盖跪得生疼，但脑袋还在。' },
  { s: 'xiaotao', f: 'angry', t: '小主，刚才赵小主好像想从后面推您一把，被奴婢挡住了！' },
  { s: 'os', f: 'angry', t: '赵如意……又是你。' },
  { set: { suspectZhao: true } },
  { go: 'c1_d7' },
];

/* ---------------- 第 7 天 ---------------- */
N.c1_d7 = [
  { day: 7, time: '夜', label: '第7天 · 夜' },
  { bg: 'room_night', music: 'night', cast: [['me', 'normal', 'C']] },
  { s: 'n', t: '第六天，平安无事——你把茶端得稳稳当当，桂嬷嬷甚至没骂人。第七天夜里，你翻来覆去睡不着。' },
  { if: G => G.meta.lives >= 3, go: 'c1_diary' },
  { s: 'os', f: 'think', t: '（枕头底下好像硌着什么……算了，困了。）' },
  { s: 'n', t: '（孟婆小提示：这里似乎藏着什么。多轮回几世再来看看？）' },
  { go: 'c1_d8' },
];
N.c1_diary = [
  { s: 'me', f: 'think', t: '枕头底下……硌得慌。' },
  { s: 'n', t: '是一本小小的日记，和半面铜镜。' },
  { cast: [['me', 'think', 'L'], ['yuanzhu', 'cry', 'R']] },
  { s: 'yuanzhu', name: '原主（日记）', t: '“爹爹被冤枉了。那天，永和宫的人来过我们家……”' },
  { s: 'yuanzhu', name: '原主（日记）', t: '“若有人能替我活过一百天，洗清家中冤屈，这副身子……便给她吧。”' },
  { s: 'me', f: 'cry', t: '……我知道了。这一百天，我替你活。' },
  { mem: 'M22' },
  { exit: 'yuanzhu' },
  { go: 'c1_d8' },
];

/* ---------------- 第 8 天 ---------------- */
N.c1_d8 = [
  { day: 8, time: '午', label: '第8天 · 一张小纸条' },
  { bg: 'courtyard', music: 'day', cast: [['me', 'normal', 'L'], ['zhao', 'smile', 'R', { prop: 'note' }]] },
  { s: 'zhao', f: 'smile', t: '{名}妹妹，帮姐姐一个小忙嘛~' },
  { s: 'zhao', t: '这张纸条，麻烦你交给后门送菜的刘太监。就是给家里报个平安~' },
  { s: 'n', t: '纸条叠成了小小的方胜，上面写着：“今夜子时，老地方。”' },
  { s: 'os', f: 'think', t: '报平安……写“今夜子时老地方”？' },
  { c: [
    { t: '好呀，举手之劳！', then: [
      { s: 'me', f: 'smile', t: '好呀，包在我身上！' },
      { bg: 'gate', cast: [['me', 'normal', 'L'], ['guard', 'angry', 'R', { pose: 'spear', prop: 'spear' }]] },
      { s: 'n', t: '你刚把纸条递出去，一只大手按住了你的肩膀。' },
      { s: 'guard', t: '私通宫外，传递暗号——人赃并获！', shake: 0.6 },
      { s: 'me', f: 'cry', t: '不是我！是赵如意让我——' },
      { s: 'guard', t: '纸条在你手里，还想赖别人？' },
      { s: 'n', t: '远处，赵如意摇着团扇，笑得像一朵花。' },
    ], death: '014' },
    { t: '婉拒：“姐姐，私传东西出宫是大罪。”', fx: { 规矩: 5 }, go: 'c1_note_refuse' },
    { t: '先答应，转身把纸条交给桂嬷嬷！', need: G => G.mem('M02') || G.flag('incenseEvidence') || G.flag('suspectZhao'), hint: '你已经对赵如意起了疑心', then: [{ s: 'me', f: 'smile', t: '好呀，包在我身上~' }, { s: 'zhao', f: 'smirk', t: '妹妹真好~' }], go: 'c1_note_report' },
  ] },
];
N.c1_note_refuse = [
  { s: 'zhao', f: 'angry', t: '……妹妹真是谨慎呢。' },
  { s: 'zhao', f: 'smirk', t: '那就算了~' },
  { s: 'os', f: 'sweat', t: '她那个笑容……不太对劲。' },
  { set: { noteRefused: true } },
  { go: 'c1_d9' },
];
N.c1_note_report = [
  { bg: 'courtyard', cast: [['guimama', 'normal', 'L', { pose: 'ruler', prop: 'ruler' }], ['me', 'normal', 'R']] },
  { s: 'me', f: 'normal', t: '嬷嬷，赵如意让我把这张纸条传给宫外的刘太监。' },
  { if: G => G.flag('incenseEvidence'), then: [{ s: 'me', f: 'angry', t: '还有这个——她送我的安神香，里面掺了东西。' }, { fx: { 名声: 5 } }] },
  { s: 'guimama', f: 'shock', t: '“今夜子时，老地方”……好大的胆子！' },
  { s: 'guimama', f: 'angry', t: '来人！把赵如意带来！', sfx: 'gong' },
  { cast: [['guimama', 'angry', 'L', { pose: 'ruler', prop: 'ruler' }], ['zhao', 'shock', 'C'], ['me', 'normal', 'R']] },
  { s: 'zhao', f: 'cry', t: '嬷嬷冤枉！是她、是她陷害我！' },
  { s: 'guimama', t: '纸条上是你的字。还有什么好说的？' },
  { s: 'zhao', f: 'angry', t: '{宫名}，你给我等着！宁嫔娘娘不会放过你的！', shake: 0.5 },
  { s: 'os', f: 'think', t: '宁嫔……原来她背后是宁嫔。' },
  { mem: 'M02' },
  { exit: 'zhao' },
  { s: 'guimama', f: 'smile', t: '你做得对。宫里，就要有这份清醒。' },
  { fx: { 规矩: 10, 名声: 10 } },
  { set: { zhaoDown: true } }, { confetti: true },
  { toast: '🏆 章节 Boss「赵如意」已击败！', kind: 'mem', ms: 2600 },
  { if: G => G.run.day >= 9, go: 'c1_d10' },
  { go: 'c1_d9' },
];

/* ---------------- 第 9 天 ---------------- */
N.c1_d9 = [
  { day: 9, time: '午', label: '第9天 · 选秀前夜' },
  { bg: 'courtyard', music: 'happy', cast: [['me', 'normal', 'L', { prop: 'plate' }], ['xiaotao', 'smile', 'R']] },
  { s: 'xiaotao', f: 'star', t: '小主！明天就选秀啦！御膳房送来了点心，说是给秀女们压惊的！' },
  { s: 'n', t: '一盘桂花糕，金黄软糯，香气扑鼻。' },
  { go: 'c1_snack' },
];
N.c1_snack = [
  { c: [
    { t: '吃一块！', need: G => G.cnt('snack') === 0, inc: 'snack', go: 'c1_snack_eat' },
    { t: '再来一块！', need: G => G.cnt('snack') >= 1 && G.cnt('snack') < 3, inc: 'snack', go: 'c1_snack_eat' },
    { t: '再……再来一块！（第四块）', need: G => G.cnt('snack') >= 3, inc: 'snack', danger: '017', go: 'c1_snack_eat' },
    { t: '包一块藏进袖子里，明天带着', need: G => !G.item('桂花糕'), then: [{ item: '桂花糕' }], go: 'c1_snack' },
    { t: '不吃了，留着肚子', go: 'c1_snack_done' },
  ], q: '盘子里还剩好多块……' },
];
N.c1_snack_eat = [
  { s: 'me', f: 'star', t: '唔！好吃！软软糯糯，甜而不腻！', emote: '♪' },
  { if: G => G.cnt('snack') >= 4, then: [{ s: 'os', f: 'sweat', t: '……好像有点撑。没事，睡一觉就消化了。' }, { set: { burp: true } }], go: 'c1_snack_done' },
  { go: 'c1_snack' },
];
N.c1_snack_done = [
  { time: '夜' },
  { bg: 'room_night', music: 'night', cast: [['me', 'normal', 'L'], ['xiaotao', 'normal', 'R']] },
  { s: 'xiaotao', t: '小主，早点歇息吧，明天可是大日子。' },
  { if: G => G.flag('noteRefused') && !G.flag('zhaoDown'), go: 'c1_n9_trap' },
  { go: 'c1_d10' },
];
N.c1_n9_trap = [
  { s: 'n', t: '夜里，你迷迷糊糊听见床边窸窸窣窣的声音……' },
  { c: [
    { t: '起来检查一下包袱', go: 'c1_n9_check' },
    { t: '翻个身，接着睡', set: { framed: true }, danger: '014', go: 'c1_d10' },
  ] },
];
N.c1_n9_check = [
  { if: G => G.stat('警觉') >= 30 || G.mem('M02'), go: 'c1_n9_found' },
  { s: 'n', t: '你翻了翻包袱，迷迷糊糊没发现什么，又睡着了。（🔍 警觉不够……）' },
  { set: { framed: true } },
  { go: 'c1_d10' },
];
N.c1_n9_found = [
  { s: 'n', t: '包袱最底下，压着一张叠成方胜的纸条：“今夜子时，老地方。”' },
  { s: 'os', f: 'angry', t: '赵如意！想栽赃给我？' },
  { c: [
    { t: '连夜交给桂嬷嬷', go: 'c1_note_report' },
    { t: '烧掉，假装什么都没发生', fx: { 警觉: 5 }, go: 'c1_d10' },
  ] },
];

/* ---------------- 第 10 天 · 太和殿 ---------------- */
N.c1_d10 = [
  { day: 10, time: '晨', label: '第10天 · 太和殿选秀' },
  { if: G => G.flag('framed'), go: 'c1_framed' },
  { bg: 'hall', music: 'hall', cast: [['gao', 'normal', 'L', { pose: 'whisk', prop: 'whisk' }], ['emperor', 'normal', 'C'], ['me', 'normal', 'R', { pose: 'fold' }]] },
  { s: 'gao', t: '秀女{宫名}，上前——' },
  { s: 'os', f: 'sweat', t: '稳住，问题不大……' },
  { if: G => G.flag('burp'), go: 'c1_burp' },
  { c: [
    { t: '抬头看看皇帝长啥样', then: [
      { face: { me: 'star' } },
      { s: 'os', f: 'star', t: '哇……真的好帅……' },
      { s: 'gao', f: 'shock', t: '大胆！竟敢直视龙颜！', shake: 0.6 },
      { s: 'emperor', f: 'angry', t: '……拖出去。' },
    ], death: '006' },
    { t: '低头，规规矩矩跪好', fx: { 规矩: 3 }, go: 'c1_hall2' },
  ], q: '你跪在大殿中央。龙椅上的人看不清脸……' },
];
N.c1_framed = [
  { bg: 'courtyard', music: 'danger', cast: [['guimama', 'angry', 'L', { pose: 'ruler', prop: 'ruler' }], ['zhao', 'smirk', 'C'], ['me', 'shock', 'R']] },
  { s: 'zhao', t: '嬷嬷！我亲眼看见{名}妹妹藏了一张纸条！' },
  { s: 'guimama', t: '搜！' },
  { s: 'n', t: '一张纸条从你的包袱里飘了出来：“今夜子时，老地方。”' },
  { s: 'guimama', f: 'angry', t: '私通宫外！', shake: 0.6 },
  { s: 'me', f: 'cry', t: '不是我的！我连繁体字都还没认全——' },
  { death: '014' },
];
N.c1_burp = [
  { s: 'me', f: 'normal', t: '民女{宫名}，参见——' },
  { s: 'me', f: 'shock', t: '嗝——！', sfx: 'burp', shake: 0.6 },
  { s: 'n', t: '嗝声在太和殿里回荡了整整三秒。余音绕梁。' },
  { s: 'emperor', f: 'think', t: '……这股味道。是桂花糕？' },
  { s: 'n', t: '皇上的眼睛亮了一下，又迅速恢复了冰冷。' },
  { s: 'emperor', f: 'angry', t: '殿前失仪。撂牌子。' },
  { death: '017' },
];
N.c1_hall2 = [
  { s: 'emperor', t: '抬起头来。' },
  { face: { me: 'normal' } },
  { s: 'os', f: 'shock', t: '这张脸……剑眉星目，冷冰冰的——怎么那么像我那个前男友？！' },
  { c: [
    { t: '（小声吐槽）“他长得好像我前男友……”', then: [
      { s: 'me', f: 'sweat', t: '（小声）他长得好像我前男友……' },
      { s: 'n', t: '太和殿的回音效果，大晟第一。全殿安静了。' },
      { s: 'emperor', f: 'think', t: '……“前男友”，是何物？' },
      { s: 'me', f: 'panic', t: '是、是一种……水果？' },
      { s: 'gao', f: 'angry', t: '胡言乱语，欺君罔上！', shake: 0.6 },
    ], death: '007' },
    { t: '（在心里默念）稳住，他不是，他不是', fx: { 警觉: 3 }, go: 'c1_hall3' },
  ] },
];
N.c1_hall3 = [
  { s: 'emperor', t: '你有何才艺？' },
  { c: [
    { t: '学电视剧：故意掉手帕，引起皇上注意', then: [
      { s: 'os', f: 'smirk', t: '宫斗剧第一集：女主掉手帕，皇上弯腰捡起，一眼万年——' },
      { s: 'n', t: '你“不小心”把手帕往前一抛。' },
      { s: 'n', t: '皇上没看你。侍卫看见了。' },
      { cast: [['emperor', 'shock', 'L'], ['me', 'shock', 'C'], ['guard', 'angry', 'R', { pose: 'spear', prop: 'spear' }]] },
      { s: 'guard', t: '此女有异动！暗器！护驾——！', shake: 0.8 },
    ], death: '019' },
    { t: '递上袖子里的桂花糕：“臣女会做点心。”', mem: 'M01', need: G => G.item('桂花糕') > 0, go: 'c1_sweet' },
    { t: '“臣女会下棋。”', fx: { 圣眷: 5 }, then: [{ s: 'emperor', f: 'think', t: '下棋？……哦。（朕好像缺个对手。）' }, { set: { chess: true } }], go: 'c1_result' },
    { t: '“臣女什么都不会，但臣女很能活。”', fx: { 圣眷: 3 }, then: [{ s: 'emperor', f: 'smirk', t: '……很能活？' }, { s: 'gao', f: 'sweat', t: '（皇上刚才……是笑了吗？）' }], go: 'c1_result' },
  ] },
];
N.c1_sweet = [
  { s: 'me', f: 'smile', t: '臣女会做点心。这是……桂花糕。' },
  { s: 'gao', f: 'shock', t: '这——' },
  { s: 'emperor', f: 'star', t: '……！', emote: '♪' },
  { s: 'n', t: '皇上的眼睛亮了一瞬，然后迅速板起脸，接过了桂花糕。' },
  { s: 'emperor', f: 'blush', t: '……咳。尚可。' },
  { item: '桂花糕', n: -1 }, { fx: { 圣眷: 15, 疑心: 10 } },
  { s: 'gao', f: 'smirk', t: '（高公公深深看了你一眼，若有所思。）' },
  { set: { rank: '常在', rankName: '封常在（桂花糕直通车）' } },
  { go: 'c1_pass' },
];
N.c1_result = [
  { if: G => G.stat('名声') + G.stat('规矩') >= 95, then: [{ set: { rank: '答应', rankName: '封答应' } }], go: 'c1_pass' },
  { if: G => G.flag('metAn'), go: 'c1_maid' },
  { go: 'c1_reject' },
];
N.c1_reject = [
  { s: 'gao', t: '撂牌子——赐花，回家。' },
  { s: 'os', f: 'cry', t: '回家……原主家可是背着冤案的……（🌸名声+📏规矩不够）' },
  { bg: 'gate', music: 'danger', cast: [['me', 'shock', 'L'], ['guard', 'angry', 'R', { pose: 'spear', prop: 'spear' }]] },
  { s: 'n', t: '你坐着马车回到{姓}家旧宅。刚下车——' },
  { s: 'guard', name: '官兵', t: '奉旨查抄{姓}家！闲杂人等——咦，这儿还有一个！' },
  { s: 'n', t: '抄家的官兵，比你先到了一步。' },
  { death: '005' },
];
N.c1_maid = [
  { s: 'gao', t: '撂牌子——' },
  { s: 'n', t: '就在你绝望的时候，殿外探进来一个圆脑袋。' },
  { cast: [['gao', 'normal', 'L', { pose: 'whisk', prop: 'whisk' }], ['me', 'cry', 'C'], ['xiaoan', 'smile', 'R']] },
  { s: 'xiaoan', t: '高公公！御膳房缺个手巧的宫女，这位小主……呃，这位姑娘，上回帮咱做过点心！' },
  { s: 'gao', f: 'smirk', t: '……罢了。分去御膳房当差吧。' },
  { set: { rank: '宫女', rankName: '落选 → 御膳房宫女（宫女线）' } },
  { s: 'os', f: 'sweat', t: '从秀女变宫女……但至少，活下来了！' },
  { go: 'c1_end' },
];
N.c1_pass = [
  { s: 'gao', t: '秀女{宫名}，留牌子——封{位份}！', sfx: 'fanfare' },
  { confetti: true },
  { s: 'me', f: 'smile', t: '谢主隆恩！', jump: true },
  { s: 'os', f: 'star', t: '活下来了！我居然在宫斗剧里活过了第一集！' },
  { if: G => G.flag('chess'), then: [{ s: 'gao', f: 'normal', t: '对了，皇上口谕：改日召{位份}去养心殿……下棋。' }, { s: 'os', f: 'think', t: '下棋？……行吧，五子棋我可是小区冠军。' }] },
  { go: 'c1_end' },
];
N.c1_end = [
  { bg: 'cining', music: 'night', cast: [['taihou', 'normal', 'C', { pose: 'beads', prop: 'beads' }]], cat: { pos: 'R', mood: 'happy' } },
  { s: 'n', t: '当晚，慈宁宫。' },
  { s: 'taihou', f: 'smile', t: '♪两只老虎，两只老虎，跑得快，跑得快……♪', emote: '♪' },
  { s: 'taihou', f: 'normal', t: '听说今天选秀，有个叫{宫名}的孩子……' },
  { if: G => G.flag('rank') === '常在', then: [{ s: 'taihou', f: 'smirk', t: '递了块桂花糕给皇帝？呵，那孩子嗜甜，宫里可没几个人知道。' }] },
  { if: G => G.flag('catFriend'), then: [{ s: 'taihou', f: 'smile', t: '糯米还让她摸了？糯米可是谁都不让碰的。' }] },
  { s: 'taihou', f: 'think', t: '……有意思。和四十年前的我，有点像。' },
  { s: 'n', t: '太后推了推老花镜，低头看着手里的半面铜镜。镜子里，隐约有一道细细的裂痕。' },
  { s: 'taihou', f: 'smirk', t: '这一局，哀家先看看。' },
  { chapterEnd: 'ch1', title: '第一章 · 入宫 · 通关！', rankText: '{宫名}，你活过了储秀宫！' },
];

P.registerChapter({
  id: 'ch1', title: '第一章 · 入宫', start: 'c1_start', nodes: N,
  deathMems: { '011': 'M02', '014': 'M02', '009': 'M07', '017': 'M01' },
});
})(window.PALACE = window.PALACE || {});
