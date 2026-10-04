/* 第五章：百日宴（筹备 · 火场 · 百日宴 · 照影镜 · 第 96–100 天）—— 最终章
   关系值沿用第四章；新增 hh 皇后杀意 / scheme 心机次数。
   旗标：tokenOk 腰牌找回 / jingSafe 静太妃有人护送 / taoSafe 小桃平安 / fireReady 火场有准备 / wineKnown 鸳鸯壶 / debtDay 借债日
   结局判定在观星台（c5_mirror）。 */
(function (P) {
'use strict';
const N = {};
const LBL = { trust_tao: '🍑 小桃信任', trust_lu: '🛡️ 陆峥信任', trust_hou: '🙏 太后信任', intel: '🕸️ 情报', ayun: '🧺 阿芸好感', ning: '🐍 宁嫔杀意', jing: '🥬 静太妃信任', trust_wen: '💊 温太医信任', kill: '🔪 贵妃杀意', hh: '👑 皇后杀意', silver: '💰 银两', scheme: '🦊 心机' };
const CAP = /^trust|ayun|jing|ning|kill|hh/;
const add = (k, by) => G => { const c = G.run.cnt; c[k] = (c[k] || 0) + by; if (k !== 'silver') c[k] = Math.max(0, c[k]); if (CAP.test(k)) c[k] = Math.min(100, c[k]); P.UI.toast(`${LBL[k] || k} ${by > 0 ? '+' : ''}${by}`, (k === 'ning' || k === 'kill' || k === 'hh') && by > 0 ? 'bad' : 'info', 1400); };
const C = (G, k) => G.cnt(k);
const EV = G => Object.keys(G.run.items).filter(k => k.startsWith('证据卡') && G.run.items[k] > 0).length;
const has = (G, k) => (G.run.items[k] || 0) > 0;
const card = (name, why) => [{ item: '证据卡·' + name }, G => { P.UI.toast(`📜 证据卡：${EV(G)} 张${why ? '（' + why + '）' : ''}`, 'mem', 2000); }];
const scheme = G => { G.run.cnt.scheme = (G.run.cnt.scheme || 0) + 1; P.UI.toast('🦊 心机 +1（现在 ' + G.run.cnt.scheme + '）', 'bad', 1600); };
const home = G => G.flag('movedOut') ? 'room_day' : 'yonghe';
const homeN = G => G.flag('movedOut') ? 'room_night' : 'yonghe_night';
// 通用属性死法：健康 0 / 名声 0 / 疑心 100 / 三大派系杀意同时 ≥ 70
const CHK = G => { const s = G.run.stats, c = G.run.cnt;
  if (s.健康 <= 0) return G.death('092'); if (s.名声 <= 0) return G.death('093'); if (s.疑心 >= 100) return G.death('094');
  if ((c.hh || 0) >= 70 && (c.kill || 0) >= 70 && (c.ning || 0) >= 70) return G.death('096'); return null; };
// 百日宴上肯替你说话的人（信任 ≥ 60）
const ALLY = {
  xiaotao: G => C(G, 'trust_tao') >= 60, luzheng: G => C(G, 'trust_lu') >= 60, taihou: G => !!G.flag('houAlly') || C(G, 'trust_hou') >= 60,
  wen: G => C(G, 'trust_wen') >= 60, jingtaifei: G => C(G, 'jing') >= 60, ayun: G => C(G, 'ayun') >= 60, guifei: G => !!G.flag('sisters'),
};
const allies = G => Object.keys(ALLY).filter(k => ALLY[k](G));
const MISSING = [['dossier', '旧案卷宗'], ['ledger', '西域账本'], ['jing', '静太妃证词'], ['cloth', '永和宫布料'], ['cuilv', '翠缕证词']];
const missing = G => MISSING.filter(([k, n]) => !has(G, '证据卡·' + n)).map(x => x[0]);
const owesDebt = G => C(G, 'silver') < 0 && G.flag('debtDay');
// 腰牌没找回时，百日宴上谁能替你作证（按顺序，第一个人主讲，其余的人帮腔）
const TOKEN_HELP = [
  ['reported', G => !!G.flag('tokenReported')],
  ['luzheng', G => C(G, 'trust_lu') >= 70],
  ['xiaotao', G => C(G, 'trust_tao') >= 75 && !G.flag('taoHurt')],
  ['ayun', G => C(G, 'ayun') >= 60],
];
const tokenRescue = G => TOKEN_HELP.filter(([k, f]) => f(G)).map(x => x[0]);
const TOKEN_MAIN = {
  reported: [
    { enter: 'xiaoan', face: 'panic', pos: 'CL', sfx: 'pop' },
    { s: 'xiaoan', f: 'panic', t: '（抱着一摞册子，一路从殿外滑跪进来）且慢——！！内务府失物册，第九十六天那一页，奴才给您带来了！' },
    { s: 'n', t: '小安子把册子摊在御案上。上面是你自己写的两页“报失文书”，连红绳的断口都画了图，末尾一枚鲜红的手印。' },
    { s: 'xiaoan', f: 'smirk', t: '“旧牌作废”四个大字，内务府盖的章！皇上您看——这块牌子四天前就不是小主的了。谁带着它，谁才说不清！' },
    { s: 'emperor', f: 'shock', t: '……{宫名}，你连这个都写了？' },
    { s: 'me', f: 'smirk', t: '内务府的小公公说我写的不是报失，是案卷。现在看来，他说对了。' },
  ],
  luzheng: [
    { enter: 'luzheng', face: 'normal', pos: 'CL', pose: 'spear', prop: 'spear' },
    { s: 'luzheng', f: 'normal', t: '（收枪，单膝跪地）启禀皇上。九十八天，{位份}在宫道上亲口告诉卑职，腰牌丢了。' },
    { s: 'luzheng', f: 'think', t: '卑职当天就记在了值房的簿子上：“某宫{位份}失腰牌一块，红绳剪断，疑有人图谋”。卑职的簿子，从不记错。' },
    { s: 'luzheng', f: 'normal', t: '而且刺客的腰带，系的是永和宫的结法。这个结，卑职在王福身上见过。职责所在。' },
    { s: 'os', f: 'smile', t: '（给烤鸭上香的人，记性果然也好。）' },
  ],
  xiaotao: [
    { enter: 'xiaotao', face: 'angry', pos: 'CL', sfx: 'pop' },
    { s: 'xiaotao', f: 'angry', t: '（从殿门口冲进来，挡在你面前）不许冤枉我们小主！腰牌丢的那天早上，是奴婢头一个发现的！' },
    { s: 'xiaotao', f: 'cry', t: '红绳是剪断的！小主还拿着那截绳子闻了半天，奴婢当时还以为她饿了——' },
    { s: 'xiaotao', f: 'angry', t: '小主这一百天，每天想的都是怎么活下去，哪有空送刺客腰牌！她连桂花糕都舍不得送人！' },
    { s: 'emperor', f: 'think', t: '……桂花糕，她送过朕。' }, { s: 'xiaotao', f: 'sweat', t: '……那、那是例外！' },
  ],
  ayun: [
    { enter: 'ayun', face: 'angry', pos: 'CL', sfx: 'pop' },
    { s: 'ayun', f: 'angry', t: '（从宫女堆里挤出来）浣、浣衣局阿芸！奴婢能作证——那天王福公公往永和宫的脏衣筐里塞过一块木牌！' },
    { s: 'ayun', f: 'normal', t: '他还给了奴婢一个铜板封口。铜板在这儿！（啪地拍在御案上）奴婢一直留着，就等今天！' },
    { s: 'wenshang', f: 'sweat', t: '……一、一个铜板能说明什么？' },
    { s: 'ayun', f: 'smirk', t: '说明王福公公抠门。也说明他心虚。' },
  ],
};
const TOKEN_CHIME = {
  reported: { s: 'xiaoan', name: '小安子', t: '（在旁边举着册子）内务府的章，红的！' },
  luzheng: { s: 'luzheng', name: '陆峥', t: '值房的簿子上也记着。卑职可以作证。' },
  xiaotao: { s: 'xiaotao', name: '小桃', t: '奴婢也看见了！红绳是剪断的！' },
  ayun: { s: 'ayun', name: '阿芸', t: '王福塞东西的时候，奴婢就在旁边！铜板为证！' },
};
P.C5_TOKEN = { TOKEN_HELP, TOKEN_MAIN, TOKEN_CHIME };
const TOKEN_STEPS = [G => { const w = tokenRescue(G); if (w.length) G.run.flags.tokenWitness = w[0]; return null; }]
  .concat(TOKEN_HELP.map(([k]) => ({ if: G => tokenRescue(G)[0] === k, then: TOKEN_MAIN[k] })))
  .concat(TOKEN_HELP.map(([k]) => ({ if: G => tokenRescue(G).indexOf(k) > 0, then: [TOKEN_CHIME[k]] })));
P.C5 = { EV, allies, ALLY, missing, CHK, tokenRescue };

/* ---------------- 开场 ---------------- */
N.c5_start = [
  G => { G.run.ch = 'ch5'; const c = G.run.cnt, f = G.run.flags;
    if (c.trust_tao == null) c.trust_tao = 60; if (c.trust_lu == null) c.trust_lu = 50; if (c.trust_hou == null) c.trust_hou = 60;
    c.intel = c.intel || 3; c.ayun = c.ayun || 0; c.jing = c.jing || 0; c.trust_wen = c.trust_wen || 15; if (c.ning == null) c.ning = 60; c.kill = c.kill || 0;
    if (c.hh == null) c.hh = f.side === 'hou' ? 10 : f.side === 'fei' ? 45 : 25;
    c.scheme = 0; if (c.silver == null) c.silver = 30;
    ['tokenOk', 'tokenLost', 'tokenReported', 'jingSafe', 'cuilvSafe', 'taoSafe', 'taoHurt', 'fireReady', 'wineKnown', 'debtDay', 'seatOk', 'gift', 'herbBook', 'exposed5', 'tokenWitness'].forEach(k => { delete f[k]; });
    if (!f.rank) f.rank = '常在'; },
  { hud: true },
  { title: '第五章 · 百日宴', sub: '筹备 · 火场 · 百日宴 · 照影镜 · 第 96–100 天' },
  { go: 'c5_d96' },
];

/* 腰牌丢了：去内务府补牌 / 报失（报失登记在册，百日宴上能自证清白） */
const REPORT = (intro) => [
  { bg: 'courtyard', music: 'day', cast: [['me', 'normal', 'L'], ['taijian', 'normal', 'R', { pose: 'hold', prop: 'ledger' }]] },
  { s: 'n', t: intro || '内务府。一个打着哈欠的小太监，坐在一摞比他还高的册子后面。' },
  { s: 'taijian', f: 'normal', t: '补腰牌？十文钱，立等可取。' },
  { s: 'taijian', f: 'sleepy', t: '要是“报失”嘛……得写文书：哪天丢的、在哪儿丢的、怎么丢的，按手印，登记在册。要等半个时辰，小主您看——' },
  { s: 'xiaotao', f: 'think', t: '（小声）小主，写文书好麻烦的，上回奴婢报失一只鞋，写了三页。' },
  { c: [
    { t: '“写！按手印！哪天、哪儿、红绳是剪断的——全写上。”（登记报失）', then: [
      { s: 'n', t: '你足足写了两页纸。连“红绳断口整齐，疑似剪刀所为；作案时间，大约是昨夜”都写上了。' },
      { s: 'taijian', f: 'shock', t: '……小主，您这不是报失，是在写案卷。' },
      { s: 'me', f: 'smirk', t: '对。将来要是有人拿着我的旧腰牌干坏事，这页纸就是我的证人。' },
      { s: 'taijian', f: 'smile', t: '得嘞，第九十六天，丙字第七号，登记在册！新腰牌给您——旧牌作废！' },
      { set: { tokenReported: true } }, { item: '腰牌（新补的）' },
      { s: 'os', f: 'normal', t: '（旧的还在外面。但至少，白纸黑字，它从今天起“不是我的”了。）' },
    ] },
    { t: '“只补牌就行，文书就免了。”', danger: '084', then: [
      { s: 'taijian', f: 'smile', t: '爽快！十文钱，拿好。' },
      { s: 'os', f: 'think', t: '（新牌子到手了。旧的那块……算了，应该没人捡一块木牌子去干什么吧。）' },
      { item: '腰牌（新补的）' },
    ] },
  ] },
];
/* 自己查：从剪断的红绳查起（任何时候都能选） */
N.c5_search = [G => ({ go: G.flag('movedOut') ? 'c5_searcha' : 'c5_searchb' })];
const SEARCH = [
  { s: 'me', f: 'think', t: '小桃，把那截红绳给我。' },
  { s: 'n', t: '你把红绳凑到鼻子底下。断口齐整，是剪子剪的。绳子上一股皂角味，皂角味底下，还有一丝甜腻的——茉莉香。' },
  { s: 'xiaotao', f: 'shock', t: '皂角是浣衣局洗衣裳用的！茉莉香……宫里谁用茉莉香来着？' },
  { s: 'me', f: 'smirk', t: '谁笑起来，像一朵刚开的茉莉？' },
  { s: 'xiaotao', f: 'think', t: '……贵妃娘娘？' }, { s: 'me', f: 'sweat', t: '贵妃笑起来像一盆仙人掌。' },
  { bg: 'laundry', music: 'mystery', cast: [['me', 'normal', 'L'], ['ayun', 'normal', 'C'], ['xiaotao', 'think', 'R']] },
  { s: 'n', t: '浣衣局。院子里摆着一排脏衣筐，每只筐上贴着一张红纸：长春、坤宁、永和、延禧……' },
  { s: 'ayun', f: 'sweat', t: '小主？今天管事盯得紧，您要找什么，得快——一筐只能翻一回，翻错了，管事要骂人的。' },
  { s: 'n', t: '💡 红绳上有皂角味和茉莉香。翻哪一筐？' },
  { c: [
    { t: '翻贴着“长春”的筐', then: [
      { s: 'n', t: '你翻出了三斤瓜子壳、两把断了骨的团扇，和一张写着“丽昭仪今日又穿错颜色”的小纸条。' },
      { s: 'xiaotao', f: 'sweat', t: '……贵妃娘娘的衣服里，怎么全是瓜子壳？' },
      { s: 'ayun', f: 'panic', t: '管事来了！小主快走！' },
      { set: { tokenLost: true } },
      { s: 'os', f: 'sweat', t: '（腰牌没找着。只能先去内务府了。）' },
      ...REPORT('你灰头土脸地出了浣衣局，转身进了内务府。'),
    ] },
    { t: '翻贴着“永和”的筐——茉莉香，是宁嫔', then: [
      { s: 'ayun', f: 'shock', t: '永和宫的？那里头全是宁嫔娘娘的……小主小心，她的衣裳上都熏着香，熏得我直打喷嚏。' },
      { s: 'n', t: '你把手伸进筐底，在一件绣着荷花、熏透了茉莉香的中衣里，摸到了一块硬邦邦的木牌。' },
      { s: 'n', t: '正面刻着你的名字，背面多了一道新划的记号。' },
      { s: 'ayun', f: 'angry', t: '我想起来了！昨天王福公公亲手往这筐里塞过东西，还给了我一个铜板，说“别多嘴”。……这铜板我不要了！我要扔他脸上！' },
      { s: 'xiaotao', f: 'star', t: '小主好厉害！闻一闻就找着了！比御膳房的狗还灵！' },
      { s: 'me', f: 'sweat', t: '……谢谢，下回换个夸法。' },
      { set: { tokenOk: true } }, { item: '腰牌' }, add('ayun', 5), add('intel', 1),
      { s: 'os', f: 'smirk', t: '（腰牌塞进脏衣服，送回永和宫，百日宴上交给刺客。宁嫔，你的香太浓了。）' },
    ] },
    { t: '翻贴着“坤宁”的筐', then: [
      { s: 'n', t: '皇后娘娘的筐里叠得整整齐齐，每件衣服上都别着一张小纸条：“初一穿”“十五穿”“见太后穿”。' },
      { s: 'xiaotao', f: 'shock', t: '连脏衣服都叠得这么整齐……' },
      { s: 'ayun', f: 'panic', t: '小主！那是皇后娘娘的筐！翻乱了要掉脑袋的！快放回去！' },
      { set: { tokenLost: true } },
      { s: 'os', f: 'sweat', t: '（腰牌没找着，还差点闯祸。先去内务府吧。）' },
      ...REPORT('你小心翼翼地把皇后的衣服叠回原样，溜出了浣衣局，转身进了内务府。'),
    ] },
  ] },
  { go: 'c5_d96rest' },
];
N.c5_searcha = [{ bg: 'room_day', music: 'mystery', cast: [['me', 'think', 'L'], ['xiaotao', 'sweat', 'R']] }].concat(SEARCH);
N.c5_searchb = [{ bg: 'yonghe', music: 'mystery', cast: [['me', 'think', 'L'], ['xiaotao', 'sweat', 'R']] }].concat(SEARCH);
/* ---------------- 第 96 天 · 最后一期晨报 ---------------- */
N.c5_d96 = [
  { day: 96, time: '晨', label: '第96天 · 最后一期晨报', ch: 'ch5' },
  G => ({ go: G.flag('movedOut') ? 'c5_d96a' : 'c5_d96b' }),
];
const D96 = [
  { s: 'n', t: '离百日宴还有四天。宫里张灯结彩，连御膳房的狗都系上了红绸。' },
  { s: 'xiaotao', f: 'smile', t: '小主，您今天气色真好！昨晚没说梦话，也没喊“KPI”。' },
  { s: 'me', f: 'smirk', t: '因为我梦见自己已经下班了。' },
  { s: 'xiaotao', f: 'think', t: '……下班是什么？是从宫里下来吗？那可不能乱梦，梦见出宫是要挨板子的。' },
  { enter: 'xiaoan', face: 'smile', pos: 'R', sfx: 'pop' },
  { s: 'xiaoan', f: 'smile', t: '咚咚锵——小安子晨报！本期为《百日宴特刊》，内容丰富，童叟无欺，打赏照旧！', jump: true },
  { s: 'xiaotao', f: 'smirk', t: '你上回说照旧，结果比上上回贵了五文。' },
  { s: 'xiaoan', f: 'sweat', t: '那叫通货膨胀！小主教的！' },
  { s: 'os', f: 'sweat', t: '（我到底给这个宫里教了多少不该教的词。）' },
  { s: 'xiaoan', f: 'normal', t: '先科普：按祖制，新人入宫满一百天，太后设“百日宴”，说是给新人压压惊。小主，您是今年最需要压惊的那一位。' },
  { s: 'me', f: 'sweat', t: '……这倒是实话。' },
  { s: 'xiaoan', f: 'normal', t: '头条：百日宴菜单泄露！御膳房准备了整整十二道硬菜，压轴的是一只挂炉烤鸭——据说是“大将军”的表哥。' },
  { s: 'me', f: 'shock', t: '……大将军还有表哥？' },
  { s: 'xiaoan', f: 'smirk', t: '陆侍卫听说以后，在御膳房门口站了半个时辰。最后说了一句“职责所在”，走了。表哥没保住。' },
  { s: 'xiaoan', f: 'think', t: '二条：温尚书递了帖子，百日宴那天进宫赴宴，还带了一车“贺礼”。车上盖着油布，抬车的有八个人——个个手上有老茧。' },
  { s: 'os', f: 'think', t: '（抬礼的手，不该有握刀的茧。）' },
  { s: 'xiaoan', f: 'sweat', t: '三条……这个是奴才自己的事：奴才的债，还清了。小主，这是奴才这辈子第一次，一个铜板都不欠人。' },
  { if: G => !G.flag('anStable'), then: [
    { s: 'xiaoan', f: 'cry', t: '……是去浣衣局帮人洗了一个月的恭桶还上的。小主，那天您没帮奴才，奴才不怪您。奴才就是想说，奴才现在干净了——两种意义上都是。' },
    { s: 'me', f: 'sweat', t: '……对不起。' }, { s: 'xiaoan', f: 'smile', t: '没事！恭桶教会了奴才很多道理。' },
  ], else: [
    { s: 'xiaoan', f: 'cry', t: '那天小主替奴才还了三十两。奴才说过，奴才这条命，以后跟小主姓。' },
    { s: 'xiaotao', f: 'smirk', t: '那你以后叫“{姓}安子”？' }, { s: 'xiaoan', f: 'think', t: '……听着像一种点心。' },
  ] },
  { s: 'xiaoan', f: 'normal', t: '还有一条小道消息，不收钱：内务府说，最近好几个宫都在丢东西。簪子、帕子、腰牌……' },
  { s: 'os', f: 'shock', t: '腰牌？' },
  { s: 'n', t: '你下意识摸向腰间。原本挂着腰牌的地方，只剩一截剪断的红绳。', shake: 0.3 },
  { s: 'xiaotao', f: 'panic', t: '小、小主！您的腰牌呢？！没有腰牌，百日宴连殿门都进不去啊！' },
  { s: 'os', f: 'think', t: '（红绳是剪断的，不是磨断的。有人在我身上动了剪子，我却一点都没察觉。）' },
  { c: [
    { t: '“去浣衣局，翻那只贴着‘永和’的脏衣筐。”', mem: 'M18', then: [
      { bg: 'laundry', music: 'mystery', cast: [['me', 'normal', 'L'], ['ayun', 'shock', 'R']] },
      { s: 'ayun', f: 'shock', t: '小主？永和宫的筐？那里头全是宁嫔娘娘的……您要找什么，我替您翻，您别脏了手——' },
      { s: 'me', f: 'normal', t: '我自己来。上一世，我就是死在这块木牌子上的。' },
      { s: 'ayun', f: 'think', t: '……上一世？' }, { s: 'me', f: 'sweat', t: '上、上个月！我是说上个月，我梦见过。' },
      { s: 'n', t: '你把手伸进筐底，在一件绣着荷花的中衣里，摸到了一块硬邦邦的木牌。正面刻着你的名字，背面多了一道新划的记号。' },
      { s: 'ayun', f: 'angry', t: '这是王福公公昨天亲手塞进来的！他还给了我一个铜板，说“别多嘴”。……我要把铜板还给他！不，我要扔他脸上！' },
      { set: { tokenOk: true } }, { item: '腰牌' }, add('ayun', 5), add('intel', 1),
      { s: 'os', f: 'smirk', t: '（腰牌塞进脏衣服，送回永和宫，百日宴上交给刺客。这一回，我先把它拿回来了。）' },
    ] },
    { t: '“我自己查。就从这截剪断的红绳查起。”', go: 'c5_search' },
    { t: '“小安子、小桃，帮我找。阿芸那边也问问。”', then: [
      { if: G => (G.flag('anStable') || C(G, 'intel') >= 4) && (C(G, 'ayun') >= 45 || G.flag('ayunStable')), then: [
        { s: 'xiaoan', f: 'smirk', t: '得令！小主放心——偷东西的人，总要把东西藏起来；藏东西的人，总要有人搬；搬东西的人里头，有奴才的牌搭子。' },
        { s: 'n', t: '午后，小安子一路小跑回来，后头跟着气喘吁吁的阿芸。阿芸手里举着一块木牌。' },
        { enter: 'ayun', face: 'smile', pos: 'C' },
        { s: 'ayun', f: 'smile', t: '在永和宫的脏衣筐里！王福公公塞进去的，还给了我一个铜板封口——我把铜板也带来了，算证物！' },
        { s: 'xiaoan', f: 'smile', t: '小主，这就叫“情报网”。您织的。' },
        { set: { tokenOk: true } }, { item: '腰牌' }, add('ayun', 5), add('intel', 1),
      ], else: [
        { s: 'n', t: '小安子跑了一天，阿芸托人捎话说“最近管事盯得紧，不敢乱翻”。腰牌没找着。' },
        { s: 'xiaoan', f: 'sweat', t: '小主，要不……先去内务府补一块？' },
        { s: 'os', f: 'think', t: '（补一块新的倒是不难。可那块旧的，现在在谁手里？）' },
        { set: { tokenLost: true } },
        ...REPORT(),
      ] },
    ] },
    { t: '“一块木牌子而已，去内务府补一块就是。”', then: [
      { s: 'xiaotao', f: 'sweat', t: '小主说得对……就是补牌子要交十文钱。' },
      { s: 'xiaoan', f: 'think', t: '小主，奴才多一句嘴：丢东西不可怕，可怕的是东西去了哪儿。' },
      { s: 'me', f: 'normal', t: '别想那么多。四天之后就是百日宴，我要操心的事比一块木牌子大多了。' },
      { set: { tokenLost: true } },
      ...REPORT(),
    ] },
  ] },
  { go: 'c5_d96rest' },
];
N.c5_d96rest = [G => ({ go: G.flag('movedOut') ? 'c5_d96ra' : 'c5_d96rb' })];
const D96R = [
  { s: 'xiaoan', f: 'think', t: '对了小主，奴才在御膳房听人议论：说您……能掐会算。上回巫蛊案、上上回落水，您都“早有准备”。' },
  { s: 'xiaoan', f: 'smile', t: '您给奴才透个底呗？百日宴，顺不顺利？' },
  { c: [
    { t: '（掐指一算）“明晚有人走水，后天刺客掀桌，大后天……”', danger: '094', fx: { 疑心: 100 }, then: [
      { s: 'xiaoan', f: 'shock', t: '……小、小主？您这不是掐指，您这是在念账本啊！' },
      { s: 'me', f: 'smirk', t: '还有，御膳房的烤鸭会烤糊，玄机子那天会说“有雨”，结果真的下雨。' },
      { s: 'n', t: '第二天，御膳房的烤鸭烤糊了。下午，玄机子说“有雨”，傍晚真的下了雨。' },
      { s: 'n', t: '第三天，钦天监递了折子：“此女能知未来，恐为妖孽，请旨彻查。”' },
      { s: 'os', f: 'panic', t: '（我只是死得比较多！这不叫预言，这叫复习！）' },
      CHK,
    ] },
    { t: '“顺不顺利，要看御膳房的烤鸭烤得怎么样。”', fx: { 名声: 2 }, then: [
      { s: 'xiaoan', f: 'smile', t: '哈！小主这话有学问——奴才记下了，明儿晨报就写：“{位份}{宫名}：百日宴成败，系于一鸭。”' },
      { s: 'xiaotao', f: 'think', t: '……那陆侍卫又要去御膳房门口站着了。' },
    ] },
    { t: '“我又不是神仙。咱们只管把能做的做好。”', fx: { 疑心: -5, 规矩: 2 }, then: [
      { s: 'xiaoan', f: 'normal', t: '……是。小主这么说，奴才反倒放心了。' },
    ] },
  ] },
  { go: 'c5_gift' },
];
const D96RC = [['me', 'normal', 'L'], ['xiaotao', 'smile', 'C'], ['xiaoan', 'smile', 'R']];
N.c5_d96ra = [{ bg: 'room_day', music: 'day', cast: D96RC }].concat(D96R);
N.c5_d96rb = [{ bg: 'yonghe', music: 'day', cast: D96RC }].concat(D96R);
N.c5_d96a = [{ bg: 'room_day', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'smile', 'C']] }].concat(D96);
N.c5_d96b = [{ bg: 'yonghe', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'smile', 'C']] }].concat(D96);

