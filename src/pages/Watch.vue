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
    
const expandedDescription = ref(false)    
    
const playlists = ref<any[]>([])    
    
const playlistModal = ref(false)    
const selectedPlaylistId = ref<string | null>(null)
const playlistAlertMessage = ref<string | null>(null)
    
const downloadFormats = computed(() => {    
  return [    
    ...(video.value?.formatStreams || []),    
    ...(video.value?.adaptiveFormats || [])    
  ]    
})    
    
const shortDescription = computed(() => {    
  if (!video.value?.description) return ''    
    
  return expandedDescription.value    
    ? video.value.description    
    : video.value.description.slice(0, 220)    
})    
    
function loadPlaylists() {    
  playlists.value = JSON.parse(    
    localStorage.getItem('playlists') || '[]'    
  )    
}    
    
function addToPlaylist(playlistId: string) {    
  if (!video.value) return    
    
  const playlistsData = JSON.parse(    
    localStorage.getItem('playlists') || '[]'    
  )    
    
  const playlist = playlistsData.find(    
    (p: any) => p.id === playlistId    
  )    
    
  if (!playlist) return    
    
  const exists = playlist.videos.find(    
    (v: any) => v.videoId === video.value.videoId    
  )    
    
  if (exists) {    
    playlistAlertMessage.value = `「${playlist.name}」にはすでに追加されています`    
    return    
  }    
    
  playlist.videos.unshift({    
    videoId: video.value.videoId,    
    title: video.value.title,    
    thumbnail: `https://i.ytimg.com/vi/${video.value.videoId}/hqdefault.jpg`,    
    author: video.value.author    
  })    
    
  localStorage.setItem(    
    'playlists',    
    JSON.stringify(playlistsData)    
  )    
    
  loadPlaylists()    
    
  playlistAlertMessage.value = `「${playlist.name}」に追加しました`    
}    

function handleConfirmPlaylist() {
  if (!selectedPlaylistId.value) return
  addToPlaylist(selectedPlaylistId.value)
}

