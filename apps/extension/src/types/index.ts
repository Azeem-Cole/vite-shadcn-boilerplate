export interface Bookmark {
  id: string;
  title: string;
  url?: string;
  dateAdded?: number;
  parentId?: string;
  children?: Bookmark[];
  index?: number;
}

export interface BookmarkTreeNode {
  id: string;
  parentId?: string;
  index?: number;
  title: string;
  url?: string;
  dateAdded?: number;
  dateGroupModified?: number;
  children?: BookmarkTreeNode[];
}

export interface BookmarkCreateDetails {
  parentId?: string;
  index?: number;
  title?: string;
  url?: string;
}

export interface BookmarkSettings {
  showBookmarkBar: boolean;
  defaultFolder?: string;
  sortBy: "dateAdded" | "title" | "url";
  maxRecentBookmarks: number;
}

export interface ExtensionMessage {
  type:
    | "GET_BOOKMARKS"
    | "ADD_BOOKMARK"
    | "DELETE_BOOKMARK"
    | "UPDATE_BOOKMARK";
  payload?: any;
}

export interface BookmarkFolder {
  id: string;
  title: string;
  children: Bookmark[];
}

export type BookmarkAction =
  | { type: "SET_BOOKMARKS"; payload: Bookmark[] }
  | { type: "ADD_BOOKMARK"; payload: Bookmark }
  | { type: "DELETE_BOOKMARK"; payload: string }
  | {
      type: "UPDATE_BOOKMARK";
      payload: { id: string; updates: Partial<Bookmark> };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
