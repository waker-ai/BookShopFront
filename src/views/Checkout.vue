<template>
  <div class="checkout-container">
    <!-- 顶部步骤条 -->
    <div class="checkout-header">
      <el-steps :active="1" finish-status="success" simple>
        <el-step title="1. 确认订单" icon="ShoppingCart" />
        <el-step title="2. 在线支付" icon="Wallet" />
        <el-step title="3. 完成购买" icon="CircleCheck" />
      </el-steps>
    </div>

    <div class="main-content">
      <!-- 1. 收货地址 -->
      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="card-header">
            <span><el-icon><Location /></el-icon> 收货地址</span>
            <el-button link type="primary" size="small">管理地址</el-button>
          </div>
        </template>

        <div class="address-grid">
          <div
              v-for="addr in addresses"
              :key="addr.id"
              class="address-box"
              :class="{ active: selectedAddress === addr.id }"
              @click="selectedAddress = addr.id"
          >
            <div class="addr-header">
              <span class="name">{{ addr.name }}</span>
              <el-tag v-if="addr.isDefault" type="info" size="small" effect="plain">默认</el-tag>
            </div>
            <div class="addr-content">
              <p>{{ addr.phone }}</p>
              <p class="detail-text">{{ addr.province }} {{ addr.city }} {{ addr.detail }}</p>
            </div>

            <!-- 选中时的右下角角标 -->
            <div class="checked-icon" v-show="selectedAddress === addr.id">
              <el-icon><Check /></el-icon>
            </div>

            <div class="addr-ops">
              <el-button link size="small">修改</el-button>
            </div>
          </div>

          <!-- 添加新地址 -->
          <div class="address-box add-new" @click="handleAddAddress">
            <el-icon :size="24"><Plus /></el-icon>
            <span>添加新地址</span>
          </div>
        </div>
      </el-card>

      <!-- 2. 商品清单与配送 -->
      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="card-header">
            <span><el-icon><Goods /></el-icon> 商品清单</span>
            <el-button link type="primary" @click="$router.push('/cart')">返回购物车修改</el-button>
          </div>
        </template>

        <el-table :data="cartItems" :header-cell-style="{background:'#f8f8f8'}">
          <el-table-column label="商品信息" min-width="300">
            <template #default="scope">
              <div class="product-info">
                <el-image :src="scope.row.cover" class="p-img" fit="cover" />
                <div class="p-text">
                  <div class="title">{{ scope.row.title }}</div>
                  <div class="sku">版本：平装版</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" align="center">
            <template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center" />
          <el-table-column label="小计" align="right" width="150">
            <template #default="{ row }">
              <span class="subtotal">¥{{ (row.price * row.quantity).toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 配送方式与留言 -->
        <div class="delivery-row">
          <div class="form-item">
            <span class="label">配送方式：</span>
            <el-select v-model="deliveryMethod" style="width: 200px">
              <el-option label="番茄快递 (免费)" value="express" />
              <el-option label="顺丰速运 (+10元)" value="sf" />
            </el-select>
          </div>
          <div class="form-item note-item">
            <span class="label">订单备注：</span>
            <el-input v-model="orderNote" placeholder="选填，请先和商家协商一致" style="width: 100%" />
          </div>
        </div>
      </el-card>

      <!-- 3. 支付方式与优惠 -->
      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="card-header"><span><el-icon><Money /></el-icon> 结算信息</span></div>
        </template>

        <div class="payment-section">
          <h4>支付方式</h4>
          <div class="payment-options">
            <div
                class="pay-item"
                :class="{ active: paymentMethod === 'wechat' }"
                @click="paymentMethod = 'wechat'"
            >
              <el-icon color="#09bb07" :size="20"><ChatDotRound /></el-icon> 微信支付
            </div>
            <div
                class="pay-item"
                :class="{ active: paymentMethod === 'alipay' }"
                @click="paymentMethod = 'alipay'"
            >
              <el-icon color="#1677ff" :size="20"><CreditCard /></el-icon> 支付宝
            </div>
          </div>
        </div>

        <el-divider border-style="dashed" />

        <div class="coupon-section">
          <h4>优惠券</h4>
          <el-select v-model="selectedCoupon" placeholder="请选择优惠券" clearable style="width: 300px">
            <template #prefix><el-icon><Ticket /></el-icon></template>
            <el-option
                v-for="item in coupons"
                :key="item.id"
                :label="`${item.name} (省 ¥${item.value})`"
                :value="item.value"
                :disabled="itemsTotal < item.threshold"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #ff6700; font-size: 13px">
                -¥{{ item.value }}
              </span>
            </el-option>
          </el-select>
          <span class="coupon-tip" v-if="selectedCoupon">已成功抵扣 ¥{{ selectedCoupon }}</span>
        </div>
      </el-card>
    </div>

    <!-- 4. 底部吸底结算栏 -->
    <div class="checkout-footer">
      <div class="footer-inner">
        <div class="price-breakdown">
          <span class="item">共 <b>{{ totalCount }}</b> 件商品</span>
          <span class="item">总金额: ¥{{ itemsTotal.toFixed(2) }}</span>
          <span class="item">运费: ¥{{ freightPrice }}</span>
          <span class="item discount">优惠: -¥{{ selectedCoupon || 0 }}</span>
        </div>

        <div class="final-action">
          <div class="final-price-wrapper">
            应付总额: <span class="price">¥{{ finalPrice }}</span>
          </div>
          <el-button
              type="primary"
              size="large"
              class="submit-btn"
              :loading="isSubmitting"
              @click="submitOrder"
          >
            提交订单
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Location, Goods, Money, Plus, Check,
  ChatDotRound, CreditCard, Ticket,
  ShoppingCart, Wallet, CircleCheck
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- Mock Data ---
const addresses = ref([
  { id: 1, name: '陈明博', phone: '138****0000', province: '北京市', city: '北京市', detail: '海淀区学院路37号北京航空航天大学', isDefault: true },
  { id: 2, name: '刘珩', phone: '139****1111', province: '江苏省', city: '南京市', detail: '鼓楼区汉口路22号南京大学', isDefault: false },
])
const selectedAddress = ref(1)

const cartItems = ref([
  { id: 1, title: '软件工程与计算（卷二）', price: 89.00, quantity: 2, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100' },
  { id: 2, title: '深入理解计算机系统', price: 129.00, quantity: 1, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100' }
])

const coupons = ref([
  { id: 101, name: '新人专享红包', threshold: 100, value: 20 },
  { id: 102, name: '好书大促券', threshold: 300, value: 50 },
])
const selectedCoupon = ref(null)
const deliveryMethod = ref('express')
const paymentMethod = ref('wechat')
const orderNote = ref('')
const isSubmitting = ref(false)

// --- Computeds ---

const itemsTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const totalCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const freightPrice = computed(() => {
  // 顺丰+10元，否则0元
  return deliveryMethod.value === 'sf' ? 10.00 : 0.00
})

const finalPrice = computed(() => {
  const total = itemsTotal.value + freightPrice.value - (selectedCoupon.value || 0)
  return Math.max(0, total).toFixed(2)
})

// --- Methods ---

const handleAddAddress = () => {
  ElMessage.info('点击了添加地址 (此处应弹窗)')
}

const submitOrder = () => {
  if (!selectedAddress.value) return ElMessage.warning('请选择收货地址')

  isSubmitting.value = true

  // 模拟API请求
  setTimeout(() => {
    isSubmitting.value = false
    ElMessageBox.alert(`支付成功！支付金额 ¥${finalPrice.value}`, '提示', {
      confirmButtonText: '查看订单',
      callback: () => {
        router.push('/user') // 跳转到用户中心或订单详情
      }
    })
  }, 1500)
}
</script>

<style scoped lang="scss">
$primary-color: #ff6700;
$border-color: #e4e7ed;

.checkout-container {
  max-width: 1100px;
  margin: 20px auto;
  padding-bottom: 100px; /* 防止内容被底部栏遮挡 */
}

/* 顶部步骤 */
.checkout-header {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
}

/* 卡片通用 */
.section-card {
  margin-bottom: 20px;
  border-radius: 8px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    span { display: flex; align-items: center; gap: 6px; }
  }
}

/* 地址网格 */
.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 15px;
}

.address-box {
  border: 1px solid $border-color;
  border-radius: 4px;
  padding: 15px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    border-color: lighten($primary-color, 20%);
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }

  &.active {
    border-color: $primary-color;
    background-color: #fffbf7;

    .checked-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 0 24px 24px;
      border-color: transparent transparent $primary-color transparent;

      .el-icon {
        position: absolute;
        right: 0;
        bottom: -24px;
        color: white;
        font-size: 12px;
        transform: translate(-1px, -3px);
      }
    }
  }

  &.add-new {
    border: 1px dashed #c0c4cc;
    align-items: center;
    justify-content: center;
    color: #909399;
    gap: 8px;

    &:hover {
      border-color: $primary-color;
      color: $primary-color;
    }
  }

  .addr-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name { font-weight: bold; font-size: 15px; }
  }

  .addr-content {
    font-size: 13px;
    color: #606266;
    line-height: 1.4;
    .detail-text {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .addr-ops {
    text-align: right;
    visibility: hidden;
  }

  &:hover .addr-ops { visibility: visible; }
}


/* 商品列表 */
.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
  .p-img { width: 50px; height: 70px; border-radius: 4px; border: 1px solid #eee; }
  .p-text {
    .title { font-size: 14px; margin-bottom: 4px; }
    .sku { font-size: 12px; color: #999; }
  }
}
.subtotal { color: $primary-color; font-weight: bold; }

/* 配送与留言 */
.delivery-row {
  background: #fcfcfc;
  padding: 20px;
  margin-top: 20px;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;

  .form-item {
    display: flex;
    align-items: center;
    .label { margin-right: 10px; font-size: 14px; color: #333; }
  }
  .note-item { flex: 1; min-width: 300px; }
}

/* 支付与优惠 */
.payment-section {
  h4 { margin: 0 0 15px; font-size: 14px; color: #333; }
  .payment-options {
    display: flex;
    gap: 15px;

    .pay-item {
      border: 1px solid $border-color;
      padding: 10px 25px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;

      &:hover { border-color: $primary-color; color: $primary-color; }

      &.active {
        border-color: $primary-color;
        background: #fffbf7;
        color: $primary-color;
        font-weight: bold;
      }
    }
  }
}

.coupon-section {
  margin-top: 20px;
  h4 { margin: 0 0 15px; font-size: 14px; color: #333; }
  .coupon-tip { margin-left: 10px; color: $primary-color; font-size: 13px; }
}


/* 底部吸底栏 */
.checkout-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 100;
  border-top: 1px solid #eee;

  .footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    height: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
  }

  .price-breakdown {
    display: flex;
    align-items: center;
    margin-right: 20px;
    font-size: 14px;
    color: #666;

    .item {
      margin-left: 15px;
      &.discount { color: #f56c6c; }
    }
  }

  .final-action {
    display: flex;
    align-items: center;
    gap: 15px;

    .final-price-wrapper {
      font-size: 14px;
      .price { font-size: 28px; color: $primary-color; font-weight: bold; vertical-align: bottom; line-height: 1; }
    }

    .submit-btn {
      width: 160px;
      height: 44px;
      font-size: 18px;
      background-color: $primary-color;
      border-color: $primary-color;
      border-radius: 22px;

      &:hover { background-color: lighten($primary-color, 5%); }
    }
  }
}
</style>