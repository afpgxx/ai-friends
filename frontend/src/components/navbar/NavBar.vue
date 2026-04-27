<script setup>

import MenuIcon from "@/components/navbar/icons/MenuIcon.vue";
import HomePageIcon from "@/components/navbar/icons/HomePageIcon.vue";
import FriendIcon from "@/components/navbar/icons/FriendIcon.vue";
import CreateIcon from "@/components/navbar/icons/CreateIcon.vue";
import SearchIcon from "@/components/navbar/icons/SearchIcon.vue";
import {userUserStore} from "@/stores/user.js";
import UserMenu from "@/components/navbar/UserMenu.vue";
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
const user = userUserStore()
const searchQuery = ref('')
const router = useRouter()
const route = useRoute()

watch(() => route.query.q, newQ => {
  searchQuery.value = newQ || ''
})

function handleSearch() {
  router.push({
    name: 'homepage-index',
    query: {
      q: searchQuery.value.trim(),
    }
  })
}
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Navbar -->
      <nav class="navbar w-full bg-base-100 shadow-sm">
        <div class="navbar-start">
          <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
            <MenuIcon />
          </label>
        <div class="px-2 font-bold text-xl">AIFriends</div>
        </div>

        <div class="navbar-center w-4/5 max-w-180 flex justify-center">
          <form @submit.prevent="handleSearch" class="join w-4/5">
            <input v-model="searchQuery" class="focus:outline-none focus:ring-0 input join-item w-4/5" placeholder="搜索你感兴趣的内容" />
            <button type="submit" class="btn join-item rounded-r-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 px-6 font-medium">
              <SearchIcon class="w-5 h-5" />
              搜索
            </button>
          </form>
        </div>

        <div class="navbar-end">
          <RouterLink v-if="user.isLogin()" :to="{name: 'create-index'}" active-class="btn-active" class="btn btn-ghost text-lg mr-5">
            <CreateIcon />  创作
          </RouterLink>
          <div v-if="!user.isLogin() && user.hasPulledUserInfo">
            <RouterLink :to="{name: 'user-account-login-index'}" active-class="btn-active" class="btn btn-ghost text-lg">
              登录
            </RouterLink>
            <RouterLink :to="{name: 'user-account-register-index'}" active-class="btn-active" class="btn btn-ghost text-lg">
              注册
            </RouterLink>
          </div>
          <UserMenu v-else-if="user.isLogin()" />
        </div>
      </nav>
      <!-- Page content here -->
      <slot></slot>
    </div>

    <div class="drawer-side is-drawer-close:overflow-visible">
      <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-16 is-drawer-open:w-64">
        <!-- Sidebar content here -->
        <ul class="menu w-full grow">
          <li>
            <RouterLink :to="{name: 'homepage-index'}" active-class="menu-focus" class="is-drawer-close:tooltip is-drawer-close:tooltip-right py-3" data-tip="首页">
               <HomePageIcon />
              <span class="is-drawer-close:hidden text-base ml-2 whitespace-nowrap">首页</span>
            </RouterLink>
          </li>

          <li>
            <RouterLink :to="{name: 'friend-index'}" active-class="menu-focus" class="is-drawer-close:tooltip is-drawer-close:tooltip-right py-3" data-tip="好友">
              <FriendIcon />
              <span class="is-drawer-close:hidden text-base ml-2 whitespace-nowrap">好友</span>
            </RouterLink>
          </li>

          <li>
            <RouterLink :to="{name: 'create-index'}" active-class="menu-focus" class="is-drawer-close:tooltip is-drawer-close:tooltip-right py-3" data-tip="创作">
              <CreateIcon />
              <span class="is-drawer-close:hidden text-base ml-2 whitespace-nowrap">创作</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>