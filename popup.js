const filterTwitterTabs = () => {
    chrome.tabs.query({}, (tabs) => {
      const twitterTabs = tabs.filter((tab) => tab.url.includes('twitter.com') || tab.url.includes('x.com'));
      twitterTabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { message: 'filter' });
      });
    });
  };

const applyListener = () => {
    const filterText = document.getElementById('filterInput').value;
    if (filterText) {
        chrome.storage.sync.set({'filter': filterText}, () => {
          filterTwitterTabs();
        });
    }
};

chrome.storage.sync.get('filter', (filter) => document.getElementById('filterInput').value = filter.filter);

document.getElementById('applyFilter').addEventListener('click', applyListener);