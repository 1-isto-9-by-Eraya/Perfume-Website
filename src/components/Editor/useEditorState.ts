import { useState } from "react";

export type ImageSpec = {
  url: string;
  position: "above" | "below" | "between";
  betweenIndex?: number;
};

export type Section = {
  heading: string;
  paragraphs: string[];
  images: ImageSpec[];
};

export function useEditorState(initial?: { title: string; heroImage?: string; coverImage?: string; sections: Section[] }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [heroImage, setHeroImage] = useState(initial?.heroImage || "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [sections, setSections] = useState<Section[]>(
    initial?.sections?.length ? initial.sections : [{ heading: "", paragraphs: [""], images: [] }]
  );
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [touchedSections, setTouchedSections] = useState<Record<number, boolean>>({});

  const mark = (k: string) => setTouched((x) => ({ ...x, [k]: true }));
  const markSection = (index: number) => setTouchedSections((x) => ({ ...x, [index]: true }));

  const invalidTitle = !title.trim() && touched.title;
  const invalidSections = touched.sections && (!sections.length || sections.some((s, i) => !s.heading.trim() && touchedSections[i]));

  // Section mutators
  const addSection = () => {
    setSections((prev) => [...prev, { heading: "", paragraphs: [""], images: [] }]);
    
    // Use Lenis smooth scroll instead of native scrollIntoView
    setTimeout(() => {
      const newSectionIndex = sections.length;
      const element = document.querySelector(`[data-section-index="${newSectionIndex}"]`);
      if (element) {
        // Get Lenis instance if available
        const lenis = (window as any).lenis;
        if (lenis) {
          // Use Lenis scrollTo for smooth scrolling
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetY = rect.top + scrollTop - 100; // 100px offset from top
          lenis.scrollTo(targetY, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
          // Fallback to native scroll
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 200); // Increased delay to let Lenis recalculate
  };

  const removeSection = (idx: number) => {
    setSections((prev) => prev.filter((_, i) => i !== idx));
    setTouchedSections((prev) => {
      const newTouched = { ...prev };
      delete newTouched[idx];
      const adjusted: Record<number, boolean> = {};
      Object.entries(newTouched).forEach(([key, value]) => {
        const index = parseInt(key);
        if (index > idx) {
          adjusted[index - 1] = value;
        } else {
          adjusted[index] = value;
        }
      });
      return adjusted;
    });
  };

  const setSection = (idx: number, patch: Partial<Section>) =>
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));

  const addParagraph = (sIdx: number) =>
    setSections((prev) =>
      prev.map((s, i) => (i === sIdx ? { ...s, paragraphs: [...s.paragraphs, ""] } : s))
    );

  const removeParagraph = (sIdx: number, pIdx: number) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? { ...s, paragraphs: s.paragraphs.filter((_, j) => j !== pIdx) }
          : s
      )
    );

  const setParagraph = (sIdx: number, pIdx: number, value: string) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? { ...s, paragraphs: s.paragraphs.map((p, j) => (j === pIdx ? value : p)) }
          : s
      )
    );

  const addImage = (sIdx: number) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              images: [...s.images, { url: "", position: "below" as const }],
            }
          : s
      )
    );

  const removeImage = (sIdx: number, imgIdx: number) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx ? { ...s, images: s.images.filter((_, j) => j !== imgIdx) } : s
      )
    );

  const setImage = (sIdx: number, imgIdx: number, patch: Partial<ImageSpec>) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? { ...s, images: s.images.map((img, j) => (j === imgIdx ? { ...img, ...patch } : img)) }
          : s
      )
    );

  return {
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
    sectionMutators: {
      addSection,
      removeSection,
      setSection,
      addParagraph,
      removeParagraph,
      setParagraph,
      addImage,
      removeImage,
      setImage,
    }
  };
}