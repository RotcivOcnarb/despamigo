const express = require("express");
const app = express();
const path = require("path");
const https = require("https");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {

	res.render("home");

});

app.listen(1337, () => {
	console.log("server started on port " + 1337);
});