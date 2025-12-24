<template>
  <div class="bookstore-app">
    <main class="container main-content">

      <!-- 1. 广告轮播 (保持不变) -->
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

      <!-- 2. 特色分类入口 (保持不变) -->
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

      <!-- 3. 热门书籍列表 (修改处：去掉了 Tab 切换，直接展示) -->
      <div class="recommend-section">
        <div class="section-header">
          <h2>热门推荐</h2>
          <!-- 点击查看全部跳转到 'bestseller' 分类 -->
          <el-button link @click="navigateToCategory('bestseller')">
            查看更多 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>

        <div class="book-grid">
          <!-- 直接使用引入的 BookCard 组件 -->
          <BookCard
              v-for="book in salesBooks"
              :key="book.id"
              :book="book"
              @click="goToDetail(book.id)"
          />
        </div>
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
import { useRouter } from 'vue-router'
import {
  Right, Reading, ArrowRight,
  Trophy, DataLine, Collection, Present
} from '@element-plus/icons-vue'

// ✅ 关键：引入你在 Category.vue 中已经创建好的组件
// 这样就不会报错 "runtime compilation is not supported"
import BookCard from '@/components/BookCard.vue'

const router = useRouter()

// --- Data ---
const banners = [
  { title: '重构：改善既有代码的设计', subtitle: '限时 5 折起，程序员必读经典', color1: '#84fab0', color2: '#8fd3f4', relatedId: 1 },
  { title: '深入理解计算机系统', subtitle: '揭开计算机系统的神秘面纱', color1: '#fccb90', color2: '#d57eeb', relatedId: 2 },
  { title: '设计模式之禅', subtitle: '年度好书大促，满 100 减 50', color1: '#e0c3fc', color2: '#8ec5fc', relatedId: 3 }
]

const features = [
  { title: '新书首发', key: 'new', icon: 'Present', bg: '#fff0f0', color: '#ff4d4f' },
  { title: '电子书', key: 'ebook', icon: 'Collection', bg: '#f0f5ff', color: '#409eff' },
  { title: '畅销榜', key: 'bestseller', icon: 'Trophy', bg: '#fff7e6', color: '#faad14' },
  { title: '特价区', key: 'sale', icon: 'DataLine', bg: '#f6ffed', color: '#52c41a' },
]

// 模拟数据
const salesBooks = ref([
  { id: 1, title: '软件工程与计算', price: 89.00, originalPrice: 110.00, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80', author: '骆斌', rating: 4.8, tags: ['教材', '热销'] },
  { id: 2, title: '深入理解计算机系统', price: 129.00, originalPrice: 159.00, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80', author: 'Randal E. Bryant', rating: 4.9, tags: ['经典', '硬核'] },
  { id: 3, title: 'Vue.js设计与实现', price: 79.00, originalPrice: 99.00, cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=300&q=80', author: '霍春阳', rating: 4.9, tags: ['前端'] },
  { id: 4, title: 'JavaScript高级程序设计', price: 99.00, originalPrice: 129.00, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80', author: 'Matt Frisbie', rating: 4.7, tags: ['红宝书'] },
  { id: 5, title: '算法导论', price: 128.00, originalPrice: 168.00, cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', author: 'Thomas H. Cormen', rating: 9.9, tags: ['硬核'] },
  { id: 6, title: '解忧杂货店', price: 39.00, originalPrice: 45.00, cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', author: '东野圭吾', rating: 9.2, tags: ['小说'] },
  { id: 7, title: '设计模式', price: 45.00, originalPrice: 0, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', author: 'GoF', rating: 9.7, tags: ['经典'] },
  { id: 8, title: '且以优雅过一生', price: 32.00, originalPrice: 40.00, cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', author: '杨绛', rating: 9.3, tags: ['文学'] },
])

// --- 路由跳转逻辑 ---
const goToDetail = (id) => {
  router.push({ name: 'ProductDetail', params: { id } })
}

const navigateToCategory = (key) => {
  router.push({ name: 'Category', params: { type: key } })
}
</script>

<!-- ✅ 这里的旧 <script> 块已经被彻底删除了，千万不要加回来 -->

<style scoped lang="scss">
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
    h1 { font-size: 36px; margin: 16px 0; line-height: 1.2; }
    p { font-size: 18px; margin-bottom: 24px; opacity: 0.9; }
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
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.08);
    }

    .feature-icon {
      width: 48px; height: 48px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin-right: 15px;
    }
    .feature-title { font-size: 16px; font-weight: 600; color: $text-main; }
  }
}

/* 推荐板块 */
.recommend-section {
  background: white; /* 如果想要纯背景，可以去掉这个 background 和 padding */
  border-radius: $border-radius;
  padding: 24px;
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h2 { font-size: 24px; font-weight: bold; margin: 0; color: $text-main; }
}

/* Grid */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.site-footer {
  text-align: center; padding: 40px 0; color: $text-secondary; border-top: 1px solid #eee; background: white; margin-top: 40px;
}
</style>