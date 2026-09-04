const express = require("express");
const dotenv = require("dotenv");
const pool = require("./services/db");
dotenv.config();

const app = express();

app.use(express.json()); 

const whatsappRoutes = require("./routes/whatsapp");

app.use("/webhook/whatsapp", whatsappRoutes);

app.get("/", (req, res) => {
  res.send("Solarman Live Backend Running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});   