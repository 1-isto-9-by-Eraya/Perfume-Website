import { SectionCard } from "./SectionCard";
import type { Section, ImageSpec } from "./useEditorState";

interface ContentSectionsSectionProps {
  sections: Section[];
  invalidSections: boolean;
  touched: Record<string, boolean>;
  touchedSections: Record<number, boolean>;
  mark: (key: string) => void;
  markSection: (index: number) => void;
  addSection: () => void;
  removeSection: (idx: number) => void;
  setSection: (idx: number, patch: Partial<Section>) => void;
  addParagraph: (sIdx: number) => void;
  removeParagraph: (sIdx: number, pIdx: number) => void;
  setParagraph: (sIdx: number, pIdx: number, value: string) => void;
  addImage: (sIdx: number) => void;
  removeImage: (sIdx: number, imgIdx: number) => void;
  setImage: (sIdx: number, imgIdx: number, patch: Partial<ImageSpec>) => void;
}

export function ContentSectionsSection({
  sections,
  invalidSections,
  touched,
  touchedSections,
  mark,
  markSection,
  addSection,
  removeSection,
  setSection,
  addParagraph,
  removeParagraph,
  setParagraph,
  addImage,
  removeImage,
  setImage,
}: ContentSectionsSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold flex items-center space-x-2" style={{ color: '#fffff2' }}>
          <div className="w-1 h-8 bg-green-500 rounded-full"></div>
          <span>Content Sections</span>
        </h2>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Section</span>
        </button>
      </div>

      {invalidSections && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Each section requires a heading</span>
          </p>
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section, sIdx) => (
          <SectionCard
            key={sIdx}
            section={section}
            sectionIndex={sIdx}
            isInvalid={!section.heading.trim() && touchedSections[sIdx]}
            onMarkTouched={() => markSection(sIdx)}
            onRemoveSection={() => removeSection(sIdx)}
            onUpdateSection={(patch) => setSection(sIdx, patch)}
            onAddParagraph={() => addParagraph(sIdx)}
            onRemoveParagraph={(pIdx) => removeParagraph(sIdx, pIdx)}
            onUpdateParagraph={(pIdx, value) => setParagraph(sIdx, pIdx, value)}
            onAddImage={() => addImage(sIdx)}
            onRemoveImage={(imgIdx) => removeImage(sIdx, imgIdx)}
            onUpdateImage={(imgIdx, patch) => setImage(sIdx, imgIdx, patch)}
            canRemove={sections.length > 1}
          />
        ))}
      </div>
    </section>
  );
}