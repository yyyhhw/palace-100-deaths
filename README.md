# 穿越回后宫的100种“死法”（序章 + 第一～五章 · 完结）

纯静态网页游戏（HTML + Canvas + WebAudio），所有美术用代码绘制。在线游玩：https://yyyhhw.github.io/palace-100-deaths/

## 结构
- `index.html` / `style.css`：页面与界面样式
- `engine.js`：剧情引擎、存档（localStorage `palace100_save`，带版本号）、舞台渲染
- `ui.js`：对话气泡、选项、命名、死法卡、奈何桥、图鉴、设置
- `art.js` / `art_bg.js`：Q 版角色（多表情）与宫廷背景；`art_ch2.js`～`art_ch5.js`：各章新角色、场景、死法插图
- `audio.js`：五声音阶古筝音乐、音效、死法吐槽朗读（Web Speech）
- `data/deaths.js`：100 种死法 + 番外；`data/memories.js`：24 条记忆碎片；`data/deaths_ch2.js`～`deaths_ch5.js`：各章吐槽、提示、谜语（第五章含 11 个结局与收集奖励）
- `minigames/`：quiz 宫规问答、tea 奉茶、gomoku 五子棋、milktea 奶茶铺、embroider 绣荷包、dance 献舞节奏、cards 叶子牌、spot 观察验毒、escape 夜逃 QTE
- `chapters/ch0.js`～`ch5.js`：每章一个脚本文件，通过 `PALACE.registerChapter()` 注册。以后的章节加在 `chapters/` 下，再在 index.html 里多加一行 script 即可。
