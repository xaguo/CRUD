/**
 * Created by XA at 14:37 on 2019/4/21.
 */

var User = require('../app/controllers/user');
var Article = require('../app/controllers/article');

module.exports = function (app) {

    // pre handle user
    app.use(function (req, res, next) {
        app.locals.user = req.session.user;
        next();
    });

    // user
    app.get('/', User.index);
    app.get('/register', User.registerPage);
    app.post('/register', User.register);
    app.get('/login', User.loginPage);
    app.post('/login', User.login);
    app.get('/logout', User.logout);

    //article
    app.get('/articles/add',User.signinRequired, Article.addPage);
    app.post('/articles/add',User.signinRequired, Article.add);
    app.get('/articles/edit/:id',User.signinRequired, Article.editPage);
    app.post('/articles/edit/:id',User.signinRequired, Article.edit);
    app.delete('/articles/:id',User.signinRequired, Article.del);
    app.get('/articles/:id', Article.detail);

};