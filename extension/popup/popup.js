// extension/popup/popup.js - Popup Logic for Consent Ledger

// DOM Elements
const consentStatusEl = document.getElementById("consent-status");
const violationsListEl = document.getElementById("violations-list");
const clearBtn = document.getElementById("clear-btn");

/**
 * Formats an ISO date string into a user-friendly local time representation.
 */
function formatTimestamp(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch (error) {
    return isoString;
  }
}

/**
 * Safely renders the latest consent event in the UI.
 * Uses only document.createElement and textContent to avoid XSS vulnerabilities.
 */
function renderConsentStatus(latestConsent) {
  // Clear any existing children safely
  consentStatusEl.textContent = "";

  if (!latestConsent) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-state";
    emptyMsg.textContent = "No consent rejection recorded yet.";
    consentStatusEl.appendChild(emptyMsg);
    return;
  }

  const container = document.createElement("div");
  container.className = "consent-item";

  // Rejection status badge
  const badge = document.createElement("span");
  badge.className = "badge-rejected";
  badge.textContent = "Consent Rejected";
  container.appendChild(badge);

  // Website row
  const siteRow = document.createElement("div");
  siteRow.className = "consent-row";
  const siteLabel = document.createElement("span");
  siteLabel.className = "consent-label";
  siteLabel.textContent = "Website:";
  const siteVal = document.createElement("span");
  siteVal.className = "consent-value";
  siteVal.textContent = latestConsent.url || "Unknown";
  siteRow.appendChild(siteLabel);
  siteRow.appendChild(siteVal);
  container.appendChild(siteRow);

  // Time row
  const timeRow = document.createElement("div");
  timeRow.className = "consent-row";
  const timeLabel = document.createElement("span");
  timeLabel.className = "consent-label";
  timeLabel.textContent = "Time:";
  const timeVal = document.createElement("span");
  timeVal.className = "consent-value";
  timeVal.textContent = formatTimestamp(latestConsent.timestamp);
  timeRow.appendChild(timeLabel);
  timeRow.appendChild(timeVal);
  container.appendChild(timeRow);

  consentStatusEl.appendChild(container);
}

/**
 * Safely renders the list of detected violations in the UI.
 */
function renderViolations(violations) {
  // Clear any existing children safely
  violationsListEl.textContent = "";

  if (!violations || violations.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-state";
    emptyMsg.textContent = "No violations detected.";
    violationsListEl.appendChild(emptyMsg);
    return;
  }

  const container = document.createElement("div");
  container.className = "violations-container";

  // Display newest violations first
  const reversedViolations = [...violations].reverse();

  reversedViolations.forEach((item) => {
    const card = document.createElement("div");
    card.className = "violation-card";

    // Header: Label & Timestamp
    const header = document.createElement("div");
    header.className = "violation-header";

    const title = document.createElement("span");
    title.className = "violation-title";
    title.textContent = item.label || "Potential Immediate Violation";

    const time = document.createElement("span");
    time.className = "violation-time";
    time.textContent = formatTimestamp(item.timestamp);

    header.appendChild(title);
    header.appendChild(time);
    card.appendChild(header);

    // Website row
    const siteRow = document.createElement("div");
    siteRow.className = "consent-row";
    const siteLabel = document.createElement("span");
    siteLabel.className = "consent-label";
    siteLabel.textContent = "Site:";
    const siteVal = document.createElement("span");
    siteVal.className = "consent-value";
    siteVal.textContent = item.websiteUrl || "Unknown";
    siteRow.appendChild(siteLabel);
    siteRow.appendChild(siteVal);
    card.appendChild(siteRow);

    // Request Type row
    const typeRow = document.createElement("div");
    typeRow.className = "consent-row";
    const typeLabel = document.createElement("span");
    typeLabel.className = "consent-label";
    typeLabel.textContent = "Type:";
    const typeVal = document.createElement("span");
    typeVal.className = "consent-value";
    typeVal.textContent = item.requestType || "request";
    typeRow.appendChild(typeLabel);
    typeRow.appendChild(typeVal);
    card.appendChild(typeRow);

    // Request URL block
    const urlBox = document.createElement("div");
    urlBox.className = "violation-url";
    urlBox.textContent = item.requestUrl || "";
    card.appendChild(urlBox);

    container.appendChild(card);
  });

  violationsListEl.appendChild(container);
}

/**
 * Loads stored data from chrome.storage.local and updates the popup UI.
 */
function loadAndRenderData() {
  chrome.storage.local.get(
    ["consentEvents", "latestConsent", "violations"],
    (result) => {
      renderConsentStatus(result.latestConsent);
      renderViolations(result.violations);
    }
  );
}

/**
 * Clears recorded consent events and violations from storage, then refreshes UI.
 */
function handleClearLedger() {
  chrome.storage.local.remove(
    ["consentEvents", "latestConsent", "violations"],
    () => {
      console.log("[Consent Ledger] Ledger cleared successfully.");
      loadAndRenderData();
    }
  );
}

// Event Listeners
document.addEventListener("DOMContentLoaded", loadAndRenderData);
clearBtn.addEventListener("click", handleClearLedger);
