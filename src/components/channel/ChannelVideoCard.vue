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
      :src="
        video.thumbnail ||
        `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
      "
      class="w-[360px] aspect-video object-cover rounded-2xl"
    />

    <div class="flex-1">
      <div class="text-xl font-semibold text-black line-clamp-2">
        {{ video.title }}
      </div>

      <div class="text-sm text-gray-500 mt-2">
        {{
          Intl.NumberFormat().format(
            video.viewCount || 0
          )
        }}
        views
      </div>

      <div class="flex items-center gap-3 mt-4">
        <img
          :src="
            video.authorThumbnail ||
            `https://yt3.ggpht.com/ytc/default-user=s800-c-k-c0x00ffffff-no-rj`
          "
          class="w-8 h-8 rounded-full object-cover"
        />

        <div class="text-sm text-gray-700">
          {{ video.author }}
        </div>
      </div>

      <div class="mt-4 text-sm text-gray-500 line-clamp-3 whitespace-pre-wrap">
        {{ video.description }}
      </div>
    </div>
  </router-link>
</template>
