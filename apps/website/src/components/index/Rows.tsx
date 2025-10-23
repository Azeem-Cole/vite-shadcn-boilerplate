import {
  ChevronRightIcon,
  ExternalLinkIcon,
  InfoIcon,
  ShieldAlertIcon,
  ArrowBigDown,
} from "lucide-react";

import { Button } from "@link-saver/ui";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@link-saver/ui";
import { getFaviconUrl } from "./../../utils/favicon";
import { Details } from "./LinkDetails";
import { Bookmark } from "types/bookmarks";
import { SortOption } from "types/sort";

export const Items = (bookmarks: Bookmark & { sortOption: SortOption }) => {
  const { title, url, dateAdded, dateLastUsed, sortOption } = bookmarks;
  const temp = getFaviconUrl(url || "");
  return (
    <div className="flex w-full max-w-3xl flex-col gap-2 ">
      <Item
        variant="outline"
        className="overflow-hidden flex flex-row gap-2 shadow-(--shadow-md)"
      >
        <span className="flex-1 overflow-hidden flex flex-row gap-2">
          <img
            src={temp}
            alt={title}
            className="h-8 w-8 rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription className="text-left">{url}</ItemDescription>
            <ItemDescription className="text-left">
              {(sortOption === "last-used" ||
                sortOption === "recently-added") &&
                new Date(
                  (sortOption === "last-used" ? dateLastUsed : dateAdded) || 0
                ).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
            </ItemDescription>
          </ItemContent>
        </span>

        <ItemActions>
          <Details {...bookmarks} />
          <Button variant="default">
            {"Go To"}
            <ExternalLinkIcon className="size-4" />
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
};
