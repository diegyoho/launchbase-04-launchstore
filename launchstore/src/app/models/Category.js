const db = require('../../config/db')

module.exports = {
    async all() {
        try {
            const results = await db.query(`
                SELECT * FROM categories
            `)

            return results.rows
        } catch(err) {
            console.error(err)
        }
    }
}