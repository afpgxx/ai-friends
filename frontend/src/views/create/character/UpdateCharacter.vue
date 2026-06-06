<script setup>

import BackgroundImage from "@/views/create/character/components/BackgroundImage.vue";
import Photo from "@/views/create/character/components/Photo.vue";
import Name from "@/views/create/character/components/Name.vue";
import Profile from "@/views/create/character/components/Profile.vue";
import {onMounted, ref, useTemplateRef} from "vue";
import {base64ToFile} from "@/js/utils/base64_to_files.js";
import api from "@/js/http/api.js";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/user.js";
import Voice from "@/views/create/character/components/Voice.vue";

const photoRef = useTemplateRef('photo-ref')
const nameRef = useTemplateRef('name-ref')
const voiceRef = useTemplateRef('voice-ref')
const profileRef = useTemplateRef('profile-ref')
const backgroundImageRef = useTemplateRef('background-image-ref')
const errorMessage = ref('')

const router = useRouter()
const user = useUserStore()
const route = useRoute()
const characterId = route.params.character_id
const character = ref(null)

const voices = ref([])
const curVoiceId = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/api/create/character/get_single/', {
      params: {
        character_id: characterId,
      }
    })

    const data = res.data
    if (data.result === 'success') {
      character.value = data.character
      voices.value = data.voices
      curVoiceId.value = data.character.voice_id
    }
  } catch (error) {
    console.log(error)
  }
})

async function handelUpdate() {
  const photo = photoRef.value.myPhoto
  const name = nameRef.value.myName?.trim()
  const voice = voiceRef.value.myVoice
  const profile = profileRef.value.myProfile?.trim()
  const backgroundImage = backgroundImageRef.value.myBackgroundImage

  errorMessage.value = ''
  if (!photo) {
    errorMessage.value = '头像不能为空!'
  } else if (!name) {
    errorMessage.value = '角色名不能为空!'
  } else if (!voice) {
    errorMessage.value = '音色不能为空！'
  } else if (!profile) {
    errorMessage.value = '角色简介不能为空!'
  } else if (!backgroundImage) {
    errorMessage.value = '角色背景不能为空!'
  } else {
    const formData = new FormData()
    formData.append('character_id', characterId)
    formData.append('name', name)
    formData.append('voice_id', voice)
    formData.append('profile', profile)

    if (photo !== character.value.photo) {
      formData.append('photo', base64ToFile(photo, 'photo.png'))
    }

    if (backgroundImage !== character.value.background_image) {
      formData.append('background_image', base64ToFile(backgroundImage, 'background_image.png'))
    }

    try {
      const res = await api.post('/api/create/character/update/', formData)
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
  <div v-if="character" class="flex justify-center">
    <div class="card w-120 bg-base-200 shadow-sm mt-4">
      <div class="card-body">
        <h3 class="text-lg font-bold my-0">更新角色</h3>
        <Photo ref="photo-ref" :photo="character.photo"/>
        <Name ref="name-ref" :name="character.name"/>
        <Voice ref="voice-ref" :voices="voices" :cur-voice-id="curVoiceId" />
        <Profile ref="profile-ref" :profile="character.profile"/>
        <BackgroundImage ref="background-image-ref" :backgroundImage="character.background_image"/>
        <p v-if="errorMessage" class="text-sm text-red-500">{{errorMessage}}</p>
        <div class="flex justify-center pt-4">
          <button @click="handelUpdate" class="btn btn-primary w-64 gap-2 shadow-md hover:shadow-lg transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            更新角色
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>