/**
 * Created by XA at 14:36 on 2019/4/21.
 */
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


// Article schema
const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

const Article = module.exports = mongoose.model('Article', articleSchema);