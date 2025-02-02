// مصفوفة تحتوي على بعض الاقتباسات الافتراضية
let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

// عرض اقتباس عشوائي عند تحميل الصفحة أو عند الضغط على الزر
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>${quotes[randomIndex].text} - <strong>${quotes[randomIndex].category}</strong></p>`;
}

// إضافة اقتباس جديد من المستخدم
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("Quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// ربط الزر بوظيفة عرض اقتباس جديد
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// عرض أول اقتباس عند تحميل الصفحة
showRandomQuote();