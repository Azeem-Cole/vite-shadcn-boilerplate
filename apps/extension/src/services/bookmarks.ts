import { Bookmark, BookmarkCreateDetails, BookmarkTreeNode } from "../types";

export class BookmarkService {
  /**
   * Check if Chrome bookmarks API is available
   */
  static isAvailable(): boolean {
    return typeof chrome !== "undefined" && chrome.bookmarks !== undefined;
  }

  /**
   * Get all bookmarks from Chrome API
   */
  static async getAllBookmarks(): Promise<BookmarkTreeNode[]> {
    if (!this.isAvailable()) {
      throw new Error("Chrome bookmarks API is not available");
    }

    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree((bookmarkTree) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(bookmarkTree);
        }
      });
    });
  }

  /**
   * Get bookmarks in a specific folder
   */
  static async getBookmarksInFolder(
    folderId: string
  ): Promise<BookmarkTreeNode[]> {
    if (!this.isAvailable()) {
      throw new Error("Chrome bookmarks API is not available");
    }

    return new Promise((resolve, reject) => {
      chrome.bookmarks.getChildren(folderId, (children) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(children);
        }
      });
    });
  }

  /**
   * Search bookmarks by query
   */
  static async searchBookmarks(query: string): Promise<BookmarkTreeNode[]> {
    if (!this.isAvailable()) {
      throw new Error("Chrome bookmarks API is not available");
    }
    return new Promise((resolve, reject) => {
      chrome.bookmarks.search(query, (results) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * Create a new bookmark
   */
  static async createBookmark(
    details: BookmarkCreateDetails
  ): Promise<BookmarkTreeNode> {
    if (!this.isAvailable()) {
      throw new Error("Chrome bookmarks API is not available");
    }

    return new Promise((resolve, reject) => {
      chrome.bookmarks.create(details, (bookmark) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(bookmark);
        }
      });
    });
  }

  /**
   * Update an existing bookmark
   */
  static async updateBookmark(
    id: string,
    changes: { title?: string; url?: string }
  ): Promise<BookmarkTreeNode> {
    if (!this.isAvailable()) {
      throw new Error("Chrome bookmarks API is not available");
    }

    return new Promise((resolve, reject) => {
      chrome.bookmarks.update(id, changes, (bookmark) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(bookmark);
        }
      });
    });
  }

  /**
   * Delete a bookmark
   */
  static async deleteBookmark(id: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error("Chrome bookmarks API is not available");
    }

    return new Promise((resolve, reject) => {
      chrome.bookmarks.remove(id, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Create a new folder
   */
  static async createFolder(
    title: string,
    parentId?: string
  ): Promise<BookmarkTreeNode> {
    if (!this.isAvailable()) {
      throw new Error("Chrome bookmarks API is not available");
    }

    return new Promise((resolve, reject) => {
      chrome.bookmarks.create({ title, parentId }, (folder) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(folder);
        }
      });
    });
  }

  /**
   * Move a bookmark to a different folder
   */
  static async moveBookmark(
    id: string,
    destination: { parentId?: string; index?: number }
  ): Promise<BookmarkTreeNode> {
    if (!this.isAvailable()) {
      throw new Error("Chrome bookmarks API is not available");
    }

    return new Promise((resolve, reject) => {
      chrome.bookmarks.move(id, destination, (bookmark) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(bookmark);
        }
      });
    });
  }

  /**
   * Get recent bookmarks
   */
  static async getRecentBookmarks(
    limit: number = 10
  ): Promise<BookmarkTreeNode[]> {
    const allBookmarks = await this.getAllBookmarks();
    const flatBookmarks = this.flattenBookmarks(allBookmarks);

    // Filter out folders and sort by dateAdded
    const recentBookmarks = flatBookmarks
      .filter((bookmark) => bookmark.url) // Only actual bookmarks, not folders
      .sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
      .slice(0, limit);

    return recentBookmarks;
  }

  /**
   * Flatten nested bookmark structure
   */
  static flattenBookmarks(bookmarks: BookmarkTreeNode[]): BookmarkTreeNode[] {
    const result: BookmarkTreeNode[] = [];

    function flatten(nodes: BookmarkTreeNode[]) {
      for (const node of nodes) {
        result.push(node);
        if (node.children) {
          flatten(node.children);
        }
      }
    }

    flatten(bookmarks);
    return result;
  }

  /**
   * Get bookmark folders only
   */
  static async getFolders(): Promise<BookmarkTreeNode[]> {
    const allBookmarks = await this.getAllBookmarks();
    const flatBookmarks = this.flattenBookmarks(allBookmarks);

    return flatBookmarks.filter((bookmark) => !bookmark.url); // Folders don't have URLs
  }

  /**
   * Export bookmarks as JSON
   */
  static async exportBookmarks(): Promise<string> {
    const bookmarks = await this.getAllBookmarks();
    return JSON.stringify(bookmarks, null, 2);
  }

  /**
   * Export bookmarks with folder structure for download
   */
  static async exportBookmarksForDownload(): Promise<{
    data: string;
    filename: string;
    contentType: string;
  }> {
    const bookmarks = await this.getAllBookmarks();
    const currentDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    return {
      data: JSON.stringify(bookmarks, null, 2),
      filename: `bookmarks-export-${currentDate}.json`,
      contentType: "application/json",
    };
  }

  /**
   * Export bookmarks in HTML format (compatible with most browsers)
   */
  static async exportBookmarksAsHTML(): Promise<{
    data: string;
    filename: string;
    contentType: string;
  }> {
    const bookmarks = await this.getAllBookmarks();
    const currentDate = new Date().toISOString().split("T")[0];

    // Convert bookmarks tree to HTML format
    const html = this.convertBookmarksToHTML(bookmarks);

    return {
      data: html,
      filename: `bookmarks-export-${currentDate}.html`,
      contentType: "text/html",
    };
  }

  /**
   * Convert bookmarks tree to HTML format (browser compatible)
   */
  private static convertBookmarksToHTML(bookmarks: BookmarkTreeNode[]): string {
    const doctype = "<!DOCTYPE NETSCAPE-Bookmark-file-1>\n";
    const header =
      '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n' +
      "<TITLE>Bookmarks</TITLE>\n" +
      "<H1>Bookmarks</H1>\n";

    const body = this.renderFolderToHTML(bookmarks);

    return doctype + "<HTML>\n" + header + body + "</HTML>";
  }

  /**
   * Render a folder to HTML (recursive)
   */
  private static renderFolderToHTML(
    nodes: BookmarkTreeNode[],
    indent: string = ""
  ): string {
    let html = indent + "<DL><p>\n";

    for (const node of nodes) {
      if (node.url) {
        // It's a bookmark
        html += `${indent}  <DT><A HREF="${node.url}" ADD_DATE="${
          node.dateAdded || ""
        }">${node.title}</A>\n`;
      } else if (node.children) {
        // It's a folder
        html += `${indent}  <DT><H3 ADD_DATE="${
          node.dateAdded || ""
        }" LAST_MODIFIED="${node.dateGroupModified || ""}">${
          node.title
        }</H3>\n`;
        html += this.renderFolderToHTML(node.children, indent + "  ");
      }
    }

    html += indent + "</DL><p>\n";
    return html;
  }
}

export default BookmarkService;
