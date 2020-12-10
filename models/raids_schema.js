const mongoose = require("mongoose");

const raids_schema = mongoose.Schema({
    project_name: String,
    project_type: String,
    summary: String,
    specs: String,
    skills_needed: Array,
    priorities: Array,
    budget: Number,
    name: String,
    email: String,
    handle: String,
    link: String,
    completion_date: Date,
    about_guild: String,
    to_know: String,
    transaction_hash: String,
    date_added: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Raids", raids_schema);