/* 贺礼 · 银两 · 095 */
N.c5_gift = [
  { s: 'xiaotao', f: 'think', t: '还有一桩：百日宴上，各宫都要给太后进贺礼。听说丽昭仪准备了一尊白玉观音，有半人高！' },
  { s: 'xiaoan', f: 'smirk', t: '丽昭仪的观音是借钱买的，利息比观音还高。' },
  { s: 'xiaotao', f: 'sweat', t: '咱们……咱们只有 {银两} 两银子。' },
  { c: [
    { t: '“找王公公借一百两，买最好的翡翠屏风。”（借债）', danger: '095', then: [
      G => { G.run.cnt.silver = (G.run.cnt.silver || 0) - 100 - Math.max(0, G.run.cnt.silver || 0); G.run.flags.debtDay = 96; P.UI.toast('💰 借了一百两，买了屏风——银两 ' + G.run.cnt.silver, 'bad', 2000); },
      { s: 'xiaoan', f: 'panic', t: '小主！王公公的钱是驴打滚——今天一百，五天以后就是“一百”后面再画俩圈！' },
      { s: 'me', f: 'normal', t: '五天以后我要么已经赢了，要么已经死了。哪种都不用还。' },
      { s: 'xiaotao', f: 'cry', t: '小主，您这话说得奴婢后背发凉……' },
      add('trust_hou', 5), { set: { gift: 'screen' } },
    ] },
    { t: '“三十两，买一盒寿桃。”（银两 ≥ 30）', need: G => C(G, 'silver') >= 30, then: [
      add('silver', -30), add('trust_hou', 5), { set: { gift: 'peach' } },
      { s: 'xiaotao', f: 'smile', t: '寿桃好！又体面又能吃——吃不完的，太后说不定赏下来。' },
    ] },
    { t: '“送一盆花。我亲手种的那种。”', then: [
      { s: 'xiaoan', f: 'shock', t: '一盆花？小主，人家送观音，咱们送花？' },
      { s: 'me', f: 'smirk', t: '太后不缺观音。她缺花——我听孟……我听人说的。' },
      { s: 'xiaotao', f: 'think', t: '那奴婢去冷宫跟静太妃讨几株？她那儿什么都长。' },
      { set: { gift: 'flower' } }, { item: '一盆花' },
    ] },
  ] },
  { go: 'c5_d96p' },
];

