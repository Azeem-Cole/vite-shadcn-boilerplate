export type Bookmark = {
  id: string;
  title: string;
  url?: string;
  dateAdded?: number;
  dateLastUsed?: number;
  dateGroupModified?: number;
  index: number;
  parentId: string;
  syncing: boolean;
  children?: Bookmark[];
}

export const isFolder = (item: Bookmark): boolean => {
  return !!item.children && item.children.length > 0;
};

export const isLink = (item: Bookmark): boolean => {
  return !!item.url && !item.children;
};
