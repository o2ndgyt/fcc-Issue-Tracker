'use strict';
var mongoose = require('mongoose');
var dotenv = require('dotenv').config();

// mongoose connection
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const issue = new mongoose.Schema({
    projectname: {
        type: String,
        required: true
    },
    issue_title: {
        type: String,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    status_text: {
        type: String
    },
    assigned_to: {
        type: String
    },
    created_on: {
        type: Date,
        default: new Date().toString()
    },
    updated_on: {
        type: Date,
        default: new Date().toString()
    },
    open: {
        type: Boolean,
        default: true
    }
});

const Issue = mongoose.model('ProjectIssue', issue);

module.exports = function (app) {

    app.route('/api/issues/:project')

        .get((req, res) => {
            if (!req.params.project) {
                res.json({
                    error: 'required field(s) missing'
                });
            } else {
                let filter = {};
                filter.projectname = req.params.project;
                for (var propName in req.query)
                    if (req.query.hasOwnProperty(propName))
                        filter[propName] = req.query[propName];

                Issue.find(filter, (err, items) => {
                    if (err)
                        res.json({
                            error: err
                        });
                    res.json(items);
                });
            }
        })

        .post((req, res) => {
            if (!req.params.project || !req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
                res.json({
                    error: 'required field(s) missing'
                });
            } else {
                let tmp = new Issue({
                    projectname: req.params.project,
                    issue_title: req.body.issue_title,
                    issue_text: req.body.issue_text,
                    created_by: req.body.created_by,
                    status_text: req.body.status_text || "",
                    assigned_to: req.body.assigned_to || "",
                });
                tmp.save((err, doc) => {
                    if (err)
                        res.json({
                            error: err
                        });
                    res.json(doc);
                });
            }
        })

        .put((req, res) => {
            if (!req.params.project || !req.body._id) {
                res.json({
                    error: 'missing _id'
                });
            } else {
                let user = {
                    issue_title: "",
                    issue_text: "",
                    created_by: "",
                    status_text: "",
                    assigned_to: ""
                };
                let newObj = {};
                newObj.updated_on = new Date().toString();
                Object.keys(user).forEach((prop) => {
                    if (req.body[prop])
                        newObj[prop] = req.body[prop];
                });
                if (Object.keys(newObj).length == 1) {
                    res.json({
                        error: 'no update field(s) sent',
                        _id: req.body._id
                    });
                } else {
                    try {
                        Issue.findOneAndUpdate({
                            _id: mongoose.Types.ObjectId(req.body._id),
                            projectname: req.params.project
                        }, newObj, {
                            new: true
                        }, (err, newitem) => {

                            res.json(newitem ? {
                                result: 'successfully updated',
                                _id: req.body._id
                            }: {
                                error: 'could not update',
                                _id: req.body._id
                            } );

                        });
                    } catch {
                        res.json({
                            error: 'could not update',
                            _id: req.body._id
                        });
                    }
                }
            }
        })

        .delete((req, res) => {
            if (!req.params.project || !req.body._id) {
                res.json({
                    error: 'missing _id'
                });
            } else {
                try {
                    Issue.findOneAndDelete({
                        _id: mongoose.Types.ObjectId(req.body._id),
                        projectname: req.params.project
                    }, (err, docs) => {
                        res.json(docs ?

                            {
                                result: 'successfully deleted',
                                '_id': req.body._id
                            } : {
                                error: 'could not delete',
                                '_id': req.body._id
                            }
                        );
                    });
                } catch {
                    res.json({
                        error: 'could not delete',
                        '_id': req.body._id
                    });
                }
            }

        });

}