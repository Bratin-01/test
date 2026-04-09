import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  loadStoredHistory,
  persistConfig,
  FORM_CONFIG_HISTORY_KEY,
} from "../utils/formConfigStore";

function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function VersionBadge({ num, total }) {
  const isLatest = num === total;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
        isLatest
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      v{num}
      {isLatest && <span className="text-blue-500">★ current</span>}
    </span>
  );
}

export default function EditRecordsPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState(() => loadStoredHistory());
  const [expandedId, setExpandedId] = useState(null);
  const [expandedSection, setExpandedSection] = useState("DEFAULT_DOC"); // which section to preview
  const [restoreMsg, setRestoreMsg] = useState(null);

  // Newest first
  const sorted = [...history].reverse();
  const total = history.length;

  const showMsg = (type, text) => {
    setRestoreMsg({ type, text });
    setTimeout(() => setRestoreMsg(null), 3500);
  };

  const handleRestore = (entry, versionNum) => {
    if (
      !window.confirm(
        `Restore form configuration to version ${versionNum}?\nThis will become the active configuration and be logged as a new edit.`
      )
    )
      return;

    const displayName = user
      ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        user.email ||
        String(user.user_id)
      : "Unknown";

    persistConfig(
      entry.config,
      user,
      `Restored from v${versionNum} (originally saved by ${entry.savedBy} on ${formatDate(entry.savedAt)})`
    );

    // Refresh history list
    setHistory(loadStoredHistory());
    showMsg("success", `Restored to version ${versionNum} successfully.`);
  };

  const handleClearHistory = () => {
    if (
      !window.confirm(
        "Clear all edit history? This cannot be undone. The current active configuration will not be affected."
      )
    )
      return;
    localStorage.removeItem(FORM_CONFIG_HISTORY_KEY);
    setHistory([]);
    showMsg("success", "History cleared.");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-bayer-blue mb-1">Edit Records</h1>
          <p className="text-sm text-gray-500">
            A log of all saved form configurations. Restore any version to make it the active
            configuration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {restoreMsg && (
            <span
              className={`text-sm font-medium px-3 py-1 rounded ${
                restoreMsg.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {restoreMsg.text}
            </span>
          )}
          <button
            onClick={() => setHistory(loadStoredHistory())}
            className="px-3 py-2 bg-gray-100 rounded text-sm border hover:bg-gray-200"
          >
            Refresh
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-3 py-2 bg-red-50 text-red-600 rounded text-sm border border-red-200 hover:bg-red-100"
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* ── Empty state ── */}
      {history.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-medium">No edit records yet.</p>
          <p className="text-sm mt-1">
            Save changes on the{" "}
            <a href="/edit-form" className="text-blue-600 underline hover:text-blue-800">
              Edit Form
            </a>{" "}
            page to see records here.
          </p>
        </div>
      )}

      {/* ── Records table ── */}
      {history.length > 0 && (
        <div className="space-y-3">
          {sorted.map((entry, i) => {
            const versionNum = total - i; // newest = total, oldest = 1
            const isExpanded = expandedId === entry.id;
            const isLatest = i === 0;

            return (
              <div
                key={entry.id}
                className={`bg-white border rounded-lg overflow-hidden transition-shadow ${
                  isLatest ? "border-blue-300 shadow-sm" : "border-gray-200"
                }`}
              >
                {/* Row summary */}
                <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <VersionBadge num={versionNum} total={total} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span className="text-sm font-medium text-gray-800">
                        {formatDate(entry.savedAt)}
                      </span>
                      <span className="text-xs text-gray-500">by {entry.savedBy}</span>
                    </div>
                    {entry.note && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-md">
                        {entry.note}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      className="px-3 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 border"
                    >
                      {isExpanded ? "Hide" : "View Config"}
                    </button>
                    {!isLatest && (
                      <button
                        onClick={() => handleRestore(entry, versionNum)}
                        className="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 font-medium"
                      >
                        Restore
                      </button>
                    )}
                    {isLatest && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs border border-blue-200">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded config preview */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    {/* Section tabs */}
                    <div className="flex gap-2 mb-3">
                      {Object.keys(entry.config).map((k) => (
                        <button
                          key={k}
                          onClick={() => setExpandedSection(k)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            expandedSection === k
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>

                    <pre className="text-xs font-mono text-gray-700 bg-white border rounded p-3 max-h-72 overflow-auto whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(entry.config[expandedSection], null, 2)}
                    </pre>

                    {!isLatest && (
                      <div className="mt-3">
                        <button
                          onClick={() => handleRestore(entry, versionNum)}
                          className="px-4 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 font-medium"
                        >
                          Restore this version
                        </button>
                        <span className="ml-3 text-xs text-gray-400">
                          This will create a new edit record and become the active configuration.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
