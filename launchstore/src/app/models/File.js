const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    async create(data) {
        try {
            const query = `
                INSERT INTO files (
                    product_id,
                    name,
                    path
                ) VALUES ($1, $2, $3)
                RETURNING id
            `

            const values = [
                data.product_id,
                data.filename,
                data.path
            ]

            const results = await db.query(query, values)

            return results.rows[0].id
        } catch(err) {
            console.error(err)
        }
    },
    async delete(id) {
        try {
            const file = (await db.query(`SELECT * FROM files WHERE id = $1`, [id])).rows[0]

            fs.unlinkSync(file.path)

            return await db.query(`
                DELETE FROM files
                WHERE id = $1
            `, [id])
        } catch(err) {
            console.error(err)
        }
    }
}