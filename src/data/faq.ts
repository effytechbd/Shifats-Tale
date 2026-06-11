/**
 * Frequently Asked Questions (FAQ) Data Configuration
 * 
 * Edit this file to add or change question and answers.
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Where is the coaching center located?",
    answer: "Our offline facility is located at Sekandar & M.P Yusuf Building (3rd Floor), next to Rangunia College, Rangunia, Chattogram. Easily accessible from all parts of Rangunia."
  },
  {
    id: "faq-2",
    question: "How can I join the coaching?",
    answer: "We do not offer online admission. To enroll, please contact Shifat Sir directly on WhatsApp or over the phone at +880 1879-169446, or visit our Rangunia office during office hours (Daily 4:00 PM - 9:00 PM)."
  },
  {
    id: "faq-3",
    question: "Is there any demo class?",
    answer: "Yes, you can watch our free concept breakdown lectures in the 'Free Videos' section of this homepage or on our YouTube channel. We also offer standard trial class sessions for registered batch queries."
  },
  {
    id: "faq-4",
    question: "Which subjects are taught?",
    answer: "Shifat Sir specializes in Physics and Higher Mathematics for both SSC and HSC levels, focusing on building board syllabus fundamentals and engineering/university admission standards."
  },
  {
    id: "faq-5",
    question: "Are weekly exams taken?",
    answer: "Yes, we conduct chapter-wise written quizzes and monthly comprehensive board-standard exams. Scripts are graded personally by Shifat Sir, and marks are shared directly with guardians."
  },
  {
    id: "faq-6",
    question: "Are lecture sheets provided?",
    answer: "Yes, all students receive custom conceptual lecture sheets, handwritten mathematics concept books, and mathematical shortcut checklists compiled directly by Shifat Sir."
  },
  {
    id: "faq-7",
    question: "Can weak students join?",
    answer: "Absolutely. We keep batch sizes strictly capped at 25-30 students to provide individual attention, personal query resolution slots, and structural feedback support."
  },
  {
    id: "faq-8",
    question: "How can guardians contact the teacher?",
    answer: "Guardians can schedule a call or meet Shifat Sir directly during designated parent consulting hours (typically between 5:00 PM and 6:30 PM on scheduled class days)."
  },
  {
    id: "faq-9",
    question: "What is the monthly fee?",
    answer: "Monthly fees vary depending on the level (SSC or HSC) and the specific program (Academic Batch or Admission Care). Please contact Shifat Sir directly on WhatsApp for detailed program fees."
  }
];
