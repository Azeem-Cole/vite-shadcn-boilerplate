const EXTENSION_ID = "IDepieclpffnjdhdniiemnjbncngdeicab";

export function BookmarkSyncButton() {
  console.log("made to 1", window.chrome);
  const handleClick = () => {
    if (!window.chrome?.runtime?.sendMessage) {
      alert("Extension not detected. Please install it first");
      return;
    }

    window.chrome.runtime?.sendMessage(
      EXTENSION_ID,
      {
        action: "downloadBookmarks",
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("error:", chrome.runtime.lastError.message);
          alert(
            "Could not connect to the extension. Please make sure it is installed and try again."
          );
          return;
        } else {
          console.log("response:", response);

          if (response?.success) {
            alert("Bookmarks synced successfully!");
          } else {
            alert("Failed to sync bookmarks.");
          }
        }
      }
    );
  };

  handleClick();
}
