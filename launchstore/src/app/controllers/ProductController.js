const { formatPrice, date } = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    async create(req, res) {
        try {
            const results = await Category.all()
            const categories = results.rows

            return res.render('products/create', { categories })
        } catch(err) {
            console.log(err)
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (const key of keys) {
                if (req.body[key] === "")
                    return res.send('Please, fill all fields!')
            }

            // if (req.files.length === 0) {
            //     return res.send('Please, send at least 1 photo!')
            // }

            const results = await Product.create(req.body)
            const productId = results.rows[0].id

            const filesPromise = req.files.map(file => File.create({...file, product_id: productId}))
            await Promise.all(filesPromise)

            return res.redirect(`/products/${productId}`)
        } catch(err) {
            console.log(err)
        }
    },
    async show(req, res) {
        try {
            let results = await Product.find(req.params.id)
            const product = results.rows[0]

            if (!product)
                res.send('Product not found!')

            const { day, month, hours, minutes } = date(product.updated_at)

            product.published = {
                day: `${day}/${month}`,
                hour: `${hours}h${minutes}`
            }

            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            results = await Product.files(product.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('products/show', { product, files })
        } catch(err) {
            console.log(err)
        }
    },
    async edit(req, res) {
        try {
            let results = await Product.find(req.params.id)
            const product = results.rows[0]

            if (!product)
                res.send('Product not found!')

            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            results = await Category.all()
            const categories = results.rows

            results = await Product.files(product.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('products/edit', { product, categories, files })
        } catch(err) {
            console.log(err)
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (const key of keys) {
                if (req.body[key] === "")
                    return res.send('Please, fill all fields!')
            }

            if (req.body.removed_files) {
                // const dbFiles = (await Product.files(req.body.id)).rows.length
                // const rmFiles = req.body.removed_files.length
                
                // if (req.files.length === 0 && dbFiles <= rmFiles) {
                //     return res.send('Please, send at least 1 photo!')
                // }

                const removedFilesPromise = req.body.removed_files.map(id => File.delete(id))

                await Promise.all(removedFilesPromise)
            }

            req.body.price = req.body.price.replace(/\D/g, '')
            req.body.old_price = req.body.old_price.replace(/\D/g, '')
            
            if (req.body.old_price != req.body.price) {
                const oldProduct = await Product.find(req.body.id)
                req.body.old_price = oldProduct.rows[0].price
            }

            await Product.update(req.body)

            const filesPromise = req.files.map(file => File.create({...file, product_id: req.body.id}))
            await Promise.all(filesPromise)

            return res.redirect(`/products/${req.body.id}`)
        } catch(err) {
            console.log(err)
        }
    },
    async delete(req, res) {
        try {
            await Product.delete(req.body.id)

            return res.redirect(`/products/create`)
        } catch(err) {
            console.log(err)
        }
    }
}