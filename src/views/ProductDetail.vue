<template>
  <div class="product-page">
    <!-- 1. 面包屑导航 -->
    <div class="breadcrumb-area">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentBook.title }}</el-breadcrumb-item>
        <el-breadcrumb-item>正文</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 2. 主体信息区 -->
    <div class="product-main">
      <el-card shadow="never" :body-style="{ padding: '30px' }">
        <div class="product-grid">

          <!-- 左侧：图片展示 -->
          <div class="gallery-section">
            <div class="main-image">
              <el-image
                  :src="currentImage"
                  :preview-src-list="imageList"
                  fit="contain"
                  class="img-box"
              />
            </div>
            <div class="thumbnail-list">
              <div
                  v-for="(img, idx) in imageList"
                  :key="idx"
                  class="thumb-item"
                  :class="{ active: currentImage === img }"
                  @mouseenter="currentImage = img"
              >
                <el-image :src="img" fit="cover" />
              </div>
            </div>
          </div>

          <!-- 右侧：详细信息 -->
          <div class="info-section">
            <h1 class="book-title">
              {{ currentBook.title }}
              <el-tag type="danger" effect="plain" size="small" class="tag">自营</el-tag>
            </h1>
            <p class="book-subtitle">{{currentBook.subtitle}}</p>

            <div class="author-bar">
              <span>作者：<a href="#">{{ currentBook.author }}</a></span>
              <el-divider direction="vertical" />
              <span>出版社：<a href="#">{{ currentBook.publisher }}</a></span>
              <el-divider direction="vertical" />
              <span>出版时间：{{currentBook.publishtime}}</span>
            </div>

            <!-- 价格面板 -->
            <div class="price-panel">
              <div class="panel-row">
                <span class="label">番茄价</span>
                <span class="currency">¥</span>
                <span class="price">{{ currentBook.price }}</span>
                <span class="discount-tag">{{ (currentBook.price / currentBook.originalPrice * 10).toFixed(1) }}折</span>
              </div>
              <div class="panel-row sub-row">
                <span class="label">定价</span>
                <span class="original-price">¥{{ currentBook.originalPrice.toFixed(2) }}</span>
              </div>
              <div class="panel-row sub-row">
                <span class="label">促销</span>
                <span class="promo-text"><el-tag type="danger" size="small">满减</el-tag> 满100元减50元</span>
              </div>
            </div>

            <!-- 核心参数 -->
            <div class="meta-row">
              <dl><dt>销量</dt><dd>5000+</dd></dl>
              <el-divider direction="vertical" />
              <dl><dt>累计评价</dt><dd>1200+</dd></dl>
              <el-divider direction="vertical" />
              <dl><dt>送积分</dt><dd>89</dd></dl>
            </div>

            <el-divider style="margin: 20px 0" />

            <!-- 操作区 -->
            <div class="action-area">
              <div class="qty-selector">
                <el-input-number v-model="quantity" :min="1" :max="99" />
              </div>
              <div class="btn-group">
                <el-button type="warning" size="large" plain @click="buyNow">立即购买</el-button>
                <el-button color="#ff6700" size="large" type="primary" :icon="ShoppingCart" @click="addToCart">
                  加入购物车
                </el-button>
              </div>
            </div>

            <div class="aux-actions">
              <el-button link :icon="Star">收藏商品 (230)</el-button>
              <el-button link :icon="Share">分享</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 3. 详情与评价 Tab -->
    <div class="details-container">
      <el-row :gutter="20">
        <!-- 左侧边栏：推荐 -->
        <el-col :span="5" class="sidebar-col">
          <el-card shadow="never" class="recommend-sidebar">
            <template #header><div class="side-header">同类热销</div></template>
            <div class="side-book-item" v-for="i in 3" :key="i">
              <el-image src="https://via.placeholder.com/150" class="side-img" />
              <div class="side-title">人月神话（40周年纪念版）</div>
              <div class="side-price">¥45.00</div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧内容 -->
        <el-col :span="19">
          <el-card shadow="never" class="tab-card">
            <el-tabs v-model="activeTab" class="product-tabs">
              <el-tab-pane label="商品介绍" name="intro">
                <div class="rich-content">
                  <h3>内容简介</h3>
                  <p>{{currentBook.description}}</p>
                  <h3>目录</h3>
                  <p>{{currentBook.contents}}.</p>
                  <!-- 模拟长图展示 -->
                  <el-image src="https://via.placeholder.com/800x600?text=Book+Details+Long+Image" style="width:100%; margin-top:20px;" />
                </div>
              </el-tab-pane>

              <el-tab-pane label="商品评价 (12)" name="reviews">
                <div class="reviews-header">
                  <div class="rate-score">
                    <div class="score">98%</div>
                    <div class="text">好评率</div>
                  </div>
                  <div class="rate-tags">
                    <el-tag effect="dark" type="danger">内容详实 (10)</el-tag>
                    <el-tag effect="plain">印刷精美 (5)</el-tag>
                    <el-tag effect="plain">物流快 (8)</el-tag>
                    <el-tag type="info" effect="plain">有点难懂 (1)</el-tag>
                  </div>
                </div>

                <div class="review-list">
                  <div class="review-item" v-for="item in 3" :key="item">
                    <div class="user-info">
                      <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                      <span class="name">刘**珩</span>
                      <el-rate v-model="rating" disabled size="small" />
                    </div>
                    <div class="review-content">这本书对学习软件开发非常有帮助，物流也很快！代码示例很清晰。</div>
                    <div class="review-meta">
                      <span>2023-06-01 12:30</span>
                      <span>版本：平装版</span>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ShoppingCart, Star, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'


