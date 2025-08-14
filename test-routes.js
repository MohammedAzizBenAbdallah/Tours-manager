const express = require("express");
const userRouter = require("./userRoutes/userRoute");

const app = express();

// Test the router
console.log("Testing user routes...");
console.log("Router stack:", userRouter.stack);

// Check if updatePassword route exists
const updatePasswordRoute = userRouter.stack.find(
  (layer) => layer.route && layer.route.path === "/updatePassword"
);

if (updatePasswordRoute) {
  console.log("✅ updatePassword route found!");
  console.log("Methods:", Object.keys(updatePasswordRoute.route.methods));
} else {
  console.log("❌ updatePassword route NOT found!");
}

console.log("\nAll routes:");
userRouter.stack.forEach((layer) => {
  if (layer.route) {
    console.log(
      `${Object.keys(layer.route.methods).join(",").toUpperCase()} ${layer.route.path}`
    );
  }
});
