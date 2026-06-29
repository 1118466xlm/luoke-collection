# 洛克收集簿 - 会话恢复

## 项目信息

| 项目 | 详情 |
|------|------|
| 代码位置 | `c:/tmp/luoke-collection/` |
| 仓库 | `1118466xlm/luoke-collection` |
| 线上地址 | `https://1118466xlm.github.io/luoke-collection/` |
| 最新提交 | `ef51902 v43: 时装分组三种方案原型 A卡片 B人形 C进度条 可切换` |
| 未提修改 | `index.html` 有未提交修改（working tree dirty） |
| 配色 | 8色马卡龙板（--m1~--m8），暖奶油底 #FFFBF7 |
| 架构 | 纯前端 PWA + IndexedDB（outfits/pika/pikaCart 三表）+ SW cache-first |
| 核心文件 | `index.html`（单文件应用，包含全部 HTML/CSS/JS）|

## v43 进度

已完成：时装分组页面三种方案原型（A卡片/B人形/C进度条）可切换。
已测试：用户在手机端打开 GitHub Pages 链接完成测试。

## ⚠️ 待修问题（3个）

### 问题1：首页"最近添加"出现深色边框

现象：首页 gallery 卡片区域的最近添加内容多出了深色边框，不应该有。

涉及位置：
- CSS 第63-77行 `.gallery .card` 系列样式
- 卡片用 `border-top:3px solid var(--mX)` 8色轮换（nth-child），这是马卡龙色边框，是正常的
- 卡片 `box-shadow: var(--shadow)` = `0 2px 10px rgba(0,0,0,.04)` 非常淡
- 需要进一步定位是哪个元素产生了深色边框——可能是 img 默认边框、浏览器渲染、或是放映机外壳的暗色透到下方

### 问题2：灵感轮播区域需要放映机外壳

用户需求：轮播和下面内容视觉上区分不明显，希望套一个"放映机"样式外壳，视觉更有趣。

约束：加了外壳后该区域要保持现在的大小。

当前状态：v43 已经加了 `carousel-projector` 组件（暗棕渐变 #3D3025→#5C4A3A），但视觉效果可能还不够突出或与内容区分不够明显。

涉及位置：
- CSS 第43-61行 `.carousel-wrap` / `.carousel-projector` / `.carousel-inner` 系列样式
- JS 第400-402行 `renderCarousel()` 函数动态创建 projector DOM

🛑 **注意**：用户还没看过当前外壳的效果反馈。修复方案：先确认当前外壳的视觉效果（可能需要让用户重新打开手机看），如果用户觉得效果可以就微调，如果需要重新设计就按用户审美来。

### 问题3：分组功能完全没法使用，只显示三个按钮 ⭐

现象：切换到"时装分组"标签页，只显示 A/B/C 三个按钮，下面没有任何内容。

**根因已定位**：`renderFashionMode()` 函数（第426-462行）中第433行使用了未定义的变量 `SLOTS`：

```javascript
// 第433行 — 变量 SLOTS 未定义！
SLOTS.forEach(function(s){...})
```

全局只定义了 `SL`（第285行）：
```javascript
var SL=["头发","外套","上装","下装","袜子","鞋子","背包","帽子"];
```

**修复**：将第433行的 `SLOTS` 改为 `SL`。

涉及位置：`renderFashionMode()` 函数，`index.html` 第433行。

## 修复顺序建议

```
1. [问题3] 修 SLOTS → SL，验证分组三种方案都能正常渲染 → 验证: 手机打开时装分组，A/B/C 切换显示内容
2. [问题1] 定位深色边框来源，修复 → 验证: 手机看首页，最近添加区域无多余边框
3. [问题2] 调整放映机外壳 → 验证: 轮播区域视觉上有明显外壳包裹，但大小不变
4. 全部验证通过 → git commit → git push → curl 验证线上可访问
```

## 关键全局变量速查

| 变量 | 含义 |
|------|------|
| `all` | 所有搭配数据（outfits store）|
| `pika` | 皮卡时装数据（pika store）|
| `cart` | 购物车数据（pikaCart store）|
| `st` | 全局状态对象（tab/q/slides/ci/cp等）|
| `SL` | 8个槽位列表 ["头发","外套","上装","下装","袜子","鞋子","背包","帽子"]|
| `DP` | 73套皮卡时装预设数据 |
| `TC` | 8色标签配色数组 |
| `SLOTS` | ❌ 不存在，bug来源 |
