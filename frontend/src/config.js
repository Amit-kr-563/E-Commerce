const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Keep URL consistent to avoid accidental double slashes in requests.
export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");
