import { createFileRoute } from "@tanstack/react-router";
import { SimpleBookmarkGrid } from "../components/SimpleBookmarkGrid";
import { useBookmarks, sampleBookmarks } from "../utils/bookmarks";

export const Route = createFileRoute("/folders")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: bookmarks = [], isLoading: loading, error } = useBookmarks();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading bookmarks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  const bookmarksToShow = bookmarks.length === 0 ? sampleBookmarks : bookmarks;

  return (
    <div className="p-4">
      <SimpleBookmarkGrid bookmarks={bookmarksToShow} title="My Bookmarks" />
    </div>
  );
}
