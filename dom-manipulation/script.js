// script.js
// ... (previous code: quotes array, local/session storage, DOM manipulation, filtering)

const SERVER_URL = 'https://my-json-server.typicode.com/your-username/your-repo/quotes'; // Replace with your JSON Server URL

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverQuotes = await response.json();
        return serverQuotes;
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        showNotification("Error fetching quotes from server. Check the console.", "error");
        return null; // Or handle the error as needed
    }
}

async function syncWithServer() {
    const serverQuotes = await fetchQuotesFromServer();

    if (serverQuotes === null) {  // Handle fetch error
        return;
    }

    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    // *** CONFLICT RESOLUTION LOGIC (Example - Replace with your own) ***
    const mergedQuotes = mergeQuotes(localQuotes, serverQuotes); // See mergeQuotes function below

    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
    quotes = mergedQuotes;

    populateCategories();
    filterQuotes();

    console.log("Data synced with server.");
    showNotification("Data synced successfully!");
}


function mergeQuotes(localQuotes, serverQuotes) {
    // Example: Simple merge (add new quotes, keep existing ones)
    const merged = [...localQuotes]; // Start with local quotes

    serverQuotes.forEach(serverQuote => {
        const existsLocally = localQuotes.some(localQuote => localQuote.text === serverQuote.text);
        if (!existsLocally) { // If the server quote is not in local storage, add it.
            merged.push(serverQuote);
        }
    });
    return merged;
}

async function pushToServer() {
    try {
      const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
      const response = await fetch(SERVER_URL, {
        method: 'PUT', // Or POST if creating new data
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(localQuotes)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log("Data pushed to server.");
      showNotification("Data pushed to server successfully!");
    } catch (error) {
      console.error("Error pushing to server:", error);
      showNotification("Error pushing data to server. Check the console for details.", "error");
    }
  }
  

// ... (showNotification function remains the same)

// ... (rest of your code, including event listeners, etc.)

// Initial sync and periodic sync
syncWithServer();
setInterval(syncWithServer, 10000); // Adjust interval as needed

// ... (sync and push buttons remain the same)