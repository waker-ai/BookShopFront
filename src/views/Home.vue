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
])

// --- 路由跳转逻辑 ---
const goToDetail = (id) => {
  router.push({ name: 'ProductDetail', params: { id:id } })
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