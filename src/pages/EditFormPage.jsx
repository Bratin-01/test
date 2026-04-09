import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loadStoredConfig, persistConfig } from "../utils/formConfigStore";
import formConfigDefault from "../assets/formConfig.json";

// ─── DEPT EDITOR ─────────────────────────────────────────────────────────────
function DeptEditor({ departments, onChange }) {
  return (
    <div className="space-y-2">
      {departments.map((dept, i) => (
        <div key={i} className="flex gap-2 items-start p-2 bg-gray-50 rounded border">
          <div className="flex-1 space-y-1">
            <input
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Main department (e.g. ALH)"
              value={dept.main || ""}
              onChange={(e) => {
                const copy = departments.map((d, j) =>
                  j === i ? { ...d, main: e.target.value } : d
                );
                onChange(copy);
              }}
            />
            <input
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Sub-departments, comma-separated (e.g. ALH-MA, ALH-MB)"
              value={(dept.children || []).join(", ")}
              onChange={(e) => {
                const copy = departments.map((d, j) =>
                  j === i
                    ? {
                        ...d,
                        children: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }
                    : d
                );
                onChange(copy);
              }}
            />
          </div>
          <button
            onClick={() => onChange(departments.filter((_, j) => j !== i))}
            className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm mt-1 hover:bg-red-200"
            title="Remove department"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...departments, { main: "", children: [] }])}
        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
      >
        + Add Department
      </button>
    </div>
  );
}

