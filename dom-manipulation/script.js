const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API to fetch data from
let quotes = JSON.parse(localStorage.getItem('quotes')) || []; // Get quotes from localStorage

// Function to display quotes
function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  quotesToDisplay.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Function to show random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  alert(`"${quote.text}" - ${quote.category}`);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    displayQuotes(quotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories(); // Update categories when new quote is added
}

// Populate categories in dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const uniqueCategories = Array.from(new Set(quotes.map(quote => quote.category)));

  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Add "All Categories" option
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  displayQuotes(filteredQuotes);
}

// Fetch quotes from the mock API (JSONPlaceholder) using async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL); // Await the fetch request
    const data = await response.json(); // Await the response and parse as JSON

    // Simulating response: Convert data to match the quote structure
    const serverQuotes = data.map(post => ({
      text: post.title, // Using post.title as quote text
      category: post.body.split(' ')[0], // Using the first word of post.body as category
    }));

    handleDataSync(serverQuotes); // Handle data synchronization with local storage
  } catch (error) {
    console.error('Error fetching quotes from the server:', error); // Handle any errors
  }
}

// Sync data between server and localStorage
function handleDataSync(serverQuotes) {
  const updatedQuotes = serverQuotes.map(serverQuote => {
    const matchingQuote = quotes.find(localQuote => localQuote.text === serverQuote.text);
    return matchingQuote ? serverQuote : serverQuote; // If match found, take server data
  });

  quotes = updatedQuotes;
  saveQuotes();
  displayQuotes(updatedQuotes);

  // Notify user
  alert('Quotes have been updated from the server!');
}

// Notify user of new updates
function notifyUserOfConflict() {
  const notification = document.createElement('div');
  notification.textContent = 'New updates found. Do you want to sync data?';
  notification.classList.add('notification');
  document.body.appendChild(notification);

  const syncButton = document.createElement('button');
  syncButton.textContent = 'Sync Now';
  syncButton.onclick = function() {
    fetchQuotesFromServer();
    notification.remove();
  };
  notification.appendChild(syncButton);

  setTimeout(() => notification.remove(), 10000); // Remove notification after 10 seconds
}

// Load quotes when the page loads
window.onload = function() {
  displayQuotes(quotes);
  populateCategories();
  fetchQuotesFromServer(); // Fetch quotes from the server on page load
};

// Fetch data periodically from the server (every 5 minutes)
setInterval(fetchQuotesFromServer, 300000); // 300000 ms = 5 minutes
