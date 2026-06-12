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
    title: "1. Why Imaginary Number? | Complex Number | MATH",
    subject: "Higher Math",
    chapter: "Complex Numbers",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "5 mins",
    thumbnailUrl: "https://img.youtube.com/vi/Wm3TpjMTlv8/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=Wm3TpjMTlv8",
    topic: "HSC Higher Math - Complex Numbers",
    embedId: "Wm3TpjMTlv8",
    views: "100+ views"
  },
  {
    id: "yt-2",
    title: "বেনজিন প্রস্তুতি | এরোমেটিক হাইড্রোকার্বন | জৈব রসায়ন",
    subject: "Chemistry",
    chapter: "Organic Chemistry",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "15 mins",
    thumbnailUrl: "https://img.youtube.com/vi/W4ZZLed0HCU/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=W4ZZLed0HCU",
    topic: "HSC Chemistry - Organic Chemistry",
    embedId: "W4ZZLed0HCU",
    views: "200+ views"
  },
  {
    id: "yt-3",
    title: "01. INTEGRATION Part - 01 | BUET CKRUET ADMISSION",
    subject: "Higher Math",
    chapter: "Integration",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "2 hrs 52 mins",
    thumbnailUrl: "https://img.youtube.com/vi/ZdydmWco4PM/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=ZdydmWco4PM",
    topic: "Admission Math - Integration",
    embedId: "ZdydmWco4PM",
    views: "2.8K+ views"
  },
  {
    id: "yt-4",
    title: "Differentiation (অন্তরীকরণ) | Limit | part-01 | BUET CKRUET DU VARSITY ADMISSION",
    subject: "Higher Math",
    chapter: "Differentiation",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "2 hrs 11 mins",
    thumbnailUrl: "https://img.youtube.com/vi/W_C4Gq_l4Js/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=W_C4Gq_l4Js",
    topic: "Admission Math - Differentiation",
    embedId: "W_C4Gq_l4Js",
    views: "1.3K+ views"
  }
];
