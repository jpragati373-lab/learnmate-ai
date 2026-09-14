import 'dotenv/config'
import { createApp } from './app.js'

const port = Number(process.env.PORT ?? 4000)
const app = createApp()

app.listen(port, '0.0.0.0', () => {
  console.log(`LearnMate API listening on port ${port}`)
})