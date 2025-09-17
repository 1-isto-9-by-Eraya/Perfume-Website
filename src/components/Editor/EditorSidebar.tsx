import type { Section } from "./useEditorState";

interface EditorSidebarProps {
  busy: boolean;
  sections: Section[];
  title: string;
  heroImage: string;
}

export function EditorSidebar({ busy, sections, title, heroImage }: EditorSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="sticky top-6 space-y-4">
        {/* Publish Actions */}
        <div className="p-6 border border-gray-700 rounded-xl" style={{ backgroundColor: '#1f1f1f' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#fffff2' }}>Publish</h3>
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {busy ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Publish Post</span>
              </>
            )}
          </button>
        </div>

        {/* Table of Contents */}
        <div className="p-6 border border-gray-700 rounded-xl" style={{ backgroundColor: '#1f1f1f' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#fffff2' }}>Table of Contents</h3>
          <div className="space-y-2">
            {sections.map((s, i) => (
              <div key={i} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800/30">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                  {i + 1}
                </div>
                <span className="text-sm truncate" style={{ color: s.heading ? '#ffffff' : '#888' }}>
                  {s.heading || "Untitled section"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="p-6 border border-gray-700 rounded-xl" style={{ backgroundColor: '#1f1f1f' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#fffff2' }}>Preview</h3>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold" style={{ color: '#fffff2' }}>
              {title || "Post title..."}
            </h4>
            {heroImage ? (
              <img src={heroImage} alt="" className="w-full h-32 object-cover rounded-lg border border-gray-600" />
            ) : (
              <div className="w-full h-32 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-sm">
                No hero image
              </div>
            )}
            <div className="space-y-3 text-sm">
              {sections.slice(0, 2).map((sec, sIdx) => (
                <div key={sIdx}>
                  <h5 className="font-medium" style={{ color: '#fffff2' }}>
                    {sec.heading || "Section heading..."}
                  </h5>
                  <p className="text-gray-400 text-xs">
                    {sec.paragraphs[0]?.slice(0, 60) || "No content..."}
                    {(sec.paragraphs[0]?.length || 0) > 60 ? "..." : ""}
                  </p>
                </div>
              ))}
              {sections.length > 2 && (
                <p className="text-xs text-gray-500">+ {sections.length - 2} more sections</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}