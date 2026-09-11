# 视在必行 VisionPilot 智能助盲终端服务平台

## 项目概述

面向视障用户及合作伙伴的 Web 平台，提供账号管理、设备绑定、功能配置、无障碍设置、云端服务订阅等能力。

## 品牌视觉规范

### 品牌主色
- 主色：浅蓝色系 `hsl(207, 90%, 54%)` — 科技感与亲和力平衡
- 主色深：`hsl(210, 92%, 45%)`
- 主色浅/背景：`hsl(208, 100%, 97%)`
- 辅助色：`hsl(195, 85%, 62%)`

### 无障碍基线
- 字号基准：正文默认 16px，大字号模式 18px，超大字号模式 20px
- 对比度：正文与背景对比度 ≥ 4.5:1（WCAG AA）
- 高对比度模式：支持黑白/黄黑切换
- 所有交互元素支持键盘 Tab 导航，焦点环清晰可见
- 语义化 HTML：使用 `<header> <main> <section> <nav> <article> <footer>` 等标签
- 表单控件均关联 `<label>`，按钮有明确 aria-label
- 图标按钮需有 `aria-label` 或 `title`

### 布局与间距
- 登录页：居中卡片布局，卡片最大宽度 420px
- 控制台：左侧导航 240px + 右侧内容区
- 卡片圆角：`12px`（rounded-xl）
- 内容内边距：统一 24px（p-6）
- 区块间距：统一 20px（gap-5）

### 字体层级
- 页面大标题：text-2xl / font-bold
- 次级标题：text-lg / font-semibold
- 正文：text-base
- 辅助文字：text-sm / 颜色 muted-foreground

## 技术架构

### 后端模块
- `auth` — 认证模块：注册、登录、登出、会话验证
- `devices` — 设备模块：设备列表、绑定、状态
- `subscriptions` — 订阅模块：套餐、订阅状态
- `settings` — 设置模块：无障碍设置、功能开关

### 前端路由
- `/` — 登录页（未登录）/ 控制台总览（已登录）
- `/register` — 注册页
- `/dashboard` — 控制台总览
- `/dashboard/devices` — 我的设备
- `/dashboard/features` — 核心功能
- `/dashboard/accessibility` — 无障碍设置
- `/dashboard/cloud` — 云端服务
- `/dashboard/profile` — 个人资料
- `/help` — 帮助中心

### 会话机制
- 登录成功后后端生成 session token，存 cookie（HttpOnly）
- 前端通过 API 拉取当前用户信息，未登录时重定向到登录页
- 密码存储：SHA256 + salt 哈希

## 数据模型
- `vp_users` — 用户表（账号、密码哈希、会话令牌）
- `vp_devices` — 设备表（SN码、型号、固件、状态、电量）
- `vp_subscriptions` — 订阅表（套餐、状态、起止日期）
- `vp_settings` — 设置表（无障碍、功能开关）
