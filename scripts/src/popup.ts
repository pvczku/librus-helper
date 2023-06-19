let button = document.getElementById("button");
button!.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (
    tab !== undefined &&
    tab.id &&
    tab.url?.startsWith("https://synergia.librus.pl")
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/build/app.js"],
    });
  }
});
