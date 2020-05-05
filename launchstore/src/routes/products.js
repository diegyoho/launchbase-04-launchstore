const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const { onlyAuthenticated } = require('../app/middlewares/session')

const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')

routes.get('/search', SearchController.index)
routes.get('/create', onlyAuthenticated, ProductController.create)
routes.get('/:id', ProductController.show)
routes.post('/', onlyAuthenticated, multer.array('photos', 6), ProductController.post)
routes.get('/:id/edit', onlyAuthenticated, ProductController.edit)
routes.put('/', onlyAuthenticated, multer.array('photos', 6), ProductController.put)
routes.delete('/', onlyAuthenticated, ProductController.delete)

module.exports = routes