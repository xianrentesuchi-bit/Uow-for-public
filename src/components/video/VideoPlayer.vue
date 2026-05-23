<!-- components/video/VideoPlayer.vue -->
<script setup lang="ts">
defineProps<{
  id: string
  stream?: string
}>()
</script>

<template>
  <iframe
    class="w-full aspect-video rounded-2xl border border-zinc-200"
    :src="
      stream === 'youtube'
        ? `https://www.youtube.com/embed/${id}`
        : `https://www.youtube-nocookie.com/embed/${id}`
    "
    allowfullscreen
  />
</template>