/* 午后 · 冷宫：请静太妃作证 / 冷宫种田大户 */
N.c5_d96p = [
  { time: '午' },
  { bg: 'lenggong', music: 'day', cast: [['me', 'normal', 'L'], ['jingtaifei', 'normal', 'R', { pose: 'hold', prop: 'cabbage' }]], cat: { pos: 'RR', mood: 'happy' } },
  { s: 'jingtaifei', f: 'smirk', t: '哟，大忙人来了。百日宴还没开，你倒先来我这儿吃席了？' },
  { s: 'me', f: 'smile', t: '太妃，“小宁”最近长得怎么样？' },
  { s: 'jingtaifei', f: 'think', t: '虫是少了，可心还是黑的。我昨天掰开一看——嘿，芯里是空的。' },
  { s: 'jingtaifei', f: 'normal', t: '倒是“小华”，最近不扎手了。你干的吧？' },
  { s: 'os', f: 'smile', t: '（巫蛊案之后，贵妃确实没那么扎手了。这位太妃不出冷宫，却什么都知道。）' },
  { s: 'me', f: 'normal', t: '太妃，百日宴那天，我想请您进殿。当着皇上和满朝文武，把三年前看见的事说出来。' },
  { s: 'jingtaifei', f: 'think', t: '……二十年了。我进冷宫那天发过誓，这辈子再也不踏进那座殿。' },
  { s: 'jingtaifei', f: 'normal', t: '那殿里的人，笑起来比哭还吓人。' },
  { c: [
    { t: '“您不是为了他们去。是为了婉娘。”', then: [
      { s: 'jingtaifei', f: 'cry', t: '……婉娘。你这丫头，专挑软的地方戳。' },
      { s: 'jingtaifei', f: 'smile', t: '行。老婆子去。可有一条：我要带着我的锄头。' },
      { s: 'me', f: 'shock', t: '……锄头？' },
      { s: 'jingtaifei', f: 'smirk', t: '谁敢拦我，我就当他是虫。' },
      add('jing', 15),
    ] },
    { t: '“那这样：您把证词写下来，我替您念。”', then: [
      { s: 'jingtaifei', f: 'think', t: '纸上的东西，人家说是你写的，你怎么办？……罢了，到时候看我心情。' },
      add('jing', 5),
    ] },
    { t: '（摆烂）“太妃，要不……我把证据全交给太后和皇上，我来陪您种菜？”', need: G => EV(G) >= 3 && (G.flag('houAlly') || G.flag('empAlly')) && C(G, 'jing') >= 50, then: [
      { s: 'jingtaifei', f: 'shock', t: '……你说什么？' },
      { s: 'me', f: 'normal', t: '我认真的。证据我攒齐了，太后和皇上都靠得住。剩下的事，交给有本事的人去办。' },
      { s: 'me', f: 'smile', t: '我死了九十多天……不是，我忙了九十多天，累了。我想种白菜。' },
      { s: 'jingtaifei', f: 'smirk', t: '……哈！冷宫一百年没人主动进来过。你是头一个。' },
      { go: 'c5_farm' },
    ] },
  ] },
  { s: 'jingtaifei', f: 'normal', t: '回去吧。带两棵白菜，晚上炖了。宫里的东西别乱吃，我的白菜是干净的。' },
  { item: '白菜' },
  { go: 'c5_d97' },
];
N.c5_farm = [
  { bg: 'cining', music: 'mystery', cast: [['me', 'normal', 'L'], ['taihou', 'think', 'R', { pose: 'beads', prop: 'beads' }]] },
  { s: 'n', t: '当天傍晚，你把五张证据卡用油纸包好，送进了慈宁宫。' },
  { s: 'taihou', f: 'shock', t: '你要去冷宫？自己去？' },
  { s: 'me', f: 'smile', t: '姐，你当年不也是自己选的吗？我选白菜。' },
  { s: 'taihou', f: 'think', t: '……哀家活了这么多年，头一回见有人把“摆烂”说得这么理直气壮。' },
  { s: 'taihou', f: 'smile', t: '去吧。剩下的，哀家和皇帝来。' },
  { bg: 'lenggong', music: 'happy', cast: [['me', 'smile', 'L', { pose: 'hold', prop: 'cabbage' }], ['jingtaifei', 'smile', 'R']], cat: { pos: 'C', mood: 'happy' } },
  { s: 'n', t: '百日宴那天，你没去。你在冷宫的菜地里，给新种的萝卜起名字。' },
  { s: 'me', f: 'smile', t: '这棵叫“小温”，这棵叫“小尚书”。长得最歪的那棵叫“王福”。' },
  { s: 'jingtaifei', f: 'smirk', t: '名字起得好。到了秋天，一起腌了。' },
  { s: 'n', t: '傍晚，消息传进冷宫：温尚书当殿认罪，宁嫔被押往宗人府。{姓}家的冤案，翻了。' },
  { s: 'n', t: '又过了一个月，冷宫的白菜远近闻名。皇上下了朝就来蹭饭，太后带着叶子牌来，一坐就是一下午。' },
  { enter: 'emperor', face: 'smile', pos: 'RR' },
  { s: 'emperor', f: 'smile', t: '……朕说一句：冷宫的白菜，比御膳房的好吃。' },
  { s: 'jingtaifei', f: 'smirk', t: '那是。御膳房的白菜，没人跟它说过话。' },
  { ending: 'E_farm' },
];

/* ---------------- 第 97 天 · 慈宁宫：四十年前的那个人 ---------------- */
N.c5_d97 = [
  { day: 97, time: '晨', label: '第97天 · 四十年前', ch: 'ch5' },
  { if: owesDebt, then: [
    { bg: 'garden', music: 'danger', cast: [['me', 'sweat', 'L'], ['taijian', 'smirk', 'R']] },
    { s: 'n', t: '去慈宁宫的路上，一个面生的小太监拦住了你。' },
    { s: 'taijian', f: 'smirk', t: '{位份}吉祥。王公公让奴才来问一声：那一百两，打算什么时候还呀？' },
    { s: 'taijian', f: 'normal', t: '王公公说了：今天还，一百二；明天还，一百五；百日宴那天还——那就不是银子的事了。' },
    { s: 'os', f: 'sweat', t: '（驴打滚。小安子没骗我。）' },
    { s: 'me', f: 'normal', t: '回去告诉王公公，银子少不了他的。' },
    { s: 'n', t: '💡 欠债（银两为负）连续五天会出事。太后的赏、奶茶铺……想办法在百日宴前还上。' },
  ] },
  { bg: 'cining', music: 'mystery', cast: [['me', 'normal', 'L'], ['taihou', 'smile', 'R', { pose: 'beads', prop: 'beads' }]] },
  { if: G => !G.flag('houAlly'), then: [
    { s: 'taihou', f: 'normal', t: '来了？坐。百日宴的座次还没排，哀家眼睛花了，你替哀家看看。' },
    { s: 'os', f: 'think', t: '（太后对我客气，却总隔着一层。她还没认我这个“老乡”。）' },
    { s: 'n', t: '💡 太后还没跟你相认（第四章对上暗号、太后信任 ≥ 60 才会相认）。她的故事，要等下一世再听了。' },
  ], else: [
    { s: 'taihou', f: 'smile', t: '老乡来了？坐，喝口茶——放心，这壶是哀家亲手泡的，没加别的东西。' },
    { s: 'me', f: 'smirk', t: '姐，您这句“没加别的东西”，在这个宫里比加了东西还吓人。' },
    { s: 'taihou', f: 'smile', t: '哈哈，学精了。' },
    { s: 'taihou', f: 'think', t: '丫头，你一直没问，哀家也一直没说。今天，哀家给你讲个故事。' },
    { s: 'taihou', f: 'normal', t: '四十年前——按“那边”算，是 2008 年。北京开奥运那年。' },
    { s: 'taihou', f: 'smile', t: '哀家那会儿叫周小芸，大三，在 KTV 唱《死了都要爱》，唱到最高那个音——' },
    { s: 'me', f: 'shock', t: '……别说了，我大概知道发生了什么。' },
    { s: 'taihou', f: 'smirk', t: '对。没上去。一口气没上去，人就上去了。' },
    { s: 'os', f: 'sweat', t: '（一个被珍珠呛死，一个被高音憋死。我们老乡，死得都挺有特色。）' },
    { s: 'taihou', f: 'normal', t: '醒过来，就在选秀的马车上。没有系统，没有攻略，什么都没有。只有一面镜子，和一个熬汤的老太婆。' },
    { s: 'me', f: 'think', t: '孟婆。' },
    { s: 'taihou', f: 'smile', t: '你也认识她了？她那时候还没那么老，汤也没那么难喝。哀家在她那儿，一共死了三百一十二回。' },
    { s: 'me', f: 'shock', t: '三百一十二？！我才死了 {死} 回，就觉得自己是奈何桥 VIP 了。' },
    { s: 'taihou', f: 'smirk', t: '年轻人，路还长着呢。' },
    { s: 'taihou', f: 'think', t: '后来，哀家也熬到了第一百天。镜子合上的时候，哀家可以回去。' },
    { s: 'me', f: 'normal', t: '……您没回去。' },
    { s: 'taihou', f: 'normal', t: '没回去。那边没人等我——爸妈走得早，室友欠我两百块，KTV 的账还是我结的。' },
    { s: 'taihou', f: 'smile', t: '这边呢，有一个刚出生的小皇子，夜里哭，只有听见“两只老虎”才肯睡。还有一个陪嫁的小丫头，叫婉娘，天天给我梳头，梳得特别疼。' },
    { s: 'me', f: 'shock', t: '婉娘……原主的娘？！' },
    { s: 'taihou', f: 'think', t: '嗯。哀家把镜子一掰两半：一半交给钦天监锁着，一半给婉娘做了嫁妆。哀家想，万一哪天，又有一个倒霉孩子掉进来，总得有条回家的路。' },
    { s: 'taihou', f: 'cry', t: '没想到，掉进来的，是婉娘的女儿的身子。……哀家没护住婉娘一家。这是哀家欠的。' },
    { s: 'me', f: 'cry', t: '姐……' },
    { s: 'taihou', f: 'smile', t: '哭什么，哀家又没死。哦对了，哀家走的时候，还欠那老太婆三盆花。' },
    { s: 'me', f: 'shock', t: '欠孟婆三盆花？！' },
    { s: 'taihou', f: 'smirk', t: '她在奈何桥上种不活花，馋了几百年。哀家答应她，回来以后托梦送她三盆。……结果哀家不会托梦。' },
    { if: G => G.flag('gift') === 'flower', then: [
      { s: 'me', f: 'smile', t: '那……百日宴的贺礼，我正好准备了一盆花。' },
      { s: 'taihou', f: 'star', t: '……！好丫头！就差两盆了！' }, add('trust_hou', 10),
    ] },
    { if: G => G.mem('M24'), then: [
      { s: 'me', f: 'smirk', t: '孟婆让我替她催债来着。原话是：“你见了她，替我催催。”' },
      { s: 'taihou', f: 'sweat', t: '……这老太婆，四十年了还记着。' },
    ] },
    { s: 'taihou', f: 'normal', t: '好了，故事讲完了。说正事——百日宴那天夜里，两半镜子会在观星台合上。你到时候怎么选，哀家不拦你。' },
    { s: 'taihou', f: 'think', t: '但在那之前，你得先活过百日宴。' },
  ] },
  { s: 'taihou', f: 'normal', t: '座次图在这儿。主桌两边六个位子：皇后、贵妃、宁嫔、静太妃、丽昭仪，还有你。' },
  { s: 'taihou', f: 'smirk', t: '排得好，明天大家笑着吃饭；排不好，明天有人掀桌——字面意思的那种。' },
  { game: 'zuoci', gtitle: '排座次' },
  G => { const r = G.flag('game_zuoci') || {}; G.run.flags.seatOk = !!r.ok; },
  { if: G => G.flag('seatOk'), then: [
    { s: 'taihou', f: 'smile', t: '不错。宁嫔在门口，陆峥抬眼就能看见；你在她对面，一举一动都盯得住。' },
    { s: 'taihou', f: 'normal', t: '这是赏你的。别乱花——尤其别借给小安子推牌九。' },
    add('silver', 50), { fx: { 规矩: 5 } },
  ], else: [
    { s: 'taihou', f: 'sweat', t: '……罢了，哀家自己改了两个位子。明天，皇后和贵妃怕是都要甩脸子了。' },
    add('hh', 20), add('kill', 20), add('ning', 10), CHK,
  ] },
  { c: [
    { t: '（自作聪明）“不如把皇后、贵妃、宁嫔排在一桌，让她们冰释前嫌！”', danger: '096', then: [
      { s: 'taihou', f: 'shock', t: '……你认真的？' },
      { s: 'me', f: 'smile', t: '认真的！大家坐一桌，喝一壶，说开了就好了。我们那边叫“团建”。' },
      { s: 'taihou', f: 'sweat', t: '丫头，你们那边的团建，是不是也死过人？' },
      { s: 'n', t: '座次图传了出去。当天下午，坤宁宫摔了一套茶具，长春宫折了一把扇子，永和宫……永和宫什么动静都没有。' },
      { s: 'os', f: 'panic', t: '（永和宫没有动静，才是最大的动静。）' },
      add('hh', 60), add('kill', 60), add('ning', 30),
      CHK,
      { s: 'n', t: '还好，三位娘娘里总有一位没那么恨你。这场团建，暂时没出人命。' },
    ] },
    { t: '“就照这么排。谁也不多，谁也不少。”', fx: { 规矩: 2 } },
  ] },
  { go: 'c5_d97p' },
];
/* 午后 · 御花园：谣言 · 093；查漏补缺 */
N.c5_d97p = [
  { time: '午' },
  { if: G => !G.flag('tokenOk'), then: [
    { bg: 'courtyard', music: 'mystery', cast: [['me', 'normal', 'L'], ['xiaotao', 'sweat', 'R']] },
    { s: 'xiaotao', f: 'sweat', t: '小主……奴婢昨晚做了个梦，梦见您那块旧腰牌长了腿，自己跑去了百日宴，还坐在了主桌上。' },
    { s: 'me', f: 'smirk', t: '它倒是比我会挑位子。' },
    { s: 'xiaotao', f: 'think', t: '奴婢是说真的！旧腰牌上刻着您的名字呢。万一被坏人捡了去……' },
    { if: G => G.flag('tokenReported'), then: [
      { s: 'me', f: 'normal', t: '放心。内务府的册子上白纸黑字写着：第九十六天，丙字第七号，旧牌作废。谁拿着它，谁说不清。' },
      { s: 'xiaotao', f: 'smile', t: '……原来那两页纸是干这个用的！奴婢以后丢鞋也写两页！' },
    ], else: [
      { s: 'os', f: 'think', t: '（小桃说得对。一块刻着我名字的木牌，丢在一个想要我命的宫里。）' },
      { c: [
        { t: '“走，现在就去内务府，补报失。”', then: [
          { s: 'n', t: '内务府的小太监抬起眼皮：“晚报一天，罚两文。”你写了两页纸，按了手印。' },
          { s: 'taijian', name: '内务府太监', t: '登记在册：第九十七天补报，丙字第九号，旧牌作废。……小主，您这字写得跟案卷似的。' },
          { set: { tokenReported: true } },
          { s: 'xiaotao', f: 'smile', t: '这下踏实了！' },
        ] },
        { t: '“一块木牌子而已，别自己吓自己。”', danger: '084', then: [
          { s: 'xiaotao', f: 'sweat', t: '……哦。（小声）可奴婢还是觉得它会跑去主桌。' },
        ] },
      ] },
    ] },
  ] },
  { bg: 'garden', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'sweat', 'LL']] },
  { s: 'n', t: '从慈宁宫出来，御花园的假山后头，传来一阵嘀嘀咕咕。' },
  { enter: 'lizhaoyi', face: 'smirk', pos: 'R' },
  { s: 'lizhaoyi', f: 'smirk', t: '……听说了吗？{宫名}是个扫把星。她进宫这一百天，宫里死了多少人？落水的、中毒的、走水的……' },
  { s: 'lizhaoyi', f: 'smirk', t: '最邪门的是，每回出事，她都“刚好”不在场。你说，这不是妖女是什么？' },
  { s: 'xiaotao', f: 'angry', t: '（小声）小主！她胡说！死的明明都是您自己！' },
  { s: 'me', f: 'sweat', t: '……小桃，这话你也别往外说。' },
  { fx: { 名声: -25 } },
  { s: 'os', f: 'think', t: '（谣言是永和宫放的。百日宴前一天，先把我的名声搞臭——到时候我说什么，都像是在“诬告”。）' },
  { c: [
    { t: '“谁说我心情不好？”——当场跳一段科目三，证明我精神状态很稳定', danger: '093', fx: { 名声: -100 }, then: [
      { s: 'n', t: '你走到假山前面，双手一摆，左脚一勾，右脚一踢——' },
      { s: 'me', f: 'star', t: '（一边扭一边唱）“……一步两步，一步两步……”', jump: true },
      { s: 'lizhaoyi', f: 'shock', t: '……她、她这是在……跳大神？！' },
      { s: 'n', t: '路过的小太监手里的扫帚掉了。巡逻的侍卫停下了脚步。桂嬷嬷从远处看了一眼，扶着墙走了。' },
      { s: 'n', t: '当天晚上，“{宫名}在御花园跳大神”的消息传遍了六宫。“妖女”的谣言，被坐实成了“疯妖女”。' },
      CHK,
    ] },
    { t: '“小安子，放一条更大的八卦，盖过去。”（心机）', then: [
      scheme,
      { s: 'n', t: '傍晚，宫里开始流传一条新消息：宁嫔娘娘夜里梦游，抱着冷宫的白菜啃，边啃边哭“小宁啊小宁”。' },
      { s: 'xiaotao', f: 'shock', t: '小主，这……这是真的吗？' }, { s: 'me', f: 'smirk', t: '谁知道呢。反正现在没人记得我是不是扫把星了。' },
      { fx: { 名声: 15 } }, add('ning', 10),
      { s: 'os', f: 'think', t: '（……刚才那一下，我好像有点像她。）' },
    ] },
    { t: '（不理她）“小桃，回去。今天早点睡。”', fx: { 健康: 5 }, then: [
      { s: 'xiaotao', f: 'angry', t: '可是小主——' },
      { s: 'me', f: 'normal', t: '谣言这种东西，你越扑，它越旺。明天在大殿上，真相会替我说话。' },
      { s: 'xiaotao', f: 'think', t: '……小主说话越来越像太后了。' },
    ] },
  ] },
  { go: 'c5_fill97' },
];
function fillNode(day, next) {
  return [
    { if: G => missing(G).length === 0, then: [
      { s: 'n', t: '📜 五张证据卡都在袖子里了。今天不用再跑了。' },
    ], go: next },
    { s: 'xiaotao', f: 'think', t: '小主，证据卡还差几张。趁着还有空，再去跑一趟？' },
    { c: [
      { t: '去冷宫，求静太妃把证词写下来', need: G => missing(G).includes('jing'), then: [
        { bg: 'lenggong', music: 'mystery', cast: [['me', 'normal', 'L'], ['jingtaifei', 'normal', 'R']] },
        { s: 'jingtaifei', f: 'smirk', t: '又来了？行行行，看在你浇了这么多回水的份上。' },
        { s: 'n', t: '她从“小宁”底下挖出一个油纸包——三年前写好的供状，按着鲜红的手印。' },
        ...card('静太妃证词', '冷宫'), add('jing', 10),
      ] },
      { t: '去浣衣局，找阿芸抄经书箱里的账', need: G => missing(G).includes('ledger'), then: [
        { bg: 'laundry', music: 'day', cast: [['me', 'normal', 'L'], ['ayun', 'smile', 'R']] },
        { s: 'ayun', f: 'smile', t: '小主！经书箱又来了，我连番文都认得十个了！这个弯弯绕绕的是“钱”，这个像蚯蚓的是“很多钱”！' },
        ...card('西域账本', '浣衣局'), add('ayun', 10),
      ] },
      { t: '去太医院，求温太医带你进卷宗库', need: G => missing(G).includes('dossier'), then: [
        { bg: 'taiyiyuan', music: 'day', cast: [['me', 'normal', 'L'], ['wen', 'sweat', 'R']] },
        { s: 'wen', f: 'sweat', t: '院判大人去百日宴试菜了！钥匙……钥匙在他腰带上……腰带在他夫人那儿……下官这就去偷——借！' },
        ...card('旧案卷宗', '太医院'), add('trust_wen', 5),
      ] },
      { t: '去内务府，查云纹软烟罗的赏赐册', need: G => missing(G).includes('cloth'), then: [
        { bg: 'laundry', music: 'mystery', cast: [['me', 'normal', 'L'], ['ayun', 'think', 'R']] },
        { s: 'ayun', f: 'think', t: '云纹软烟罗？今年只赏了永和宫一匹。我们浣衣局还收过一块剪剩的边角——我留着当抹布了，您要吗？' },
        ...card('永和宫布料', '内务府赏赐册'),
      ] },
      { t: '去找翠缕，请她百日宴上作证', need: G => missing(G).includes('cuilv'), then: [
        { bg: 'changchun', music: 'mystery', cast: [['me', 'normal', 'L'], ['cuilv', 'cry', 'R']] },
        { s: 'cuilv', f: 'cry', t: '奴婢……奴婢怕。可是奴婢更怕，以后每天晚上都梦见那个娃娃。' },
        { s: 'cuilv', f: 'normal', t: '小主，奴婢去。' },
        ...card('翠缕证词', '长春宫'),
      ] },
      { t: '算了，今天先歇着', then: [{ s: 'xiaotao', f: 'sweat', t: '……那明天一定要去哦！' }] },
    ] },
    { go: next },
  ];
}
N.c5_fill97 = fillNode(97, 'c5_d98');

