/**
 * Gallery Items Data Configuration
 * 
 * Edit this file to add images to the gallery tab layout.
 * You can specify the category (classroom, notes, events, flyers), image paths, and description.
 */

export interface GalleryItem {
  id: string;
  title: string;
  category: "classroom" | "notes" | "events" | "flyers";
  image: string;
  imageUrl: string; // Keep for backward compatibility with UI
  description: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Interactive Classroom Session",
    category: "classroom",
    image: "/images/gallery-classroom.png",
    imageUrl: "/images/gallery-classroom.png",
    description: "Visual explanation of Mechanics concepts using 3D simulations in batch."
  },
  {
    id: "gal-2",
    title: "Special Formulas & Handwritten Notes",
    category: "notes",
    image: "/images/gallery-notes.png",
    imageUrl: "/images/gallery-notes.png",
    description: "Handwritten sheets and shortcut summaries distributed to admission students."
  },
  {
    id: "gal-3",
    title: "Meritorious Students Reception",
    category: "events",
    image: "/images/gallery-event.png",
    imageUrl: "/images/gallery-event.png",
    description: "Celebrating admission success and board GPA-5 holders with prizes."
  },
  {
    id: "gal-4",
    title: "Solve Class & Doubt Clearing",
    category: "classroom",
    image: "/images/gallery-solve.png",
    imageUrl: "/images/gallery-solve.png",
    description: "One-on-one doubt clearing sessions after standard quiz evaluations."
  },
  {
    id: "gal-5",
    title: "HSC-26 & Advanced HSC-27 Batch Flyer",
    category: "flyers",
    image: "/images/flyer_hsc26_hsc27.jpg",
    imageUrl: "/images/flyer_hsc26_hsc27.jpg",
    description: "Official admission notice for HSC-26 and Advanced HSC-27 regular academic batches."
  },
  {
    id: "gal-6",
    title: "HSC Special Model Test 2025 Flyer",
    category: "flyers",
    image: "/images/flyer_model_test_2025.png",
    imageUrl: "/images/flyer_model_test_2025.png",
    description: "Syllabus-wise model tests and paper final schedules for the HSC-25 & 26 batches."
  },
  {
    id: "gal-7",
    title: "Physics, Chemistry, Math & Engineering Admission Flyer",
    category: "flyers",
    image: "/images/flyer_admission_science.jpg",
    imageUrl: "/images/flyer_admission_science.jpg",
    description: "Engineering pre-admission guidelines and batch features for science group students."
  },
  {
    id: "gal-8",
    title: "HSC Final 2026 Revision Batch Flyer",
    category: "flyers",
    image: "/images/flyer_revision_2026.jpg",
    imageUrl: "/images/flyer_revision_2026.jpg",
    description: "HSC board question practice, CQ/MCQ sheets, and full syllabus final revision program."
  }
];
