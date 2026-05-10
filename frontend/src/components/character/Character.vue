<script setup>
import {ref, useTemplateRef} from "vue";
import {useUserStore} from "@/stores/user.js";
import UpdateIcon from "@/components/character/icons/UpdateIcon.vue";
import RemoveIcon from "@/components/character/icons/RemoveIcon.vue";
import api from "@/js/http/api.js";
import ChatField from "@/components/character/chat_field/ChatField.vue";
import {useRouter} from "vue-router";

const props = defineProps(['character', 'canEdit', 'canRemoveFriend', 'friendId'])
const emit = defineEmits(['remove'])
const isHover = ref(false)
const user = useUserStore()
const router = useRouter()

async function handleRemoveCharacter() {
  try{
    const res = await api.post('/api/create/character/remove/', {
      character_id: props.character.id,
    })
    if (res.data.result === 'success') {
      emit('remove', props.character.id)
    }
  } catch (error) {
    console.log(error)
  }
}

async function handleRemoveFriend() {
  try {
    const res = await api.post('api/friend/remove/', {
      friend_id: props.friendId,
    })

    if (res.data.result === 'success') {
      emit('remove', props.friendId)
    }
  } catch (error) {
    console.log(error)
  }
}

const chatFieldRef = useTemplateRef('chat-field-ref')
const friend = ref(null)

async function openChatField() {
  if (!user.isLogin()) {
    await router.push({
      name: 'user-account-login-index'
    })
  } else {
    try{
      const res = await api.post('/api/friend/get_or_create/', {
        character_id: props.character.id,
      })

      const data = res.data
      if (data.result === 'success') {
        friend.value = data.friend
        chatFieldRef.value.showModal()
      }
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<template>
  <div>
    <div class="avatar cursor-pointer" @mouseover="isHover = true" @mouseout="isHover = false" @click="openChatField">
      <div class="w-60 h-100 rounded-2xl relative overflow-hidden">
        <img
          :src="character.background_image"
          class="w-full h-full object-cover transition-all duration-500 ease-out"
          :class="{'scale-110': isHover}"
          alt=""
        >
        <!-- 优化后的渐变遮罩 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500" :class="{'opacity-0': isHover}"></div>
        <!-- 悬停时显示的文字信息 -->
        <div class="absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-500 translate-y-2" :class="{'opacity-0 translate-y-full': !isHover, 'opacity-100 translate-y-0': isHover}">
          <p class="font-bold text-lg line-clamp-1 break-all mb-2">{{ character.name }}</p>
          <p class="font-bold text-base line-clamp-3 break-all">{{ character.profile }}</p>
        </div>

        <div v-if="canEdit && character.author.user_id === user.id" class="absolute right-2 top-4 flex gap-1">
          <!-- 编辑按钮 -->
          <div class="tooltip tooltip-bottom before:bg-primary before:text-xs before:font-medium" data-tip="编辑角色">
            <RouterLink @click.stop :to="{name: 'update-character', params: {character_id: character.id}}" class="btn btn-circle btn-ghost bg-transparent hover:bg-primary/10 transition-all duration-200">
              <UpdateIcon />
            </RouterLink>
          </div>

          <!-- 删除按钮 -->
          <div class="tooltip tooltip-bottom before:bg-error before:text-xs before:font-medium" data-tip="删除角色">
            <button @click.stop="handleRemoveCharacter" class="btn btn-circle btn-ghost bg-transparent hover:bg-error/10 transition-all duration-200">
              <RemoveIcon />
            </button>
          </div>
        </div>

        <div v-if="canRemoveFriend" class="absolute right-3 top-6">
          <button @click.stop="handleRemoveFriend" class="btn btn-circle btn-ghost bg-transparent">
            <RemoveIcon />
          </button>
        </div>

        <div class="absolute left-4 top-54 avatar">
          <div class="w-16 rounded-full ring-3 ring-white">
            <img :src="character.photo" alt="">
          </div>
        </div>
      </div>
    </div>
    <RouterLink :to="{name: 'user-space-index', params: {user_id: character.author.user_id}}">
      <div class="flex items-center mt-4 gap-2 w-60">
        <div class="avatar">
          <div class="w-7 rounded-full">
            <img :src="character.author.photo" alt="">
          </div>
        </div>
        <div class="text-sm line-clamp-1 break-all">{{ character.author.username }}</div>
      </div>
    </RouterLink>
    <ChatField ref="chat-field-ref" :friend="friend" />
  </div>
</template>

<style scoped>

</style>