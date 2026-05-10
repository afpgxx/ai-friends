<script setup>

import BackgroundImage from "@/views/create/character/components/BackgroundImage.vue";
import Photo from "@/views/create/character/components/Photo.vue";
import Name from "@/views/create/character/components/Name.vue";
import Profile from "@/views/create/character/components/Profile.vue";
import {ref, useTemplateRef} from "vue";
import {base64ToFile} from "@/js/utils/base64_to_files.js";
import api from "@/js/http/api.js";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user.js";

const photoRef = useTemplateRef('photo-ref')
const nameRef = useTemplateRef('name-ref')
const profileRef = useTemplateRef('profile-ref')
const backgroundImageRef = useTemplateRef('background-image-ref')
const errorMessage = ref('')

const router = useRouter()
const user = useUserStore()

async function handelCreate() {
  const photo = photoRef.value.myPhoto
  const name = nameRef.value.myName?.trim()
  const profile = profileRef.value.myProfile?.trim()
  const backgroundImage = backgroundImageRef.value.myBackgroundImage

  errorMessage.value = ''
  if (!photo) {
    errorMessage.value = '头像不能为空!'
  } else if (!name) {
    errorMessage.value = '角色名不能为空!'
  } else if (!profile) {
    errorMessage.value = '角色简介不能为空!'
  } else if (!backgroundImage) {
    errorMessage.value = '角色背景不能为空!'
  } else {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('photo', base64ToFile(photo, 'photo.png'))
    formData.append('profile', profile)
    formData.append('background_image', base64ToFile(backgroundImage, 'background_image.png'))

    try {
      const res = await api.post('/api/create/character/create/', formData)
      const data = res.data
      if (data.result === 'success') {
        await router.push({
          name: 'user-space-index',
          params: {
            user_id: user.id
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<template>
  <div class="flex justify-center">
    <div class="card w-120 bg-base-200 shadow-sm mt-4">
      <div class="card-body">
        <h3 class="text-lg font-bold my-0">创建角色</h3>
        <Photo ref="photo-ref"/>
        <Name ref="name-ref"/>
        <Profile ref="profile-ref"/>
        <BackgroundImage ref="background-image-ref"/>
        <p v-if="errorMessage" class="text-sm text-red-500">{{errorMessage}}</p>
        <div class="flex justify-center pt-4">
          <button @click="handelCreate" class="btn btn-primary w-64 gap-2 shadow-md hover:shadow-lg transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            创建角色
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>