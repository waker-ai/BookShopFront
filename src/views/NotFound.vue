<template>
  <div class="not-found-page">
    <div class="content-wrapper">
      <!-- 创意 404 图像区 -->
      <div class="illustration">
        <div class="circle-bg"></div>
        <div class="number">404</div>
        <div class="tomato-icon">🍅</div>
      </div>

      <!-- 文字提示区 -->
      <h1 class="title">哎呀，页面走丢了</h1>
      <p class="subtitle">
        您寻找的页面可能已被删除、更名，或者暂时不可用。<br>
        不如吃个番茄冷静一下？
      </p>

      <!-- 按钮操作区 -->
      <div class="actions">
        <el-button
            size="large"
            @click="$router.go(-1)"
            class="back-btn"
        >
          返回上一页
        </el-button>

        <el-button
            type="primary"
            size="large"
            color="#ff6700"
            round
            @click="$router.push('/')"
            class="home-btn"
        >
          回到首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// 也可以在这里写逻辑，但模板里直接用 $router 更简洁
const router = useRouter()
</script>

<style scoped lang="scss">
.not-found-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;
}

.content-wrapper {
  text-align: center;
  position: relative;
  z-index: 10;
  padding: 40px;
}

/* --- 插画区域 --- */
.illustration {
  position: relative;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;

  .circle-bg {
    position: absolute;
    width: 180px;
    height: 180px;
    background-color: #ffe6d9; /* 浅番茄色 */
    border-radius: 50%;
    z-index: -1;
    animation: pulse 3s infinite ease-in-out;
  }

  .number {
    font-size: 120px;
    font-weight: 900;
    color: #ff6700;
    line-height: 1;
    letter-spacing: 10px;
    position: relative;
    z-index: 1;
    text-shadow: 4px 4px 0px rgba(255, 103, 0, 0.1);
  }

  .tomato-icon {
    font-size: 60px;
    position: absolute;
    top: -20px;
    right: 50px; /* 根据 404 数字调整位置 */
    transform: rotate(15deg);
    animation: float 3s ease-in-out infinite;
  }
}

/* --- 文字区域 --- */
.title {
  font-size: 28px;
  color: #333;
  margin-bottom: 16px;
  font-weight: bold;
}

.subtitle {
  font-size: 16px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 40px;
}

/* --- 按钮区域 --- */
.actions {
  display: flex;
  justify-content: center;
  gap: 20px;

  .home-btn {
    padding: 12px 36px;
    font-weight: bold;
    box-shadow: 0 4px 14px rgba(255, 103, 0, 0.3);
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 103, 0, 0.4);
    }
  }

  .back-btn {
    padding: 12px 30px;
    &:hover {
      background-color: #fff;
      border-color: #ff6700;
      color: #ff6700;
    }
  }
}

/* --- 动画 --- */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(15deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 0.4; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

/* 移动端适配 */
@media (max-width: 480px) {
  .illustration {
    .number { font-size: 80px; }
    .circle-bg { width: 140px; height: 140px; }
  }
  .title { font-size: 24px; }
  .actions { flex-direction: column; gap: 10px; }
  .home-btn, .back-btn { width: 100%; }
}
</style>