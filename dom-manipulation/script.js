// script.js
// ... (previous code: quotes array, local/session storage, DOM manipulation, filtering)

// *** 1. Set up your JSON Server (using my-json-server.typicode.com) ***
//    a. Create a GitHub repository (if you don't have one already).
//    b. Create a file named `db.json` in the root of your repository.
//    c. Add your initial quote data to `db.json`.  For example:
//
//       {
//         "quotes": [
//           { "text": "Quote 1", "category": "Category 1" },
//           { "text": "Quote 2", "category": "Category 2" }
//         ]
//       }
//
//    d. The `SERVER_URL` below should then be:
//       `https://my-json-server.typicode.com/your-github-username/your-repo-name/quotes`
//       (replace with your actual GitHub username and repo name).

const SERVER_URL = 'https://my-json-server.typicode.com/your-github-username/your-repo-name/quotes'; // ***REPLACE THIS***

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
        return null; 
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
    const merged = [...localQuotes]; 

    serverQuotes.forEach(serverQuote => {
        const existsLocally = localQuotes.some(localQuote => localQuote.text === serverQuote.text && localQuote.category === serverQuote.category);
        if (!existsLocally) { 
            merged.push(serverQuote);
        }
    });
    return merged;
}

async function pushToServer() {
    try {
      const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
      const response = await fetch(SERVER_URL, {
        method: 'PUT', 
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