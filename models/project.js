const mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    title: String,
    year: String,
    link: String,
    description: String,
    reviewStatus: Boolean,
    authors: [{

        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }],
    abstract: String,
    supervisor: String
})

module.exports = mongoose.model("Campground", campgroundSchema)