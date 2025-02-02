// مصفوفة تحتوي على بعض الاقتباسات الافتراضية
// تحميل الاقتباسات من Local Storage أو استخدام القيم الافتراضية
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

// حفظ الاقتباسات في Local Storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// عرض اقتباس عشوائي
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `<p>${selectedQuote.text} - <strong>${selectedQuote.category}</strong></p>`;
}

// إنشاء نموذج إضافة اقتباس
function createAddQuoteForm() {
    const formContainer = document.createElement("div");

    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);
}

// إضافة اقتباس جديد
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes(); // تحديث Local Storage
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// استدعاء إنشاء النموذج عند تحميل الصفحة
window.onload = function () {
    showRandomQuote();
    createAddQuoteForm();
};

// ربط زر إظهار اقتباس جديد بالوظيفة
document.getElementById("newQuote").addEventListener("click", showRandomQuote);