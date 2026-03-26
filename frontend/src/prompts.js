export const MODE_CONFIG = {
  DSA: {
    title: "DSA Practice",
    subtitle: "Data Structures & Algorithms",
    description: "Master coding interviews with step-by-step problem solving, from arrays to dynamic programming.",
    icon: "🧩",
    color: "from-indigo-500 to-purple-600",
    colorLight: "from-indigo-500/20 to-purple-600/20",
    borderColor: "border-indigo-500/30",
    textColor: "text-indigo-400",
    bgAccent: "bg-indigo-500/10",
    initialMessage: "Welcome! I'm your DSA interviewer today. Let's test your problem-solving skills. 🚀\n\nLet's start with a classic — **Two Sum Problem**:\n\n*Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.*\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n**Walk me through your approach before writing any code.**",
  },
  HR: {
    title: "HR Interview",
    subtitle: "Professional & Situational",
    description: "Prepare for HR rounds with questions on teamwork, leadership, career goals, and workplace scenarios.",
    icon: "💼",
    color: "from-emerald-500 to-teal-600",
    colorLight: "from-emerald-500/20 to-teal-600/20",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    initialMessage: "Hello! I'll be your HR interviewer today. I'll be evaluating your responses for clarity, confidence, and structured thinking. 💼\n\nLet's begin with a common but important question:\n\n**Tell me about yourself — your background, what you're working on currently, and what you're looking for in your next role.**\n\nTake your time and structure your response well.",
  },
  Behavioral: {
    title: "Behavioral Interview",
    subtitle: "Communication & Storytelling",
    description: "Ace behavioral questions with the STAR method — focus on leadership, conflict, and impact stories.",
    icon: "🎭",
    color: "from-amber-500 to-orange-600",
    colorLight: "from-amber-500/20 to-orange-600/20",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    bgAccent: "bg-amber-500/10",
    initialMessage: "Hi there! I'm your behavioral interview mentor. I'll help you craft compelling stories that showcase your skills and impact. 🎯\n\nLet's start:\n\n**Tell me about a time when you faced a significant challenge at work or in a project. How did you handle it, and what was the outcome?**\n\nRemember to use the **STAR method**: Situation, Task, Action, Result.",
  },
};

export const SUGGESTIONS = {
  DSA: [
    "Explain Two Sum using HashMap",
    "Walk me through Binary Search",
    "How would you reverse a linked list?",
  ],
  HR: [
    "Tell me about yourself",
    "Why do you want to work here?",
    "What are your greatest strengths?",
  ],
  Behavioral: [
    "A time I showed leadership",
    "How I handled a conflict",
    "A project I'm most proud of",
  ],
};
