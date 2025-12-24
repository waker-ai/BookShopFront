<template>
  <div class="product-page">
    <!-- 1. 面包屑导航 -->
    <div class="breadcrumb-area">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>计算机与互联网</el-breadcrumb-item>
        <el-breadcrumb-item>软件工程</el-breadcrumb-item>
        <el-breadcrumb-item>正文</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 2. 主体信息区 -->
    <div class="product-main">
      <el-card shadow="never" :body-style="{ padding: '30px' }">
        <div class="product-grid">

          <!-- 左侧：图片展示 -->
          <div class="gallery-section">
            <div class="main-image">
              <el-image
                  :src="currentImage"
                  :preview-src-list="imageList"
                  fit="contain"
                  class="img-box"
              />
            </div>
            <div class="thumbnail-list">
              <div
                  v-for="(img, idx) in imageList"
                  :key="idx"
                  class="thumb-item"
                  :class="{ active: currentImage === img }"
                  @mouseenter="currentImage = img"
              >
                <el-image :src="img" fit="cover" />
              </div>
            </div>
          </div>

          <!-- 右侧：详细信息 -->
          <div class="info-section">
            <h1 class="book-title">
              软件工程与计算（卷二）：软件开发的技术基础
              <el-tag type="danger" effect="plain" size="small" class="tag">自营</el-tag>
            </h1>
            <p class="book-subtitle">“十二五”普通高等教育本科国家级规划教材，系统介绍软件工程基础知识</p>

            <div class="author-bar">
              <span>作者：<a href="#">骆斌</a></span>
              <el-divider direction="vertical" />
              <span>出版社：<a href="#">机械工业出版社</a></span>
              <el-divider direction="vertical" />
              <span>出版时间：2012-12</span>
            </div>

            <!-- 价格面板 -->
            <div class="price-panel">
              <div class="panel-row">
                <span class="label">番茄价</span>
                <span class="currency">¥</span>
                <span class="price">89.00</span>
                <span class="discount-tag">7.5折</span>
              </div>
              <div class="panel-row sub-row">
                <span class="label">定价</span>
                <span class="original-price">¥118.00</span>
              </div>
              <div class="panel-row sub-row">
                <span class="label">促销</span>
                <span class="promo-text"><el-tag type="danger" size="small">满减</el-tag> 满100元减50元</span>
              </div>
            </div>

            <!-- 核心参数 -->
            <div class="meta-row">
              <dl><dt>销量</dt><dd>5000+</dd></dl>
              <el-divider direction="vertical" />
              <dl><dt>累计评价</dt><dd>1200+</dd></dl>
              <el-divider direction="vertical" />
              <dl><dt>送积分</dt><dd>89</dd></dl>
            </div>

            <el-divider style="margin: 20px 0" />

            <!-- 操作区 -->
            <div class="action-area">
              <div class="qty-selector">
                <el-input-number v-model="quantity" :min="1" :max="99" />
              </div>
              <div class="btn-group">
                <el-button type="warning" size="large" plain @click="buyNow">立即购买</el-button>
                <el-button color="#ff6700" size="large" type="primary" :icon="ShoppingCart" @click="addToCart">
                  加入购物车
                </el-button>
              </div>
            </div>

            <div class="aux-actions">
              <el-button link :icon="Star">收藏商品 (230)</el-button>
              <el-button link :icon="Share">分享</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 3. 详情与评价 Tab -->
    <div class="details-container">
      <el-row :gutter="20">
        <!-- 左侧边栏：推荐 -->
        <el-col :span="5" class="sidebar-col">
          <el-card shadow="never" class="recommend-sidebar">
            <template #header><div class="side-header">同类热销</div></template>
            <div class="side-book-item" v-for="i in 3" :key="i">
              <el-image src="https://via.placeholder.com/150" class="side-img" />
              <div class="side-title">人月神话（40周年纪念版）</div>
              <div class="side-price">¥45.00</div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧内容 -->
        <el-col :span="19">
          <el-card shadow="never" class="tab-card">
            <el-tabs v-model="activeTab" class="product-tabs">
              <el-tab-pane label="商品介绍" name="intro">
                <div class="rich-content">
                  <h3>内容简介</h3>
                  <p>本书是《软件工程与计算（卷一）：软件工程基础》的进阶篇...</p>
                  <h3>目录</h3>
                  <p>第一章 软件工程基础...</p>
                  <!-- 模拟长图展示 -->
                  <el-image src="https://via.placeholder.com/800x600?text=Book+Details+Long+Image" style="width:100%; margin-top:20px;" />
                </div>
              </el-tab-pane>

              <el-tab-pane label="商品评价 (12)" name="reviews">
                <div class="reviews-header">
                  <div class="rate-score">
                    <div class="score">98%</div>
                    <div class="text">好评率</div>
                  </div>
                  <div class="rate-tags">
                    <el-tag effect="dark" type="danger">内容详实 (10)</el-tag>
                    <el-tag effect="plain">印刷精美 (5)</el-tag>
                    <el-tag effect="plain">物流快 (8)</el-tag>
                    <el-tag type="info" effect="plain">有点难懂 (1)</el-tag>
                  </div>
                </div>

                <div class="review-list">
                  <div class="review-item" v-for="item in 3" :key="item">
                    <div class="user-info">
                      <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                      <span class="name">刘**珩</span>
                      <el-rate v-model="rating" disabled size="small" />
                    </div>
                    <div class="review-content">这本书对学习软件开发非常有帮助，物流也很快！代码示例很清晰。</div>
                    <div class="review-meta">
                      <span>2023-06-01 12:30</span>
                      <span>版本：平装版</span>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ShoppingCart, Star, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const quantity = ref(1)
