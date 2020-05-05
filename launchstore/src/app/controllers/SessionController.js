module.exports = {
    loginForm(req, res) {
        res.render('session/index')
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect('/users')
    },
    async logout(req, res) {
        
        await new Promise((resolve) => req.session.destroy(() => resolve()))

        return res.redirect('/')
    }
}