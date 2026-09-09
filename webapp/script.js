const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Do or do not. There is no try.", author: "Yoda" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
];

const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote-btn");

function showRandomQuote() {
  const { text, author } = quotes[Math.floor(Math.random() * quotes.length)];
  quoteEl.textContent = `"${text}"`;
  authorEl.textContent = `— ${author}`;
}

newQuoteBtn.addEventListener("click", showRandomQuote);
showRandomQuote();
