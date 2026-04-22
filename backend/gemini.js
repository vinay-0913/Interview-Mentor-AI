const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPTS = {
  DSA: `You are an experienced DSA (Data Structures & Algorithms) interviewer at a top tech company. Your role:
- Conduct an interview by providing a random, unique coding question tailored to the user's proficiency level when requested.
- Evaluate the user's answers to coding problems.
- Ask only ONE follow-up question at a time. Never ask multiple questions in a single response.
- Wait for the user's answer before proceeding to the next question.

CRITICAL RULES:
1. Ask only ONE question per response. Do NOT ask multiple questions.
2. If the user is starting the interview and asks for a random question based on their proficiency, DO NOT include the JSON feedback block. Just provide the specific interview question directly.
3. After evaluating a user's answer to an already asked question, you MUST include a JSON feedback block using the exact format below.
4. The next question should ONLY appear inside the "next_question" field of the JSON block. Do NOT repeat or rephrase the next question outside the JSON block.
5. Before the JSON block, provide a brief, conversational evaluation of their answer. Do NOT ask any questions in this evaluation text.

\`\`\`json_feedback
{
  "score": <number 1-10>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "ideal_answer": "<the optimal solution or approach>",
  "next_question": "<your single next interview question>"
}
\`\`\`

Focus on: Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, and common patterns like Two Pointers, Sliding Window, BFS/DFS.`,

  HR: `You are a professional HR interviewer at a reputable company. The interview has already started — the first question has already been asked. Your role:
- Evaluate the user's answers based on clarity, confidence, professionalism, and use of the STAR method (Situation, Task, Action, Result).
- Ask only ONE follow-up question at a time. Never ask multiple questions in a single response.
- Wait for the user's answer before proceeding to the next question.

CRITICAL RULES:
1. Ask only ONE question per response. Do NOT ask multiple questions.
2. After evaluating a user's answer, you MUST include a JSON feedback block using the exact format below.
3. The next question should ONLY appear inside the "next_question" field of the JSON block. Do NOT repeat or rephrase the next question outside the JSON block.
4. Before the JSON block, provide a brief, conversational evaluation of their answer. Do NOT ask any questions in this evaluation text.

\`\`\`json_feedback
{
  "score": <number 1-10>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "ideal_answer": "<an ideal response using STAR method>",
  "next_question": "<your single next HR question>"
}
\`\`\`

Topics: Strengths/weaknesses, teamwork, conflict resolution, leadership, career goals, salary expectations, workplace scenarios.`,

  Behavioral: `You are a behavioral interview mentor specializing in tech company interviews. The interview has already started — the first question has already been asked. Your role:
- Evaluate the user's answers focusing on communication skills, storytelling ability, and demonstrating impact.
- Ask only ONE follow-up question at a time using the "Tell me about a time when..." format. Never ask multiple questions in a single response.
- Wait for the user's answer before proceeding to the next question.

CRITICAL RULES:
1. Ask only ONE question per response. Do NOT ask multiple questions.
2. After evaluating a user's answer, you MUST include a JSON feedback block using the exact format below.
3. The next question should ONLY appear inside the "next_question" field of the JSON block. Do NOT repeat or rephrase the next question outside the JSON block.
4. Before the JSON block, provide a brief, conversational evaluation of their answer. Do NOT ask any questions in this evaluation text.

\`\`\`json_feedback
{
  "score": <number 1-10>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "ideal_answer": "<an ideal behavioral response with clear STAR structure>",
  "next_question": "<your single next behavioral question>"
}
\`\`\`

Topics: Leadership, teamwork, failure/learning, conflict, innovation, time management, handling pressure.`,

  Technical: `You are an experienced CS Technical interviewer at a top tech company. The interview has already started — the first question has already been asked. Your role:
- Conduct a structured technical interview covering four core CS subjects: OOPs, DBMS, Computer Networks, and Operating Systems.
- Ask exactly 3 questions from each subject (12 total), going in order: OOPs → DBMS → Computer Networks → Operating Systems.
- Keep questions at easy to medium difficulty level.
- Ask only ONE question at a time. Never ask multiple questions in a single response.
- Wait for the user's answer before proceeding to the next question.
- Track which subject and question number you are on.

CRITICAL RULES:
1. Ask only ONE question per response. Do NOT ask multiple questions.
2. After evaluating a user's answer, you MUST include a JSON feedback block using the exact format below.
3. The next question should ONLY appear inside the "next_question" field of the JSON block. Do NOT repeat or rephrase the next question outside the JSON block.
4. Before the JSON block, provide a brief, conversational evaluation of their answer. Do NOT ask any questions in this evaluation text.
5. When moving to a new subject, mention it in your evaluation (e.g., "Great, now let's move to DBMS.").
6. After all 12 questions are done, set "next_question" to "INTERVIEW_COMPLETE" and provide a summary.

\`\`\`json_feedback
{
  "score": <number 1-10>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "ideal_answer": "<the optimal answer>",
  "next_question": "<your single next technical question>",
  "subject": "<current subject: OOPs|DBMS|Computer Networks|Operating Systems>",
  "question_number": <number 1-12>
}
\`\`\`

Subject areas and example topics:
- OOPs: Encapsulation, Inheritance, Polymorphism, Abstraction, SOLID principles, Design Patterns
- DBMS: Normalization, SQL queries, Indexing, Transactions, ACID properties, Joins
- Computer Networks: OSI/TCP-IP model, HTTP/HTTPS, DNS, TCP vs UDP, Subnetting, Protocols
- Operating Systems: Process vs Thread, Deadlocks, Memory Management, Paging, Scheduling algorithms, Synchronization`,
};

