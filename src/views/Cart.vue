<template>
  <div class="cart-page">
    <div class="container">

      <!-- 1. 顶部标题区 (带进度步骤条) -->
      <div class="cart-header">
        <div class="header-left">
          <h2>我的购物车</h2>
          <span class="sub-text">共 <span class="count">{{ cartList.length }}</span> 件商品</span>
        </div>
        <div class="header-right">
          <span class="location-picker">
            <el-icon><Location /></el-icon> 配送至：<span class="addr">浙江省 杭州市 西湖区</span>
          </span>
        </div>
      </div>

      <!-- 2. 空状态 (优化版) -->
      <div v-if="cartList.length === 0" class="empty-cart-box">
        <el-empty image-size="200" description="购物车空空如也，快去填满它吧！">
          <template #image>
            <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" />
          </template>
          <div class="empty-actions">
            <el-button type="primary" size="large" round @click="$router.push('/')">去首页逛逛</el-button>
            <el-button round size="large">查看收藏夹</el-button>
          </div>
        </el-empty>
      </div>

      <!-- 3. 购物车主体 -->
      <div v-else class="cart-body">

        <!-- 表头 (自定义，模拟表格头部) -->
        <div class="cart-thead">
          <div class="th th-chk">
            <el-checkbox v-model="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll">全选</el-checkbox>
          </div>
          <div class="th th-item">商品信息</div>
          <div class="th th-price">单价</div>
          <div class="th th-amount">数量</div>
          <div class="th th-sum">小计</div>
          <div class="th th-op">操作</div>
        </div>

        <!-- 商品列表 (循环渲染) -->
        <div class="cart-list">
          <div
              v-for="(item, index) in cartList"
              :key="item.id"
              class="cart-item"
              :class="{ 'is-selected': isSelected(item) }"
          >
            <!-- 多选框 -->
            <div class="td td-chk">
              <el-checkbox
                  :model-value="isSelected(item)"
                  @change="(val) => handleItemSelect(val, item)"
              />
            </div>

            <!-- 商品详情 -->
            <div class="td td-item">
              <div class="item-pic" @click="goToDetail(item.id)">
                <img :src="item.cover" :alt="item.title" />
              </div>
              <div class="item-info">
                <a class="item-title" @click="goToDetail(item.id)" :title="item.title">{{ item.title }}</a>
                <div class="item-props">
                  <el-tag size="small" type="info" effect="plain">{{ item.version }}</el-tag>
                  <span v-if="item.stock < 10" class="stock-warning">仅剩 {{ item.stock }} 件</span>
                </div>
                <!-- 促销活动标签 (模拟) -->
                <div class="item-promo" v-if="item.tags">
                  <span class="promo-tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </div>

            <!-- 单价 -->
            <div class="td td-price">
              <div class="price-line">
                <span class="symbol">¥</span>{{ item.price.toFixed(2) }}
              </div>
              <div class="price-origin" v-if="item.originalPrice > item.price">
                ¥{{ item.originalPrice.toFixed(2) }}
              </div>
            </div>

            <!-- 数量操作 -->
            <div class="td td-amount">
              <el-input-number
                  v-model="item.quantity"
                  :min="1"
                  :max="item.stock"
                  size="small"
                  controls-position="right"
                  @change="calculateTotal"
              />
            </div>

            <!-- 小计 -->
            <div class="td td-sum">
              <span class="sum-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>

            <!-- 操作 -->
            <div class="td td-op">
              <el-tooltip content="移入收藏夹" placement="top">
                <el-button circle :icon="Star" size="small" class="op-btn" />
              </el-tooltip>
              <el-tooltip content="删除商品" placement="top">
                <el-button circle :icon="Delete" size="small" type="danger" plain class="op-btn" @click="handleDelete(index, item)" />
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. 底部吸底结算栏 -->
      <div class="cart-toolbar-wrap" :class="{ 'is-sticky': cartList.length > 0 }">
        <div class="cart-toolbar">
          <div class="toolbar-left">
            <el-checkbox v-model="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll">全选</el-checkbox>
            <a class="tool-link" @click="batchDelete">删除选中的商品</a>
            <a class="tool-link" @click="clearCart">清空购物车</a>
          </div>

          <div class="toolbar-right">
            <div class="amount-sum">
              已选择 <span class="highlight">{{ selectedItems.length }}</span> 件商品
            </div>
            <div class="price-sum">
              <span class="txt">合计（不含运费）：</span>
              <span class="price">
                <em>¥</em>{{ totalPrice.toFixed(2) }}
              </span>
            </div>
            <div class="btn-area">
              <el-button
                  type="primary"
                  class="checkout-btn"
                  :disabled="selectedItems.length === 0"
                  @click="$router.push('/checkout')"
              >
                去结算
              </el-button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Location, Star, Delete } from '@element-plus/icons-vue'

