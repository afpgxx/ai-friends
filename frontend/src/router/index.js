import { createRouter, createWebHistory } from 'vue-router'
import HomePageIndex from "@/views/homepage/HomePageIndex.vue";
import NotFound404 from "@/views/error/NotFound404.vue";
import RegisterIndex from "@/views/user/accounrt/RegisterIndex.vue";
import SpaceIndex from "@/views/user/space/SpaceIndex.vue";
import LoginIndex from "@/views/user/accounrt/LoginIndex.vue";
import FriendIndex from "@/views/friend/FriendIndex.vue";
import CreateIndex from "@/views/create/CreateIndex.vue";
import ProfileIndex from "@/views/user/profile/ProfileIndex.vue";
import {userUserStore} from "@/stores/user.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomePageIndex,
      name: 'homepage-index',
      meta: {
        needLogin: true,
      }
    },
    {
      path: '/friend/',
      component: FriendIndex,
      name: 'friend-index',
      meta: {
        needLogin: true,
      }
    },
    {
      path: '/create/',
      component: CreateIndex,
      name: 'create-index',
      meta: {
        needLogin: true,
      }
    },
    {
      path: '/user/account/login',
      component: LoginIndex,
      name: 'user-account-login-index',
      meta: {
        needLogin: false,
      }
    },
    {
      path: '/user/account/register',
      component: RegisterIndex,
      name: 'user-account-register-index',
      meta: {
        needLogin: false,
      }
    },
    {
      path: '/user/space/:user_id/',
      component: SpaceIndex,
      name: 'user-space-index',
      meta: {
        needLogin: true,
      }
    },
    {
      path: '/user/profile/',
      component: ProfileIndex,
      name: 'user-profile-index',
      meta: {
        needLogin: true,
      }
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound404,
      name: 'notfound-404',
      meta: {
        needLogin: false,
      }
    }
  ],
})

router.beforeEach((to, from) => {
  const user = userUserStore()
  if (to.meta.needLogin && user.hasPulledUserInfo && !user.isLogin()) {
    return {name: "user-account-login-index"}
  }
  return true
})

export default router
