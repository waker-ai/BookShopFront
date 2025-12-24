<template>
  <div class="book-card" @click="$emit('click')">
    <div class="card-image-wrapper">
      <el-image :src="book.cover" fit="cover" loading="lazy" class="book-cover">
        <template #placeholder>
          <div class="image-slot">...</div>
        </template>
      </el-image>
      <!-- 悬停遮罩 -->
      <div class="hover-actions">
        <el-button type="primary" circle icon="View" />
      </div>
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
        <!-- 这里的 stop 修饰符防止点击购物车时跳转详情 -->
        <el-button type="primary" plain circle icon="ShoppingCart" size="small" class="add-btn" @click.stop />
      </div>
    </div>
  </div>
</template>

<script setup>
import { View, ShoppingCart } from '@element-plus/icons-vue'

// 接收 props
defineProps({
  book: {
    type: Object,
    required: true
  }
})

// 声明事件
defineEmits(['click'])
</script>

<style scoped lang="scss">
$primary-color: #409eff;
$text-main: #303133;
$text-secondary: #909399;

.book-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0; /* 加一点微弱边框 */
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);

    .hover-actions {
      opacity: 1;
    }
  }

  .card-image-wrapper {
    position: relative;
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

    &:hover .book-cover {
      transform: scale(1.05);
    }

    .hover-actions {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s;
    }
  }

  .card-content {
    padding: 16px;
  }

  .book-tags {
    margin-bottom: 8px;
    display: flex;
    gap: 4px;
    flex-wrap: wrap;

    .mini-tag {
      font-size: 10px;
      padding: 2px 6px;
      background: #e6f7ff;
      color: $primary-color;
      border-radius: 4px;
    }
  }

  .book-title {
    margin: 0 0 6px;
    font-size: 15px;
    font-weight: 600;
    color: $text-main;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .book-author {
    color: $text-secondary;
    font-size: 12px;
    margin: 0 0 12px;
  }

  .book-meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .price-box {
    color: #ff4d4f;
    line-height: 1;

    .currency { font-size: 12px; margin-right: 2px; }
    .current-price { font-size: 18px; font-weight: bold; }
    .original-price { font-size: 12px; color: #ccc; text-decoration: line-through; margin-left: 6px; }
  }
}
</style>