/* ---------------- 第 98 天 · 证人、酒、和一面镜子 ---------------- */
N.c5_d98 = [
  { day: 98, time: '晨', label: '第98天 · 证人', ch: 'ch5' },
  { bg: 'courtyard', music: 'day', cast: [['me', 'normal', 'L'], ['luzheng', 'normal', 'R', { pose: 'spear', prop: 'spear' }]] },
  { s: 'n', t: '宫道上，陆峥正带着一队侍卫换岗。看见你，他停下脚步，抱了抱拳。' },
  { s: 'luzheng', f: 'normal', t: '{位份}。' },
  { s: 'me', f: 'smile', t: '陆侍卫，听说“大将军”的表哥，没保住？' },
  { s: 'luzheng', f: 'sweat', t: '……职责所在。御膳房的事，卑职管不了。' },
  { s: 'luzheng', f: 'think', t: '卑职给它上了一炷香。' },
  { s: 'os', f: 'smile', t: '（给烤鸭上香。这个人，比我想的还要认真。）' },
  { if: G => !G.flag('tokenOk'), then: [
    { s: 'luzheng', f: 'think', t: '……还有一事。听说{位份}的腰牌丢了。' },
    { s: 'luzheng', f: 'normal', t: '百日宴那天，殿门查一遍腰牌，殿里还要再查一遍。一块刻着名字、却不在主人身上的腰牌——卑职当差八年，没见它干过好事。' },
    { if: G => G.flag('tokenReported'), then: [
      { s: 'me', f: 'normal', t: '我在内务府报过失了，登记在册。' },
      { s: 'luzheng', f: 'normal', t: '好。那册子，卑职记下了。' },
    ], else: [
      { s: 'luzheng', f: 'think', t: '内务府那边，报过失没有？……没有的话，卑职多一句嘴：记性好的人，比册子靠得住。{位份}身边，最好有几个记得这事的人。' },
      { s: 'os', f: 'think', t: '（陆峥的意思是：真出了事，得有人肯站出来替我说话。）' },
    ] },
  ] },
  { if: G => has(G, '御前密令'), then: [
    { s: 'n', t: '你从袖子里取出那块乌木令牌。陆峥的眼神一下子变了，单膝跪地。' },
    { s: 'luzheng', f: 'normal', t: '见令如见君。{位份}请吩咐。' },
    { c: [
      { t: '“百日宴那天，护着静太妃和翠缕进殿。谁拦，就拦谁。”', then: [
        { s: 'luzheng', f: 'normal', t: '遵命。卑职亲自去冷宫接人。' },
        { s: 'luzheng', f: 'think', t: '……静太妃说要带锄头。准吗？' },
        { s: 'me', f: 'smirk', t: '准。那是她的兵器。' },
        { set: { jingSafe: true, cuilvSafe: true } }, add('trust_lu', 15),
      ] },
      { t: '“我自己就够了。你守好皇上。”', then: [
        { s: 'luzheng', f: 'think', t: '……{位份}，恕卑职多嘴：一个人，不够。' },
        { s: 'luzheng', f: 'normal', t: '卑职会多派两个人去冷宫。不算违令——算卑职顺路。' },
        { set: { jingSafe: true } }, add('trust_lu', 10),
      ] },
    ] },
  ], else: [
    { s: 'me', f: 'normal', t: '陆侍卫，我有个不情之请：百日宴那天，能不能派人护着冷宫的静太妃进殿？她是证人。' },
    { if: G => C(G, 'trust_lu') >= 40, then: [
      { s: 'luzheng', f: 'think', t: '……没有令牌，卑职不能调人。' },
      { s: 'luzheng', f: 'normal', t: '但卑职那天休沐。休沐的人去冷宫看看老人家，不犯规矩。' },
      { set: { jingSafe: true } }, add('trust_lu', 10),
    ], else: [
      { s: 'luzheng', f: 'normal', t: '职责所在，卑职只听皇上的令。{位份}请回。' },
      { s: 'os', f: 'sweat', t: '（还是那个认死理的人。他不够信我。）' },
    ] },
  ] },
  { s: 'luzheng', f: 'think', t: '还有一事：温尚书那车“贺礼”，卑职查过了。油布底下，是空箱子。' },
  { s: 'me', f: 'shock', t: '空的？' },
  { s: 'luzheng', f: 'normal', t: '箱子是空的，抬箱子的人不是。八个人，八双手，卑职一个都不认识。' },
  { s: 'luzheng', f: 'normal', t: '百日宴那天，卑职会站在离皇上最近的地方。{位份}——你也小心。' },
  { s: 'me', f: 'smile', t: '放心。等这事了了，我请你喝奶茶。' },
  { s: 'luzheng', f: 'sweat', t: '……卑职不喝甜的。' },
  { s: 'me', f: 'smirk', t: '那就少糖。' },
  { s: 'luzheng', f: 'think', t: '…………少糖，可以。' },
  { go: 'c5_d98w' },
];

/* 太医院：鸳鸯壶 · 悬壶 */
N.c5_d98w = [
  { bg: 'taiyiyuan', music: 'mystery', cast: [['me', 'normal', 'L'], ['wen', 'normal', 'R', { pose: 'hold', prop: 'medpot' }]] },
  { s: 'wen', f: 'sweat', t: '{位份}！下官正要找您！下官先声明一件事——' },
  { s: 'wen', f: 'panic', t: '下官跟温尚书，不是一家人！同姓不同命！下官祖上是卖烧饼的！' },
  { s: 'me', f: 'sweat', t: '……我没问啊。' },
  { s: 'wen', f: 'cry', t: '最近人人看下官的眼神都怪怪的。连院判大人都问下官：“你舅舅最近好吗？”下官没有舅舅！' },
  { s: 'wen', f: 'think', t: '说正事。百日宴的酒，是御膳房统一送的。可每一桌的酒壶，是各宫自己带的。' },
  { s: 'wen', f: 'normal', t: '下官前天给永和宫看诊，在宁嫔的妆台上看见一把青瓷壶。壶肚子里有一道隔板——一边是酒，一边是“料”。' },
  { s: 'wen', f: 'normal', t: '按住壶盖上的珠子，倒出来的就是“料”那一边。这叫鸳鸯壶。' },
  { s: 'me', f: 'think', t: '……所以，同一把壶，她自己喝了没事，倒给我就有事。' },
  { s: 'wen', f: 'smile', t: '{位份}聪明。倒出来的那一杯，颜色发暗、冒细泡、有股甜腻的怪味——下官写在这儿了。' },
  { set: { wineKnown: true } }, add('trust_wen', 20),
  { s: 'os', f: 'normal', t: '（鸳鸯壶。银针验不出来，靠眼睛、鼻子，还有这位“祖上卖烧饼”的温太医。）' },
  { c: [
    { t: '“温太医，等这事过了，我们一起写一本《后宫常见毒物图谱》吧。”', need: G => G.mem('M03') || G.mem('M04') || G.mem('M16'), then: [
      { s: 'wen', f: 'shock', t: '……图、图谱？！' },
      { s: 'me', f: 'smile', t: '我死……我是说，我见过的毒，够写一本书了。宁嫔的汤有怪味，银针只验砒霜，煎药会被调包——这些都该写下来，让后来的人别再倒下。' },
      { s: 'wen', f: 'cry', t: '下官……下官学医十年，第一次有人跟下官说“一起写书”。' },
      { s: 'wen', f: 'smile', t: '下官这就去买纸！买最好的纸！' },
      { set: { herbBook: true } }, add('trust_wen', 20),
    ] },
    { t: '“谢谢你。百日宴上，你也要小心。”', then: [{ s: 'wen', f: 'smile', t: '下官会躲在柱子后面的。下官躲柱子，是专业的。' }] },
  ] },
  { if: owesDebt, then: [{ go: 'c5_debt98' }] },
  { go: 'c5_fill98' },
];
N.c5_debt98 = [
  { bg: 'kitchen', music: 'happy', cast: [['me', 'normal', 'L'], ['xiaoan', 'smile', 'R']] },
  { s: 'xiaoan', f: 'smile', t: '小主！听说您欠王公公的钱？别慌！御膳房后头那间奶茶铺，今天又开张了——您当初教的那几样，现在一杯卖三十文！' },
  { s: 'me', f: 'smirk', t: '……我的奶茶铺，还在？' },
  { s: 'xiaoan', f: 'smile', t: '一直在！只是没人会做“珍珠”，大家都拿汤圆凑合。' },
  { c: [
    { t: '“撸袖子，开工！”（奶茶铺，挣钱还债）', then: [
      { game: 'milktea', customers: 4, price: 30, gtitle: '奶茶铺 · 还债' },
      G => { const r = G.flag('game_milktea') || {}; const got = Math.max(60, r.earned || 0); G.run.cnt.silver = (G.run.cnt.silver || 0) + got; P.UI.toast('💰 挣了 ' + got + ' 两（现在 ' + G.run.cnt.silver + '）', 'good', 2000); },
      { if: G => C(G, 'silver') >= 0, then: [
        { s: 'xiaoan', f: 'smile', t: '够了够了！奴才这就给王公公送去——连本带利，一个铜板都不多给他！' },
        G => { delete G.run.flags.debtDay; P.UI.toast('✅ 债还清了', 'good', 1600); },
      ], else: [{ s: 'xiaoan', f: 'sweat', t: '还差一点……小主，明天想想别的办法？' }] },
    ] },
    { t: '“太后的玉镯，拿去当了。”', need: G => has(G, '太后的回礼·玉镯'), then: [
      { item: '太后的回礼·玉镯', n: -1 }, G => { G.run.cnt.silver = Math.max(0, G.run.cnt.silver) + 20; delete G.run.flags.debtDay; P.UI.toast('✅ 债还清了', 'good', 1600); },
      { s: 'xiaoan', f: 'cry', t: '小主……您又拿镯子救人了。这回救的是您自己。' },
    ] },
    { t: '“再说吧。”', danger: '095' },
  ] },
  { go: 'c5_fill98' },
];
N.c5_fill98 = fillNode(98, 'c5_d98n');