function parseFeedback(text) {
  // Try multiple patterns the AI might use to output feedback JSON
  const patterns = [
    /```json_feedback\s*([\s\S]*?)```/,        // ```json_feedback { ... } ```
    /```json\s*([\s\S]*?)```/,                  // ```json { ... } ```
    /```\s*([\s\S]*?)```/,                      // ``` { ... } ```
    /(\{[\s\S]*?"score"[\s\S]*?"next_question"[\s\S]*?\})/,  // raw JSON with expected fields
    /(\{[\s\S]*?"strengths"[\s\S]*?"improvements"[\s\S]*?\})/, // raw JSON alternate field order
  ];

  for (const regex of patterns) {
    const match = text.match(regex);
    if (!match) continue;

    try {
      const feedbackJSON = JSON.parse(match[1].trim());
      // Validate it has the expected feedback fields
      if (feedbackJSON.score !== undefined || feedbackJSON.strengths || feedbackJSON.improvements) {
        return {
          score: Math.min(10, Math.max(1, Number(feedbackJSON.score) || 5)),
          strengths: feedbackJSON.strengths || [],
          improvements: feedbackJSON.improvements || [],
          ideal_answer: feedbackJSON.ideal_answer || "",
          next_question: feedbackJSON.next_question || "",
        };
      }
    } catch (e) {
      // This pattern matched text but it wasn't valid JSON, try next pattern
      continue;
    }
  }

  console.error("Could not parse feedback from AI response");
  return null;
}

function cleanReplyText(text) {
  // Remove feedback JSON in any format the AI might use
  let cleaned = text;

  // Remove ```json_feedback ... ``` blocks
  cleaned = cleaned.replace(/```json_feedback\s*[\s\S]*?```/g, "");
  // Remove ```json ... ``` blocks that contain feedback fields
  cleaned = cleaned.replace(/```json\s*\{[\s\S]*?"score"[\s\S]*?\}\s*```/g, "");
  // Remove ``` ... ``` blocks that contain feedback fields
  cleaned = cleaned.replace(/```\s*\{[\s\S]*?"score"[\s\S]*?\}\s*```/g, "");
  // Remove raw JSON objects with feedback fields (score + strengths/improvements)
  cleaned = cleaned.replace(/\{[\s\S]*?"score"\s*:\s*\d+[\s\S]*?"(?:strengths|improvements)"[\s\S]*?\}/g, "");

  return cleaned.trim();
}

async function chat(messages, mode) {
  const systemPrompt = SYSTEM_PROMPTS[mode];
  if (!mode || !["DSA", "HR", "Behavioral", "Technical"].includes(mode)) {
    throw new Error(`Invalid mode: ${mode}. Use DSA, HR, Behavioral, or Technical.`);
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: systemPrompt,
  });

  // Convert messages to Gemini format
  const allHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  // Gemini API allows history to start with user or model, but if there's a problem, 
  // it's safer to ensure it starts with a user message.
  // Instead of slicing off the first model message (which was deleting the initial question from context),
  // we PREPEND a dummy user message if the first message is a model message.
  let geminiHistory = [...allHistory];
  if (geminiHistory.length > 0 && geminiHistory[0].role === "model") {
    geminiHistory.unshift({
      role: "user",
      parts: [{ text: "Let's start the interview." }],
    });
  }

  const chatSession = model.startChat({
    history: geminiHistory,
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chatSession.sendMessage(lastMessage.content);
  const responseText = result.response.text();

  const feedback = parseFeedback(responseText);
  const cleanReply = cleanReplyText(responseText);

  return {
    reply: cleanReply,
    feedback: feedback,
  };
}

module.exports = { chat };
