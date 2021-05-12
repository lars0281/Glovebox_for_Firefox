
console.log("RemoveTabOnMessageListenerTextToCiphertext.js:");
try {
    browser.runtime.onMessage.removeListener(textToCiphertext);
} catch (e) {}

