import express from 'express';
const router = express.Router();

import { SECRET } from '../util/config.js';
import { Startup, User } from '../models/index.js';

import jwt from 'jsonwebtoken';
const { verify } = jwt;

const startupFinder = async (req, res, next) => {
    req.startup = await Startup.findByPk(req.params.id)
    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.decodedToken = verify(authorization.substring(7), SECRET)
      } catch (error) {
        console.error(error) 
        return res.status(401).json({ error: 'token invalid' })
      }
    }  else {
      return res.status(401).json({ error: 'token missing' })
    }

    next()
}

router.get('/', async (req, res) => {
    const startups = await Startup.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        }
    })
    res.json(startups)
})

router.post('/', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const startup = await Startup.create({...req.body, userId: user.id, date: new Date()})
        return res.json(startup)
    } catch(error) {
        return res.status(400).json({ error })
    }
})

router.get('/:id', startupFinder, async (req, res) => {
    const startup = await Startup.findByPk(req.params.id)
    if (startup) {
        res.json(startup)
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', startupFinder, async (req, res) => {
    const startup = await Startup.findByPk(req.params.id)
    if (startup) {
        await startup.destroy()
    }
    res.status(204).end()
})

export default router 