const route = useRoute()
const quantity = ref(1)
const activeTab = ref('intro')
const rating = ref(5)


const allBooks = [
  { id:1,title:'软件工程与计算',subtitle:'国家级规划教材，系统讲解软件工程核心方法',publisher:'机械工业出版社',publishTime:'2012-12',price:89.00,originalPrice:110.00,cover:'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80',author:'骆斌',rating:4.8,tags:['教材','热销'],description:'本书系统阐述软件工程的基本理论与工程化思想，涵盖需求分析、设计、实现与测试等关键阶段，强调方法论与实践相结合。',contents:'第一章 软件工程概述；第二章 软件过程模型；第三章 需求分析；第四章 软件设计；第五章 软件测试'},
  { id:2,title:'深入理解计算机系统',subtitle:'从程序员视角深入剖析计算机系统本质',publisher:'机械工业出版社',publishTime:'2016-06',price:129.00,originalPrice:159.00,cover:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',author:'Randal E. Bryant',rating:4.9,tags:['经典','硬核'],description:'本书以程序执行为主线，深入讲解计算机系统的组成与运行机制，是连接软件与硬件的重要桥梁。',contents:'第一章 计算机系统漫游；第二章 信息的表示；第三章 程序的机器级表示；第四章 处理器结构'},
  { id:3,title:'Vue.js设计与实现',subtitle:'深入理解 Vue 框架的设计思想与实现机制',publisher:'人民邮电出版社',publishTime:'2021-03',price:79.00,originalPrice:99.00,cover:'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=300&q=80',author:'霍春阳',rating:4.9,tags:['前端'],description:'本书从源码角度解析 Vue 的响应式系统、渲染机制与编译原理，帮助读者理解现代前端框架的底层逻辑。',contents:'第一章 框架设计理念；第二章 响应式系统；第三章 虚拟DOM；第四章 编译器'},
  { id:4,title:'JavaScript高级程序设计',subtitle:'系统全面的 JavaScript 权威指南',publisher:'人民邮电出版社',publishTime:'2020-09',price:99.00,originalPrice:129.00,cover:'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80',author:'Matt Frisbie',rating:4.7,tags:['经典'],description:'本书全面介绍 JavaScript 的语言特性、运行机制与最佳实践，是前端开发者的基础参考书。',contents:'第一章 JavaScript简介；第二章 语言基础；第三章 对象与函数；第四章 浏览器环境'},
  { id:5,title:'算法导论',subtitle:'系统讲解经典算法与复杂度分析',publisher:'机械工业出版社',publishTime:'2013-01',price:128.00,originalPrice:168.00,cover:'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',author:'Thomas H. Cormen',rating:9.9,tags:['硬核'],description:'本书系统介绍常见算法设计思想与分析方法，是计算机科学领域的算法经典教材。',contents:'第一章 算法基础；第二章 排序与选择；第三章 数据结构；第四章 动态规划'},
  { id:6,title:'解忧杂货店',subtitle:'温暖人心的治愈系小说',publisher:'南海出版公司',publishTime:'2014-05',price:39.00,originalPrice:45.00,cover:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',author:'东野圭吾',rating:9.2,tags:['小说'],description:'通过一封封回信串联起不同人生故事，展现人性中的善意与温暖。',contents:'第一章 午夜来信；第二章 命运抉择；第三章 回答与救赎'},
  { id:7,title:'设计模式',subtitle:'面向对象软件设计的经典范式',publisher:'机械工业出版社',publishTime:'2010-08',price:45.00,originalPrice:0,cover:'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',author:'GoF',rating:9.7,tags:['经典'],description:'本书总结了软件设计中反复出现的问题及其解决方案，对提高代码可维护性具有重要意义。',contents:'第一章 设计模式概述；第二章 创建型模式；第三章 结构型模式；第四章 行为型模式'},
  { id:8,title:'且以优雅过一生',subtitle:'杨绛散文与人生哲思精选',publisher:'人民文学出版社',publishTime:'2017-04',price:32.00,originalPrice:40.00,cover:'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',author:'杨绛',rating:9.3,tags:['文学'],description:'文字平实而深刻，展现作者对人生、家庭与时代的从容思考。',contents:'第一章 人生感悟；第二章 家庭记忆；第三章 世事随笔'},
  { id:9,title:'季风海域的丝银对流',subtitle:'全球史视角下的贸易与交流',publisher:'生活·读书·新知三联书店',publishTime:'2018-06',price:78.00,originalPrice:98.00,cover:'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400',author:'欧阳安',rating:8.6,tags:['全球史'],description:'本书从海洋贸易出发，探讨不同文明之间的经济与文化互动。',contents:'第一章 海域与季风；第二章 白银流通；第三章 全球网络'},
  { id:10,title:'显微镜下的大明',subtitle:'从基层视角观察明代社会',publisher:'湖南文艺出版社',publishTime:'2019-01',price:42.00,originalPrice:52.00,cover:'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400',author:'马伯庸',rating:8.7,tags:['明代'],description:'通过真实史料还原明代基层社会的运行逻辑，细节生动。',contents:'第一章 案件背后；第二章 官僚体系；第三章 民生现实'},
  { id:11,title:'法西斯主义的公民基础',subtitle:'现代政治极端化的社会根源',publisher:'商务印书馆',publishTime:'2020-11',price:88.00,originalPrice:0,cover:'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400',author:'迪伦·莱利',rating:8.9,tags:['社会学'],description:'本书从社会结构与政治心理角度分析法西斯主义产生的根源。',contents:'第一章 理论背景；第二章 社会结构；第三章 群众动员'},
  { id:12,title:'血孩子',subtitle:'女性主义视角下的科幻经典',publisher:'译林出版社',publishTime:'2021-07',price:46.80,originalPrice:58.00,cover:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',author:'奥克塔维娅·巴特勒',rating:8.2,tags:['科幻'],description:'通过科幻设定探讨权力、共生与人性边界的问题。',contents:'第一章 共生关系；第二章 权力结构；第三章 人性抉择'},
  { id:13,title:'悠游长风',subtitle:'温柔而深刻的科幻短篇集',publisher:'新星出版社',publishTime:'2022-02',price:52.00,originalPrice:62.00,cover:'https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=400',author:'莎拉·平斯克',rating:8.7,tags:['科幻'],description:'作品以细腻笔触描绘未来世界中的个体命运。',contents:'第一章 未来片段；第二章 人类选择；第三章 时间回声'},
  { id:14,title:'三体全集',subtitle:'中国硬科幻的里程碑之作',publisher:'重庆出版社',publishTime:'2010-11',price:93.00,originalPrice:110.00,cover:'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400',author:'刘慈欣',rating:9.5,tags:['硬科幻'],description:'通过宏大的宇宙设定探讨文明、生存与科技伦理。',contents:'第一章 文明危机；第二章 宇宙博弈；第三章 黑暗森林'},
  { id:15,title:'神经漫游者',subtitle:'赛博朋克文学的奠基之作',publisher:'江苏凤凰文艺出版社',publishTime:'2015-09',price:42.00,originalPrice:55.00,cover:'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',author:'威廉·吉布森',rating:9.0,tags:['赛博朋克'],description:'塑造了高度信息化社会中的虚拟现实与人类意识。',contents:'第一章 网络空间；第二章 黑客文化；第三章 意识边界'},
  { id:16,title:'沙丘',subtitle:'恢弘复杂的科幻史诗',publisher:'江苏文艺出版社',publishTime:'2017-10',price:68.00,originalPrice:88.00,cover:'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400',author:'弗兰克·赫伯特',rating:8.8,tags:['太空歌剧'],description:'围绕权力、宗教与生态展开的深度科幻叙事。',contents:'第一章 阿拉基斯；第二章 权力斗争；第三章 命运抉择'},
  { id:17,title:'盲视',subtitle:'意识与智能的哲学科幻',publisher:'新星出版社',publishTime:'2019-08',price:45.00,originalPrice:0,cover:'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400',author:'彼得·沃茨',rating:8.6,tags:['硬核'],description:'通过极端设定探讨意识是否是智能的必要条件。',contents:'第一章 接触事件；第二章 非人智能；第三章 意识反思'},
  { id:18,title:'万物皆美',subtitle:'面向儿童的审美启蒙读物',publisher:'人民文学出版社',publishTime:'2016-03',price:35.00,originalPrice:0,cover:'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',author:'冯骥才',rating:9.0,tags:['美育'],description:'通过生活中的细节引导儿童发现美、理解美。',contents:'第一章 发现美；第二章 感受自然；第三章 审美表达'},
  { id:19,title:'武器与国防',subtitle:'军事科技的通俗解读',publisher:'科学出版社',publishTime:'2015-05',price:45.00,originalPrice:52.00,cover:'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=400',author:'黄培康',rating:8.8,tags:['科普'],description:'以通俗语言介绍现代武器系统与国防科技。',contents:'第一章 现代武器概览；第二章 防御体系；第三章 技术发展'},
  { id: 20, title: '夏洛的网', subtitle: '美国儿童文学经典，讲述小猪威尔伯与蜘蛛夏洛的友情故事', publisher: '人民文学出版社', publishtime: '2005-06', price: 25.00, originalPrice: 32.00, cover: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400', author: 'E.B.怀特', rating: 9.2, tags: ['儿童文学'], description: '《夏洛的网》是美国儿童文学作家E.B.怀特创作的经典童书，通过动物之间的友情故事，让孩子们理解生命与关爱。', contents: '第一章 小猪威尔伯的诞生... 第二章 结识夏洛...' },
  { id: 21, title: '哈利·波特', subtitle:'奇幻小说经典，讲述少年巫师成长与冒险故事', publisher:'人民文学出版社', publishtime:'2000-07', price: 58.00, originalPrice: 68.00, cover:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', author:'J.K.罗琳', rating:9.1, tags:['奇幻'], description:'本书讲述了哈利·波特在霍格沃茨魔法学校的成长故事，以及他与伏地魔斗争的传奇经历。', contents:'第一章 儿时的哈利；第二章 收到霍格沃茨录取信；第三章 学院分配；第四章 魔法课程；第五章 冒险与挑战；第六章 友情与成长；第七章 对抗黑魔王。' },
  { id: 22, title: '林门鄭氏', subtitle:'非虚构历史与家族传记，探讨家族与地方变迁', publisher:'三联书店', publishtime:'2013-05', price: 49.00, originalPrice: 58.00, cover:'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=400', author:'林雪虹', rating:8.4, tags:['非虚构'], description:'书中以林门郑氏家族为线索，描绘了近代中国家族变迁与社会转型的历史图景。', contents:'第一章 家族沿革；第二章 地方政治；第三章 社会变迁；第四章 家族成员故事；第五章 历史档案解析；第六章 家族影响；第七章 时代总结。' },
  { id: 23, title: '河的第三条岸', subtitle:'拉美文学代表作，探索个体与社会的边界', publisher:'人民文学出版社', publishtime:'2005-09', price: 56.00, originalPrice: 68.00, cover:'https://images.unsplash.com/photo-1508898578281-774ac4893c0c?w=400', author:'若昂·吉马良斯·罗萨', rating:8.4, tags:['拉美'], description:'小说以拉美小镇为背景，通过河岸上的三条线索，展现人物内心世界与社会冲突。', contents:'第一章 河岸边的少年；第二章 家庭与社区；第三章 社会冲突；第四章 内心探索；第五章 历史记忆；第六章 人物关系；第七章 命运与选择。' },
  { id: 24, title: '白夜行', subtitle:'推理小说杰作，展现爱与罪的复杂纠葛', publisher:'集英社', publishtime:'2006-11', price: 48.00, originalPrice: 59.00, cover:'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400', author:'东野圭吾', rating:9.1, tags:['推理'], description:'故事围绕一对从童年开始命运紧密相连的男女，描述他们在爱与犯罪边缘徘徊的成长经历。', contents:'第一章 童年的秘密；第二章 成长的阴影；第三章 罪与惩罚；第四章 关系网；第五章 真相揭示；第六章 命运抉择；第七章 结局与反思。' },
  { id: 25, title: '最高虚构笔记', subtitle:'现代诗集，探索语言、想象与存在的边界', publisher:'广西师范大学出版社', publishtime:'2010-03', price: 52.00, originalPrice: 68.00, cover:'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?w=400', author:'华莱士·史蒂文斯', rating:8.6, tags:['诗集'], description:'诗人通过独特的意象与语言，将现实与幻想融合，探讨虚构、存在与个人内心世界的关系。', contents:'第一章 虚构与现实；第二章 自然意象；第三章 内心独白；第四章 哲思与反思；第五章 时间与记忆；第六章 语言实验；第七章 诗歌总结。' },
  { id: 26, title: '万物静默如谜', subtitle:'诺奖诗人辛波斯卡诗集，探索平凡与哲理', publisher:'生活·读书·新知三联书店', publishtime:'2012-06', price: 35.00, originalPrice: 42.00, cover:'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', author:'辛波斯卡', rating:9.1, tags:['诺奖'], description:'诗人以平实语言描述日常世界，通过诗歌形式揭示人生哲理和存在的深度。', contents:'第一章 日常生活；第二章 自然描写；第三章 人物观察；第四章 哲理思考；第五章 内心世界；第六章 时间与历史；第七章 总结与沉思。' },
  { id: 27, title: '悉达多', subtitle:'探寻灵性与自我觉醒的经典哲学小说', publisher:'译林出版社', publishtime:'2011-09', price: 32.00, originalPrice: 40.00, cover:'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400', author:'黑塞', rating:9.3, tags:['精神'], description:'小说讲述悉达多在印度寻找精神真理的旅程，通过对生活、苦难和智慧的体验，实现自我觉醒。', contents:'第一章 少年时期；第二章 离家修行；第三章 世俗经历；第四章 商人与情感；第五章 内心觉醒；第六章 与朋友的交流；第七章 灵性顿悟。' },
  { id: 28, title: '红楼梦', subtitle:'中国古典四大名著之一，描写贾、王、史、薛四大家族兴衰', publisher:'人民文学出版社', publishtime:'2015-05', price: 120.00, originalPrice: 158.00, cover:'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', author:'曹雪芹', rating:9.6, tags:['国学'], description:'通过贾宝玉与林黛玉、薛宝钗的情感故事，展现封建大家族的兴衰史及社会百态。', contents:'第一章 贾府初探；第二章 宝玉与黛玉；第三章 家族争斗；第四章 宴会与生活；第五章 官场与仕途；第六章 兴衰演变；第七章 命运与悲剧。' },
  { id: 29, title: '围城', subtitle:'讽刺小说经典，描绘婚姻与社会的困境', publisher:'人民文学出版社', publishtime:'2008-09', price: 35.00, originalPrice: 42.00, cover:'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400', author:'钱钟书', rating:9.3, tags:['讽刺'], description:'小说描写方鸿渐在求学、婚姻和职场中的困境，讽刺社会虚伪与人性弱点。', contents:'第一章 方鸿渐求学；第二章 留学生活；第三章 婚姻选择；第四章 职场经历；第五章 社会讽刺；第六章 人性观察；第七章 围城象征。' },
  { id: 30, title: '黄金时代', subtitle:'现代文学小说，讲述青年理想与社会现实冲突', publisher:'作家出版社', publishtime:'2007-06', price: 39.00, originalPrice: 45.00, cover:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', author:'王小波', rating:9.4, tags:['浪漫'], description:'小说以幽默与讽刺手法描写青年在理想与现实碰撞下的生活经历和思想探索。', contents:'第一章 青年成长；第二章 爱情与理想；第三章 社会观察；第四章 生活遭遇；第五章 思想冲突；第六章 内心独白；第七章 黄金时代感悟。' },
  { id: 31, title: '月亮和六便士', subtitle:'文学经典，探讨艺术与生活的冲突', publisher:'译林出版社', publishtime:'2010-12', price: 29.00, originalPrice: 38.00, cover:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', author:'毛姆', rating:8.8, tags:['艺术'], description:'小说主人公斯特里克兰放弃平凡生活追求艺术真谛，反映个人理想与社会责任的冲突。', contents:'第一章 平凡生活；第二章 艺术觉醒；第三章 旅行与体验；第四章 内心冲突；第五章 创作实践；第六章 社会反应；第七章 艺术与人生。' },
  { id: 32, title: '追风筝的人', subtitle:'治愈小说，通过友情与救赎讲述阿富汗历史', publisher:'上海人民出版社', publishtime:'2007-03', price: 36.00, originalPrice: 45.00, cover:'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400', author:'卡勒德·胡赛尼', rating:8.9, tags:['治愈'], description:'小说讲述了阿米尔与哈桑的友情、背叛与救赎，以及阿富汗社会的动荡历史。', contents:'第一章 童年生活；第二章 友情与背叛；第三章 家庭冲突；第四章 战争与流亡；第五章 救赎之路；第六章 回国经历；第七章 心灵治愈。' },
  { id: 33, title: '小逻辑', subtitle:'哲学经典著作，讲述逻辑推理与思维方法', publisher:'商务印书馆', publishtime:'2011-01', price: 48.00, originalPrice: 60.00, cover:'https://images.unsplash.com/photo-1533310266094-8898a03807dd?w=400', author:'黑格尔', rating:9.2, tags:['哲学'], description:'本书系统讲解逻辑学原理、概念分析、推理方法及哲学思辨，是逻辑学与哲学入门经典。', contents:'第一章 概念与判断；第二章 命题分析；第三章 推理方法；第四章 辩证法；第五章 概念发展；第六章 逻辑应用；第七章 哲学思考。' },
  { id: 34, title: '大江大河', subtitle:'励志小说，描绘改革开放背景下的奋斗人生', publisher:'人民文学出版社', publishtime:'2013-08', price: 128.00, originalPrice: 158.00, cover:'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400', author:'阿耐', rating:8.9, tags:['励志'], description:'通过宋运辉等人的奋斗历程，展示改革开放初期社会变迁与个人理想实现过程。', contents:'第一章 改革背景；第二章 初入社会；第三章 工作与奋斗；第四章 挫折与成长；第五章 成功经验；第六章 家庭与事业；第七章 理想实现。' },
  { id: 35, title: '局外人', subtitle:'荒诞主义小说，探讨个体存在与社会冷漠', publisher:'译林出版社', publishtime:'2009-04', price: 28.00, originalPrice: 35.00, cover:'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', author:'加缪', rating:9.1, tags:['荒诞'], description:'小说通过主人公梅尔索的生活与选择，表现存在主义思想及社会对个体的冷漠态度。', contents:'第一章 平凡生活；第二章 母亲去世；第三章 法庭审判；第四章 内心独白；第五章 社会反应；第六章 荒诞体验；第七章 存在思考。' },
  { id: 36, title: '海子诗全集', subtitle:'诗歌集锦，呈现海子独特的浪漫与哲思', publisher:'人民文学出版社', publishtime:'2002-09', price: 98.00, originalPrice: 118.00, cover:'https://images.unsplash.com/photo-1524143878510-e3b8d6312402?w=400', author:'海子', rating:9.5, tags:['诗歌'], description:'收录海子代表诗作，表达浪漫主义精神及对生命、自然与宇宙的深刻感悟。', contents:'第一章 自然意象；第二章 爱与孤独；第三章 梦境与幻想；第四章 社会观察；第五章 哲理思考；第六章 生命探索；第七章 诗歌风格总结。' },
  { id: 37, title: '平凡的世界', subtitle:'长篇小说，通过家庭与社会描写展现时代变迁', publisher:'人民文学出版社', publishtime:'2010-05', price: 108.00, originalPrice: 138.00, cover:'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400', author:'路遥', rating:9.3, tags:['长篇'], description:'小说描写普通农民家庭在社会变革中的生活奋斗、理想追求与命运起伏，具有强烈现实主义特色。', contents:'第一章 家庭生活；第二章 劳动与奋斗；第三章 青年成长；第四章 爱情与婚姻；第五章 社会冲突；第六章 理想与现实；第七章 历史与时代感悟。' },
  { id: 38, title: '时间的秩序', subtitle:'科普著作，解析时间的物理本质与哲学思考', publisher:'中信出版社', publishtime:'2018-09', price: 56.00, originalPrice: 0, cover:'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400', author:'卡洛·罗韦利', rating:9.0, tags:['科普'], description:'本书从物理学与哲学角度解释时间的本质、流动及其对人类认知的影响，深入浅出。', contents:'第一章 时间概念；第二章 物理时间；第三章 相对论；第四章 热力学与时间箭头；第五章 时间与记忆；第六章 时间哲学；第七章 时间观念总结。' },
  { id: 39, title: '被讨厌的勇气', subtitle:'心理学与哲学结合，探索阿德勒心理学与自我成长', publisher:'北京联合出版公司', publishtime:'2015-01', price: 45.0, originalPrice: 55.0, cover:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', author:'岸见一郎', rating:8.6, tags:['阿德勒','心理'], description:'通过对话形式讲解阿德勒心理学，强调勇于面对自己与改变生活的思维方式。', contents:'第一章 自我与他人；第二章 勇气的意义；第三章 人际关系；第四章 自由与责任；第五章 生活选择；第六章 成长实践；第七章 自我实现。' },
  { id: 40, title: '乌合之众', subtitle:'社会心理学经典，分析群体行为与大众心理', publisher:'商务印书馆', publishtime:'2010-06', price: 32.0, originalPrice: 38.0, cover:'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400', author:'古斯塔夫·勒庞', rating:8.3, tags:['社会学'], description:'本书分析群体心理特征、集体行为规律及其对社会变革、舆论与政治的影响。', contents:'第一章 群体心理概述；第二章 群体行为特征；第三章 群体影响；第四章 大众心理分析；第五章 社会变革中的群体；第六章 政治与舆论；第七章 实践与反思。' },
  { id: 41, title: '思考，快与慢', subtitle:'行为经济学与心理学著作，解析人类决策思维', publisher:'中信出版社', publishtime:'2012-05', price: 68.0, originalPrice: 89.0, cover:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', author:'丹尼尔·卡尼曼', rating:9.4, tags:['心理','经济'], description:'本书区分快思维与慢思维，分析人类决策偏差与行为经济学原理，帮助理性认知生活与工作。', contents:'第一章 系统1与系统2；第二章 启发式偏差；第三章 风险与不确定性；第四章 决策心理；第五章 认知偏差案例；第六章 行为经济学；第七章 思维优化方法。' },
  { id: 42, title: '非暴力沟通', subtitle: '提升人际关系的沟通技巧指南', publisher: '中信出版社', publishtime: '2010-08', price: 39.0, originalPrice: 49.0, cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', author: '马歇尔·卢森堡', rating: 8.8, tags: ['人际', '治愈'], description: '本书系统介绍了非暴力沟通的理论和实用方法，帮助读者改善人际关系，化解冲突。', contents: '第一章 非暴力沟通的四要素... 第二章 情绪与需求的表达...' },
  { id: 43, title: '卡拉马佐夫兄弟', subtitle: '陀思妥耶夫斯基的巅峰之作，探讨信仰与人性', publisher: '译林出版社', publishtime: '2002-03', price: 98.0, originalPrice: 120.0, cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', author: '陀思妥耶夫斯基', rating: 9.6, tags: ['俄国', '巅峰'], description: '通过卡拉马佐夫三兄弟的故事，深刻探讨善恶、信仰与人性本质。', contents: '第一部 父亲之死... 第二部 法庭与内心...' },
  { id: 44, title: '月亮与六便士', subtitle: '以画家斯特里克兰德为原型的理想主义小说', publisher: '上海译文出版社', publishtime: '2007-05', price: 32.0, originalPrice: 39.0, cover: 'https://images.unsplash.com/photo-1533310266094-8898a03807dd?w=400', author: '毛姆', rating: 8.9, tags: ['理想'], description: '小说讲述普通证券经纪人斯特里克兰德舍弃舒适生活追求绘画理想的故事，反映人生选择与艺术追求。', contents: '第一章 平凡生活... 第二章 追寻梦想...' },
  { id: 45, title: '鼠疫', subtitle: '加缪的存在主义名作，探讨人类在灾难中的命运', publisher: '上海译文出版社', publishtime: '2008-09', price: 38.0, originalPrice: 45.0, cover: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400', author: '加缪', rating: 9.1, tags: ['存在主义'], description: '《鼠疫》通过对鼠疫肆虐城市的描写，探讨人类面对死亡与荒诞的态度。', contents: '第一章 鼠疫来临... 第二章 人性的光辉...' },
  { id: 46, title: '德米安：彷徨少年时', subtitle: '黑塞成长小说，描写青年寻找自我与精神觉醒', publisher: '人民文学出版社', publishtime: '2003-11', price: 36.0, originalPrice: 42.0, cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', author: '赫尔曼·黑塞', rating: 9.0, tags: ['成长'], description: '小说描写少年德米安在精神探索与成长中的迷茫与觉醒，经典成长读物。', contents: '第一章 少年的困惑... 第二章 灵魂的觉醒...' },
  { id: 47, title: '万历十五年', subtitle: '中国历史研究经典，呈现明朝大历史画卷', publisher: '中华书局', publishtime: '1997-05', price: 29.8, originalPrice: 35.0, cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', author: '黄仁宇', rating: 9.2, tags: ['大历史'], description: '从万历十五年入手，透视明朝政治、经济、文化全貌，是中国历史研究的开创之作。', contents: '第一章 政治制度... 第二章 社会变迁...' },
  { id: 48, title: '叫魂', subtitle: '孔飞力研究清代社会事件的深度历史作品', publisher: '生活·读书·新知三联书店', publishtime: '2006-07', price: 52.0, originalPrice: 60.0, cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400', author: '孔飞力', rating: 9.1, tags: ['清史', '社会'], description: '书中分析了清代社会因迷信、恐惧引发的“叫魂”案件，揭示了社会心理与权力结构。', contents: '第一章 事件起源... 第二章 社会反响...' },
  { id: 49, title: '大不列颠百科全书', subtitle: '人类知识的百科全书，典藏版本', publisher: '英国百科全书出版社', publishtime: '2010-01', price: 399.0, originalPrice: 450.0, cover: 'https://images.unsplash.com/photo-1535905496755-26ae35d0ae54?w=400', author: '百科编委会', rating: 9.8, tags: ['典藏'], description: '收录从古至今各类知识的百科全书，内容全面，是典藏级参考书。', contents: '第一卷 自然科学... 第二卷 人文社会...' },
  { id: 50, title: '罗马帝国衰亡史', subtitle: '爱德华·吉本经典历史著作，分析罗马兴衰原因', publisher: '商务印书馆', publishtime: '1995-09', price: 240.0, originalPrice: 280.0, cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', author: '爱德华·吉本', rating: 9.5, tags: ['通史'], description: '从政治、经济、军事多角度分析罗马帝国的衰亡过程及其历史意义。', contents: '第一章 帝国的兴起... 第二章 衰亡的序曲...' },
  { id: 51, title: '哥德尔、艾舍尔、巴赫', subtitle: '跨界经典，逻辑、艺术与音乐的奇妙交融', publisher: '中信出版社', publishtime: '2001-08', price: 158.0, originalPrice: 188.0, cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400', author: '侯世达', rating: 9.7, tags: ['跨界', '神作'], description: '本书通过数学、艺术和音乐的交叉，探索人类思维和创造力的本质。', contents: '第一章 形式与意义... 第二章 数学与艺术的结合...' },
  { id: 52, title: '宇宙', subtitle: '卡尔·萨根经典科普，讲述宇宙的奥秘', publisher: '湖南科学技术出版社', publishtime: '1998-11', price: 88.0, originalPrice: 98.0, cover: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400', author: '卡尔·萨根', rating: 9.5, tags: ['科普'], description: '本书以浅显易懂的语言讲述宇宙起源、星系演化和人类探索宇宙的历程。', contents: '第一章 宇宙的诞生... 第二章 银河系的奥秘...' },
  { id: 53, title: '浪潮之巅', subtitle: '科技与商业的前沿解读', publisher: '中信出版社', publishtime: '2014-01', price: 79.0, originalPrice: 99.0, cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400', author: '吴军', rating: 9.1, tags: ['商业', '科技'], description: '本书分析了科技产业的发展历程和创新企业的成功经验，是商业和科技交叉的参考书。', contents: '第一章 科技创业史... 第二章 公司管理与创新...' },
  { id: 54, title: '失控', subtitle: '凯文·凯利讲述互联网与复杂系统的未来', publisher: '中信出版社', publishtime: '1999-05', price: 89.0, originalPrice: 109.0, cover: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400', author: '凯文·凯利', rating: 8.8, tags: ['互联网'], description: '探讨技术发展、复杂系统和网络社会的演变，对互联网时代有深刻洞察。', contents: '第一章 系统与控制... 第二章 技术进化的规律...' },
  { id: 55, title: '未来简史', subtitle: '尤瓦尔·赫拉利对人类未来的哲学与科技思考', publisher: '中信出版社', publishtime: '2016-09', price: 68.0, originalPrice: 78.0, cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400', author: '尤瓦尔·赫拉利', rating: 8.5, tags: ['哲学', 'AI'], description: '以宏观视角分析人类历史趋势，探讨科技、AI与人类未来的可能发展。', contents: '第一章 人类文明回顾... 第二章 人工智能与未来...' },
  { id: 56, title: '瓦尔登湖', subtitle: '梭罗的自然与心灵经典随笔', publisher: '人民文学出版社', publishtime: '2000-04', price: 25.0, originalPrice: 32.0, cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', author: '梭罗', rating: 8.6, tags: ['自然', '宁静'], description: '作者通过在瓦尔登湖的生活体验，讲述对自然、独立和简单生活的理解与思考。', contents: '第一章 湖边生活... 第二章 简朴与自然...' },
  { id: 57, title: '人生海海', subtitle: '麦家长篇小说，描绘人性的复杂与命运', publisher: '作家出版社', publishtime: '2008-08', price: 55.0, originalPrice: 59.0, cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', author: '麦家', rating: 8.2, tags: ['长篇', '传奇'], description: '小说以家族和时代为背景，刻画复杂的人性、爱情与命运。', contents: '第一章 家族恩怨... 第二章 命运交织...' },
  { id: 58, title: '鱼乐', subtitle: '汪曾祺散文，温暖治愈的生活记录', publisher: '作家出版社', publishtime: '2010-03', price: 42.0, originalPrice: 50.0, cover: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=400', author: '汪曾祺', rating: 9.3, tags: ['散文', '治愈'], description: '通过小人物生活的描写，展现平凡生活中的美好与温暖。', contents: '第一章 日常小事... 第二章 人情味...' },
  { id: 59, title: '沉默的大多数', subtitle: '王小波杂文集，犀利剖析社会现象', publisher: '作家出版社', publishtime: '2005-06', price: 38.0, originalPrice: 45.0, cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400', author: '王小波', rating: 9.1, tags: ['杂文'], description: '王小波通过杂文形式，对社会现象、文化问题提出独特而犀利的见解。', contents: '第一章 社会观察... 第二章 文化批判...' },
  { id: 60, title: '雅舍谈吃', subtitle: '梁实秋美食随笔，风趣雅致', publisher: '生活·读书·新知三联书店', publishtime: '2003-09', price: 35.0, originalPrice: 42.0, cover: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400', author: '梁实秋', rating: 8.7, tags: ['美食', '生活'], description: '书中以风趣的笔触，描写饮食文化与生活趣味，兼具实用与雅趣。', contents: '第一章 饮食风俗... 第二章 美食与人生...' },
  { id: 61, title: '克苏鲁神话', subtitle: '洛夫克拉夫特的经典幻想惊悚作品', publisher: '译林出版社', publishtime: '2012-05', price: 128.0, originalPrice: 158.0, cover: 'https://images.unsplash.com/photo-1501526029524-a8ea952b15be?w=400', author: '洛夫克拉夫特', rating: 8.6, tags: ['惊悚', '克系'], description: '以神秘恐怖和宇宙未知力量为主题，开创现代恐怖小说新流派。', contents: '第一章 古神传说... 第二章 异界恐怖...' },
  { id: 62, title: '永恒的终结', subtitle: '阿西莫夫经典科幻，探讨时间旅行与命运', publisher: '上海译文出版社', publishtime: '2004-06', price: 42.0, originalPrice: 52.0, cover: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400', author: '阿西莫夫', rating: 9.2, tags: ['时间旅行'], description: '小说通过时间旅行与人类历史的交错，探讨命运、自由意志与社会变革。', contents: '第一章 时间机器... 第二章 历史干预...' },
  { id: 63, title: '海伯利安', subtitle: '丹·西蒙斯科幻巨作，被誉为科幻圣经', publisher: '译林出版社', publishtime: '2003-08', price: 99.0, originalPrice: 120.0, cover: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400', author: '丹·西蒙斯', rating: 9.0, tags: ['科幻圣经'], description: '以史诗般的叙事描绘未来世界，探讨文明冲突与人性哲学。', contents: '第一章 朝圣者之旅... 第二章 星际传奇...' },
]

// 根据 URL 参数 id 动态查找书籍内容
const currentBook = computed(() => {
  const bookId = Number(route.params.id) // 获取路由中的 :id
  return allBooks.find(b => b.id === bookId) // 在数组中查找
})

// 图片画廊逻辑
const imageList = [
  currentBook.value.cover,
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80'
]
const currentImage = ref(imageList[0])

const addToCart = () => {
  ElMessage.success({
    message: `成功将 ${quantity.value} 本书加入购物车`,
    type: 'success',
    offset: 100
  })
}

const buyNow = () => {
  ElMessage.warning('跳转结算页...')
}
</script>

<style scoped lang="scss">
$tomato: #ff6700;
$gray-bg: #f5f7fa;
$border-color: #eee;

.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 1. 面包屑 */
.breadcrumb-area {
  margin-bottom: 20px;
  font-size: 14px;
}

/* 2. 主体区 Layout */
.product-grid {
  display: flex;
  gap: 40px;
}

/* 图片画廊 */
.gallery-section {
  width: 400px;
  flex-shrink: 0;

  .main-image {
    border: 1px solid $border-color;
    padding: 10px;
    margin-bottom: 15px;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;

    .img-box {
      width: 100%;
      height: 100%;
    }
  }

  .thumbnail-list {
    display: flex;
    gap: 10px;
    overflow-x: auto;

    .thumb-item {
      width: 60px;
      height: 60px;
      border: 2px solid transparent;
      cursor: pointer;

      &.active {
        border-color: $tomato;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }
}

/* 信息区 */
.info-section {
  flex: 1;

  .book-title {
    font-size: 22px;
    color: #333;
    margin: 0 0 10px 0;
    line-height: 1.4;

    .tag { vertical-align: middle; margin-left: 5px; }
  }

  .book-subtitle {
    font-size: 14px;
    color: #b0b0b0;
    margin-bottom: 15px;
  }

  .author-bar {
    font-size: 13px;
    color: #666;
    margin-bottom: 20px;
    a { color: #005aa0; text-decoration: none; &:hover { text-decoration: underline; } }
  }

  /* 价格面板 (京东风格) */
  .price-panel {
    background: #fdf5f2; // 浅番茄色背景
    padding: 15px 20px;
    border-radius: 4px;
    margin-bottom: 25px;

    .panel-row {
      display: flex;
      align-items: baseline;
      margin-bottom: 8px;

      .label {
        width: 60px;
        font-size: 12px;
        color: #999;
      }
    }

    .currency { color: $tomato; font-size: 18px; font-weight: bold; }
    .price { color: $tomato; font-size: 32px; font-weight: bold; margin-right: 10px; }
    .discount-tag { font-size: 12px; color: $tomato; border: 1px solid $tomato; padding: 0 4px; }

    .original-price { color: #999; text-decoration: line-through; font-size: 14px; }
    .promo-text { color: #666; font-size: 13px; }
  }

  .meta-row {
    display: flex;
    align-items: center;
    dl {
      margin: 0; padding: 0 15px;
      text-align: center;
      &:first-child { padding-left: 0; }

      dt { font-size: 12px; color: #999; margin-bottom: 4px; }
      dd { font-size: 14px; color: #333; font-weight: bold; margin: 0; }
    }
  }

  .action-area {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
  }

  .aux-actions {
    margin-top: 20px;
    display: flex;
    gap: 20px;
    .el-button { color: #999; font-size: 12px; }
  }
}

/* 3. 底部 Tab 区 */
.details-container {
  margin-top: 30px;
}

.recommend-sidebar {
  text-align: center;
  .side-header { font-weight: bold; }
  .side-book-item {
    margin-bottom: 20px;
    .side-img { width: 120px; height: 120px; margin-bottom: 8px; }
    .side-title { font-size: 12px; height: 34px; overflow: hidden; margin-bottom: 5px; color: #333; }
    .side-price { color: $tomato; font-weight: bold; }
  }
}

.product-tabs {
  min-height: 400px;

  :deep(.el-tabs__item) {
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    &.is-active { color: $tomato; }
  }

  :deep(.el-tabs__active-bar) { background-color: $tomato; }
}

.rich-content {
  padding: 10px;
  line-height: 1.8;
  color: #666;
  h3 { color: #333; margin-top: 20px; background: #f5f5f5; padding: 10px; border-left: 4px solid $tomato; }
}

/* 评价区样式 */
.reviews-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fcfcfc;
  border: 1px solid #eee;
  margin-bottom: 20px;

  .rate-score {
    text-align: center;
    padding-right: 30px;
    border-right: 1px solid #eee;
    .score { font-size: 40px; color: $tomato; font-weight: bold; }
    .text { color: #999; }
  }

  .rate-tags {
    padding-left: 30px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

.review-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 20px;

  .user-info {
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .name { font-size: 12px; margin: 5px 0; color: #666; }
  }

  .review-content {
    flex: 1;
    font-size: 14px;
    color: #333;
    line-height: 1.6;
  }

  .review-meta {
    width: 150px;
    text-align: right;
    font-size: 12px;
    color: #999;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
}

/* 移动端适配小细节 */
@media screen and (max-width: 768px) {
  .product-grid { flex-direction: column; }
  .gallery-section { width: 100%; }
  .sidebar-col { display: none; }
}
</style>