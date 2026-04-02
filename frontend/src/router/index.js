import { createRouter, createWebHistory } from 'vue-router'
import HomePageIndex from "@/views/homepage/HomePageIndex.vue";
import NotFound404 from "@/views/error/NotFound404.vue";
import RegisterIndex from "@/views/user/accounrt/RegisterIndex.vue";
import SpaceIndex from "@/views/user/space/SpaceIndex.vue";
import LoginIndex from "@/views/user/accounrt/LoginIndex.vue";
import FriendIndex from "@/views/friend/FriendIndex.vue";
import CreateIndex from "@/views/create/CreateIndex.vue";
import ProfileIndex from "@/views/user/profile/ProfileIndex.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomePageIndex,
      name: 'homepage-index',
    },
    {
      path: '/friend/',
      component: FriendIndex,
      name: 'friend-index',
    },
    {
      path: '/create/',
      component: CreateIndex,
      name: 'create-index',
    },
    {
      path: '/user/account/login',
      component: LoginIndex,
      name: 'user-account-login-index',
    },
    {
      path: '/user/account/register',
      component: RegisterIndex,
      name: 'user-account-register-index',
    },
    {
      path: '/user/space/:user_id/',
      component: SpaceIndex,
      name: 'user-space-index',
    },
    {
      path: '/user/profile/',
      component: ProfileIndex,
      name: 'user-profile-index',
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound404,
      name: 'notfound-404',
    }
  ],
})

export default router
