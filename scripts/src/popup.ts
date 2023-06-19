let button = document.getElementById("button");
button!.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab !== undefined && tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: changeColor,
    });
  }
});

function changeColor() {
  document.body.style.backgroundColor = "red";
  document.getElementById("top-banner")!.style.filter = "invert(100%)";
}
