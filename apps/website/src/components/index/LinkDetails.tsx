import { Button } from "@link-saver/ui";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@link-saver/ui";
import { Input } from "@link-saver/ui";
import { Label } from "@link-saver/ui";
import { Bookmark } from "types/bookmarks";
import { LinkDetailsDropdownMenu } from "./LinkDetails/LinkDetailsDropdown";

export const Details = ({ url, title }: Bookmark) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="shadow-(--shadow-md)">
            Details
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
            <DialogDescription>
              Make changes to your details here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title-1">Title</Label>
              <Input id="title-1" name="title" defaultValue={title} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url-1">URL</Label>
              <Input id="url-1" name="url" defaultValue={url} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="Tags-1">Tags</Label>
              <LinkDetailsDropdownMenu />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
