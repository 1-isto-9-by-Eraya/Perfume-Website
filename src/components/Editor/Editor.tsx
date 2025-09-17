"use client";

import { PostDetailsSection } from "./PostDetailsSection";
import { ContentSectionsSection } from "./ContentSectionsSection";
import { EditorSidebar } from "./EditorSidebar";
import { useEditorState, type ImageSpec, type Section } from "./useEditorState";

export interface EditorProps {
  onSubmit: (v: { title: string; heroImage?: string; coverImage?: string; sections: Section[] }) => void;
  initial?: { title: string; heroImage?: string; coverImage?: string; sections: Section[] };
}

export default function Editor({ onSubmit, initial }: EditorProps) {
  const {
    title,
    setTitle,
    heroImage,
    setHeroImage,
    coverImage,
    setCoverImage,
    sections,
    busy,
    setBusy,
    touched,
    touchedSections,
    mark,
    markSection,
    invalidTitle,
    invalidSections,
    sectionMutators
  } = useEditorState(initial);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mark("title");
    mark("sections");
    sections.forEach((_, index) => markSection(index));
    
    if (!title.trim()) return;
    if (!sections.length || sections.some((s) => !s.heading.trim())) return;

    try {
      setBusy(true);
      await onSubmit({ title, heroImage, coverImage, sections });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#191919', color: '#ffffff' }} className="min-h-screen">
      <form
        className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_400px] gap-12"
        onSubmit={handleSubmit}
      >
        <main className="space-y-8">
          <PostDetailsSection
            title={title}
            setTitle={setTitle}
            heroImage={heroImage}
            setHeroImage={setHeroImage}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            invalidTitle={invalidTitle}
            onTitleBlur={() => mark("title")}
          />
          
          <ContentSectionsSection
            sections={sections}
            invalidSections={invalidSections}
            touched={touched}
            touchedSections={touchedSections}
            mark={mark}
            markSection={markSection}
            {...sectionMutators}
          />
        </main>

        <EditorSidebar
          busy={busy}
          sections={sections}
          title={title}
          heroImage={heroImage}
        />
      </form>
    </div>
  );
}

export type { ImageSpec, Section };