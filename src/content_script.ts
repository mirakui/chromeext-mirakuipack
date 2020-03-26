chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});

window.onload = () => {
  console.log("HELLO!!!!!!!!!");
  if (window.location.host.match(/\.?amazon\.co\.jp$/)) {
    const asinElement = <HTMLInputElement>(
      document.querySelector(
        '#ASIN, input[name="idx.asin"], input[name="ASIN.0"]'
      )
    );
    if (asinElement) {
      const path = "/dp/" + asinElement.value;
      window.history.pushState({}, "", path);
    }
  }
};
