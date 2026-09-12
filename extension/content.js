// extension/content.js - Content Script for Consent Ledger

// Flag to ensure we only record one consent rejection per page session
let hasRecordedRejection = false;

// List of target button phrases indicating cookie consent rejection
const REJECT_PHRASES = [
  "reject all",
  "reject",
  "decline all",
  "refuse all",
  "deny all"
];

/**
 * Checks if an element's text content matches any of our rejection phrases.
 * Keeps it beginner-friendly with trimming and lower-casing.
 */
function isRejectButton(element) {
  // Read text from value (for input buttons) or textContent / innerText
  const text = (element.value || element.innerText || element.textContent || "")
    .trim()
    .toLowerCase();

  // Ignore excessively long text blocks (e.g., entire paragraphs)
  if (!text || text.length > 50) {
    return false;
  }

  // Check if text matches or contains any target rejection phrase
  return REJECT_PHRASES.some((phrase) => text === phrase || text.includes(phrase));
}

/**
 * Handles the click event on a detected rejection button.
 */
function handleRejectClick() {
  // Prevent duplicate logs on the same page
  if (hasRecordedRejection) {
    return;
  }

  hasRecordedRejection = true;

  // 1. Record current timestamp (ISO string)
  const timestamp = new Date().toISOString();

  // 2. Record current website URL
  const url = window.location.href;

  // 3. Prepare payload for background service worker
  const payload = {
    type: "CONSENT_REJECTED",
    timestamp: timestamp,
    url: url
  };

  console.log("[Consent Ledger] Rejection detected:", payload);

  // Send message to background.js
  chrome.runtime.sendMessage(payload, (response) => {
    if (chrome.runtime.lastError) {
      console.warn(
        "[Consent Ledger] Notice: background script not yet responding:",
        chrome.runtime.lastError.message
      );
    } else {
      console.log("[Consent Ledger] Background acknowledged:", response);
    }
  });
}

/**
 * Scans the DOM for potential rejection buttons and attaches click listeners.
 */
function scanForRejectButtons() {
  // Query common button and clickable candidate tags
  const candidates = document.querySelectorAll(
    "button, a, [role='button'], input[type='button'], input[type='submit']"
  );

  candidates.forEach((candidate) => {
    // Skip elements that already have our listener attached
    if (candidate.dataset.consentLedgerObserved) {
      return;
    }

    if (isRejectButton(candidate)) {
      // Mark element to avoid adding multiple listeners
      candidate.dataset.consentLedgerObserved = "true";
      candidate.addEventListener("click", handleRejectClick);
      console.log("[Consent Ledger] Attached rejection listener to:", candidate);
    }
  });
}

// Initial scan when script runs
scanForRejectButtons();

// Set up a MutationObserver to detect dynamically rendered cookie banners (SPAs, popups, etc.)
const observer = new MutationObserver(() => {
  scanForRejectButtons();
});

// Observe changes to the DOM tree
observer.observe(document.body || document.documentElement, {
  childList: true,
  subtree: true
});
