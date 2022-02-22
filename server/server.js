var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/test", (req, res, next) => {

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

const port = process.env.PORT || 3001; //Line 3

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6
module.exports = app;