const applyButton = document.querySelector("#apply");

applyButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: removeSelectionFunction,
    });
    
    setTimeout(()=>{
        const xpath = document.querySelector("#xpath").value;
        chrome.storage.sync.set({ xpath });
    
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: setPageBackgroundColor,
        });

        setTimeout(()=>{
            chrome.storage.sync.get("selectionLength", ({ selectionLength }) => {
                document.querySelector(".count-selection span").textContent = selectionLength;
            });
        },500)

    },500);

});
  
  // The body of this function will be executed as a content script inside the
  // current page
  function setPageBackgroundColor() {
    chrome.storage.sync.get("xpath", ({ xpath }) => {
        let selectionLength = 0;
        if(xpath!=""){
            let xpathSelection = document.evaluate(xpath,document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
            selectionLength = xpathSelection.snapshotLength;
            chrome.storage.sync.set({ selectionLength });
            for(let i = 0;i < xpathSelection.snapshotLength; i++){
              xpathSelection.snapshotItem(i).style.backgroundColor = "rgb(39, 123, 192,0.6)";
            }      
        }else{
            chrome.storage.sync.set({ selectionLength });
        }
    });
  }

function removeSelectionFunction(){
    chrome.storage.sync.get("xpath", ({ xpath }) => {
        if(xpath!=""){
            let xpathSelection = document.evaluate(xpath,document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
            for(let i = 0;i < xpathSelection.snapshotLength; i++){
              xpathSelection.snapshotItem(i).style.backgroundColor = "";
            }    
        }
      });
}