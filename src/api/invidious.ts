import axios, { AxiosError } from 'axios'

function getEndpointMode() {
  return (
    localStorage.getItem('endpoint_mode') ||
    'default'
  )
}

function getCustomEndpoint() {
  return (
    localStorage.getItem('custom_endpoint') ||
    ''
  )
}

async function request(path: string) {
  const cleanPath = path.startsWith('/')
    ? path
    : `/${path}`

  try {
    const res = await axios.get(
      '/api/proxy',
      {
        params: {
          path: cleanPath,
          endpointMode: getEndpointMode(),
          customEndpoint: getCustomEndpoint()
        },

        timeout: 10000
      }
    )

    return res.data
  } catch (e) {
    const error = e as AxiosError

    console.warn(
      `Proxy failed: ${cleanPath} | Reason: ${error.message}`
    )

    throw error
  }
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
  return request(`/api/v1/channels/${channelId}/videos`)
}

export async function getPlaylist(playlistId: string) {
  return request(`/api/v1/playlists/${playlistId}`)
}