const activeTab = ref('intro')
const rating = ref(5)

// 图片画廊逻辑
const imageList = [
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80'
]
const currentImage = ref(imageList[0])

const addToCart = () => {
  ElMessage.success({
    message: `成功将 ${quantity.value} 本书加入购物车`,
    type: 'success',
    offset: 100
  })
}

const buyNow = () => {
  ElMessage.warning('跳转结算页...')
}
</script>

<style scoped lang="scss">
$tomato: #ff6700;
$gray-bg: #f5f7fa;
$border-color: #eee;

.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 1. 面包屑 */
.breadcrumb-area {
  margin-bottom: 20px;
  font-size: 14px;
}

/* 2. 主体区 Layout */
.product-grid {
  display: flex;
  gap: 40px;
}

/* 图片画廊 */
.gallery-section {
  width: 400px;
  flex-shrink: 0;

  .main-image {
    border: 1px solid $border-color;
    padding: 10px;
    margin-bottom: 15px;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;

    .img-box {
      width: 100%;
      height: 100%;
    }
  }

  .thumbnail-list {
    display: flex;
    gap: 10px;
    overflow-x: auto;

    .thumb-item {
      width: 60px;
      height: 60px;
      border: 2px solid transparent;
      cursor: pointer;

      &.active {
        border-color: $tomato;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }
}

/* 信息区 */
.info-section {
  flex: 1;

  .book-title {
    font-size: 22px;
    color: #333;
    margin: 0 0 10px 0;
    line-height: 1.4;

    .tag { vertical-align: middle; margin-left: 5px; }
  }

  .book-subtitle {
    font-size: 14px;
    color: #b0b0b0;
    margin-bottom: 15px;
  }

  .author-bar {
    font-size: 13px;
    color: #666;
    margin-bottom: 20px;
    a { color: #005aa0; text-decoration: none; &:hover { text-decoration: underline; } }
  }

  /* 价格面板 (京东风格) */
  .price-panel {
    background: #fdf5f2; // 浅番茄色背景
    padding: 15px 20px;
    border-radius: 4px;
    margin-bottom: 25px;

    .panel-row {
      display: flex;
      align-items: baseline;
      margin-bottom: 8px;

      .label {
        width: 60px;
        font-size: 12px;
        color: #999;
      }
    }

    .currency { color: $tomato; font-size: 18px; font-weight: bold; }
    .price { color: $tomato; font-size: 32px; font-weight: bold; margin-right: 10px; }
    .discount-tag { font-size: 12px; color: $tomato; border: 1px solid $tomato; padding: 0 4px; }

    .original-price { color: #999; text-decoration: line-through; font-size: 14px; }
    .promo-text { color: #666; font-size: 13px; }
  }

  .meta-row {
    display: flex;
    align-items: center;
    dl {
      margin: 0; padding: 0 15px;
      text-align: center;
      &:first-child { padding-left: 0; }

      dt { font-size: 12px; color: #999; margin-bottom: 4px; }
      dd { font-size: 14px; color: #333; font-weight: bold; margin: 0; }
    }
  }

  .action-area {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
  }

  .aux-actions {
    margin-top: 20px;
    display: flex;
    gap: 20px;
    .el-button { color: #999; font-size: 12px; }
  }
}

/* 3. 底部 Tab 区 */
.details-container {
  margin-top: 30px;
}

.recommend-sidebar {
  text-align: center;
  .side-header { font-weight: bold; }
  .side-book-item {
    margin-bottom: 20px;
    .side-img { width: 120px; height: 120px; margin-bottom: 8px; }
    .side-title { font-size: 12px; height: 34px; overflow: hidden; margin-bottom: 5px; color: #333; }
    .side-price { color: $tomato; font-weight: bold; }
  }
}

.product-tabs {
  min-height: 400px;

  :deep(.el-tabs__item) {
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    &.is-active { color: $tomato; }
  }

  :deep(.el-tabs__active-bar) { background-color: $tomato; }
}

.rich-content {
  padding: 10px;
  line-height: 1.8;
  color: #666;
  h3 { color: #333; margin-top: 20px; background: #f5f5f5; padding: 10px; border-left: 4px solid $tomato; }
}

/* 评价区样式 */
.reviews-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fcfcfc;
  border: 1px solid #eee;
  margin-bottom: 20px;

  .rate-score {
    text-align: center;
    padding-right: 30px;
    border-right: 1px solid #eee;
    .score { font-size: 40px; color: $tomato; font-weight: bold; }
    .text { color: #999; }
  }

  .rate-tags {
    padding-left: 30px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

.review-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 20px;

  .user-info {
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .name { font-size: 12px; margin: 5px 0; color: #666; }
  }

  .review-content {
    flex: 1;
    font-size: 14px;
    color: #333;
    line-height: 1.6;
  }

  .review-meta {
    width: 150px;
    text-align: right;
    font-size: 12px;
    color: #999;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
}

/* 移动端适配小细节 */
@media screen and (max-width: 768px) {
  .product-grid { flex-direction: column; }
  .gallery-section { width: 100%; }
  .sidebar-col { display: none; }
}
</style>