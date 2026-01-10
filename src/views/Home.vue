<template>
  <div class="bookstore-home">
    <div class="container">

      <!-- 1. 沉浸式轮播图 (Glassmorphism 风格) -->
      <div class="banner-wrapper">
        <el-carousel trigger="click" height="420px" class="premium-carousel" :interval="6000">
          <el-carousel-item v-for="(banner, index) in banners" :key="index">
            <div class="banner-slide" :style="{ background: `linear-gradient(135deg, ${banner.bgStart} 0%, ${banner.bgEnd} 100%)` }">
              <!-- 左侧文字内容 -->
              <div class="banner-content">
                <div class="tag-badge">
                  <el-icon><Trophy /></el-icon> {{ banner.tag }}
                </div>
                <h1 class="title">{{ banner.title }}</h1>
                <p class="subtitle">{{ banner.subtitle }}</p>
                <el-button type="primary" round size="large" class="action-btn" @click="goToDetail(banner.relatedId)">
                  立即试读 <el-icon class="el-icon--right"><Right /></el-icon>
                </el-button>
              </div>
              <!-- 右侧装饰插图 -->
              <div class="banner-visual">
                <div class="visual-circle"></div>
                <!-- 封面图悬浮 -->
                <el-image
                    class="featured-cover"
                    :src="banner.cover"
                    fit="cover"
                />
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 2. 功能分类导航 (带图标渐变卡片) -->
      <div class="feature-dock">
        <div
            class="feature-card"
            v-for="item in features"
            :key="item.key"
            @click="navigateToCategory(item.key)"
        >
          <!-- 图标容器：渐变背景 -->
          <div
              class="icon-box"
              :style="{ background: `linear-gradient(135deg, ${item.bgStart} 0%, ${item.bgEnd} 100%)` }"
          >
            <el-icon :size="24" color="#fff"><component :is="item.icon" /></el-icon>
          </div>

          <div class="text-box">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>

          <!-- 右侧交互箭头 -->
          <div class="action-icon">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <!-- 3. 全量馆藏书籍 (3D 展示架) -->
      <div class="bookshelf-section">
        <div class="section-header">
          <div class="title-group">
            <span class="indicator"></span>
            <h2>全部馆藏</h2>
            <span class="subtitle-text">精选 {{ salesBooks.length }} 本好书，等你翻阅</span>
          </div>
          <el-button link class="more-btn" @click="navigateToCategory('bestseller')">
            分类筛选 <el-icon><Filter /></el-icon>
          </el-button>
        </div>

        <div class="bookshelf-grid">
          <div
              v-for="book in salesBooks"
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
                <!-- 高分标签 -->
                <el-tag size="small" effect="light" round v-if="book.rating >= 9.0" type="danger" class="score-tag">
                  {{ book.rating }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Right, ArrowRight, Trophy, DataLine, Collection, Present, Filter
} from '@element-plus/icons-vue'

const router = useRouter()

// --- 轮播配置 ---
const banners = [
  {
    title: '重构：改善既有代码的设计',
    subtitle: '软件工程领域的经典之作，第2版全新升级',
    tag: '年度重磅',
    bgStart: '#fdfbfb', bgEnd: '#ebedee',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    relatedId: 1
  },
  {
    title: '深入理解计算机系统',
    subtitle: '程序员必读神书，揭开系统底层的神秘面纱',
    tag: '镇店之宝',
    bgStart: '#fff1eb', bgEnd: '#ace0f9',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    relatedId: 2
  },
  {
    title: '设计模式之禅',
    subtitle: '通俗易懂的 Java 设计模式指南',
    tag: '限时特惠',
    bgStart: '#e6e9f0', bgEnd: '#eef1f5',
    cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400',
    relatedId: 3
  }
]

