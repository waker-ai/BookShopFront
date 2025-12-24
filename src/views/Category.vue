<template>
  <div class="category-page">
    <div class="container">

      <!-- 1. 顶部面包屑与标题 -->
      <div class="page-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h2 class="category-title">{{ pageTitle }}</h2>
      </div>

      <!-- 2. 筛选工具栏 -->
      <div class="toolbar">
        <div class="sort-filters">
          <span
              v-for="sort in sortOptions"
              :key="sort.value"
              :class="['sort-item', { active: currentSort === sort.value }]"
              @click="handleSort(sort.value)"
          >
            {{ sort.label }}
          </span>
        </div>
        <div class="meta-info">
          共找到 <strong>{{ bookList.length }}</strong> 本相关书籍
        </div>
      </div>

      <!-- 3. 书籍列表区域 -->
      <div class="book-list-wrapper" v-loading="loading">
        <div class="book-grid" v-if="bookList.length > 0">
          <BookCard
              v-for="book in bookList"
              :key="book.id"
              :book="book"
              @click="goToDetail(book.id)"
          />
        </div>

        <!-- 空状态 -->
        <el-empty v-else description="该分类下暂无书籍" />

        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="bookList.length > 0">
          <el-pagination
              background
              layout="prev, pager, next"
              :total="bookList.length"
              :page-size="12"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { View, ShoppingCart } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const currentSort = ref('default')

// --- 配置映射 ---
const categoryMap = {
  new: { title: '新书首发', desc: '本周最新上架的好书' },
  ebook: { title: '电子书海', desc: '随时随地，想读就读' },
  bestseller: { title: '畅销热榜', desc: '大家都爱看的年度好书' },
  sale: { title: '特价优惠', desc: '超值低价，限时抢购' },
  tech: { title: '计算机与互联网', desc: '' }
}

// 获取当前分类 Key
const categoryType = computed(() => route.params.type || 'all')
const pageTitle = computed(() => categoryMap[categoryType.value]?.title || '图书列表')

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '销量优先', value: 'sales' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '好评优先', value: 'rating' }
]

