# 🌦️ SkyCast 3D Weather Dashboard

一个基于 React 构建的超现代、交互式 3D 天气仪表盘。结合了 Three.js 的沉浸式视觉效果、ECharts 的专业数据可视化以及 GSAP 的流畅动画，为您提供独一无二的天气查询体验。

> **注意**: 本项目默认使用**模拟数据**模式，无需 API Key 即可直接体验所有 UI 和动画效果。

## ✨ 核心功能

- **🌩️ 沉浸式 3D 场景**
  基于 Three.js 和 React Three Fiber 构建的动态天气背景。根据实时天气状况（如雨、雪、雷暴）自动切换粒子效果和光照氛围。

- **📊 交互式数据可视化**
  集成 ECharts 展示未来 7 天的温度趋势，支持交互式查看每日最高/最低温详情。

- **✨ 丝滑的动画体验**
  由 GSAP (GreenSock) 驱动的 UI 进出场动画和状态切换，提供极致流畅的用户体验。

- **🌍 智能定位与搜索**
  - 支持自动检测当前地理位置的天气。
  - 包含本地存储支持的最近搜索历史记录，方便快速切换城市。

- **🎨 现代 UI 设计**
  使用 Tailwind CSS 打造的玻璃拟态 (Glassmorphism) 风格界面，适配各种屏幕尺寸。

## 🛠️ 技术栈

- **核心框架**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **3D 渲染**: [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **动画引擎**: [GSAP](https://gsap.com/)
- **图表库**: [ECharts](https://echarts.apache.org/)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **图标**: [Lucide React](https://lucide.dev/)

## 🚀 快速开始

### 1. 环境准备
请确保您的本地环境已安装 [Node.js](https://nodejs.org/) 和 [pnpm](https://pnpm.io/)。

### 2. 安装依赖
在项目根目录下运行以下命令安装所需依赖：

```bash
pnpm install
```

### 3. 启动开发服务器
启动本地开发环境：

```bash
pnpm start
```
此时浏览器应自动打开 `http://localhost:5173`。

### 4. 构建生产版本
如需构建用于生产环境的静态文件：

```bash
pnpm build
```

## ⚙️ 配置说明

目前项目配置为**演示模式 (Demo Mode)**，使用内置的模拟数据生成器 (`weatherService.ts`)。

如果您希望接入真实的 OpenWeatherMap 数据：
1. 复制 `.env.example` 为 `.env`。
2. 在 [OpenWeatherMap](https://openweathermap.org/api) 申请 API Key。
3. 修改 `services/weatherService.ts` 中的相关逻辑以启用真实 API 调用。

## 📂 目录结构

```
skycast/
├── components/        # React 组件
│   ├── AtmosphericEffects.tsx  # 3D 氛围效果
│   ├── WeatherScene.tsx        # 主 3D 场景入口
│   └── ...
├── services/          # 业务逻辑服务
│   └── weatherService.ts       # 天气数据获取 (含模拟数据)
├── index.css          # 全局样式 (Tailwind v4)
├── postcss.config.js  # PostCSS 配置
├── App.tsx           # 主应用组件
└── ...
```
