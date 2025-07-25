const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then((con) => {
    console.log(con.connections);
    console.log("DB connection successfull !");
  })
  .then(() => console.log("DB connection successful!"));

// console.log(process.env);
const app = require("./app");

app.listen(process.env.PORT, () => {
  console.error("there was an error saving the tour");
  console.log(`server is running on port ${process.env.PORT}`);
});
