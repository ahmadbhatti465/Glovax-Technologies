"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Table as TableIcon,
  Code,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  Code2,
  Eye,
  AlertTriangle,
  Upload,
} from "lucide-react";
import { InternalLinkModal } from "./InternalLinkModal";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  focusKeyword?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write comprehensive, engaging content for this page...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // Image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Sync external value to editable div when in visual mode
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, isSourceMode]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  }, [onChange]);

  // Execute formatting commands
  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (isSourceMode) return;
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleHeadingChange = (tag: string) => {
    if (isSourceMode) return;
    if (tag === "p") {
      document.execCommand("formatBlock", false, "<p>");
    } else {
      document.execCommand("formatBlock", false, `<${tag}>`);
    }
    handleInput();
  };

  const openLinkModal = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
      setSelectedText(selection.toString());
    } else {
      setSelectedText("");
      setSavedRange(null);
    }
    setIsLinkModalOpen(true);
  };

  const handleInsertLink = (linkData: {
    text: string;
    url: string;
    openInNewTab: boolean;
    rel: string;
  }) => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRange) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedRange);
      }

      const targetAttr = linkData.openInNewTab ? ' target="_blank"' : "";
      const relAttr = linkData.rel ? ` rel="${linkData.rel}"` : "";
      const linkHtml = `<a href="${linkData.url}"${targetAttr}${relAttr} class="text-[#1EDAC6] hover:underline">${linkData.text || linkData.url}</a>`;

      document.execCommand("insertHTML", false, linkHtml);
      handleInput();
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        if (!imageAlt) {
          const autoName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setImageAlt(autoName);
        }
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch {
      alert("Failed to upload image");
    }
    setUploadingImage(false);
  };

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    if (editorRef.current) {
      editorRef.current.focus();
      const altAttr = imageAlt.trim() ? ` alt="${imageAlt.trim()}"` : ' alt=""';
      const titleAttr = imageTitle.trim() ? ` title="${imageTitle.trim()}"` : "";

      let imgHtml = `<figure class="my-6"><img src="${imageUrl.trim()}"${altAttr}${titleAttr} class="rounded-xl max-w-full h-auto border border-[#1EDAC6]/20 mx-auto" />`;
      if (imageCaption.trim()) {
        imgHtml += `<figcaption class="text-xs text-gray-400 text-center mt-2 italic">${imageCaption.trim()}</figcaption>`;
      }
      imgHtml += `</figure><p></p>`;

      document.execCommand("insertHTML", false, imgHtml);
      handleInput();

      setImageUrl("");
      setImageAlt("");
      setImageTitle("");
      setImageCaption("");
      setIsImageModalOpen(false);
    }
  };

  const handleInsertTable = () => {
    if (isSourceMode) return;
    const tableHtml = `
      <div class="overflow-x-auto my-6">
        <table class="w-full text-sm border-collapse border border-[#1EDAC6]/20 rounded-lg">
          <thead>
            <tr class="bg-surface-raised text-[#1EDAC6]">
              <th class="border border-[#1EDAC6]/20 p-3 text-left">Feature / Metric</th>
              <th class="border border-[#1EDAC6]/20 p-3 text-left">Description</th>
              <th class="border border-[#1EDAC6]/20 p-3 text-left">Outcome / Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-300">Modern Architecture</td>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-400">Next.js & React 19 Full-Stack</td>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-400">Sub-second loading & high Core Web Vitals</td>
            </tr>
            <tr>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-300">SEO Optimization</td>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-400">Server-rendered metadata & JSON-LD</td>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-400">Superior search engine visibility</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p></p>
    `;
    document.execCommand("insertHTML", false, tableHtml);
    handleInput();
  };

  const handleInsertCodeBlock = () => {
    if (isSourceMode) return;
    const codeHtml = `<pre class="bg-card border border-[#1EDAC6]/20 rounded-xl p-4 my-4 overflow-x-auto"><code class="text-xs text-[#1EDAC6] font-mono">// Glovax Technologies Custom Solution&#10;export async function handler() {&#10;  return { status: "success" };&#10;}</code></pre><p></p>`;
    document.execCommand("insertHTML", false, codeHtml);
    handleInput();
  };

  // Heading hierarchy analysis
  const h1Count = (value.match(/<h1\b[^>]*>/gi) || []).length;
  const h2Count = (value.match(/<h2\b[^>]*>/gi) || []).length;
  const wordCount = value.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="border border-[#1EDAC6]/20 rounded-xl overflow-hidden bg-card flex flex-col shadow-inner">
      {/* Toolbar */}
      <div className="bg-surface-raised border-b border-[#1EDAC6]/10 p-2 flex flex-wrap items-center gap-1 text-gray-300">
        {/* Headings Selector */}
        <select
          onChange={(e) => handleHeadingChange(e.target.value)}
          defaultValue="p"
          disabled={isSourceMode}
          className="bg-card border border-[#1EDAC6]/20 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-[#1EDAC6] mr-1"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1 (H1 - Use with caution)</option>
          <option value="h2">Heading 2 (H2 - Major Section)</option>
          <option value="h3">Heading 3 (H3 - Subsection)</option>
          <option value="h4">Heading 4 (H4)</option>
          <option value="h5">Heading 5 (H5)</option>
          <option value="h6">Heading 6 (H6)</option>
        </select>

        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* Basic formatting */}
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          disabled={isSourceMode}
          title="Bold (Ctrl+B)"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          disabled={isSourceMode}
          title="Italic (Ctrl+I)"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          disabled={isSourceMode}
          title="Underline (Ctrl+U)"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("strikeThrough")}
          disabled={isSourceMode}
          title="Strikethrough"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          disabled={isSourceMode}
          title="Bullet List"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          disabled={isSourceMode}
          title="Numbered List"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "<blockquote>")}
          disabled={isSourceMode}
          title="Blockquote"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => executeCommand("justifyLeft")}
          disabled={isSourceMode}
          title="Align Left"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyCenter")}
          disabled={isSourceMode}
          title="Align Center"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyRight")}
          disabled={isSourceMode}
          title="Align Right"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* Insert Elements */}
        <button
          type="button"
          onClick={openLinkModal}
          disabled={isSourceMode}
          title="Insert Link (Internal/External)"
          className="p-1.5 rounded hover:bg-white/10 text-[#1EDAC6] hover:text-[#34F5E2] transition-colors"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setIsImageModalOpen(true)}
          disabled={isSourceMode}
          title="Insert Image with Alt Text"
          className="p-1.5 rounded hover:bg-white/10 text-[#1EDAC6] hover:text-[#34F5E2] transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleInsertTable}
          disabled={isSourceMode}
          title="Insert Table"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <TableIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleInsertCodeBlock}
          disabled={isSourceMode}
          title="Code Block"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <Code className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertHorizontalRule")}
          disabled={isSourceMode}
          title="Horizontal Rule"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* Utilities */}
        <button
          type="button"
          onClick={() => executeCommand("undo")}
          disabled={isSourceMode}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("redo")}
          disabled={isSourceMode}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("removeFormat")}
          disabled={isSourceMode}
          title="Clear Formatting"
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          {/* HTML Source Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsSourceMode(!isSourceMode)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              isSourceMode
                ? "bg-[#1EDAC6] text-black font-semibold"
                : "bg-white/5 hover:bg-white/10 text-gray-300"
            }`}
            title="Toggle HTML Source Mode"
          >
            {isSourceMode ? (
              <>
                <Eye className="w-3 h-3" /> Visual
              </>
            ) : (
              <>
                <Code2 className="w-3 h-3" /> HTML Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* SEO Heading Hierarchy Warnings */}
      {h1Count > 0 && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center gap-2 text-xs text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>
            <strong>SEO Warning:</strong> Your content contains {h1Count} &lt;h1&gt; heading
            {h1Count > 1 ? "s" : ""}. The Page Title is already rendered as H1. For best SEO practice, use &lt;h2&gt; for major sections and &lt;h3&gt; for subsections.
          </span>
        </div>
      )}
      {wordCount > 300 && h2Count === 0 && (
        <div className="bg-sky-500/10 border-b border-sky-500/20 px-4 py-2 flex items-center gap-2 text-xs text-sky-300">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>
            <strong>SEO Tip:</strong> Your page has {wordCount} words but no &lt;h2&gt; subheadings. Adding descriptive H2 subheadings improves readability and keyword relevance.
          </span>
        </div>
      )}

      {/* Editor Surface */}
      <div className="p-4 flex-1 min-h-[420px] max-h-[700px] overflow-y-auto">
        {isSourceMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full min-h-[400px] font-mono text-xs text-emerald-400 bg-background/80 p-3 rounded-lg border border-[#1EDAC6]/20 focus:outline-none focus:border-[#1EDAC6] resize-y"
            placeholder="<h2>Section Title</h2>&#10;<p>Write clean HTML here...</p>"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            data-placeholder={placeholder}
            className="outline-none text-white text-sm leading-relaxed prose prose-invert max-w-none min-h-[380px] focus:ring-0 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-600"
          />
        )}
      </div>

      {/* Internal Link Modal */}
      <InternalLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsert={handleInsertLink}
        selectedText={selectedText}
      />

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-raised border border-[#1EDAC6]/20 rounded-xl w-full max-w-md shadow-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#1EDAC6]" /> Insert Image with SEO Attributes
            </h3>
            <form onSubmit={handleInsertImage} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Image URL / Upload</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or /images/..."
                    required
                    className="flex-1 px-3 py-1.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                  />
                  <label className="px-3 py-1.5 bg-card border border-[#1EDAC6]/30 hover:border-[#1EDAC6] text-[#1EDAC6] rounded-lg text-xs cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingImage ? "…" : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Alt Text <span className="text-red-400">*</span> (Crucial for Image SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Glovax Technologies web development engineers building custom software"
                  required
                  className="w-full px-3 py-1.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                />
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  Describe what the image shows accurately. Avoid keyword stuffing.
                </span>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Title Attribute (Optional)</label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="Hover tooltip text"
                  className="w-full px-3 py-1.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Visible caption under image"
                  className="w-full px-3 py-1.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!imageUrl.trim()}
                  className="px-4 py-1.5 bg-[#1EDAC6] hover:bg-[#34F5E2] text-black text-xs font-semibold rounded-lg disabled:opacity-50"
                >
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
