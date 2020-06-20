import express from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import { celebrate, Joi } from 'celebrate'

import ItemsControler from './controllers/ItemsController'
import PointsControler from './controllers/PointsController'


const router = express.Router()
const upload = multer(multerConfig)

const itemsController = new ItemsControler
const pointsController = new PointsControler

router.get('/items', itemsController.index)

router.get('/points', pointsController.index)
router.get('/points/:id', pointsController.show)
router.post(
  '/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      uf: Joi.string().required().max(2),
      city: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      items: Joi.string().required()
    })
  }, {
    abortEarly: false
  }),
  pointsController.create
)

export default router