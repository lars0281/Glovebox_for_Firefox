
console.log("RemoveTabOnMessageListenerGetGloveboxCiphertext.js:");
try {
    browser.runtime.onMessage.removeListener(getGloveboxCiphertext);
} catch (e) {}