/* 夜 · 通宵 · 心机 · 照影镜 */
N.c5_d98n = [
  { time: '夜' },
  G => ({ go: G.flag('movedOut') ? 'c5_d98na' : 'c5_d98nb' }),
];
const D98N = [
  { s: 'n', t: '夜深了。桌上摊着五张证据卡，烛火一跳一跳的。' },
  { s: 'xiaotao', f: 'sleepy', t: '小主……都三更了，您歇会儿吧。证据卡又不会自己长腿跑了。' },
  { s: 'me', f: 'think', t: '我再看一遍。万一明天有哪句话没接上——' },
  { c: [
    { t: '“熬！今晚、明晚、后晚，我都不睡了！”', danger: '092', fx: { 健康: -100 }, then: [
      { s: 'n', t: '第一夜，你把五张证据卡背得滚瓜烂熟。' },
      { s: 'n', t: '第二夜，你开始给每张证据卡起外号。“卷宗”叫“老卷”，“账本”叫“小账”。' },
      { s: 'n', t: '第三夜，你跟“小账”吵了一架。' },
      { s: 'xiaotao', f: 'panic', t: '小主！小主您醒醒！您的脸怎么是绿的！' },
      { s: 'os', f: 'dead', t: '（现代病带到古代：连熬三个通宵……福报，来了。）' },
      CHK,
    ] },
    { t: '“好，再看最后一遍，就睡。”', fx: { 健康: 5, 警觉: 3 }, then: [
      { s: 'xiaotao', f: 'smile', t: '奴婢给您热碗酒酿圆子！吃了就睡！' },
    ] },
    { t: '（心机）“小桃，去御膳房打点一下，把宁嫔那桌的酒换成醋。”', then: [
      scheme,
      { s: 'xiaotao', f: 'shock', t: '……醋？小主，您是要……酸死她？' },
      { s: 'me', f: 'smirk', t: '要她当众出丑。一个嫔位，一口醋喷在百日宴上——够她丢一辈子的人。' },
      { s: 'xiaotao', f: 'sweat', t: '……是。奴婢去。' },
      { s: 'os', f: 'think', t: '（小桃走的时候，回头看了我一眼。那眼神，像在看一个不认识的人。）' },
      add('trust_tao', -10),
    ] },
  ] },
  { s: 'n', t: '小桃退下后，屋里只剩下你一个人。箱笼底下，那半面铜镜忽然亮了一下。' },
  { s: 'n', t: '镜子里没有人。只有星星，一颗一颗地在镜面上转。' },
  { s: 'os', f: 'think', t: '（一百天。死了 {死} 回。明天，就是最后一天。）' },
  { s: 'os', f: 'angry', t: '（凭什么是我？凭什么我要一遍一遍地死，一遍一遍地重来？）' },
  { c: [
    { t: '“都怪你！”——抓起镜子，往地上狠狠一摔', danger: '089', then: [
      { s: 'n', t: '“啪”——' },
      { flash: '#fff' }, { s: 'n', t: '半面照影镜碎成了一地星星。屋里一下子黑了。', shake: 0.5 },
      { s: 'os', f: 'shock', t: '（……好安静。）' },
      { s: 'n', t: '你低头看自己的手。手是透明的。' },
      { s: 'n', t: '循环断了。可真相还没揭开，{姓}家的冤案还压在卷宗底下。你成了一缕没有来处、也没有去处的魂。' },
      { s: 'n', t: '奈何桥那头，孟婆举着汤勺，远远地叹了口气：“……太早了，孩子。我这儿不收这种的。”' },
    ], death: '089' },
    { t: '（摸了摸镜面）“……明天见。”', then: [
      { s: 'n', t: '镜面上的星星停了一下，像是在眨眼。' },
      { if: G => G.mem('M23'), then: [
        { enter: 'yuanzhu', face: 'smile', pos: 'R' },
        { s: 'yuanzhu', f: 'smile', t: '你刚才是不是想摔我？' },
        { s: 'me', f: 'sweat', t: '……想了一下。就一下。' },
        { s: 'yuanzhu', f: 'smirk', t: '我也想过。三年前，在柜子里。' },
        { s: 'yuanzhu', f: 'normal', t: '明天，别怕。我爹说过：“理直，气就壮。”你手里的理，比谁都直。' },
        { s: 'me', f: 'smile', t: '……你爹说得对。' },
        { exit: 'yuanzhu' },
      ] },
      { fx: { 健康: 5 } },
    ] },
  ] },
  { go: 'c5_d99' },
];
N.c5_d98na = [{ bg: 'room_night', music: 'night', cast: [['me', 'think', 'L'], ['xiaotao', 'sleepy', 'R']] }].concat(D98N);
N.c5_d98nb = [{ bg: 'yonghe_night', music: 'night', cast: [['me', 'think', 'L'], ['xiaotao', 'sleepy', 'R']] }].concat(D98N);

/* ---------------- 第 99 天 · 天干物燥 ---------------- */
N.c5_d99 = [
  { day: 99, time: '晨', label: '第99天 · 天干物燥', ch: 'ch5' },
  G => ({ go: G.flag('movedOut') ? 'c5_d99a' : 'c5_d99b' }),
];
const D99 = [
  { s: 'n', t: '百日宴前一天。整个皇宫像一张拉满的弓。' },
  { s: 'xiaotao', f: 'smile', t: '小主，明天的衣裳奴婢熨好了！还在袖子里缝了一个小口袋，正好装五张证据卡——还能再塞一块桂花糕。' },
  { s: 'me', f: 'smile', t: '桂花糕就算了。上回我递桂花糕，差点被当成贿赂皇上。' },
  { s: 'xiaotao', f: 'think', t: '可是皇上收了呀。' },
  { s: 'me', f: 'smirk', t: '……所以才是“差点”。' },
  { enter: 'xiaoan', face: 'sweat', pos: 'R' },
  { s: 'xiaoan', f: 'sweat', t: '小主，今儿没有晨报。就一句话：永和宫的柴房，昨夜进了三车干柴，还有两桶灯油。' },
  { s: 'xiaoan', f: 'think', t: '王福说是“百日宴放烟花用的”。可烟花用不着灯油。' },
  { s: 'os', f: 'think', t: '（“天干物燥，小心火烛。”宁嫔连台词都提前念过了。）' },
  { s: 'n', t: '💡 今晚可能会出事。提前做点准备吧。' },
  { c: [
    { t: '“子时三刻，西边起风，先烧后窗——备好水缸和湿帕子，走东门。”', mem: 'M19', then: [
      { s: 'xiaoan', f: 'shock', t: '……小主，您连时辰都知道？' },
      { s: 'me', f: 'normal', t: '我上辈子……上个月梦见过。别问了，照做。' },
      { s: 'n', t: '你们在后窗下摆了三口水缸，每人发了一块湿帕子，东门的门闩提前卸了。' },
      { set: { fireReady: true } }, add('intel', 1),
    ] },
    { t: '“小桃，今晚你去慈宁宫给太后送花，就在那儿歇着，别回来。”', then: [
      { s: 'xiaotao', f: 'shock', t: '小主不要奴婢了？！' },
      { s: 'me', f: 'smile', t: '傻丫头。是我舍不得你。太后那儿有好吃的，你替我多吃两块。' },
      { s: 'xiaotao', f: 'cry', t: '……那、那奴婢多吃三块。' },
      { set: { taoSafe: true } }, add('trust_tao', 5),
    ] },
    { t: '（心机）“趁他们点火，把一包醉心花塞进宁嫔的妆奁。栽赃，就要栽得结实。”', then: [
      scheme,
      { s: 'xiaoan', f: 'sweat', t: '……小主，那包醉心花，是咱们留着当证据的那包？' },
      { s: 'me', f: 'smirk', t: '证据在哪儿，取决于谁先找到它。' },
      { s: 'os', f: 'think', t: '（这句话，宁嫔也说过。）' },
    ] },
    { t: '“不用想太多。早点睡，明天还有大事。”', fx: { 健康: 5 } },
  ] },
  { go: 'c5_fire' },
];
N.c5_d99a = [{ bg: 'room_day', music: 'mystery', cast: [['me', 'normal', 'L'], ['xiaotao', 'smile', 'C']] }].concat(D99);
N.c5_d99b = [{ bg: 'yonghe', music: 'mystery', cast: [['me', 'normal', 'L'], ['xiaotao', 'smile', 'C']] }].concat(D99);
N.c5_fire = [
  { checkpoint: '第99天 · 夜' },
  { bg: 'room_night', music: 'night', cast: [['me', 'sleepy', 'C']] },
  { time: '夜' },
  { s: 'n', t: '子时三刻。' },
  { s: 'n', t: '你是被呛醒的。后窗外一片通红，噼噼啪啪的声音越来越近。' },
  { bg: 'huochang', music: 'danger', cast: [['me', 'panic', 'C']], trans: 'cut' },
  { shake: 0.6 },
  { s: 'me', f: 'panic', t: '走水了——！！', shake: 0.5, sfx: 'scream' },
  { if: G => G.flag('fireReady'), then: [
    { s: 'os', f: 'normal', t: '（和记忆里一模一样。湿帕子在枕边，东门的门闩卸了。跑！）' },
  ], else: [
    { s: 'os', f: 'panic', t: '（烟！好大的烟！门在哪儿？东边？西边？！）' },
  ] },
  G => { G.run.flags._taoInFire = !G.flag('taoSafe'); return null; },
  // 火场参数随准备情况变化：有准备 → 浓烟涨得慢、多一条命；小桃没送走 → 半路要救她
  { game: 'huozai', gtitle: '火场逃脱', failDeath: '083', get ready() { return !!(P.G.run && P.G.run.flags.fireReady); }, get tao() { return !!(P.G.run && P.G.run.flags._taoInFire); } },
  { go: 'c5_fireAfter' },
];
N.c5_fireAfter = [
  G => { const r = G.flag('game_huozai') || {}; if (r.rescued) G.run.flags.taoSafe = true; else if (G.flag('_taoInFire')) G.run.flags.taoHurt = true; delete G.run.flags._taoInFire; return null; },
  { bg: 'courtyard', music: 'night', cast: [['me', 'sweat', 'L']] },
  { s: 'n', t: '你跌坐在东门外的石阶上，脸上全是灰，头发焦了一缕。' },
  { if: G => G.flag('taoSafe') && !(G.flag('game_huozai') || {}).rescued, then: [
    { enter: 'xiaotao', face: 'panic', pos: 'R' },
    { s: 'xiaotao', f: 'panic', t: '（披着太后的斗篷，一路从慈宁宫跑过来）小主——！！您还活着吗！活着就应一声！' },
    { s: 'me', f: 'sweat', t: '……活着。就是头发焦了一缕。' },
    { s: 'xiaotao', f: 'cry', t: '呜呜呜还好奴婢没在！不对——奴婢应该在的！奴婢应该替您挡着的！' },
    { s: 'me', f: 'smile', t: '你在的话，现在就得两个人一起画眉毛了。太后那儿的点心好吃吗？' },
    { s: 'xiaotao', f: 'think', t: '……好吃。奴婢给您揣了两块回来。（掏出两块被压扁的枣泥糕）' },
    add('trust_tao', 10),
  ] },
  { if: G => G.flag('taoSafe') && !!(G.flag('game_huozai') || {}).rescued, then: [
    { enter: 'xiaotao', face: 'cry', pos: 'R' },
    { s: 'xiaotao', f: 'cry', t: '小主！小主您没事吧！呜呜呜奴婢的眉毛——奴婢的眉毛烧没了一半！' },
    { s: 'me', f: 'smile', t: '……没事，画上就好。我给你画，画成柳叶眉。' },
    { s: 'xiaotao', f: 'cry', t: '要、要画得比贵妃的还好看……' },
    add('trust_tao', 10),
  ] },
  { if: G => !G.flag('taoSafe'), then: [
    { s: 'n', t: '陆峥带着侍卫冲进了火场。片刻之后，他背着昏迷的小桃冲了出来。' },
    { enter: 'luzheng', face: 'sweat', pos: 'R' },
    { s: 'luzheng', f: 'normal', t: '活着。烟呛的，腿上烫了一块。温太医说，要躺半个月。' },
    { s: 'os', f: 'cry', t: '（……小桃。是我没顾上她。）' },
  ] },
  { s: 'n', t: '火被扑灭的时候，天已经快亮了。侍卫在后窗底下，捡到一只烧了一半的灯油桶。桶底烙着两个字：永和。' },
  { s: 'me', f: 'angry', t: '天干物燥，小心火烛……宁嫔，你连台词都念得那么好听。' },
  { s: 'os', f: 'normal', t: '（天亮了。第一百天。）' },
  { go: 'c5_d100' },
];

