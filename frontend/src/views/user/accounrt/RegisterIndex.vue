<script setup>

</script>

<template>
<div class="flex justify-center mt-30">
  <fieldset class="rounded-3xl bg-white p-8 w-96 shadow-2xl">
    <p class="text-center text-black-500 mb-6 font-bold">开始您的精彩旅程</p>

    <div class="space-y-4">
      <div>
        <label class="label text-sm font-medium text-gray-700">用户名</label>
        <input type="text" class="input w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="请输入用户名" />
      </div>

      <div>
        <label class="label text-sm font-medium text-gray-700">密码</label>
        <input type="password" class="input w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="请设置密码" />
      </div>

      <div>
        <label class="label text-sm font-medium text-gray-700">确认密码</label>
        <input type="password" class="input w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="请再次输入密码" />
      </div>

      <button class="btn mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg">注册</button>

      <p class="text-center text-sm text-gray-500 mt-4">
        已有账号？
        <RouterLink :to="{name: 'user-account-login-index'}" class="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">立即登录</RouterLink>
      </p>
    </div>
  </fieldset>
</div>
</template>

<style scoped>

</style>