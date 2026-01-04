// src/index.ts
const dotenv = require('dotenv');
dotenv.config(); // ✅ EN PREMIER

import app from "./app";
console.log('DATABASE_URL =>', process.env.DATABASE_URL);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});