let isVisible = false;
let capturedText = "";

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    function: getPageText
  }, results => {
    capturedText = results[0].result;
    document.getElementById("content").textContent = capturedText.slice(0, 10000); // safe limit

    const blob = new Blob([capturedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "webpage-content.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});

document.getElementById("toggleBtn").addEventListener("click", () => {
  const contentDiv = document.getElementById("content");
  isVisible = !isVisible;
  contentDiv.classList.toggle("hidden", !isVisible);
  document.getElementById("toggleBtn").textContent = isVisible ? "Hide Content" : "Show Content";
});

function getPageText() {
  // Remove unwanted elements
  document.querySelectorAll("nav, footer, aside, header, script, style, noscript, iframe, form, button").forEach(el => el.remove());

  // Extract meaningful content
  const tags = Array.from(document.querySelectorAll("article, main, p, h1, h2, h3, li"));
  let text = tags.map(el => el.innerText).join("\n");

  // Clean it
  text = text
    .replace(/\s{2,}/g, " ")
    .replace(/\n{2,}/g, "\n\n")
    .trim();

  return text;
}

function getPageText() {
  return getPageLinks();
}

