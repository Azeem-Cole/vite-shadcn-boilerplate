import { useState, useEffect } from "react";
import { Folder, Link as LinkIcon, ChevronLeft, Home } from "lucide-react";
import { Card, CardContent } from "@link-saver/ui";
import { Button } from "@link-saver/ui";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@link-saver/ui";
import { type Bookmark, isFolder, isLink } from "../types/bookmarks";
import { getFaviconUrl } from "./../utils/favicon";

type SimpleBookmarkGridProps = {
  bookmarks: Bookmark[];
  title?: string;
};

type PathItem = {
  id: string;
  title: string;
};

export function SimpleBookmarkGrid({
  bookmarks,
  title = "Bookmarks",
}: SimpleBookmarkGridProps) {
  // Extract the actual bookmarks from the first item's children
  // This skips the root container and starts at "Favorites Bar", "Other Favorites", etc.
  const rootBookmarks =
    bookmarks.length > 0 && bookmarks[0].children
      ? bookmarks[0].children
      : bookmarks;

  const [currentPath, setCurrentPath] = useState<PathItem[]>([
    { id: "root", title: "Home" },
  ]);
  const [currentBookmarks, setCurrentBookmarks] =
    useState<Bookmark[]>(rootBookmarks);

  // Update current bookmarks when the bookmarks prop changes
  useEffect(() => {
    const newRootBookmarks =
      bookmarks.length > 0 && bookmarks[0].children
        ? bookmarks[0].children
        : bookmarks;
    setCurrentBookmarks(newRootBookmarks);
    setCurrentPath([{ id: "root", title: "Home" }]);
  }, [bookmarks]);

  // Navigate to a folder
  const navigateToFolder = (folder: Bookmark) => {
    if (isFolder(folder) && folder.children) {
      const newPath = [...currentPath, { id: folder.id, title: folder.title }];
      setCurrentPath(newPath);
      setCurrentBookmarks(folder.children);
    }
  };

  // Navigate back one level
  const navigateBack = () => {
    if (currentPath.length > 1) {
      navigateToBreadcrumb(currentPath.length - 2);
    }
  };

  // Navigate to a specific breadcrumb item
  const navigateToBreadcrumb = (targetIndex: number) => {
    const newPath = currentPath.slice(0, targetIndex + 1);
    setCurrentPath(newPath);

    if (targetIndex === 0) {
      // Back to root
      setCurrentBookmarks(rootBookmarks);
    } else {
      // Find the folder at this path
      let current = rootBookmarks;
      for (let i = 1; i < newPath.length; i++) {
        const targetId = newPath[i].id;
        const folder = current.find(
          (item) => item.id === targetId && isFolder(item)
        );
        if (folder && isFolder(folder) && folder.children) {
          current = folder.children;
        }
      }
      setCurrentBookmarks(current);
    }
  };

 

  // Separate folders and links
  const folders = currentBookmarks.filter(isFolder);
  const links = currentBookmarks.filter(isLink);

  return (
    <div className="w-full space-y-4">
      {/* Header with simple navigation */}
      <div className="flex items-center gap-4 p-4 border-b">
        {/* {currentPath.length > 1 && (
          <Button variant="outline" size="sm" onClick={navigateBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )} */}

        {/* Proper breadcrumb navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            {currentPath.map((item, index) => (
              <div key={item.id} className="flex items-center">
                <BreadcrumbItem>
                  {index === currentPath.length - 1 ? (
                    <BreadcrumbPage className="flex items-center gap-1">
                      {index === 0 ? (
                        <Home className="h-4 w-4" />
                      ) : (
                        <Folder className="h-4 w-4" />
                      )}
                      {item.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      onClick={() => navigateToBreadcrumb(index)}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      {index === 0 ? (
                        <Home className="h-4 w-4" />
                      ) : (
                        <Folder className="h-4 w-4" />
                      )}
                      {item.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < currentPath.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Folders */}
        {folders.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Folders ({folders.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {folders.map((folder) => (
                <Card
                  key={folder.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                  onClick={() => navigateToFolder(folder)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Folder className="h-8 w-8 text-blue-600" />
                      <span
                        className="text-sm font-medium truncate w-full"
                        title={folder.title}
                      >
                        {folder.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {folder.children?.length || 0} items
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {links.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Links ({links.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {links.map((link) => (
                <Card
                  key={link.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={getFaviconUrl(link.url!)}
                        alt=""
                        className="h-8 w-8"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                      <span
                        className="text-sm font-medium truncate w-full"
                        title={link.title}
                      >
                        {link.title}
                      </span>
                      <span className="text-xs text-muted-foreground truncate w-full">
                        {new URL(link.url!).hostname}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {folders.length === 0 && links.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">This folder is empty</p>
            <p className="text-sm">No bookmarks or folders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
