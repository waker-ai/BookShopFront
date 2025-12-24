<template>
  <el-container class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="sidebar">
      <div class="logo-container">
        <span class="logo-icon">🍅</span>
        <span class="logo-text">番茄后台管理</span>
      </div>

      <el-menu
          :default-active="activeMenu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#ff6700"
          router
          class="el-menu-vertical"
      >
        <!-- 仪表盘 -->
        <el-menu-item index="/admin/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>控制台</span>
        </el-menu-item>

        <!-- 业务管理 -->
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/admin/books">
            <span>书籍列表</span>
          </el-menu-item>
          <el-menu-item index="/admin/books/add">
            <span>发布新书</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/admin/orders">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>

      <!-- 底部操作区 -->
      <div class="sidebar-footer">
        <el-button link class="back-home-btn" @click="$router.push('/')">
          <el-icon><HomeFilled /></el-icon> 返回商城首页
        </el-button>
      </div>
    </el-aside>

    <!-- 右侧主体 -->
    <el-container>
      <!-- 顶部 Header -->
      <el-header class="admin-header">
        <div class="header-left">
          <!-- 面包屑导航 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-tooltip content="全屏" placement="bottom">
            <el-icon class="action-icon"><FullScreen /></el-icon>
          </el-tooltip>

          <el-dropdown trigger="click">
            <div class="avatar-wrapper">
              <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span class="admin-name">Administrator</span>
              <el-icon><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人设置</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="app-main">
        <!-- 添加一个过渡动画 -->
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Odometer, Goods, List, User,
  HomeFilled, FullScreen, CaretBottom
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 自动高亮当前菜单项
const activeMenu = computed(() => route.path)

// 获取当前路由名称用于面包屑（简单处理）
const currentRouteName = computed(() => {
  const map = {
    '/admin/books': '书籍管理',
    '/admin/books/add': '发布新书',
    '/admin/orders': '订单管理',
    '/admin/users': '用户管理',
    '/admin/dashboard': '控制台'
  }
  return map[route.path] || '当前页面'
})

const handleLogout = () => {
  // 处理退出逻辑
  router.push('/login')
}
</script>

<style scoped lang="scss">
/* 布局容器 */
.admin-layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* --- 侧边栏样式 --- */
.sidebar {
  background-color: #304156;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  box-shadow: 2px 0 6px rgba(0,21,41,.35);
  z-index: 10;

  .logo-container {
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: #2b2f3a;
    overflow: hidden;

    .logo-icon {
      font-size: 24px;
      margin-right: 10px;
      vertical-align: middle;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: white;
      vertical-align: middle;
    }
  }

  .el-menu-vertical {
    border-right: none;
    flex: 1; /* 撑满剩余空间 */

    &:not(.el-menu--collapse) {
      width: 100%;
    }
  }

  /* 侧边栏底部 */
  .sidebar-footer {
    padding: 20px;
    border-top: 1px solid #3d4657;

    .back-home-btn {
      color: #bfcbd9;
      width: 100%;
      justify-content: flex-start;

      &:hover {
        color: #ff6700;
      }
    }
  }
}

/* --- 顶栏样式 --- */
.admin-header {
  background: white;
  height: 60px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  position: relative;
  z-index: 9;

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .action-icon {
      font-size: 20px;
      cursor: pointer;
      color: #5a5e66;
      &:hover { color: #ff6700; }
    }
  }
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;

  .admin-name {
    margin: 0 8px;
    font-size: 14px;
    color: #333;
  }
}

/* --- 主内容区 --- */
.app-main {
  background-color: #f0f2f5; /* 经典的灰色背景 */
  padding: 20px;
  position: relative;
  overflow-y: auto;
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>