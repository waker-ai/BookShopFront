<template>
  <div class="book-detail-page">

    <!-- 1. 沉浸式顶部背景 (提取书籍封面色调) -->
    <div class="immersive-bg">
      <div class="bg-blur" :style="{ backgroundImage: `url(${currentBook.cover})` }"></div>
      <div class="bg-mask"></div>
    </div>

    <div class="container main-wrapper">
      <!-- 2. 面包屑 -->
      <el-breadcrumb separator="/" class="breadcrumb-nav">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>图书详情</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentBook.title }}</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 3. 核心信息卡片 (悬浮于背景之上) -->
      <div class="core-info-card">
        <div class="book-gallery">
          <div class="main-cover-box">
            <el-image :src="currentBook.cover" fit="cover" class="book-cover-img" />
            <!-- 3D 书脊效果 -->
            <div class="book-spine"></div>
          </div>
          <div class="gallery-thumbs">
            <!-- 模拟多图缩略 -->
            <div class="thumb active"><img :src="currentBook.cover" /></div>
            <div class="thumb"><img :src="currentBook.cover" style="filter: hue-rotate(30deg)" /></div>
            <div class="thumb"><img :src="currentBook.cover" style="filter: grayscale(100%)" /></div>
          </div>
        </div>

        <div class="book-meta-info">
          <div class="title-row">
            <h1>{{ currentBook.title }}</h1>
            <span class="badge-self">自营</span>
          </div>
          <p class="subtitle">{{ currentBook.subtitle }}</p>

          <div class="author-publisher-row">
            <div class="meta-item">
              <span class="label">作者</span>
              <a class="val link">{{ currentBook.author }}</a>
            </div>
            <div class="divider"></div>
            <div class="meta-item">
              <span class="label">出版社</span>
              <span class="val">{{ currentBook.publisher }}</span>
            </div>
            <div class="divider"></div>
            <div class="meta-item">
              <span class="label">出版时间</span>
              <span class="val">{{ currentBook.publishtime }}</span>
            </div>
          </div>

          <!-- 价格区域 -->
          <div class="price-zone">
            <div class="price-main">
              <span class="symbol">¥</span>
              <span class="num">{{ currentBook.price }}</span>
              <span class="discount-tag">{{ discount }}折</span>
            </div>
            <div class="price-sub">
              <span class="orig">定价: ¥{{ currentBook.originalPrice }}</span>
              <span class="promo"><el-tag size="small" type="danger" effect="dark">满减</el-tag> 满100减50</span>
            </div>
          </div>

          <!-- 评分与销量 -->
          <div class="stats-row">
            <div class="stat-item">
              <el-rate v-model="currentBook.rating" disabled text-color="#ff9900" score-template="{value}" />
              <span class="stat-label">{{ currentBook.rating }}分</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">5000+</span>
              <span class="stat-label">销量</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">120+</span>
              <span class="stat-label">评论</span>
            </div>
          </div>

          <!-- 购买操作栏 -->
          <div class="action-bar">
            <el-input-number v-model="quantity" :min="1" :max="10" size="large" class="qty-input" />

            <el-button type="primary" size="large" class="btn-buy" @click="buyNow">
              立即购买
            </el-button>
            <el-button color="#333" size="large" class="btn-cart" :icon="ShoppingCart" @click="addToCart">
              加入购物车
            </el-button>

            <el-button circle size="large" :icon="Star" class="btn-fav" title="收藏" />
          </div>

          <div class="service-guarantee">
            <span><el-icon><CircleCheck /></el-icon> 正品保障</span>
            <span><el-icon><Van /></el-icon> 急速发货</span>
            <span><el-icon><Refresh /></el-icon> 七天无理由退换</span>
          </div>
        </div>
      </div>

      <!-- 4. 详情内容与侧边栏布局 -->
      <div class="content-layout">
        <!-- 左侧详情 -->
        <div class="detail-main">
          <el-tabs v-model="activeTab" class="detail-tabs">
            <el-tab-pane label="图书详情" name="intro">
              <div class="rich-text-content">
                <div class="section-block">
                  <h3 class="block-title">内容简介</h3>
                  <p class="text-body">{{ currentBook.description }}</p>
                </div>

                <div class="section-block">
                  <h3 class="block-title">作者简介</h3>
                  <div class="author-intro-box">
                    <el-avatar :size="50" style="background:#f0f0f0">{{ currentBook.author[0] }}</el-avatar>
                    <div>
                      <strong>{{ currentBook.author }}</strong>
                      <p>知名作家，在该领域拥有深厚造诣，著有多部畅销作品。</p>
                    </div>
                  </div>
                </div>

                <div class="section-block">
                  <h3 class="block-title">目录</h3>
                  <div class="catalog-list">
                    <p v-for="(chapter, i) in currentBook.contents.split(/[；。]/)" :key="i" v-show="chapter">
                      {{ chapter }}
                    </p>
                  </div>
                </div>

                <!-- 模拟长图详情 -->
                <div class="book-images">
                  <img src="https://via.placeholder.com/750x400/f5f7fa/999?text=Product+Details+Image+1" />
                  <img src="https://via.placeholder.com/750x600/f5f7fa/999?text=Product+Details+Image+2" />
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="读者评价 (126)" name="reviews">
              <div class="review-summary">
                <div class="score-box">
                  <div class="val">98%</div>
                  <div class="lbl">好评率</div>
                </div>
                <div class="tags-box">
                  <span class="tag active">内容深刻 (88)</span>
                  <span class="tag">印刷精美 (45)</span>
                  <span class="tag">物流快 (32)</span>
                  <span class="tag gray">包装一般 (2)</span>
                </div>
              </div>

              <div class="review-list">
                <div v-for="i in 3" :key="i" class="review-item">
                  <div class="user-face">
                    <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                  </div>
                  <div class="review-body">
                    <div class="r-top">
                      <span class="u-name">书友_882{{i}}</span>
                      <el-rate :model-value="5" disabled size="small" />
                      <span class="r-time">2023-11-0{{i}}</span>
                    </div>
                    <p class="r-text">这本书非常值得一读，内容详实，不仅适合初学者，对有经验的读者也有启发。纸张质量很好，阅读体验棒！</p>
                    <div class="r-sku">版本：平装版</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 右侧侧边栏：看了又看 -->
        <div class="detail-sidebar">
          <div class="sidebar-title">
            <span>看了又看</span>
            <el-icon><RefreshRight /></el-icon>
          </div>
          <div class="sidebar-list">
            <div class="side-book" v-for="book in relatedBooks" :key="book.id" @click="$router.push(`/product/${book.id}`)">
              <div class="img-wrap">
                <img :src="book.cover" />
              </div>
              <div class="txt-wrap">
                <div class="t">{{ book.title }}</div>
                <div class="p">¥{{ book.price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ShoppingCart, Star, CircleCheck, Van, Refresh, RefreshRight
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const quantity = ref(1)
const activeTab = ref('intro')

// 模拟全量数据 (复制你的数据源，或者引入store)
const allBooks = [
  { id:1,title:'软件工程与计算',subtitle:'国家级规划教材，系统讲解软件工程核心方法',publisher:'机械工业出版社',publishtime:'2012-12',price:89.00,originalPrice:110.00,cover:'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',author:'骆斌',rating:4.8,description:'本书系统阐述软件工程的基本理论与工程化思想，涵盖需求分析、设计、实现与测试等关键阶段。',contents:'第一章 软件工程概述；第二章 软件过程模型；第三章 需求分析；第四章 软件设计'},
  // ... 其他数据 ...
  { id:2,title:'深入理解计算机系统',subtitle:'从程序员视角深入剖析计算机系统本质',publisher:'机械工业出版社',publishtime:'2016-06',price:129.00,originalPrice:159.00,cover:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',author:'Randal E. Bryant',rating:4.9,description:'本书以程序执行为主线，深入讲解计算机系统的组成与运行机制。',contents:'第一章 计算机系统漫游；第二章 信息的表示；第三章 程序的机器级表示'},
  { id:3,title:'Vue.js设计与实现',subtitle:'深入理解 Vue 框架的设计思想与实现机制',publisher:'人民邮电出版社',publishtime:'2021-03',price:79.00,originalPrice:99.00,cover:'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400',author:'霍春阳',rating:4.9,description:'本书从源码角度解析 Vue 的响应式系统、渲染机制与编译原理。',contents:'第一章 框架设计理念；第二章 响应式系统；第三章 虚拟DOM'},
  { id:4,title:'JavaScript高级程序设计',subtitle:'系统全面的 JavaScript 权威指南',publisher:'人民邮电出版社',publishtime:'2020-09',price:99.00,originalPrice:129.00,cover:'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',author:'Matt Frisbie',rating:4.7,description:'本书全面介绍 JavaScript 的语言特性、运行机制与最佳实践。',contents:'第一章 JavaScript简介；第二章 语言基础；第三章 对象与函数'},
]

// 获取当前书籍
const currentBook = computed(() => {
  const id = Number(route.params.id)
  // 如果找不到ID，默认返回第一本防止报错，实际项目应跳转404
  return allBooks.find(b => b.id === id) || allBooks[0]
})

// 计算折扣
const discount = computed(() => {
  if (!currentBook.value.originalPrice) return '10.0'
  return ((currentBook.value.price / currentBook.value.originalPrice) * 10).toFixed(1)
})

// 推荐书籍 (取前3本非当前书籍)
const relatedBooks = computed(() => {
  return allBooks.filter(b => b.id !== currentBook.value.id).slice(0, 5)
})

// 滚动回到顶部
onMounted(() => {
  window.scrollTo(0, 0)
})

const addToCart = () => {
  ElMessage.success(`已将 ${quantity.value} 本《${currentBook.value.title}》加入购物车`)
}

const buyNow = () => {
  ElMessage.warning('跳转结算流程...')
}
</script>

<style scoped lang="scss">
$tomato-main: #ff6700;
$dark-text: #2c3e50;
$gray-text: #666;
$bg-color: #f5f7fa;

.book-detail-page {
  background-color: $bg-color;
  min-height: 100vh;
  position: relative;
  padding-bottom: 60px;
}

/* 1. 沉浸式背景 */
.immersive-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 500px;
  overflow: hidden;
  z-index: 0;

  .bg-blur {
    width: 100%; height: 100%;
    background-size: cover; background-position: center;
    filter: blur(60px) brightness(0.8);
    transform: scale(1.1);
  }
  .bg-mask {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, $bg-color 90%, $bg-color 100%);
  }
}

.main-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumb-nav {
  margin-bottom: 25px;
  :deep(.el-breadcrumb__inner) { color: rgba(0,0,0,0.6); }
  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) { color: #333; font-weight: 600; }
}

/* 2. 核心信息卡片 */
.core-info-card {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  display: flex;
  gap: 40px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  margin-bottom: 30px;
}

/* 左侧封面图 */
.book-gallery {
  width: 360px;
  flex-shrink: 0;

  .main-cover-box {
    width: 100%; height: 360px;
    background: #f9f9f9;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    padding: 20px;
    margin-bottom: 15px;

    .book-cover-img {
      height: 100%;
      box-shadow: 5px 10px 20px rgba(0,0,0,0.15);
      border-radius: 2px 6px 6px 2px;
      z-index: 2;
    }

    /* 书脊装饰 */
    .book-spine {
      position: absolute;
      top: 50%; left: 50%;
      height: 90%; width: 15px;
      background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(0,0,0,0.1));
      transform: translate(-52%, -50%) translateX(calc(-50% * var(--scale, 1) - 6px)); /* 简易定位 */
      z-index: 1;
    }
  }

  .gallery-thumbs {
    display: flex; gap: 10px; justify-content: center;
    .thumb {
      width: 60px; height: 60px; border-radius: 4px; overflow: hidden;
      border: 2px solid transparent; cursor: pointer;
      opacity: 0.7; transition: all 0.2s;
      img { width: 100%; height: 100%; object-fit: cover; }

      &:hover, &.active {
        opacity: 1; border-color: $tomato-main;
      }
    }
  }
}

