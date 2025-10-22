import { Button, Input, Label, Spinner } from "@link-saver/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EmptyView } from "../components/index/Empty";
import { useBookmarks } from "./../utils/bookmarks";
import { Bookmark } from "./../types/bookmarks";
import { Items } from "./../components/index/Rows";
import { getUrlInfo } from "./../utils/favicon";
import { DropdownMenuCheckboxes } from "./../components/index/Dropdown";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [count, setCount] = useState(0);
  const { data: bookmarks, isLoading } = useBookmarks();

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
          title: getUrlInfo(bookmark.url || "")?.domain,
        };
      });
  };

  console.log(
    "bookmarks:",
    bookmarks[0].children,
    recursiveLinksOnly({ bookmarks: bookmarks })
  );

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 p-2">
      <div className="flex justify-between w-full max-w-3xl m-4">
        <Input placeholder="Search" />
      </div>

      <div className="flex-row flex">
        <div className="flex gap-2">
          <DropdownMenuCheckboxes />
          <Button variant="outline">Recently Added</Button>
          <Button variant="outline">Last Used</Button>
        </div>
      </div>
      {recursiveLinksOnly({ bookmarks }).map((bookmark) => (
        <Items key={bookmark.id} {...bookmark} />
      ))}
    </div>
  );
}
