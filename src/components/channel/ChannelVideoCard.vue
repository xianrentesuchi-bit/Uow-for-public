<script setup lang="ts">
defineProps<{
  video: any
}>()
</script>

<template>
  <router-link
    :to="`/watch/${video.videoId}`"
    class="flex gap-4"
  >
    <img
      :src="video.videoThumbnails?.[0]?.url"
      class="w-[360px] aspect-video object-cover rounded-2xl"
    />

    <div class="flex-1">
      <div class="text-xl font-semibold text-black line-clamp-2">
        {{ video.title }}
      </div>

      <div class="text-sm text-gray-500 mt-2">
        {{ video.viewCount }} views
      </div>

      <div class="flex items-center gap-3 mt-4">
        <img
          :src="video.authorThumbnails?.[0]?.url"
          class="w-8 h-8 rounded-full"
        />

        <div class="text-sm text-gray-700">
          {{ video.author }}
        </div>
      </div>

      <div class="mt-4 text-sm text-gray-500 line-clamp-3">
        {{ video.description }}
      </div>
    </div>
  </router-link>
</template>
