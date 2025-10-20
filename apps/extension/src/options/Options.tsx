import React, { useState } from "react";
import { useBookmarkSettings, useBookmarks } from "../hooks/useBookmarks";
import {
  Settings,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
} from "lucide-react";
import BookmarkService from "../services/bookmarks";
import { Button } from "@link-saver/ui";

export const Options: React.FC = () => {
  const { settings, loading, saveSettings } = useBookmarkSettings();
  const { loadBookmarks } = useBookmarks();
  const [exportLoading, setExportLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  const handleSettingChange = async (
    key: keyof typeof settings,
    value: any
  ) => {
    try {
      await saveSettings({ [key]: value });
    } catch (error) {
      console.error("Failed to save setting:", error);
    }
  };

  const handleExportBookmarks = async () => {
    try {
      setExportLoading(true);
      const exportData = await BookmarkService.exportBookmarks();

      const blob = new Blob([exportData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookmarks-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export bookmarks:", error);
      alert("Failed to export bookmarks. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleSyncBookmarks = async () => {
    try {
      setSyncLoading(true);
      await loadBookmarks();
      alert("Bookmarks synced successfully!");
    } catch (error) {
      console.error("Failed to sync bookmarks:", error);
      alert("Failed to sync bookmarks. Please try again.");
    } finally {
      setSyncLoading(false);
    }
  };

  const handleClearCache = () => {
    if (
      confirm(
        "Are you sure you want to clear the extension cache? This will not delete your bookmarks."
      )
    ) {
      chrome.storage.local.clear(() => {
        alert("Cache cleared successfully!");
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bookmark Manager Settings
        </h1>
        <p className="text-gray-600">
          Customize your bookmark management experience
        </p>
      </div>

      {/* General Settings */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          General Settings
        </h2>

        <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
          {/* Show Bookmark Bar */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Show Bookmark Bar
              </label>
              <p className="text-xs text-gray-500">
                Display the browser bookmark bar
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                aria-label="checkbox"
                type="checkbox"
                checked={settings.showBookmarkBar}
                onChange={(e) =>
                  handleSettingChange("showBookmarkBar", e.target.checked)
                }
                className="sr-only peer"
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Sort By */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Sort Bookmarks By
              </label>
              <p className="text-xs text-gray-500">
                Default sorting method for bookmarks
              </p>
            </div>
            <select
              value={settings.sortBy}
              onChange={(e) =>
                handleSettingChange(
                  "sortBy",
                  e.target.value as "dateAdded" | "title" | "url"
                )
              }
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="dateAdded">Date Added</option>
              <option value="title">Title</option>
              <option value="url">URL</option>
            </select>
          </div>

          {/* Max Recent Bookmarks */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Recent Bookmarks Limit
              </label>
              <p className="text-xs text-gray-500">
                Maximum number of recent bookmarks to show
              </p>
            </div>
            <input
              type="number"
              min="5"
              max="50"
              value={settings.maxRecentBookmarks}
              onChange={(e) =>
                handleSettingChange(
                  "maxRecentBookmarks",
                  parseInt(e.target.value)
                )
              }
              className="w-20 text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Data Management
        </h2>

        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          {/* Export Bookmarks */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Export Bookmarks
              </h3>
              <p className="text-xs text-gray-500">
                Download your bookmarks as a JSON file
              </p>
            </div>
            <Button
              onClick={handleExportBookmarks}
              disabled={exportLoading}
              size="sm"
              className="flex items-center"
            >
              {exportLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export
            </Button>
          </div>

          {/* Sync Bookmarks */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Sync Bookmarks
              </h3>
              <p className="text-xs text-gray-500">
                Refresh bookmarks from browser storage
              </p>
            </div>
            <Button
              onClick={handleSyncBookmarks}
              disabled={syncLoading}
              size="sm"
              variant="outline"
              className="flex items-center"
            >
              {syncLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync
            </Button>
          </div>

          {/* Clear Cache */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Clear Cache</h3>
              <p className="text-xs text-gray-500">
                Clear extension cache and temporary data
              </p>
            </div>
            <Button
              onClick={handleClearCache}
              size="sm"
              variant="destructive"
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Keyboard Shortcuts
        </h2>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Open Extension</span>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                Alt + B
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Add Current Page</span>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                Ctrl + D
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Search Bookmarks</span>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                Ctrl + F
              </kbd>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Note: Keyboard shortcuts can be customized in Chrome's Extension
              settings.
            </p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
        <div className="text-sm text-gray-600">
          <p className="mb-2">Bookmark Manager Extension v1.0.0</p>
          <p className="mb-2">Built with React, TypeScript, and Tailwind CSS</p>
          <p>Powered by Chrome Extensions API</p>
        </div>
      </div>
    </div>
  );
};

export default Options;
