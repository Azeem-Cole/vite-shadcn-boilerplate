import { useState, useEffect, useCallback, useReducer } from "react";
import { BookmarkTreeNode, BookmarkAction, BookmarkSettings } from "../types";
import BookmarkService from "../services/bookmarks";

interface BookmarkState {
  bookmarks: BookmarkTreeNode[];
  recentBookmarks: BookmarkTreeNode[];
  folders: BookmarkTreeNode[];
  loading: boolean;
  error: string | null;
}

const initialState: BookmarkState = {
  bookmarks: [],
  recentBookmarks: [],
  folders: [],
  loading: false,
  error: null,
};

function bookmarkReducer(
  state: BookmarkState,
  action: BookmarkAction
): BookmarkState {
  switch (action.type) {
    case "SET_BOOKMARKS":
      return { ...state, bookmarks: action.payload, loading: false };
    case "ADD_BOOKMARK":
      return {
        ...state,
        bookmarks: [...state.bookmarks, action.payload],
        recentBookmarks: [action.payload, ...state.recentBookmarks].slice(
          0,
          10
        ),
      };
    case "DELETE_BOOKMARK":
      return {
        ...state,
        bookmarks: state.bookmarks.filter(
          (bookmark) => bookmark.id !== action.payload
        ),
        recentBookmarks: state.recentBookmarks.filter(
          (bookmark) => bookmark.id !== action.payload
        ),
      };
    case "UPDATE_BOOKMARK":
      return {
        ...state,
        bookmarks: state.bookmarks.map((bookmark) =>
          bookmark.id === action.payload.id
            ? { ...bookmark, ...action.payload.updates }
            : bookmark
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function useBookmarks() {
  const [state, dispatch] = useReducer(bookmarkReducer, initialState);

  // Load all bookmarks
  const loadBookmarks = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const bookmarks = await BookmarkService.getAllBookmarks();
      const flatBookmarks = BookmarkService.flattenBookmarks(bookmarks);

      dispatch({ type: "SET_BOOKMARKS", payload: flatBookmarks });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Load recent bookmarks
  const loadRecentBookmarks = useCallback(async (limit: number = 10) => {
    try {
      const recentBookmarks = await BookmarkService.getRecentBookmarks(limit);
      dispatch({ type: "SET_BOOKMARKS", payload: recentBookmarks });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
    }
  }, []);

  // Load folders
  const loadFolders = useCallback(async () => {
    try {
      const folders = await BookmarkService.getFolders();
      return folders;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
      return [];
    }
  }, []);

  // Create bookmark
  const createBookmark = useCallback(
    async (title: string, url: string, parentId?: string) => {
      try {
        const bookmark = await BookmarkService.createBookmark({
          title,
          url,
          parentId,
        });
        dispatch({ type: "ADD_BOOKMARK", payload: bookmark });
        return bookmark;
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
        throw error;
      }
    },
    []
  );

  // Update bookmark
  const updateBookmark = useCallback(
    async (id: string, changes: { title?: string; url?: string }) => {
      try {
        const updatedBookmark = await BookmarkService.updateBookmark(
          id,
          changes
        );
        dispatch({
          type: "UPDATE_BOOKMARK",
          payload: { id, updates: changes },
        });
        return updatedBookmark;
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
        throw error;
      }
    },
    []
  );

  // Delete bookmark
  const deleteBookmark = useCallback(async (id: string) => {
    try {
      await BookmarkService.deleteBookmark(id);
      dispatch({ type: "DELETE_BOOKMARK", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
      throw error;
    }
  }, []);

  // Search bookmarks
  const searchBookmarks = useCallback(async (query: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const results = await BookmarkService.searchBookmarks(query);
      dispatch({ type: "SET_BOOKMARKS", payload: results });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Create folder
  const createFolder = useCallback(async (title: string, parentId?: string) => {
    try {
      const folder = await BookmarkService.createFolder(title, parentId);
      return folder;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
      throw error;
    }
  }, []);

  // Move bookmark
  const moveBookmark = useCallback(
    async (id: string, destination: { parentId?: string; index?: number }) => {
      try {
        const movedBookmark = await BookmarkService.moveBookmark(
          id,
          destination
        );
        return movedBookmark;
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
        throw error;
      }
    },
    []
  );

  // Download all bookmarks as JSON
  const downloadBookmarksAsJSON = useCallback(async () => {
    try {
      const result = await BookmarkService.exportBookmarksForDownload();
      return result;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
      throw error;
    }
  }, []);

  // Download all bookmarks as HTML (browser compatible format)
  const downloadBookmarksAsHTML = useCallback(async () => {
    try {
      const result = await BookmarkService.exportBookmarksAsHTML();
      return result;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
      throw error;
    }
  }, []);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return {
    ...state,
    loadBookmarks,
    loadRecentBookmarks,
    loadFolders,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    searchBookmarks,
    createFolder,
    moveBookmark,
    downloadBookmarksAsJSON,
    downloadBookmarksAsHTML,
  };
}

export function useBookmarkSettings() {
  const [settings, setSettings] = useState<BookmarkSettings>({
    showBookmarkBar: true,
    sortBy: "dateAdded",
    maxRecentBookmarks: 10,
  });
  const [loading, setLoading] = useState(false);

  // Load settings from Chrome storage
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);

      // Check if Chrome storage API is available
      if (typeof chrome === "undefined" || !chrome.storage) {
        console.warn("Chrome storage API is not available");
        return;
      }

      const result = await new Promise<{ bookmarkSettings?: BookmarkSettings }>(
        (resolve, reject) => {
          chrome.storage.sync.get(["bookmarkSettings"], (result) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(result);
            }
          });
        }
      );

      if (result.bookmarkSettings) {
        setSettings(result.bookmarkSettings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save settings to Chrome storage
  const saveSettings = useCallback(
    async (newSettings: Partial<BookmarkSettings>) => {
      try {
        setLoading(true);

        // Check if Chrome storage API is available
        if (typeof chrome === "undefined" || !chrome.storage) {
          throw new Error("Chrome storage API is not available");
        }

        const updatedSettings = { ...settings, ...newSettings };

        await new Promise<void>((resolve, reject) => {
          chrome.storage.sync.set({ bookmarkSettings: updatedSettings }, () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          });
        });

        setSettings(updatedSettings);
      } catch (error) {
        console.error("Failed to save settings:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [settings]
  );

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    saveSettings,
    loadSettings,
  };
}

export function useCurrentTab() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    // Check if Chrome tabs API is available
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          console.error("Error getting current tab:", chrome.runtime.lastError);
          return;
        }
        if (tabs[0]) {
          setCurrentTab(tabs[0]);
        }
      });
    }
  }, []);

  return currentTab;
}
