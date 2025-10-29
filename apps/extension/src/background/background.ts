import { ExtensionMessage } from "../types";

// Background script for bookmark management
console.log("Bookmark Manager Extension - Background Script Loaded");

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details.reason);

  if (details.reason === "install") {
    // Set default settings on first install
    chrome.storage.sync.set({
      bookmarkSettings: {
        showBookmarkBar: true,
        sortBy: "dateAdded",
        maxRecentBookmarks: 10,
      },
    });
  }
});

// Handle bookmark changes
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  console.log("Bookmark created:", bookmark);
  // Send message to popup if it's open
  chrome.runtime
    .sendMessage({
      type: "BOOKMARK_CREATED",
      payload: bookmark,
    })
    .catch(() => {
      // Popup might not be open, ignore error
    });
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.log("Bookmark removed:", id);
  // Send message to popup if it's open
  chrome.runtime
    .sendMessage({
      type: "BOOKMARK_REMOVED",
      payload: { id, removeInfo },
    })
    .catch(() => {
      // Popup might not be open, ignore error
    });
});

chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  console.log("Bookmark changed:", id, changeInfo);
  // Send message to popup if it's open
  chrome.runtime
    .sendMessage({
      type: "BOOKMARK_CHANGED",
      payload: { id, changeInfo },
    })
    .catch(() => {
      // Popup might not be open, ignore error
    });
});

// Handle messages from popup/options
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse) => {
    console.log("Background received message:", message);

    switch (message.type) {
      case "GET_BOOKMARKS":
        chrome.bookmarks.getTree((bookmarkTree) => {
          sendResponse({ success: true, data: bookmarkTree });
        });
        return true; // Keep message channel open for async response

      case "ADD_BOOKMARK":
        const { title, url, parentId } = message.payload;
        chrome.bookmarks.create(
          {
            title,
            url,
            parentId,
          },
          (bookmark) => {
            if (chrome.runtime.lastError) {
              sendResponse({
                success: false,
                error: chrome.runtime.lastError.message,
              });
            } else {
              sendResponse({ success: true, data: bookmark });
            }
          }
        );
        return true;

      case "DELETE_BOOKMARK":
        chrome.bookmarks.remove(message.payload.id, () => {
          if (chrome.runtime.lastError) {
            sendResponse({
              success: false,
              error: chrome.runtime.lastError.message,
            });
          } else {
            sendResponse({ success: true });
          }
        });
        return true;

      case "UPDATE_BOOKMARK":
        const { id, updates } = message.payload;
        chrome.bookmarks.update(id, updates, (bookmark) => {
          if (chrome.runtime.lastError) {
            sendResponse({
              success: false,
              error: chrome.runtime.lastError.message,
            });
          } else {
            sendResponse({ success: true, data: bookmark });
          }
        });
        return true;

      default:
        sendResponse({ success: false, error: "Unknown message type" });
    }
  }
);

// Handle context menu for adding bookmarks
chrome.contextMenus.create({
  id: "add-bookmark",
  title: "Add to Bookmarks",
  contexts: ["page"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add-bookmark" && tab) {
    chrome.bookmarks.create({
      title: tab.title || "Untitled",
      url: tab.url,
    });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "downloadBookmarks") {
    try {
      const bookmarks = await chrome.bookmarks.getTree();

      const uploadResponse = await fetch(
        "http://localhost:3000/api/uploadBookmarks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookmarks }),
          credentials: "include",
        }
      );
      const result = await uploadResponse.json();
      sendResponse({ success: true, result });
    } catch (error) {
      console.error("Error downloading bookmarks:", error);
      sendResponse({ success: false, error: error.message });
    }
  }
});

export {};
