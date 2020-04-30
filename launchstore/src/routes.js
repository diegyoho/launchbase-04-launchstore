const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const ProductController = require('./app/controllers/ProductController')
const HomeController = require('./app/controllers/HomeController')
const SearchController = require('./app/controllers/SearchController')

routes.get('/', HomeController.index)

routes.get('/products/search', SearchController.index)
routes.get('/products/create', ProductController.create)
routes.get('/products/:id', ProductController.show)
routes.post('/products', multer.array('photos', 6), ProductController.post)
routes.get('/products/:id/edit', ProductController.edit)
routes.put('/products', multer.array('photos', 6), ProductController.put)
routes.delete('/products', ProductController.delete)

// ALIAS
routes.get('/ads/create', (req, res) => res.redirect('/products/create'))

module.exports = routes