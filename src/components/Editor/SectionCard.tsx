import ImageUploader from "./ImageUploader";
import type { Section, ImageSpec } from "./useEditorState";

interface SectionCardProps {
  section: Section;
  sectionIndex: number;
  isInvalid: boolean;
  onMarkTouched: () => void;
  onRemoveSection: () => void;
  onUpdateSection: (patch: Partial<Section>) => void;
  onAddParagraph: () => void;
  onRemoveParagraph: (pIdx: number) => void;
  onUpdateParagraph: (pIdx: number, value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (imgIdx: number) => void;
  onUpdateImage: (imgIdx: number, patch: Partial<ImageSpec>) => void;
  canRemove: boolean;
}

export function SectionCard({
  section,
  sectionIndex,
  isInvalid,
  onMarkTouched,
  onRemoveSection,
  onUpdateSection,
  onAddParagraph,
  onRemoveParagraph,
  onUpdateParagraph,
  onAddImage,
  onRemoveImage,
  onUpdateImage,
  canRemove,
}: SectionCardProps) {
  return (
    <div 
      className="relative border border-gray-700 rounded-xl overflow-hidden" 
      style={{ backgroundColor: '#1f1f1f' }}
      data-section-index={sectionIndex}
    >
      <div className="p-6 space-y-6">
        {/* Section Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                {sectionIndex + 1}
              </div>
              <label className="text-sm font-medium" style={{ color: '#fffff2' }}>
                Section Heading *
              </label>
            </div>
            <input
              className={`w-full text-lg font-medium px-4 py-3 rounded-lg border outline-none transition-all duration-200 ${
                isInvalid 
                  ? "border-red-500 focus:border-red-400 focus:ring-4 focus:ring-red-500/20" 
                  : "border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              }`}
              style={{ backgroundColor: '#2a2a2a67', color: '#ffffff' }}
              placeholder="Enter section heading..."
              value={section.heading}
              onChange={(e) => onUpdateSection({ heading: e.target.value })}
              onBlur={onMarkTouched}
            />
            {isInvalid && (
              <p className="text-sm text-red-400">Please add a section heading</p>
            )}
          </div>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            onClick={onRemoveSection}
            disabled={!canRemove}
            title={!canRemove ? "Keep at least one section" : "Remove section"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Paragraphs */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300">Paragraphs</h4>
          <div className="space-y-3">
            {section.paragraphs.map((p, pIdx) => (
              <div key={pIdx} className="group relative">
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-600 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 resize-none min-h-[100px]"
                  style={{ backgroundColor: '#2a2a2a67', color: '#ffffff' }}
                  placeholder={`Write paragraph ${pIdx + 1}...`}
                  value={p}
                  onChange={(e) => onUpdateParagraph(pIdx, e.target.value)}
                />
                {section.paragraphs.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => onRemoveParagraph(pIdx)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="w-full py-3 border-2 border-dashed border-gray-600 hover:border-blue-500 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
              onClick={onAddParagraph}
            >
              + Add Paragraph
            </button>
          </div>
        </div>

        {/* Images */}
        {section.images.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Images</h4>
            <div className="space-y-4">
              {section.images.map((img, imgIdx) => (
                <div key={imgIdx} className="p-4 border border-gray-600 rounded-lg" style={{ backgroundColor: '#2a2a2a67' }}>
                  <div className="grid gap-4">
                    <div className="grid md:grid-cols-[1fr_auto] gap-3">
                      <input
                        className="px-3 py-2 rounded-lg border border-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        style={{ backgroundColor: '#3a3a3a', color: '#ffffff' }}
                        placeholder="Image URL"
                        value={img.url}
                        onChange={(e) => onUpdateImage(imgIdx, { url: e.target.value })}
                      />
                      <ImageUploader
                        label="Upload"
                        onUploaded={(url) => onUpdateImage(imgIdx, { url })}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      <select
                        className="px-3 py-2 rounded-lg border border-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        style={{ backgroundColor: '#3a3a3a', color: '#ffffff' }}
                        value={img.position}
                        onChange={(e) =>
                          onUpdateImage(imgIdx, {
                            position: e.target.value as ImageSpec["position"],
                            ...(e.target.value !== "between" ? { betweenIndex: undefined } : {}),
                          })
                        }
                      >
                        <option value="above">Above paragraphs</option>
                        <option value="between">Between paragraphs</option>
                        <option value="below">Below paragraphs</option>
                      </select>

                      <select
                        className="px-3 py-2 rounded-lg border border-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                        style={{ backgroundColor: '#3a3a3a', color: '#ffffff' }}
                        disabled={img.position !== "between"}
                        value={
                          img.position === "between" && typeof img.betweenIndex === "number"
                            ? String(img.betweenIndex)
                            : ""
                        }
                        onChange={(e) =>
                          onUpdateImage(imgIdx, {
                            betweenIndex: e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      >
                        <option value="">Select position</option>
                        {section.paragraphs.map((_, pIdx) => (
                          <option key={pIdx} value={pIdx}>
                            After paragraph {pIdx + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      className="self-start px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                      onClick={() => onRemoveImage(imgIdx)}
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          className="w-full py-3 border-2 border-dashed border-gray-600 hover:border-green-500 text-gray-400 hover:text-green-400 rounded-lg transition-colors"
          onClick={onAddImage}
        >
          + Add Image
        </button>
      </div>
    </div>
  );
}