<template>
  <div class="user-center-page">
    <div class="container">
      <el-row :gutter="24">

        <!-- 1. 左侧：个人信息与导航 (侧边栏) -->
        <el-col :span="6" :xs="24">
          <div class="sidebar-wrapper">
            <!-- 个人资料卡 -->
            <div class="profile-card">
              <div class="profile-header">
                <div class="bg-pattern"></div>
                <div class="avatar-container">
                  <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="avatar" />
                  <div class="vip-tag">
                    <el-icon><Diamond /></el-icon> SVIP
                  </div>
                </div>
                <h3 class="username">陈明博</h3>
                <p class="user-id">ID: 88593021</p>
              </div>

              <!-- 资产数据 -->
              <div class="assets-row">
                <div class="asset-col">
                  <span class="num">258.00</span>
                  <span class="label">余额</span>
                </div>
                <div class="divider"></div>
                <div class="asset-col">
                  <span class="num">1,240</span>
                  <span class="label">积分</span>
                </div>
                <div class="divider"></div>
                <div class="asset-col">
                  <span class="num">3</span>
                  <span class="label">优惠券</span>
                </div>
              </div>

              <div class="card-footer">
                <el-button class="recharge-btn" round @click="rechargeDialog = true">
                  <el-icon><Wallet /></el-icon> 立即充值
                </el-button>
              </div>
            </div>

            <!-- 导航菜单 -->
            <div class="nav-menu">
              <div
                  v-for="item in menuItems"
                  :key="item.key"
                  class="menu-item"
                  :class="{ active: activeMenu === item.key }"
                  @click="activeMenu = item.key"
              >
                <el-icon class="menu-icon"><component :is="item.icon" /></el-icon>
                <span class="menu-text">{{ item.label }}</span>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 2. 右侧：主内容区 -->
        <el-col :span="18" :xs="24">
          <div class="main-content-wrapper">

            <!-- 模块 1: 我的订单 -->
            <transition name="fade-slide" mode="out-in">
              <div v-if="activeMenu === 'orders'" key="orders" class="content-panel">
                <div class="panel-header">
                  <h3>我的订单</h3>
                  <div class="header-extra">
                    <el-input
                        placeholder="搜索订单号或商品..."
                        prefix-icon="Search"
                        v-model="searchQuery"
                        class="search-input"
                    />
                  </div>
                </div>

                <el-tabs v-model="orderTab" class="custom-tabs">
                  <el-tab-pane label="全部订单" name="all" />
                  <el-tab-pane label="待付款" name="unpaid" />
                  <el-tab-pane label="待发货" name="shipped" />
                  <el-tab-pane label="已完成" name="completed" />
                </el-tabs>

                <div class="order-list">
                  <div v-for="order in filteredOrders" :key="order.id" class="order-card">
                    <div class="order-header">
                      <span class="order-time">{{ order.date }}</span>
                      <span class="order-no">订单号：{{ order.id }}</span>
                      <span class="order-status" :class="getStatusClass(order.status)">{{ order.status }}</span>
                    </div>

                    <div class="order-body">
                      <div class="product-info">
                        <img :src="order.cover" class="cover-img" />
                        <div class="info-text">
                          <h4>{{ order.title }}</h4>
                          <p class="specs">{{ order.count }} 件商品 | 在线支付</p>
                        </div>
                      </div>
                      <div class="order-price">
                        <span class="label">实付</span>
                        <span class="price">¥{{ order.total }}</span>
                      </div>
                      <div class="order-actions">
                        <el-button v-if="order.status === '待付款'" type="danger" size="small" round>立即付款</el-button>
                        <el-button v-if="order.status === '已完成'" size="small" round>评价</el-button>
                        <el-button size="small" round>查看详情</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 模块 2: 地址管理 -->
              <div v-else-if="activeMenu === 'address'" key="address" class="content-panel">
                <div class="panel-header">
                  <h3>地址管理</h3>
                  <el-button type="primary" icon="Plus" circle class="add-btn" />
                </div>

                <div class="address-grid">
                  <div
                      v-for="addr in addressList"
                      :key="addr.id"
                      class="addr-card"
                      :class="{ default: addr.isDefault }"
                  >
                    <div class="addr-top">
                      <span class="name">{{ addr.name }}</span>
                      <span class="phone">{{ addr.phone }}</span>
                      <span v-if="addr.isDefault" class="def-badge">默认</span>
                      <span v-if="addr.tag" class="tag-badge">{{ addr.tag }}</span>
                    </div>
                    <div class="addr-details">
                      {{ addr.province }} {{ addr.city }} {{ addr.district }}<br/>
                      {{ addr.detail }}
                    </div>
                    <div class="addr-bottom">
                      <el-link :underline="false" type="primary">编辑</el-link>
                      <el-link :underline="false" type="danger">删除</el-link>
                    </div>
                  </div>

                  <!-- 新增卡片 -->
                  <div class="addr-card add-new">
                    <div class="icon-wrap"><el-icon><Plus /></el-icon></div>
                    <p>添加新地址</p>
                  </div>
                </div>
              </div>

              <!-- 模块 3: 账号设置 -->
              <div v-else-if="activeMenu === 'profile'" key="profile" class="content-panel">
                <div class="panel-header"><h3>账号设置</h3></div>
                <div class="profile-form-wrap">
                  <el-form label-position="top" class="custom-form">
                    <el-form-item label="用户昵称">
                      <el-input model-value="陈明博" />
                    </el-form-item>
                    <el-form-item label="绑定手机">
                      <div class="phone-box">
                        <el-input model-value="138****8888" disabled />
                        <el-button link type="primary">更换</el-button>
                      </div>
                    </el-form-item>
                    <el-form-item label="登录密码">
                      <div class="pwd-box">
                        <span>********</span>
                        <el-button link type="primary">修改密码</el-button>
                      </div>
                    </el-form-item>
                    <el-button type="primary" class="save-btn">保存更改</el-button>
                  </el-form>
                </div>
              </div>
            </transition>

          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 充值弹窗 -->
    <el-dialog v-model="rechargeDialog" title="账户充值" width="480px" custom-class="custom-dialog" center>
      <div class="recharge-content">
        <div class="balance-card">
          <span>当前余额</span>
          <span class="bal-num">¥258.00</span>
        </div>
        <p class="select-label">选择充值金额</p>
        <div class="amount-options">
          <div
              v-for="opt in rechargeOptions"
              :key="opt.value"
              class="amt-item"
              :class="{ active: rechargeAmount === opt.value }"
              @click="rechargeAmount = opt.value"
          >
            <div class="val">¥{{ opt.value }}</div>
            <div class="gift" v-if="opt.desc">{{ opt.desc }}</div>
            <div class="corner-mark" v-if="rechargeAmount === opt.value">
              <el-icon><Check /></el-icon>
            </div>
          </div>
        </div>
        <div class="pay-btn-area">
          <el-button type="primary" size="large" class="pay-btn" @click="handleRecharge">
            立即支付 ¥{{ rechargeAmount }}
          </el-button>
          <p class="pay-tip">点击支付即代表同意《用户充值协议》</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Diamond, Wallet, List, Location, User, Setting, ArrowRight,
  Search, Plus, Check
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const activeMenu = ref('orders')
const orderTab = ref('all')
const rechargeDialog = ref(false)
const rechargeAmount = ref('100')
const searchQuery = ref('')

