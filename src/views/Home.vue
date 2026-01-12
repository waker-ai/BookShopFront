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
    title: '深入理解计算机系统',
    subtitle: '程序员必读神书，原书第3版现货发售',
    tag: '镇店之宝',
    bgStart: '#fff1eb', bgEnd: '#ace0f9',
    cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/2_%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F%20%28%E5%8E%9F%E4%B9%A6%E7%AC%AC3%E7%89%88%29.jpg',
    relatedId: 38
  },
  {
    title: '今日向长安',
    subtitle: '重回大唐，沉浸式体验长安城的烟火人间',
    tag: '年度口碑',
    bgStart: '#fdfbfb', bgEnd: '#ebedee',
    cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/3_%E4%BB%8A%E6%97%A5%E5%90%91%E9%95%BF%E5%AE%89.jpg',
    relatedId: 1
  },
  {
    title: '球状闪电',
    subtitle: '刘慈欣经典力作，宏大想象力开启科学终极奥秘',
    tag: '科幻必读',
    bgStart: '#e6e9f0', bgEnd: '#eef1f5',
    cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/15_%E7%90%83%E7%8A%B6%E9%97%AA%E7%94%B5.jpg',
    relatedId: 19
  },
  {
    title: '强化学习的数学原理',
    subtitle: '赵世钰教授力作，系统掌握 AI 核心技术',
    tag: '硬核进阶',
    bgStart: '#f6d365', bgEnd: '#fda085',
    cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/4_%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86.jpg',
    relatedId: 39
  }
];
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
  // 历史
  { id: 1, title: '今日向长安', price: 199.00, originalPrice: 219.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/3_%E4%BB%8A%E6%97%A5%E5%90%91%E9%95%BF%E5%AE%89.jpg', author: '高瑞梓', rating: 9.6, tags: ['唐史', '长安', '城市史', '生活史'] },
  { id: 2, title: '崖山', price: 69.00, originalPrice: 89.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/8_%E5%B4%96%E5%B1%B1.jpg', author: '张明扬', rating: 8.4, tags: ['宋史', '元史', '战争', '王朝兴替'] },
  { id: 3, title: '明朝那些事儿（1-9）: 限量版', price: 358.20, originalPrice: 378.20, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/60_%E6%98%8E%E6%9C%9D%E9%82%A3%E4%BA%9B%E4%BA%8B%E5%84%BF.jpg', author: '当年明月', rating: 9.2, tags: ['明史', '通俗历史', '人物传记'] },
  { id: 4, title: '秦汉史讲义', price: 138.00, originalPrice: 158.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/16_%E7%A7%A6%E6%B1%89%E5%8F%B2%E8%AE%B2%E4%B9%89.jpg', author: '秦晖', rating: 9.2, tags: ['秦汉史', '制度史', '思想史'] },
  { id: 5, title: '显微镜下的大明', price: 52.00, originalPrice: 72.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/30_%E6%98%BE%E5%BE%AE%E9%95%9C%E4%B8%8B%E7%9A%84%E5%A4%A7%E6%98%8E.jpg', author: '马伯庸', rating: 8.7, tags: ['明史', '基层政治', '社会史'] },
  { id: 6, title: '另一个悟空的西游记', price: 76.00, originalPrice: 96.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/31_%E5%8F%A6%E4%B8%80%E4%B8%AA%E6%82%9F%E7%A9%BA%E7%9A%84%E8%A5%BF%E6%B8%B8%E8%AE%B0.jpg', author: '苗子兮', rating: 8.7, tags: ['唐史', '丝绸之路', '真实取经'] },

// 小说
  { id: 7, title: '桃花源没事儿', price: 48.00, originalPrice: 68.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/1_%E6%A1%83%E8%8A%B1%E6%BA%90%E6%B2%A1%E4%BA%8B%E5%84%BF.jpg', author: '马伯庸', rating: 7.6, tags: ['幻想小说', '幽默', '中短篇'] },
  { id: 8, title: '长安的荔枝', price: 45.00, originalPrice: 65.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/2_%E9%95%BF%E5%AE%89%E7%9A%84%E8%8D%94%E6%9E%9D.jpg', author: '马伯庸', rating: 8.5, tags: ['历史小说', '唐朝', '小人物'] },
  { id: 9, title: '卢克明的偷偷一笑', price: 49.00, originalPrice: 69.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/6_%E5%8D%A2%E5%85%8B%E6%98%8E%E7%9A%84%E5%81%B7%E5%81%B7%E4%B8%80%E7%AC%91.jpg', author: '余华', rating: 5.1, tags: ['当代小说', '讽刺', '黑色幽默'] },
  { id: 10, title: '咸的玩笑', price: 69.00, originalPrice: 89.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/7_%E5%92%B8%E7%9A%84%E7%8E%A9%E7%AC%91.jpg', author: '刘震云', rating: 8.8, tags: ['当代小说', '幽默', '现实主义'] },
  { id: 11, title: '食南之徒', price: 56.00, originalPrice: 76.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/9_%E9%A3%9F%E5%8D%97%E4%B9%8B%E5%BE%92.jpg', author: '马伯庸', rating: 8.2, tags: ['历史小说', '西汉', '美食'] },
  { id: 12, title: '流俗地', price: 55.00, originalPrice: 75.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/13_%E6%B5%81%E4%BF%97%E5%9C%B0.jpg', author: '黎紫书', rating: 9.2, tags: ['文学小说', '东南亚', '市井人生'] },
  { id: 13, title: '白象', price: 48.00, originalPrice: 68.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/18_%E7%99%BD%E8%B1%A1.jpg', author: '班宇', rating: 8.0, tags: ['文学小说', '时代书写', '现实主义'] },

// 科幻
  { id: 14, title: '献给阿尔吉侬的花束', price: 15.00, originalPrice: 20.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/3_%E7%8C%AE%E7%BB%99%E9%98%BF%E5%B0%94%E5%90%89%E4%BE%AC%E7%9A%84%E8%8A%B1%E6%9D%9F.jpg', author: '丹尼尔·凯斯', rating: 9.0, tags: ['科幻', '人性', '心理'] },
  { id: 15, title: '任意车站', price: 68.00, originalPrice: 88.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/4_%E4%BB%BB%E6%84%8F%E8%BD%A6%E7%AB%99.jpg', author: '靓灵', rating: 9.2, tags: ['科幻', '女性视角', '社会议题'] },
  { id:16, title:'开始的结束之枪', price:68.00, originalPrice:88.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/7_%E5%BC%80%E5%A7%8B%E7%9A%84%E7%BB%93%E6%9D%9F%E4%B9%8B%E6%9E%AA.jpg', author:'梁清散', rating:8.5, tags:['科幻','历史','谍战','中国科幻'] },
  { id:17, title:'索拉里斯星', price:16.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/12_%E7%B4%A2%E6%8B%89%E9%87%8C%E6%96%AF%E6%98%9F.jpg', author:'[波] 斯坦尼斯瓦夫·莱姆', rating:8.5, tags:['科幻','哲学','太空','经典科幻'] },
  { id:18, title:'从群星归来', price:18.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/13_%E4%BB%8E%E7%BE%A4%E6%98%9F%E5%BD%92%E6%9D%A5.jpg', author:'[波兰] 斯塔尼斯瓦夫·莱姆', rating:7.7, tags:['科幻','哲学','未来社会','反乌托邦'] },
  { id:19, title:'球状闪电', price:25.00, originalPrice:45.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/15_%E7%90%83%E7%8A%B6%E9%97%AA%E7%94%B5.jpg', author:'刘慈欣', rating:9.0, tags:['科幻','硬科幻','中国科幻'] },
  { id:20, title:'冰', price:14.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/18_%E5%86%B0.jpg', author:'[英] 安娜·卡万', rating:8.2, tags:['反乌托邦','科幻','末日','文学'] },
  { id:21, title:'如果我们无法以光速前行', price:16.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/20_%E5%A6%82%E6%9E%9C%E6%88%91%E4%BB%AC%E6%97%A0%E6%B3%95%E4%BB%A5%E5%85%89%E9%80%9F%E5%89%8D%E8%A1%8C.jpg', author:'[韩] 金草叶', rating:8.5, tags:['科幻','短篇集','情感科幻','女性科幻'] },
  { id:22, title:'刹海', price:68.00, originalPrice:88.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/21_%E5%88%B9%E6%B5%B7.jpg', author:'陈楸帆', rating:8.1, tags:['科幻','中国科幻','近未来'] },
  { id:23, title:'黑暗的左手', price:16.00, originalPrice:20.00, cover:' https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/22_%E9%BB%91%E6%9A%97%E7%9A%84%E5%B7%A6%E6%89%8B.jpg ', author:'[美] 厄休拉·勒古恩', rating:8.5, tags:['科幻','性别议题','社会学','经典科幻'] },
  { id:24, title:'献灯使', price:18.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/24_%E7%8C%AE%E7%81%AF%E4%BD%BF.jpg', author:'[日] 多和田叶子', rating:7.8, tags:['反乌托邦','科幻','日本文学','末日'] },
  { id:25, title:'克莱因壶', price:15.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/29_%E5%85%8B%E8%8E%B1%E5%9B%A0%E5%A3%B6.jpg', author:'[日] 冈岛二人', rating:8.8, tags:['科幻','虚拟现实','悬疑','推理'] },
  { id:26, title:'意识迷宫', price:19.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/36_%E6%84%8F%E8%AF%86%E8%BF%B7%E5%AE%AB.jpg', author:'[美] 埃里克·赫尔', rating:0.0, tags:['科幻','意识','悬疑','心理'] },
  { id:27, title:'黑暗中我们能走多高', price:15.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/37_%E9%BB%91%E6%9A%97%E4%B8%AD%E6%88%91%E4%BB%AC%E8%83%BD%E8%B5%B0%E5%A4%9A%E9%AB%98.jpg', author:'[美] 永松红杉', rating:8.2, tags:['科幻','人文关怀','灾难','文学'] },
  { id:28, title:'浓雾号角', price:14.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/40_%E6%B5%93%E9%9B%BE%E5%8F%B7%E8%A7%92.jpg', author:'[美] 雷·布拉德伯里', rating:9.3, tags:['科幻','短篇集','经典文学','奇幻'] },
  { id:29, title:'地球尽头的温室', price:16.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/41_%E5%9C%B0%E7%90%83%E5%B0%BD%E5%A4%B4%E7%9A%84%E6%B8%A9%E5%AE%A4.jpg', author:'金草叶', rating:8.3, tags:['科幻','末日','生态','女性科幻'] },
  { id:30, title:'我在废土世界扫垃圾', price:24.00, originalPrice:28.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/43_%E6%88%91%E5%9C%A8%E5%BA%9F%E5%9C%9F%E4%B8%96%E7%95%8C%E6%89%AB%E5%9E%83%E5%9C%BE.jpg', author:'有花在野', rating:9.2, tags:['科幻','废土','轻小说','中国科幻'] },
  { id:31, title:'醉步男', price:32.00, originalPrice:40.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/44_%E9%86%89%E6%AD%A5%E7%94%B7.jpg', author:'[日] 小林泰三', rating:8.3, tags:['科幻','时间旅行','逻辑恐怖','日本科幻'] },
  { id:32, title:'雷·布拉德伯里经典小说合集', price:88.00, originalPrice:110.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/48_%E9%9B%B7%C2%B7%E5%B8%83%E6%8B%89%E5%BE%B7%E4%BC%AF%E9%87%8C%E7%BB%8F%E5%85%B8%E5%B0%8F%E8%AF%B4%E5%90%88%E9%9B%86.jpg', author:'[美] 雷·布拉德伯里', rating:8.7, tags:['科幻','短篇集','经典文学','奇幻'] },
  { id:33, title:'脑中之魔', price:69.00, originalPrice:89.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/53_%E8%84%91%E4%B8%AD%E4%B9%8B%E9%AD%94.jpg', author:'罗夏', rating:8.2, tags:['科幻','电竞','意识','近未来'] },
  { id:34, title:'鹤形的寓言', price:56.00, originalPrice:76.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/55_%E9%B9%A4%E5%BD%A2%E7%9A%84%E5%AF%93%E8%A8%80.jpg', author:'温文锦', rating:9.5, tags:['幻想','寓言','文学','哲思'] },
  { id:35, title:'尤比克', price:25.00, originalPrice:30.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/57_%E5%B0%A4%E6%AF%94%E5%85%8B.jpg', author:'[美] 菲利普·迪克', rating:8.8, tags:['科幻','意识','本体论','经典科幻'] },
  { id:36, title:'光明王', price:32.00, originalPrice:36.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/58_%E5%85%89%E6%98%8E%E7%8E%8B.jpg', author:'[美] 罗杰·泽拉兹尼', rating:8.5, tags:['科幻','神话','太空歌剧','经典科幻'] },
  { id:37, title:'2181序曲', price:58.00, originalPrice:78.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/60_2181%E5%BA%8F%E6%9B%B2.jpg', author:'顾适', rating:8.2, tags:['科幻','短篇集','女性主义','人工智能'] },
  { id:38, title:'深入理解计算机系统 (原书第3版)', price:24.00, originalPrice:28.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/2_%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F%20%28%E5%8E%9F%E4%B9%A6%E7%AC%AC3%E7%89%88%29.jpg', author:'Randal E. Bryant / David O. Hallaron', rating:9.8, tags:['计算机','系统','底层原理','经典教材'] },
  { id:39, title:'强化学习的数学原理', price:108.00, originalPrice:128.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/4_%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86.jpg', author:'赵世钰', rating:9.7, tags:['人工智能','强化学习','数学','机器学习'] },
  { id:40, title:'工程师进阶之路', price:42.00, originalPrice:60.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/7_%E5%B7%A5%E7%A8%8B%E5%B8%88%E8%BF%9B%E9%98%B6%E4%B9%8B%E8%B7%AF.jpg', author:'[爱尔兰] Tanya Reilly', rating:9.2, tags:['软件工程','职业发展','工程文化','工程师成长'] },
  { id:41, title:'数据密集型应用系统设计', price:38.00, originalPrice:54.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/12_%E6%95%B0%E6%8D%AE%E5%AF%86%E9%9B%86%E5%9E%8B%E5%BA%94%E7%94%A8%E7%B3%BB%E7%BB%9F%E8%AE%BE%E8%AE%A1.jpg', author:'Martin Kleppmann', rating:9.6, tags:['分布式系统','数据库','系统设计','计算机'] },
  { id:42, title:'通信的数学理论', price:30.00, originalPrice:40.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/8_%E9%80%9A%E4%BF%A1%E7%9A%84%E6%95%B0%E5%AD%A6%E7%90%86%E8%AE%BA.jpg', author:'Claude Shannon / Warren Weaver', rating:0.0, tags:['信息论','数学','通信','经典著作'] },
  { id:43, title:'计算机底层的秘密', price:34.00, originalPrice:42.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/14_%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%BA%95%E5%B1%82%E7%9A%84%E7%A7%98%E5%AF%86.jpg', author:'陆小风', rating:8.7, tags:['计算机','底层原理','通俗科普','程序员'] },
  { id:44, title:'程序是怎样跑起来的（第3版）', price:21.00, originalPrice:30.00, cover:' https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/21_%E7%A8%8B%E5%BA%8F%E6%98%AF%E6%80%8E%E6%A0%B7%E8%B7%91%E8%B5%B7%E6%9D%A5%E7%9A%84%EF%BC%88%E7%AC%AC3%E7%89%88%EF%BC%89.jpg', author:'[日] 矢泽久雄', rating:9.1, tags:['计算机','程序运行','入门','计算机基础'] },
  { id:45, title:'软件工程师进阶导航', price:33.00, originalPrice:55.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/23_%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B%E5%B8%88%E8%BF%9B%E9%98%B6%E5%AF%BC%E8%88%AA.jpg', author:'Gergely Orosz', rating:9.3, tags:['软件工程','职业发展','工程管理','工程师成长'] },
  { id:46, title:'图解密码技术（第3版）', price:25.00, originalPrice:32.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/25_%E5%9B%BE%E8%A7%A3%E5%AF%86%E7%A0%81%E6%8A%80%E6%9C%AF%EF%BC%88%E7%AC%AC3%E7%89%88%EF%BC%89.jpg', author:'[日] 结城浩', rating:9.4, tags:['密码学','计算机安全','入门','图解'] },
  { id:47, title:'理解深度学习', price:41.00, originalPrice:50.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/30_%E7%90%86%E8%A7%A3%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0.jpg', author:'Simon J. D. Prince', rating:8.4, tags:['深度学习','人工智能','理论','机器学习'] },
  { id:48, title:'深度学习', price:28.00, originalPrice:43.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/31_%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0.jpg', author:'[美] 伊恩·古德费洛、[加] 约书亚·本吉奥、[加] 亚伦·库维尔', rating:8.4, tags:['深度学习','人工智能','机器学习','AI经典'] },
  { id:49, title:'一本书讲透Elasticsearch：原理、进阶与工程实践', price:129.00, originalPrice:149.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/35_%E4%B8%80%E6%9C%AC%E4%B9%A6%E8%AE%B2%E9%80%8FElasticsearch%EF%BC%9A%E5%8E%9F%E7%90%86%E3%80%81%E8%BF%9B%E9%98%B6%E4%B8%8E%E5%B7%A5%E7%A8%8B%E5%AE%9E%E8%B7%B5.jpg', author:'杨昌玉', rating:8.3, tags:['Elasticsearch','搜索引擎','分布式系统','后端开发'] },
  { id:50, title:'算法（第4版）', price:58.00, originalPrice:88.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/39_%E7%AE%97%E6%B3%95%EF%BC%88%E7%AC%AC4%E7%89%88%EF%BC%89.jpg', author:'[美] Robert Sedgewick、[美] Kevin Wayne', rating:9.3, tags:['算法','数据结构','计算机基础','经典教材'] },
  { id:51, title:'计算机科学概论（第12版）', price:52.00, originalPrice:60.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/40_%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6%E6%A6%82%E8%AE%BA%EF%BC%88%E7%AC%AC12%E7%89%88%EF%BC%89.jpg', author:'[美] J.Glenn Brookshear、[美] Dennis Brylow', rating:9.6, tags:['计算机科学','计算机基础','入门教材'] },
  { id:52, title:'算法笔记', price:65.00, originalPrice:85.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/41_%E7%AE%97%E6%B3%95%E7%AC%94%E8%AE%B0.jpg', author:'胡凡、曾磊', rating:9.1, tags:['算法','C++','考研','PAT','CSP'] },
  { id:53, title:'深度强化学习', price:129.80, originalPrice:149.80, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/42_%E6%B7%B1%E5%BA%A6%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0.jpg', author:'王树森、黎彧君、张志华', rating:9.5, tags:['强化学习','深度学习','人工智能','机器学习'] },
  { id:54, title:'Python极客项目编程（第2版）', price:49.00, originalPrice:69.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/43_Python%E6%9E%81%E5%AE%A2%E9%A1%B9%E7%9B%AE%E7%BC%96%E7%A8%8B%EF%BC%88%E7%AC%AC2%E7%89%88%EF%BC%89.jpg', author:'[美] Mahesh Venkitachalam', rating:9.0, tags:['Python','项目实战','编程实践'] },
  { id:55, title:'七周七并发模型', price:46.00, originalPrice:61.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/48_%E4%B8%83%E5%91%A8%E4%B8%83%E5%B9%B6%E5%8F%91%E6%A8%A1%E5%9E%8B.jpg', author:'Paul Butcher', rating:7.5, tags:['并发编程','多线程','编程模型','系统设计'] },
  { id:56, title:'普林斯顿计算机公开课 (原书第2版)', price:31.00, originalPrice:46.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/49_%E6%99%AE%E6%9E%97%E6%96%AF%E9%A1%BF%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%85%AC%E5%BC%80%E8%AF%BE%20%28%E5%8E%9F%E4%B9%A6%E7%AC%AC2%E7%89%88%29.jpg', author:'[加] Brian W. Kernighan', rating:9.4, tags:['计算机科学','程序设计','经典课程'] },
  { id:57, title:'编程珠玑', price:35.00, originalPrice:43.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/51_%E7%BC%96%E7%A8%8B%E7%8F%A0%E7%8E%91.jpg', author:'[美] Jon Bentley', rating:9.1, tags:['程序设计','算法思想','经典名著'] },
  { id:58, title:'Rust程序设计 (第2版)', price:54.00, originalPrice:72.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/52_Rust%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%20%28%E7%AC%AC2%E7%89%88%29.jpg', author:'[美] Jim Blandy、Jason Orendorff、Leonora F. S. Tindall', rating:9.2, tags:['Rust','系统编程','并发','编程语言'] },
  { id:59, title:'微服务设计（第2版）', price:43.00, originalPrice:49.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/53_%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%AE%BE%E8%AE%A1%EF%BC%88%E7%AC%AC2%E7%89%88%EF%BC%89.jpg', author:'Sam Newman', rating:8.6, tags:['微服务','系统架构','分布式系统'] },
  { id:60, title:'深入剖析Kubernetes', price:99.00, originalPrice:119.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/54_%E6%B7%B1%E5%85%A5%E5%89%96%E6%9E%90Kubernetes.jpg', author:'张磊', rating:9.4, tags:['Kubernetes','容器','云原生','DevOps'] },
  { id:61, title:'企业应用架构模式', price:39.00, originalPrice:57.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/60_%E4%BC%81%E4%B8%9A%E5%BA%94%E7%94%A8%E6%9E%B6%E6%9E%84%E6%A8%A1%E5%BC%8F.jpg', author:'Martin Fowler', rating:8.4, tags:['软件架构','企业应用','设计模式'] }

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