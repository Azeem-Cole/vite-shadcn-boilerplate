import { IconFolderCode, IconFolderQuestion, IconLink } from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";

import { Button } from "@link-saver/ui";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@link-saver/ui";

export const EmptyView = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconLink />
        </EmptyMedia>
        <EmptyTitle>No Links Yet</EmptyTitle>
        <EmptyDescription>
          You haven't added any links or imported any bookmarks. Get started by
          adding your first link.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Add Link</Button>
          <Button variant="outline">Import Bookmarks</Button>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        {/* <a href="#">
          Learn More <ArrowUpRightIcon />
        </a> */}
      </Button>
    </Empty>
  );
};
