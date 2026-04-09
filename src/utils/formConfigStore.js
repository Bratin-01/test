import formConfigDefault from "../assets/formConfig.json";

export const FORM_CONFIG_KEY = "uar_formConfig";
export const FORM_CONFIG_HISTORY_KEY = "uar_formConfigHistory";

/** Load the active config from localStorage, falling back to the bundled default. */
export function loadStoredConfig() {
  try {
    const s = localStorage.getItem(FORM_CONFIG_KEY);
    if (s) return JSON.parse(s);
  } catch {
    // ignore
  }
  return formConfigDefault;
}

/** Load the full edit history from localStorage. */
export function loadStoredHistory() {
  try {
    const s = localStorage.getItem(FORM_CONFIG_HISTORY_KEY);
    if (s) return JSON.parse(s);
  } catch {
    // ignore
  }
  return [];
}

/**
 * Persist a new config as the active config and append a history entry.
 * @param {object} config  - The full formConfig object to save.
 * @param {object|null} user - The currently logged-in user from AuthContext.
 * @param {string} [note]  - Optional note describing the change.
 */
export function persistConfig(config, user, note = "") {
  localStorage.setItem(FORM_CONFIG_KEY, JSON.stringify(config));

  const history = loadStoredHistory();
  const displayName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.email ||
      String(user.user_id)
    : "Unknown";

  const entry = {
    id: Date.now().toString(),
    savedAt: new Date().toISOString(),
    savedBy: displayName,
    note,
    config: JSON.parse(JSON.stringify(config)),
  };

  history.push(entry);
  localStorage.setItem(FORM_CONFIG_HISTORY_KEY, JSON.stringify(history));
  return entry;
}
