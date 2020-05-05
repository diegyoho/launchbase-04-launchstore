module.exports = {
    loginForm(req, res) {
        res.render('session/index')
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect('/users')
    },
    logout(req, res) {
        req.session.destroy()

        return res.redirect('/')
    }
}