import express from 'express'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000

const defaultInstances = [
  'https://inv.nadeko.net',
  'https://invidious.f5.si',
  'https://invidious.ritoge.com',
  'https://invidious.ducks.party',
  'https://super8.absturztau.be',
  'https://invidious.darkness.services',
  'https://yt.omada.cafe',
  'https://iv.melmac.space',
  'https://iv.duti.dev'
]

const axiosInstance = axios.create({
  timeout: 6000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
})

const cache = new Map()

const CACHE_TTL = 1000 * 30

app.use(express.json())

app.use(
  express.static(
    path.join(__dirname, '../dist'),
    {
      maxAge: '1h',
      etag: true
    }
  )
)

function isValidResponse(data) {
  if (!data) {
    return false
  }

  if (
    typeof data === 'string' &&
    (
      data.includes('<html') ||
      data.includes('<!DOCTYPE')
    )
  ) {
    return false
  }

  if (
    typeof data === 'object' &&
    data.error
  ) {
    return false
  }

  return true
}

async function request(instance, pathName) {
  const url = `${instance}${pathName}`

  const res = await axiosInstance.get(url)

  if (!isValidResponse(res.data)) {
    throw new Error('Invalid response')
  }

  return res.data
}

async function fetchFromInstances(
  instances,
  apiPath
) {
  return new Promise((resolve, reject) => {
    let finished = false

    let failedCount = 0

    for (const instance of instances) {
      request(instance, apiPath)
        .then((data) => {
          if (finished) {
            return
          }

          finished = true

          resolve(data)
        })
        .catch(() => {
          failedCount++

          console.log(
            `failed: ${instance}${apiPath}`
          )

          if (
            failedCount === instances.length
          ) {
            reject(
              new Error(
                'All instances failed'
              )
            )
          }
        })
    }
  })
}

app.get('/api/proxy', async (req, res) => {
  try {
    const apiPath = req.query.path

    if (!apiPath) {
      return res.status(400).json({
        error: 'Missing path'
      })
    }

    const cacheKey = JSON.stringify(req.query)

    const cached = cache.get(cacheKey)

    if (
      cached &&
      Date.now() - cached.time < CACHE_TTL
    ) {
      return res.json(cached.data)
    }

    const customEndpoint =
      req.query.customEndpoint

    const endpointMode =
      req.query.endpointMode || 'default'

    let instances = [...defaultInstances]

    if (
      endpointMode === 'custom' &&
      customEndpoint
    ) {
      instances = [customEndpoint]
    }

    if (
      endpointMode === 'rotation' &&
      customEndpoint
    ) {
      instances = [
        ...defaultInstances,
        customEndpoint
      ]
    }

    const data =
      await fetchFromInstances(
        instances,
        apiPath
      )

    if (!isValidResponse(data)) {
      return res.status(500).json({
        error: 'Invalid API response'
      })
    }

    cache.set(cacheKey, {
      data,
      time: Date.now()
    })

    res.setHeader(
      'Cache-Control',
      'public, max-age=30'
    )

    return res.json(data)
  } catch (e) {
    return res.status(500).json({
      error: 'Internal server error'
    })
  }
})

app.get('*', (_, res) => {
  res.sendFile(
    path.join(__dirname, '../dist/index.html')
  )
})

app.listen(PORT, () => {
  console.log(
    `Server started on ${PORT}`
  )
})
