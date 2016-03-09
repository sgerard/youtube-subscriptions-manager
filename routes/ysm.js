var express = require('express');
var router = express.Router();
//var passport = require('passport');

var mongoose = require('mongoose')
var User = require('../models/user');
var Category = require('../models/category');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(500).jsonp({error: 'User not authenticated'});
    }
}

module.exports = function(ysm) {
    // subscriptions
    router.get('/subscriptions', ensureAuthenticated, function(req, res) {
        ysm.getSubscriptions(function(err, response) {
            if (err) {
                res.status(500).jsonp({error: err});
            } else {
                res.json(response);
            }
        });
    });

    // videos
    router.get('/videos', ensureAuthenticated, function(req, res) {
        ysm.getVideos(req.query.channelId, req.query.videoCount, function(err, response) {
            if (err) {
                res.status(500).jsonp({error: err});
            } else {
                res.json(response);
            }
        });
    });

    // category
    router.get('/category', ensureAuthenticated, function(req, res) {
        Category
            .find({userId: req.user._id})
            .select('-userId -__v')
            .lean(true)
            .exec(function(err, categories) {
                if (err) {
                    res.status(500).jsonp({error: "Unable to create category"});
                } else {
                    res.json({categories: categories});
                }
            });
    });

    router.post('/category', ensureAuthenticated, function(req, res) {
        var category = new Category({name: req.body.name, userId: req.user._id});
        category.save(function(err, category) {
            if (err) {
                res.status(500).jsonp({error: "Unable to create category"});
            } else {
                Category
                    .findById(category._id)
                    .select('-userId -__v')
                    .lean(true)
                    .exec(function(err, category) {
                        if (err) {
                            res.status(500).jsonp({error: "Unable to retrieve category"});
                        } else {
                            res.json({category: category});
                        }
                    });
            }
        });
    });

    router.put('/category', ensureAuthenticated, function(req, res) {
        Category
            .findOneAndUpdate(
                {_id: req.body.categoryId, userId: req.user._id},
                {$set: {name: req.body.name}}
            )
            .select('-userId -__v')
            .lean(true)
            .exec(function(err, category) {
                if (err) {
                    res.status(500).jsonp({error: "Unable to create category"});
                } else {
                    res.json({status: 'success'});
                }
            });
    });

    router.delete('/category', ensureAuthenticated, function(req, res) {
        Category
            .findOneAndRemove({_id: req.body.categoryId, userId: req.user._id})
            .select('-userId -__v')
            .lean(true)
            .exec(function(err, category) {
                if (err) {
                    res.status(500).jsonp({error: "Unable to delete category"});
                } else {
                    res.json({status: 'success'});
                }
            }
        );
    });

    // subscriptions in categories
    router.get('/subscription', ensureAuthenticated, function(req, res) {
        Category
            .findOne({_id: req.body.categoryId, userId: req.user._id})
            .select('-userId -__v')
            .lean(true)
            .exec(function(err, category) {
                if (err || category == null) {
                    res.status(500).jsonp({error: "Unable to get category's channels"});
                } else {
                    res.json({channels: category.channels});
                }
            });
    });

    router.post('/subscription', ensureAuthenticated, function(req, res) {
        Category
            .findOneAndUpdate(
                {_id: req.body.categoryId, userId: req.user._id},
                {$push: {"channels": req.body.channelId}},
                {safe: true, upsert: true, new : true}
            )
            .select('-userId -__v')
            .lean(true)
            .exec(function(err, category) {
                if (err) {
                    res.status(500).jsonp({error: "Unable to add subscription"});
                } else {
                    res.json({status: 'success'});
                }
            });
    });

    router.delete('/subscription', ensureAuthenticated, function(req, res) {
        Category
            .findOneAndUpdate(
                {_id: req.body.categoryId, userId: req.user._id},
                {$pull: {"channels": req.body.channelId}},
                {safe: true, upsert: true, new : true}
            )
            .select('-userId -__v')
            .lean(true)
            .exec(function(err, category) {
                if (err) {
                    res.status(500).jsonp({error: "Unable to add subscription"});
                } else {
                    res.json({status: 'success'});
                }
            });
    });

    return router;
}
