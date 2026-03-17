import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ToolType, PersonalityType } from "../types";

export const getGeminiResponse = async (
  query: string, 
  type: ToolType, 
  grade: string, 
  personality: PersonalityType,
  onChunk: (text: string) => void,
  fileData?: { data: string; mimeType: string },
  isPremium: boolean = false
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });
  // Premium users get the more powerful Pro model, others get Flash
  const model = isPremium ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";
  
  let personalityInstruction = "";
  // ... (rest of personality switch remains the same)
  switch (personality) {
    case PersonalityType.TEACHER:
      personalityInstruction = "Persona: Master Academic Mentor. Be patient, highly structured, and encouraging. Deliver complex concepts with elite clarity and professional rigor.";
      break;
    case PersonalityType.BUDDY:
      personalityInstruction = "Persona: Premium Strategic Assistant. Be friendly, sophisticated, and exceptionally efficient. Act as a trusted intellectual partner for high-level tasks.";
      break;
    case PersonalityType.STRICT:
      personalityInstruction = "Persona: Senior Technical Analyst. Be precise, concise, and professional. Deliver direct, high-fidelity responses with maximum accuracy and zero redundancy.";
      break;
    case PersonalityType.SOCRATIC:
      personalityInstruction = "Persona: Socratic Tutor. DO NOT give the answer immediately. Instead, guide the student to find it by asking leading questions. Break down the problem into smaller steps and ask the student what the next logical move should be. Support academic integrity and genuine learning.";
      break;
    case PersonalityType.LEPRECHAUN:
      personalityInstruction = "Persona: Lucky Leprechaun. Be mischievous, cheerful, and full of Irish charm. Use phrases like 'Happy St. Patrick's Day!', 'Feeling lucky today?', 'Top o' the mornin'', 'Faith and Begorra', and 'Luck of the Irish'. Mention pots of gold, rainbows, and four-leaf clovers. Keep the academic quality high but delivered with a playful, magical twist.";
      break;
  }

  const premiumStatus = isPremium 
    ? "PREMIUM PROTOCOL ACTIVE: You are operating in ELITE MODE. Provide maximum depth, advanced reasoning, and exhaustive detail. Use sophisticated vocabulary and complex structural analysis."
    : "STANDARD PROTOCOL: Provide clear, efficient, and accurate responses.";

  const isStPatricksUpdate = true;
  const stPatricksTwist = "SPECIAL DIRECTIVE: It is St. Patrick's Day season. Infuse your response with a touch of Irish luck and festive cheer. Mention a 'Lucky Fact' or a 'Clover Tip' if appropriate. ";

  const premiumPrefix = `PROTOCOL ACTIVE: You are TSAI, the world's most sophisticated intelligence interface. ${premiumStatus} ${personalityInstruction} ${stPatricksTwist} Your output must be elegant, professional, and accurate, reflecting an elite user experience. `;

  let systemInstruction = "";
  let responseMimeType = "text/plain";

  if (type === ToolType.MATH) {
    const socraticRule = personality === PersonalityType.SOCRATIC 
      ? "MISSION: Guide the student through the problem using Socratic questioning. DO NOT provide the final answer yet. Ask the student for the next step."
      : "MISSION: Provide clear, rigorous mathematical solutions. Use professional Markdown formatting. REQUIREMENT: Conclude precisely with 'Final Answer: [result]'.";

    systemInstruction = premiumPrefix + `MODULE: Math Solver Core. 
    - Target Academic Level: ${grade}.
    - ${socraticRule}
    - Leverage LaTeX-style formulas where applicable.`;
  } else if (type === ToolType.FACT) {
    systemInstruction = premiumPrefix + `MODULE: Curiosity Archive.
    - MISSION: Provide a sophisticated, verifiable, and significant general knowledge fact.
    - FORMAT: Elegant headline, detailed fact, followed by sharp strategic commentary.`;
  } else if (type === ToolType.STORY) {
    systemInstruction = premiumPrefix + `MODULE: Narrative Architect.
    - Target Audience Level: ${grade}.
    - MISSION: Construct immersive, high-quality narratives or retell classics with sophisticated prose.
    - FORMAT: Optimal Markdown readability with literary depth.`;
  } else if (type === ToolType.WORD) {
    systemInstruction = premiumPrefix + `MODULE: Global Linguistic Intelligence.
    - MISSION: Select a sophisticated and powerful "Word of the Day" representing wisdom or excellence.
    - FORMAT: 
      # [The Word] ([Language/Country])
      *Pronunciation*: [Phonetic]
      **Definition**: [Meaning in English]
      **Usage**: [Strategic Example]
      **Origin**: [Etymological Context]
    - TONE: Professional and authoritative.`;
  } else if (type === ToolType.SCIENCE) {
    systemInstruction = premiumPrefix + `MODULE: Science Research Lab.
    - Target Academic Level: ${grade}.
    - MISSION: Explain scientific experiments and principles with technical precision. Include materials, step-by-step methodology, and core principles.`;
  } else if (type === ToolType.CODING) {
    systemInstruction = premiumPrefix + `MODULE: Code Astro Senior Architect.
    - Target Level: ${grade}.
    - MISSION: Provide efficient, well-documented code in HTML, CSS, or Java. Focus on modern standards and clean architecture.`;
  } else if (type === ToolType.MOTIVATION) {
    systemInstruction = premiumPrefix + `MODULE: Performance Mentor.
    - MISSION: Provide a powerful, original motivational insight for strategic minds.
    - FORMAT: 
      # [Directive Title]
      "[The Quote/Advice]"
      - [Strategic Commentary]`;
  } else if (type === ToolType.STUDY) {
    responseMimeType = "application/json";
    systemInstruction = premiumPrefix + `MODULE: Multi-Modal Study Set Architect.
    - MISSION: Transform the provided materials (text or image of notes) into a high-fidelity interactive study set.
    - OUTPUT REQUIREMENTS (JSON Format):
      {
        "summary": "A simplified summary written at a 5th-grade level to check base understanding.",
        "flashcards": [
          { "front": "Question/Concept", "back": "Answer/Explanation" }
        ],
        "quiz": [
          { "question": "Tricky question based on the text", "options": ["A", "B", "C", "D"], "answer": "Correct Option", "explanation": "Why it's correct" }
        ]
      }
    - STRATEGY: Focus on the most complex or 'trickiest' parts for the quiz. Ensure flashcards follow active recall principles.`;
  } else if (type === ToolType.VOICE_CONCEPT) {
    systemInstruction = premiumPrefix + `MODULE: Voice Architect & Concept Mapper.
    - MISSION: Transform raw, spoken "ramblings" or unstructured thoughts into a high-fidelity, structured essay outline or a visual-ready mind map.
    - FORMAT: 
      # [Concept Title]
      ## 🗺️ Strategic Mind Map
      - [Core Node]
        - [Sub-node 1]
        - [Sub-node 2]
      
      ## 📝 Structured Outline
      I. [Introduction/Thesis]
      II. [Key Argument 1]
      III. [Key Argument 2]
      IV. [Conclusion]
    - TONE: Professional, analytical, and highly organized.`;
  }

  try {
    const contents: any[] = [];
    if (fileData) {
      contents.push({
        parts: [
          { inlineData: { data: fileData.data, mimeType: fileData.mimeType } },
          { text: query || "Analyze these materials and generate a study set." }
        ]
      });
    } else {
      contents.push({ parts: [{ text: query || "Awaiting priority request." }] });
    }

    const result = await ai.models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction,
        responseMimeType,
      },
    });

    let fullText = "";
    let finalSources: { title: string; uri: string }[] = [];

    for await (const chunk of result) {
      const chunkText = chunk.text || "";
      fullText += chunkText;
      onChunk(fullText);

      // Check for grounding metadata in chunks (often comes in the final chunks)
      const candidate = chunk.candidates?.[0];
      if (candidate?.groundingMetadata?.groundingChunks) {
        const chunkSources = candidate.groundingMetadata.groundingChunks
          .map((c: any) => ({
            title: c.web?.title || c.text || "Verified Source",
            uri: c.web?.uri || "#"
          }))
          .filter((s: any) => s.uri && s.uri !== "#");
        
        if (chunkSources.length > 0) {
          finalSources = chunkSources;
        }
      }
    }

    return { text: fullText, sources: finalSources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Protocol Interrupted. Re-initiate connection.", sources: [] };
  }
};