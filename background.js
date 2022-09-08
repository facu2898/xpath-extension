// background.js

let xpath = '';
let selectionLength = 0;
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ xpath });
  chrome.storage.sync.set({ selectionLength });
});