const router = useRouter()

// --- 数据 Mock ---
const cartList = ref([
  {
    id: 1,
    title: '软件工程与计算（卷二）：软件开发的技术基础',
    price: 89.00,
    originalPrice: 118.00,
    quantity: 1,
    stock: 50,
    version: '平装版',
    tags: ['满100减10'],
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200'
  },
  {
    id: 2,
    title: '深入理解计算机系统（CSAPP）原书第3版 程序员必读经典',
    price: 129.00,
    originalPrice: 159.00,
    quantity: 2,
    stock: 5,
    version: '精装版',
    tags: ['限时特惠'],
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'
  },
  {
    id: 3,
    title: 'JavaScript高级程序设计（第4版）前端红宝书',
    price: 99.00,
    originalPrice: 129.00,
    quantity: 1,
    stock: 100,
    version: '平装版',
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200'
  },
])

// --- 状态管理 ---
const selectedIds = ref(new Set()) // 使用 Set 存储选中的 ID

const selectedItems = computed(() => {
  return cartList.value.filter(item => selectedIds.value.has(item.id))
})

const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const isAllSelected = computed(() => {
  return cartList.value.length > 0 && selectedIds.value.size === cartList.value.length
})

const isIndeterminate = computed(() => {
  return selectedIds.value.size > 0 && selectedIds.value.size < cartList.value.length
})

// --- 方法 ---

const isSelected = (item) => selectedIds.value.has(item.id)

const handleItemSelect = (val, item) => {
  if (val) {
    selectedIds.value.add(item.id)
  } else {
    selectedIds.value.delete(item.id)
  }
}

const toggleSelectAll = (val) => {
  if (val) {
    cartList.value.forEach(item => selectedIds.value.add(item.id))
  } else {
    selectedIds.value.clear()
  }
}

const handleDelete = (index, item) => {
  ElMessageBox.confirm(
      `确定要删除 "${item.title}" 吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    cartList.value.splice(index, 1)
    selectedIds.value.delete(item.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

const batchDelete = () => {
  if (selectedItems.value.length === 0) return
  ElMessageBox.confirm(
      `确定要删除这 ${selectedItems.value.length} 件商品吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    cartList.value = cartList.value.filter(item => !selectedIds.value.has(item.id))
    selectedIds.value.clear()
    ElMessage.success('已批量删除')
  }).catch(() => {})
}

const clearCart = () => {
  ElMessageBox.confirm('确定清空购物车吗？', '警告', { type: 'warning' })
      .then(() => {
        cartList.value = []
        selectedIds.value.clear()
      })
      .catch(() => {})
}

const goToDetail = (id) => {
  router.push(`/product/${id}`)
}

// 用来强制刷新计算属性（某些极端情况）
const calculateTotal = () => {}

</script>

<style scoped lang="scss">
$tomato-main: #ff6700;
$border-color: #e5e5e5;
$bg-gray: #f5f7fa;

