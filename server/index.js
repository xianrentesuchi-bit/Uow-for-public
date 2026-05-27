import express from 'express'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import https from 'https'

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
  timeout: 10000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true })
})

app.use(express.json())

app.use(
  express.static(
    path.join(__dirname, '../dist')
  )
)

function request(instance, pathName) {
  const url = `${instance}${pathName}`

  return axiosInstance.get(url).then(res => res.data)
}

app.get('/api/proxy', async (req, res) => {
  try {
    const apiPath = req.query.path

    if (!apiPath) {
      return res.status(400).json({
        error: 'Missing path'
      })
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

    for (const instance of instances) {
      try {
        const data = await request(
          instance,
          apiPath
        )

        return res.json(data)
      } catch (e) {
        console.log(
          `failed: ${instance}${apiPath}`
        )
      }
    }

    res.status(500).json({
      error: 'All instances failed'
    })
  } catch (e) {
    res.status(500).json({
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
