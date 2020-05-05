const User = require('../../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)
    
    for (const key of keys) {
        if (body[key] === "")
            return {
                message: {
                    content: 'Por favor, preencha todos os campos!',
                    type: 'error'
                },
                user: body
            }
    }
}

module.exports = {
    async show(req, res, next) {
        try {
            const { userId } = req.session

            const user = await User.findOne({ where: { id: userId } })

            if(!user)
                return res.render('users/register', {
                    message: {
                        content: 'Usuário não encontrado!',
                        type: 'error'
                    }
                })

            req.user = user
    
            return next()
        } catch(err) {
            console.error(err)
        }
    },
    async post(req, res, next) {
        try {
            const fillAllFields = checkAllFields(req.body)

            if(fillAllFields)
                return res.render('users/register', fillAllFields)
    
            const { email, cpf_cnpj, password, confirmPassword } = req.body
            const user = await User.findOne({
                where: { email },
                or: { cpf_cnpj: cpf_cnpj.replace(/\D/g, '') }
            })
    
            if (user)
                return res.render('users/register', {
                    message: {
                        content: 'Usuário já cadastrado!',
                        type: 'error'
                    },
                    user: req.body
                })
    
            if(password !== confirmPassword)
                return res.render('users/register', {
                    message: {
                        content: 'Senhas não correspondem!',
                        type: 'error'
                    },
                    user: req.body
                })
    
            return next()
        } catch(err) {
            console.error(err)
        }
    },
    async update(req, res, next) {
        try {
            const fillAllFields = checkAllFields(req.body)

            if(fillAllFields)
                return res.render('users/index', fillAllFields)
            
            const { id, password } = req.body
            
            if(!password)
                return res.render('users/index', {
                    message: {
                        content: 'Por favor, insira sua senha!',
                        type: 'error'
                    },
                    user: req.body
                })
            
            const user = await User.findOne({ where: { id } })

            const authenticated = await compare(password, user.password)
                
            if(!authenticated)
                return res.render('users/index', {
                    message: {
                        content: 'Senha incorreta!',
                        type: 'error'
                    },
                    user: req.body
                })
            
            req.user = user
    
            return next()
        } catch(err) {
            console.error(err)
        }
    }
}