<template>
  <div class="user-profile-page">
    <div class="container">
      <el-row :gutter="20">
        <!-- 左侧：个人卡片 -->
        <el-col :span="6">
          <el-card class="box-card user-info-card">
            <div class="avatar-section">
              <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <h3>Admin</h3>
              <p class="user-level">🍅 番茄黄金会员</p>
            </div>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="num">1200</span>
                <span class="label">积分</span>
              </div>
              <div class="stat-item">
                <span class="num">¥ 58.00</span>
                <span class="label">余额</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：资料编辑 -->
        <el-col :span="18">
          <el-card class="box-card" header="编辑个人资料">
            <el-form :model="form" label-width="100px" class="profile-form">
              <el-form-item label="昵称">
                <el-input v-model="form.nickname" />
              </el-form-item>

              <el-form-item label="性别">
                <el-radio-group v-model="form.gender">
                  <el-radio label="male">男</el-radio>
                  <el-radio label="female">女</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="手机号">
                <el-input v-model="form.phone" placeholder="138****8888" disabled>
                  <template #append>修改</template>
                </el-input>
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input v-model="form.email" />
              </el-form-item>

              <el-form-item label="个性签名">
                <el-input v-model="form.bio" type="textarea" :rows="3" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" color="#ff6700" @click="saveProfile">保存修改</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  nickname: 'Admin',
  gender: 'male',
  phone: '13800138000',
  email: 'admin@tomato.com',
  bio: '热爱生活，热爱阅读。'
})

const saveProfile = () => {
  // 这里调用后端 API
  setTimeout(() => {
    ElMessage.success('资料保存成功！')
  }, 500)
}
</script>

<style scoped lang="scss">
.user-profile-page {
  padding: 20px 0;
  .container { width: 1200px; margin: 0 auto; }
}

.user-info-card {
  text-align: center;

  .avatar-section {
    padding: 20px 0;
    h3 { margin: 10px 0 5px; color: #333; }
    .user-level { font-size: 12px; color: #ff6700; background: #fff0e6; padding: 2px 8px; border-radius: 10px; display: inline-block; }
  }

  .stats-grid {
    display: flex;
    border-top: 1px solid #f0f0f0;
    padding-top: 15px;
    margin-top: 10px;

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;

      .num { font-weight: bold; font-size: 18px; color: #333; }
      .label { font-size: 12px; color: #999; margin-top: 4px; }

      &:first-child { border-right: 1px solid #f0f0f0; }
    }
  }
}

.profile-form {
  max-width: 600px;
  padding-top: 10px;
}
</style>