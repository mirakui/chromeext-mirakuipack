import * as moment from 'moment';
import * as $ from 'jquery';

let count = 0;

function sortTabs(tabs: chrome.tabs.Tab[]) {
  type TabListItem = {
    arrayIndex: number;
    tab: chrome.tabs.Tab;
  }
  let tabList: TabListItem[] = [];
  let tabIndexMap: number[] = [];
  for (let i=0; i<tabs.length; i++) {
    const tab = tabs[i];
    if (tab.pinned || tab.groupId > 0 || !tab.url) {
      continue;
    }
    else {
      tabList.push({arrayIndex: i, tab: tab});
      tabIndexMap.push(tab.index);
    }
  }

  tabList.sort((tab1: TabListItem, tab2: TabListItem) => {
    const url1 = tab1.tab.url.toUpperCase();
    const url2 = tab2.tab.url.toUpperCase();
    if (url1 < url2) { return -1; }
    else if (url2 < url1) { return 1; }
    else { return 0; }
  });
  console.log("sorted", tabList);

  for (let i=0; i<tabList.length; i++) {
    const tab = tabList[i];
    const index = tabIndexMap[i];
    chrome.tabs.move(tab.tab.id, {index: index});
  }
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
    chrome.windows.getAll(async (windows) => {
      for (let window of windows) {
        chrome.tabs.query({ windowId: window.id }, (tabs: chrome.tabs.Tab[]) => {
          sortTabs(tabs);
        });
      }
    })
  });

})();
