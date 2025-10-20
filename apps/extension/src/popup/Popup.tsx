import React, { useState, useEffect } from "react";
import { BookmarkTreeNode } from "../types";
import { useBookmarks, useCurrentTab } from "../hooks/useBookmarks";
import {
  Bookmark,
  Plus,
  Search,
  Trash2,
  Folder,
  ExternalLink,
  Settings,
  Star,
  Download,
  FileJson,
  FileText,
} from "lucide-react";
import { downloadFile } from "../lib/utils";
import { DropdownMenu } from "../components/DropdownMenu";
import { Button } from "@link-saver/ui";

interface BookmarkItemProps {
  bookmark: BookmarkTreeNode;
  onDelete: (id: string) => void;
  onEdit: (bookmark: BookmarkTreeNode) => void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({
  bookmark,
  onDelete,
  onEdit,
}) => {
  const handleClick = () => {
    if (bookmark.url) {
      chrome.tabs.create({ url: bookmark.url });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(bookmark.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(bookmark);
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md group cursor-pointer">
      <div className="flex items-center flex-1 min-w-0" onClick={handleClick}>
        {bookmark.url ? (
          <Bookmark className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
        ) : (
          <Folder className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {bookmark.title}
          </div>
          {bookmark.url && (
            <div className="text-xs text-gray-500 truncate">{bookmark.url}</div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {bookmark.url && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleClick}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleEdit}
        >
          <Settings className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-red-500 hover:text-red-700"
          onClick={handleDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const AddBookmarkForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, url: string, parentId?: string) => void;
  currentTab?: chrome.tabs.Tab | null;
}> = ({ isOpen, onClose, onAdd, currentTab }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    if (isOpen && currentTab) {
      setTitle(currentTab.title || "");
      setUrl(currentTab.url || "");
    }
  }, [isOpen, currentTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      onAdd(title.trim(), url.trim(), parentId || undefined);
      setTitle("");
      setUrl("");
      setParentId("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="border-t p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Bookmark title"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
            required
          />
        </div>
        <div className="flex space-x-2">
          <Button type="submit" size="sm" className="flex-1">
            Add Bookmark
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export const Popup: React.FC = () => {
  // Check if Chrome APIs are available
  const isChromeApiAvailable =
    typeof chrome !== "undefined" && chrome.bookmarks;

  const {
    bookmarks,
    loading,
    error,
    createBookmark,
    deleteBookmark,
    updateBookmark,
    searchBookmarks,
    loadBookmarks,
    downloadBookmarksAsJSON,
    downloadBookmarksAsHTML,
  } = useBookmarks();

  const currentTab = useCurrentTab();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBookmark, setEditingBookmark] =
    useState<BookmarkTreeNode | null>(null);

  // Filter bookmarks based on search query
  const filteredBookmarks = searchQuery
    ? bookmarks.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (bookmark.url &&
            bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : bookmarks.filter((bookmark) => bookmark.url); // Only show actual bookmarks, not folders

  const handleAddBookmark = async (
    title: string,
    url: string,
    parentId?: string
  ) => {
    try {
      await createBookmark(title, url, parentId);
    } catch (error) {
      console.error("Failed to add bookmark:", error);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    if (confirm("Are you sure you want to delete this bookmark?")) {
      try {
        await deleteBookmark(id);
      } catch (error) {
        console.error("Failed to delete bookmark:", error);
      }
    }
  };

  const handleEditBookmark = (bookmark: BookmarkTreeNode) => {
    setEditingBookmark(bookmark);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchBookmarks(query);
    } else {
      loadBookmarks();
    }
  };

  const openOptionsPage = () => {
    if (chrome?.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  };

  // Handle bookmark download as JSON
  const handleDownloadAsJSON = async () => {
    try {
      const exportData = await downloadBookmarksAsJSON();
      downloadFile(exportData);
    } catch (error) {
      console.error("Failed to download bookmarks as JSON:", error);
    }
  };

  // Handle bookmark download as HTML
  const handleDownloadAsHTML = async () => {
    try {
      const exportData = await downloadBookmarksAsHTML();
      downloadFile(exportData);
    } catch (error) {
      console.error("Failed to download bookmarks as HTML:", error);
    }
  };

  // Show error message if Chrome APIs are not available
  if (!isChromeApiAvailable) {
    return (
      <div className="w-80 h-96 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ Extension Error</div>
          <div className="text-sm text-gray-600">
            Chrome extension APIs are not available. Please ensure the extension
            is properly loaded.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-80 h-96 flex items-center justify-center">
        <div className="text-gray-500">Loading bookmarks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 h-96 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-80 h-96 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-900">Bookmarks</h1>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowAddForm(!showAddForm)}
              title="Add bookmark"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Download bookmarks"
                >
                  <Download className="h-4 w-4" />
                </Button>
              }
              items={[
                {
                  label: "Download as HTML",
                  icon: <FileText className="h-4 w-4" />,
                  onClick: handleDownloadAsHTML,
                },
                {
                  label: "Download as JSON",
                  icon: <FileJson className="h-4 w-4" />,
                  onClick: handleDownloadAsJSON,
                },
              ]}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={openOptionsPage}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="flex-1 overflow-y-auto">
        {filteredBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Star className="h-8 w-8 mb-2" />
            <p className="text-sm">No bookmarks found</p>
            <p className="text-xs">Add your first bookmark!</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                onDelete={handleDeleteBookmark}
                onEdit={handleEditBookmark}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Bookmark Form */}
      <AddBookmarkForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={handleAddBookmark}
        currentTab={currentTab}
      />
    </div>
  );
};

export default Popup;