function closePlaylistModal() {
  playlistModal.value = false
  selectedPlaylistId.value = null
  playlistAlertMessage.value = null
}
    
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
        video.value.authorThumbnails?.[2]?.url ||    
        video.value.authorThumbnails?.[1]?.url ||    
        video.value.authorThumbnails?.[0]?.url ||    
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
    
    const history = JSON.parse(    
      localStorage.getItem('watch-history') || '[]'    
    )    
    
    const newVideo = {    
      videoId: video.value.videoId,    
      title: video.value.title,    
      thumbnail: `https://i.ytimg.com/vi/${video.value.videoId}/hqdefault.jpg`    
    }    
    
    const exists = history.findIndex(    
      (v: any) => v.videoId === video.value.videoId    
    )    
    
    if (exists !== -1) {    
      history.splice(exists, 1)    
    }    
    
    history.unshift(newVideo)    
    
    localStorage.setItem(    
      'watch-history',    
      JSON.stringify(history.slice(0, 100))    
    )    
    
    expandedDescription.value = false    
    
    checkSubscribed()    
    
    loadPlaylists()    
    
    const commentsData = await getComments(id)    
    
    comments.value =    
      commentsData.comments?.map((comment: any) => ({    
        ...comment,    
        authorThumbnail:    
          comment.authorThumbnails?.[1]?.url ||    
          comment.authorThumbnails?.[0]?.url ||    
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
      class="bg-[#f9f9f9] text-black min-h-screen"    
    >    
      <div    
        class="px-6 py-5 max-w-[1800px] mx-auto grid grid-cols-[2fr_0.9fr] gap-8"    
      >    

        <div class="min-w-0">    

          <div class="overflow-hidden rounded-2xl bg-black">    
            <VideoPlayer    
              :key="`${selectedStream}-${video?.videoId}`"    
              :id="video?.videoId"    
              :stream="selectedStream"    
              :format-streams="video?.formatStreams"    
            />    
          </div>    

          <div class="mt-4 flex items-center gap-3">    
            <div class="font-semibold text-sm text-zinc-500">    
              プレイヤー    
            </div>    

            <select    
              v-model="selectedStream"    
              class="border border-zinc-200 rounded-full px-4 h-10 bg-white text-sm outline-none hover:border-zinc-400 transition"    
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

          <h1 class="text-[1.35rem] font-bold mt-4 leading-snug">    
            {{ video?.title }}    
          </h1>    

          <div class="flex items-center justify-between mt-5 flex-wrap gap-4">    

            <RouterLink    
              :to="`/channel/${video?.authorId}`"    
              class="flex items-center gap-4"    
            >    

              <img    
                :src="video?.authorThumbnails?.[2]?.url"    
                class="w-11 h-11 rounded-full object-cover"    
              >    

              <div>    
                <div class="font-semibold text-[15px] leading-none">    
                  {{ video?.author }}    
                </div>    

                <div class="text-sm text-zinc-500 mt-1">    
                  {{ video?.subCountText || 'YouTube Channel' }}    
                </div>    
              </div>    

            </RouterLink>    

            <div class="flex items-center gap-2 flex-wrap">    

              <button    
                class="bg-zinc-100 hover:bg-zinc-200 transition px-5 h-10 rounded-full font-semibold flex items-center gap-2 text-sm"    
              >    
                👍    
                <span>    
                  {{    
                    video?.likeCount    
                      ? Intl.NumberFormat().format(video.likeCount)    
                      : '0'    
                  }}    
                </span>    
              </button>    

              <button    
                class="bg-zinc-100 hover:bg-zinc-200 transition px-5 h-10 rounded-full font-semibold text-sm"    
                @click="shareVideo"    
              >    
                共有    
              </button>    

              <button    
                :class="    
                  subscribed    
                    ? 'bg-zinc-200 text-black hover:bg-zinc-300'    
                    : 'bg-black text-white hover:bg-zinc-800'    
                "    
                class="transition px-5 h-10 rounded-full font-semibold text-sm"    
                @click="toggleSubscribe"    
              >    
                {{ subscribed ? '登録済み' : '登録' }}    
              </button>    

              <button    
                class="bg-zinc-100 hover:bg-zinc-200 transition px-5 h-10 rounded-full font-semibold text-sm"    
                @click="playlistModal = true"    
              >    
                プレイリストに追加    
              </button>    

              <button    
                class="bg-black text-white hover:bg-zinc-800 transition px-5 h-10 rounded-full font-semibold text-sm"    
                @click="downloadModal = true"    
              >    
                ダウンロード    
              </button>    

            </div>    
          </div>    

          <div    
            class="bg-zinc-100 rounded-2xl p-5 mt-6 border border-zinc-200"    
          >    
            <div class="font-semibold text-sm">    
              {{    
                Intl.NumberFormat().format(video?.viewCount || 0)    
              }}    
              回視聴    
            </div>    

            <div class="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">    
              {{    
                shortDescription    
              }}    

              <span    
                v-if="    
                  video?.description &&    
                  video.description.length > 220    
                "    
              >    
                {{ expandedDescription ? '' : '...' }}    
              </span>    
            </div>    

            <button    
              v-if="    
                video?.description &&    
                video.description.length > 220    
              "    
              class="mt-4 font-semibold hover:underline text-sm"    
              @click="    
                expandedDescription =    
                  !expandedDescription    
              "    
            >    
              {{    
                expandedDescription    
                  ? '一部表示'    
                  : 'もっとみる'    
              }}    
            </button>    
          </div>    

          <div class="mt-10">    

            <h2 class="text-xl font-bold mb-7">    
              コメント    
              ({{ comments.length }})    
            </h2>    

            <div    
              v-for="comment in comments"    
              :key="comment.commentId"    
              class="flex gap-4 mb-8"    
            >    

              <img    
                :src="comment.authorThumbnail"    
                class="w-10 h-10 rounded-full object-cover shrink-0"    
              >    

              <div class="flex-1">    

                <div class="flex items-center gap-2 flex-wrap">    
                  <div class="font-semibold text-sm">    
                    {{ comment.author }}    
                  </div>    

                  <div class="text-xs text-zinc-500">    
                    {{ comment.publishedText }}    
                  </div>    
                </div>    

                <div class="mt-2 text-[15px] text-zinc-700 whitespace-pre-wrap leading-7">    
                  {{ comment.content }}    
                </div>    

                <div class="mt-3 text-sm text-zinc-500 flex items-center gap-5">    

                  <div class="flex items-center gap-1">    
                    👍    
                    {{    
                      comment.likeCount    
                        ? Intl.NumberFormat().format(comment.likeCount)    
                        : 0    
                    }}    
                  </div>    

                  <button class="hover:text-black transition">    
                    返信    
                  </button>    

                </div>    
              </div>    
            </div>    
          </div>    
        </div>    

        <div class="min-w-0">    

          <div class="space-y-3">    

            <RouterLink    
              v-for="related in relatedVideos"    
              :key="related.videoId"    
              :to="`/watch/${related.videoId}`"    
              class="flex gap-3 group"    
            >    

              <img    
                :src="related.thumbnail"    
                class="w-[120px] xl:w-[160px] aspect-video object-cover rounded-xl shrink-0"    
              >    

              <div class="flex-1 min-w-0 pt-1">    

                <div    
                  class="font-semibold text-[14px] leading-5 line-clamp-2 group-hover:text-zinc-700 transition"    
                >    
                  {{ related.title }}    
                </div>    

                <div class="text-sm text-zinc-500 mt-2">    
                  {{ related.author }}    
                </div>    

                <div class="text-sm text-zinc-500 mt-1">    
                  {{    
                    Intl.NumberFormat().format(    
                      related.viewCount || 0    
                    )    
                  }}    
                  回視聴    
                </div>    

                <div class="text-sm text-zinc-500 mt-1">    
                  {{ related.publishedText }}    
                </div>    

              </div>    

            </RouterLink>    

          </div>    

        </div>    

      </div>    

      <div    
        v-if="playlistModal"    
        class="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center px-5"    
        @click.self="closePlaylistModal"    
      >    
        <div    
          class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"    
        >    

          <div class="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">    
            <div class="text-lg font-bold">    
              プレイリストに追加    
            </div>    

            <button    
              class="w-9 h-9 rounded-full hover:bg-zinc-100 transition text-lg"    
              @click="closePlaylistModal"    
            >    
              ✕    
            </button>    
          </div>    

          <div v-if="!playlistAlertMessage" class="max-h-[420px] overflow-y-auto p-3">    

            <button    
              v-for="playlist in playlists"    
              :key="playlist.id"    
              :class="selectedPlaylistId === playlist.id ? 'bg-zinc-100 ring-2 ring-black/5' : 'hover:bg-zinc-100'"
              class="w-full flex items-center gap-4 rounded-2xl px-4 py-3 transition text-left"    
              @click="selectedPlaylistId = playlist.id"    
            >    

              <div    
                class="w-14 h-14 rounded-xl flex items-center justify-center text-xl shrink-0"    
                :class="selectedPlaylistId === playlist.id ? 'bg-black text-white' : 'bg-zinc-200'"
              >    
                ▶    
              </div>    

              <div class="min-w-0 flex-1">    
                <div class="font-semibold truncate">    
                  {{ playlist.name }}    
                </div>    

                <div class="text-sm text-zinc-500 mt-1">    
                  {{ playlist.videos?.length || 0 }} 本の動画    
                </div>    
              </div>    

              <div v-if="selectedPlaylistId === playlist.id" class="text-black text-lg font-bold pr-2">
                ✓
              </div>
            </button>    

            <div    
              v-if="!playlists.length"    
              class="text-center text-zinc-500 py-16"    
            >    
              プレイリストがありません    
            </div>    

          </div>    

          <div v-else class="py-16 px-6 text-center">
            <div class="text-4xl mb-4">✨</div>
            <div class="font-semibold text-zinc-800 leading-relaxed">
              {{ playlistAlertMessage }}
            </div>
          </div>

          <div class="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
            <button
              class="px-4 h-10 rounded-full font-semibold text-sm bg-zinc-200 hover:bg-zinc-300 transition"
              @click="closePlaylistModal"
            >
              {{ playlistAlertMessage ? '閉じる' : 'キャンセル' }}
            </button>
            
            <button
              v-if="!playlistAlertMessage"
              :disabled="!selectedPlaylistId"
              class="px-5 h-10 rounded-full font-semibold text-sm transition"
              :class="selectedPlaylistId ? 'bg-black text-white hover:bg-zinc-800' : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'"
              @click="handleConfirmPlaylist"
            >
              決定
            </button>
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