/* ---------------- 第 100 天 · 百日宴 ---------------- */
N.c5_d100 = [
  { day: 100, time: '晨', label: '第100天 · 百日宴', ch: 'ch5' },
  { if: G => owesDebt(G) && 100 - G.flag('debtDay') >= 4, then: [
    { bg: 'yonghe', music: 'danger', cast: [['me', 'sweat', 'L'], ['taijian', 'smirk', 'R'], ['xiaoan', 'panic', 'RR']] },
    { s: 'taijian', f: 'smirk', t: '{位份}吉祥。五天了。王公公说，银子不用还了。' },
    { s: 'me', f: 'shock', t: '……真的？' },
    { s: 'taijian', f: 'smirk', t: '真的。王公公、浣衣局的刘嬷嬷、御膳房的张师傅……您欠过人情的，一共十一位，昨晚聚在一块儿商量了一下。' },
    { s: 'taijian', f: 'smile', t: '大家决定：就当从来没认识过您。' },
    { s: 'n', t: '那天，你没能走进百日宴的殿门。门口的太监看了看你，说：“名单上没这个人。”' },
    { s: 'n', t: '后来，冷宫多了一位常住的客人。没人记得她是谁，连债主都不记得了。' },
  ], death: '095' },
  G => ({ go: G.flag('taoHurt') ? 'c5_d100h' : 'c5_d100t' }),
];
N.c5_d100t = [
  { bg: 'room_day', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'smile', 'R', { pose: 'hold', prop: 'milktea' }]] },
  { s: 'xiaotao', f: 'smile', t: '小主！奴婢照您说的方子做了一杯——珍珠奶茶！图个吉利！' },
  { s: 'me', f: 'shock', t: '……珍珠奶茶。' },
  { s: 'os', f: 'sweat', t: '（一百天前，我就是被这玩意儿送进来的。）' },
  { s: 'xiaotao', f: 'think', t: '小主您说过，您是喝这个……“来”的？奴婢想，喝这个来的，喝这个也能赢！' },
  { s: 'me', f: 'smile', t: '……好。我小口喝。' },
  { s: 'n', t: '你小口小口地喝完了那杯奶茶，一颗珍珠都没呛着。' },
  { s: 'xiaotao', f: 'smile', t: '小主，五张证据卡在左袖，解毒丸在右袖，桂花糕在……奴婢偷偷放了一块在腰带里。' },
  { s: 'me', f: 'smirk', t: '……为什么是腰带？' }, { s: 'xiaotao', f: 'smirk', t: '万一饿了呢。' },
  { go: 'c5_hall' },
];
N.c5_d100h = [
  { bg: 'room_day', music: 'day', cast: [['me', 'normal', 'L'], ['xiaotao', 'cry', 'R']] },
  { s: 'xiaotao', f: 'cry', t: '小主……奴婢起不来了。温太医说要躺半个月。奴婢不能陪您去了……' },
  { s: 'me', f: 'smile', t: '那你就躺着，等我回来。回来给你带烤鸭腿。' },
  { s: 'xiaotao', f: 'cry', t: '……要两只。' },
  { go: 'c5_hall' },
];
N.c5_hall = [
  { checkpoint: '第100天 · 百日宴' },
  { bg: 'bairiyan', music: 'hall', cast: [['me', 'normal', 'L'], ['guard', 'normal', 'R', { pose: 'spear', prop: 'spear' }]] },
  { s: 'n', t: '百日宴大殿。红烛高照，丝竹声声。殿门口，侍卫正一个一个地查腰牌。' },
  { s: 'guard', f: 'normal', t: '腰牌。' },
  { if: G => G.flag('tokenOk'), then: [
    { s: 'n', t: '你递上那块从脏衣筐里找回来的腰牌。背面那道新划的记号，你已经用刀刮掉了。' },
  ], else: [
    { s: 'n', t: '你递上内务府新补的腰牌。侍卫看了一眼，放你进去了。' },
    { s: 'os', f: 'think', t: '（旧的那块……到底在谁手里？）' },
  ] },
  { cast: [['me', 'normal', 'L'], ['huanghou', 'normal', 'CL'], ['guifei', 'smirk', 'C'], ['ningpin', 'smile', 'R'], ['wenshang', 'smirk', 'RR']] },
  { s: 'n', t: '殿里已经坐满了人。皇后端坐左首，贵妃斜倚右首，宁嫔在门边，笑得像一朵刚开的茉莉。' },
  { s: 'n', t: '她身边站着一个穿红官袍、戴乌纱帽的胖老头，两只帽翅一颤一颤的。' },
  { s: 'wenshang', f: 'smirk', t: '这位就是{位份}{宫名}？久仰久仰。老夫温某，在前朝都听说过你——听说你，很能活。' },
  { s: 'me', f: 'smile', t: '温大人过奖了。我主要是死得比较有经验。' },
  { s: 'wenshang', f: 'think', t: '……呵呵，年轻人，爱说笑。' },
  { s: 'n', t: '主桌旁边，有一个空着的位子。铺着最好的锦垫，摆着最好的酒杯。' },
  { c: [
    { t: '（走了一路，腿酸）“这儿正好空着。”——坐那个空位', danger: '086', then: [
      { s: 'n', t: '你一屁股坐了下去。锦垫真软。' },
      { s: 'n', t: '殿里忽然安静了。' },
      { s: 'guifei', f: 'angry', t: '……{宫名}妹妹。' },
      { s: 'guifei', f: 'angry', t: '本宫刚去更了个衣，回来位子就没了？' },
      { s: 'os', f: 'panic', t: '（那是贵妃的位子！她刚才只是站起来了一下！）' },
      { s: 'huanghou', f: 'smirk', t: '{位份}抢贵妃的座儿，这规矩，是跟谁学的？' },
      { s: 'n', t: '“以下犯上”四个字砸下来的时候，你还没来得及把锦垫捂热。' },
    ], death: '086' },
    { t: '“太后排的位子在左三，就坐那儿。”', need: G => G.flag('seatOk'), fx: { 规矩: 5 }, then: [
      { s: 'n', t: '你在左三坐下。正对面，就是宁嫔。她冲你举了举杯，笑得很甜。' },
      { s: 'os', f: 'normal', t: '（盯住你了，宁嫔。）' },
    ] },
    { t: '“找个不起眼的角落坐下。”', need: G => !G.flag('seatOk'), fx: { 规矩: 2 }, then: [
      { s: 'n', t: '你在靠柱子的角落坐下。柱子后面，温太医冲你挥了挥手。' },
    ] },
  ] },
  { cast: [['me', 'normal', 'L'], ['taihou', 'smile', 'C', { pose: 'beads', prop: 'beads' }], ['emperor', 'normal', 'R']] },
  { s: 'n', t: '“太后驾到——皇上驾到——”满殿的人跪了下去。' },
  { s: 'taihou', f: 'smile', t: '都起来吧。今儿是百日宴，给新人压惊的。新人里头，最该压惊的是谁呀？' },
  { s: 'taihou', f: 'smirk', t: '{宫名}，就你了。来，说两句祝酒词。' },
  { s: 'os', f: 'panic', t: '（……姐，您这是公报私仇吧？！）' },
  { c: [
    { t: '（脱稿发挥）“首先，感谢太后……”', danger: '087', then: [
      { s: 'me', f: 'smile', t: '首先，感谢太后给我这个机会。其次，感谢皇上。再次，感谢御膳房的张师傅、浣衣局的阿芸、冷宫的白菜——' },
      { s: 'me', f: 'star', t: '——还要感谢糯米，感谢大将军和它的表哥，感谢奈何桥，感谢那一碗我没喝的汤……' },
      { s: 'n', t: '一炷香过去了。太后的佛珠停了。' },
      { s: 'me', f: 'star', t: '……第十七点，感谢我自己。在这一百天里，我学会了一个道理——' },
      { s: 'n', t: '第二十分钟，皇上咳了一声。第二十一分钟，两个太监一左一右把你架了下去。' },
      { s: 'n', t: '你的祝酒词，被载入了《大晟宫廷礼仪反面教材》第一卷第一页。' },
    ], death: '087' },
    { t: '“一祝太后福寿安康，二祝皇上国泰民安，三祝姐妹们平平安安，四祝大家——吃好喝好，都活着回去。”', fx: { 规矩: 5, 名声: 5 }, then: [
      { s: 'n', t: '满殿先是一愣，接着，不知道谁先笑了一声，然后是一片笑声。' },
      { s: 'taihou', f: 'smile', t: '“都活着回去”——好！这句好！哀家就爱听实在话。' },
      { s: 'ningpin', f: 'smile', t: '（小声）……是啊，都活着回去。' },
    ] },
    { t: '（清嗓子）“我给大家唱一首吧——‘北京欢迎你……’”', need: G => G.flag('houAlly'), fx: { 名声: 2 }, then: [
      { s: 'n', t: '满殿面面相觑。只有太后，拿着酒杯的手抖了一下，然后跟着哼了起来。' },
      { s: 'taihou', f: 'cry', t: '……“为你开天辟地”。好孩子。好孩子。' },
      { s: 'emperor', f: 'think', t: '母后，这是什么曲子？' }, { s: 'taihou', f: 'smile', t: '老家的曲子。' },
      add('trust_hou', 5),
    ] },
  ] },
  { go: 'c5_wine' },
];
N.c5_wine = [
  { cast: [['me', 'normal', 'L'], ['ningpin', 'smile', 'R', { pose: 'hold', prop: 'winepot' }]] },
  { s: 'n', t: '酒过三巡。宁嫔提着一把青瓷壶，袅袅婷婷地走了过来。' },
  { s: 'ningpin', f: 'smile', t: '妹妹，这一百天，辛苦你了。姐姐敬你一杯。' },
  { s: 'n', t: '她的拇指，正按在壶盖的珠子上。' },
  { c: [
    { t: '“谢姐姐！”——一饮而尽', danger: '082', then: [
      { s: 'n', t: '酒是好酒。二十年的女儿红，入口绵，回味甜。' },
      { s: 'n', t: '甜得有点过分。' },
      { s: 'ningpin', f: 'smile', t: '妹妹好酒量。' },
      { s: 'os', f: 'dead', t: '（……鸳、鸳鸯……）' },
    ], death: '082' },
    { t: '“姐姐等等，这么好的酒，我先看看成色。”', then: [
      { game: 'spot', kind: 'wine', n: 6, failDeath: '082', gtitle: '验酒' },
      { s: 'me', f: 'smile', t: '姐姐，你倒给我的这杯，颜色怎么跟别人的不一样呀？' },
      { s: 'ningpin', f: 'sweat', t: '……灯下看着暗些罢了。' },
      { s: 'me', f: 'smirk', t: '那姐姐替我尝尝？' },
      { s: 'ningpin', f: 'smile', t: '哎呀——' },
      { s: 'n', t: '宁嫔手一滑，整杯酒泼在了地上。青砖“滋”地冒起了一缕白烟。', sfx: 'spill' },
      { s: 'n', t: '离得近的几位娘娘，都看见了。' },
    ] },
    { t: '🔍 “姐姐，您拇指按着壶盖上的珠子呢——这杯，您先请。”', need: G => G.flag('wineKnown'), then: [
      { s: 'ningpin', f: 'shock', t: '……！' },
      { s: 'n', t: '宁嫔的拇指僵在珠子上。松开也不是，按着也不是。' },
      { s: 'ningpin', f: 'smile', t: '妹妹真会说笑。姐姐不胜酒力——' },
      { s: 'n', t: '她转身的时候，壶嘴里滴下一滴酒，落在青砖上，“滋”地冒起了一缕白烟。', sfx: 'spill' },
      { s: 'n', t: '离得近的几位娘娘，都看见了。' },
      add('trust_wen', 5),
    ] },
  ] },
  add('ning', 10),
  { go: 'c5_proof' },
];
N.c5_proof = [
  { checkpoint: '第100天 · 举证' },
  { cast: [['me', 'normal', 'L'], ['emperor', 'normal', 'C'], ['ningpin', 'smile', 'R'], ['wenshang', 'smirk', 'RR']] },
  { s: 'emperor', f: 'normal', t: '今日百日宴，朕还有一件事。' },
  { s: 'emperor', f: 'think', t: '三年前，{姓}家巫蛊一案；先帝驾崩前一年，太医院一册脉案失踪。朕查了三年。' },
  { s: 'emperor', f: 'normal', t: '今日，有人要当着满朝文武说几句话。——{宫名}，你可有话要说？' },
  { s: 'n', t: '满殿的目光，一下子全落在了你身上。宁嫔的笑容，僵了一瞬。' },
  { c: [
    { t: '（站起来）“嫔妾有话要说。”', fx: { 名声: 2 } },
    { t: '（心机）先捂着脸哭出声：“皇上……嫔妾好怕……”——学宁嫔那一套', then: [
      scheme,
      { s: 'n', t: '你的眼泪说来就来，哭得梨花带雨，比宁嫔还真。' },
      { s: 'ningpin', f: 'shock', t: '……' },
      { s: 'os', f: 'think', t: '（……原来这么简单。原来，她每天都是这么过的。）' },
    ] },
    { t: '（低下头）“……嫔妾没有。”——今天什么都不说，明天再说', danger: '099', go: 'c5_dream' },
  ] },
  { if: G => missing(G).length > 0, then: [
    { s: 'me', f: 'normal', t: '先帝之死，不是头风，是中毒！三年前{姓}家的巫蛊案，是有人栽赃！证据在此——' },
    { s: 'n', t: '你把手伸进袖子。一张、两张……你的手指停住了。' },
    { s: 'os', f: 'panic', t: '（……少了一张。证据链，缺了一环。）' },
    { s: 'wenshang', f: 'smirk', t: '怎么，{位份}的“证据”，就这么几张纸？' },
    { s: 'ningpin', f: 'cry', t: '皇上！她血口喷人！她攀扯先帝、污蔑臣妾的舅舅——她这是诬告！' },
    { s: 'n', t: '真相差一步。宁嫔反手一个“诬告”，你成了这场宴会的最后一道菜。' },
  ], death: '080' },
  { s: 'me', f: 'normal', t: '嫔妾要告的，是永和宫宁嫔，和礼部温尚书。' },
  { s: 'n', t: '殿里“嗡”地一声。温尚书的帽翅抖了一下，又稳住了。' },
  { s: 'wenshang', f: 'smirk', t: '哈哈哈！一个小小的{位份}，告当朝尚书？好大的胆子。' },
  { s: 'wenshang', f: 'angry', t: '空口无凭！你说的话，谁能作证？满殿这么多人——谁肯替你说一句？' },
  { s: 'n', t: '满殿寂静。' },
  { if: G => allies(G).includes('xiaotao'), then: [{ s: 'xiaotao', name: '小桃', t: '（殿门口，一个小宫女冲了进来）“奴婢能！奴婢是小主的宫女，小主每一天都在拼命活着——奴婢都看见了！”' }] },
  { if: G => allies(G).includes('luzheng'), then: [{ s: 'luzheng', name: '陆峥', t: '“御前侍卫陆峥。温府的贺礼车里是空箱子，抬箱子的人不是脚夫——卑职，可以作证。职责所在。”' }] },
  { if: G => allies(G).includes('taihou'), then: [{ s: 'taihou', name: '太后', t: '“哀家也说一句。这丫头说的每一个字，哀家都信。谁不信，来跟哀家说。”' }] },
  { if: G => allies(G).includes('wen'), then: [{ s: 'wen', name: '温太医', t: '（从柱子后面探出头）“下、下官太医院温某，先帝的脉案下官亲手找出来的！还有——下官跟温尚书不是一家人！”' }] },
  { if: G => allies(G).includes('jingtaifei'), then: [{ s: 'jingtaifei', name: '静太妃', t: '（拄着锄头走进殿来）“老身在冷宫种了二十年白菜，今天出来，就为说一句话。”' }] },
  { if: G => allies(G).includes('ayun'), then: [{ s: 'ayun', name: '阿芸', t: '“浣、浣衣局阿芸！永和宫的脏衣筐里藏过什么，奴婢都记着呢！”' }] },
  { if: G => allies(G).includes('guifei'), then: [{ s: 'guifei', name: '华贵妃', t: '（贵妃把扇子一合）“本宫的命，是这丫头在巫蛊案里捡回来的。她要说话——谁敢拦？”' }] },
  { if: G => allies(G).length < 3, then: [
    { s: 'n', t: '……可是，站出来的人太少了。' },
    { s: 'wenshang', f: 'smirk', t: '就这么几个？一个丫头、一个老太婆？皇上，这等人证，如何服众？' },
    { s: 'n', t: '满殿的人都低着头，像在研究自己的鞋。你说的都是真的，可惜没有几个人愿意替你作证。' },
    { s: 'n', t: '💡 盟友（信任 ≥ 60）不足 3 人。小桃、陆峥、太后、温太医、静太妃、阿芸、贵妃……' },
  ], death: '088' },
  { s: 'emperor', f: 'normal', t: '……够了。{宫名}，把证据拿出来。' },
  { s: 'emperor', f: 'normal', t: '温尚书，你有什么话，一句一句地说。朕听着。' },
  { game: 'juzheng', failDeath: '080', gtitle: '当殿举证' },
  { go: 'c5_after' },
];

