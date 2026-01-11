<template>
  <div class="category-page">
    <div class="container">

      <!-- 1. 顶部面包屑与标题区 -->
      <div class="page-header">
        <el-breadcrumb separator="/" class="styled-breadcrumb">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="section-title-group">
          <span class="indicator"></span>
          <h2 class="title">{{ pageTitle }}</h2>
          <span class="subtitle">{{ categoryMap[categoryType]?.desc || '探索知识的海洋' }}</span>
        </div>
      </div>

      <!-- 2. 筛选工具栏 (Glassmorphism 风格) -->
      <div class="toolbar-wrapper">
        <div class="filter-group">
          <span class="filter-label">排序方式：</span>
          <div class="sort-options">
            <div
                v-for="sort in sortOptions"
                :key="sort.value"
                :class="['sort-chip', { active: currentSort === sort.value }]"
                @click="handleSort(sort.value)"
            >
              {{ sort.label }}
            </div>
          </div>
        </div>
        <div class="meta-info">
          共收录 <strong>{{ bookList.length }}</strong> 本藏书
        </div>
      </div>

      <!-- 3. 书籍列表区域 (3D 书架风格) -->
      <div class="book-list-section" v-loading="loading">

        <div class="bookshelf-grid" v-if="bookList.length > 0">
          <div
              v-for="book in bookList"
              :key="book.id"
              class="book-item-wrapper"
              @click="goToDetail(book.id)"
          >
            <!-- 3D 书籍核心结构 -->
            <div class="book-3d">
              <div class="book-cover">
                <img :src="book.cover" :alt="book.title" loading="lazy" />
                <div class="book-spine"></div> <!-- 书脊 -->
                <div class="book-sheen"></div> <!-- 光泽 -->
              </div>
            </div>

            <!-- 书籍信息 -->
            <div class="book-info">
              <h3 class="book-title" :title="book.title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <div class="book-meta">
                <span class="price">
                  <span class="symbol">¥</span>{{ book.price }}
                </span>
                <!-- 原价划线 -->
                <span class="original-price" v-if="book.originalPrice > book.price">
                  ¥{{ book.originalPrice }}
                </span>
                <!-- 高分标签 -->
                <el-tag size="small" effect="dark" round color="#ff6700" style="border:none" v-if="book.rating >= 9.0" class="score-tag">
                  {{ book.rating }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-else description="该分类下暂无书籍" :image-size="200" />

        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="bookList.length > 0">
          <el-pagination
              background
              layout="prev, pager, next"
              :total="bookList.length"
              :page-size="12"
              class="custom-pagination"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const currentSort = ref('default')

// --- 配置映射 ---
const categoryMap = {
  new: { title: '新书首发', desc: '本周最新上架的精选好书' },
  ebook: { title: '电子书海', desc: '随时随地，享受阅读的乐趣' },
  bestseller: { title: '畅销热榜', desc: '千万读者共同选择的年度好书' },
  sale: { title: '特价优惠', desc: '超值低价，限时抢购中' },
  tech: { title: '计算机与互联网', desc: '赋能未来的技术力量' },
  all: { title: '全部馆藏', desc: '探索未知的知识疆界' }
}

const categoryType = computed(() => route.params.type || 'all')
const pageTitle = computed(() => categoryMap[categoryType.value]?.title || '图书列表')

const sortOptions = [
  { label: '综合推荐', value: 'default' },
  { label: '销量优先', value: 'sales' },
  { label: '价格 ↓', value: 'price_asc' },
  { label: '评分 ↑', value: 'rating' }
]

// --- Mock Data 生成器 (保持原有逻辑，确保图片链接有效) ---
const generateMockBooks = (type) => {
  const baseBooks = [
    // 历史
    { id: 1, title: '今日向长安', price: 199.00, originalPrice: 219.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/3_%E4%BB%8A%E6%97%A5%E5%90%91%E9%95%BF%E5%AE%89.jpg', author: '高瑞梓', rating: 9.6, tags: ['唐史', '长安'] },
    { id: 2, title: '崖山', price: 69.00, originalPrice: 89.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/8_%E5%B4%96%E5%B1%B1.jpg', author: '张明扬', rating: 8.4, tags: ['宋史', '战争'] },
    { id: 3, title: '明朝那些事儿（1-9）', price: 358.20, originalPrice: 378.20, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/60_%E6%98%8E%E6%9C%9D%E9%82%A3%E4%BA%9B%E4%BA%8B%E5%84%BF.jpg', author: '当年明月', rating: 9.2, tags: ['明史'] },
    { id: 4, title: '秦汉史讲义', price: 138.00, originalPrice: 158.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/16_%E7%A7%A6%E6%B1%89%E5%8F%B2%E8%AE%B2%E4%B9%89.jpg', author: '秦晖', rating: 9.2, tags: ['秦汉史'] },
    // 科幻
    { id: 19, title: '球状闪电', price: 25.00, originalPrice: 45.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/15_%E7%90%83%E7%8A%B6%E9%97%AA%E7%94%B5.jpg', author: '刘慈欣', rating: 9.0, tags: ['科幻'] },
    { id: 35, title: '尤比克', price: 35.00, originalPrice: 45.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/57_%E5%B0%A4%E6%AF%94%E5%85%8B.jpg', author: '菲利普·迪克', rating: 8.8, tags: ['经典科幻'] },
    // 技术
    { id: 38, title: '深入理解计算机系统', price: 108.00, originalPrice: 139.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/2_%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F%20%28%E5%8E%9F%E4%B9%A6%E7%AC%AC3%E7%89%88%29.jpg', author: 'Randal E. Bryant', rating: 9.8, tags: ['计算机'] },
    { id: 39, title: '强化学习的数学原理', price: 108.00, originalPrice: 128.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/4_%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86.jpg', author: '赵世钰', rating: 9.7, tags: ['AI'] },
    { id: 52, title: '算法笔记', price: 65.00, originalPrice: 85.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/41_%E7%AE%97%E6%B3%95%E7%AC%94%E8%AE%B0.jpg', author: '胡凡', rating: 9.1, tags: ['算法'] },
    { id: 60, title: '深入剖析Kubernetes', price: 99.00, originalPrice: 119.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/54_%E6%B7%B1%E5%85%A5%E5%89%96%E6%9E%90Kubernetes.jpg', author: '张磊', rating: 9.4, tags: ['云原生'] },
    // 文学
    { id: 12, title: '流俗地', price: 55.00, originalPrice: 75.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/13_%E6%B5%81%E4%BF%97%E5%9C%B0.jpg', author: '黎紫书', rating: 9.2, tags: ['文学'] },
    { id: 14, title: '献给阿尔吉侬的花束', price: 32.00, originalPrice: 45.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/3_%E7%8C%AE%E7%BB%99%E9%98%BF%E5%B0%94%E5%90%89%E4%BE%AC%E7%9A%84%E8%8A%B1%E6%9D%9F.jpg', author: '丹尼尔·凯斯', rating: 9.0, tags: ['小说'] },
  ]

  // 简单模拟数据扩充
  let result = [...baseBooks, ...baseBooks] // 复制一份让列表长一点

  if (type === 'new') return result.slice(0, 6)
  if (type === 'sale') return result.filter(b => b.originalPrice > b.price + 20)

  return result
}

const bookList = ref([])

const fetchData = () => {
  loading.value = true
  // 模拟网络请求延迟
  setTimeout(() => {
    bookList.value = generateMockBooks(categoryType.value)
    // 重置排序状态
    if(currentSort.value !== 'default') handleSort(currentSort.value)
    else loading.value = false
  }, 600)
}

const handleSort = (sortType) => {
  currentSort.value = sortType
  loading.value = true

  setTimeout(() => {
    const list = [...bookList.value]
    if (sortType === 'price_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortType === 'rating') {
      list.sort((a, b) => b.rating - a.rating)
    } else if (sortType === 'sales') {
      // Mock random sales sort
      list.sort((a, b) => 0.5 - Math.random())
    } else {
      // Default: Reset
      bookList.value = generateMockBooks(categoryType.value)
      loading.value = false
      return
    }
    bookList.value = list
    loading.value = false
  }, 300)
}

const goToDetail = (id) => {
  router.push({ name: 'ProductDetail', params: { id } })
}

watch(() => route.params.type, () => {
  currentSort.value = 'default'
  fetchData()
}, { immediate: true })

</script>

<style scoped lang="scss">
@use "sass:color";

// --- 变量定义 ---
$tomato-main: #ff6700;
$dark-text: #2c3e50;
$gray-text: #606266;
$bg-color: #f8f9fa;
$container-width: 1200px;

.category-page {
  padding: 40px 0 80px;
  background-color: $bg-color;
  min-height: calc(100vh - 64px);
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.container {
  max-width: $container-width;
  margin: 0 auto;
  padding: 0 20px;
}

/* ================== 1. Header & Breadcrumb ================== */
.page-header {
  margin-bottom: 30px;
}

.styled-breadcrumb {
  margin-bottom: 16px;
  font-size: 14px;
  :deep(.el-breadcrumb__inner) {
    color: #999;
    font-weight: normal;
    &:hover { color: $tomato-main; }
  }
  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: #666;
    font-weight: 600;
  }
}

.section-title-group {
  display: flex;
  align-items: baseline;

  .indicator {
    display: inline-block;
    width: 6px;
    height: 28px;
    background: linear-gradient(to bottom, $tomato-main, color.adjust($tomato-main, $lightness: 15%));
    margin-right: 16px;
    border-radius: 3px;
    transform: translateY(4px);
  }

  .title {
    font-size: 32px;
    color: $dark-text;
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
  }

  .subtitle {
    margin-left: 20px;
    font-size: 15px;
    color: #999;
    font-weight: 400;
  }
}

/* ================== 2. Filter Toolbar ================== */
.toolbar-wrapper {
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.03);

  .filter-group {
    display: flex;
    align-items: center;
    gap: 16px;

    .filter-label {
      font-size: 14px;
      color: #909399;
      font-weight: 500;
    }
  }

  .sort-options {
    display: flex;
    gap: 10px;

    .sort-chip {
      padding: 6px 16px;
      font-size: 14px;
      border-radius: 20px;
      cursor: pointer;
      color: #606266;
      background: #f5f7fa;
      transition: all 0.2s ease;
      font-weight: 500;

      &:hover {
        background: color.adjust($tomato-main, $lightness: 42%);
        color: $tomato-main;
      }

      &.active {
        background: $tomato-main;
        color: white;
        box-shadow: 0 4px 10px rgba($tomato-main, 0.3);
      }
    }
  }

  .meta-info {
    font-size: 13px;
    color: #999;
    strong { color: $dark-text; font-weight: 700; }
  }
}

/* ================== 3. 3D Books Grid ================== */
.bookshelf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 50px 30px; /* 上下间距大一点给3D效果留空间 */
  padding-bottom: 20px;
}

.book-item-wrapper {
  cursor: pointer;
  position: relative;
  padding-bottom: 10px;
  /* 触发3D场景 */
  perspective: 1000px;
}

/* --- 3D 书籍核心样式 --- */
.book-3d {
  position: relative;
  width: 150px;
  height: 220px;
  margin: 0 auto 25px;
  transform-style: preserve-3d;
  transition: transform 0.4s ease;
}

.book-cover {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  /* 默认左转，露出书脊，增加立体感 */
  transform: rotateY(-25deg) translateX(5px);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 10px 15px 25px rgba(0,0,0,0.15);
  border-radius: 2px 4px 4px 2px;

  img {
    width: 100%; height: 100%; object-fit: cover;
    border-radius: 2px 4px 4px 2px;
    background: #fff;
    display: block;
  }
}

.book-spine {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 16px;
  background: #dedede; /* 默认书脊颜色 */
  /* 书脊纹理模拟 */
  background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.2));
  transform: rotateY(90deg) translateZ(-8px); /* Z位移要是宽度的一半 */
  border-left: 1px solid rgba(0,0,0,0.1);
}

.book-sheen {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%);
  pointer-events: none;
  z-index: 10;
  border-radius: 2px 4px 4px 2px;
}

/* Hover 交互：书本回正并浮起 */
.book-item-wrapper:hover .book-cover {
  transform: rotateY(0deg) scale(1.08) translateZ(10px);
  box-shadow: 0 25px 40px rgba(0,0,0,0.2);
  z-index: 10;
}

.book-item-wrapper:active .book-cover {
  transform: scale(0.98);
}

/* 书籍底部信息 */
.book-info {
  text-align: center;
  padding: 0 8px;

  .book-title {
    font-size: 16px;
    margin: 0 0 6px;
    color: #333;
    font-weight: 700;
    line-height: 1.4;

    /* 限制两行 */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 44px;
  }

  .book-author {
    font-size: 13px;
    color: #909399;
    margin: 0 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .book-meta {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    .price {
      color: $tomato-main;
      font-size: 18px;
      font-weight: 700;
      font-family: 'DIN Alternate', sans-serif;
      .symbol { font-size: 13px; margin-right: 2px; }
    }

    .original-price {
      font-size: 12px;
      color: #ccc;
      text-decoration: line-through;
    }

    .score-tag {
      transform: scale(0.9);
      font-weight: bold;
    }
  }
}

/* ================== 4. Pagination ================== */
.pagination-wrapper {
  margin-top: 60px;
  display: flex;
  justify-content: center;

  :deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active)
  { background-color: $tomato-main; }

  :deep(.el-pagination.is-background .el-pager li:hover)
  { color: $tomato-main; }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .section-title-group .title { font-size: 24px; }
  .section-title-group .subtitle { display: none; }

  .toolbar-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .sort-options {
      flex-wrap: wrap;
    }
  }

  .bookshelf-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px 15px;
  }

  .book-3d { width: 120px; height: 170px; }
  .book-info .book-title { font-size: 14px; height: 40px; }
}
</style>