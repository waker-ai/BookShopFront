<template>
  <!-- 使用 v-slot 获取当前路由组件 -->
  <router-view v-slot="{ Component }">
    <!-- 添加全局过渡动画：淡入淡出 + 轻微缩放 -->
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
// 这里通常不需要写逻辑，除非你需要监听路由变化来改变 title 等
</script>

<style lang="scss">
/* ================= 全局基础样式重置 ================= */
:root {
  /* 定义全局 CSS 变量，方便统一管理主题色 */
  --tomato-color: #ff6700;
  --tomato-dark: #e05a00;
  --text-main: #2c3e50;
  --text-secondary: #606266;
  --bg-color: #f5f7fa;
  --header-height: 64px;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);

  /* 字体抗锯齿，让文字在 Mac/iOS 上更清晰，显高级 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* 更加现代、正式的字体栈 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
  "Microsoft YaHei", SimSun, sans-serif;

  color: var(--text-main);
  overflow-x: hidden; /* 防止页面切换动画时出现横向滚动条 */
}

/* ================= 页面切换动画 (核心) ================= */
/*
   效果说明：
   旧页面：稍微放大并变透明 (Fade out + Scale up)
   新页面：从稍微缩小透明的状态复原 (Fade in + Scale up from 0.98)
   这种类似 iOS App 或翻书打开的纵深感
*/

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: scale(0.98) translateY(10px); /* 刚进来时略小，且在下方 */
}

.page-fade-leave-to {
  opacity: 0;
  transform: scale(1.02); /* 离开时略微放大消失 */
}

/* ================= 自定义滚动条 (美观加分项) ================= */
/* Webkit 浏览器 (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  transition: background 0.3s;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--tomato-color); /* 滚动时滚动条变品牌色 */
}

/* ================= Element Plus 全局样式覆盖 (可选) ================= */
/* 让所有按钮点击后不要留下难看的黑框 */
button:focus,
button:focus-visible {
  outline: none !important;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>