const User = require('../../models/User')
const { compare } = require('bcryptjs')

module.exports = {
    async login(req, res, next) {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ where: { email } })

            if(!user)
                return res.render('session/index', {
                    message: {
                        content: 'Usuário não encontrado!',
                        type: 'error'
                    },
                    user: req.body
                })
            
            if(!password)
                return res.render('session/index', {
                    message: {
                        content: 'Por favor, insira sua senha!',
                        type: 'error'
                    },
                    user: req.body
                })

            const authenticated = await compare(password, user.password)
                
            if(!authenticated)
                return res.render('session/index', {
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