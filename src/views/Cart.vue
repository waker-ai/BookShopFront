<template>
  <div class="cart-container">
    <!-- 1. 顶部标题区 -->
    <div class="cart-header">
      <h2>购物车 <span class="count">({{ cartList.length }})</span></h2>
      <div class="header-actions">
        <span class="location">
          <el-icon><LocationInformation /></el-icon> 配送至：北京市海淀区
        </span>
      </div>
    </div>

    <!-- 2. 空状态处理 -->
    <el-empty
        v-if="cartList.length === 0"
        description="购物车还是空的，快去挑几本好书吧！"
    >
      <el-button type="primary" round @click="$router.push('/')">去逛逛</el-button>
    </el-empty>

    <!-- 3. 购物车主体 -->
    <template v-else>
      <el-card shadow="never" class="cart-card">
        <el-table
            ref="tableRef"
            :data="cartList"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            :header-cell-style="{background:'#f5f7fa', color:'#606266'}"
        >
          <!-- 多选框 -->
          <el-table-column type="selection" width="55" align="center" />

          <!-- 商品详情 -->
          <el-table-column label="商品信息" min-width="350">
            <template #default="scope">
              <div class="product-info">
                <el-image
                    :src="scope.row.cover"
                    class="product-img"
                    fit="cover"
                    @click="$router.push(`/product/${scope.row.id}`)"
                />
                <div class="info-text">
                  <h3 class="title" @click="$router.push(`/product/${scope.row.id}`)">
                    {{ scope.row.title }}
                  </h3>
                  <div class="tags">
                    <el-tag size="small" type="info" effect="plain">{{ scope.row.version }}</el-tag>
                    <span v-if="scope.row.stock < 10" class="low-stock">仅剩 {{ scope.row.stock }} 件</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 单价 -->
          <el-table-column prop="price" label="单价" width="150" align="center">
            <template #default="scope">
              <div class="price-col">
                <span class="current-price">¥{{ scope.row.price.toFixed(2) }}</span>
                <span v-if="scope.row.originalPrice" class="original-price">¥{{ scope.row.originalPrice }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- 数量 -->
          <el-table-column label="数量" width="180" align="center">
            <template #default="scope">
              <el-input-number
                  v-model="scope.row.quantity"
                  :min="1"
                  :max="scope.row.stock"
                  size="small"
                  @change="handleQuantityChange"
              />
            </template>
          </el-table-column>

          <!-- 小计 -->
          <el-table-column label="小计" width="150" align="center">
            <template #default="scope">
              <span class="subtotal">
                ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
              </span>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="scope">
              <div class="action-btns">
                <el-button link type="primary" size="small">移入收藏</el-button>
                <el-button link type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 4. 底部结算栏 (Sticky Footer) -->
        <div class="cart-footer-bar">
          <div class="footer-left">
            <el-checkbox
                v-model="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleSelectAll"
            >全选</el-checkbox>
            <el-button link type="danger" :disabled="selectedItems.length === 0" @click="batchDelete">
              删除选中的商品
            </el-button>
            <el-button link @click="clearCart">清空购物车</el-button>
          </div>

          <div class="footer-right">
            <div class="summary">
              <span class="selected-count">已选 <b>{{ selectedItems.length }}</b> 件商品</span>
              <span class="total-label">合计 (不含运费)：</span>
              <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            <el-button
                type="primary"
                size="large"
                class="checkout-btn"
                :disabled="selectedItems.length === 0"
                @click="$router.push('/checkout')"
            >
              去结算
            </el-button>
          </div>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { LocationInformation } from '@element-plus/icons-vue'

const tableRef = ref(null)

// 模拟数据：增加了原价、库存、版本等字段
const cartList = ref([
  { id: 1, title: '软件工程与计算（卷二）：软件开发的技术基础', price: 89.00, originalPrice: 118.00, quantity: 1, stock: 50, version: '平装版', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100' },
  { id: 2, title: '深入理解计算机系统（CSAPP）原书第3版', price: 129.00, originalPrice: 159.00, quantity: 2, stock: 5, version: '精装版', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100' },
  { id: 3, title: 'JavaScript高级程序设计（第4版）', price: 99.00, originalPrice: 129.00, quantity: 1, stock: 100, version: '平装版', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=100' },
])

const selectedItems = ref([])

// 计算总价 (只计算选中的)
const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 全选/半选状态控制
const isAllSelected = computed(() => {
  return cartList.value.length > 0 && selectedItems.value.length === cartList.value.length
})
const isIndeterminate = computed(() => {
  return selectedItems.value.length > 0 && selectedItems.value.length < cartList.value.length
})

// --- 方法 ---

// 处理表格选中变化
const handleSelectionChange = (val) => {
  selectedItems.value = val
}

// 底部全选按钮点击
const toggleSelectAll = (val) => {
  if (val) {
    tableRef.value.toggleAllSelection()
  } else {
    tableRef.value.clearSelection()
  }
}

// 数量变更 (可以增加防抖或API请求)
const handleQuantityChange = (value) => {
  console.log('数量变更为', value)
  // 如果需要，这里可以调用后端API更新购物车数量
}

// 删除单个
const handleDelete = (index, row) => {
  ElMessageBox.confirm(
      `确定要删除 "${row.title}" 吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    cartList.value.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 批量删除
const batchDelete = () => {
  ElMessageBox.confirm(
      `确定要删除这 ${selectedItems.value.length} 件商品吗？`,
      '警告',
      { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    // 过滤掉选中的
    cartList.value = cartList.value.filter(item => !selectedItems.value.includes(item))
    // 清空选中状态
    tableRef.value.clearSelection()
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}

// 清空购物车
const clearCart = () => {
  ElMessageBox.confirm('确定要清空购物车吗？', '警告', { type: 'warning' })
      .then(() => {
        cartList.value = []
        ElMessage.success('购物车已清空')
      }).catch(() => {})
}
</script>

<style scoped lang="scss">
$primary-color: #ff6700;
$text-main: #333;
$text-sub: #999;

.cart-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 头部 */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 24px;
    .count { font-size: 16px; color: $primary-color; margin-left: 5px; }
  }

  .location {
    font-size: 14px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    &:hover { color: $primary-color; }
  }
}

/* 商品卡片与表格 */
.cart-card {
  border-radius: 8px;
  border: none;
  /* 去除默认表格下边框，避免双重边框 */
  :deep(.el-table__inner-wrapper::before) { display: none; }
}

.product-info {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;

  .product-img {
    width: 80px;
    height: 100px;
    border-radius: 4px;
    border: 1px solid #eee;
    margin-right: 15px;
    cursor: pointer;
  }

  .info-text {
    flex: 1;
    .title {
      margin: 0 0 8px;
      font-size: 15px;
      line-height: 1.4;
      color: $text-main;
      cursor: pointer;
      &:hover { color: $primary-color; }
    }

    .tags {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .low-stock {
      font-size: 12px;
      color: #f56c6c;
    }
  }
}

.price-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  .current-price { color: #333; }
  .original-price { color: #999; text-decoration: line-through; font-size: 12px; }
}

.subtotal {
  color: $primary-color;
  font-weight: bold;
  font-size: 16px;
}

.action-btns {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* 底部结算栏 */
.cart-footer-bar {
  margin-top: 20px;
  background: #fff;
  border: 1px solid #eee;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  bottom: 0;
  z-index: 10;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
  border-radius: 8px;

  .footer-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .footer-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .selected-count {
      color: #666;
      font-size: 14px;
      b { color: $primary-color; margin: 0 2px; }
    }

    .total-label { font-size: 14px; margin-left: 10px; }

    .total-price {
      color: $primary-color;
      font-size: 28px;
      font-weight: bold;
      margin-right: 10px;
      &::before { content: '¥'; font-size: 18px; margin-right: 2px; }
    }

    .checkout-btn {
      width: 140px;
      font-size: 18px;
      background-color: $primary-color;
      border-color: $primary-color;

      &.is-disabled {
        background-color: #fab6b6;
        border-color: #fab6b6;
      }
    }
  }
}
</style>