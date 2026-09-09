import "dotenv/config";
import express from "express";
import cors from "cors";
import { itemsRouter } from "./routes/items.js";
import { startPoller, checkAllItems } from "./poller.js";
import "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/items", itemsRouter);

// Manual trigger, handy for testing without waiting for the cron schedule.
app.post("/api/check-now", async (req, res) => {
  await checkAllItems();
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`[server] Listening on http://localhost:${port}`);
  startPoller();
});
