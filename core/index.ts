import express from 'express'
import dotenv from 'dotenv'
import routes from './src/routes'
import cors from 'cors'
import { json, urlencoded } from 'body-parser'
import path from 'path'

dotenv.config()

const app = express();
app.use(json())
app.use(urlencoded())
app.use(cors())
app.use('/api', routes)
app.use(express.static(path.join(__dirname, '../client/dist')))
app.use('/storage', express.static(path.join(__dirname, 'src/storage')))

const port: number = parseInt(`${process.env.PORT}`) || 3000

app.listen(port, '0.0.0.0', () => {
  console.log(`[server] Servidor iniciado na porta ${port}`)
})