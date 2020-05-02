const { formatPrice, date } = require('../../lib/utils')

const Product = require('../models/Product')

module.exports = {
    async index(req, res) {
        try {
            let result,
                params = {}

            const { filter, category} = req.query

            if (!filter) return res.redirect('/')

            params.filter = filter

            if (category)
                params.category = category

            let products = (await Product.search(params)).rows

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
            })

            products = await Promise.all(productsPromise)

            const search = {
                term: filter,
                total: products.length
            }

            const categories = products.map(product => ({
                id: product.category_id,
                name: product.category_name
            })).reduce((categoriesFiltered, category) => {
                const found = categoriesFiltered.some(c => c.id === category.id)

                if(!found)
                    categoriesFiltered.push(category)

                return categoriesFiltered
            }, [])

            return res.render('search/index', { products, search, categories })
        } catch(err) {
            console.error(err)
        }
    }
}