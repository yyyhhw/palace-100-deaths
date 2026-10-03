# 穿越回后宫的100种“死法”（第一版：序章 + 第一章）

纯静态网页游戏（HTML + Canvas + WebAudio），所有美术用代码绘制。在线游玩：https://yyyhhw.github.io/palace-100-deaths/

## 结构
- `index.html` / `style.css`：页面与界面样式
- `engine.js`：剧情引擎、存档（localStorage `palace100_save`，带版本号）、舞台渲染
- `ui.js`：对话气泡、选项、命名、死法卡、奈何桥、图鉴、设置
- `art.js` / `art_bg.js`：Q 版角色（多表情）与宫廷背景
- `audio.js`：五声音阶古筝音乐、音效、死法吐槽朗读（Web Speech）
- `data/deaths.js`：100 种死法 + 2 个番外；`data/memories.js`：24 条记忆碎片
- `minigames/quiz.js`（宫规问答）、`minigames/tea.js`（奉茶平衡）
- `chapters/ch0.js`、`chapters/ch1.js`：每章一个脚本文件，通过 `PALACE.registerChapter()` 注册。以后的章节加在 `chapters/` 下，再在 index.html 里多加一行 script 即可。
