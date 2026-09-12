// extension/background.js - Background Service Worker for Consent Ledger

// In-memory map to track tabs where consent was rejected: tabId -> { url, timestamp }
const activeRejections = new Map();

// Keywords commonly found in tracking, analytics, and beacon URLs
const TRACKER_KEYWORDS = ["analytics", "tracker", "pixel", "collect"];

/**
 * Checks if a requested URL contains any tracker-related keywords.
 */
function isTrackerUrl(url) {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return TRACKER_KEYWORDS.some((keyword) => lowerUrl.includes(keyword));
}

/**
 * 1. Listen for messages from content scripts (content.js).
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CONSENT_REJECTED") {
    const tabId = sender.tab ? sender.tab.id : null;
    const rejectionEvent = {
      label: "Consent Rejected",
      timestamp: message.timestamp,
      url: message.url,
      tabId: tabId
    };

    console.log("[Consent Ledger] Received rejection event:", rejectionEvent);

    // If we have a valid tab ID, activate network monitoring for this tab
    if (tabId !== null) {
      activeRejections.set(tabId, {
        url: message.url,
        timestamp: message.timestamp
      });
    }

    // Save rejection event to chrome.storage.local
    chrome.storage.local.get({ consentEvents: [] }, (result) => {
      const updatedEvents = [...result.consentEvents, rejectionEvent];
      chrome.storage.local.set(
        {
          consentEvents: updatedEvents,
          latestConsent: rejectionEvent
        },
        () => {
          console.log("[Consent Ledger] Rejection saved to local storage.");
          sendResponse({ status: "SUCCESS", message: "Consent rejection recorded." });
        }
      );
    });

    // Return true to indicate asynchronous response to sendResponse
    return true;
  }
});

/**
 * 2. Monitor network requests using chrome.webRequest.onBeforeRequest.
 * Detects if a tracker request fires from a tab after consent was rejected.
 */
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // If the tab navigates to a new page, reset tracking for that tab
    if (details.type === "main_frame") {
      activeRejections.delete(details.tabId);
      return;
    }

    // Only inspect requests from tabs where consent has already been rejected
    const rejectionInfo = activeRejections.get(details.tabId);
    if (!rejectionInfo) {
      return;
    }

    // Check if the outgoing request URL matches any tracker keywords
    if (isTrackerUrl(details.url)) {
      const violationRecord = {
        label: "Potential Immediate Violation",
        websiteUrl: rejectionInfo.url,
        requestUrl: details.url,
        timestamp: new Date().toISOString(),
        requestType: details.type
      };

      console.warn("[Consent Ledger] Violation detected:", violationRecord);

      // Save violation record into chrome.storage.local
      chrome.storage.local.get({ violations: [] }, (result) => {
        const updatedViolations = [...result.violations, violationRecord];
        chrome.storage.local.set({ violations: updatedViolations }, () => {
          console.log("[Consent Ledger] Violation saved to local storage.");
        });
      });
    }
  },
  { urls: ["<all_urls>"] }
);

/**
 * Clean up active monitoring if a tab is closed.
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  if (activeRejections.has(tabId)) {
    activeRejections.delete(tabId);
    console.log(`[Consent Ledger] Cleaned up monitoring for closed tab: ${tabId}`);
  }
});
