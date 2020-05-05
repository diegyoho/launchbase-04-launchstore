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
                user: body,
                token: body.token
            }
    }
}

module.exports = {
    async login(req, res, next) {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ where: { email } })

            if(!user)
                return res.render('session/login', {
                    message: {
                        content: 'Usuário não encontrado!',
                        type: 'error'
                    },
                    user: req.body
                })
            
            if(!password)
                return res.render('session/login', {
                    message: {
                        content: 'Por favor, insira sua senha!',
                        type: 'error'
                    },
                    user: req.body
                })

            const authenticated = await compare(password, user.password)
                
            if(!authenticated)
                return res.render('session/login', {
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
    },
    async forgot(req, res, next) {
        try {
            const { email } = req.body

            const user = await User.findOne({ where: { email } })

            if(!user)
                return res.render('session/forgot-password', {
                    message: {
                        content: 'Email não cadastrado!',
                        type: 'error'
                    },
                    user: req.body
                })
            
            req.user = user
    
            return next()
        } catch(err) {
            console.error(err)
        }
    },
    async reset(req, res, next) {
        try {
            const fillAllFields = checkAllFields(req.body)

            if(fillAllFields)
                return res.render('session/reset-password', fillAllFields)

            const { email, password, confirmPassword, token  } = req.body

            const user = await User.findOne({ where: { email } })

            if(!user)
                return res.render('session/reset-password', {
                    message: {
                        content: 'Email não cadastrado!',
                        type: 'error'
                    },
                    user: req.body,
                    token
                })

            if(password !== confirmPassword)
                return res.render('session/reset-password', {
                    message: {
                        content: 'Senhas não correspondem!',
                        type: 'error'
                    },
                    user: req.body,
                    token
                })

            if(token !== user.reset_token)
                return res.render('session/reset-password', {
                    message: {
                        content: 'Solicitação inválida! Tente novamente.',
                        type: 'error'
                    },
                    user: req.body,
                    token
                })

            let now = new Date()
            now = now.setHours(now.getHours())

            if(now > user.reset_token_expires)
                return res.render('session/reset-password', {
                    message: {
                        content: 'Recuperação expirada! Solicite uma nova recuperação de senha.',
                        type: 'error'
                    },
                    user: req.body,
                    token
                })
            
            req.user = user
    
            return next()
        } catch(err) {
            console.error(err)
        }
    }
}