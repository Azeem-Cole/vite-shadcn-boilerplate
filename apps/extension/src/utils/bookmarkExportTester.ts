/**
 * This is a test utility to verify the bookmark download functionality.
 * It's for development purposes only.
 */

import BookmarkService from "../services/bookmarks";
import { downloadFile } from "../lib/utils";

/**
 * Test the bookmark export functionality with both formats
 */
export async function testBookmarkExport() {
  try {
    // Test JSON export
    console.log("Testing JSON export...");
    const jsonExport = await BookmarkService.exportBookmarksForDownload();
    console.log("JSON export successful:", jsonExport.filename);

    // Parse the JSON to validate structure
    const bookmarks = JSON.parse(jsonExport.data);
    console.log("Bookmark tree structure:", {
      rootNodesCount: bookmarks.length,
      totalItems: BookmarkService.flattenBookmarks(bookmarks).length,
    });

    // Test HTML export
    console.log("Testing HTML export...");
    const htmlExport = await BookmarkService.exportBookmarksAsHTML();
    console.log("HTML export successful:", htmlExport.filename);
    console.log(
      "HTML content starts with:",
      htmlExport.data.substring(0, 100) + "..."
    );

    return {
      success: true,
      jsonExport,
      htmlExport,
    };
  } catch (error) {
    console.error("Test failed:", error);
    return {
      success: false,
      error,
    };
  }
}

/**
 * Test downloading bookmarks
 */
export async function testBookmarkDownload() {
  try {
    console.log("Testing bookmark download...");

    // Get exports
    const jsonExport = await BookmarkService.exportBookmarksForDownload();
    const htmlExport = await BookmarkService.exportBookmarksAsHTML();

    // Try downloading HTML format (more universally compatible)
    downloadFile(htmlExport);

    console.log("Download initiated for HTML format");
    return { success: true };
  } catch (error) {
    console.error("Download test failed:", error);
    return { success: false, error };
  }
}
