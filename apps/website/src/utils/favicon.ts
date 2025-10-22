export const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    // Try multiple favicon services for better quality and reliability
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
};

// Extract basic URL information
export const getUrlInfo = (url: string) => {
  try {
    const urlObj = new URL(url);
    return {
      domain: urlObj.hostname,
      subdomain: urlObj.hostname.split(".").slice(0, -2).join(".") || null,
      rootDomain: urlObj.hostname.split(".").slice(-2).join("."),
      protocol: urlObj.protocol,
      pathname: urlObj.pathname,
      searchParams: Object.fromEntries(urlObj.searchParams.entries()),
    };
  } catch {
    return null;
  }
};
