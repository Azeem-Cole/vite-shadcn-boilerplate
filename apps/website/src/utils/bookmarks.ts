import { type Bookmark } from "../types/bookmarks";
import { useQuery } from "@tanstack/react-query";

// Load bookmarks data from the JSON file
export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: async (): Promise<Bookmark[]> => {
      try {
        const response = await fetch("/bookmarks-export-2025-10-15.json");
        const data = await response.json();
        return data as Bookmark[];
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Sample data for development/testing
export const sampleBookmarks: Bookmark[] = [
  {
    id: "1",
    title: "Bookmarks Bar",
    index: 0,
    parentId: "0",
    syncing: false,
    children: [
      {
        id: "2",
        title: "Work",
        index: 0,
        parentId: "1",
        syncing: false,
        children: [
          {
            id: "3",
            title: "GitHub",
            url: "https://github.com",
            index: 0,
            parentId: "2",
            syncing: false,
            dateAdded: Date.now(),
          },
          {
            id: "4",
            title: "Stack Overflow",
            url: "https://stackoverflow.com",
            index: 1,
            parentId: "2",
            syncing: false,
            dateAdded: Date.now(),
          },
        ],
      },
      {
        id: "5",
        title: "Personal",
        index: 1,
        parentId: "1",
        syncing: false,
        children: [
          {
            id: "6",
            title: "YouTube",
            url: "https://youtube.com",
            index: 0,
            parentId: "5",
            syncing: false,
            dateAdded: Date.now(),
          },
        ],
      },
    ],
  },
];
