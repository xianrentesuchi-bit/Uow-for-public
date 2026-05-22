<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>

<template>
  <iframe
    class="w-full aspect-video rounded-2xl"
    :src="`https://www.youtube.com/embed/${id}`"
    allowfullscreen
  />
</template>
