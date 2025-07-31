const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

console.log(__dirname);

dotenv.config({ path: `${__dirname}/../../config.env` });
console.log(process.env.DATABASE);

const Tour = require("../../models/tourModel");

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

//  DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

mongoose
  .connect(
    process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
  )
  .then(() => {
    console.log("DB connection successful");
    if (process.argv[2] === "--import") {
      importData();
    } else if (process.argv[2] === "--delete") {
      deleteData();
    }
  })
  .catch((err) => {
    console.error(err);
  });
