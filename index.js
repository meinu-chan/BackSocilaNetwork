const express = require("express");
const UserDB = require("./DBClasses/Users");


const app = express();

const Users = new UserDB();

// Users.addUser({ login: "aaa", email: "aaa@" })
// Users.findUserBy({ email: "aaa@" })
// Users.deleteUser({  email: "aaa@" })
// Users.clearCollection()
// Users.showUsers()
app.get("/", function (request, response) {

    response.send("<h2>Привет Express!</h2>");
});
app.listen(3000);