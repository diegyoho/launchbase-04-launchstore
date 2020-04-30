const { formatPrice, date } = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
            const products = (await Product.all()).rows

            if (!products)
                res.send('Products not found!')

            async function getImage(productId) {
                const files = (await Product.files(productId)).rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)

                return files[0]
            }

            const productsPromise = products.map(async product => {
                product.image = await getImage(product.id)
                product.old_price = formatPrice(product.old_price)
                product.price = formatPrice(product.price)

                return product
            }).filter((product, index) => index > 2 ? false : true)

            const lastAdded = await Promise.all(productsPromise)

            return res.render('home/index', { products: lastAdded })
        } catch(err) {
            console.log(err)
        }
    }
}