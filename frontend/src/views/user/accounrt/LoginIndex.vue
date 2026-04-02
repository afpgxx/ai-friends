<script setup>

import {ref} from "vue";
import {userUserStore} from "@/stores/user.js";
import {useRouter} from "vue-router";
import api from "@/js/http/api.js";

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const router = useRouter()
const user = userUserStore()

async function handelLogin() {
  errorMessage.value = ''
  try{
    const res = await api.post('/api/user/account/login/', {
      username: username.value,
      password: password.value,
    })

    const data = res.data
    if (data.result === 'success') {
      user.setAccessToken(data.access)
      user.setUserInfo(data)
      await router.push({
        name: 'homepage-index'
      })
    } else {
      errorMessage.value = data.result
    }
  } catch (Error) {
    console.log(Error)
  }
}
</script>

<template>
  <div class="flex justify-center mt-40">
    <form @submit.prevent class="rounded-3xl bg-white p-8 w-96 shadow-2xl">
      <p class="text-center text-black-500 mb-6 font-bold">请登录您的账号</p>

      <div class="space-y-4">
        <div>
          <label class="label text-sm font-medium text-gray-700">用户名</label>
          <input v-model="username" type="text" class="input w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="请输入您的用户名" />
        </div>

        <div>
          <label class="label text-sm font-medium text-gray-700">密码</label>
          <input v-model="password" type="password" class="input w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="请输入您的密码" />
        </div>

        <p v-if="errorMessage" class="text-sm pt-1 text-red-500">{{ errorMessage }}</p>

        <button @click="handelLogin" class="btn mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg">
          登录
        </button>

        <p class="text-center text-sm text-gray-500 mt-4">
          还没有账号？
          <RouterLink :to="{name: 'user-account-register-index'}" class="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
            立即注册
          </RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>