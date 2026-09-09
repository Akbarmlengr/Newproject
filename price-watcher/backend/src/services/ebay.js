import axios from "axios";

const TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token";
const BROWSE_URL = "https://api.ebay.com/buy/browse/v1";

let cachedToken = null;
let cachedTokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("EBAY_CLIENT_ID / EBAY_CLIENT_SECRET are not set (see .env.example)");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const { data } = await axios.post(
    TOKEN_URL,
    new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = data.access_token;
  // Refresh a minute early to avoid edge-of-expiry failures.
  cachedTokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

export async function searchItems(query, limit = 10) {
  const token = await getAccessToken();
  const { data } = await axios.get(`${BROWSE_URL}/item_summary/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, limit },
  });

  return (data.itemSummaries ?? []).map((item) => ({
    ebayItemId: item.itemId,
    title: item.title,
    url: item.itemWebUrl,
    imageUrl: item.image?.imageUrl ?? null,
    price: item.price ? Number(item.price.value) : null,
    currency: item.price?.currency ?? null,
  }));
}

export async function getItemPrice(ebayItemId) {
  const token = await getAccessToken();
  const { data } = await axios.get(`${BROWSE_URL}/item/${encodeURIComponent(ebayItemId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    price: data.price ? Number(data.price.value) : null,
    currency: data.price?.currency ?? null,
    inStock: data.estimatedAvailabilities?.[0]?.estimatedAvailabilityStatus !== "OUT_OF_STOCK",
  };
}
