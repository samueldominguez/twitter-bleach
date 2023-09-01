const filterTweets = () => {
  chrome.storage.sync.get('filter', (filter) => {
    const filterText = filter.filter;
    if (!filterText || !filterText.length) return;

    const tweets = document.querySelectorAll('[data-testid="tweet"]');
    tweets.forEach((tweet) => {
      const tweetText = tweet.innerText.toLowerCase();
      if (tweetText.includes(filterText.toLowerCase())) {
        // Hide the tweet by setting display: none
        tweet.style.display = 'none';

        // Traverse up the DOM tree to find the parent div (3 levels up)
        let parentDiv = tweet;
        for (let i = 0; i < 3; i++) {
          parentDiv = parentDiv.parentNode;
          if (!parentDiv) break; // To handle cases where the tree depth is less than 3
        }

        // Check if the parent div has the attribute "data-testid='cellInnerDiv'"
        if (parentDiv && parentDiv.getAttribute('data-testid') === 'cellInnerDiv') {
          // Hide the parent div as well
          parentDiv.style.display = 'none';
        }
      }
    });
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'filter') {
    filterTweets();
  }
});

const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

const observer = new MutationObserver((mutations, observer) => {
  filterTweets();
});

observer.observe(document, {
  subtree: true,
  attributes: true
});

// run first time we load
filterTweets();