/* 举证之后：刺客 · 腰牌 · 最后一杯 */
N.c5_after = [
  { cast: [['me', 'normal', 'L'], ['emperor', 'angry', 'C'], ['ningpin', 'shock', 'R'], ['wenshang', 'panic', 'RR']] },
  { s: 'n', t: '五张证据摆在御案上。温尚书的脸，从红变白，从白变青。' },
  { s: 'wenshang', f: 'panic', t: '皇、皇上！老臣冤枉！这都是——这都是宁嫔一个妇道人家自作主张！' },
  { s: 'ningpin', f: 'shock', t: '……舅舅？' },
  { s: 'wenshang', f: 'angry', t: '谁是你舅舅！' },
  { s: 'os', f: 'think', t: '（翻脸比翻书还快。宁嫔替他干了三年的脏活，到头来，一句话就被扔了。）' },
  { s: 'wenshang', f: 'angry', t: '……罢了！既然如此——动手！' },
  { cast: [['me', 'shock', 'L'], ['emperor', 'shock', 'C'], ['cike', 'angry', 'R'], ['luzheng', 'angry', 'RR', { pose: 'spear', prop: 'spear' }]] },
  { s: 'n', t: '抬“贺礼”的八个人掀翻了宴桌。盘子、酒壶、烤鸭漫天乱飞，一整盘红烧肉直奔皇上的面门而去——', shake: 0.8, sfx: 'thud' },
  { c: [
    { t: '“皇上小心！”——扑过去挡在皇上前面（得眼疾手快：👁 警觉 ≥ 60）', danger: G => G.stat('警觉') < 60 ? '085' : null, then: [
      { if: G => G.stat('警觉') >= 60, then: [
        { s: 'n', t: '你看准了那盘红烧肉的来路，一把把皇上按到桌子底下。红烧肉擦着你的发髻飞了过去，糊在了温尚书的乌纱帽上。' },
        { s: 'emperor', f: 'shock', t: '……{宫名}，你的眼睛比朕的侍卫还快。' },
        { s: 'me', f: 'smirk', t: '皇上，我在这一百天里，躲过的东西比这多多了。' },
        { fx: { 圣眷: 10 } },
      ], else: [
        { s: 'n', t: '你扑了过去，张开双臂，挡在皇上面前。' },
        { s: 'n', t: '你挡住的不是刀。是一整盘飞来的红烧肉。肥而不腻，入口即化，正中天灵盖。', shake: 0.6, sfx: 'thud' },
        { s: 'emperor', f: 'shock', t: '……{宫名}！' },
        { s: 'os', f: 'dead', t: '（……好香……）' },
        { death: '085' },
      ] },
    ] },
    { t: '“陆峥——护驾！”（把皇上交给陆峥，自己蹲下）', then: [
      { s: 'luzheng', f: 'angry', t: '职责所在！' },
      { s: 'n', t: '陆峥一枪挑飞了红烧肉，两步跨到皇上身前。你抱着头蹲在桌子底下，和同样蹲着的温太医对视了一眼。' },
      { s: 'wen', name: '温太医', t: '（小声）{位份}也是躲柱子……躲桌子专业的？' },
      add('trust_lu', 10),
    ] },
    { t: '（抄起飞过来的烤鸭）“吃我一鸭！”', then: [
      { s: 'n', t: '你抓住半空中的烤鸭，抡圆了砸了过去。正中刺客的后脑勺。' },
      { s: 'cike', f: 'shock', t: '……鸭？' },
      { s: 'n', t: '刺客晃了两晃，倒了。大将军的表哥，死得其所。' },
      { fx: { 名声: 5 } },
    ] },
  ] },
  { s: 'n', t: '不到一炷香，八个刺客全被陆峥的人按在了地上。' },
  { s: 'guard', name: '侍卫', t: '启禀皇上！从刺客身上搜出一块腰牌——' },
  { if: G => !G.flag('tokenOk'), then: [
    { s: 'guard', name: '侍卫', t: '——腰牌上刻着：{位份}{宫名}！' },
    { s: 'n', t: '满殿的人，齐刷刷地看向你。' },
    { cast: [['me', 'panic', 'L'], ['emperor', 'angry', 'C'], ['ningpin', 'cry', 'R'], ['wenshang', 'smirk', 'RR']] },
    { s: 'me', f: 'panic', t: '那、那是我丢的！我四天前就丢了！' },
    { s: 'ningpin', f: 'cry', t: '皇上！刺客身上带着她的腰牌——她刚才那一番话，就是为了引开大家的注意！' },
    { s: 'wenshang', f: 'smirk', t: '贼喊捉贼，好一出大戏！丢了？谁能证明是丢的，不是“送”的？' },
    { if: G => !tokenRescue(G).length, then: [
      { s: 'n', t: '你张了张嘴，看向四周。没有人说话。内务府的册子上没有你的名字，记得这件事的人，也没有一个站出来。' },
      { s: 'n', t: '证据还摆在御案上。可你的腰牌，挂在刺客的腰上。' },
      { s: 'n', t: '💡 第 96 天丢的腰牌，没有找回、没有报失，也没人替你作证。' },
      { death: '084' },
    ] },
    ...TOKEN_STEPS,
    { s: 'emperor', f: 'think', t: '……宁嫔。' },
    { s: 'emperor', f: 'normal', t: '腰牌刚搜出来，上面刻的字还没念完，你就知道它是“刺客带进来”的？' },
    { s: 'ningpin', f: 'shock', t: '臣、臣妾只是……一时情急……' },
    { s: 'wenshang', f: 'sweat', t: '（往后挪了半步）这、这个……老臣什么也没说。“贼喊捉贼”是老臣的口头禅，不针对任何人。' },
    { s: 'os', f: 'smirk', t: '（一个急着往我身上泼水，一个急着把自己摘干净。你们俩的默契，三年都没练出来。）' },
    { s: 'guard', name: '侍卫', t: '启禀皇上！刺客腰间还缠着另一块腰牌——' },
  ] },
  { s: 'guard', name: '侍卫', t: '——上面刻着：永和宫，王福！' },
  { s: 'n', t: '永和宫的大太监王福，“扑通”一声瘫在了地上。' },
  { cast: [['me', 'normal', 'L'], ['ningpin', 'cry', 'R', { pose: 'hold', prop: 'wine' }]] },
  { s: 'n', t: '侍卫上前要押宁嫔。她没有挣扎，只是从翻倒的桌上捡起一只酒杯，倒满了，捧到你面前。' },
  { s: 'ningpin', f: 'cry', t: '……妹妹。我输了。' },
  { s: 'ningpin', f: 'smile', t: '姐妹一场，最后一杯。你喝了，我就认。' },
  { c: [
    { t: '（心软了）接过她的酒', danger: '090', then: [
      { s: 'n', t: '你接过了酒杯。她的手指，在杯沿上轻轻擦了一下。' },
      { s: 'ningpin', f: 'smile', t: '……妹妹，你真是个好人。' },
      { s: 'ningpin', f: 'cry', t: '好人，都活不长的。' },
      { s: 'n', t: '她说“姐妹一场，最后一杯”。你心软了，所以，它真的成了最后一杯。' },
    ], death: '090' },
    { t: '🔮 “姐姐先喝一口。”', mem: 'M17', then: [
      { s: 'ningpin', f: 'shock', t: '……' },
      { s: 'n', t: '宁嫔看着杯子，看了很久。然后，她笑了，把酒倒在了地上。青砖“滋”地冒起白烟。' },
      { s: 'ningpin', f: 'smile', t: '你怎么什么都知道。……真讨厌。' },
    ] },
    { t: '“这杯，你留着自己喝吧。”', then: [
      { s: 'ningpin', f: 'cry', t: '……呵。' },
      { s: 'n', t: '她手一松，酒杯摔在地上，碎了。' },
    ] },
  ] },
  { s: 'ningpin', f: 'cry', t: '我十四岁进宫。舅舅说，宫里只有两种人：吃人的，和被吃的。我不想被吃。' },
  { s: 'ningpin', f: 'normal', t: '你呢？你明明可以吃人的。你死了那么多次……为什么还是这副傻样子？' },
  { c: [
    { t: '“因为我死过那么多次，才知道活着的时候，别做让自己后悔的事。”', fx: { 名声: 5 } },
    { t: '“因为我是从一个不用吃人也能活的地方来的。”', fx: { 疑心: 3 } },
    { t: '“……因为我笨。”', fx: { 名声: 2 } },
  ] },
  { s: 'ningpin', f: 'smile', t: '……真讨厌。' },
  { s: 'n', t: '宁嫔被押了下去。她走得很慢，一次都没有回头。' },
  { cast: [['me', 'normal', 'L'], ['emperor', 'normal', 'C'], ['jingtaifei', 'cry', 'R']] },
  { s: 'emperor', f: 'normal', t: '传朕旨意：温氏一党，交三法司会审。{姓}家巫蛊一案，即日平反，追复原职，以礼改葬。' },
  { s: 'jingtaifei', f: 'cry', t: '……婉娘。你听见了吗。' },
  { s: 'n', t: '殿外，起风了。你摸了摸袖子里那半面镜子——它是热的。' },
  { set: { exposed5: true } }, { fx: { 名声: 15, 圣眷: 5 } },
  { go: 'c5_feast' },
];

/* 庆功宴 · 091 / 097 */
N.c5_feast = [
  { checkpoint: '第100天 · 庆功宴' },
  { bg: 'bairiyan', music: 'happy', cast: [['me', 'smile', 'L'], ['taihou', 'smile', 'C', { pose: 'hold', prop: 'milktea' }], ['guifei', 'smile', 'R']] },
  { time: '夜' },
  { s: 'n', t: '桌子重新摆好了。御膳房连夜补上了十二道菜——烤鸭换了一只新的，据说是“大将军”的二表哥。' },
  { s: 'guifei', f: 'smirk', t: '妹妹，今天的戏，比本宫看过的哪一出都好看。' },
  { s: 'taihou', f: 'smile', t: '丫头，来，哀家亲手给你调的。——珍珠奶茶。全糖，去冰。' },
  { s: 'os', f: 'sweat', t: '（又是珍珠奶茶。命运这东西，真是首尾呼应。）' },
  { c: [
    { t: '“今天我要吃十二道菜！一道都不能少！”', danger: '091', then: [
      { s: 'n', t: '第一道，水晶肘子。第二道，松鼠鳜鱼。第三道……' },
      { s: 'n', t: '第十一道吃完的时候，你的腰带已经松了三格。小桃塞在里面的那块桂花糕，掉了出来。' },
      { s: 'me', f: 'star', t: '……第十二道。烤鸭。我来了。' },
      { s: 'n', t: '你熬过了毒酒、冤案、火灾和刺客。最后，输给了一只烤鸭。' },
      { s: 'os', f: 'dead', t: '（……嗝。）', sfx: 'burp' },
    ], death: '091' },
    { t: '（想起这一百天，忍不住）“哈哈哈哈哈哈哈——！”放声大笑', danger: '097', then: [
      { s: 'n', t: '你笑啊笑，笑得前仰后合。一百天，九十九种死法，最后全赢了——' },
      { s: 'n', t: '你一边笑，一边吸了一大口太后的奶茶。' },
      { s: 'n', t: '一颗珍珠，顺着笑声，滑进了气管。', shake: 0.5 },
      { s: 'taihou', f: 'shock', t: '……丫头？丫头！' },
      { s: 'os', f: 'dead', t: '（……No.000……又见面了……）' },
    ], death: '097' },
    { t: '“尝一口烤鸭就好。再敬陆峥一杯——少糖的。”', fx: { 健康: 5 }, then: [
      { s: 'n', t: '你小口小口地喝奶茶，一颗珍珠一颗珍珠地嚼。陆峥接过你递的那杯少糖奶茶，耳朵红了。' },
      { s: 'taihou', f: 'smirk', t: '学会了？' }, { s: 'me', f: 'smile', t: '学会了。笑可以，别笑太大声。' },
    ] },
  ] },
  { s: 'taihou', f: 'normal', t: '……吃饱了？那走吧。观星台上，有人在等你。' },
  { go: 'c5_mirror' },
];

/* 百日黄粱 · 099 */
N.c5_dream = [
  { s: 'emperor', f: 'think', t: '……没有？' },
  { s: 'n', t: '皇上看了你很久，然后挥了挥手：“那就开席吧。”' },
  { s: 'n', t: '那天的百日宴，热闹得出奇。没有人掀桌，没有人中毒，宁嫔一直在笑，温尚书的帽翅一直在晃。' },
  { s: 'os', f: 'think', t: '（明天再说。明天，我准备得更好一点，再说。）' },
  { bg: 'mirror', music: 'mystery', cast: [['me', 'normal', 'L']] },
  { s: 'n', t: '夜里，箱笼底下的半面镜子，发出了一声脆响。' },
  { s: 'n', t: '镜面上，又多了一道裂痕。' },
  { s: 'os', f: 'shock', t: '（……没有明天了？）' },
  { s: 'n', t: '马车，又晃了起来。' },
  { ending: 'E_dream', cont: '▶ 镜子发出一声脆响……' },
  { s: 'n', t: '第一百天结束了。真相，还压在卷宗底下。' },
  { death: '099' },
];

/* ---------------- 观星台 · 照影镜 ---------------- */
const trueOk = G => G.uniqueDeaths() >= 99 && Object.keys(G.meta.mems).length >= 24 && G.flag('taoSafe') && !G.flag('taoHurt') && G.flag('feiClear') && G.flag('jingSafe') && G.flag('houAlly') && G.flag('empAlly');
const homeOk = G => G.uniqueDeaths() >= 60 && G.flag('houAlly');
const herOk = G => C(G, 'scheme') >= 3;
const powerOk = G => G.flag('side') === 'hou' && G.stat('名声') >= 70 && G.stat('圣眷') >= 30 && G.stat('圣眷') <= 85;
const shangOk = G => G.stat('规矩') >= 75;
const seaOk = G => C(G, 'trust_lu') >= 70 && G.flag('anStable');
const docOk = G => C(G, 'trust_wen') >= 60 && G.flag('herbBook') && G.mem('M03') && G.mem('M04') && G.mem('M16');
const sisOk = G => !!G.flag('sisters');
P.C5.END_OK = { trueOk, homeOk, herOk, powerOk, shangOk, seaOk, docOk, sisOk };
N.c5_mirror = [
  { checkpoint: '第100天 · 观星台' },
  { bg: 'guanxing', music: 'mystery', cast: [['me', 'normal', 'L'], ['xuanjizi', 'normal', 'R', { pose: 'whisk', prop: 'mirrorHalf' }]] },
  { s: 'n', t: '观星台。三百级台阶，这一次，你提着灯，一级一级走了上来。' },
  { s: 'xuanjizi', f: 'smile', t: '{位份}来了。贫道夜观天象——今夜，有雨。' },
  { s: 'me', f: 'smirk', t: '道长，您哪天不是有雨。' },
  { s: 'xuanjizi', f: 'think', t: '……' },
  { s: 'n', t: '夜空晴得一丝云都没有，星星多得像撒了一把糖。' },
  { s: 'xuanjizi', f: 'sweat', t: '……贫道报了三十年雨，头一回，报错了。' },
  { s: 'xuanjizi', f: 'normal', t: '这半面镜子，钦天监锁了四十年。太后说，今夜还给它的另一半。' },
  { s: 'n', t: '你从怀里取出自己那半面。两半镜子刚一靠近，就像磁石一样“咔”地扣在了一起。', sfx: 'sparkle' },
  { flash: '#fff' },
  { cast: [['me', 'shock', 'L'], ['yuanzhu', 'smile', 'CL'], ['taihou', 'smile', 'CR'], ['mengpo', 'smirk', 'R']] },
  { s: 'n', t: '镜光一闪。光里站着三个人。' },
  { s: 'yuanzhu', f: 'smile', t: '……我们赢了。' },
  { s: 'me', f: 'cry', t: '嗯。你爹的案子，翻了。' },
  { s: 'mengpo', f: 'smirk', t: '哟，热闹。我说怎么奈何桥今天这么冷清——原来都跑这儿来了。' },
  { s: 'me', f: 'shock', t: '孟婆？！您怎么也来了？' },
  { s: 'mengpo', f: 'normal', t: '镜子一合，阴阳一通。我来办两件事。' },
  { s: 'mengpo', f: 'smirk', t: '第一件——' },
  { s: 'mengpo', f: 'angry', t: '周小芸！三盆花呢！四十年了！' },
  { s: 'taihou', f: 'sweat', t: '……老姐姐，咱们这么多年的交情——' },
  { if: G => G.flag('gift') === 'flower', then: [
    { s: 'taihou', f: 'smile', t: '……有了有了！这丫头送的！先还一盆！' },
    { s: 'mengpo', f: 'star', t: '……！这、这是活的！会开花的那种！' },
    { s: 'mengpo', f: 'smile', t: '行。剩下两盆，再宽限你四十年。' },
  ], else: [
    { s: 'taihou', f: 'smirk', t: '下回，下回一定。' },
    { s: 'mengpo', f: 'angry', t: '你四十年前也是这么说的！' },
  ] },
  { s: 'mengpo', f: 'normal', t: '第二件。丫头，镜子合了，路就开了。你死了 {死} 回，攒下的“回头路”，够你选一条了。' },
  { s: 'yuanzhu', f: 'normal', t: '这副身子，本来就是我借给你的。你想留下，就留下；你想回去，我就跟孟婆走——我爹娘在那边等我。' },
  { s: 'taihou', f: 'smile', t: '哀家当年选了留下。你选什么，哀家都不怪你。' },
  { s: 'n', t: '风吹过观星台。镜子在你手里，一下一下地发着热，像一颗心。' },
  { c: [
    { t: '（举起合好的照影镜）“这面镜子，该碎了。由我来。”', need: trueOk, go: 'c5_e_true' },
    { t: '“……我想回家。”', need: homeOk, go: 'c5_e_home' },
    { t: '“镜子我留着。这宫里，以后我说了算。”', need: herOk, go: 'c5_e_her' },
    { t: '“我留下。和皇后娘娘一起，把这后宫好好管一管。”', need: powerOk, go: 'c5_e_power' },
    { t: '“我留下——但不当娘娘了。我想当尚宫。”', need: shangOk, go: 'c5_e_shang' },
    { t: '“我想出宫。去宫墙外面，开一家奶茶铺。”', need: seaOk, go: 'c5_e_sea' },
    { t: '“我想去太医院。那本毒物图谱，还没写完。”', need: docOk, go: 'c5_e_doc' },
    { t: '“我留下。贵妃姐姐说，长春宫的瓜子管够。”', need: sisOk, go: 'c5_e_sis' },
    { t: '“把镜子还给钦天监吧。明天，我想过一个普通的日子。”', go: 'c5_e_101' },
  ] },
];

