<template>
  <div class="common-layout">
    <el-container class="layout-container">

      <!-- 顶栏 Header -->
      <el-header class="site-header">
        <div class="header-inner">

          <!-- 1. Logo 区域 -->
          <div class="logo-section" @click="router.push('/')">
            <div class="logo-icon-box">
              <el-icon><Shop /></el-icon>
            </div>
            <div class="logo-text-box">
              <h1 class="brand-name">番茄商城</h1>
              <span class="brand-slogan">Tomato Mall</span>
            </div>
          </div>

          <!-- 2. 搜索区域 (包含热搜词) -->
          <div class="search-container">
            <div class="search-input-wrapper">
              <el-input
                  v-model="searchKeyword"
                  placeholder="搜索 iPhone 15 / Java编程思想..."
                  class="mall-search"
                  @keyup.enter="handleSearch"
              >
                <template #append>
                  <el-button class="search-btn" @click="handleSearch">
                    <el-icon><Search /></el-icon> 搜索
                  </el-button>
                </template>
              </el-input>
            </div>
            <!-- 热搜推荐词 -->
            <div class="hot-tags">
              <a href="#">限时秒杀</a>
              <a href="#">新书上架</a>
              <a href="#">数码家电</a>
              <a href="#" class="highlight">会员福利</a>
            </div>
          </div>

          <!-- 3. 右侧导航操作 -->
          <div class="nav-actions">
            <!-- 首页链接 -->
            <el-button link class="nav-link" @click="router.push('/')">
              首页
            </el-button>

            <!-- 购物车 (胶囊样式) -->
            <el-badge :value="cartCount" :max="99" class="cart-badge">
              <el-button class="cart-btn" round @click="router.push('/cart')">
                <el-icon><ShoppingCart /></el-icon>
                <span>购物车</span>
              </el-button>
            </el-badge>

            <!-- 分割线 -->
            <el-divider direction="vertical" class="nav-divider" />

            <!-- 用户菜单 -->
            <div class="user-area">
              <template v-if="isLogin">
                <el-dropdown trigger="click" @command="handleCommand">
                  <div class="user-profile">
                    <el-avatar :size="34" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <div class="user-info">
                      <span class="name">Admin</span>
                      <el-icon class="arrow"><CaretBottom /></el-icon>
                    </div>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu class="user-dropdown">
                      <el-dropdown-item command="/user/profile" icon="User">个人中心</el-dropdown-item>
                      <el-dropdown-item command="/user/orders" icon="Tickets">我的订单</el-dropdown-item>
                      <el-dropdown-item divided command="logout" icon="SwitchButton">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>

              <!-- 未登录 -->
              <template v-else>
                <div class="auth-links">
                  <el-button link class="login-link" @click="router.push('/login')">登录</el-button>
                  <el-button type="primary" class="reg-btn" round @click="router.push('/register')">注册</el-button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="main-body">
        <router-view />
      </el-main>

      <!-- 页脚 (保持之前的优化) -->
      <el-footer class="site-footer">
        <div class="service-features">
          <div class="feature-item">
            <el-icon :size="24"><CircleCheck /></el-icon>
            <span>正品保证</span>
          </div>
          <div class="feature-item">
            <el-icon :size="24"><Van /></el-icon>
            <span>七天退换</span>
          </div>
          <div class="feature-item">
            <el-icon :size="24"><Lightning /></el-icon>
            <span>极速发货</span>
          </div>
          <div class="feature-item">
            <el-icon :size="24"><Medal /></el-icon>
            <span>优质售后</span>
          </div>
        </div>

        <div class="footer-main">
          <div class="footer-links-area">
            <dl class="link-column">
              <dt>购物指南</dt>
              <dd><a href="#">购物流程</a></dd>
              <dd><a href="#">会员介绍</a></dd>
              <dd><a href="#">常见问题</a></dd>
            </dl>
            <dl class="link-column">
              <dt>配送方式</dt>
              <dd><a href="#">上门自提</a></dd>
              <dd><a href="#">配送服务查询</a></dd>
              <dd><a href="#">配送费收取标准</a></dd>
            </dl>
            <dl class="link-column">
              <dt>支付方式</dt>
              <dd><a href="#">在线支付</a></dd>
              <dd><a href="#">分期付款</a></dd>
              <dd><a href="#">公司转账</a></dd>
            </dl>
            <dl class="link-column">
              <dt>售后服务</dt>
              <dd><a href="#">售后政策</a></dd>
              <dd><a href="#">退款说明</a></dd>
              <dd><a href="#">取消订单</a></dd>
            </dl>
          </div>

          <div class="footer-contact">
            <p class="phone">400-123-4567</p>
            <p class="desc">周一至周日 8:00-18:00</p>
            <el-button round plain class="contact-btn">
              <el-icon><ChatDotRound /></el-icon> 联系在线客服
            </el-button>
          </div>
        </div>

        <div class="copyright-bar">
          <div class="info-text">
            <span>关于我们</span><span class="divider">|</span>
            <span>联系我们</span><span class="divider">|</span>
            <span>人才招聘</span><span class="divider">|</span>
            <span>商家入驻</span>
          </div>
          <p class="copyright-text">
            © 2025 番茄书城 (Tomato Bookstore) 版权所有 <br/>
            本网站仅供课程实验 (Lab2) 演示使用，不涉及真实商业交易 | ICP证：浙B2-20250000
          </p>
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
  ShoppingCart,
  CaretBottom,
  User,
  Tickets,
  SwitchButton,
  CircleCheck, Van, Lightning, Medal, ChatDotRound,
  Shop // 新增图标
} from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')
const isLogin = ref(true)
const cartCount = ref(5)

const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  console.log('搜索:', searchKeyword.value)
}

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
@use "sass:color";

