const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successfull !");
});

// console.log(process.env);
const app = require("./app");

// Use different port for debugging to avoid conflicts
const port = process.env.NODE_ENV === "debug" ? 3001 : process.env.PORT;

app
  .listen(port, () => {
    console.log(`server is running on port ${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${port} is already in use. Server might already be running.`
      );
      console.log(
        "If you want to restart, please stop the existing server first."
      );
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
  });
