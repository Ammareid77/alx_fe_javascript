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

// ملء قائمة التصفية بالفئات المتاحة
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // إعادة تعيين الفئات

    let categories = new Set(quotes.map(quote => quote.category)); // استخراج الفئات الفريدة

    categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // استعادة الفئة المحددة سابقًا من Local Storage
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
        filterQuotes(); // تطبيق التصفية تلقائيًا
    }
}

// تصفية الاقتباسات حسب الفئة المحددة
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory); // حفظ الفئة المحددة في Local Storage

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // تفريغ العرض

    let filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
    } else {
        filteredQuotes.forEach(quote => {
            let quoteElement = document.createElement("p");
            quoteElement.innerHTML = `${quote.text} - <strong>${quote.category}</strong>`;
            quoteDisplay.appendChild(quoteElement);
        });
    }
}

// إضافة اقتباس جديد وتحديث القائمة
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes(); // تحديث Local Storage
        populateCategories(); // تحديث قائمة الفئات
        filterQuotes(); // إعادة تطبيق التصفية بعد الإضافة

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
                populateCategories(); // تحديث القائمة بالفئات الجديدة
                filterQuotes(); // إعادة تطبيق التصفية بعد الاستيراد
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

// تحميل آخر فئة محددة وتطبيق التصفية عند بدء التطبيق
window.onload = function () {
    populateCategories(); // ملء قائمة الفئات
    filterQuotes(); // تطبيق التصفية عند تحميل الصفحة
};

// ربط زر عرض اقتباس جديد بالوظيفة
document.getElementById("newQuote").addEventListener("click", filterQuotes);
