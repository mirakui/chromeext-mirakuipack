chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.debug("MIRAKUIPACK: " + msg);
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});

function shorten_amazon_url() {
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

function close_zoom_success() {
  setTimeout(() => {
    window.close();
  }, 5_000);
}

function remove_query_string() {
  const url = window.location.toString().split("?")[0];
  window.history.pushState({}, "", url);
}

(() => {
  console.debug("MIRAKUIPACK: started at " + window.location.href);
  if (window.location.host.match(/\.?amazon\.co\.jp$/)) {
    console.debug("MIRAKUIPACK: shorten_amazon_url");
    shorten_amazon_url();
  }
  else if (window.location.host.match(/\.zoom\.us$/) && window.location.href.match(/[=#]success$/)) {
    console.debug("MIRAKUIPACK: close_zoom_success");
    close_zoom_success();
  }
  else if (window.location.search.match(/(fbclid|utm_source)=/)) {
    console.debug("MIRAKUIPACK: remove_query_string");
    remove_query_string();
  }
})();
