<script setup>
import NavBar from "@/components/navbar/NavBar.vue";
import {onMounted} from "vue";
import {userUserStore} from "@/stores/user.js";
import api from "@/js/http/api.js";
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";

const user = userUserStore()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  try {
    const res = await api.get('api/user/account/get_user_info/')
    const data = res.data
    if (data.result === 'success') {
      user.setUserInfo(data)
    }
  } catch (Error) {
    console.log(Error)
  } finally {
    user.setHasPulledUserInfo(true)

    if (route.meta.needLogin && !user.isLogin()) {
      await router.replace('user-account-login-index')
    }
  }
})
</script>

<template>
  <NavBar>
    <RouterView />
  </NavBar>
</template>

<style scoped>

</style>
