<template>
  <div class="bookstore-app">

    <main class="container main-content">
      <!-- 广告轮播 -->
      <el-carousel trigger="click" height="380px" class="banner-carousel">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-item" :style="{ backgroundImage: `linear-gradient(120deg, ${banner.color1} 0%, ${banner.color2} 100%)` }">
            <div class="banner-content">
              <span class="banner-tag">年度重磅</span>
              <h1>{{ banner.title }}</h1>
              <p>{{ banner.subtitle }}</p>
              <el-button type="primary" size="large" class="banner-btn" @click="goToDetail(banner.relatedId)">
                立即查看 <el-icon class="el-icon--right"><Right /></el-icon>
              </el-button>
            </div>
            <div class="banner-img-placeholder">
              <el-icon :size="150" color="rgba(255,255,255,0.3)"><Reading /></el-icon>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>

      <!-- 特色分类入口 (修改处：添加点击事件) -->
      <div class="feature-grid">
        <div
            class="feature-item"
            v-for="item in features"
            :key="item.title"
            @click="navigateToCategory(item.key)"
        >
          <div class="feature-icon" :style="{ background: item.bg }">
            <el-icon :size="24" :color="item.color"><component :is="item.icon" /></el-icon>
          </div>
          <span class="feature-title">{{ item.title }}</span>
        </div>
      </div>

      <!-- 排行榜 Section -->
      <div class="section-wrapper">
        <div class="section-header">
          <h2>精选榜单</h2>
          <el-button link @click="navigateToCategory('bestseller')">查看全部 <el-icon><ArrowRight /></el-icon></el-button>
        </div>

        <el-tabs v-model="activeTab" class="custom-tabs">
          <el-tab-pane name="sales">
            <template #label>
              <span class="custom-tab-label"><el-icon><HotWater /></el-icon> 畅销热榜</span>
            </template>
            <div class="book-grid">
              <!-- 点击书籍跳转详情 -->
              <BookCard
                  v-for="book in salesBooks"
                  :key="book.id"
                  :book="book"
                  @click="goToDetail(book.id)"
              />
            </div>
          </el-tab-pane>

          <el-tab-pane name="rating">
            <template #label>
              <span class="custom-tab-label"><el-icon><Star /></el-icon> 读者好评</span>
            </template>
            <div class="book-grid">
              <BookCard
                  v-for="book in ratingBooks"
                  :key="book.id"
                  :book="book"
                  @click="goToDetail(book.id)"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </main>

    <!-- 简易页脚 -->
    <footer class="site-footer">
      <p>© 2025 云端书屋 Bookstore. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // 1. 引入 useRouter
import {
  Search, ShoppingCart, Right, Reading,
  ArrowRight, HotWater, Star,
  Trophy, DataLine, Collection, Present
} from '@element-plus/icons-vue'


const router = useRouter() // 2. 初始化 router

// --- Mock Data ---

const banners = [
  { title: '重构：改善既有代码的设计', subtitle: '限时 5 折起，程序员必读经典', color1: '#84fab0', color2: '#8fd3f4', relatedId: 1 },
  { title: '深入理解计算机系统', subtitle: '揭开计算机系统的神秘面纱', color1: '#fccb90', color2: '#d57eeb', relatedId: 2 },
  { title: '设计模式之禅', subtitle: '年度好书大促，满 100 减 50', color1: '#e0c3fc', color2: '#8ec5fc', relatedId: 3 }
]

// 3. 修改 features 数据，增加 key 字段作为路由参数
const features = [
  { title: '新书首发', key: 'new', icon: 'Present', bg: '#fff0f0', color: '#ff4d4f' },
  { title: '电子书', key: 'ebook', icon: 'Collection', bg: '#f0f5ff', color: '#409eff' },
  { title: '畅销榜', key: 'bestseller', icon: 'Trophy', bg: '#fff7e6', color: '#faad14' },
  { title: '特价区', key: 'sale', icon: 'DataLine', bg: '#f6ffed', color: '#52c41a' },
]

const activeTab = ref('sales')

