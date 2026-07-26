"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, X, ChevronLeft, ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "json" | "image";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
}

interface CrudManagerProps {
  title: string;
  apiEndpoint: string;
  fields: FieldDef[];
  idKey?: string;
}

function parseArrayInput(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function stringifyArray(arr: string[] | null | undefined): string {
  return (arr || []).join("\n");
}

function isImageField(field: FieldDef): boolean {
  return field.type === "image" || field.key === "image";
}

function getImageSrc(val: unknown): string {
  if (typeof val !== "string") return "";
  if (val.startsWith("data:")) return val;
  if (val.startsWith("/")) return val;
  return "";
}

export default function CrudManager({ title, apiEndpoint, fields, idKey = "id" }: CrudManagerProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, [apiEndpoint]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function openCreate() {
    const initial: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === "boolean") initial[f.key] = false;
      else if (f.type === "number") initial[f.key] = 0;
      else if (f.type === "json") initial[f.key] = [];
      else initial[f.key] = "";
    });
    setForm(initial);
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(item: Record<string, unknown>) {
    const clone: Record<string, unknown> = {};
    fields.forEach((f) => {
      const val = item[f.key];
      if (f.type === "json") clone[f.key] = stringifyArray(val as string[]);
      else clone[f.key] = val ?? (f.type === "boolean" ? false : f.type === "number" ? 0 : "");
    });
    setForm(clone);
    setEditing(item);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload: Record<string, unknown> = {};
    fields.forEach((f) => {
      let val = form[f.key];
      if (f.type === "json" && typeof val === "string") val = parseArrayInput(val);
      if (f.type === "number" && typeof val === "string") val = Number(val);
      if (f.type === "boolean") val = Boolean(val);
      payload[f.key] = val;
    });

    try {
      const url = editing ? `${apiEndpoint}/${editing[idKey]}` : apiEndpoint;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (res.ok) {
        setModalOpen(false);
        fetchItems();
      } else {
        alert("Failed to save");
      }
    } catch {
      alert("Network error");
    }
    setSaving(false);
  }

  async function handleDelete(item: Record<string, unknown>) {
    try {
      const res = await fetch(`${apiEndpoint}/${item[idKey]}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchItems();
      else alert("Failed to delete");
    } catch {
      alert("Network error");
    }
    setDeleteTarget(null);
  }

  function handleFileUpload(key: string, file: File | null) {
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert("Image is too large. Please use images under 500KB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, [key]: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function renderCell(item: Record<string, unknown>, field: FieldDef) {
    const val = item[field.key];
    if (val == null) return "—";
    if (isImageField(field)) {
      const src = getImageSrc(val);
      if (src) {
        return (
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#C8A45E]/20 relative">
            <Image src={src} alt="" fill sizes="40px" className="object-cover" />
          </div>
        );
      }
      return (
        <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#C8A45E]/10 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-gray-600" />
        </div>
      );
    }
    if (field.type === "boolean") return val ? "Yes" : "No";
    if (field.type === "json") return Array.isArray(val) ? `${val.length} items` : "—";
    if (typeof val === "string" && val.length > 60) return val.slice(0, 60) + "…";
    return String(val);
  }

  const displayFields = fields.filter((f) => f.key !== "createdAt");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-[#C8A45E]/20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="font-semibold">{title}</span>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#C8A45E] hover:bg-[#b8954e] text-black text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-gray-400 text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500 text-sm">No items found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#C8A45E]/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#111111] border-b border-[#C8A45E]/10 text-left text-gray-400">
                  {displayFields.map((f) => (
                    <th key={f.key} className="px-4 py-3 font-medium whitespace-nowrap">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C8A45E]/10">
                {items.map((item, idx) => (
                  <tr key={String(item[idKey] ?? idx)} className="bg-[#0f0f0f] hover:bg-[#161616] transition-colors">
                    {displayFields.map((f) => (
                      <td key={f.key} className="px-4 py-3 text-gray-300 max-w-xs truncate">
                        {renderCell(item, f)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-md hover:bg-[#C8A45E]/10 text-[#C8A45E] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-md hover:bg-red-500/10 text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-[#C8A45E]/20 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#C8A45E]/10">
              <h2 className="font-semibold text-white">{editing ? "Edit" : "Add"} {title.slice(0, -1)}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    {f.label} {f.required && <span className="text-red-400">*</span>}
                  </label>
                  {isImageField(f) ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(f.key, e.target.files?.[0] ?? null)}
                          className="hidden"
                          id={`image-upload-${f.key}`}
                        />
                        <label
                          htmlFor={`image-upload-${f.key}`}
                          className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border border-dashed border-[#C8A45E]/30 rounded-lg text-sm text-gray-400 hover:text-white hover:border-[#C8A45E] cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Click to upload image
                        </label>
                      </div>
                      <input
                        type="text"
                        value={String(form[f.key] ?? "")}
                        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#C8A45E]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C8A45E]"
                        placeholder="Or paste image URL / path (e.g. /images/portfolio/x.jpg)"
                      />
                      {Boolean(form[f.key]) && getImageSrc(form[f.key]) && (
                        <div className="rounded-lg overflow-hidden border border-[#C8A45E]/20 w-full max-w-[200px] relative aspect-[5/4]">
                          <Image
                            src={getImageSrc(form[f.key])}
                            alt="Preview"
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ) : f.type === "textarea" ? (
                    <textarea
                      value={String(form[f.key] ?? "")}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#C8A45E]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C8A45E] resize-none"
                      rows={3}
                    />
                  ) : f.type === "json" ? (
                    <textarea
                      value={String(form[f.key] ?? "")}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#C8A45E]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C8A45E] resize-none"
                      rows={4}
                      placeholder={`One item per line`}
                    />
                  ) : f.type === "boolean" ? (
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(form[f.key])}
                        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.checked }))}
                        className="w-4 h-4 accent-[#C8A45E]"
                      />
                      <span className="text-sm text-gray-300">Enabled</span>
                    </label>
                  ) : f.type === "number" ? (
                    <input
                      type="number"
                      value={String(form[f.key] ?? "")}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#C8A45E]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C8A45E]"
                    />
                  ) : (
                    <input
                      type="text"
                      value={String(form[f.key] ?? "")}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#C8A45E]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C8A45E]"
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#C8A45E] hover:bg-[#b8954e] text-black text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-red-500/20 rounded-xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="font-semibold text-white mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-400 mb-5">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
