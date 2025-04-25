let isVisible = false;
let capturedText = "";

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    function: getPageText
  }, results => {
    if (!results || !results[0] || !results[0].result) {
      document.getElementById("content").textContent = "Failed to capture content.";
      return;
    }

    capturedText = results[0].result;
    document.getElementById("content").textContent = capturedText.slice(0, 10000); // preview

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
  return document.body.innerText;
}
