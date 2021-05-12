
console.log("RemoveTabOnMessageListenerCiphertextToHTML.js:");
try {
    browser.runtime.onMessage.removeListener(ciphertextToHTML);
} catch (e) {}

