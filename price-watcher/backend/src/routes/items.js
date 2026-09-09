import { Router } from "express";
import { db } from "../db.js";
import { searchItems, getItemPrice } from "../services/ebay.js";

export const itemsRouter = Router();

// Search eBay for items to track (does not save anything yet).
itemsRouter.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Missing query param ?q=" });
  }

  try {
    const results = await searchItems(query);
    res.json(results);
  } catch (err) {
    console.error("eBay search failed:", err.message);
    res.status(502).json({ error: "Search failed", detail: err.message });
  }
});

// List everything currently being tracked, with its latest known price.
itemsRouter.get("/", (req, res) => {
  const items = db
    .prepare(
      `SELECT items.*,
              (SELECT price FROM price_history
                WHERE item_id = items.id ORDER BY checked_at DESC LIMIT 1) AS latest_price,
              (SELECT MIN(price) FROM price_history WHERE item_id = items.id) AS lowest_price,
              (SELECT checked_at FROM price_history
                WHERE item_id = items.id ORDER BY checked_at DESC LIMIT 1) AS last_checked_at
         FROM items
         ORDER BY items.created_at DESC`
    )
    .all();
  res.json(items);
});

// Start tracking a new item.
itemsRouter.post("/", async (req, res) => {
  const { ebayItemId, title, url, imageUrl, targetPrice } = req.body;
  if (!ebayItemId || !title || !url) {
    return res.status(400).json({ error: "ebayItemId, title and url are required" });
  }

  try {
    const insert = db.prepare(
      `INSERT INTO items (ebay_item_id, title, url, image_url, target_price)
       VALUES (?, ?, ?, ?, ?)`
    );
    const result = insert.run(ebayItemId, title, url, imageUrl ?? null, targetPrice ?? null);

    // Grab an initial price point immediately so the watchlist isn't empty.
    try {
      const { price, currency, inStock } = await getItemPrice(ebayItemId);
      db.prepare(
        `INSERT INTO price_history (item_id, price, currency, in_stock) VALUES (?, ?, ?, ?)`
      ).run(result.lastInsertRowid, price, currency, inStock ? 1 : 0);
    } catch (err) {
      console.warn("Could not fetch initial price:", err.message);
    }

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "Item already tracked" });
    }
    console.error("Failed to add item:", err.message);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Stop tracking an item.
itemsRouter.delete("/:id", (req, res) => {
  db.prepare(`DELETE FROM items WHERE id = ?`).run(req.params.id);
  res.status(204).end();
});

// Price history for one item (for charts later).
itemsRouter.get("/:id/history", (req, res) => {
  const history = db
    .prepare(`SELECT * FROM price_history WHERE item_id = ? ORDER BY checked_at ASC`)
    .all(req.params.id);
  res.json(history);
});
