<script setup lang="ts">
defineProps<{
  video: any
}>()
</script>

<template>
  <router-link
    :to="`/watch/${video.videoId}`"
    class="block"
  >
    <div>
      <img
        :src="video.videoThumbnails?.[3]?.url || video.videoThumbnails?.[0]?.url"
        class="w-full rounded-xl aspect-video object-cover"
      />

      <div class="flex mt-3 gap-3">
        <div class="w-9 h-9 rounded-full bg-zinc-700"></div>

        <div>
          <div class="font-semibold line-clamp-2">
            {{ video.title }}
          </div>

          <div class="text-sm text-zinc-400 mt-1">
            {{ video.author }}
          </div>

          <div class="text-sm text-zinc-400">
            {{ video.viewCount || 0 }} views
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
