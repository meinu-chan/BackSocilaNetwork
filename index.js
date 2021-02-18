// const UserDB = require("./DBClasses/Users");
const app = require("./app");
const PORT = process.env.PORT || 3000

// const Users = new UserDB();

// Users.addUser({ login: "aaa", email: "aaa@" })
// Users.findUserBy({ email: "aaa@" })
// Users.deleteUser({  email: "aaa@" })
// Users.clearCollection()
// Users.showUsers()
app.listen(PORT, () => console.log(`Server has been started: http://localhost:${PORT}`));