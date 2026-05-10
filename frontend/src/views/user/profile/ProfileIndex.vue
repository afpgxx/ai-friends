<script setup>

import {useUserStore} from "@/stores/user.js";
import Photo from "@/views/user/profile/components/Photo.vue";
import Username from "@/views/user/profile/components/Username.vue";
import Profile from "@/views/user/profile/components/Profile.vue";
import {ref, useTemplateRef} from "vue";
import api from "@/js/http/api.js";
import {base64ToFile} from "@/js/utils/base64_to_files.js";

const user = useUserStore()

const photoRef = useTemplateRef('photo-ref')
const usernameRef = useTemplateRef('username-ref')
const profileRef = useTemplateRef('profile-ref')
const errorMessage = ref('')
const showToast = ref(false)

async function handleUpdate() {
  const photo = photoRef.value.myPhoto
  const username = usernameRef.value.myUsername
  const profile = profileRef.value.myProfile

  errorMessage.value = ''
  if (!photo) {
    errorMessage.value = "头像不能为空！"
  } else if (!profile) {
    errorMessage.value = "简介不能为空！"
  } else if (!username) {
    errorMessage.value = "用户名不能为空！"
  } else {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('profile', profile)
    if (photo !== user.photo) {
      formData.append('photo', base64ToFile(photo, 'photo.png'))
    }

    try {
      const res = await api.post('/api/user/profile/update/', formData)
      const data = res.data
      if (data.result === 'success') {
        user.setUserInfo(data)
        showToast.value = true
        setTimeout(() => {
          showToast.value = false
        }, 2000)
      } else {
        errorMessage.value = '保存失败！' + data.result
      }
    } catch (error) {
      console.log('保存失败，', error)
    }
  }
}
</script>

<template>
  <div class="flex justify-center">
    <div class="card w-120 bg-base-200 shadow-sm mt-16">
      <div class="card-body">
        <h3 class="text-lg font-bold my-4">编辑资料</h3>
        <Photo ref="photo-ref" :photo="user.photo" />
        <Username ref="username-ref" :username="user.username" />
        <Profile ref="profile-ref" :profile="user.profile" />

        <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
        <div class="flex justify-center">
          <button @click="handleUpdate" class="btn mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg">
            保存修改
          </button>

          <div class="toast toast-top toast-center z-50" v-if="showToast">
            <div class="alert alert-success shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>修改成功！</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>