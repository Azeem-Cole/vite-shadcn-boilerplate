import { Card, Spinner } from "@link-saver/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EmptyView } from "./../components/index/Empty";
import { useBookmarks } from "./../utils/bookmarks";
import { Bookmark } from "./../types/bookmarks";
import { getFaviconUrl, getUrlInfo } from "./../utils/favicon";

export const Route = createFileRoute("/sites")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: bookmarks, isLoading } = useBookmarks();
  const navigate = Route.useNavigate();

  const recursiveLinksOnly = ({ bookmarks }: { bookmarks: Bookmark[] }) => {
    return bookmarks
      .flatMap((bookmark) => {
        if (bookmark.children && bookmark.children.length > 0) {
          return recursiveLinksOnly({ bookmarks: bookmark.children });
        } else {
          return bookmark;
        }
      })
      .filter((bookmark) => bookmark.url); // Only include bookmarks with URLs
  };

  const allLinks = recursiveLinksOnly({ bookmarks: bookmarks || [] });

  // Group links by domain
  const domainGroups = allLinks.reduce(
    (acc, bookmark) => {
      const urlInfo = getUrlInfo(bookmark.url || "");
      const domain = urlInfo?.domain || "Unknown";

      if (!acc[domain]) {
        acc[domain] = {
          domain,
          count: 0,
          links: [],
        };
      }

      acc[domain].count++;
      acc[domain].links.push(bookmark);

      return acc;
    },
    {} as Record<string, { domain: string; count: number; links: Bookmark[] }>
  );

  // Convert to array and sort by count (descending)
  const uniqueDomainsArray = (
    Object.values(domainGroups) as Array<{
      domain: string;
      count: number;
      links: Bookmark[];
    }>
  ).sort((a, b) => b.count - a.count);
  const allLinksCount = allLinks.length;

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
    <div className="p-4 flex flex-1 flex-col h-full ">
      <h1 className="text-2xl font-bold mb-4">Sites by Domain</h1>

      <div className="gap-4 flex w-full flex-wrap grow flex-1 pb-2 ">
        {uniqueDomainsArray.map((domainGroup) => (
          <Card
            key={domainGroup.domain}
            className="p-4 border rounded-lg flex-1 justify-between shadow-(--shadow-md) cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-400 transition-all duration-200"
            onClick={() =>
              navigate({
                to: "/sites/$domain",
                params: { domain: encodeURIComponent(domainGroup.domain) },
              })
            }
          >
            <div className="flex justify-between items-center mb-2">
              <img
                src={getFaviconUrl(domainGroup.links[0].url || "")}
                alt={domainGroup.domain}
                className="h-12 w-12 rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {domainGroup.count} link{domainGroup.count !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-semibold">{domainGroup.domain}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
