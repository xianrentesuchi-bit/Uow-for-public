<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

import Layout from '../components/layout/Layout.vue'
import VideoPlayer from '../components/video/VideoPlayer.vue'
import Loading from '../components/layout/Loading.vue'
import Download from '../components/layout/Download.vue'

import {
  getComments,
  getVideo,
  searchVideos
} from '../api/invidious'

const route = useRoute()

const video = ref<any>(null)
const comments = ref<any[]>([])
const relatedVideos = ref<any[]>([])
const loading = ref(true)

const selectedStream = ref('youtube-nocookie')

const downloadModal = ref(false)

const subscribed = ref(false)

const downloadFormats = computed(() => {
  return [
    ...(video.value?.formatStreams || []),
    ...(video.value?.adaptiveFormats || [])
  ]
})

function checkSubscribed() {
  if (!video.value) return

  const subscribers = JSON.parse(
    localStorage.getItem('subscribers') || '[]'
  )

  subscribed.value = subscribers.some(
    (channel: any) => channel.authorId === video.value.authorId
  )
}

function toggleSubscribe() {
  if (!video.value) return

  const subscribers = JSON.parse(
    localStorage.getItem('subscribers') || '[]'
  )

  const exists = subscribers.findIndex(
    (channel: any) => channel.authorId === video.value.authorId
  )

  if (exists !== -1) {
    subscribers.splice(exists, 1)

    subscribed.value = false
  } else {
    subscribers.push({
      authorId: video.value.authorId,
      author: video.value.author,
      authorThumbnail:
        video.value.authorThumbnails?.?.url ||
        video.value.authorThumbnails?.?.url ||
        video.value.authorThumbnails?.?.url ||
        '',
      subCountText: video.value.subCountText || ''
    })

    subscribed.value = true
  }

  localStorage.setItem(
    'subscribers',
    JSON.stringify(subscribers)
  )
}

async function shareVideo() {
  if (!video.value) return

  const shareUrl = `${window.location.origin}/watch/${video.value.videoId}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: video.value.title,
        text: video.value.title,
        url: shareUrl
      })
    } catch (error) {
      console.log(error)
    }
  } else {
    await navigator.clipboard.writeText(shareUrl)

    alert('リンクをコピーしました')
  }
}

async function loadVideo() {
  loading.value = true

  try {
    const id = route.params.id as string

    video.value = await getVideo(id)

    checkSubscribed()

    const commentsData = await getComments(id)

    comments.value =
      commentsData.comments?.map((comment: any) => ({
        ...comment,
        authorThumbnail:
          comment.authorThumbnails?.?.url ||
          comment.authorThumbnails?.?.url ||
          `https://yt3.ggpht.com/ytc/default-user=s88-c-k-c0x00ffffff-no-rj`
      })) || []

    const related = await searchVideos(video.value.title)

    relatedVideos.value = related
      .filter((v: any) => v.videoId !== id)
      .slice(0, 20)
      .map((v: any) => ({
        ...v,
        thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
      }))
  } finally {
    loading.value = false
  }
}

onMounted(loadVideo)

watch(
  () => route.params.id,
  async () => {
    await loadVideo()
  }
)
</script>

