import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateEventPlan(eventData) {
  if (!genAI) {
    return getFallbackPlan(eventData);
  }

  const prompt = `
You are an expert event producer. Create a comprehensive, realistic event plan based on these parameters:
- Title: ${eventData.title}
- Event Type: ${eventData.type}
- City: ${eventData.location}
- Guests: ${eventData.guestCount}
- Total Budget: ${eventData.currency}${eventData.budget}
- Desired Vibe: ${eventData.vibe}

Respond ONLY with a valid JSON object matching this exact schema (do not wrap in markdown code blocks like \`\`\`json):
{
  "concept": {
    "themeTitle": "string",
    "summary": "string (2-3 sentences)",
    "highlights": ["string", "string", "string"]
  },
  "budget": [
    { "category": "string", "allocated": number, "percentage": number, "tip": "string" }
  ],
  "timeline": [
    { "time": "string", "title": "string", "description": "string" }
  ],
  "checklist": [
    { "id": "1", "task": "string", "priority": "High" | "Medium" | "Low", "category": "string", "done": false }
  ]
}
`;

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error, falling back to local template:", error);
    return getFallbackPlan(eventData);
  }
}

function getFallbackPlan(eventData) {
  const b = Number(eventData.budget) || 100000;
  return {
    concept: {
      themeTitle: `${eventData.type} Elegance`,
      summary: `A carefully balanced ${eventData.type.toLowerCase()} in ${eventData.location} designed for ${eventData.guestCount} guests, prioritizing comfort and memorable aesthetics.`,
      highlights: [
        "Curated multi-course catering experience matching local taste",
        "Aesthetic ambient lighting setup with focused photo zones",
        "Seamless digital guest registration and flow management"
      ]
    },
    budget: [
      { category: "Venue & Hospitality", allocated: Math.round(b * 0.40), percentage: 40, tip: "Negotiate complimentary sound or setup hours" },
      { category: "Food & Beverage", allocated: Math.round(b * 0.30), percentage: 30, tip: "Opt for live counters rather than heavy sit-down courses" },
      { category: "Decor & Production", allocated: Math.round(b * 0.15), percentage: 15, tip: "Focus lighting on key focal spots rather than full hall" },
      { category: "Photography & Media", allocated: Math.round(b * 0.10), percentage: 10, tip: "Book candid shooters with same-day edits" },
      { category: "Contingency Fund", allocated: Math.round(b * 0.05), percentage: 5, tip: "Hold for last-minute permissions or extra guest plates" }
    ],
    timeline: [
      { time: "05:00 PM", title: "Vendor Setup & Audio Checks", description: "All staging, decor, and sound systems completed and tested." },
      { time: "06:30 PM", title: "Guest Arrival & Welcome Drinks", description: "Registration desk open, background acoustic music playing." },
      { time: "07:30 PM", title: "Main Event Ceremony / Spotlight", description: "Core speeches, key celebratory moments, or performances." },
      { time: "08:30 PM", title: "Dinner & Networking", description: "Buffet lines open, informal interactions." },
      { time: "10:30 PM", title: "Wrap-up & Vendor Settlement", description: "Final token handovers and guest send-offs." }
    ],
    checklist: [
      { id: "1", task: "Confirm venue contract and booking advance", priority: "High", category: "Venue", done: true },
      { id: "2", task: "Finalize menu tasting and head count buffer", priority: "High", category: "Catering", done: false },
      { id: "3", task: "Book main photographer and brief shot list", priority: "Medium", category: "Media", done: false },
      { id: "4", task: "Send digital invites with RSVP forms", priority: "High", category: "Invites", done: true },
      { id: "5", task: "Order event signage and welcome boards", priority: "Low", category: "Decor", done: false }
    ]
  };
}