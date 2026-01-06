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
    { id: 1, title: '软件工程与计算', price: 89.00, originalPrice: 110.00, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80', author: '骆斌', rating: 4.8, tags: ['教材', '热销'] },
    { id: 2, title: '深入理解计算机系统', price: 129.00, originalPrice: 159.00, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80', author: 'Randal E. Bryant', rating: 4.9, tags: ['经典', '硬核'] },
    { id: 3, title: 'Vue.js设计与实现', price: 79.00, originalPrice: 99.00, cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=300&q=80', author: '霍春阳', rating: 4.9, tags: ['前端'] },
    { id: 4, title: 'JavaScript高级程序设计', price: 99.00, originalPrice: 129.00, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80', author: 'Matt Frisbie', rating: 4.7, tags: ['红宝书'] },
    { id: 5, title: '算法导论', price: 128.00, originalPrice: 168.00, cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', author: 'Thomas H. Cormen', rating: 9.9, tags: ['硬核'] },
    { id: 6, title: '解忧杂货店', price: 39.00, originalPrice: 45.00, cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', author: '东野圭吾', rating: 9.2, tags: ['小说'] },
    { id: 7, title: '设计模式', price: 45.00, originalPrice: 0, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', author: 'GoF', rating: 9.7, tags: ['经典'] },
    { id: 8, title: '且以优雅过一生', price: 32.00, originalPrice: 40.00, cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', author: '杨绛', rating: 9.3, tags: ['文学'] },

    // --- 历史系列 ---
    { id: 9, title: '季风海域的丝银对流', price: 78.00, originalPrice: 98.00, cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400', author: '欧阳安', rating: 8.6, tags: ['全球史', '贸易'] },
    { id: 10, title: '显微镜下的大明', price: 42.00, originalPrice: 52.00, cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400', author: '马伯庸', rating: 8.7, tags: ['明代'] },
    { id: 11, title: '法西斯主义的公民基础', price: 88.00, originalPrice: 0, cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400', author: '迪伦·莱利', rating: 8.9, tags: ['社会学'] },

    // --- 科幻系列 ---
    { id: 12, title: '血孩子', price: 46.80, originalPrice: 58.00, cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400', author: '奥克塔维娅·巴特勒', rating: 8.2, tags: ['科幻', '悬疑'] },
    { id: 13, title: '悠游长风', price: 52.00, originalPrice: 62.00, cover: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=400', author: '莎拉·平斯克', rating: 8.7, tags: ['科幻', '短篇'] },
    { id: 14, title: '三体全集', price: 93.00, originalPrice: 110.00, cover: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400', author: '刘慈欣', rating: 9.5, tags: ['硬科幻'] },
    { id: 15, title: '神经漫游者', price: 42.00, originalPrice: 55.00, cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400', author: '威廉·吉布森', rating: 9.0, tags: ['赛博朋克'] },
    { id: 16, title: '沙丘', price: 68.00, originalPrice: 88.00, cover: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400', author: '弗兰克·赫伯特', rating: 8.8, tags: ['太空歌剧'] },
    { id: 17, title: '盲视', price: 45.00, originalPrice: 0, cover: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400', author: '彼得·沃茨', rating: 8.6, tags: ['硬核'] },

    // --- 儿童系列 ---
    { id: 18, title: '万物皆美', price: 35.00, originalPrice: 0, cover: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400', author: '冯骥才', rating: 9.0, tags: ['美育'] },
    { id: 19, title: '武器与国防', price: 45.00, originalPrice: 52.00, cover: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=400', author: '黄培康', rating: 8.8, tags: ['科普'] },
    { id: 20, title: '夏洛的网', price: 25.00, originalPrice: 32.00, cover: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400', author: 'E.B.怀特', rating: 9.2, tags: ['儿童文学'] },
    { id: 21, title: '哈利·波特', price: 58.00, originalPrice: 68.00, cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', author: 'J.K.罗琳', rating: 9.1, tags: ['奇幻'] },

    // --- 文学系列 ---
    { id: 22, title: '林门鄭氏', price: 49.00, originalPrice: 58.00, cover: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=400', author: '林雪虹', rating: 8.4, tags: ['非虚构'] },
    { id: 23, title: '河的第三条岸', price: 56.00, originalPrice: 68.00, cover: 'https://images.unsplash.com/photo-1508898578281-774ac4893c0c?w=400', author: '若昂·吉马良斯·罗萨', rating: 8.4, tags: ['拉美'] },
    { id: 24, title: '白夜行', price: 48.00, originalPrice: 59.00, cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400', author: '东野圭吾', rating: 9.1, tags: ['推理'] },

    // --- 诗歌系列 ---
    { id: 25, title: '最高虚构笔记', price: 52.00, originalPrice: 68.00, cover: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?w=400', author: '华莱士·史蒂文斯', rating: 8.6, tags: ['诗集'] },
    { id: 26, title: '万物静默如谜', price: 35.00, originalPrice: 42.00, cover: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', author: '辛波斯卡', rating: 9.1, tags: ['诺奖'] },

    // --- 混合精选 ---
    { id: 27, title: '悉达多', price: 32.00, originalPrice: 40.00, cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400', author: '黑塞', rating: 9.3, tags: ['精神'] },
    { id: 28, title: '红楼梦', price: 120.00, originalPrice: 158.00, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', author: '曹雪芹', rating: 9.6, tags: ['国学'] },
    { id: 29, title: '围城', price: 35.00, originalPrice: 42.00, cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400', author: '钱钟书', rating: 9.3, tags: ['讽刺'] },
    { id: 30, title: '黄金时代', price: 39.00, originalPrice: 45.00, cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', author: '王小波', rating: 9.4, tags: ['浪漫'] },
    { id: 31, title: '月亮和六便士', price: 29.00, originalPrice: 38.00, cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', author: '毛姆', rating: 8.8, tags: ['艺术'] },
    { id: 32, title: '追风筝的人', price: 36.00, originalPrice: 45.00, cover: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400', author: '卡勒德·胡赛尼', rating: 8.9, tags: ['治愈'] },
    { id: 33, title: '小逻辑', price: 48.00, originalPrice: 60.00, cover: 'https://images.unsplash.com/photo-1533310266094-8898a03807dd?w=400', author: '黑格尔', rating: 9.2, tags: ['哲学'] },
    { id: 34, title: '大江大河', price: 128.00, originalPrice: 158.00, cover: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400', author: '阿耐', rating: 8.9, tags: ['励志'] },
    { id: 35, title: '局外人', price: 28.00, originalPrice: 35.00, cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', author: '加缪', rating: 9.1, tags: ['荒诞'] },
    { id: 36, title: '海子诗全集', price: 98.00, originalPrice: 118.00, cover: 'https://images.unsplash.com/photo-1524143878510-e3b8d6312402?w=400', author: '海子', rating: 9.5, tags: ['诗歌'] },
    { id: 27, title: '平凡的世界', price: 108.00, originalPrice: 138.00, cover: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400', author: '路遥', rating: 9.3, tags: ['长篇'] },
    { id: 38, title: '时间的秩序', price: 56.00, originalPrice: 0, cover: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400', author: '卡洛·罗韦利', rating: 9.0, tags: ['科普'] },

    // --- 心理与社会科学 ---
    { id: 39, title: '被讨厌的勇气', price: 45.0, originalPrice: 55.0, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', author: '岸见一郎', rating: 8.6, tags: ['阿德勒', '心理'] },
    { id: 40, title: '乌合之众', price: 32.0, originalPrice: 38.0, cover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400', author: '古斯塔夫·勒庞', rating: 8.3, tags: ['社会学'] },
    { id: 41, title: '思考，快与慢', price: 68.0, originalPrice: 89.0, cover: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400', author: '丹尼尔·卡尼曼', rating: 9.1, tags: ['思维', '经典'] },
    { id: 42, title: '非暴力沟通', price: 39.0, originalPrice: 49.0, cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', author: '马歇尔·卢森堡', rating: 8.8, tags: ['人际', '治愈'] },

    // --- 深度文学 ---
    { id: 43, title: '卡拉马佐夫兄弟', price: 98.0, originalPrice: 120.0, cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', author: '陀思妥耶夫斯基', rating: 9.6, tags: ['俄国', '巅峰'] },
    { id: 44, title: '月亮与六便士', price: 32.0, originalPrice: 39.0, cover: 'https://images.unsplash.com/photo-1533310266094-8898a03807dd?w=400', author: '毛姆', rating: 8.9, tags: ['理想'] },
    { id: 45, title: '鼠疫', price: 38.0, originalPrice: 45.0, cover: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400', author: '加缪', rating: 9.1, tags: ['存在主义'] },
    { id: 46, title: '德米安：彷徨少年时', price: 36.0, originalPrice: 42.0, cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', author: '赫尔曼·黑塞', rating: 9.0, tags: ['成长'] },

    // --- 历史与文明 ---
    { id: 47, title: '万历十五年', price: 29.8, originalPrice: 35.0, cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', author: '黄仁宇', rating: 9.2, tags: ['大历史'] },
    { id: 48, title: '叫魂', price: 52.0, originalPrice: 60.0, cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400', author: '孔飞力', rating: 9.1, tags: ['清史', '社会'] },
    { id: 49, title: '大不列颠百科全书', price: 399.0, originalPrice: 450.0, cover: 'https://images.unsplash.com/photo-1535905496755-26ae35d0ae54?w=400', author: '百科编委会', rating: 9.8, tags: ['典藏'] },
    { id: 50, title: '罗马帝国衰亡史', price: 240.0, originalPrice: 280.0, cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', author: '爱德华·吉本', rating: 9.5, tags: ['通史'] },

    // --- 科技与科普 ---
    { id: 51, title: '哥德尔、艾舍尔、巴赫', price: 158.0, originalPrice: 188.0, cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400', author: '侯世达', rating: 9.7, tags: ['跨界', '神作'] },
    { id: 52, title: '宇宙', price: 88.0, originalPrice: 98.0, cover: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400', author: '卡尔·萨根', rating: 9.5, tags: ['科普'] },
    { id: 53, title: '浪潮之巅', price: 79.0, originalPrice: 99.0, cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400', author: '吴军', rating: 9.1, tags: ['商业', '科技'] },
    { id: 54, title: '失控', price: 89.0, originalPrice: 109.0, cover: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400', author: '凯文·凯利', rating: 8.8, tags: ['互联网'] },
    { id: 55, title: '未来简史', price: 68.0, originalPrice: 78.0, cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400', author: '尤瓦尔·赫拉利', rating: 8.5, tags: ['哲学', 'AI'] },

    // --- 随笔与生活 ---
    { id: 56, title: '瓦尔登湖', price: 25.0, originalPrice: 32.0, cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', author: '梭罗', rating: 8.6, tags: ['自然', '宁静'] },
    { id: 57, title: '人生海海', price: 55.0, originalPrice: 59.0, cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', author: '麦家', rating: 8.2, tags: ['长篇', '传奇'] },
    { id: 58, title: '鱼乐', price: 42.0, originalPrice: 50.0, cover: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=400', author: '汪曾祺', rating: 9.3, tags: ['散文', '治愈'] },
    { id: 59, title: '沉默的大多数', price: 38.0, originalPrice: 45.0, cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400', author: '王小波', rating: 9.1, tags: ['杂文'] },
    { id: 60, title: '雅舍谈吃', price: 35.0, originalPrice: 42.0, cover: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400', author: '梁实秋', rating: 8.7, tags: ['美食', '生活'] },

    // --- 悬疑与幻想 ---
    { id: 61, title: '克苏鲁神话', price: 128.0, originalPrice: 158.0, cover: 'https://images.unsplash.com/photo-1501526029524-a8ea952b15be?w=400', author: '洛夫克拉夫特', rating: 8.6, tags: ['惊悚', '克系'] },
    { id: 62, title: '永恒的终结', price: 42.0, originalPrice: 52.0, cover: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400', author: '阿西莫夫', rating: 9.2, tags: ['时间旅行'] },
    { id: 63, title: '海伯利安', price: 99.0, originalPrice: 120.0, cover: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400', author: '丹·西蒙斯', rating: 9.0, tags: ['科幻圣经'] }
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