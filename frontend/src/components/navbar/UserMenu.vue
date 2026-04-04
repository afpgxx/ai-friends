<script setup>
import {userUserStore} from "@/stores/user.js";
import UserSpaceIcon from "@/components/navbar/icons/UserSpaceIcon.vue";
import UserProfileIcon from "@/components/navbar/icons/UserProfileIcon.vue";
import UserLogoutIcon from "@/components/navbar/icons/UserLogoutIcon.vue";
import {useRouter} from "vue-router";
import api from "@/js/http/api.js";

const user = userUserStore()
const router = useRouter()

function closeMenu() {
  const element = document.activeElement
  if (element && element instanceof HTMLElement) element.blur()
}

async function handelLogout() {
  try {
    const res = await api.post('api/user/account/logout/')
    if (res.data.result === 'success') {
      user.logout()
      await router.push({name: 'user-account-login-index'})
    }
  } catch (Error) {
    console.log(Error)
  }
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="avatar btn btn-circle w-8 h-8 mr-6">
      <div class="w-8 rounded-full">
        <img :src="user.photo" alt="">
      </div>
    </div>
    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-lg">
      <li>
        <RouterLink @click="closeMenu" :to="{name: 'user-space-index', params: {user_id: user.id}}">
          <div class="avatar">
            <div class="w-10 rounded-full">
              <img :src="user.photo" alt="">
            </div>
          </div>
          <div class="text-base font-bold line-clamp-1 ml-2 break-all">{{ user.username }}</div>
        </RouterLink>
      </li>
      <li>
        <RouterLink @click="closeMenu" :to="{name: 'user-space-index', params: {user_id: user.id}}" class="text-sm font-bold py-3">
          <UserSpaceIcon/>
          个人空间
        </RouterLink>
      </li>
      <li>
        <RouterLink @click="closeMenu" :to="{name: 'user-profile-index'}" class="text-sm font-bold py-3">
          <UserProfileIcon/>
          编辑资料
        </RouterLink>
      </li>
      <li></li>
      <li>
        <a @click="handelLogout" class="text-sm font-bold py-3">
          <UserLogoutIcon/>
          退出登录
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>