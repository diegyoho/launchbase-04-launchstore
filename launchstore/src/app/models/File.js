const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create(data) {
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

        return db.query(query, values)
    },
    async delete(id) {

        try {
            const file = (await db.query(`SELECT * FROM files WHERE id = $1`, [id])).rows[0]

            fs.unlinkSync(file.path)

            return db.query(`
                DELETE FROM files
                WHERE id = $1
            `, [id])
        } catch(err) {
            console.error(err)
        }
    }
}