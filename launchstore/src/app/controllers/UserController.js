const { formatCpfCnpj, formatCEP } = require('../../lib/utils')
const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render('users/register')
    },
    show(req, res) {
        const { user } = req

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCEP(user.cep)

        return res.render('users/index', {
            user
        })
    },
    async post(req, res) {
        try {
            
            const userId = await User.create(req.body)
            
            req.session.userId = userId

            return res.redirect('/users')
        } catch(err) {
            console.error(err)
        }
    },
    async update(req, res) {
        try {

            const { user } = req
            
            let { name, email, cpf_cnpj, cep, address } = req.body
            
            cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
            cep = cep.replace(/\D/g, '')

            await User.update(user.id, {
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render('users/index', {
                user: req.body,
                message: {
                    content: 'Dados atualizados com sucesso!',
                    type: 'success'
                }
            })
        } catch(err) {
            console.error(err)

            return res.render('users/index', {
                user: req.body,
                message: {
                    content: 'Erro no sistema!',
                    type: 'error'
                }
            })
        }
    },
    async delete(req, res) {
        try {

            await User.delete(req.body.id)
            req.session.userId = null
            await new Promise((resolve) => req.session.destroy(() => resolve()))

            return res.render('session/login', {
                message: {
                    content: 'Conta excluída com sucesso!',
                    type: 'success'
                }
            })
        } catch(err) {
            console.error(err)

            return res.render('users/index', {
                user: req.body,
                message: {
                    content: 'Erro no sistema!',
                    type: 'error'
                }
            })
        }
    }
}