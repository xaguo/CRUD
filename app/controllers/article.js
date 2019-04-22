/**
 * Created by XA at 14:36 on 2019/4/21.
 */

// Article model
const Article = require('../models/article');

// new article form
exports.addPage=function(req, res){
    res.render('add_article', {
        title: '新建文章'
    });
}

// submit new article
exports.add= function(req, res){
    // Express validator
    req.checkBody('title', '标题不能为空').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', '内容不能为空').notEmpty();

    // Get errors
    var errors = req.validationErrors();
    if(errors){
        var message=errors.length<2?errors[0].msg:('标题和内容不能为空！');
        req.flash('error', message);
        res.render('add_article', {
            title: '新建文章',
            errors: errors
        });
    } else {
        var article = new Article();
        article.title = req.body.title;
        article.author = req.session.user._id;
        article.body = req.body.body;

        article.save(function(err){
            if(err) {
                console.error(err);
                return;
            } else {
                req.flash('success', '文章添加成功！');
                res.redirect('/');
            }
        });
    }
};

// load edit form
exports.editPage = function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit_article', {
            title: '修改文章',
            article: article
        });
    });
};

// update submit new article
exports.edit = function(req, res){
    var article = {};
    article.title = req.body.title;
    article.body = req.body.body;

    var query = {_id: req.params.id};

    Article.update(query, article, function(err){
        if(err) {
            console.error(err);
            return;
        } else {
            req.flash('success', '文章修改成功！');
            res.redirect('/');
        }
    })
};

// Delete post
exports.del = function(req, res){
    var query = {_id: req.params.id};

    Article.remove(query, function(err){
        if(err) {
            console.error(err);
            return;
        } else {
            req.flash('success', '文章删除成功！')
            res.send('Success');
        }
    });
};

// get single article
exports.detail = function(req, res){
    Article.findById(req.params.id)
        .populate('author', 'name')
        .exec(
            function(err, article){
                res.render('article', {
                    article: article
                });
    });
};

