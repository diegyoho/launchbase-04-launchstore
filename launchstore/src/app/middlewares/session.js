module.exports = {
    onlyAuthenticated(req, res, next) {

        if(!req.session.userId)
            return res.redirect('/users/login')

        return next()
    },
    isAuthenticated(req, res, next) {

        if(req.session.userId)
            return res.redirect('/users')

        return next()
    }
}