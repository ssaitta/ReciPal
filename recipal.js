//document here is the popup.html not the page we're on

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "contentscript.js"});
});

// chrome.extension.getBackgroundPage().console.log('foo');

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {

    console.log("nothing")
 
  });
});






