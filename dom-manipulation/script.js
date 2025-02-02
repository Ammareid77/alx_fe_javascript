// تحميل الاقتباسات من Local Storage أو استخدام القيم الافتراضية
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

// حفظ الاقتباسات إلى Local Storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// عرض اقتباس عشوائي وحفظه في Session Storage
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `<p>${selectedQuote.text} - <strong>${selectedQuote.category}</strong></p>`;

    // حفظ آخر اقتباس في Session Storage
    sessionStorage.setItem("lastQuote", JSON.stringify(selectedQuote));
}

// استعادة آخر اقتباس عند إعادة تحميل الصفحة
function loadLastQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
    if (lastQuote) {
        document.getElementById("quoteDisplay").innerHTML = `<p>${lastQuote.text} - <strong>${lastQuote.category}</strong></p>`;
    } else {
        showRandomQuote();
    }
}

// إضافة اقتباس جديد إلى Local Storage
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

// تصدير الاقتباسات إلى ملف JSON
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// استيراد الاقتباسات من ملف JSON
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid file format. Please upload a valid JSON file.");
            }
        } catch (error) {
            alert("Error reading the file. Please upload a valid JSON.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// تحميل آخر اقتباس عند بدء التطبيق
window.onload = function () {
    loadLastQuote();
};

// ربط زر إظهار اقتباس جديد بالوظيفة
document.getElementById("newQuote").addEventListener("click", showRandomQuote);