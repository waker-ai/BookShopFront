<template>
  <div class="register-page">
    <div class="register-box">
      <!-- 头部 Logo -->
      <div class="header">
        <span class="logo-icon">🍅</span>
        <h2 class="title">欢迎加入番茄商城</h2>
        <p class="subtitle">创建您的账户，开启阅读之旅</p>
      </div>

      <!-- 注册表单 -->
      <el-form
          ref="ruleFormRef"
          :model="form"
          :rules="rules"
          class="register-form"
          size="large"
          status-icon
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
          />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input
              v-model="form.email"
              placeholder="请输入电子邮箱"
              :prefix-icon="Message"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
              v-model="form.password"
              type="password"
              placeholder="设置密码 (至少6位)"
              show-password
              :prefix-icon="Lock"
          />
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item prop="confirmPassword">
          <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次确认密码"
              show-password
              :prefix-icon="Lock"
          />
        </el-form-item>

        <!-- 协议勾选 -->
        <el-form-item prop="agreement">
          <el-checkbox v-model="form.agreement">
            我已阅读并同意
            <el-link type="primary" :underline="false">《用户服务协议》</el-link> 和
            <el-link type="primary" :underline="false">《隐私政策》</el-link>
          </el-checkbox>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item>
          <el-button
              type="primary"
              class="submit-btn"
              :loading="loading"
              round
              color="#ff6700"
              @click="handleRegister(ruleFormRef)"
          >
            立即注册
          </el-button>
        </el-form-item>

        <!-- 底部链接 -->
        <div class="footer-links">
          <span>已有账号？</span>
          <el-link type="primary" @click="$router.push('/login')">直接登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const ruleFormRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// --- 自定义验证规则 ---

// 校验两次密码是否一致
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// 校验是否勾选协议
const validateAgreement = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请阅读并同意协议'))
  } else {
    callback()
  }
}

// 表单规则配置
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ],
  agreement: [
    { validator: validateAgreement, trigger: 'change' }
  ]
})

// --- 注册逻辑 ---
const handleRegister = async (formEl) => {
  if (!formEl) return

  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true

      // 模拟后端 API 请求
      setTimeout(() => {
        loading.value = false
        ElMessage.success('注册成功，请登录！')

        // 跳转到登录页
        router.push('/login')
      }, 1500)

    } else {
      console.log('error submit!', fields)
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 背景：使用番茄色系的淡雅渐变 */
  background: linear-gradient(135deg, #fff0e6 0%, #ffe4d6 100%);
  position: relative;
  overflow: hidden;

  /* 背景装饰圆圈 */
  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: rgba(255, 103, 0, 0.05);
    border-radius: 50%;
    top: -150px;
    left: -150px;
  }
  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: rgba(255, 103, 0, 0.08);
    border-radius: 50%;
    bottom: -100px;
    right: -50px;
  }
}

.register-box {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  z-index: 1;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
}

.header {
  text-align: center;
  margin-bottom: 30px;

  .logo-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 10px;
    animation: bounce 2s infinite;
  }

  .title {
    font-size: 24px;
    color: #333;
    font-weight: bold;
    margin: 0 0 8px;
  }

  .subtitle {
    font-size: 14px;
    color: #999;
    margin: 0;
  }
}

.register-form {
  .submit-btn {
    width: 100%;
    font-weight: bold;
    font-size: 16px;
    margin-top: 10px;
    height: 44px;
  }
}

.footer-links {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;

  .el-link {
    font-size: 14px;
    margin-left: 5px;
    vertical-align: baseline;
    color: #ff6700;

    &:hover {
      opacity: 0.8;
    }
  }
}

/* 简单的跳动动画 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 移动端适配 */
@media (max-width: 480px) {
  .register-box {
    box-shadow: none;
    background: transparent;
  }
  .register-page {
    background: #fff;
    align-items: flex-start;
    padding-top: 40px;
  }
}
</style>