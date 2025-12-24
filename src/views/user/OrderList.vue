<template>
  <div class="order-list-page">
    <div class="container">
      <el-card class="order-card-container">
        <template #header>
          <div class="card-header">
            <span>我的订单</span>
          </div>
        </template>

        <!-- 状态筛选 Tabs -->
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="全部订单" name="all"></el-tab-pane>
          <el-tab-pane label="待付款" name="pending"></el-tab-pane>
          <el-tab-pane label="待发货" name="paid"></el-tab-pane>
          <el-tab-pane label="待收货" name="shipped"></el-tab-pane>
          <el-tab-pane label="已完成" name="completed"></el-tab-pane>
        </el-tabs>

        <!-- 订单列表 -->
        <div class="order-list">
          <div v-for="order in filteredOrders" :key="order.id" class="order-item">

            <!-- 订单头 -->
            <div class="order-header">
              <span class="order-time">{{ order.date }}</span>
              <span class="order-id">订单号：{{ order.id }}</span>
              <span class="order-status" :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </span>
            </div>

            <!-- 订单商品主体 -->
            <div class="order-body">
              <div class="product-list">
                <div v-for="item in order.items" :key="item.id" class="product-item">
                  <el-image :src="item.cover" class="product-img" fit="cover" />
                  <div class="product-info">
                    <div class="p-name">{{ item.title }}</div>
                    <div class="p-sku">x {{ item.count }}</div>
                  </div>
                  <div class="p-price">¥ {{ item.price }}</div>
                </div>
              </div>

              <!-- 订单金额与操作 -->
              <div class="order-actions-col">
                <div class="total-price">
                  总额: <span class="price-num">¥{{ order.total }}</span>
                </div>
                <div class="btn-group">
                  <el-button v-if="order.status === 'pending'" type="primary" round plain size="small" color="#ff6700">立即付款</el-button>
                  <el-button v-if="order.status === 'shipped'" type="primary" round plain size="small">确认收货</el-button>
                  <el-button v-if="['completed', 'cancelled'].includes(order.status)" round size="small">删除订单</el-button>
                  <el-button link size="small">查看详情</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <el-empty v-if="filteredOrders.length === 0" description="暂无相关订单" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')

// Mock 数据
const orders = ref([
  {
    id: '202505010001',
    date: '2025-05-01 14:20:00',
    status: 'pending', // pending, paid, shipped, completed
    total: 138.00,
    items: [
      { id: 1, title: '深入理解计算机系统', price: 138.00, count: 1, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100' }
    ]
  },
  {
    id: '202504280056',
    date: '2025-04-28 09:15:30',
    status: 'completed',
    total: 89.00,
    items: [
      { id: 2, title: 'Vue.js设计与实现', price: 89.00, count: 1, cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=100' }
    ]
  },
  {
    id: '202504250088',
    date: '2025-04-25 18:00:00',
    status: 'shipped',
    total: 156.00,
    items: [
      { id: 3, title: 'JavaScript高级程序设计', price: 78.00, count: 2, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=100' }
    ]
  }
])

// 筛选逻辑
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeTab.value)
})

const handleTabClick = (tab) => {
  console.log('Switch tab:', tab.props.name)
}

// 辅助函数
const getStatusText = (status) => {
  const map = { pending: '待付款', paid: '待发货', shipped: '待收货', completed: '已完成', cancelled: '已取消' }
  return map[status]
}

const getStatusClass = (status) => {
  const map = { pending: 'text-danger', paid: 'text-warning', shipped: 'text-primary', completed: 'text-success' }
  return map[status] || ''
}
</script>

<style scoped lang="scss">
.order-list-page {
  padding: 20px 0;
  .container { width: 1200px; margin: 0 auto; }
}

.order-item {
  border: 1px solid #e4e7ed;
  margin-bottom: 20px;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border-color: #ff6700;
  }
}

.order-header {
  background: #f5f7fa;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
  border-bottom: 1px solid #e4e7ed;

  .order-id { margin-left: 20px; flex: 1; }
  .order-status { font-weight: bold; }
}

.order-body {
  display: flex;
  padding: 20px;
}

.product-list {
  flex: 1;
  border-right: 1px solid #f0f0f0;
  padding-right: 20px;
}

.product-item {
  display: flex;
  margin-bottom: 15px;
  &:last-child { margin-bottom: 0; }

  .product-img { width: 60px; height: 60px; border-radius: 4px; border: 1px solid #eee; }
  .product-info { flex: 1; margin-left: 15px; display: flex; flex-direction: column; justify-content: center; }
  .p-name { font-size: 14px; color: #333; margin-bottom: 4px; }
  .p-sku { font-size: 12px; color: #999; }
  .p-price { font-size: 14px; color: #666; line-height: 60px; width: 80px; text-align: right; }
}

.order-actions-col {
  width: 180px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .total-price {
    margin-bottom: 10px;
    font-size: 13px;
    color: #666;
    .price-num { font-size: 18px; color: #333; font-weight: bold; }
  }

  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    :deep(.el-button) { margin-left: 0; }
  }
}

/* 状态颜色工具类 */
.text-danger { color: #f56c6c; }
.text-warning { color: #e6a23c; }
.text-success { color: #67c23a; }
.text-primary { color: #409eff; }
</style>