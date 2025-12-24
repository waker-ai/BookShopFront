<template>
  <div class="user-center-container">
    <el-row :gutter="24">

      <!-- 左侧：个人信息与导航 -->
      <el-col :span="6" :xs="24">
        <el-card class="user-sidebar" :body-style="{ padding: 0 }">
          <!-- 顶部背景图 -->
          <div class="user-header-bg"></div>

          <div class="user-profile">
            <el-avatar :size="72" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="avatar" />
            <h3 class="username">陈明博</h3>
            <div class="vip-badge">
              <el-icon><Trophy /></el-icon> 黄金会员
            </div>

            <!-- 资产概览 -->
            <div class="assets-overview">
              <div class="asset-item">
                <span class="num">¥258.00</span>
                <span class="label">余额</span>
              </div>
              <div class="asset-divider"></div>
              <div class="asset-item">
                <span class="num">1,240</span>
                <span class="label">积分</span>
              </div>
            </div>

            <el-button type="primary" round class="recharge-btn" @click="rechargeDialog = true">
              立即充值
            </el-button>
          </div>

          <!-- 导航菜单 -->
          <div class="menu-wrapper">
            <el-menu
                :default-active="activeMenu"
                class="custom-menu"
                @select="val => activeMenu = val"
            >
              <el-menu-item index="orders">
                <el-icon><List /></el-icon> <span>我的订单</span>
              </el-menu-item>
              <el-menu-item index="address">
                <el-icon><Location /></el-icon> <span>地址管理</span>
              </el-menu-item>
              <el-menu-item index="profile">
                <el-icon><User /></el-icon> <span>账号设置</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：内容操作区 -->
      <el-col :span="18" :xs="24">
        <el-card class="main-card">

          <!-- 1. 历史订单 -->
          <div v-if="activeMenu === 'orders'" class="fade-in">
            <div class="section-header">
              <h3>我的订单</h3>
            </div>

            <el-tabs v-model="orderTab" class="order-tabs">
              <el-tab-pane label="全部订单" name="all"></el-tab-pane>
              <el-tab-pane label="待付款" name="unpaid"></el-tab-pane>
              <el-tab-pane label="待收货" name="shipped"></el-tab-pane>
            </el-tabs>

            <el-table :data="filteredOrders" style="width: 100%" :header-cell-style="{background:'#f9fafc'}">
              <el-table-column label="商品信息" width="320">
                <template #default="scope">
                  <div class="product-cell">
                    <el-image :src="scope.row.cover" class="product-img" />
                    <div class="product-info">
                      <div class="p-title">{{ scope.row.title }}</div>
                      <div class="p-meta">{{ scope.row.count }} 本</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="下单日期" width="120" />
              <el-table-column label="实付金额" width="120">
                <template #default="scope">
                  <span class="price-text">¥{{ scope.row.total }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" align="center">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)" effect="light" round>
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default>
                  <el-button link type="primary">详情</el-button>
                  <el-divider direction="vertical" />
                  <el-button link type="info">售后</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 2. 地址管理 -->
          <div v-if="activeMenu === 'address'" class="fade-in">
            <div class="section-header">
              <h3>收货地址</h3>
              <el-button type="primary" plain icon="Plus">新增地址</el-button>
            </div>

            <el-row :gutter="20">
              <!-- 模拟地址卡片 -->
              <el-col :span="12" v-for="addr in addressList" :key="addr.id">
                <div class="address-card" :class="{ 'is-default': addr.isDefault }">
                  <div class="addr-header">
                    <span class="addr-name">{{ addr.name }}</span>
                    <span class="addr-tag" v-if="addr.tag">{{ addr.tag }}</span>
                    <el-tag size="small" type="danger" v-if="addr.isDefault" effect="dark" class="default-badge">默认</el-tag>
                  </div>
                  <div class="addr-detail">
                    <p>{{ addr.phone }}</p>
                    <p>{{ addr.province }} {{ addr.city }} {{ addr.district }}</p>
                    <p>{{ addr.detail }}</p>
                  </div>
                  <div class="addr-actions">
                    <el-button link type="primary" size="small">编辑</el-button>
                    <el-button link type="danger" size="small">删除</el-button>
                  </div>
                </div>
              </el-col>
              <!-- 添加新地址占位符 -->
              <el-col :span="12">
                <div class="address-card add-new">
                  <el-icon :size="30"><Plus /></el-icon>
                  <p>添加新地址</p>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 3. 账号设置 (示例) -->
          <div v-if="activeMenu === 'profile'" class="fade-in">
            <div class="section-header">
              <h3>账号设置</h3>
            </div>
            <el-form label-position="top" style="max-width: 400px">
              <el-form-item label="昵称">
                <el-input model-value="陈明博" />
              </el-form-item>
              <el-form-item label="绑定手机">
                <el-input model-value="138****8888" disabled>
                  <template #append><el-button>修改</el-button></template>
                </el-input>
              </el-form-item>
              <el-button type="primary">保存修改</el-button>
            </el-form>
          </div>

        </el-card>
      </el-col>
    </el-row>

    <!-- 充值弹窗 -->
    <el-dialog v-model="rechargeDialog" title="会员余额充值" width="500px" center custom-class="recharge-dialog">
      <div class="recharge-container">
        <p class="balance-tip">当前余额：<span class="highlight">¥258.00</span></p>

        <div class="amount-grid">
          <div
              class="amount-card"
              v-for="item in rechargeOptions"
              :key="item.value"
              :class="{ active: rechargeAmount === item.value }"
              @click="rechargeAmount = item.value"
          >
            <div class="price">¥{{ item.value }}</div>
            <div class="desc">{{ item.desc }}</div>
            <div class="checked-icon" v-if="rechargeAmount === item.value">
              <el-icon><Check /></el-icon>
            </div>
          </div>
        </div>

        <div class="payment-summary">
          应付金额：<span class="total-price">¥{{ rechargeAmount }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="rechargeDialog = false" size="large">取消</el-button>
        <el-button type="primary" @click="handleRecharge" size="large" color="#ff6700" style="color:white; padding: 0 40px;">
          立即支付
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Trophy, List, Location, User, Plus, Check
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const activeMenu = ref('orders')
const orderTab = ref('all')
const rechargeDialog = ref(false)
const rechargeAmount = ref('100')

// 模拟数据
const orderHistory = ref([
  { id: 'ORD-001', title: '深入理解计算机系统', count: 1, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100', date: '2023-06-01', total: '89.00', status: '已完成' },
  { id: 'ORD-002', title: 'JavaScript高级程序设计 等3件', count: 3, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=100', date: '2023-06-05', total: '258.00', status: '配送中' },
  { id: 'ORD-003', title: 'Vue.js设计与实现', count: 1, cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=100', date: '2023-06-10', total: '79.00', status: '待付款' },
])

const addressList = ref([
  { id: 1, name: '陈明博', phone: '138****0000', province: '北京市', city: '北京市', district: '海淀区', detail: '学院路37号北京航空航天大学', tag: '学校', isDefault: true },
  { id: 2, name: '陈同学', phone: '139****1111', province: '上海市', city: '上海市', district: '浦东新区', detail: '张江高科园区', tag: '公司', isDefault: false },
])

const rechargeOptions = [
  { value: '100', desc: '送 500 积分' },
  { value: '300', desc: '送 2000 积分' },
  { value: '500', desc: '送 黄金会员' },
  { value: '1000', desc: '送 钻石会员' },
]

// 简单的筛选逻辑
const filteredOrders = computed(() => {
  if (orderTab.value === 'all') return orderHistory.value
  if (orderTab.value === 'unpaid') return orderHistory.value.filter(o => o.status === '待付款')
  if (orderTab.value === 'shipped') return orderHistory.value.filter(o => ['配送中', '待发货'].includes(o.status))
  return []
})

const getStatusType = (status) => {
  const map = {
    '已完成': 'success',
    '配送中': 'primary',
    '待付款': 'warning'
  }
  return map[status] || 'info'
}

const handleRecharge = () => {
  rechargeDialog.value = false
  ElMessage.success(`成功充值 ¥${rechargeAmount.value}，会员权益已到账！`)
}
</script>

<style scoped lang="scss">
$primary-color: #ff6700;
$bg-color: #f5f7fa;

.user-center-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

/* --- 侧边栏样式 --- */
.user-sidebar {
  border: none;
  overflow: hidden;
  margin-bottom: 20px;

  .user-header-bg {
    height: 100px;
    background: linear-gradient(135deg, #ff9966 0%, #ff5e62 100%);
  }

  .user-profile {
    text-align: center;
    position: relative;
    padding-bottom: 25px;
    border-bottom: 1px solid #f0f0f0;

    .avatar {
      margin-top: -36px;
      border: 4px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      background: #fff;
    }

    .username {
      margin: 10px 0 5px;
      font-size: 18px;
      color: #333;
    }

    .vip-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #fff5e6;
      color: #faad14;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }

    .assets-overview {
      display: flex;
      justify-content: center;
      margin: 20px 0;

      .asset-item {
        text-align: center;
        padding: 0 15px;
        .num { display: block; font-weight: bold; font-size: 16px; color: #333; }
        .label { font-size: 12px; color: #999; }
      }

      .asset-divider {
        width: 1px;
        background: #eee;
        height: 30px;
      }
    }

    .recharge-btn {
      background-color: $primary-color;
      border-color: $primary-color;
      padding: 8px 30px;

      &:hover {
        background-color: darken($primary-color, 5%);
      }
    }
  }
}

.custom-menu {
  border-right: none;
  padding: 10px;

  :deep(.el-menu-item) {
    border-radius: 8px;
    margin-bottom: 5px;
    height: 50px;

    &.is-active {
      background-color: #fff0e6;
      color: $primary-color;
      font-weight: 600;
    }

    &:hover:not(.is-active) {
      background-color: #f8f8f8;
    }
  }
}

/* --- 右侧主内容 --- */
.main-card {
  min-height: 600px;
  border: none;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 15px;

    h3 { margin: 0; font-size: 20px; color: #333; }
  }
}

/* 订单表格样式 */
.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;

  .product-img {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    border: 1px solid #eee;
  }

  .product-info {
    .p-title { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
    .p-meta { font-size: 12px; color: #999; }
  }
}
.price-text {
  font-weight: bold;
  color: #333;
}

/* 地址卡片样式 */
.address-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
  transition: all 0.3s;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    border-color: #ccc;
  }

  &.is-default {
    border-color: $primary-color;
    background-color: #fffaf7;
  }

  &.add-new {
    border: 1px dashed #ccc;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #999;

    &:hover {
      border-color: $primary-color;
      color: $primary-color;
    }
  }

  .addr-header {
    display: flex;
    align-items: center;
    gap: 8px;
    .addr-name { font-weight: bold; font-size: 16px; }
    .addr-tag { background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #666; }
  }

  .addr-detail {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    margin-top: 10px;
  }

  .addr-actions {
    text-align: right;
    margin-top: 10px;
  }
}

/* --- 充值弹窗 --- */
.recharge-container {
  .balance-tip { text-align: center; font-size: 16px; margin-bottom: 20px; }
  .highlight { color: $primary-color; font-weight: bold; font-size: 20px; }

  .amount-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 30px;
  }

  .amount-card {
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;

    &:hover { border-color: $primary-color; }
    &.active {
      border-color: $primary-color;
      background-color: #fff0e6;
      color: $primary-color;
    }

    .price { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
    .desc { font-size: 12px; color: #999; }

    .checked-icon {
      position: absolute;
      right: 0;
      bottom: 0;
      background: $primary-color;
      color: white;
      border-radius: 8px 0 8px 0; /* 右下角切角效果 */
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  }

  .payment-summary {
    text-align: right;
    font-size: 16px;
    .total-price { color: #f56c6c; font-size: 28px; font-weight: bold; }
  }
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>