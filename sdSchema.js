const mongoose = require("mongoose");

const ScrapedDataSchema = new mongoose.Schema({
    website: {
        type: String,
    },
    namad_url: {
        type: String,
    },
    twit_text: {
        type: String,
    },
    profile_url: {
        type: String,
    },
    username: {
        type: String,
    },
    display_name: {
        type: String,
    },
    likes: {
        type: Number,
    },
    comments_count: {
        type: Number,
    },
    is_retwit: {
        type: Boolean,
    }
}, { strict: false });

const ScrapedData = mongoose.model("ScrapedData", ScrapedDataSchema);

module.exports = ScrapedData;