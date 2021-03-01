// const UserDB = require("./DBClasses/Users");
const app = require("./app");
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server has been started: http://localhost:${PORT}`));