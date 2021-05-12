
console.log("RemoveTabOnMessageListenerHTMLToCiphertext.js:");
try {
    browser.runtime.onMessage.removeListener(htmlToCiphertext);
} catch (e) {}

