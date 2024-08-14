import jwt from 'jsonwebtoken'
const { sign } = jwt
import { compare } from 'bcrypt'
import express from 'express'
const router = express.Router()

import { SECRET } from '../util/config.js'
import User from '../models/user.js'

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = user === null
    ? false
    : await compare(body.password, user.passwordHash)

  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user.id })
})

export default router