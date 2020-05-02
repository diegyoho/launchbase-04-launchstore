const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render('users/register')
    },
    async post(req, res) {
        try {
            
            const userId = await User.create(req.body)

            return res.render('users/register', {
                message: {
                    content: 'Usuário cadastrado com sucesso!',
                    type: 'success'
                }
            })
        } catch(err) {
            console.error(err)
        }
    }
}