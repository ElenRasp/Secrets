//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/Secrets", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
	username: String,
	password: String
});
const secret = "Thisourlittlesecret";
userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"]});
const User = mongoose.model("User", userSchema)

app.get("/", function(req, res) {
	res.render("home")
});
app.get("/login", function(req, res) {
	res.render("login")
});
app.get("/register", function(req, res) {
	res.render("register")
});

app.post("/register", function(req, res) {

const user = new User({
	username: req.body.username,
	password: req.body.password
})
user.save(function(err) {
	if (err) {
		console.log(err);
	} else {
		res.render("secrets");
	}
});
});

app.post("/login", function(req, res) {
const username = req.body.username;
const password = req.body.password;

User.findOne({
	username: username
}, function(err, foundUser) {
	if (err) {
		console.log(err)
	}
	if (foundUser) {
		if (password === foundUser.password) {
			res.render("secrets");
		}
	}else{
res.send("password is not found")
}
});
});


app.listen(3000, function() {
	console.log("Server is running on port 3000");
});
