<template>
  <div class="admin-book">
    <div class="toolbar">
      <h2>书籍管理</h2>
      <!-- ID 5: 创建书籍 -->
      <el-button type="primary" @click="openDialog('add')">新增书籍</el-button>
    </div>

    <el-table :data="books" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="封面" width="100">
        <template #default="scope">
          <el-image :src="scope.row.cover" style="width: 50px; height: 70px" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="书名" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="stock" label="库存" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <!-- ID 6: 修改书籍 -->
          <el-button size="small" @click="openDialog('edit', scope.row)">编辑</el-button>
          <!-- ID 7: 删除书籍 -->
          <el-button size="small" type="danger" @click="deleteBook(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑/新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增书籍' : '编辑书籍'">
      <el-form :model="form" label-width="80px">
        <el-form-item label="书名">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :precision="2" :step="0.1" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBook">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const books = ref([
  { id: 1, title: 'Vue.js实战', author: '梁生', price: 59.00, stock: 100, cover: '...' },
])

const dialogVisible = ref(false)
const dialogType = ref('add')
const form = reactive({ title: '', author: '', price: 0, stock: 0 })

const openDialog = (type, row) => {
  dialogType.value = type
  if (type === 'edit') {
    Object.assign(form, row)
  } else {
    Object.assign(form, { title: '', author: '', price: 0, stock: 0 })
  }
  dialogVisible.value = true
}

const saveBook = () => {
  dialogVisible.value = false
  ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
}

const deleteBook = () => {
  ElMessageBox.confirm('确定删除这本书吗？', '提示', { type: 'warning' })
      .then(() => ElMessage.success('删除成功'))
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>