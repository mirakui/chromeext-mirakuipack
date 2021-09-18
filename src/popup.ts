import * as moment from 'moment';
import * as $ from 'jquery';

let count = 0;

function sortTabs(tabs: chrome.tabs.Tab[]) {
  let tabList: chrome.tabs.Tab[] = [];
  let tabIndexMap: number[] = [];
  for (let tab of tabs) {
    if (tab.pinned || tab.groupId > 0 || !tab.url) {
      continue;
    }
    else {
      tabList.push(tab);
      tabIndexMap.push(tab.index);
    }
  }

  tabList.sort((tab1: chrome.tabs.Tab, tab2: chrome.tabs.Tab) => {
    const url1 = tab1.url.toUpperCase();
    const url2 = tab2.url.toUpperCase();
    if (url1 < url2) { return -1; }
    else if (url2 < url1) { return 1; }
    else { return 0; }
  });
  console.log("sorted", tabList);

  for (let i=0; i<tabList.length; i++) {
    const tab = tabList[i];
    // const index = tabIndexMap[i];
    const index = i;
    chrome.tabs.move(tab.id, {index: index});
  }
}

function uniqifyTabs(tabs: chrome.tabs.Tab[]) {
  let urls: Set<string> = new Set;
  for (let tab of tabs) {
    if (tab.pinned || !tab.url) {
      continue;
    }
    if (urls.has(tab.url)) {
      chrome.tabs.remove(tab.id);
    }
    else {
      urls.add(tab.url);
    }
  }
}

function removeUnnecessaryTabs(tabs: chrome.tabs.Tab[]) {
  for (let tab of tabs) {
    if (tab.pinned) {
      continue;
    }
    if (!tab.url ||
      tab.url.startsWith("https://www.google.com/search?") ||
      tab.url.startsWith("https://login.microsoftonline.com/")
    ) {
      chrome.tabs.remove(tab.id);
    }
  }
}

function runTabGC() {
  chrome.windows.getAll(async (windows) => {
    for (let window of windows) {
      chrome.tabs.query({ windowId: window.id }, (tabs: chrome.tabs.Tab[]) => {
        sortTabs(tabs);
        uniqifyTabs(tabs);
      });
    }
  })
}

(() => {
  const queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    $('#url').text(tabs[0].url);
    $('#time').text(moment().format('YYYY-MM-DD HH:mm:ss'));
  });

  chrome.browserAction.setBadgeText({text: count.toString()});
  $('#countUp').click(()=>{
    chrome.browserAction.setBadgeText({text: (++count).toString()});
  });

  $('#changeBackground').click(()=>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        color: '#555555'
      },
      function(msg) {
        console.log("result message:", msg);
      });
    });
  });
  $('#gc').click(() => {
    runTabGC();
  });

})();
