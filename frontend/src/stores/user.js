import {defineStore} from "pinia";
import {ref} from "vue";

export const userUserStore = defineStore('user', () => {
    const id = ref(0)
    const username = ref('')
    const photo = ref('')
    const profile = ref('')
    const accessToken = ref('')

    function isLogin() {
        return !!accessToken.value  // 不带value的accesstoken永远不为空
    }

    function setAccessToken(token) {
        accessToken.value = token
    }

    function setUserInfo(data) {
        id.value = data.user_id
        username.value = data.username
        profile.value = data.profile
        photo.value = data.photo
    }

    function logout() {
        id.value = 0
        username.value = ''
        photo.value = ''
        profile.value = ''
        accessToken.value = ''
    }

    return {
        id,
        username,
        photo,
        profile,
        accessToken,
        isLogin,
        setAccessToken,
        setUserInfo,
        logout,

    }
})