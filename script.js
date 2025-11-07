
const iframe = document.getElementById("view");
const urlInput = document.getElementById("urlInput");
const goBtn = document.getElementById("goBtn");
const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");
const homeBtn = document.getElementById("homeBtn");
const bookmarkBtn = document.getElementById("bookmarkBtn");
const bookmarksDiv = document.getElementById("bookmarks");

// ---------- Manual History ----------
let historyStack = ["https://wikipedia.org"];
let currentIndex = 0;

// ---------- Bookmarks ----------
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

function displayBookmarks() {
  bookmarksDiv.innerHTML = "";
  bookmarks.forEach(url => {
    const b = document.createElement("div");
    b.className = "bookmark";
    b.textContent = url.replace(/^https?:\/\//, "");
    b.onclick = () => loadPage(url);
    bookmarksDiv.appendChild(b);
  });
}
displayBookmarks();

// ---------- Load Page ----------
function loadPage(url) {
  if (!url.startsWith("http")) {
    url = "https://www.bing.com/search?q=" + encodeURIComponent(url);
  }
  iframe.src = url;

  // Save in manual history
  historyStack = historyStack.slice(0, currentIndex + 1);
  historyStack.push(url);
  currentIndex++;
  updateButtons();
}

// ---------- Update Navigation Buttons ----------
function updateButtons() {
  backBtn.disabled = currentIndex <= 0;
  forwardBtn.disabled = currentIndex >= historyStack.length - 1;
}
updateButtons();

// ---------- Button Clicks ----------
goBtn.onclick = () => {
  const url = urlInput.value.trim();
  if (url) loadPage(url);
};

backBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    iframe.src = historyStack[currentIndex];
    updateButtons();
  }
};

forwardBtn.onclick = () => {
  if (currentIndex < historyStack.length - 1) {
    currentIndex++;
    iframe.src = historyStack[currentIndex];
    updateButtons();
  }
};

homeBtn.onclick = () => loadPage("https://wikipedia.org");

bookmarkBtn.onclick = () => {
  const currentUrl = historyStack[currentIndex];
  if (!bookmarks.includes(currentUrl)) {
    bookmarks.push(currentUrl);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();
  }
};
