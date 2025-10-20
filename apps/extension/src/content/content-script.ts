// Content script for bookmark extension
// This script runs in the context of web pages

console.log("Bookmark Manager Extension - Content Script Loaded");

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);

  switch (message.type) {
    case "GET_PAGE_INFO":
      // Get current page information
      const pageInfo = {
        title: document.title,
        url: window.location.href,
        description: getPageDescription(),
        favicon: getFaviconUrl(),
      };
      sendResponse({ success: true, data: pageInfo });
      break;

    case "HIGHLIGHT_TEXT":
      // Highlight selected text (future feature)
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        sendResponse({ success: true, data: selection.toString() });
      } else {
        sendResponse({ success: false, error: "No text selected" });
      }
      break;

    default:
      sendResponse({ success: false, error: "Unknown message type" });
  }

  return true; // Keep message channel open for async response
});

// Helper functions
function getPageDescription(): string {
  const metaDescription = document.querySelector(
    'meta[name="description"]'
  ) as HTMLMetaElement;
  if (metaDescription) {
    return metaDescription.content;
  }

  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  ) as HTMLMetaElement;
  if (ogDescription) {
    return ogDescription.content;
  }

  // Fallback to first paragraph text
  const firstParagraph = document.querySelector("p");
  if (firstParagraph) {
    return firstParagraph.textContent?.slice(0, 200) + "..." || "";
  }

  return "";
}

function getFaviconUrl(): string {
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon) {
    return favicon.href;
  }

  const shortcutIcon = document.querySelector(
    'link[rel="shortcut icon"]'
  ) as HTMLLinkElement;
  if (shortcutIcon) {
    return shortcutIcon.href;
  }

  // Default favicon location
  return `${window.location.origin}/favicon.ico`;
}

// Add context menu functionality for quick bookmark adding
document.addEventListener("contextmenu", (event) => {
  const target = event.target as HTMLElement;

  // Store the context menu target for potential bookmark creation
  if (target.tagName === "A") {
    const link = target as HTMLAnchorElement;
    sessionStorage.setItem(
      "contextMenuLink",
      JSON.stringify({
        title: link.textContent || link.href,
        url: link.href,
      })
    );
  }
});

// Listen for keyboard shortcuts
document.addEventListener("keydown", (event) => {
  // Ctrl/Cmd + D to add current page as bookmark
  if ((event.ctrlKey || event.metaKey) && event.key === "d") {
    event.preventDefault();

    chrome.runtime.sendMessage({
      type: "ADD_CURRENT_PAGE",
      payload: {
        title: document.title,
        url: window.location.href,
      },
    });
  }
});

export {};
