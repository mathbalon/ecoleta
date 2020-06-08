import { Request, Response } from 'express'

import knex from '../database/connection'

class PointsControler {
    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.1.112:3333/uploads/${point.image}`
            }
        })

        return res.json(serializedPoints)
    }

    async show(req: Request, res: Response) {
        const { id } = req.params

        const point = await knex('points').where('id', id).first()

        if (!point) {
            return res.status(400).json({ erro: 'Ponto não encontrado.' })
        }

        const serializedPoints = {
            ...point,
            image_url: `http://192.168.1.112:3333/uploads/${point.image}`
        }

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('items.title')

        return res.json({ point: serializedPoints, items })
    }

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude,
            items
        } = req.body

        const trx = await knex.transaction()

        const point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude
        }

        const insertedIds = await trx('points').insert(point)

        const point_id = insertedIds[0]

        const pointItem = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
            })

        await trx('points_items').insert(pointItem)

        await trx.commit()

        return res.json({
            id: point_id,
            ...point
        })
    }

}

export default PointsControler