/**
 * Created by XA at 14:19 on 2019/4/21.
 */

var express = require('express');
var logger  = require('morgan');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(express);
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');


var port = process.env.PORT || 3004;
// 数据库地址
var dbUrl = 'mongodb://xa2018:Scale123@127.0.0.1:20181/nodekb';

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl, {
    // useMongoClient: true,
    useNewUrlParser: true
});
const db = mongoose.connection;

// Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// Check for db errors
db.on('error', function(err){
    console.error(err);
});

var app = express();

var models_path = __dirname + '/app/models';
var walk = function (path) {
    fs
        .readdirSync(path)
        .forEach(function (file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            }
            else if (stat.isDirectory()) {
                walk(newPath);
            }
        });
};
walk(models_path);

app.set('views', './app/views');
app.set('view engine', 'pug');

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.cookieParser());
app.use(require('connect-multiparty')());
app.use(express.session({
    secret: 'xaxaxa',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

if ('development' === app.get('env')) {
    app.use(logger('tiny'));
}

require('./config/routes')(app);

app.listen(port, '127.0.0.1');
app.locals.moment = require('moment');

app.use(express.static(path.join(__dirname, 'public')));
console.log('entry: http://127.0.0.1:' + port);
