<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {userUserStore} from "@/stores/user.js";
import api from "@/js/http/api.js";

const username = ref('')
const password = ref('')
const confirm_password = ref('')
const errorMessage = ref('')
const router = useRouter()
const user = userUserStore()

async function handleRegister() {
  errorMessage.value = ''
  try {
    const res = await api.post('api/user/account/register/', {
      username: username.value,
      password: password.value,
      confirm_password: confirm_password.value
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
<div class="flex justify-center mt-30">
  <fieldset class="rounded-3xl bg-white p-8 w-96 shadow-2xl">
    <p class="text-center text-black-500 mb-6 font-bold">开始您的精彩旅程</p>

    <div class="space-y-4">
      <div>
        <label class="label text-sm font-medium text-gray-700">用户名</label>
        <input v-model="username" type="text" class="input w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="请输入用户名" />
      </div>

      <div>
        <label class="label text-sm font-medium text-gray-700">密码</label>
        <input v-model="password" type="password" class="input w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="请设置密码" />
      </div>

      <div>
        <label class="label text-sm font-medium text-gray-700">确认密码</label>
        <input v-model="confirm_password" type="password" class="input w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="请再次输入密码" />
      </div>

      <p v-if="errorMessage" class="text-base pt-1 text-red-500 font-bold">{{ errorMessage }}</p>

      <button @click="handleRegister" class="btn mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg">
        注册
      </button>

      <p class="text-center text-sm text-gray-500 mt-4">
        已有账号？
        <RouterLink :to="{name: 'user-account-login-index'}" class="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
          立即登录
        </RouterLink>
      </p>
    </div>
  </fieldset>
</div>
</template>

<style scoped>

</style>