// ─── DEFAULT DOC EDITOR ───────────────────────────────────────────────────────
function DefaultDocEditor({ formState, setFormState, onSave, onRevert }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Document Title</label>
        <input
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={formState.docTitle || ""}
          onChange={(e) => setFormState((s) => ({ ...s, docTitle: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Document Number</label>
        <input
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={formState.docNo || ""}
          onChange={(e) => setFormState((s) => ({ ...s, docNo: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Entity</label>
        <input
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={formState.entity || ""}
          onChange={(e) => setFormState((s) => ({ ...s, entity: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Entity Number</label>
        <input
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={formState.entityNo || ""}
          onChange={(e) => setFormState((s) => ({ ...s, entityNo: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Content Type</label>
        <input
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={formState.contentType || ""}
          onChange={(e) => setFormState((s) => ({ ...s, contentType: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Document History
          <span className="ml-1 font-normal text-gray-400">(version | changes | date)</span>
        </label>
        <div className="space-y-2">
          {(formState.docHistory || []).map((h, i) => (
            <div key={i} className="flex gap-2 items-start p-2 bg-gray-50 rounded border">
              <input
                className="w-16 border rounded px-2 py-1 text-sm"
                placeholder="Ver."
                value={h.version || ""}
                onChange={(e) => {
                  const copy = (formState.docHistory || []).map((r, j) =>
                    j === i ? { ...r, version: e.target.value } : r
                  );
                  setFormState((s) => ({ ...s, docHistory: copy }));
                }}
              />
              <textarea
                className="flex-1 border rounded px-2 py-1 text-sm resize-none"
                rows={2}
                placeholder="Changes description"
                value={h.changes || ""}
                onChange={(e) => {
                  const copy = (formState.docHistory || []).map((r, j) =>
                    j === i ? { ...r, changes: e.target.value } : r
                  );
                  setFormState((s) => ({ ...s, docHistory: copy }));
                }}
              />
              <input
                className="w-32 border rounded px-2 py-1 text-sm"
                placeholder="Date"
                value={h.date || ""}
                onChange={(e) => {
                  const copy = (formState.docHistory || []).map((r, j) =>
                    j === i ? { ...r, date: e.target.value } : r
                  );
                  setFormState((s) => ({ ...s, docHistory: copy }));
                }}
              />
              <button
                onClick={() => {
                  const copy = (formState.docHistory || []).filter((_, j) => j !== i);
                  setFormState((s) => ({ ...s, docHistory: copy }));
                }}
                className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setFormState((s) => ({
                ...s,
                docHistory: [...(s.docHistory || []), { version: "", changes: "", date: "" }],
              }))
            }
            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
          >
            + Add History Entry
          </button>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
        >
          Save Changes
        </button>
        <button
          onClick={onRevert}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm border"
        >
          Revert
        </button>
      </div>
    </div>
  );
}

// ─── DEFAULT ENVS EDITOR ──────────────────────────────────────────────────────
function DefaultEnvsEditor({ formState, setFormState, onSave, onRevert }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const updateEnv = (idx, field, value) =>
    setFormState((arr) => arr.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));

  const updateRoles = (idx, field, raw) =>
    updateEnv(
      idx,
      field,
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm text-gray-700">
          Environments ({formState.length})
        </h4>
        <button
          onClick={() =>
            setFormState((arr) => [
              ...arr,
              {
                id: `ENV_${Date.now()}`,
                label: "New Environment",
                operativeRoles: [],
                mdmRoles: [],
                viewerRoles: [],
                uamRoles: [],
                departments: [],
                footnote: "",
              },
            ])
          }
          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
        >
          + Add Environment
        </button>
      </div>

      {formState.map((env, idx) => (
        <div key={idx} className="border rounded bg-white overflow-hidden">
          {/* Env header */}
          <div
            className="flex justify-between items-center px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{env.label || env.id || `Env ${idx + 1}`}</span>
              <span className="text-xs text-gray-400">{env.id}</span>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!window.confirm(`Remove environment "${env.label || env.id}"?`)) return;
                  setFormState((arr) => arr.filter((_, i) => i !== idx));
                  if (expandedIdx === idx) setExpandedIdx(null);
                }}
                className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
              >
                Remove
              </button>
              <span className="text-gray-400 text-xs">{expandedIdx === idx ? "▲" : "▼"}</span>
            </div>
          </div>

          {/* Env fields */}
          {expandedIdx === idx && (
            <div className="p-4 space-y-3 border-t">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">ID</label>
                  <input
                    className="w-full border rounded px-2 py-1.5 text-sm"
                    value={env.id || ""}
                    onChange={(e) => updateEnv(idx, "id", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                  <input
                    className="w-full border rounded px-2 py-1.5 text-sm"
                    value={env.label || ""}
                    onChange={(e) => updateEnv(idx, "label", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Operative Roles
                  <span className="ml-1 font-normal text-gray-400">(comma-separated)</span>
                </label>
                <textarea
                  className="w-full border rounded px-2 py-1.5 text-sm resize-none"
                  rows={3}
                  value={(env.operativeRoles || []).join(", ")}
                  onChange={(e) => updateRoles(idx, "operativeRoles", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  MDM Roles
                  <span className="ml-1 font-normal text-gray-400">(comma-separated)</span>
                </label>
                <textarea
                  className="w-full border rounded px-2 py-1.5 text-sm resize-none"
                  rows={2}
                  value={(env.mdmRoles || []).join(", ")}
                  onChange={(e) => updateRoles(idx, "mdmRoles", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Viewer Roles
                  <span className="ml-1 font-normal text-gray-400">(comma-separated)</span>
                </label>
                <input
                  className="w-full border rounded px-2 py-1.5 text-sm"
                  value={(env.viewerRoles || []).join(", ")}
                  onChange={(e) => updateRoles(idx, "viewerRoles", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  UAM Roles
                  <span className="ml-1 font-normal text-gray-400">(comma-separated)</span>
                </label>
                <input
                  className="w-full border rounded px-2 py-1.5 text-sm"
                  value={(env.uamRoles || []).join(", ")}
                  onChange={(e) => updateRoles(idx, "uamRoles", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Departments</label>
                <DeptEditor
                  departments={env.departments || []}
                  onChange={(depts) => updateEnv(idx, "departments", depts)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Footnote</label>
                <textarea
                  className="w-full border rounded px-2 py-1.5 text-sm resize-none"
                  rows={3}
                  value={env.footnote || ""}
                  onChange={(e) => updateEnv(idx, "footnote", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 pt-2">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
        >
          Save Changes
        </button>
        <button
          onClick={onRevert}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm border"
        >
          Revert
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function EditFormPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState(() => loadStoredConfig());
  const [selectedTab, setSelectedTab] = useState("DEFAULT_DOC");
  const [editorMode, setEditorMode] = useState("form"); // 'form' | 'json'
  const [formState, setFormState] = useState(null);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [saveMsg, setSaveMsg] = useState(null); // { type: 'success'|'error', text }
  const [changeNote, setChangeNote] = useState("");

  // Sync formState with config + selected tab (form mode)
  useEffect(() => {
    if (editorMode === "form") {
      setFormState(
        Array.isArray(config[selectedTab])
          ? [...config[selectedTab]]
          : { ...config[selectedTab] }
      );
    }
  }, [config, selectedTab, editorMode]);

  // Sync jsonText when switching to JSON mode
  useEffect(() => {
    if (editorMode === "json") {
      setJsonText(JSON.stringify(config, null, 2));
      setJsonError("");
    }
  }, [editorMode]); // only when mode changes, not on every config update

  const showMsg = (type, text) => {
    setSaveMsg({ type, text });
    setTimeout(() => setSaveMsg(null), 3500);
  };

  const handleSaveConfig = (newConfig, note = changeNote) => {
    persistConfig(newConfig, user, note || "Manual edit");
    setConfig(newConfig);
    setChangeNote("");
    showMsg("success", "Changes saved successfully!");
  };

  const downloadConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formConfig.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToDefault = () => {
    if (!window.confirm("Reset to default configuration? All unsaved changes will be lost.")) return;
    handleSaveConfig(formConfigDefault, "Reset to default");
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      handleSaveConfig(parsed, changeNote || "JSON mode edit");
      setJsonError("");
    } catch (e) {
      setJsonError("Invalid JSON: " + e.message);
    }
  };

  const switchMode = (newMode) => {
    setEditorMode(newMode);
    setJsonError("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-bayer-blue mb-1">Edit Form Configurator</h1>
          <p className="text-sm text-gray-500">
            Changes are saved to browser storage and logged in{" "}
            <a href="/edit-records" className="text-blue-600 underline hover:text-blue-800">
              Edit Records
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {saveMsg && (
            <span
              className={`text-sm font-medium px-3 py-1 rounded ${
                saveMsg.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {saveMsg.text}
            </span>
          )}
          <button
            onClick={() => switchMode(editorMode === "form" ? "json" : "form")}
            className={`px-3 py-2 rounded text-sm border font-medium transition-colors ${
              editorMode === "json"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {editorMode === "form" ? "JSON Mode" : "Form Mode"}
          </button>
          <button
            onClick={downloadConfig}
            className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Download JSON
          </button>
          <button
            onClick={resetToDefault}
            className="px-3 py-2 bg-gray-100 rounded text-sm border hover:bg-gray-200"
          >
            Reset to Default
          </button>
        </div>
      </div>

      {/* ── Optional change note ── */}
      <div className="mb-4">
        <input
          className="border rounded px-3 py-1.5 text-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Change note (optional) — shown in Edit Records"
          value={changeNote}
          onChange={(e) => setChangeNote(e.target.value)}
        />
      </div>

      {/* ── JSON Mode ── */}
      {editorMode === "json" ? (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Complete Form Configuration (JSON)
          </label>
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setJsonError("");
            }}
            className="w-full h-[600px] font-mono text-sm border rounded p-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
            spellCheck={false}
          />
          {jsonError && (
            <div className="text-sm text-red-500 mt-2 p-2 bg-red-50 rounded border border-red-200">
              {jsonError}
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <button
              onClick={applyJson}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setJsonText(JSON.stringify(config, null, 2));
                setJsonError("");
              }}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm border"
            >
              Revert
            </button>
          </div>
        </div>
      ) : (
        /* ── Form Mode ── */
        <>
          {/* Tab navigation */}
          <div className="mb-5">
            <nav className="flex gap-2">
              {Object.keys(config).map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedTab(k)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    selectedTab === k
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {k}
                </button>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Editor panel ── */}
            <div className="lg:col-span-2">
              {selectedTab === "DEFAULT_DOC" && formState && !Array.isArray(formState) && (
                <DefaultDocEditor
                  formState={formState}
                  setFormState={setFormState}
                  onSave={() =>
                    handleSaveConfig({ ...config, DEFAULT_DOC: formState })
                  }
                  onRevert={() => setFormState({ ...config.DEFAULT_DOC })}
                />
              )}
              {selectedTab === "DEFAULT_ENVS" && Array.isArray(formState) && (
                <DefaultEnvsEditor
                  formState={formState}
                  setFormState={setFormState}
                  onSave={() =>
                    handleSaveConfig({ ...config, DEFAULT_ENVS: formState })
                  }
                  onRevert={() => setFormState([...config.DEFAULT_ENVS])}
                />
              )}
            </div>

            {/* ── Preview panel ── */}
            <div>
              <div className="bg-white border rounded p-4 sticky top-4">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">
                  Preview — {selectedTab}
                </h3>
                <pre className="text-xs text-gray-600 max-h-[480px] overflow-auto font-mono whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(formState, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
