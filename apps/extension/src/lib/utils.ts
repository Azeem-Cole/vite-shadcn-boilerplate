import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Create a downloadable file with the given data
 * @param data The content of the file
 * @param filename The name of the file to download
 * @param contentType The MIME type of the file
 */
export function downloadFile({
  data,
  filename,
  contentType,
}: {
  data: string;
  filename: string;
  contentType: string;
}): void {
  // Create a blob with the data
  const blob = new Blob([data], { type: contentType });

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a download link
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Append the link to the document
  document.body.appendChild(link);

  // Click the link to start the download
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
