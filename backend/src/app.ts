// src/app.ts
import express, { Application } from "express";
import AuthRoute from './routes/AuthRoute';

const app: Application = express();

app.use(express.json());
app.use('auth',AuthRoute);

app.get("/", (req, res) => {
  res.send("✅ App fonctionne (depuis app.ts)");
});

export default app;