/* ---------------- 结局 ---------------- */
N.c5_e_true = [
  { s: 'mengpo', f: 'shock', t: '……你知道你在说什么吗？镜子碎了，循环就断了。以后再死，就是真死。没有奈何桥上的“再来一次”了。' },
  { s: 'me', f: 'smile', t: '我知道。' },
  { s: 'me', f: 'normal', t: '我死了 {死} 次。被珍珠呛，被门钉撞，被白菜……被萝卜糕毒，被红烧肉砸。每一次，我都能重来。' },
  { s: 'me', f: 'normal', t: '可是小桃不能重来，静太妃不能重来，阿{叠字}的爹娘也不能重来。只有我能。这不公平。' },
  { s: 'me', f: 'smile', t: '所以，这是我自己选的最后一种死法：作为“循环者”，死在今天。从明天起，我只是一个普通人。会怕死，会好好活。' },
  { s: 'yuanzhu', f: 'cry', t: '……谢谢你。替我活过了一百天，还替我，活得这么好。' },
  { s: 'yuanzhu', f: 'smile', t: '这副身子，送你了。别再被奶茶呛着。' },
  { s: 'mengpo', f: 'smile', t: '……行吧。丫头，我这碗汤，你终于不用喝了。走了，阿{叠字}。' },
  { exit: 'yuanzhu' }, { exit: 'mengpo' },
  { s: 'n', t: '你举起照影镜，轻轻地，松开了手。' },
  { flash: '#fff' }, { sfx: 'sparkle' },
  { s: 'n', t: '镜子没有摔碎。它化成了一地星光，一颗一颗，飘回了天上。' },
  { bg: 'dawn', music: 'happy', cast: [['xiaotao', 'smile', 'LL'], ['guifei', 'smile', 'L'], ['me', 'smile', 'C'], ['jingtaifei', 'smile', 'R'], ['taihou', 'smile', 'RR']] },
  { s: 'n', t: '第一百零一天。天亮了。' },
  { s: 'xiaotao', f: 'smile', t: '小主！今天的酒酿圆子，奴婢多放了一勺糖！' },
  { s: 'guifei', f: 'smirk', t: '妹妹，长春宫新到的瓜子，本宫给你留了一斤。' },
  { s: 'jingtaifei', f: 'smile', t: '白菜熟了。中午来吃。' },
  { s: 'taihou', f: 'smile', t: '……丫头，从今往后，好好活着。只活这一回。' },
  { s: 'me', f: 'smile', t: '嗯。只活这一回。' },
  { ending: 'E_true' },
];
N.c5_e_home = [
  { s: 'taihou', f: 'smile', t: '……好。回去吧。替哀家看看，北京现在什么样了。' },
  { s: 'me', f: 'cry', t: '姐……' },
  { s: 'taihou', f: 'smirk', t: '哭什么。记得回去以后，少喝奶茶，多睡觉。还有——别唱《死了都要爱》。' },
  { s: 'yuanzhu', f: 'smile', t: '这副身子我收回来啦。放心，我会替你照顾小桃的。' },
  { s: 'mengpo', f: 'normal', t: '走吧，丫头。这回不用排队了。' },
  { flash: '#fff' },
  { bg: 'hospital', music: 'modern', cast: [['doctor', 'smile', 'L'], ['modern', 'sleepy', 'C'], ['nurse', 'smile', 'R']] },
  { s: 'n', t: '……滴。滴。滴。' },
  { s: 'nurse', f: 'smile', t: '醒啦？！医生！医生！三床醒了！' },
  { s: 'doctor', f: 'smile', t: '你好。你被一颗珍珠呛住，昏迷了一百天。能醒过来，是个奇迹。' },
  { s: 'modern', f: 'shock', t: '……温、温太医？' },
  { s: 'doctor', f: 'sweat', t: '……我姓温，是这儿的主治医生。我们……见过吗？' },
  { s: 'nurse', f: 'smile', t: '我叫小桃！您昏迷的时候一直喊我名字，我还以为您认识我呢。' },
  { s: 'modern', f: 'cry', t: '……认识。认识很久了。' },
  { s: 'n', t: '病房的电视里，正在重播《凤仪天下》大结局。' },
  { s: 'modern', f: 'smile', t: '……小桃，帮我点一杯奶茶。少糖，去冰。不要珍珠。' },
  { ending: 'E_home' },
];
N.c5_e_her = [
  { s: 'yuanzhu', f: 'shock', t: '……你说什么？' },
  { s: 'me', f: 'smirk', t: '我说，镜子我留着。有它在，我就永远不会输。谁挡我的路，我就死一次，再回来收拾谁。' },
  { s: 'taihou', f: 'think', t: '……丫头，你这句话，宁嫔也说过。' },
  { s: 'me', f: 'smirk', t: '那她输在没有镜子。' },
  { s: 'yuanzhu', f: 'cry', t: '我把身子借给你，是想让你替我活。不是让你……变成她。' },
  { exit: 'yuanzhu' },
  { s: 'mengpo', f: 'normal', t: '……这镜子，以前也有人这么用过。后来，她在我这儿死了一千回，一回都没赢。' },
  { exit: 'mengpo' },
  { bg: 'yonghe_night', music: 'mystery', cast: [['me', 'smirk', 'C', { pose: 'hold', prop: 'winepot' }]] },
  { s: 'n', t: '一年后，永和宫换了一位主人。' },
  { s: 'n', t: '她也很爱笑。她的青瓷壶，壶盖上也有一颗珠子。' },
  { s: 'n', t: '小桃辞了差事，回了老家。走的那天，她没有回头。' },
  { ending: 'E_her' },
];
N.c5_e_power = [
  { bg: 'kunning', music: 'happy', cast: [['me', 'smile', 'L'], ['huanghou', 'smile', 'R']] },
  { s: 'huanghou', f: 'smile', t: '本宫就知道，那天在坤宁宫，没看错人。' },
  { s: 'n', t: '三个月后，你晋封皇贵妃，协理六宫。上任第一天，你颁布了两道懿旨。' },
  { s: 'me', f: 'smirk', t: '第一道：后宫实行双休。初一十五不请安，有事飞鸽传书。' },
  { s: 'me', f: 'normal', t: '第二道：食品安全检查。每一道菜，验三遍——看颜色、看气泡、闻气味。银针只验砒霜，不算数。' },
  { s: 'huanghou', f: 'think', t: '……飞鸽传书，是不是太快了？' }, { s: 'me', f: 'smile', t: '那就慢鸽。' },
  { s: 'n', t: '那一年，后宫一个人都没有死。御膳房的张师傅说，这是他做厨子三十年，最轻松的一年。' },
  { ending: 'E_power' },
];
N.c5_e_shang = [
  { bg: 'room_day', music: 'happy', cast: [['guimama', 'cry', 'L'], ['me', 'smile', 'R', { pose: 'scroll', prop: 'scroll' }]] },
  { s: 'guimama', f: 'cry', t: '……老身教了三十年规矩，头一回有人跪着求老身，让她当女官的。' },
  { s: 'me', f: 'smile', t: '桂嬷嬷，您第一天就说过：“宫里的规矩，是用来保命的。”我想把这些保命的规矩，写下来。' },
  { s: 'n', t: '你辞了位份，执掌尚宫局。三年后，一本《大晟后宫生存手册》传遍六宫，人手一册。' },
  { s: 'n', t: '第一条：别笑太大声。第二条：陌生人给的香，别点。第三条：猫只吃小鱼干。第四条……' },
  { s: 'guimama', f: 'smirk', t: '……第一百条：“名字里别带皇上的字”？这条有必要写吗？' },
  { s: 'me', f: 'sweat', t: '有。非常有。' },
  { ending: 'E_shang' },
];
N.c5_e_sea = [
  { bg: 'naichapu', music: 'happy', cast: [['xiaoan', 'smile', 'L'], ['me', 'smile', 'C', { pose: 'hold', prop: 'milktea' }], ['luzheng', 'normal', 'R']] },
  { s: 'n', t: '一个月后，宫里传出消息：{位份}{宫名}“暴病而亡”。太后亲自主持了丧仪，哭得特别假。' },
  { s: 'n', t: '又过了一个月，玉京城南开了一家铺子。招牌上写着四个大字：珍珠奶茶。' },
  { s: 'xiaoan', f: 'smile', t: '咚咚锵——开张大吉！第一杯，半价！第二杯，还是半价！老板说了，赔钱也要图个热闹！' },
  { s: 'n', t: '第一位客人穿着便服，个子很高，手里还牵着三只鸭子。' },
  { s: 'luzheng', f: 'normal', t: '……一杯。' },
  { s: 'me', f: 'smirk', t: '陆侍卫不是不喝甜的吗？' },
  { s: 'luzheng', f: 'sweat', t: '卑职……我已经退役了。少糖。' },
  { s: 'luzheng', f: 'think', t: '鸭子叫大将军三号、四号、五号。不卖。' },
  { ending: 'E_sea' },
];
N.c5_e_doc = [
  { bg: 'taiyiyuan', music: 'happy', cast: [['wen', 'smile', 'L'], ['me', 'smirk', 'R', { pose: 'hold', prop: 'medpot' }]] },
  { s: 'n', t: '那年秋天，太医院多了一位女医官。这是大晟开国以来的头一个。' },
  { s: 'wen', f: 'smile', t: '同僚！今天的病人：丽昭仪，吃了三斤荔枝，流鼻血。' },
  { s: 'me', f: 'smirk', t: '图谱第三十七页：“荔枝，上火，不致命，但很丢人。”' },
  { s: 'n', t: '《后宫常见毒物图谱》一共写了一百页。每一页的角上，都画着一个小小的、飘着的幽灵。' },
  { s: 'wen', f: 'think', t: '……同僚，这些幽灵是什么意思？' }, { s: 'me', f: 'smile', t: '是我的作者签名。' },
  { ending: 'E_doc' },
];
N.c5_e_sis = [
  { bg: 'changchun', music: 'happy', cast: [['guifei', 'smile', 'L'], ['me', 'smile', 'R']] },
  { s: 'guifei', f: 'smirk', t: '来了？坐。今天这出戏，丽昭仪跟皇后抢一盆兰花。本宫押皇后赢。' },
  { s: 'me', f: 'smile', t: '我押兰花赢。' },
  { s: 'n', t: '从那以后，长春宫的台阶上，每天下午都坐着两个人，一人一把瓜子，看后宫这出永远演不完的戏。' },
  { s: 'guifei', f: 'normal', t: '……妹妹。当初那个娃娃，要不是你，本宫现在已经在冷宫里种白菜了。' },
  { s: 'me', f: 'smirk', t: '种白菜也挺好的。静太妃说您长得冲，叶子扎手。' },
  { s: 'guifei', f: 'angry', t: '……她说谁扎手？！' },
  { ending: 'E_sis' },
];
N.c5_e_101 = [
  { s: 'xuanjizi', f: 'smile', t: '……贫道替钦天监，谢过{位份}。' },
  { s: 'yuanzhu', f: 'smile', t: '那就……先这样。镜子还在，我也还在。你想好了，随时来找我。' },
  { bg: 'room_day', music: 'happy', cast: [['me', 'smile', 'L'], ['xiaotao', 'smile', 'R', { pose: 'hold', prop: 'soup' }]] },
  { s: 'n', t: '第一百零一天。' },
  { s: 'n', t: '没有晨报，没有毒酒，没有刺客。窗外的鸟叫了一早上。' },
  { s: 'xiaotao', f: 'smile', t: '小主，酒酿圆子！奴婢多放了一勺糖！' },
  { s: 'me', f: 'smile', t: '……小桃，今天是第一百零一天。' },
  { s: 'xiaotao', f: 'think', t: '嗯？那明天就是一百零二天呀。' },
  { s: 'me', f: 'smile', t: '对。明天，还有明天。' },
  { s: 'n', t: '💡 这是一个普通的好结局。观星台上的那面镜子，还藏着别的路——死得越多、记得越多、护住的人越多，能选的就越多。' },
  { ending: 'E_101' },
];

P.registerChapter({
  id: 'ch5', title: '第五章 · 百日宴', start: 'c5_start', nodes: N, startBg: 'room_day',
  blurb: '筹备 · 火场 · 百日宴 · 照影镜 · 第 96–100 天。最终章：揭发真凶，活过最后一夜，然后决定镜子的去留。',
  defaultRun(run) { run.stats = { 圣眷: 60, 名声: 62, 健康: 75, 警觉: 55, 疑心: 15, 规矩: 62 };
    run.flags = { rank: '常在', rankName: '晋封常在', pouchOk: true, taoSaved: true, bossWin3: true, feiClear: true, cuilvWitness: 'deal', teaMaker: true, sisters: true, side: 'hou', movedOut: true, anStable: true, ayunStable: true, houAlly: true, empAlly: true, ningExposed: true, bossWin4: true };
    run.cnt = { trust_tao: 70, trust_lu: 50, kill: 10, intel: 5, trust_hou: 80, silver: 40, ayun: 60, jing: 50, trust_wen: 25, ning: 80 };
    run.items = { '证据卡·永和宫布料': 1, '证据卡·翠缕证词': 1, '证据卡·旧案卷宗': 1, '证据卡·西域账本': 1, '证据卡·静太妃证词': 1, '御前密令': 1, '解毒丸': 1 }; },
  deathMems: { '084': 'M18', '083': 'M19' },
});
})(window.PALACE = window.PALACE || {});
