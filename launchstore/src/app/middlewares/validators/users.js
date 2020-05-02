const User = require('../../models/User')

module.exports = {
    async post(req, res, next) {
        try {
            const keys = Object.keys(req.body)
    
            for (const key of keys) {
                if (req.body[key] === "")
                    return res.render('users/register', {
                        message: 'Por favor, preencha todos os campos!',
                        messageType: 'error',
                        user: req.body
                    })
            }
    
            const { email, cpf_cnpj, password, confirmPassword } = req.body
            const user = await User.findOne({
                where: { email },
                or: { cpf_cnpj: cpf_cnpj.replace(/\D/g, '') }
            })
    
            if (user)
                return res.render('users/register', {
                    message: 'Usuário já cadastrado!',
                    messageType: 'error',
                    user: req.body
                })
    
            if(password !== confirmPassword)
                return res.render('users/register', {
                    message: 'Senhas não correspondem!',
                    messageType: 'error',
                    user: req.body
                })
    
            return next()
        } catch(err) {
            console.error(err)
        }
    }
}