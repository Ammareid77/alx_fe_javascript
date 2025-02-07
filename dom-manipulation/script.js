const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API to fetch and post data
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
function showRandomQuote(addEventListener) {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  alert(`"${quote.text}" - ${quote.category}`);
}

// Function to add a new quote
function addQuote(createAddQuoteForm) {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    displayQuotes(quotes);
    
    // Post the new quote to the mock API
    postQuoteToServer(newQuote);
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

    syncQuotes(serverQuotes); // Call syncQuotes to merge local and server data
  } catch (error) {
    console.error('Error fetching quotes from the server:', error); // Handle any errors
  }
}

// Sync local quotes with the server data and handle potential conflicts
function syncQuotes(serverQuotes) {
  // Compare local and server quotes to merge data, prioritize server data in case of conflict
  const mergedQuotes = serverQuotes.map(serverQuote => {
    const matchingLocalQuote = quotes.find(localQuote => localQuote.text === serverQuote.text);
    if (matchingLocalQuote) {
      return serverQuote; // Use server quote if there's a match
    }
    return serverQuote; // Otherwise, use the server quote
  });

  // Update quotes array with merged quotes
  quotes = mergedQuotes;
  saveQuotes();
  displayQuotes(mergedQuotes);

  // Notify the user that the quotes were updated from the server
  showSyncNotification('Quotes synced with server!');
}

// Post the new quote to the mock API using POST method
async function postQuoteToServer(newQuote) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST', // Use POST method to send data
      headers: {
        'Content-Type': 'application/json', // Set content type as JSON
      },
      body: JSON.stringify(Blob), // Convert newQuote to JSON format for sending
    });
    function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

    const data = await response.json(); // Parse the response as JSON
    console.log('Quote posted successfully:', data); // Log response from the server
  } catch (error) {
    console.error('Error posting quote to the server:', error); // Handle any errors
  }
}

// Notify the user with a message in the UI
function showSyncNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.classList.add('notification');
  document.body.appendChild(notification);

  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Load quotes when the page loads
window.onload = function() {
  displayQuotes(quotes);
  populateCategories();
  fetchQuotesFromServer(); // Fetch quotes from the server on page load
};

// Fetch data periodically from the server (every 5 minutes)
setInterval(fetchQuotesFromServer, 300000); // 300000 ms = 5 minutes