const salesBooks = ref([
  { id: 1, title: '软件工程与计算', price: 89.00, originalPrice: 110.00, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80', author: '骆斌', rating: 4.8, tags: ['教材', '热销'] },
  { id: 2, title: '深入理解计算机系统', price: 129.00, originalPrice: 159.00, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80', author: 'Randal E. Bryant', rating: 4.9, tags: ['经典', '硬核'] },
  { id: 3, title: 'Vue.js设计与实现', price: 79.00, originalPrice: 99.00, cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=300&q=80', author: '霍春阳', rating: 4.9, tags: ['前端'] },
  { id: 4, title: 'JavaScript高级程序设计', price: 99.00, originalPrice: 129.00, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80', author: 'Matt Frisbie', rating: 4.7, tags: ['红宝书'] },
])

const ratingBooks = ref([...salesBooks.value].reverse())

// --- 路由跳转逻辑 ---

// 跳转到详情页
const goToDetail = (id) => {
  router.push({ name: 'ProductDetail', params: { id } })
}

// 跳转到分类页
const navigateToCategory = (key) => {
  console.log('Navigate to category:', key)
  router.push({
    name: 'Category',
    params: { type: key }
  })
}
</script>

<!-- BookCard 组件保持不变，但增加 cursor:pointer 样式 -->
<script>
import { defineComponent } from 'vue'

export const BookCard = defineComponent({
  name: 'BookCard',
  props: ['book'],
  emits: ['click'], // 声明 emit
  template: `
    <div class="book-card" @click="$emit('click')">
      <div class="card-image-wrapper">
        <el-image :src="book.cover" fit="cover" loading="lazy" class="book-cover">
          <template #placeholder>
            <div class="image-slot">Loading...</div>
          </template>
        </el-image>
        <div class="hover-actions">
           <el-button type="primary" circle icon="View" />
        </div>
      </div>

      <div class="card-content">
        <div class="book-tags" v-if="book.tags">
          <span v-for="tag in book.tags" :key="tag" class="mini-tag">{{ tag }}</span>
        </div>
        <h3 class="book-title" :title="book.title">{{ book.title }}</h3>
        <p class="book-author">{{ book.author }}</p>
        <div class="book-meta">
          <div class="price-box">
             <span class="currency">¥</span>
             <span class="current-price">{{ book.price }}</span>
             <span class="original-price" v-if="book.originalPrice">¥{{ book.originalPrice }}</span>
          </div>
          <el-button type="primary" plain circle icon="ShoppingCart" size="small" class="add-btn" />
        </div>
      </div>
    </div>
  `
})
</script>

<style scoped lang="scss">
/* 保持你原有的样式，此处省略重复部分 */
$primary-color: #409eff;
$text-main: #303133;
$text-secondary: #909399;
$border-radius: 12px;
$container-width: 1200px;

.bookstore-app {
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.container {
  max-width: $container-width;
  margin: 0 auto;
  padding: 0 20px;
}

/* 轮播图 */
.banner-carousel {
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  margin-bottom: 30px;

  .banner-item {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 80px;
    color: white;
    position: relative;
  }
  .banner-content {
    z-index: 2;
    max-width: 50%;
    .banner-tag {
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      backdrop-filter: blur(5px);
    }
    h1 {
      font-size: 36px;
      margin: 16px 0;
      line-height: 1.2;
    }
    p {
      font-size: 18px;
      margin-bottom: 24px;
      opacity: 0.9;
    }
  }
}

/* 特色分类 Grid */
.feature-grid {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;

  .feature-item {
    flex: 1;
    background: white;
    border-radius: $border-radius;
    padding: 20px;
    display: flex;
    align-items: center;
    cursor: pointer; // 增加手指光标
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.08);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
    }

    .feature-title {
      font-size: 16px;
      font-weight: 600;
      color: $text-main;
    }
  }
}

/* Section Wrapper & Header */
.section-wrapper {
  background: white;
  border-radius: $border-radius;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 22px;
    margin: 0;
    color: $text-main;
  }
}

/* Tabs */
.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #f0f2f5;
}
.custom-tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
}

/* Grid */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  padding-top: 10px;
}

/* BookCard Scoped Styles */
:deep(.book-card) {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  position: relative;
  cursor: pointer; // 增加手指光标

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    .hover-actions { opacity: 1; }
  }

  .card-image-wrapper {
    position: relative;
    height: 220px;
    background: #f8f8f8;
    overflow: hidden;
    .book-cover { width: 100%; height: 100%; transition: transform 0.5s; }
    &:hover .book-cover { transform: scale(1.05); }
    .hover-actions {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s;
    }
  }

  .card-content { padding: 16px; }
  .book-tags {
    margin-bottom: 8px; display: flex; gap: 4px;
    .mini-tag { font-size: 10px; padding: 2px 6px; background: #e6f7ff; color: $primary-color; border-radius: 4px; }
  }
  .book-title { margin: 0 0 6px; font-size: 15px; font-weight: 600; color: $text-main; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .book-author { color: $text-secondary; font-size: 12px; margin: 0 0 12px; }
  .book-meta { display: flex; justify-content: space-between; align-items: flex-end; }
  .price-box {
    color: #ff4d4f; line-height: 1;
    .currency { font-size: 12px; margin-right: 2px; }
    .current-price { font-size: 20px; font-weight: bold; }
    .original-price { font-size: 12px; color: #ccc; text-decoration: line-through; margin-left: 6px; }
  }
}

.site-footer {
  text-align: center; padding: 40px 0; color: $text-secondary; border-top: 1px solid #eee; background: white; margin-top: 40px;
}
</style>