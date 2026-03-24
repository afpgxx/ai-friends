<script setup>

import MenuIcon from "@/components/navbar/icons/MenuIcon.vue";
import HomePageIcon from "@/components/navbar/icons/HomePageIcon.vue";
import FriendIcon from "@/components/navbar/icons/FriendIcon.vue";
import CreateIcon from "@/components/navbar/icons/CreateIcon.vue";
import SearchIcon from "@/components/navbar/icons/SearchIcon.vue";
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

        <div class="navbar-center w-4/5 max-w-180">
          <div class="join w-4/5">
            <input class="input join-item w-4/5" placeholder="请输入你感兴趣的内容" />
            <button className="btn join-item rounded-r-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 px-6 font-medium">
              <SearchIcon className="w-4 h-4" />
              搜索
            </button>
          </div>
        </div>

        <div class="navbar-end">
          <button class="btn btn-ghost text-lg">登录</button>
          <button class="btn btn-ghost text-lg">注册</button>
        </div>
      </nav>
      <!-- Page content here -->
      <div class="p-4">页面内容</div>
    </div>

    <div class="drawer-side is-drawer-close:overflow-visible">
      <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-16 is-drawer-open:w-64">
        <!-- Sidebar content here -->
        <ul class="menu w-full grow">
          <li>
            <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right py-3" data-tip="首页">
               <HomePageIcon />
              <span class="is-drawer-close:hidden text-base ml-2 whitespace-nowrap">首页</span>
            </button>
          </li>

          <li>
            <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right py-3" data-tip="好友">
              <FriendIcon />
              <span class="is-drawer-close:hidden texe-base ml-2 whitespace-nowrap">好友</span>
            </button>
          </li>

          <li>
            <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right py-3" data-tip="创作">
              <CreateIcon />
              <span class="is-drawer-close:hidden text-base ml-2 whitespace-nowrap">创作</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>