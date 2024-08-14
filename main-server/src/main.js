import express from 'express'
import cors from 'cors'
import { PORT } from './util/config.js'
import { connectToDatabase } from './util/db.js'
import startupsRouter from './controllers/startups.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import ragRouter from './controllers/rag.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/startups', startupsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/rag', ragRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app

start()

