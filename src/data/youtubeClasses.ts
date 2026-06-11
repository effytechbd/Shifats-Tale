/**
 * YouTube Lectures / Free Classes Data Configuration
 * 
 * Edit this file to add links to YouTube concept classes.
 * You can customize the title, subject, chapter, teacher, duration, thumbnail path, and YouTube URL.
 */

export interface YouTubeClass {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  teacher: string;
  duration: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  
  // Keep for backward compatibility with UI
  topic: string;
  embedId: string;
  views?: string;
}

export const youtubeClasses: YouTubeClass[] = [
  {
    id: "yt-1",
    title: "Newtonian Mechanics: Friction & Slanted Planes (Concept Class)",
    subject: "Physics",
    chapter: "Newtonian Mechanics",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "45 mins",
    thumbnailUrl: "/images/gallery_classroom.png", // Example local thumbnail
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    topic: "HSC Physics - Newtonian Mechanics",
    embedId: "dQw4w9WgXcQ",
    views: "12K+ views"
  },
  {
    id: "yt-2",
    title: "Calculus for Beginners: Integration Made Easy",
    subject: "Higher Math",
    chapter: "Calculus",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "1 hr 15 mins",
    thumbnailUrl: "/images/gallery_notes.png",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    topic: "HSC Higher Math - Calculus",
    embedId: "dQw4w9WgXcQ",
    views: "8.5K+ views"
  },
  {
    id: "yt-3",
    title: "Vector Operations & River-Boat Math Challenges",
    subject: "Physics",
    chapter: "Vector",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "55 mins",
    thumbnailUrl: "/images/gallery_solve.png",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    topic: "HSC Physics - Vector",
    embedId: "dQw4w9WgXcQ",
    views: "15K+ views"
  },
  {
    id: "yt-4",
    title: "Complex Numbers - Shortcuts for Admission Tests",
    subject: "Higher Math",
    chapter: "Complex Numbers",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "38 mins",
    thumbnailUrl: "/images/gallery_event.png",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    topic: "Admission Math",
    embedId: "dQw4w9WgXcQ",
    views: "9.2K+ views"
  }
];