/* 右侧信息 */
.book-meta-info {
  flex: 1;
  .title-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
    h1 { margin: 0; font-size: 26px; color: #333; line-height: 1.3; }
    .badge-self { background: $tomato-main; color: #fff; font-size: 12px; padding: 2px 6px; border-radius: 4px; }
  }

  .subtitle { font-size: 15px; color: #888; margin-bottom: 20px; line-height: 1.5; }

  .author-publisher-row {
    display: flex; align-items: center; gap: 15px; font-size: 13px; color: #666; margin-bottom: 25px;
    .meta-item { display: flex; gap: 5px; }
    .label { color: #999; }
    .val { color: #333; font-weight: 500; }
    .link { color: #409eff; cursor: pointer; &:hover{ text-decoration: underline; } }
    .divider { width: 1px; height: 12px; background: #e0e0e0; }
  }

  .price-zone {
    background: #fff6f2; padding: 15px 20px; border-radius: 8px; margin-bottom: 25px;

    .price-main {
      color: $tomato-main; display: flex; align-items: baseline; margin-bottom: 5px;
      .symbol { font-size: 18px; font-weight: bold; margin-right: 2px; }
      .num { font-size: 32px; font-weight: 800; }
      .discount-tag { margin-left: 10px; border: 1px solid $tomato-main; font-size: 12px; padding: 1px 5px; border-radius: 4px; }
    }

    .price-sub {
      display: flex; align-items: center; gap: 20px; font-size: 13px; color: #999;
      .orig { text-decoration: line-through; }
      .promo { display: flex; align-items: center; gap: 5px; color: #666; }
    }
  }

  .stats-row {
    display: flex; align-items: center; gap: 20px; margin-bottom: 30px;
    .stat-item { display: flex; align-items: center; gap: 5px; }
    .stat-num { font-weight: bold; color: #333; font-size: 16px; }
    .stat-label { font-size: 12px; color: #999; }
    .stat-divider { width: 1px; height: 16px; background: #eee; }
  }

  .action-bar {
    display: flex; align-items: center; gap: 15px; margin-bottom: 25px;
    .qty-input { width: 100px; }

    .btn-buy {
      background: linear-gradient(135deg, #ff7e5f, #feb47b);
      border: none; padding: 0 40px; font-weight: 600;
      &:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(254,180,123, 0.4); }
    }
    .btn-cart {
      background: #333; color: #fff; padding: 0 30px;
      &:hover { background: #000; }
    }
    .btn-fav { border-color: #ddd; color: #999; &:hover { color: $tomato-main; border-color: $tomato-main; } }
  }

  .service-guarantee {
    display: flex; gap: 20px; font-size: 12px; color: #999;
    span { display: flex; align-items: center; gap: 4px; }
  }
}

/* 3. 详情与侧边栏 */
.content-layout {
  display: flex; gap: 20px;
}

.detail-main {
  flex: 1;
  background: #fff; border-radius: 8px; padding: 20px;
  min-height: 500px;

  :deep(.el-tabs__item) { font-size: 16px; height: 50px; }
  :deep(.el-tabs__active-bar) { background-color: $tomato-main; }
}

/* 详情富文本 */
.rich-text-content {
  padding: 10px;

  .section-block {
    margin-bottom: 30px;
    .block-title {
      font-size: 18px; font-weight: 700; color: #333; margin-bottom: 15px;
      border-left: 4px solid $tomato-main; padding-left: 10px;
    }
    .text-body { font-size: 15px; color: #555; line-height: 1.8; }

    .author-intro-box {
      background: #f9f9f9; padding: 15px; border-radius: 6px; display: flex; gap: 15px; align-items: center;
      p { margin: 5px 0 0; font-size: 13px; color: #666; }
    }

    .catalog-list {
      p { margin: 0; padding: 8px 0; border-bottom: 1px dashed #eee; font-size: 14px; color: #666; }
    }
  }

  .book-images img {
    display: block; width: 100%; margin-bottom: 10px; border-radius: 4px;
  }
}

/* 评价 */
.review-summary {
  display: flex; align-items: center; background: #fdfdfd; border: 1px solid #eee; padding: 20px; margin-bottom: 20px;
  .score-box {
    text-align: center; padding-right: 30px; border-right: 1px solid #eee; margin-right: 30px;
    .val { font-size: 36px; color: $tomato-main; font-weight: bold; }
    .lbl { font-size: 12px; color: #999; }
  }
  .tags-box {
    display: flex; gap: 10px; flex-wrap: wrap;
    .tag {
      padding: 6px 12px; background: #ffece6; color: #666; border-radius: 20px; font-size: 12px;
      &.active { background: $tomato-main; color: #fff; }
      &.gray { background: #f4f4f5; color: #909399; }
    }
  }
}

.review-item {
  display: flex; gap: 15px; padding: 20px 0; border-bottom: 1px solid #eee;
  .user-face { flex-shrink: 0; }
  .review-body {
    flex: 1;
    .r-top {
      display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 12px;
      .u-name { font-weight: 600; }
      .r-time { color: #999; margin-left: auto; }
    }
    .r-text { margin: 0 0 8px; font-size: 14px; color: #333; line-height: 1.5; }
    .r-sku { font-size: 12px; color: #aaa; }
  }
}

/* 侧边栏 */
.detail-sidebar {
  width: 260px;
  background: #fff; border-radius: 8px; padding: 20px;
  height: fit-content;

  .sidebar-title {
    font-size: 16px; font-weight: bold; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;
  }

  .side-book {
    display: flex; gap: 10px; margin-bottom: 15px; cursor: pointer;
    &:hover .t { color: $tomato-main; }

    .img-wrap { width: 70px; height: 90px; border-radius: 4px; overflow: hidden; flex-shrink: 0; background: #f9f9f9; }
    .img-wrap img { width: 100%; height: 100%; object-fit: cover; }

    .txt-wrap {
      flex: 1; display: flex; flex-direction: column; justify-content: space-between;
      .t { font-size: 13px; color: #333; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .p { color: $tomato-main; font-weight: bold; }
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .core-info-card { flex-direction: column; padding: 20px; }
  .book-gallery { width: 100%; margin: 0 auto; }
  .main-cover-box { height: 300px; }
  .content-layout { flex-direction: column; }
  .detail-sidebar { display: none; }
  .price-zone { flex-direction: column; gap: 10px; align-items: flex-start; }
  .action-bar { flex-wrap: wrap; }
}
</style>