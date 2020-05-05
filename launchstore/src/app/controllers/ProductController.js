const { formatPrice, date } = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    async create(req, res) {
        try {
            const categories = await Category.all()

            return res.render('products/create', { categories })
        } catch(err) {
            console.error(err)
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (const key of keys) {
                if (req.body[key] === "")
                    return res.send('Please, fill all fields!')
            }

            req.body.user_id = req.session.userId

            const productId = await Product.create(req.body)

            const filesPromise = req.files.map(async file => await File.create({...file, product_id: productId}))
            await Promise.all(filesPromise)

            return res.redirect(`/products/${productId}`)
        } catch(err) {
            console.error(err)
        }
    },
    async show(req, res) {
        try {
            const product = await Product.find(req.params.id)

            if (!product)
                res.send('Product not found!')

            const { day, month, hours, minutes } = date(product.updated_at)

            product.published = {
                day: `${day}/${month}`,
                hour: `${hours}h${minutes}`
            }

            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            let files = await Product.files(product.id)
            
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('products/show', { product, files })
        } catch(err) {
            console.error(err)
        }
    },
    async edit(req, res) {
        try {
            const product = await Product.find(req.params.id)

            if (!product)
                res.send('Product not found!')

            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            const categories = await Category.all()

            let files = await Product.files(product.id)
            
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            return res.render('products/edit', { product, categories, files })
        } catch(err) {
            console.error(err)
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
                const removedFilesPromise = req.body.removed_files.map(async id => await File.delete(id))

                await Promise.all(removedFilesPromise)
            }

            req.body.price = req.body.price.replace(/\D/g, '')
            req.body.old_price = req.body.old_price.replace(/\D/g, '')
            
            if (req.body.old_price != req.body.price) {
                const oldProduct = await Product.find(req.body.id)
                req.body.old_price = oldProduct.price
            }

            await Product.update(req.body)

            const filesPromise = req.files.map(async file => await File.create({...file, product_id: req.body.id}))
            await Promise.all(filesPromise)

            return res.redirect(`/products/${req.body.id}`)
        } catch(err) {
            console.error(err)
        }
    },
    async delete(req, res) {
        try {
            const files = await Product.files(req.body.id)

            const filesPromise = files.map(async file => await File.delete(file.id))

            await Promise.all(filesPromise)

            await Product.delete(req.body.id)

            return res.redirect(`/products/create`)
        } catch(err) {
            console.error(err)
        }
    }
}