.cart-page {
  background-color: $bg-gray;
  min-height: 100vh;
  padding: 30px 0 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* --- Header --- */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .header-left {
    display: flex;
    align-items: baseline;
    h2 { font-size: 26px; color: #333; margin: 0; font-weight: 700; }
    .sub-text { margin-left: 12px; font-size: 14px; color: #999; .count { color: $tomato-main; font-weight: bold; margin: 0 2px; } }
  }

  .location-picker {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 13px;
    background: #fff;
    padding: 6px 12px;
    border-radius: 16px;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: all 0.2s;

    .el-icon { margin-right: 4px; font-size: 15px; }
    .addr { color: #333; margin-left: 5px; font-weight: 500; }

    &:hover { border-color: $tomato-main; color: $tomato-main; .addr { color: $tomato-main; } }
  }
}

/* --- Empty State --- */
.empty-cart-box {
  background: #fff;
  border-radius: 16px;
  padding: 80px 0;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);

  .empty-actions { margin-top: 20px; display: flex; justify-content: center; gap: 20px; }
}

/* --- Cart Body --- */
.cart-body {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  overflow: hidden;
  margin-bottom: 30px;
}

/* Thead (Flex模拟) */
.cart-thead {
  display: flex;
  padding: 18px 24px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  color: #666;
  font-size: 13px;
  font-weight: 600;

  .th { flex-shrink: 0; }
  .th-chk { width: 50px; }
  .th-item { flex: 1; }
  .th-price { width: 140px; text-align: center; }
  .th-amount { width: 150px; text-align: center; }
  .th-sum { width: 140px; text-align: center; }
  .th-op { width: 120px; text-align: center; }
}

/* Cart Item */
.cart-list {
  padding: 0 24px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;

  &:last-child { border-bottom: none; }

  /* 选中态高亮 */
  &.is-selected { background-color: #fffaf7; }

  .td { flex-shrink: 0; }
  .td-chk { width: 50px; }
  .td-item {
    flex: 1;
    display: flex;
    align-items: flex-start;

    .item-pic {
      width: 90px; height: 120px;
      border: 1px solid #eee;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      flex-shrink: 0;
      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
      &:hover img { transform: scale(1.05); }
    }

    .item-info {
      margin-left: 20px;
      display: flex; flex-direction: column; gap: 6px;

      .item-title {
        font-size: 15px; color: #333; line-height: 1.4;
        cursor: pointer; text-decoration: none; transition: color 0.2s;
        max-width: 400px;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        &:hover { color: $tomato-main; }
      }

      .item-props {
        display: flex; align-items: center; gap: 10px;
        .stock-warning { font-size: 12px; color: #f56c6c; }
      }

      .item-promo {
        margin-top: 4px;
        .promo-tag {
          border: 1px solid $tomato-main; color: $tomato-main;
          font-size: 12px; padding: 0 4px; border-radius: 3px; margin-right: 5px;
        }
      }
    }
  }

  .td-price {
    width: 140px; text-align: center;
    .price-line { font-size: 15px; font-weight: 600; color: #333; }
    .price-origin { font-size: 12px; color: #999; text-decoration: line-through; margin-top: 2px; }
  }

  .td-amount { width: 150px; text-align: center; }

  .td-sum {
    width: 140px; text-align: center;
    .sum-price { color: $tomato-main; font-weight: 700; font-size: 16px; }
  }

  .td-op {
    width: 120px; text-align: center;
    .op-btn {
      margin: 0 4px;
      &:hover { transform: scale(1.1); }
    }
  }
}

/* --- Toolbar (Sticky Footer) --- */
.cart-toolbar-wrap {
  height: 60px; /* 占位防止内容被遮挡 */
  margin-top: 30px;
}

.cart-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px); /* 磨砂效果 */
  box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  border-top: 1px solid #e0e0e0;
  padding: 0;
  display: flex;
  justify-content: center; /* 让内部容器居中 */

  /* 这里的内部容器约束宽度 */
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    padding: 0 20px;
    height: 70px;
  }
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 25px;

  .tool-link {
    cursor: pointer; color: #666; font-size: 14px; transition: color 0.2s;
    &:hover { color: $tomato-main; }
  }
}

.toolbar-right {
  display: flex;
  align-items: center;

  .amount-sum {
    font-size: 14px; color: #666; margin-right: 20px;
    .highlight { color: $tomato-main; font-weight: bold; font-size: 16px; margin: 0 3px; }
  }

  .price-sum {
    display: flex; align-items: flex-end; margin-right: 20px;
    .txt { font-size: 14px; color: #333; margin-bottom: 5px; }
    .price {
      font-size: 30px; color: $tomato-main; font-weight: 700; line-height: 1;
      em { font-style: normal; font-size: 16px; margin-right: 2px; }
    }
  }

  .checkout-btn {
    height: 48px;
    padding: 0 36px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 24px;
    background: linear-gradient(135deg, #ff6700 0%, #ff4500 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(255, 69, 0, 0.3);
    transition: all 0.3s;

    &:hover:not(.is-disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 69, 0, 0.4);
    }

    &.is-disabled {
      background: #ccc;
      box-shadow: none;
    }
  }
}

/* 响应式微调 */
@media (max-width: 768px) {
  .cart-thead { display: none; } /* 移动端隐藏表头 */
  .cart-item {
    flex-wrap: wrap;
    position: relative;
    .td-chk { position: absolute; top: 20px; left: 0; }
    .td-item { width: 100%; padding-left: 30px; }
    .td-price, .td-amount, .td-sum { width: auto; margin: 10px 10px 0 0; }
    .td-op { position: absolute; right: 0; top: 20px; }
  }
  .cart-toolbar > div {
    flex-direction: column;
    height: auto;
    padding: 10px 20px;
    .toolbar-left { width: 100%; justify-content: space-between; margin-bottom: 10px; }
    .toolbar-right { width: 100%; justify-content: space-between; }
  }
}
</style>