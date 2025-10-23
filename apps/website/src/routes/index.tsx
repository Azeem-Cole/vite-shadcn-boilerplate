import { Button, Input, Label, Spinner } from "@link-saver/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { EmptyView } from "../components/index/Empty";
import { useBookmarks } from "./../utils/bookmarks";
import { Bookmark } from "./../types/bookmarks";
import { Items } from "./../components/index/Rows";
import { getUrlInfo } from "./../utils/favicon";
import { DropdownMenuCheckboxes } from "./../components/index/Dropdown";
import { motion } from "framer-motion";
import { SortOption } from "./../types/sort";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const { data: bookmarks, isLoading } = useBookmarks();

  const recursiveLinksOnly = ({ bookmarks }: { bookmarks: Bookmark[] }) => {
    return bookmarks
      .flatMap((bookmark) => {
        if (bookmark.children && bookmark.children.length > 0) {
          return recursiveLinksOnly({ bookmarks: bookmark.children });
        } else {
          return bookmark;
        }
      })
      .map((bookmark) => {
        return {
          ...bookmark,
          title:
            bookmark.url === bookmark.title
              ? getUrlInfo(bookmark.url || "")?.domain
              : bookmark.title,
        };
      });
  };

  const allLinks = useMemo(() => {
    if (!bookmarks) return [];
    return recursiveLinksOnly({ bookmarks });
  }, [bookmarks]);

  const filteredLinks = useMemo(() => {
    let links: Bookmark[] = allLinks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      links = links.filter((bookmark) => {
        const title = bookmark.title?.toLowerCase() || "";
        const url = bookmark.url?.toLowerCase() || "";
        return title.includes(query) || url.includes(query);
      });
    }

    // Apply sorting
    if (sortBy === "recently-added") {
      links = [...links].sort((a, b) => {
        const dateA = a.dateAdded || 0;
        const dateB = b.dateAdded || 0;
        return dateB - dateA; // Most recent first
      });
    } else if (sortBy === "last-used") {
      links = [...links].sort((a, b) => {
        const dateA = a.dateLastUsed || 0;
        const dateB = b.dateLastUsed || 0;
        return dateB - dateA; // Most recent first
      });
    } else if (sortBy === "alphabetical") {
      links = [...links].sort((a, b) => {
        const titleA = a.title?.toLowerCase() || "";
        const titleB = b.title?.toLowerCase() || "";
        return titleA.localeCompare(titleB);
      });
    }

    return links;
  }, [allLinks, searchQuery, sortBy]);

  if (bookmarks === undefined || bookmarks.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyView />
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="size-8 text-green-500" />
        Loading
      </div>
    );
  }

  return (
    <div className="flex w-full items-center  flex-col ">
      <div className="flex justify-between w-full max-w-3xl m-4 gap-2 ">
        <Input
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex-row flex">
          <div className="flex gap-2">
            <DropdownMenuCheckboxes />
            <Button
              variant={sortBy === "recently-added" ? "default" : "outline"}
              onClick={() =>
                setSortBy(
                  sortBy === "recently-added" ? "none" : "recently-added"
                )
              }
            >
              Recently Added
            </Button>
            <Button
              variant={sortBy === "last-used" ? "default" : "outline"}
              onClick={() =>
                setSortBy(sortBy === "last-used" ? "none" : "last-used")
              }
            >
              Last Used
            </Button>
            <Button
              variant={sortBy === "alphabetical" ? "default" : "outline"}
              onClick={() =>
                setSortBy(sortBy === "alphabetical" ? "none" : "alphabetical")
              }
            >
              Alphabetical
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-2 p-2 flex-1">
        <ul className="gap-2 flex flex-col">
          {filteredLinks.length === 0 && searchQuery.trim() ? (
            <motion.li className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>No bookmarks found for "{searchQuery}"</p>
            </motion.li>
          ) : (
            filteredLinks.map((bookmark) => (
              <motion.li key={bookmark.id} layout>
                <Items key={bookmark.id} {...bookmark} sortOption={sortBy} />
              </motion.li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
