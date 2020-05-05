const express = require('express')
const routes = express.Router()
const products = require('./products')
const users = require('./users')

const HomeController = require('../app/controllers/HomeController')

routes.use('/users', users)

routes.get('/', HomeController.index)

routes.use('/products', products)

// ALIAS
routes.get('/ads/create', (req, res) => res.redirect('/products/create'))
routes.get('/accounts', (req, res) => res.redirect('/users/login'))

module.exports = routes