// 菜单配置
const menuItems = [
  { key: 'orders', label: '我的订单', icon: List },
  { key: 'address', label: '收货地址', icon: Location },
  { key: 'profile', label: '账号设置', icon: User },
]

// 模拟数据
const orderHistory = ref([
  { id: 'ORD-20231102-001', title: '深入理解计算机系统（原书第3版）', count: 1, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100', date: '2023-11-02 14:30', total: '89.00', status: '已完成' },
  { id: 'ORD-20231105-089', title: 'JavaScript高级程序设计 等3件', count: 3, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=100', date: '2023-11-05 09:12', total: '258.00', status: '待发货' },
  { id: 'ORD-20231108-123', title: 'Vue.js设计与实现', count: 1, cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=100', date: '2023-11-08 18:20', total: '79.00', status: '待付款' },
])

const addressList = ref([
  { id: 1, name: '陈明博', phone: '138****0000', province: '北京市', city: '北京市', district: '海淀区', detail: '学院路37号北京航空航天大学', tag: '学校', isDefault: true },
  { id: 2, name: '陈同学', phone: '139****1111', province: '上海市', city: '上海市', district: '浦东新区', detail: '张江高科园区 2号楼', tag: '公司', isDefault: false },
])

const rechargeOptions = [
  { value: '100', desc: '送 500 积分' },
  { value: '300', desc: '送 2000 积分' },
  { value: '500', desc: '送 SVIP 月卡' },
  { value: '1000', desc: '送 SVIP 季卡' },
]

// 计算属性
const filteredOrders = computed(() => {
  let list = orderHistory.value
  if (orderTab.value === 'unpaid') list = list.filter(o => o.status === '待付款')
  if (orderTab.value === 'shipped') list = list.filter(o => o.status === '待发货')
  if (orderTab.value === 'completed') list = list.filter(o => o.status === '已完成')

  if (searchQuery.value) {
    list = list.filter(o => o.id.includes(searchQuery.value) || o.title.includes(searchQuery.value))
  }
  return list
})

const getStatusClass = (status) => {
  if (status === '已完成') return 'status-success'
  if (status === '待付款') return 'status-warning'
  return 'status-primary'
}

const handleRecharge = () => {
  rechargeDialog.value = false
  ElMessage.success({
    message: `成功充值 ¥${rechargeAmount.value}，积分已到账！`,
    type: 'success',
  })
}
</script>

<style scoped lang="scss">
$primary-color: #ff6700;
$text-main: #333;
$text-light: #999;
$bg-gray: #f5f7fa;

.user-center-page {
  background-color: $bg-gray;
  min-height: 100vh;
  padding: 30px 0 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ================= 左侧 Sidebar ================= */
.sidebar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 个人卡片 */
.profile-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  overflow: hidden;
  text-align: center;
  padding-bottom: 24px;

  .profile-header {
    position: relative;
    margin-bottom: 20px;

    .bg-pattern {
      height: 80px;
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
    }

    .avatar-container {
      position: relative;
      display: inline-block;
      margin-top: -40px;

      .avatar { border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
      .vip-tag {
        position: absolute; bottom: 0; right: -10px;
        background: #333; color: #ffd700;
        font-size: 10px; padding: 2px 8px; border-radius: 10px;
        border: 2px solid #fff; display: flex; align-items: center; gap: 2px;
      }
    }

    .username { margin: 12px 0 4px; font-size: 18px; color: #333; font-weight: 700; }
    .user-id { margin: 0; font-size: 12px; color: #999; }
  }

  .assets-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;

    .asset-col {
      padding: 0 15px;
      .num { display: block; font-size: 16px; font-weight: 700; color: #333; }
      .label { font-size: 12px; color: #999; margin-top: 2px; }
    }
    .divider { width: 1px; height: 20px; background: #eee; }
  }

  .recharge-btn {
    background: linear-gradient(90deg, #ff6700, #ff8c00);
    border: none; color: #fff;
    padding: 10px 40px;
    box-shadow: 0 4px 10px rgba(255, 103, 0, 0.3);
    &:hover { opacity: 0.9; transform: translateY(-1px); }
  }
}

/* 导航菜单 */
.nav-menu {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);

  .menu-item {
    display: flex; align-items: center;
    padding: 14px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: #666;
    margin-bottom: 4px;

    .menu-icon { font-size: 18px; margin-right: 12px; }
    .menu-text { flex: 1; font-size: 15px; font-weight: 500; }
    .arrow-icon { font-size: 14px; opacity: 0; transition: opacity 0.2s; }

    &:hover { background: #fff7f2; color: $primary-color; .arrow-icon { opacity: 1; } }
    &.active {
      background: #fff0e6; color: $primary-color; font-weight: 600;
      .arrow-icon { opacity: 1; }
    }
  }
}

/* ================= 右侧内容区 ================= */
.main-content-wrapper {
  background: #fff;
  border-radius: 12px;
  min-height: 600px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.panel-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24px;
  h3 { margin: 0; font-size: 20px; color: #333; position: relative; padding-left: 12px; }
  h3::before {
    content: ''; position: absolute; left: 0; top: 4px; bottom: 4px; width: 4px;
    background: $primary-color; border-radius: 2px;
  }
  .search-input { width: 220px; }
}

/* 订单卡片 */
.order-list {
  margin-top: 20px;
  display: flex; flex-direction: column; gap: 20px;
}
.order-card {
  border: 1px solid #eee; border-radius: 8px; overflow: hidden;
  transition: all 0.2s;
  &:hover { border-color: #ddd; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

  .order-header {
    background: #f9fafc; padding: 10px 20px;
    font-size: 12px; color: #999;
    display: flex; justify-content: space-between;
    .order-status { font-weight: 600; }
    .status-success { color: #67c23a; }
    .status-warning { color: #e6a23c; }
    .status-primary { color: $primary-color; }
  }

  .order-body {
    padding: 20px; display: flex; align-items: center;

    .product-info {
      flex: 1; display: flex; align-items: center; gap: 15px;
      .cover-img { width: 60px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid #f0f0f0; }
      .info-text {
        h4 { margin: 0 0 6px; font-size: 15px; color: #333; }
        .specs { margin: 0; font-size: 12px; color: #999; }
      }
    }

    .order-price {
      width: 120px; text-align: center;
      .label { display: block; font-size: 12px; color: #999; }
      .price { font-size: 16px; font-weight: 700; color: #333; }
    }

    .order-actions {
      width: 180px; display: flex; gap: 8px; justify-content: flex-end;
    }
  }
}

/* 地址管理 */
.address-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
}
.addr-card {
  border: 1px solid #eee; border-radius: 8px; padding: 20px;
  position: relative; transition: all 0.2s;
  display: flex; flex-direction: column;

  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); border-color: #ddd; }
  &.default {
    background: #fffaf7; border-color: #ffdab3;
    &::after {
      content: '默认'; position: absolute; right: 0; top: 0;
      background: $primary-color; color: #fff; font-size: 12px;
      padding: 2px 8px; border-radius: 0 8px 0 8px;
    }
  }

  .addr-top {
    margin-bottom: 10px;
    .name { font-size: 16px; font-weight: 700; margin-right: 10px; }
    .tag-badge { background: #f0f0f0; font-size: 12px; padding: 2px 6px; border-radius: 4px; color: #666; margin-left: 8px; }
  }
  .addr-details { font-size: 14px; color: #666; line-height: 1.5; flex: 1; }
  .addr-bottom { margin-top: 15px; display: flex; gap: 15px; }

  &.add-new {
    border: 1px dashed #ccc; justify-content: center; align-items: center; cursor: pointer; color: #999; min-height: 160px;
    .icon-wrap { font-size: 24px; margin-bottom: 8px; }
    &:hover { border-color: $primary-color; color: $primary-color; }
  }
}

/* 账号设置表单 */
.profile-form-wrap { max-width: 480px; }
.custom-form {
  .phone-box, .pwd-box { display: flex; align-items: center; gap: 15px; width: 100%; }
  .save-btn { margin-top: 20px; padding: 10px 30px; }
}

/* 充值弹窗内容 */
.recharge-content {
  .balance-card {
    background: #f9f9f9; padding: 15px; border-radius: 8px;
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 20px;
    .bal-num { font-size: 20px; font-weight: bold; color: $primary-color; }
  }
  .select-label { font-size: 14px; color: #666; margin-bottom: 10px; }

  .amount-options {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;
    .amt-item {
      border: 1px solid #eee; border-radius: 8px; padding: 15px; text-align: center;
      cursor: pointer; position: relative; transition: all 0.2s; overflow: hidden;

      .val { font-size: 20px; font-weight: bold; color: #333; }
      .gift { font-size: 12px; color: #f56c6c; margin-top: 4px; }

      &.active {
        border-color: $primary-color; background: #fff5eb;
        .val { color: $primary-color; }
      }
      .corner-mark {
        position: absolute; bottom: 0; right: 0;
        background: $primary-color; color: #fff;
        width: 24px; height: 20px; border-radius: 10px 0 0 0;
        display: flex; align-items: center; justify-content: center; font-size: 12px;
      }
    }
  }

  .pay-btn-area {
    text-align: center;
    .pay-btn { width: 100%; height: 44px; font-size: 16px; font-weight: 600; border-radius: 22px; background: $primary-color; border-color: $primary-color; }
    .pay-tip { font-size: 12px; color: #ccc; margin-top: 10px; }
  }
}

/* 动画效果 */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }

/* 移动端适配 */
@media (max-width: 768px) {
  .address-grid { grid-template-columns: 1fr; }
  .order-body {
    flex-direction: column; align-items: flex-start;
    .order-price { width: 100%; text-align: left; margin: 10px 0; display: flex; justify-content: space-between; }
    .order-actions { width: 100%; }
  }
}
</style>