const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidators = require('../app/middlewares/validators/users')
const SessionValidators = require('../app/middlewares/validators/session')

// LOGIN/LOGOUT
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidators.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// // RESET/FORGOT PASSWORD
// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/reset-password', SessionController.resetForm)
// routes.post('/forgot-password', SessionController.forgot)
// routes.post('/reset-password', SessionController.reset)

// // CRUD USER
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidators.post, UserController.post)

routes.get('/', UserValidators.show, UserController.show)
routes.put('/', UserValidators.update, UserController.update)
// routes.delete('/', UserController.delete)

module.exports = routes