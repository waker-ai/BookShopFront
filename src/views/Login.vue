<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>欢迎登录番茄商城</h2>
      <el-form label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="admin / user" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="任意密码" show-password />
        </el-form-item>
        <el-button type="primary" style="width: 100%" @click="handleLogin">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = reactive({ username: '', password: '' })

const handleLogin = () => {
  if (form.username === 'admin') {
    sessionStorage.setItem('role', 'admin')
    ElMessage.success('管理员登录成功')
    router.push('/admin/books')
  } else {
    sessionStorage.setItem('role', 'user')
    ElMessage.success('用户登录成功')
    router.push('/')
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}
.login-card {
  width: 400px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #ff6700;
}
</style>