<template>
  <Layout>
    <Loading v-if="loading" />

    <div
      v-else
      class="bg-white text-neutral-900 min-h-screen font-sans antialiased"
    >
      <div
        class="pt-6 px-6 max-w-[1754px] mx-auto grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-x-6 gap-y-8"
      >

        <div class="min-w-0">

          <div class="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-sm">
            <VideoPlayer
              :key="`${selectedStream}-${video?.videoId}`"
              :id="video?.videoId"
              :stream="selectedStream"
              :format-streams="video?.formatStreams"
            />
          </div>

          <div class="mt-3 flex items-center gap-3 bg-neutral-50 p-2 rounded-xl border border-neutral-100">
            <div class="font-medium text-xs text-neutral-500 pl-2">
              ソース切替:
            </div>

            <select
              v-model="selectedStream"
              class="border border-neutral-300 rounded-lg px-3 h-8 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer text-neutral-700"
            >
              <option value="youtube-nocookie">
                youtube-nocookie.com
              </option>

              <option value="youtube">
                youtube.com
              </option>

              <option value="stream">
                Invidious Stream
              </option>
            </select>
          </div>

          <h1 class="text-xl font-bold mt-3 tracking-tight text-neutral-900 leading-7 lg:text-2xl">
            {{ video?.title }}
          </h1>

          <div class="flex flex-col md:flex-row md:items-center md:justify-between mt-3 pb-4 border-b border-neutral-100 gap-4">

            <div class="flex items-center gap-3">
              <RouterLink
                :to="`/channel/${video?.authorId}`"
                class="flex items-center gap-3 shrink-0 group"
              >
                <img
                  :src="video?.authorThumbnails?.?.url"
                  class="w-10 h-10 rounded-full object-cover border border-neutral-100"
                >

                <div class="flex flex-col min-w-0">
                  <div class="font-bold text-[15px] text-neutral-900 group-hover:text-neutral-700 truncate leading-5">
                    {{ video?.author }}
                  </div>

                  <div class="text-xs text-neutral-500 truncate mt-0.5">
                    {{ video?.subCountText || 'YouTube Channel' }}
                  </div>
                </div>
              </RouterLink>

              <button
                :class="
                  subscribed
                    ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                "
                class="transition px-4 h-9 rounded-full font-medium text-sm ml-3 shrink-0"
                @click="toggleSubscribe"
              >
                {{ subscribed ? '登録済み' : 'チャンネル登録' }}
              </button>
            </div>

            <div class="flex items-center gap-2 flex-wrap sm:justify-end">

              <button
                class="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition px-4 h-9 rounded-full font-medium text-sm flex items-center gap-2"
              >
                <span class="text-base leading-none">👍</span>
                <span>
                  {{
                    video?.likeCount
                      ? Intl.NumberFormat().format(video.likeCount)
                      : '0'
                  }}
                </span>
              </button>

              <button
                class="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition px-4 h-9 rounded-full font-medium text-sm flex items-center gap-1.5"
                @click="shareVideo"
              >
                <span class="text-base leading-none">↗</span>
                <span>共有</span>
              </button>

              <button
                class="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition px-4 h-9 rounded-full font-medium text-sm flex items-center gap-1.5"
                @click="downloadModal = true"
              >
                <span class="text-base leading-none">↓</span>
                <span>オフライン</span>
              </button>

            </div>
          </div>

          <div
            class="bg-neutral-100 hover:bg-neutral-150 transition-colors duration-200 rounded-xl p-3 mt-4 text-sm"
          >
            <div class="font-bold text-neutral-900">
              {{
                Intl.NumberFormat().format(video?.viewCount || 0)
              }}
              回視聴
            </div>

            <div class="mt-2 whitespace-pre-wrap text-neutral-800 leading-relaxed font-normal">
              {{ video?.description }}
            </div>
          </div>

          <div class="mt-6">

            <h2 class="text-lg font-bold mb-6 text-neutral-900 flex items-center gap-2">
              <span>コメント</span>
              <span class="text-neutral-500 font-normal text-sm">
                {{ comments.length }} 件
              </span>
            </h2>

            <div
              v-for="comment in comments"
              :key="comment.commentId"
              class="flex gap-4 mb-6 text-sm"
            >

              <img
                :src="comment.authorThumbnail"
                class="w-10 h-10 rounded-full object-cover shrink-0"
              >

              <div class="flex-1 min-w-0">

                <div class="flex items-baseline gap-2 flex-wrap">
                  <div class="font-bold text-[13px] text-neutral-900 truncate">
                    {{ comment.author }}
                  </div>

                  <div class="text-xs text-neutral-500">
                    {{ comment.publishedText }}
                  </div>
                </div>

                <div class="mt-1 text-[14px] text-neutral-900 whitespace-pre-wrap leading-5">
                  {{ comment.content }}
                </div>

                <div class="mt-2 text-xs text-neutral-500 flex items-center gap-4">

                  <div class="flex items-center gap-1 hover:text-neutral-700 cursor-pointer p-1 -m-1 rounded">
                    <span>👍</span>
                    <span>
                      {{
                        comment.likeCount
                          ? Intl.NumberFormat().format(comment.likeCount)
                          : 0
                      }}
                    </span>
                  </div>

                  <button class="hover:bg-neutral-100 px-2 py-1 rounded-full font-medium text-neutral-900 transition">
                    返信
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full">

          <div class="space-y-3">

            <RouterLink
              v-for="related in relatedVideos"
              :key="related.videoId"
              :to="`/watch/${related.videoId}`"
              class="flex gap-2 group cursor-pointer"
            >

              <div class="w-40 sm:w-41 aspect-video object-cover rounded-lg overflow-hidden bg-neutral-100 shrink-0 relative">
                <img
                  :src="related.thumbnail"
                  class="w-full h-full object-cover group-hover:scale-[1.02] transition duration-200"
                >
              </div>

              <div class="flex-1 min-w-0 pr-1">

                <div
                  class="font-bold text-[14px] text-neutral-900 leading-5 line-clamp-2 group-hover:text-neutral-800 tracking-tight"
                >
                  {{ related.title }}
                </div>

                <div class="text-[12px] text-neutral-600 mt-1 truncate hover:text-neutral-900 transition-colors">
                  {{ related.author }}
                </div>

                <div class="text-[12px] text-neutral-500 mt-0.5 flex flex-wrap items-center gap-x-1.5 leading-none">
                  <span>
                    {{
                      Intl.NumberFormat().format(
                        related.viewCount || 0
                      )
                    }}
                    回視聴
                  </span>
                  <span class="before:content-['•'] before:mr-1.5">
                    {{ related.publishedText }}
                  </span>
                </div>

              </div>

            </RouterLink>

          </div>

        </div>

      </div>

      <Download
        :open="downloadModal"
        :formats="downloadFormats"
        @close="downloadModal = false"
      />
    </div>
  </Layout>
</template>
