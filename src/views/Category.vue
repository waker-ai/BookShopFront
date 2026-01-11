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
    // 历史
    { id: 1, title: '今日向长安', price: 199.00, originalPrice: 219.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/3_%E4%BB%8A%E6%97%A5%E5%90%91%E9%95%BF%E5%AE%89.jpg', author: '高瑞梓', rating: 9.6, tags: ['唐史', '长安', '城市史', '生活史'] },
    { id: 2, title: '崖山', price: 69.00, originalPrice: 89.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/8_%E5%B4%96%E5%B1%B1.jpg', author: '张明扬', rating: 8.4, tags: ['宋史', '元史', '战争', '王朝兴替'] },
    { id: 3, title: '明朝那些事儿（1-9）: 限量版', price: 358.20, originalPrice: 378.20, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/60_%E6%98%8E%E6%9C%9D%E9%82%A3%E4%BA%9B%E4%BA%8B%E5%84%BF.jpg', author: '当年明月', rating: 9.2, tags: ['明史', '通俗历史', '人物传记'] },
    { id: 4, title: '秦汉史讲义', price: 138.00, originalPrice: 158.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/40_%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6%E6%A6%82%E8%AE%BA%EF%BC%88%E7%AC%AC12%E7%89%88%EF%BC%89.jpg', author: '秦晖', rating: 9.2, tags: ['秦汉史', '制度史', '思想史'] },
    { id: 5, title: '显微镜下的大明', price: 52.00, originalPrice: 72.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/50_%E5%A4%A7%E6%98%8E%E7%A5%9E%E6%9C%A8%E8%AE%B0.jpg', author: '马伯庸', rating: 8.7, tags: ['明史', '基层政治', '社会史'] },
    { id: 6, title: '另一个悟空的西游记', price: 76.00, originalPrice: 96.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/52_Rust%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%20%28%E7%AC%AC2%E7%89%88%29.jpg', author: '苗子兮', rating: 8.7, tags: ['唐史', '丝绸之路', '真实取经'] },

    // 小说
    { id: 7, title: '桃花源没事儿', price: 48.00, originalPrice: 68.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/42_%E6%B7%B1%E5%BA%A6%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0.jpg', author: '马伯庸', rating: 7.6, tags: ['幻想小说', '幽默', '中短篇'] },
    { id: 8, title: '长安的荔枝', price: 45.00, originalPrice: 65.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/4_%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86.jpg', author: '马伯庸', rating: 8.5, tags: ['历史小说', '唐朝', '小人物'] },
    { id: 9, title: '卢克明的偷偷一笑', price: 49.00, originalPrice: 69.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/6_%E5%8D%A2%E5%85%8B%E6%98%8E%E7%9A%84%E5%81%B7%E5%81%B7%E4%B8%80%E7%AC%91.jpg', author: '余华', rating: 5.1, tags: ['当代小说', '讽刺', '黑色幽默'] },
    { id: 10, title: '咸的玩笑', price: 69.00, originalPrice: 89.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/7_%E5%92%B8%E7%9A%84%E7%8E%A9%E7%AC%91.jpg', author: '刘震云', rating: 8.8, tags: ['当代小说', '幽默', '现实主义'] },
    { id: 11, title: '食南之徒', price: 56.00, originalPrice: 76.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/9_%E9%A3%9F%E5%8D%97%E4%B9%8B%E5%BE%92.jpg', author: '马伯庸', rating: 8.2, tags: ['历史小说', '西汉', '美食'] },
    { id: 12, title: '流俗地', price: 55.00, originalPrice: 75.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/3_%E4%BB%8A%E6%97%A5%E5%90%91%E9%95%BF%E5%AE%89.jpg', author: '黎紫书', rating: 9.2, tags: ['文学小说', '东南亚', '市井人生'] },
    { id: 13, title: '白象', price: 48.00, originalPrice: 68.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/41_%E7%AE%97%E6%B3%95%E7%AC%94%E8%AE%B0.jpg', author: '班宇', rating: 8.0, tags: ['文学小说', '时代书写', '现实主义'] },

    // 科幻
    { id: 14, title: '献给阿尔吉侬的花束', price: 0.00, originalPrice: 20.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/3_%E7%8C%AE%E7%BB%99%E9%98%BF%E5%B0%94%E5%90%89%E4%BE%AC%E7%9A%84%E8%8A%B1%E6%9D%9F.jpg', author: '丹尼尔·凯斯', rating: 9.0, tags: ['科幻', '人性', '心理'] },
    { id: 15, title: '任意车站', price: 68.00, originalPrice: 88.00, cover: 'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/4_%E4%BB%BB%E6%84%8F%E8%BD%A6%E7%AB%99.jpg', author: '靓灵', rating: 9.2, tags: ['科幻', '女性视角', '社会议题'] },
    { id:16, title:'开始的结束之枪', price:68.00, originalPrice:88.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/7_%E5%BC%80%E5%A7%8B%E7%9A%84%E7%BB%93%E6%9D%9F%E4%B9%8B%E6%9E%AA.jpg', author:'梁清散', rating:8.5, tags:['科幻','历史','谍战','中国科幻'] },
    { id:17, title:'索拉里斯星', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/37_%E9%BB%91%E6%9A%97%E4%B8%AD%E6%88%91%E4%BB%AC%E8%83%BD%E8%B5%B0%E5%A4%9A%E9%AB%98.jpg', author:'[波] 斯坦尼斯瓦夫·莱姆', rating:8.5, tags:['科幻','哲学','太空','经典科幻'] },
    { id:18, title:'从群星归来', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/39_%E7%AE%97%E6%B3%95%EF%BC%88%E7%AC%AC4%E7%89%88%EF%BC%89.jpg', author:'[波兰] 斯塔尼斯瓦夫·莱姆', rating:7.7, tags:['科幻','哲学','未来社会','反乌托邦'] },
    { id:19, title:'球状闪电', price:25.00, originalPrice:45.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/40_%E6%B5%93%E9%9B%BE%E5%8F%B7%E8%A7%92.jpg', author:'刘慈欣', rating:9.0, tags:['科幻','硬科幻','中国科幻'] },
    { id:20, title:'冰', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/41_%E5%9C%B0%E7%90%83%E5%B0%BD%E5%A4%B4%E7%9A%84%E6%B8%A9%E5%AE%A4.jpg', author:'[英] 安娜·卡万', rating:8.2, tags:['反乌托邦','科幻','末日','文学'] },
    { id:21, title:'如果我们无法以光速前行', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/43_Python%E6%9E%81%E5%AE%A2%E9%A1%B9%E7%9B%AE%E7%BC%96%E7%A8%8B%EF%BC%88%E7%AC%AC2%E7%89%88%EF%BC%89.jpg', author:'[韩] 金草叶', rating:8.5, tags:['科幻','短篇集','情感科幻','女性科幻'] },
    { id:22, title:'刹海', price:68.00, originalPrice:88.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/43_%E6%88%91%E5%9C%A8%E5%BA%9F%E5%9C%9F%E4%B8%96%E7%95%8C%E6%89%AB%E5%9E%83%E5%9C%BE.jpg', author:'陈楸帆', rating:8.1, tags:['科幻','中国科幻','近未来'] },
    { id:23, title:'黑暗的左手', price:0.00, originalPrice:20.00, cover:' https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/22_%E9%BB%91%E6%9A%97%E7%9A%84%E5%B7%A6%E6%89%8B.jpg ', author:'[美] 厄休拉·勒古恩', rating:8.5, tags:['科幻','性别议题','社会学','经典科幻'] },
    { id:24, title:'献灯使', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/48_%E4%B8%83%E5%91%A8%E4%B8%83%E5%B9%B6%E5%8F%91%E6%A8%A1%E5%9E%8B.jpg', author:'[日] 多和田叶子', rating:7.8, tags:['反乌托邦','科幻','日本文学','末日'] },
    { id:25, title:'克莱因壶', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/49_%E6%99%AE%E6%9E%97%E6%96%AF%E9%A1%BF%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%85%AC%E5%BC%80%E8%AF%BE%20%28%E5%8E%9F%E4%B9%A6%E7%AC%AC2%E7%89%88%29.jpg', author:'[日] 冈岛二人', rating:8.8, tags:['科幻','虚拟现实','悬疑','推理'] },
    { id:26, title:'意识迷宫', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/55_%E9%B9%A4%E5%BD%A2%E7%9A%84%E5%AF%93%E8%A8%80.jpg', author:'[美] 埃里克·赫尔', rating:0.0, tags:['科幻','意识','悬疑','心理'] },
    { id:27, title:'黑暗中我们能走多高', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/57_%E5%B0%A4%E6%AF%94%E5%85%8B.jpg', author:'[美] 永松红杉', rating:8.2, tags:['科幻','人文关怀','灾难','文学'] },
    { id:28, title:'浓雾号角', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/40_%E6%B5%93%E9%9B%BE%E5%8F%B7%E8%A7%92.jpg', author:'[美] 雷·布拉德伯里', rating:9.3, tags:['科幻','短篇集','经典文学','奇幻'] },
    { id:29, title:'地球尽头的温室', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/41_%E5%9C%B0%E7%90%83%E5%B0%BD%E5%A4%B4%E7%9A%84%E6%B8%A9%E5%AE%A4.jpg', author:'金草叶', rating:8.3, tags:['科幻','末日','生态','女性科幻'] },
    { id:30, title:'我在废土世界扫垃圾', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/43_%E6%88%91%E5%9C%A8%E5%BA%9F%E5%9C%9F%E4%B8%96%E7%95%8C%E6%89%AB%E5%9E%83%E5%9C%BE.jpg', author:'有花在野', rating:9.2, tags:['科幻','废土','轻小说','中国科幻'] },
    { id:31, title:'醉步男', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/44_%E9%86%89%E6%AD%A5%E7%94%B7.jpg', author:'[日] 小林泰三', rating:8.3, tags:['科幻','时间旅行','逻辑恐怖','日本科幻'] },
    { id:32, title:'雷·布拉德伯里经典小说合集', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/48_%E9%9B%B7%C2%B7%E5%B8%83%E6%8B%89%E5%BE%B7%E4%BC%AF%E9%87%8C%E7%BB%8F%E5%85%B8%E5%B0%8F%E8%AF%B4%E5%90%88%E9%9B%86.jpg', author:'[美] 雷·布拉德伯里', rating:8.7, tags:['科幻','短篇集','经典文学','奇幻'] },
    { id:33, title:'脑中之魔', price:69.00, originalPrice:89.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/53_%E8%84%91%E4%B8%AD%E4%B9%8B%E9%AD%94.jpg', author:'罗夏', rating:8.2, tags:['科幻','电竞','意识','近未来'] },
    { id:34, title:'鹤形的寓言', price:56.00, originalPrice:76.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/55_%E9%B9%A4%E5%BD%A2%E7%9A%84%E5%AF%93%E8%A8%80.jpg', author:'温文锦', rating:9.5, tags:['幻想','寓言','文学','哲思'] },
    { id:35, title:'尤比克', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/57_%E5%B0%A4%E6%AF%94%E5%85%8B.jpg', author:'[美] 菲利普·迪克', rating:8.8, tags:['科幻','意识','本体论','经典科幻'] },
    { id:36, title:'光明王', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/58_%E5%85%89%E6%98%8E%E7%8E%8B.jpg', author:'[美] 罗杰·泽拉兹尼', rating:8.5, tags:['科幻','神话','太空歌剧','经典科幻'] },
    { id:37, title:'2181序曲', price:58.00, originalPrice:78.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/60_2181%E5%BA%8F%E6%9B%B2.jpg', author:'顾适', rating:8.2, tags:['科幻','短篇集','女性主义','人工智能'] },
    { id:38, title:'深入理解计算机系统 (原书第3版)', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/4_%E4%BB%BB%E6%84%8F%E8%BD%A6%E7%AB%99.jpg', author:'Randal E. Bryant / David O. Hallaron', rating:9.8, tags:['计算机','系统','底层原理','经典教材'] },
    { id:39, title:'强化学习的数学原理', price:108.00, originalPrice:128.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/4_%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86.jpg', author:'赵世钰', rating:9.7, tags:['人工智能','强化学习','数学','机器学习'] },
    { id:40, title:'工程师进阶之路', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/7_%E5%B7%A5%E7%A8%8B%E5%B8%88%E8%BF%9B%E9%98%B6%E4%B9%8B%E8%B7%AF.jpg', author:'[爱尔兰] Tanya Reilly', rating:9.2, tags:['软件工程','职业发展','工程文化','工程师成长'] },
    { id:41, title:'数据密集型应用系统设计', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/36_%E6%84%8F%E8%AF%86%E8%BF%B7%E5%AE%AB.jpg', author:'Martin Kleppmann', rating:9.6, tags:['分布式系统','数据库','系统设计','计算机'] },
    { id:42, title:'通信的数学理论', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/8_%E9%80%9A%E4%BF%A1%E7%9A%84%E6%95%B0%E5%AD%A6%E7%90%86%E8%AE%BA.jpg', author:'Claude Shannon / Warren Weaver', rating:0.0, tags:['信息论','数学','通信','经典著作'] },
    { id:43, title:'计算机底层的秘密', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/3_%E7%8C%AE%E7%BB%99%E9%98%BF%E5%B0%94%E5%90%89%E4%BE%AC%E7%9A%84%E8%8A%B1%E6%9D%9F.jpg', author:'陆小风', rating:8.7, tags:['计算机','底层原理','通俗科普','程序员'] },
    { id:44, title:'程序是怎样跑起来的（第3版）', price:0.00, originalPrice:20.00, cover:' https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/21_%E7%A8%8B%E5%BA%8F%E6%98%AF%E6%80%8E%E6%A0%B7%E8%B7%91%E8%B5%B7%E6%9D%A5%E7%9A%84%EF%BC%88%E7%AC%AC3%E7%89%88%EF%BC%89.jpg', author:'[日] 矢泽久雄', rating:9.1, tags:['计算机','程序运行','入门','计算机基础'] },
    { id:45, title:'软件工程师进阶导航', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/44_%E9%86%89%E6%AD%A5%E7%94%B7.jpg', author:'Gergely Orosz', rating:9.3, tags:['软件工程','职业发展','工程管理','工程师成长'] },
    { id:46, title:'图解密码技术（第3版）', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/48_%E9%9B%B7%C2%B7%E5%B8%83%E6%8B%89%E5%BE%B7%E4%BC%AF%E9%87%8C%E7%BB%8F%E5%85%B8%E5%B0%8F%E8%AF%B4%E5%90%88%E9%9B%86.jpg', author:'[日] 结城浩', rating:9.4, tags:['密码学','计算机安全','入门','图解'] },
    { id:47, title:'理解深度学习', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/51_%E7%BC%96%E7%A8%8B%E7%8F%A0%E7%8E%91.jpg', author:'Simon J. D. Prince', rating:8.4, tags:['深度学习','人工智能','理论','机器学习'] },
    { id:48, title:'深度学习', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/53_%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%AE%BE%E8%AE%A1%EF%BC%88%E7%AC%AC2%E7%89%88%EF%BC%89.jpg', author:'[美] 伊恩·古德费洛、[加] 约书亚·本吉奥、[加] 亚伦·库维尔', rating:8.4, tags:['深度学习','人工智能','机器学习','AI经典'] },
    { id:49, title:'一本书讲透Elasticsearch：原理、进阶与工程实践', price:129.00, originalPrice:149.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/54_%E6%B7%B1%E5%85%A5%E5%89%96%E6%9E%90Kubernetes.jpg', author:'杨昌玉', rating:8.3, tags:['Elasticsearch','搜索引擎','分布式系统','后端开发'] },
    { id:50, title:'算法（第4版）', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/58_%E5%85%89%E6%98%8E%E7%8E%8B.jpg', author:'[美] Robert Sedgewick、[美] Kevin Wayne', rating:9.3, tags:['算法','数据结构','计算机基础','经典教材'] },
    { id:51, title:'计算机科学概论（第12版）', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/40_%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6%E6%A6%82%E8%AE%BA%EF%BC%88%E7%AC%AC12%E7%89%88%EF%BC%89.jpg', author:'[美] J.Glenn Brookshear、[美] Dennis Brylow', rating:9.6, tags:['计算机科学','计算机基础','入门教材'] },
    { id:52, title:'算法笔记', price:65.00, originalPrice:85.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/41_%E7%AE%97%E6%B3%95%E7%AC%94%E8%AE%B0.jpg', author:'胡凡、曾磊', rating:9.1, tags:['算法','C++','考研','PAT','CSP'] },
    { id:53, title:'深度强化学习', price:129.80, originalPrice:149.80, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/42_%E6%B7%B1%E5%BA%A6%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0.jpg', author:'王树森、黎彧君、张志华', rating:9.5, tags:['强化学习','深度学习','人工智能','机器学习'] },
    { id:54, title:'Python极客项目编程（第2版）', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/43_Python%E6%9E%81%E5%AE%A2%E9%A1%B9%E7%9B%AE%E7%BC%96%E7%A8%8B%EF%BC%88%E7%AC%AC2%E7%89%88%EF%BC%89.jpg', author:'[美] Mahesh Venkitachalam', rating:9.0, tags:['Python','项目实战','编程实践'] },
    { id:55, title:'七周七并发模型', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/48_%E4%B8%83%E5%91%A8%E4%B8%83%E5%B9%B6%E5%8F%91%E6%A8%A1%E5%9E%8B.jpg', author:'Paul Butcher', rating:7.5, tags:['并发编程','多线程','编程模型','系统设计'] },
    { id:56, title:'普林斯顿计算机公开课 (原书第2版)', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/49_%E6%99%AE%E6%9E%97%E6%96%AF%E9%A1%BF%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%85%AC%E5%BC%80%E8%AF%BE%20%28%E5%8E%9F%E4%B9%A6%E7%AC%AC2%E7%89%88%29.jpg', author:'[加] Brian W. Kernighan', rating:9.4, tags:['计算机科学','程序设计','经典课程'] },
    { id:57, title:'编程珠玑', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/51_%E7%BC%96%E7%A8%8B%E7%8F%A0%E7%8E%91.jpg', author:'[美] Jon Bentley', rating:9.1, tags:['程序设计','算法思想','经典名著'] },
    { id:58, title:'Rust程序设计 (第2版)', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/52_Rust%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%20%28%E7%AC%AC2%E7%89%88%29.jpg', author:'[美] Jim Blandy、Jason Orendorff、Leonora F. S. Tindall', rating:9.2, tags:['Rust','系统编程','并发','编程语言'] },
    { id:59, title:'微服务设计（第2版）', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/53_%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%AE%BE%E8%AE%A1%EF%BC%88%E7%AC%AC2%E7%89%88%EF%BC%89.jpg', author:'Sam Newman', rating:8.6, tags:['微服务','系统架构','分布式系统'] },
    { id:60, title:'深入剖析Kubernetes', price:99.00, originalPrice:119.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/54_%E6%B7%B1%E5%85%A5%E5%89%96%E6%9E%90Kubernetes.jpg', author:'张磊', rating:9.4, tags:['Kubernetes','容器','云原生','DevOps'] },
    { id:61, title:'企业应用架构模式', price:0.00, originalPrice:20.00, cover:'https://naludo.oss-cn-nanjing.aliyuncs.com/book_cover/picture/60_%E4%BC%81%E4%B8%9A%E5%BA%94%E7%94%A8%E6%9E%B6%E6%9E%84%E6%A8%A1%E5%BC%8F.jpg', author:'Martin Fowler', rating:8.4, tags:['软件架构','企业应用','设计模式'] }
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