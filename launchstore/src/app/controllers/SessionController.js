const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')
const User = require('../models/User')

module.exports = {
    loginForm(req, res) {
        res.render('session/login')
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect('/users')
    },
    async logout(req, res) {
        
        await new Promise((resolve) => req.session.destroy(() => resolve()))

        return res.redirect('/')
    },
    forgotForm(req, res) {
        res.render('session/forgot-password')
    },
    async forgot(req, res) {

        try {
            const { user } = req

            const token = crypto.randomBytes(20).toString('hex')

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de Senha | Launchstore',
                html: `
                    <h2>Recuperação de Senha | Launchstore</h2>
                    <p>Prezado(a) ${user.name}, segue seu link de recuperação:</p>
                    <p>
                        <a href="http://localhost:3000/users/reset-password?token=${token}" target="_blank">Recuperar Senha</a>
                    </p>
                    <p>Caso não tenha solicitado, desconsidere!</p>
                `
            })

            res.render('session/forgot-password', {
                message: {
                    content: 'Enviamos um email com as instruções de recuperação!',
                    type: 'success'
                }
            })
        } catch(err) {
            console.error(err)

            res.render('session/forgot-password', {
                message: {
                    content: 'Erro inesperado, tente novamente!',
                    type: 'error'
                },
                user: req.user
            })
        }
    },
    resetForm(req, res) {
        res.render('session/reset-password', { token: req.query.token })
    },
    async reset(req, res) {

        try {
            
            const newPassword = await hash(req.body.password, 8)

            await User.update(req.user.id, {
                password: newPassword,
                reset_token: '',
                reset_token_expires: ''
            })

            return res.render('session/login', {
                message: {
                    content: 'Senha atualizada! Faça seu login.',
                    type: 'success'
                },
                user: req.body
            })
        } catch(err) {
            console.error(err)

            res.render('session/reset-password', {
                message: {
                    content: 'Erro inesperado, tente novamente!',
                    type: 'error'
                },
                user: req.user,
                token: req.body.token
            })
        }
    }
}