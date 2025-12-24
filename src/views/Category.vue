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
          <!-- 这里调用引入的 BookCard 组件 -->
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
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// ✅ 关键修改：引入独立的组件文件
// 请确保你已经创建了 src/components/BookCard.vue 文件
import BookCard from '@/components/BookCard.vue'

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

  if (type === 'new') return baseBooks.slice(0, 4)
  if (type === 'sale') return baseBooks.filter(b => b.originalPrice > 0)
  if (type === 'ebook') return baseBooks.map(b => ({ ...b, tags: [...b.tags, '电子书'] }))

  return baseBooks
}

const bookList = ref([])

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    bookList.value = generateMockBooks(categoryType.value)
    loading.value = false
  }, 500)
}

const handleSort = (sortType) => {
  currentSort.value = sortType
  loading.value = true
  setTimeout(() => {
    if (sortType === 'price_asc') {
      bookList.value.sort((a, b) => a.price - b.price)
    } else if (sortType === 'rating') {
      bookList.value.sort((a, b) => b.rating - a.rating)
    } else {
      bookList.value = generateMockBooks(categoryType.value)
    }
    loading.value = false
  }, 300)
}

const goToDetail = (id) => {
  router.push({ name: 'ProductDetail', params: { id } })
}

// 监听路由变化
watch(() => route.params.type, () => {
  fetchData()
}, { immediate: true })

</script>

<!-- ✅ 这里的旧 <script> 块已经被删除了，不要加回来 -->

<style scoped lang="scss">
/* 公共变量 */
$primary-color: #409eff;
$text-main: #303133;
$text-secondary: #909399;
$container-width: 1200px;

.category-page {
  padding: 24px 0 60px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.container {
  max-width: $container-width;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 24px;
  .category-title {
    margin-top: 16px;
    font-size: 28px;
    color: $text-main;
    font-weight: 700;
  }
}

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

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  min-height: 300px;
}

.pagination-wrapper {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>