// --- Mock Data 生成器 ---
// 为了演示效果，我们根据分类生成不同的模拟数据
const generateMockBooks = (type) => {
  const baseBooks = [
    { id: 101, title: 'Python编程：从入门到实践', author: 'Eric Matthes', price: 69.00, originalPrice: 89.00, cover: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', rating: 9.8, tags: ['编程'] },
    { id: 102, title: '人类简史', author: '尤瓦尔·赫拉利', price: 48.00, originalPrice: 68.00, cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', rating: 9.5, tags: ['历史'] },
    { id: 103, title: '算法导论', author: 'Thomas H. Cormen', price: 128.00, originalPrice: 168.00, cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', rating: 9.9, tags: ['硬核'] },
    { id: 104, title: '解忧杂货店', author: '东野圭吾', price: 39.00, originalPrice: 45.00, cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', rating: 9.2, tags: ['小说'] },
    { id: 105, title: '黑客与画家', author: 'Paul Graham', price: 55.00, originalPrice: 0, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', rating: 9.1, tags: ['随笔'] },
    { id: 106, title: '高性能MySQL', author: 'Baron Schwartz', price: 99.00, originalPrice: 128.00, cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400', rating: 9.6, tags: ['数据库'] },
    { id: 107, title: '设计模式', author: 'GoF', price: 45.00, originalPrice: 0, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', rating: 9.7, tags: ['经典'] },
    { id: 108, title: '且以优雅过一生', author: '杨绛', price: 32.00, originalPrice: 40.00, cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', rating: 9.3, tags: ['文学'] },
  ]

  // 根据分类做一点简单的过滤模拟
  if (type === 'new') return baseBooks.slice(0, 4) // 取前4本
  if (type === 'sale') return baseBooks.filter(b => b.originalPrice > 0) // 有原价的
  if (type === 'ebook') return baseBooks.map(b => ({ ...b, tags: [...b.tags, '电子书'] })) // 加上标签

  return baseBooks // 默认返回全部
}

const bookList = ref([])

const fetchData = () => {
  loading.value = true
  // 模拟网络延迟
  setTimeout(() => {
    bookList.value = generateMockBooks(categoryType.value)
    loading.value = false
  }, 500)
}

const handleSort = (sortType) => {
  currentSort.value = sortType
  loading.value = true
  // 简单的排序模拟
  setTimeout(() => {
    if (sortType === 'price_asc') {
      bookList.value.sort((a, b) => a.price - b.price)
    } else if (sortType === 'rating') {
      bookList.value.sort((a, b) => b.rating - a.rating)
    } else {
      bookList.value = generateMockBooks(categoryType.value) // 重置
    }
    loading.value = false
  }, 300)
}

const goToDetail = (id) => {
  router.push({ name: 'ProductDetail', params: { id } })
}

// 监听路由参数变化（例如从 /category/new 变到 /category/sale）
watch(() => route.params.type, () => {
  fetchData()
}, { immediate: true })

</script>

<!--
  这里我们再次定义了 BookCard。
  最佳实践建议：将 BookCard 提取到 src/components/BookCard.vue 中，
  然后在 Home.vue 和 Category.vue 中 import BookCard from '@/components/BookCard.vue'
-->
<script>
import { defineComponent } from 'vue'
export const BookCard = defineComponent({
  name: 'BookCard',
  props: ['book'],
  emits: ['click'],
  template: `
    <div class="book-card" @click="$emit('click')">
      <div class="card-image-wrapper">
        <el-image :src="book.cover" fit="cover" loading="lazy" class="book-cover">
          <template #placeholder><div class="image-slot">...</div></template>
        </el-image>
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
             <span class="original-price" v-if="book.originalPrice && book.originalPrice > book.price">¥{{ book.originalPrice }}</span>
          </div>
          <el-button type="primary" plain circle icon="ShoppingCart" size="small" class="add-btn" @click.stop />
        </div>
      </div>
    </div>
  `
})
</script>

<style scoped lang="scss">
/* 公共变量 */
$primary-color: #409eff;
$tomato-color: #ff6700;
$text-main: #303133;
$text-secondary: #909399;
$container-width: 1200px;

.category-page {
  padding: 24px 0 60px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px); /* 减去头部高度 */
}

.container {
  max-width: $container-width;
  margin: 0 auto;
  padding: 0 20px;
}

/* 头部 */
.page-header {
  margin-bottom: 24px;

  .category-title {
    margin-top: 16px;
    font-size: 28px;
    color: $text-main;
    font-weight: 700;
  }
}

/* 工具栏 */
.toolbar {
  background: white;
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);

  .sort-filters {
    display: flex;
    gap: 24px;

    .sort-item {
      cursor: pointer;
      font-size: 14px;
      color: #606266;
      transition: color 0.2s;

      &:hover { color: $primary-color; }
      &.active {
        color: $primary-color;
        font-weight: bold;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: $primary-color;
          border-radius: 2px;
        }
      }
    }
  }

  .meta-info {
    font-size: 13px;
    color: #999;
    strong { color: $text-main; }
  }
}

/* 书籍网格 */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  min-height: 300px;
}

/* 分页 */
.pagination-wrapper {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

/* --- 卡片样式 (与首页保持一致) --- */
:deep(.book-card) {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  }

  .card-image-wrapper {
    height: 220px;
    background: #f8f8f8;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .book-cover {
      width: 100%;
      height: 100%;
      transition: transform 0.5s;
    }
    &:hover .book-cover { transform: scale(1.05); }
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
    .current-price { font-size: 18px; font-weight: bold; }
    .original-price { font-size: 12px; color: #ccc; text-decoration: line-through; margin-left: 6px; }
  }
}
</style>