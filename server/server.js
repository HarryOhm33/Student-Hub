require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 8001;

(async () => {
  await connectDB(); // ✅ connect only here

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
