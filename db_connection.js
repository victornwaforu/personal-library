const mongoose = require("mongoose");
const db = mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = db;