// api/invidious.ts
import axios, { AxiosError } from 'axios'

const defaultInstances = [
  'https://script.google.com/macros/s/AKfycbxi9iAARiDYyZPoTqy-1p3h-e7W1x7Ct1epdCtmga8UHLptrnz_77adiqbVCcLnKYLG/exec'
]

function getInstances() {
  const customEndpoint =
    localStorage.getItem('custom_endpoint')

  const endpointMode =
    localStorage.getItem('endpoint_mode') || 'default'

  if (
    endpointMode === 'custom' &&
    customEndpoint
  ) {
    return [customEndpoint]
  }

  if (
    endpointMode === 'rotation' &&
    customEndpoint
  ) {
    return [
      ...defaultInstances,
      customEndpoint
    ]
  }

  return defaultInstances
}

async function request(path: string) {
  const cleanPath = path.startsWith('/')
    ? path
    : `/${path}`

  const instances = getInstances()

  for (const instance of instances) {
    try {
      const targetUrl = new URL(instance)
      const isSubQuery = cleanPath.includes('?')

      if (isSubQuery) {
        const [apiPath, searchParams] = cleanPath.split('?')

        targetUrl.searchParams.set('path', apiPath)

        const params = new URLSearchParams(searchParams)

        params.forEach((value, key) => {
          targetUrl.searchParams.set(key, value)
        })
      } else {
        targetUrl.searchParams.set('path', cleanPath)
      }

      const res = await axios.get(
        targetUrl.toString(),
        {
          timeout: 5000
        }
      )

      return res.data
    } catch (e) {
      const error = e as AxiosError

      console.warn(
        `Instance failed: ${instance}${cleanPath} | Reason: ${error.message}`
      )
    }
  }

  throw new Error('All instances failed to respond.')
}

export async function searchVideos(query: string) {
  return request(
    `/api/v1/search?q=${encodeURIComponent(query)}&type=video`
  )
}

export async function trendingVideos() {
  return request('/api/v1/trending')
}

export async function getVideo(id: string) {
  return request(`/api/v1/videos/${id}`)
}

export async function getComments(id: string) {
  return request(`/api/v1/comments/${id}`)
}

export async function getPopularVideos() {
  return request('/api/v1/popular')
}

export async function getChannel(channelId: string) {
  return request(`/api/v1/channels/${channelId}`)
}

export async function getChannelVideos(channelId: string) {
  return request(`/api/v1/channels/videos/${channelId}`)
}

export async function getPlaylist(playlistId: string) {
  return request(`/api/v1/playlists/${playlistId}`)
}