/* 变量定义 */
$tomato-main: #ff6700;
$tomato-dark: #e05a00;
$gray-bg: #f5f7fa;
$border-color: #e0e0e0;
$layout-width: 1200px;

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ================= Header 区域优化 ================= */
.site-header {
  background: #fff;
  /* 增加高度以容纳热搜词 */
  height: 90px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0;
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

/* 1. Logo 样式 */
.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  .logo-icon-box {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, $tomato-main, $tomato-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 26px;
    box-shadow: 0 4px 10px rgba(255, 103, 0, 0.3);
  }

  .logo-text-box {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .brand-name {
      font-size: 22px;
      font-weight: 800;
      color: #333;
      margin: 0;
      line-height: 1.1;
    }

    .brand-slogan {
      font-size: 12px;
      color: #999;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 2px;
    }
  }
}

/* 2. 搜索框样式 (居中且现代化) */
.search-container {
  flex: 1;
  max-width: 580px;
  margin: 0 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.search-input-wrapper {
  /* 深度穿透修改 Element Plus 样式 */
  :deep(.el-input-group--append .el-input__wrapper) {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    box-shadow: 0 0 0 2px $tomato-main inset; /* 强制边框色 */
    padding-left: 15px;
  }

  :deep(.el-input-group__append) {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: $tomato-main;
    border: none;
    box-shadow: none;
    color: #fff;
    padding: 0 25px;

    .search-btn {
      color: #fff;
      font-weight: bold;
      &:hover {
        background: transparent;
      }
    }
  }
}

.hot-tags {
  margin-top: 6px;
  padding-left: 12px;
  font-size: 12px;
  color: #999;

  a {
    color: #757575;
    margin-right: 15px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: $tomato-main;
    }

    &.highlight {
      color: $tomato-main;
    }
  }
}

/* 3. 右侧导航样式 */
.nav-actions {
  display: flex;
  align-items: center;
  height: 40px; /* 约束高度便于对齐 */

  .nav-link {
    font-size: 15px;
    color: #555;

    &:hover {
      color: $tomato-main;
    }
  }

  /* 购物车按钮 */
  .cart-badge {
    margin-left: 15px;
    margin-right: 5px;

    :deep(.el-badge__content) {
      background-color: $tomato-main;
      border: 1px solid #fff;
    }

    .cart-btn {
      border-color: #dcdfe6;
      color: #555;
      padding: 8px 18px;
      transition: all 0.3s;

      .el-icon { margin-right: 4px; font-size: 16px; }

      &:hover {
        color: $tomato-main;
        border-color: $tomato-main;
        background-color: color.adjust($tomato-main, $lightness: 45%);
      }
    }
  }

  .nav-divider {
    height: 18px;
    margin: 0 15px;
    border-color: #ddd;
  }
}

/* 用户菜单胶囊 */
.user-area {
  display: flex;
  align-items: center;

  .user-profile {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 8px 4px 4px;
    border-radius: 24px;
    transition: background 0.2s;
    border: 1px solid transparent;

    &:hover {
      background: #f0f0f0;
      border-color: #ebebeb;
    }

    .user-info {
      margin-left: 8px;
      display: flex;
      flex-direction: column;
      line-height: 1.2;

      .name {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }

      .arrow {
        font-size: 10px;
        color: #999;
        margin-top: 2px;
      }
    }
  }

  /* 未登录按钮 */
  .auth-links {
    .login-link {
      color: #666;
      font-size: 14px;
      &:hover { color: $tomato-main; }
    }

    .reg-btn {
      background-color: $tomato-main;
      border-color: $tomato-main;
      margin-left: 10px;
      padding: 8px 20px;
      font-size: 14px;

      &:hover {
        background-color: $tomato-dark;
        border-color: $tomato-dark;
      }
    }
  }
}

/* ================= 主体与页脚 (保持不变或微调) ================= */
.main-body {
  background-color: $gray-bg;
  padding: 0;
  flex: 1;
}

.site-footer {
  background-color: #fff;
  padding: 0;
  margin-top: auto;
  border-top: 1px solid $border-color;
  color: #616161;
}

.service-features {
  padding: 30px 0;
  border-bottom: 1px solid $border-color;
  display: flex;
  justify-content: center;
  background-color: #fff; /* 纯白背景更显干净 */

  .feature-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20%;
    border-right: 1px solid #eee;
    font-size: 16px;
    color: #333;

    &:last-child { border-right: none; }
    .el-icon { margin-right: 8px; font-size: 26px; color: #333; }
    span { font-weight: 500; }
  }
}

.footer-main {
  width: $layout-width;
  margin: 0 auto;
  padding: 45px 0;
  display: flex;
  justify-content: space-between;
}

.footer-links-area {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  gap: 90px;

  dt { font-size: 15px; color: #333; margin-bottom: 22px; font-weight: 600; }
  dd a {
    color: #757575;
    font-size: 13px;
    text-decoration: none;
    line-height: 2.2;
    &:hover { color: $tomato-main; }
  }
}

.footer-contact {
  width: 260px;
  text-align: center;

  .phone { font-size: 24px; color: $tomato-main; margin: 0 0 5px; font-weight: 700; }
  .desc { font-size: 12px; color: #757575; margin-bottom: 18px; }
  .contact-btn {
    border-color: $tomato-main;
    color: $tomato-main;
    padding: 18px 25px;
    &:hover { background-color: $tomato-main; color: #fff; }
  }
}

.copyright-bar {
  background-color: #333; /* 改为深色底，更正式 */
  color: #999;
  padding: 25px 0;
  text-align: center;
  font-size: 12px;

  .info-text {
    margin-bottom: 10px;
    span { margin: 0 5px; cursor: pointer; &:hover { color: #fff; } }
    .divider { color: #555; }
  }
}
</style>