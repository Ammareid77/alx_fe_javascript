// script.js
// ... (previous code: quotes array, local/session storage, DOM manipulation, filtering)

const SERVER_URL = 'https://my-json-server.typicode.com/your-username/your-repo/quotes'; // Replace with your JSON Server URL

async function syncWithServer() {
    try {
        const response = await fetch(SERVER_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverQuotes = await response.json();

        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

        // Basic Conflict Resolution (Server wins - replace with your logic)
        localStorage.setItem('quotes', JSON.stringify(serverQuotes));
        quotes = serverQuotes; // Update the local quotes array

        populateCategories(); // Update categories in the dropdown
        filterQuotes(); // Refresh the displayed quotes

        console.log("Data synced with server.");
        showNotification("Data synced successfully!"); // Show notification

    } catch (error) {
        console.error("Error syncing with server:", error);
        showNotification("Error syncing with server. Check the console for details.", "error");
    }
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


// Notification Function
function showNotification(message, type = "info") {
    const notification = document.createElement('div');
    notification.classList.add('notification', type); // Add 'error' class for errors
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after a few seconds
    setTimeout(() => {
        notification.remove();
    }, 5000); // 5 seconds
}


// ... (rest of your code)

// Call syncWithServer initially and periodically
syncWithServer();
setInterval(syncWithServer, 10000); // Sync every 10 seconds (adjust as needed)


const syncButton = document.createElement('button');
syncButton.textContent = 'Sync with Server';
syncButton.onclick = syncWithServer;
document.body.appendChild(syncButton);

const pushButton = document.createElement('button');
pushButton.textContent = 'Push to Server';
pushButton.onclick = pushToServer;
document.body.appendChild(pushButton);