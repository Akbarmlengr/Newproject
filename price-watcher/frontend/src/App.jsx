import { useEffect, useState } from "react";
import { api } from "./api.js";

function SearchPanel({ onTrack }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      setResults(await api.search(query));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2>Find something to track</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Nintendo Switch OLED"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="results">
        {results.map((item) => (
          <li key={item.ebayItemId}>
            {item.imageUrl && <img src={item.imageUrl} alt="" />}
            <div className="result-info">
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.title}
              </a>
              <span>{item.price != null ? `${item.price} ${item.currency}` : "No price"}</span>
            </div>
            <button onClick={() => onTrack(item)}>Track</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Watchlist({ items, onUntrack, onRefresh }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Watchlist</h2>
        <button onClick={onRefresh}>Check prices now</button>
      </div>
      {items.length === 0 && <p>Nothing tracked yet — search above to add an item.</p>}
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Current price</th>
            <th>Lowest seen</th>
            <th>Last checked</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              </td>
              <td>{item.latest_price ?? "—"}</td>
              <td>{item.lowest_price ?? "—"}</td>
              <td>{item.last_checked_at ?? "never"}</td>
              <td>
                <button onClick={() => onUntrack(item.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function App() {
  const [tracked, setTracked] = useState([]);
  const [error, setError] = useState(null);

  async function refresh() {
    try {
      setTracked(await api.listTracked());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleTrack(item) {
    try {
      await api.track({
        ebayItemId: item.ebayItemId,
        title: item.title,
        url: item.url,
        imageUrl: item.imageUrl,
      });
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUntrack(id) {
    await api.untrack(id);
    refresh();
  }

  async function handleCheckNow() {
    await api.checkNow();
    refresh();
  }

  return (
    <div className="app">
      <h1>Price &amp; Availability Watcher</h1>
      {error && <p className="error">{error}</p>}
      <SearchPanel onTrack={handleTrack} />
      <Watchlist items={tracked} onUntrack={handleUntrack} onRefresh={handleCheckNow} />
    </div>
  );
}
