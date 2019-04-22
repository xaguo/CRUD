/**
 * Created by XA at 14:35 on 2019/4/21.
 */
// User model
const User = require('../models/user');
const Article = require('../models/article');

// 首页
exports.index = function (req, res) {
    Article.find({})
        .exec( function(err, articles){
        if(err){
            console.error(err);
        } else {
            res.render('index', {
                title: '文章列表',
                articles: articles
            });
        }
    });
};

// 注册页面
exports.registerPage= function(req, res){
    res.render('register');
};

// 注册响应
exports.register= function(req, res){

    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors: errors
        });
    } else {
        User.findOne({name: name}, function (err, user) {
            if (err) {
                console.log(err)
            }
            if (user) {
                req.flash('error', 'Sorry！该用户名已经存在！');
                res.render('register');
            } else {
                var newUser = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password
                });
                newUser.save(function (err, user) {
                    if (err) {
                        console.log(err)
                    }else{
                        req.flash('success', '您已成功注册，可以登录了！');
                        res.redirect('/login');
                    }

                })
            }
        });
    }
};

// 登录页面
exports.loginPage=function(req, res) {
    res.render('login');
};

// 登录响应
exports.login=function(req, res, next){

    const username = req.body.username;
    const password = req.body.password;

    req.checkBody('username', '用户名不能为空').notEmpty();
    req.checkBody('password', '密码不能为空').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        var message=errors.length<2?errors[0].msg:('用户名和密码不能为空！');
        req.flash('error', message);
        res.render('login');
    }else if(req.session.user) {
        return res.redirect('/')
    }else{
        User.findOne({username: username}, function (err, user) {
            if (err) {
                console.log(err)
            }
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    console.log(err)
                }
                if (isMatch) {
                    req.session.user = user;
                        return res.redirect('/')
                }
                else {
                    req.flash('error', '密码错误！');
                    res.render('login');
                }
            })
        })
    }
};

// 登出
exports.logout=function(req, res) {
    delete req.session.user;
    req.flash('success', '您已成功退出登录！');
    res.redirect('/login');
};

// 要求登录
exports.signinRequired = function (req, res, next) {
    var user = req.session.user;
    if (!user) {
        req.flash('error', '请先登录！');
        res.render('login');
    }else{
        next()
    }
}
