<template>
  <div class="common-layout">
    <el-container class="layout-container">
      <!-- 顶栏：全局唯一 -->
      <el-header class="site-header">
        <div class="header-inner">

          <!-- 1. Logo 区域 (点击回首页) -->
          <div class="logo-wrapper" @click="router.push('/')">
            <span class="logo-icon">🍅</span>
            <h1 class="logo-text">番茄商城</h1>
          </div>

          <!-- 2. 搜索区域 (居中) -->
          <div class="search-section">
            <el-input
                v-model="searchKeyword"
                placeholder="搜索感兴趣的好书、数码..."
                class="custom-search"
                @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button :icon="Search" class="search-btn" @click="handleSearch" />
              </template>
            </el-input>
          </div>

          <!-- 3. 右侧导航 -->
          <div class="nav-actions">
            <el-button link class="nav-item" @click="router.push('/')">
              <template #icon><el-icon><HomeFilled /></el-icon></template>
              首页
            </el-button>

            <!-- 购物车 (点击跳转) -->
            <el-badge :value="cartCount" :max="99" class="cart-badge">
              <el-button link class="nav-item" @click="router.push('/cart')">
                <template #icon><el-icon><ShoppingCart /></el-icon></template>
                购物车
              </el-button>
            </el-badge>

            <!-- 登录状态判断 -->
            <div class="user-menu" v-if="isLogin">
              <!-- 绑定 command 事件处理跳转 -->
              <el-dropdown trigger="click" @command="handleCommand">
                <div class="avatar-wrapper">
                  <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                  <span class="username">Admin</span>
                  <el-icon><CaretBottom /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <!-- command 对应路由路径 -->
                    <el-dropdown-item command="/user/profile" icon="User">个人中心</el-dropdown-item>
                    <el-dropdown-item command="/user/orders" icon="Tickets">我的订单</el-dropdown-item>
                    <el-dropdown-item divided command="logout" icon="SwitchButton">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <!-- 未登录状态 -->
            <div v-else class="auth-btns">
              <el-button link @click="router.push('/login')">登录</el-button>
              <el-button type="primary" round color="#ff6700" @click="router.push('/register')">注册</el-button>
            </div>
          </div>
        </div>
      </el-header>

      <!-- 主内容区：路由出口 -->
      <el-main class="main-body">
        <!-- 这里的 router-view 会渲染 Home, UserProfile, OrderList 等组件 -->
        <router-view />
      </el-main>

      <!-- 页脚 -->
      <el-footer class="site-footer">
        <div class="footer-content">
          <p>© 2025 番茄商城 Tomato Store - Lab2 Project</p>
          <div class="footer-links">
            <el-button link size="small">关于我们</el-button>
            <el-button link size="small">联系客服</el-button>
            <el-button link size="small">隐私政策</el-button>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Search,
  HomeFilled,
  ShoppingCart,
  CaretBottom,
  User,
  Tickets,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()

// --- 状态数据 ---
const searchKeyword = ref('')
const isLogin = ref(true) // 模拟登录状态
const cartCount = ref(5)

// --- 事件处理 ---

// 1. 搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  console.log('搜索:', searchKeyword.value)
}

// 2. 下拉菜单命令处理
const handleCommand = (command) => {
  if (command === 'logout') {
    isLogin.value = false
    ElMessage.success('已安全退出登录')
    router.push('/')
  } else {
    router.push(command)
  }
}
</script>

<style scoped lang="scss">
/* ✅ 1. 引入 Sass 颜色模块来解决警告 */
@use "sass:color";

/* 定义番茄主题色变量 */
$tomato-color: #ff6700;
$tomato-light: #ffefe6;
$text-main: #333;
$layout-width: 1200px;

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* --- Header 样式 --- */
.site-header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 999;
  padding: 0;
  height: 64px;
}

.header-inner {
  max-width: $layout-width;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

/* Logo */
.logo-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  .logo-icon {
    font-size: 28px;
    margin-right: 8px;
  }

  .logo-text {
    font-size: 22px;
    font-weight: 800;
    color: $tomato-color;
    margin: 0;
    letter-spacing: 1px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
}

/* 搜索栏深度定制 */
.search-section {
  flex: 1;
  max-width: 500px;
  margin: 0 40px;

  /* 穿透修改 Element Plus 样式 */
  :deep(.el-input-group__append) {
    background-color: $tomato-color;
    border-color: $tomato-color;
    color: white;
    transition: 0.3s;
    box-shadow: none;

    &:hover {
      /* ✅ 2. 使用 color.adjust 替代 darken */
      background-color: color.adjust($tomato-color, $lightness: -5%);
    }
  }

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
    &:hover {
      box-shadow: 0 0 0 1px #c0c4cc inset;
    }
    &.is-focus {
      box-shadow: 0 0 0 1px $tomato-color inset;
    }
  }
}

/* 右侧导航 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 24px;

  .nav-item {
    font-size: 15px;
    color: #555;
    padding: 0;
    height: auto;
    font-weight: 500;

    &:hover {
      color: $tomato-color;
    }
  }

  /* 购物车角标微调 */
  .cart-badge {
    :deep(.el-badge__content) {
      background-color: $tomato-color;
      border: none;
      right: 2px;
    }
  }
}

/* 用户菜单 */
.user-menu {
  margin-left: 10px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 20px;
  transition: background 0.2s;
  user-select: none;

  &:hover {
    background: #f5f5f5;
  }

  .username {
    font-size: 14px;
    color: $text-main;
    font-weight: 500;
  }

  .el-icon {
    color: #999;
    font-size: 12px;
  }
}

/* --- 主体与页脚 --- */
.main-body {
  background-color: #f5f7fa;
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.site-footer {
  background: #333;
  color: #999;
  padding: 40px 0;
  height: auto;
  border-top: 1px solid #444;

  .footer-content {
    max-width: $layout-width;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    p {
      margin: 0;
      font-size: 14px;
    }
  }

  .footer-links {
    display: flex;
    gap: 10px;

    .el-button {
      color: #bbb;
      font-weight: normal;
      &:hover { color: white; }
    }
  }
}
</style>
