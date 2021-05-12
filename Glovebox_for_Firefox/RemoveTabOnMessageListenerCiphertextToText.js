
console.log("RemoveTabOnMessageListenerCiphertextToText.js:");
try {
    browser.runtime.onMessage.removeListener(ciphertextToText);
} catch (e) {}

