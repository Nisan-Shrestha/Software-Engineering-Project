const mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    title: String,
    year: String,
    link: String,
    description: String,
    image:String,
    reviewStatus: Boolean,
    authors:String,
    author: [{

        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }],
    abstract: String,
    supervisor: String,
    members:[{
        username: String
        } 
    ]
})

module.exports = mongoose.model("Project", projectSchema)