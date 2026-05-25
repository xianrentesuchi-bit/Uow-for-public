<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useRoute } from 'vue-router'

import Layout from '../components/layout/Layout.vue'

import Loading from '../components/layout/Loading.vue'

import ChannelVideoCard from '../components/channel/ChannelVideoCard.vue'

import {
  getChannel,
  getChannelVideos
} from '../api/invidious'

const route = useRoute()

const loading = ref(true)

const channel = ref<any>(null)

const videos = ref<any[]>([])

const activeTab = ref('videos')

onMounted(async () => {
  try {
    const id = route.params.id as string

    const channelData = await getChannel(id)

    channel.value = {
      ...channelData,

      banner:
        channelData.authorBanners?.[
          channelData.authorBanners.length - 1
        ]?.url ||
        `https://yt3.googleusercontent.com`,

      avatar:
        channelData.authorThumbnails?.[
          channelData.authorThumbnails.length - 1
        ]?.url ||
        `https://yt3.ggpht.com/ytc/default-user=s800-c-k-c0x00ffffff-no-rj`
    }

    const channelVideos = await getChannelVideos(id)

    videos.value = channelVideos.map((video: any) => ({
      ...video,

      description:
        video.description ||
        video.descriptionHtml ||
        '',

      thumbnail:
        video.videoThumbnails?.[
          video.videoThumbnails.length - 1
        ]?.url ||
        `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,

      authorThumbnail:
        channel.value.avatar
    }))
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Layout>

    <Loading v-if="loading" />

    <div
      v-else
      class="max-w-[1600px] mx-auto bg-white min-h-screen"
    >

      <div class="relative h-[240px] bg-gray-200">

        <img
          :src="channel?.banner"
          class="w-full h-full object-cover"
        />

        <!-- チャンネルアイコンをカバーより上に表示 -->
        <div
          class="absolute left-10 bottom-0 translate-y-1/2 z-20"
        >
          <img
            :src="channel?.avatar"
            class="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl bg-white"
          />
        </div>

      </div>

      <div class="px-10 pt-24">

        <div class="flex gap-8">

          <div class="w-40"></div>

          <div class="flex-1">

            <h1 class="text-4xl font-bold text-black">
              {{ channel?.author }}
            </h1>

            <div class="text-gray-500 mt-3">
              @{{ channel?.author }}
            </div>

            <div class="text-gray-500 mt-1">
              {{ channel?.subCount }} subscribers
            </div>

            <div class="mt-4 text-gray-700 whitespace-pre-wrap">
              {{ channel?.description || '' }}
            </div>

            <button
              class="mt-6 bg-black text-white px-6 h-10 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>

          </div>

        </div>

        <!-- タブ -->
        <div
          class="flex items-center gap-10 border-b border-gray-200 mt-12"
        >

          <button
            @click="activeTab = 'videos'"
            class="h-14 text-sm font-semibold border-b-2 transition-colors"
            :class="
              activeTab === 'videos'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            "
          >
            Videos
          </button>

          <button
            @click="activeTab = 'about'"
            class="h-14 text-sm font-semibold border-b-2 transition-colors"
            :class="
              activeTab === 'about'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            "
          >
            About
          </button>

        </div>

        <!-- 動画タブ -->
        <div
          v-if="activeTab === 'videos'"
          class="mt-12 space-y-8 pb-20"
        >

          <ChannelVideoCard
            v-for="video in videos"
            :key="video.videoId"
            :video="video"
          />

        </div>

        <!-- Aboutタブ -->
        <div
          v-if="activeTab === 'about'"
          class="py-10"
        >

          <div class="max-w-3xl">

            <div class="text-2xl font-bold text-black">
              About
            </div>

            <div
              class="mt-6 text-gray-700 whitespace-pre-wrap leading-8"
            >
              {{ channel?.description || 'No description.' }}
            </div>

            <div class="mt-10 space-y-4">

              <div class="text-gray-600">
                <span class="font-semibold text-black">
                  Channel:
                </span>
                {{ channel?.author }}
              </div>

              <div class="text-gray-600">
                <span class="font-semibold text-black">
                  Subscribers:
                </span>
                {{ channel?.subCount }}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </Layout>
</template>
