import cron from "node-cron";
import { db } from "./db.js";
import { getItemPrice } from "./services/ebay.js";
import { sendPriceAlert } from "./services/mailer.js";

async function checkAllItems() {
  const items = db.prepare(`SELECT * FROM items`).all();
  console.log(`[poller] Checking ${items.length} tracked item(s)...`);

  for (const item of items) {
    try {
      const previous = db
        .prepare(
          `SELECT price FROM price_history WHERE item_id = ? ORDER BY checked_at DESC LIMIT 1`
        )
        .get(item.id);

      const { price, currency, inStock } = await getItemPrice(item.ebay_item_id);

      db.prepare(
        `INSERT INTO price_history (item_id, price, currency, in_stock) VALUES (?, ?, ?, ?)`
      ).run(item.id, price, currency, inStock ? 1 : 0);

      const droppedBelowTarget =
        item.target_price != null && price != null && price <= item.target_price;
      const droppedFromPrevious =
        previous?.price != null && price != null && price < previous.price;

      if (droppedBelowTarget || droppedFromPrevious) {
        await sendPriceAlert({
          title: item.title,
          url: item.url,
          oldPrice: previous?.price ?? "unknown",
          newPrice: price,
          currency,
        });
      }
    } catch (err) {
      console.error(`[poller] Failed to check item ${item.id} (${item.title}):`, err.message);
    }
  }
}

export function startPoller() {
  const schedule = process.env.POLL_CRON || "0 */6 * * *";
  console.log(`[poller] Scheduled with cron "${schedule}"`);
  cron.schedule(schedule, checkAllItems);
}

// Exported for manual/testing use (e.g. a "check now" API route).
export { checkAllItems };
