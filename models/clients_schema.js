const mongoose = require("mongoose");

const clients_schema = mongoose.Schema({
    project_name: String,
    summary: String,
    skills_needed: Array,
    specs: String,
    name: String,
    email: String,
    handle: String,
    about_guild: String,
    to_know: String,
    slot_1: String,
    slot_2: String,
    slot_3: String,
    transaction_hash: String,
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Clients", clients_schema);
