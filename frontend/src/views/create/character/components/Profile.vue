<script setup>
import {ref, watch} from "vue";

const props = defineProps(['profile'])
const myProfile = ref(props.profile)

watch(() => props.profile, newVal => {
  myProfile.value = newVal
})

defineExpose({
  myProfile,
})
</script>

<template>
  <fieldset class="fieldset rounded-box bg-base-200">
  <legend class="fieldset-legend text-base font-medium ml-1">角色简介</legend>
  <textarea
    v-model="myProfile"
    rows="6"
    class="textarea textarea-bordered w-full focus:textarea-primary transition-all duration-300 resize-none"
    placeholder="请描述一下这个角色的背景故事、性格特点..."
  ></textarea>
</fieldset>
</template>

<style scoped>

</style>