// --- 分类入口配置 (图标对象) ---
const features = [
  {
    title: '新书首发', desc: '抢先阅读', key: 'new',
    icon: Present,
    bgStart: '#ffecd2', bgEnd: '#fcb69f'
  },
  {
    title: '电子书库', desc: '随时随地', key: 'ebook',
    icon: Collection,
    bgStart: '#d4fc79', bgEnd: '#96e6a1'
  },
  {
    title: '畅销榜单', desc: '大家都在看', key: 'bestseller',
    icon: Trophy,
    bgStart: '#ffe259', bgEnd: '#ffa751'
  },
  {
    title: '特价专区', desc: '低至3折', key: 'sale',
    icon: DataLine,
    bgStart: '#a1c4fd', bgEnd: '#c2e9fb'
  },
]

// --- 全量书籍数据 ---
const salesBooks = ref([
  { id: 1, title: '软件工程与计算', price: 89.00, originalPrice: 110.00, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80', author: '骆斌', rating: 4.8, tags: ['教材', '热销'] },
  { id: 2, title: '深入理解计算机系统', price: 129.00, originalPrice: 159.00, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80', author: 'Randal E. Bryant', rating: 9.9, tags: ['经典', '硬核'] },
  { id: 3, title: 'Vue.js设计与实现', price: 79.00, originalPrice: 99.00, cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=300&q=80', author: '霍春阳', rating: 9.9, tags: ['前端'] },
  { id: 4, title: 'JavaScript高级程序设计', price: 99.00, originalPrice: 129.00, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80', author: 'Matt Frisbie', rating: 9.7, tags: ['红宝书'] },
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
  { id: 37, title: '平凡的世界', price: 108.00, originalPrice: 138.00, cover: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400', author: '路遥', rating: 9.3, tags: ['长篇'] },
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
  router.push({ name: 'ProductDetail', params: { id: id } })
}

const navigateToCategory = (key) => {
  router.push({ name: 'Category', params: { type: key } })
}
</script>

<style scoped lang="scss">
@use "sass:color";

$tomato-main: #ff6700;
$dark-text: #2c3e50;
$gray-text: #606266;

.bookstore-home {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* ================== 1. 沉浸式轮播 Banner ================== */
.banner-wrapper {
  margin-bottom: 40px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.premium-carousel {
  :deep(.el-carousel__indicators--horizontal) {
    bottom: 20px;
    .el-carousel__button {
      width: 30px; height: 4px; border-radius: 2px;
      background-color: rgba(0,0,0,0.2);
    }
    .is-active .el-carousel__button { background-color: $tomato-main; width: 40px; }
  }
}

.banner-slide {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 100px;
  position: relative;
}

.banner-content {
  flex: 1;
  z-index: 2;

  .tag-badge {
    display: inline-flex;
    align-items: center;
    background: rgba(255, 103, 0, 0.1);
    color: $tomato-main;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 16px;
    gap: 5px;
  }

  .title {
    font-size: 42px;
    font-weight: 800;
    color: $dark-text;
    margin: 0 0 16px;
    line-height: 1.2;
    letter-spacing: -1px;
  }

  .subtitle {
    font-size: 18px;
    color: $gray-text;
    margin-bottom: 32px;
    font-weight: 400;
  }

  .action-btn {
    padding: 12px 36px;
    font-weight: 600;
    background-color: $dark-text;
    border-color: $dark-text;
    transition: all 0.3s;

    &:hover {
      background-color: $tomato-main;
      border-color: $tomato-main;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(255, 103, 0, 0.3);
    }
  }
}

.banner-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;

  .visual-circle {
    position: absolute;
    width: 300px; height: 300px;
    background: white;
    border-radius: 50%;
    opacity: 0.4;
    filter: blur(40px);
    z-index: 1;
  }

  .featured-cover {
    width: 220px;
    height: 320px;
    border-radius: 8px;
    box-shadow: -10px 20px 40px rgba(0,0,0,0.2);
    transform: perspective(800px) rotateY(-15deg);
    z-index: 2;
    transition: transform 0.5s ease;
  }
}

.banner-slide:hover .featured-cover {
  transform: perspective(800px) rotateY(-5deg) scale(1.05);
}

/* ================== 2. 功能分类 Dock (优化版) ================== */
.feature-dock {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 50px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid transparent;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;

  .icon-box {
    width: 54px;
    height: 54px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s;

    .el-icon {
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
    }
  }

  .text-box {
    flex: 1;
    h3 {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 700;
      color: #333;
      letter-spacing: 0.5px;
    }
    p {
      margin: 0;
      font-size: 12px;
      color: #909399;
    }
  }

  .action-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #f2f2f2;
    color: #999;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.08);

    .icon-box {
      transform: scale(1.1) rotate(5deg);
    }

    .action-icon {
      opacity: 1;
      transform: translateX(0);
      background-color: $tomato-main;
      color: white;
    }
  }
}

/* ================== 3. 3D 书架展示 (全量适配) ================== */
.bookshelf-section {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;

  .title-group {
    h2 {
      font-size: 28px; color: $dark-text; margin: 0; display: inline-block; position: relative;
    }
    .subtitle-text {
      font-size: 14px; color: #999; margin-left: 15px; font-weight: normal;
    }
    .indicator {
      display: inline-block; width: 4px; height: 24px;
      background: $tomato-main; margin-right: 12px; vertical-align: bottom;
      border-radius: 2px;
    }
  }

  .more-btn {
    font-size: 14px; color: #666;
    &:hover { color: $tomato-main; }
  }
}

.bookshelf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 50px 30px;
  justify-content: center;
}

.book-item-wrapper {
  cursor: pointer;
  position: relative;
  padding-bottom: 10px;
}

/* --- 3D 书籍 CSS --- */
.book-3d {
  position: relative;
  width: 140px;
  height: 200px;
  margin: 0 auto 20px;
  perspective: 1000px;
  transition: transform 0.4s ease;
}

.book-cover {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  /* 默认左转，露出书脊 */
  transform: rotateY(-25deg) translateX(5px);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 8px 12px 20px rgba(0,0,0,0.12);
  border-radius: 2px 5px 5px 2px;

  img {
    width: 100%; height: 100%; object-fit: cover;
    border-radius: 2px 5px 5px 2px;
    background: #fff;
  }
}

.book-spine {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 14px;
  background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(0,0,0,0.1));
  transform: rotateY(90deg) translateZ(-7px);
  background-color: #efefef;
  border-left: 1px solid rgba(0,0,0,0.05);
}

.book-sheen {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%);
  pointer-events: none;
  z-index: 10;
}

/* 悬停效果 */
.book-item-wrapper:hover .book-cover {
  transform: rotateY(0deg) scale(1.05) translateZ(10px);
  box-shadow: 0 20px 30px rgba(0,0,0,0.18);
}

.book-item-wrapper:active .book-cover {
  transform: scale(0.96);
}

/* 书籍信息 */
.book-info {
  text-align: center;
  padding: 0 5px;

  .book-title {
    font-size: 15px; margin: 0 0 4px; color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    height: 42px;
  }

  .book-author {
    font-size: 12px; color: #999; margin: 0 0 8px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .book-meta {
    display: flex; justify-content: center; align-items: center; gap: 6px;

    .price {
      color: $tomato-main; font-size: 16px; font-weight: 700;
      .symbol { font-size: 12px; margin-right: 1px; }
    }

    .score-tag {
      font-weight: bold;
      transform: scale(0.9);
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .banner-slide { padding: 0 20px; flex-direction: column-reverse; text-align: center; justify-content: center; }
  .banner-visual { margin-bottom: 20px; }
  .feature-dock { grid-template-columns: repeat(2, 1fr); gap: 15px; }
  .banner-content .title { font-size: 24px; }
  .banner-content .subtitle { display: none; }

  .bookshelf-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px 15px;
  }
  .book-3d { width: 120px; height: 170px; }
  .book-title { font-size: 13px; }
}
</style>