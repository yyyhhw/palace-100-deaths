/* 序章：奶茶之死 → 奈何桥 → 入宫马车 */
(function (P) {
'use strict';
const ROOF = null;
P.registerChapter({
  id: 'ch0', title: '序章 · 一口珍珠的代价', start: 'p_room', rebirthStart: 'p_carriage',
  deathCont: { '000': 'p_bridge' },
  nodes: {
    p_room: [
      { set: { modernMode: true } }, { hud: false },
      { bg: 'room', music: 'modern', cast: [['modern', 'normal', 'C', { prop: 'milktea' }]] },
      { s: 'n', t: '凌晨两点。出租屋。外卖盒堆成了一座小山。' },
      { s: 'n', t: '宫斗剧《凤仪天下》，全 300 集，今晚大结局。' },
      { s: 'modern', f: 'star', t: '来了来了！皇后终于要扳倒那个绿茶贵妃了！', jump: true },
      { s: 'os', f: 'smile', t: '作为一名熬夜冠军、奶茶续命的新媒体运营，我对宫斗剧的研究，已经到了十级学者的水平。' },
      { s: 'os', f: 'smirk', t: '滴血认亲、银针验毒、故意掉手帕……这些套路，我闭着眼都能背出来。' },
      { s: 'n', t: '屏幕里，贵妃一脚踩空，从台阶上骨碌碌滚了下去，像一颗汤圆。' },
      { s: 'modern', f: 'shock', t: '噗——' },
      { c: [
        { t: '哈哈哈哈哈这也太扯了！（放声大笑）', go: 'p_room_laugh' },
        { t: '稳住，问题不大……（憋笑，吸一口奶茶压一压）', go: 'p_room_hold' },
      ], q: '太好笑了，怎么办！' },
    ],
    p_room_laugh: [
      { s: 'modern', f: 'smile', t: '哈哈哈哈哈哈——咕！', shake: 0.5 },
      { s: 'n', t: '一颗珍珠，以完美的抛物线，滑进了气管。' },
      { s: 'modern', f: 'panic', t: '咳……咳咳……珍……珠……', emote: '💦' },
      { death: '000' },
    ],
    p_room_hold: [
      { s: 'modern', f: 'sweat', t: '（吸——）' },
      { s: 'n', t: '就在这时，屏幕里的皇上一本正经地说：“爱妃，朕的龙袍……穿反了。”' },
      { s: 'modern', f: 'smile', t: '噗哈哈哈哈——咕！', shake: 0.5 },
      { s: 'n', t: '憋笑失败。一颗珍珠，以完美的抛物线，滑进了气管。' },
      { s: 'modern', f: 'panic', t: '咳……这……也……行？', emote: '💦' },
      { death: '000' },
    ],
    p_bridge: [
      { set: { modernMode: true } }, { hud: false },
      { bg: 'bridge', music: 'bridge', cast: [['modern', 'dead', 'L', { ghost: true }], ['mengpo', 'normal', 'R', { prop: 'soup' }]] },
      { s: 'mengpo', t: '哟，新来的？排队排队，前面还有八百个。' },
      { s: 'modern', f: 'shock', t: '这、这是哪儿？我的奶茶呢？！' },
      { s: 'mengpo', f: 'smirk', t: '奈何桥。你的奶茶在阳间，你在这儿。被珍珠噎死的，我这儿一年也就见三五个。' },
      { s: 'mengpo', f: 'normal', t: '行了，别哭。姓甚名谁？报上名来，我好登记。' },
      { checkpoint: '奈何桥 · 登记处' },
      { input: 'modern' },
      { if: G => G.hasLatin(G.meta.names.modern), go: 'p_bridge_latin' },
      { s: 'mengpo', f: 'normal', t: '{现代名}……嗯，写上了。字还挺好看。' },
      { go: 'p_bridge2' },
    ],
    p_bridge_latin: [
      { s: 'mengpo', f: 'shock', t: '“{现代名}”？这写的是什么？蝌蚪？符咒？' },
      { s: 'mengpo', f: 'angry', t: '我们地府只收方块字！生死簿上查无此鬼——你是偷渡来的外国鬼吧？', shake: 0.4 },
      { s: 'modern', f: 'panic', t: '不是不是，这是我的英文名——' },
      { s: 'mengpo', f: 'angry', t: '查无此鬼，一律遣返！再投一次胎去！' },
      { death: 'E02' },
    ],
    p_bridge2: [
      { s: 'mengpo', f: 'think', t: '奇怪……你阳寿明明还有六十年，怎么生死簿上你的名字旁边，多了一道裂痕？' },
      { s: 'n', t: '孟婆从袖子里掏出一块铜镜碎片。碎片里，一个穿古装的女孩正哭着许愿。' },
      { s: 'mengpo', f: 'normal', t: '“谁能替我活过一百天，洗清家中冤屈，我愿把这副身子给她。”……啧，又是这面镜子。' },
      { s: 'mengpo', f: 'smirk', t: '{现代名}，恭喜你，被“捞”走了。你要去大晟朝，替这姑娘活一百天。' },
      { s: 'modern', f: 'star', t: '穿越？！宫斗剧十级学者的春天来了！', jump: true },
      { s: 'mengpo', f: 'smirk', t: '别高兴太早。那地方……每个人都可能想要你的命。' },
      { s: 'mengpo', f: 'normal', t: '不过放心，你死了，还会回到我这儿。死一次，就多知道一点。记住：知识就是存档。' },
      { s: 'mengpo', f: 'think', t: '上一个这么能死的，还是四十年前那个爱哼小曲的丫头……算了，不提了。' },
      { s: 'mengpo', f: 'normal', t: '喝汤吗？喝了，就什么都忘了。' },
      { c: [
        { t: '不喝！我要带着记忆去！', go: 'p_carriage' },
        { t: '听说第二碗半价？', then: [{ s: 'mengpo', f: 'smirk', t: '……你是我见过最会过日子的鬼。不卖，走你！' }], go: 'p_carriage' },
      ] },
    ],
    p_carriage: [
      { set: { modernMode: false } }, { hud: false },
      { bg: 'carriage', music: 'day', trans: 'fade', cast: [['me', 'sleepy', 'L'], ['xiaotao', 'cry', 'R']] },
      { checkpoint: '入宫马车上' },
      { s: 'xiaotao', f: 'cry', t: '小姐！小姐您可算醒了！您哭了一整夜，奴婢还以为您……' },
      { s: 'me', f: 'shock', t: '（低头：古装、长发、步摇、绣花鞋……）' },
      { s: 'os', f: 'star', t: '真、真穿了！而且这身衣服好好看！' },
      { s: 'xiaotao', f: 'normal', t: '小姐，快到宫门了。这是您的选秀名牌——呀，被您的眼泪泡花了，字都看不清了！' },
      { if: G => !G.meta.names.surname, go: 'p_name' },
      { go: 'p_name_confirm' },
    ],
    p_name: [
      { s: 'me', f: 'sweat', t: '这……我叫什么来着？' },
      { input: 'palace' },
      { go: 'p_name_done' },
    ],
    p_name_confirm: [
      { s: 'xiaotao', f: 'think', t: '奴婢记得，上面写的是……{宫名}！对吧？' },
      { c: [
        { t: '对，就是{宫名}', go: 'p_name_done' },
        { t: '其实……我想换个名字', then: [{ input: 'palace' }], go: 'p_name_done' },
      ] },
    ],
    p_name_done: [
      { s: 'xiaotao', f: 'smile', t: '对对，{宫名}！小姐您可是{姓}太傅家的——' },
      { s: 'xiaotao', f: 'shock', t: '嘘——！这话可不能在宫里说。三年前老爷出了事，您是改了籍贯进来的。' },
      { s: 'os', f: 'think', t: '原主家里有冤案？这剧本我熟：接下来就是步步惊心。' },
      { hud: true }, G => { P.UI.hud(); },
      { s: 'n', t: '【小教学】屏幕上方是你的属性：☀️圣眷 🌸名声 💊健康 🔍警觉 👁️疑心 📏规矩。点属性栏可以看说明。' },
      { s: 'n', t: '【小教学】会轻轻抖动的选项……通常会死。死过的选项会标上「👻 已收录」。放心，这里是简单模式：死了立刻重来。' },
      { s: 'xiaotao', f: 'normal', t: '小姐，进宫以后，奴婢就得改口叫您“小主”啦。' },
      { c: [
        { t: '探出头去看看风景！', then: [
          { s: 'me', f: 'star', t: '哇——红墙金瓦，好壮观！', jump: true },
          { sfx: 'thud' }, { shake: 1 },
          { s: 'n', t: '咚！宫门上的铜门钉，在你脑门上印了一颗、两颗……九颗小星星。' },
          { s: 'xiaotao', f: 'cry', t: '小、小姐——！' },
        ], death: '001' },
        { t: '乖乖坐好，问问小桃宫里的规矩', fx: { 规矩: 5 }, go: 'p_ask' },
        { t: '稳住，问题不大（深呼吸）', fx: { 警觉: 5 }, go: 'p_breathe' },
      ], q: '马车摇摇晃晃，快到宫门了……' },
    ],
    p_ask: [
      { s: 'xiaotao', f: 'think', t: '宫里规矩可多啦：见了贵人要跪；别人给的东西不能乱吃；还有，皇上的名讳——萧景珩——那几个字，千万不能说、不能写！' },
      { s: 'me', f: 'smile', t: '记住了。小桃你真是个宝藏丫头。' },
      { s: 'xiaotao', f: 'blush', t: '嘿嘿~' },
      { go: 'p_arrive' },
    ],
    p_breathe: [
      { s: 'os', f: 'normal', t: '吸气……呼气……我可是看过三百集宫斗剧的人。' },
      { s: 'os', f: 'smirk', t: '再说了，死了还能重来。这叫——无限续关。' },
      { go: 'p_arrive' },
    ],
    p_arrive: [
      { s: 'n', t: '“吁——”马车停了。' },
      { title: '第一章 · 入宫', sub: '储秀宫 · 第 1–10 天 · 目标：活过选秀' },
      { go: 'c1_start' },
    ],
  },
});
})(window.PALACE = window.PALACE || {});
