import bcrypt from 'bcrypt' 
const { hash } = bcrypt 
import express from 'express' 
const router = express.Router()
import { Startup, User } from '../models/index.js'

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Startup,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const { username, password, name } = req.body

    const saltRounds = 10
    const passwordHash = await hash(password, saltRounds)

    const newUser = {
      username: username,
      passwordHash: passwordHash, 
      name: name
    }
    
    const user = await User.create(newUser)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Startup,
        attributes: { exclude: ['userId'] }
      }
    })
    if (user) {
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.delete('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
      await user.destroy()
  }
  res.status(204).end()
})

export default router 