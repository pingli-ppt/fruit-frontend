<template>
  <div style="padding: 40px">
    <h2>登录</h2>

    <input v-model="username" placeholder="用户名" />
    <br /><br />

    <input v-model="password" type="password" placeholder="密码" />
    <br /><br />

    <button @click="login">登录</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '../api/request'

const router = useRouter()

const username = ref('')
const password = ref('')

const login = async () => {
  const res = await request.post('/api/login', {
    username: username.value,
    password: password.value
  })

  if (res.data.success) {
    router.push('/')
  } else {
    alert('登录失败')
  }
}
</script>
