
console.log("RemoveTabOnMessageListenerGetSelectedHTML.js:");
try {
    browser.runtime.onMessage.removeListener(getSelectedHTML);
} catch (e) {}

