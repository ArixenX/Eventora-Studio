import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowRight, ArrowLeft, 
  DollarSign, CheckSquare, Download, RefreshCw, 
  ChevronRight, Layers, Clock, MessageCircle, X, Send, Bot
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function detectEventType(titleStr) {
  const lower = (titleStr || '').toLowerCase();
  if (/birth|bday|b'day|annivers|party|jubilee/i.test(lower)) return 'Birthday & Social';
  if (/corp|summit|confer|hackathon|meetup|keynote|business|annual|seminar|launch/i.test(lower)) return 'Corporate & Tech';
  if (/wed|marriage|vivaah|recept|sangeet|haldi|mehendi/i.test(lower)) return 'Wedding & Traditional';
  if (/concert|fest|gig|show|live/i.test(lower)) return 'Concert & Festival';
  return 'Custom Gathering';
}

export default function App() {
  const [page, setPage] = useState('home');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);

  // Tabs scroll container and buttons ref
  const tabsContainerRef = useRef(null);
  const tabButtonRefs = useRef([]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your Eventora AI Concierge. Ask me anything about venue budgets, catering estimates, run-of-show timelines, or checklist tasks.'
    }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const [coords, setCoords] = useState({
    champX: 0, champY: 0, champScale: 1, champOpacity: 0.35,
    indigoX: 0, indigoY: 0,
    amberX: 0, amberY: 0
  });

  useEffect(() => {
    let animId;
    let t = 0;
    const animate = () => {
      t += 0.022;
      setCoords({
        champX: Math.sin(t * 0.9) * 160,
        champY: Math.cos(t * 0.7) * 90,
        champScale: 1 + Math.sin(t * 0.8) * 0.22,
        champOpacity: 0.30 + Math.sin(t * 0.6) * 0.15,
        indigoX: Math.cos(t * 0.75) * 170,
        indigoY: Math.sin(t * 0.55) * 110,
        amberX: Math.sin(t * 0.65) * -160,
        amberY: Math.cos(t * 0.8) * 95
      });
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const [simType, setSimType] = useState('Wedding');
  const [simGuests, setSimGuests] = useState(0);
  const [simBudget, setSimBudget] = useState(0);

  const SLIDER_MAX_BUDGET = 2500000;

  const [eventData, setEventData] = useState({
    title: "",
    type: "Special Event",
    location: "",
    guestCount: "",
    budget: "",
    currency: "₹",
    vibe: ""
  });

  const [plan, setPlan] = useState({
    concept: {
      themeTitle: "Define Your Event Scope",
      summary: "Enter your event title, location, expected attendance, and total budget above, then click 'Generate Blueprint' to craft your masterplan.",
      highlights: [
        "AI-calibrated budget breakdown mapped to verified industry benchmarks",
        "Chronological run-of-show schedule tailored to your format",
        "Prioritized checklist tracking essential operational deliverables"
      ]
    },
    budget: [],
    timeline: [],
    checklist: []
  });

  const generateTailoredPlan = (title, location, guests, budget, currency) => {
    const budgetNum = Number(budget) || 500000;
    const guestNum = Number(guests) || 100;
    const city = location || "New Delhi, India";
    const detected = detectEventType(title);

    if (detected === 'Corporate & Tech') {
      return {
        concept: {
          themeTitle: `${title || 'Corporate Summit'} • Executive Horizon`,
          summary: `A high-impact executive gathering in ${city} for ${guestNum} delegates, engineered with acoustic audiovisuals, keynote staging, and structured networking sessions.`,
          highlights: [
            "Seamless digital QR badge distribution and executive welcome lounge",
            "Dual high-definition LED stage wall, calibrated podium mics, and live presentation feed",
            "All-day artisanal coffee bar paired with an executive multi-cuisine networking luncheon"
          ]
        },
        budget: [
          { category: "Auditorium & Conference Suites", allocated: Math.round(budgetNum * 0.40), percentage: 40, note: "Main stage hall lease, breakout meeting suites, and dedicated gigabit Wi-Fi." },
          { category: "Executive Catering & High-Tea", allocated: Math.round(budgetNum * 0.28), percentage: 28, note: "Morning pastries, mid-day banquet luncheon, and evening high-tea service." },
          { category: "Audiovisuals, LED Wall & Staging", allocated: Math.round(budgetNum * 0.20), percentage: 20, note: "Main backdrop display, multi-mic wireless racks, and sound engineering crew." },
          { category: "Delegate Kits & Stage Branding", allocated: Math.round(budgetNum * 0.08), percentage: 8, note: "Lanyards, conference notepads, entry archways, and branding standees." },
          { category: "Contingency & Technical Reserve", allocated: Math.round(budgetNum * 0.04), percentage: 4, note: "Auxiliary power backup reserve and rapid-response AV hardware replacement." }
        ],
        timeline: [
          { time: "08:30 AM", title: "Delegate Registration & Welcome Barista", desc: "Attendee check-in, credential issuance, and morning networking lounge opening." },
          { time: "10:00 AM", title: "Opening Keynote & Strategic Vision", desc: "Main stage presentation, keynote address, and industry leadership panel." },
          { time: "01:00 PM", title: "Executive Networking Luncheon", desc: "Curated multi-cuisine buffet, dedicated client roundtables, and breakout discussions." },
          { time: "02:30 PM", title: "Interactive Technical Panels & Live Q&A", desc: "Moderated discussions featuring mobile audience mics and live digital polling." },
          { time: "05:00 PM", title: "Closing Remarks & Evening High-Tea", desc: "Honoring keynote speakers, distribution of mementos, and open networking wrap." }
        ],
        checklist: [
          { id: "cp1", task: `Secure formal booking contract for ${city} convention venue`, category: "Venue", priority: "High", done: false },
          { id: "cp2", task: "Dry-run keynote presentation decks across LED walls and audio links", category: "Tech", priority: "High", done: false },
          { id: "cp3", task: `Print and assemble ${guestNum} customized credential badges and welcome folders`, category: "Branding", priority: "High", done: false },
          { id: "cp4", task: "Finalize dietary preferences and executive banquet tasting with caterers", category: "Hospitality", priority: "Medium", done: false },
          { id: "cp5", task: "Verify backup gigabit cellular router and wireless microphone battery bays", category: "Tech", priority: "Low", done: false }
        ]
      };
    }

    if (detected === 'Birthday & Social') {
      return {
        concept: {
          themeTitle: `${title || 'Private Soirée'} • Luminous Night`,
          summary: `An intimate, stylish celebration in ${city} for ${guestNum} close guests featuring ambient neon styling, interactive photo backdrops, and live musical entertainment.`,
          highlights: [
            "Illuminated neon entryway paired with personalized artisanal arrival cocktails",
            "Multi-tier custom centerpiece cake reveal with synchronized spotlight transition",
            "Gourmet live small-plate stations, open dessert bar, and energetic DJ dancefloor"
          ]
        },
        budget: [
          { category: "Terrace Lounge / Private Club", allocated: Math.round(budgetNum * 0.35), percentage: 35, note: "Exclusive venue floor lease, ambient lighting rig, and private bar infrastructure." },
          { category: "Curated Small Plates & Beverage Bar", allocated: Math.round(budgetNum * 0.35), percentage: 35, note: "Hors d'oeuvres circulation, bespoke cake craft, and multi-course feast." },
          { category: "Bespoke Decor & Neon Artistry", allocated: Math.round(budgetNum * 0.18), percentage: 18, note: "Sculpted balloon installations, customized neon signage, and photo corners." },
          { category: "Sound, DJ & Event Photography", allocated: Math.round(budgetNum * 0.08), percentage: 8, note: "Professional club DJ, ambient mood uplighting, and candid portrait photographer." },
          { category: "Surprise Gifts & Buffer Reserve", allocated: Math.round(budgetNum * 0.04), percentage: 4, note: "Bespoke guest party favors and last-minute guest hospitality buffer." }
        ],
        timeline: [
          { time: "06:00 PM", title: "Setup Quality Inspection & Soundcheck", desc: "Illuminating neon installations, inspecting table arrangements, and sound testing." },
          { time: "07:30 PM", title: "Guest Arrival & Welcome Cocktails", desc: "Serving signature welcome drinks, opening photo booths, and circulating appetizers." },
          { time: "08:45 PM", title: "Centerpiece Cake Ceremony & Tribute", desc: "Screening celebration video montage followed by the focal cake ceremony." },
          { time: "09:30 PM", title: "Gourmet Banquet Open", desc: "Opening live culinary stations, artisanal woodfired spread, and dessert tables." },
          { time: "11:00 PM", title: "Open Dancefloor & Token Distribution", desc: "High-tempo curated musical set, celebratory dancing, and party favor distribution." }
        ],
        checklist: [
          { id: "bd1", task: `Confirm reservation and advance deposit for ${city} terrace venue`, category: "Venue", priority: "High", done: false },
          { id: "bd2", task: "Approve custom multi-tier theme cake blueprint and delivery schedule", category: "Culinary", priority: "High", done: false },
          { id: "bd3", task: "Coordinate essential evening tracklist and transition cues with DJ", category: "Music", priority: "Medium", done: false },
          { id: "bd4", task: `Send out calendar save-the-dates and track confirmations for ${guestNum} guests`, category: "Guests", priority: "High", done: false },
          { id: "bd5", task: "Prepare instant polaroid guestbook and custom celebration prop kits", category: "Media", priority: "Low", done: false }
        ]
      };
    }

    return {
      concept: {
        themeTitle: `${city} Heritage • ${title || 'Grand Celebration'}`,
        summary: `A grand celebration in ${city} for ${guestNum} esteemed guests, blending timeless hospitality, traditional aesthetics, and immersive culinary spreads.`,
        highlights: [
          `Traditional grand ceremonial welcome for ${guestNum} guests with bespoke refreshments`,
          `Multi-cuisine royal feast featuring interactive live artisanal culinary pavilions`,
          `Grand stage floral architecture, warm ambient fairylight canopies, and cinematic drone media`
        ]
      },
      budget: [
        { category: "Royal Courtyards & Lawns", allocated: Math.round(budgetNum * 0.40), percentage: 40, note: "Heritage estate lease, stage foundations, VIP lounges, and silent power generators." },
        { category: "Artisanal Feast & Traditional Banquets", allocated: Math.round(budgetNum * 0.30), percentage: 30, note: "Arrival refreshments, multi-course banquet pavilions, and signature sweets." },
        { category: "Floral Architecture & Illumination", allocated: Math.round(budgetNum * 0.18), percentage: 18, note: "Fresh flower entry portals, fairytale canopies, and ceremonial stage backdrops." },
        { category: "Cinematic Media & Classical Ensembles", allocated: Math.round(budgetNum * 0.08), percentage: 8, note: "Dual candid photographers, 4K cinematic drone video, and live acoustic music." },
        { category: "Contingency & Customary Cushion", allocated: Math.round(budgetNum * 0.04), percentage: 4, note: "Additional plate guarantees and ceremonial contingency budget." }
      ],
      timeline: [
        { time: "04:30 PM", title: "Vendor Setup & Staging Final Inspection", desc: "Inspecting floral backdrops, tuning ambient lighting rigs, and kitchen check." },
        { time: "06:30 PM", title: "Grand Arrival & Traditional Welcome", desc: "Rose petal ceremonial entry, scented cool towels, and signature mocktails." },
        { time: "08:00 PM", title: "Main Ceremonial Program", desc: "Grand entry processional, ceremonial customs, and stage portraits." },
        { time: "09:15 PM", title: "Royal Banquet Pavilions Open", desc: "Opening live culinary stations and initiating formal dinner seating." },
        { time: "11:30 PM", title: "Concluding Rites & Traditional Favors", desc: "Distribution of sweet gift boxes, fond farewells, and logistical wrap-up." }
      ],
      checklist: [
        { id: "wd1", task: `Execute banquet lawn and heritage suite contract in ${city}`, category: "Venue", priority: "High", done: false },
        { id: "wd2", task: `Sign off catering menu and live counter portfolio for ${guestNum} attendees`, category: "Catering", priority: "High", done: false },
        { id: "wd3", task: "Review cinematic shot list, drone permits, and lighting rigs with media team", category: "Media", priority: "Medium", done: false },
        { id: "wd4", task: "Complete dispatch of digital and physical invitations across guest roster", category: "Invitations", priority: "High", done: false },
        { id: "wd5", task: "Secure municipal sound permits and finalize classical ensemble playlist", category: "Music", priority: "Low", done: false }
      ]
    };
  };

  const handleDownloadPDF = async () => {
    if (pdfDownloading) return;
    setPdfDownloading(true);

    const safeTitle = eventData.title.trim() || 'Executive Event Masterplan';
    const totalBudgetFormatted = `${eventData.currency}${Number(eventData.budget || 0).toLocaleString()}`;
    const perGuestFormatted = `${eventData.currency}${perGuestWorkspace.toLocaleString()}`;

    const printContainer = document.createElement('div');
    printContainer.id = 'eventora-render-target';
    printContainer.style.position = 'fixed';
    printContainer.style.top = '0';
    printContainer.style.left = '0';
    printContainer.style.width = '794px';
    printContainer.style.backgroundColor = '#ffffff';
    printContainer.style.color = '#0f172a';
    printContainer.style.padding = '36px 40px';
    printContainer.style.zIndex = '999999';
    printContainer.style.fontFamily = 'Arial, Helvetica, sans-serif';
    printContainer.style.boxSizing = 'border-box';
    printContainer.style.visibility = 'visible';

    printContainer.innerHTML = `
      <div style="border-bottom: 2px solid #b45309; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px;">EVENTORA STUDIO</div>
          <div style="font-size: 11px; font-weight: bold; color: #b45309; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px;">Comprehensive Event Architecture Blueprint</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 17px; font-weight: bold; color: #0f172a;">${safeTitle}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 3px;">${eventData.location || 'Location Not Specified'} • ${eventData.guestCount || 0} Guests</div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: separate; border-spacing: 8px 0; margin-bottom: 20px;">
        <tr>
          <td style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 12px; border-radius: 6px; width: 25%;">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold;">Total Budget</div>
            <div style="font-size: 16px; font-weight: 800; color: #b45309; margin-top: 2px;">${totalBudgetFormatted}</div>
          </td>
          <td style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 12px; border-radius: 6px; width: 25%;">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold;">Per Guest Cost</div>
            <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 2px;">${perGuestFormatted}</div>
          </td>
          <td style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 12px; border-radius: 6px; width: 25%;">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold;">Schedule Timeline</div>
            <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 2px;">${plan.timeline.length} Milestones</div>
          </td>
          <td style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 12px; border-radius: 6px; width: 25%;">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold;">Action Items</div>
            <div style="font-size: 16px; font-weight: 800; color: #059669; margin-top: 2px;">${plan.checklist.length} Tracked</div>
          </td>
        </tr>
      </table>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">1. Event Concept & Overview</div>
        <div style="font-size: 15px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">${plan.concept.themeTitle}</div>
        <div style="font-size: 11px; color: #475569; line-height: 1.5; margin-bottom: 8px;">${plan.concept.summary}</div>
        <div style="font-size: 11px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">Key Strategic Pillars:</div>
        <ul style="margin: 0; padding-left: 18px; font-size: 11px; color: #334155; line-height: 1.5;">
          ${plan.concept.highlights.map(h => `<li style="margin-bottom: 2px;">${h}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">2. Complete Budget Allocation</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
          <thead>
            <tr style="background: #0f172a; color: #ffffff;">
              <th style="padding: 7px 10px; border: 1px solid #0f172a;">Category</th>
              <th style="padding: 7px 10px; border: 1px solid #0f172a;">Scope & Deliverables</th>
              <th style="padding: 7px 10px; text-align: right; border: 1px solid #0f172a;">Amount</th>
              <th style="padding: 7px 10px; text-align: right; border: 1px solid #0f172a;">Share</th>
            </tr>
          </thead>
          <tbody>
            ${plan.budget.length > 0 ? plan.budget.map((b, i) => `
              <tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 7px 10px; font-weight: bold; color: #0f172a; border: 1px solid #e2e8f0;">${b.category}</td>
                <td style="padding: 7px 10px; color: #64748b; border: 1px solid #e2e8f0;">${b.note}</td>
                <td style="padding: 7px 10px; text-align: right; font-weight: bold; color: #0f172a; border: 1px solid #e2e8f0;">${eventData.currency}${b.allocated.toLocaleString()}</td>
                <td style="padding: 7px 10px; text-align: right; color: #b45309; font-weight: bold; border: 1px solid #e2e8f0;">${b.percentage}%</td>
              </tr>
            `).join('') : `<tr><td colspan="4" style="padding: 12px; text-align: center; color: #64748b;">Budget allocations will appear here upon generating a plan.</td></tr>`}
          </tbody>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">3. Master Schedule & Timeline</div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${plan.timeline.length > 0 ? plan.timeline.map(slot => `
            <div style="display: flex; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 5px;">
              <div style="font-weight: 800; color: #b45309; min-width: 80px; font-size: 11px;">${slot.time}</div>
              <div>
                <div style="font-size: 12px; font-weight: bold; color: #0f172a;">${slot.title}</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 1px;">${slot.desc}</div>
              </div>
            </div>
          `).join('') : `<div style="padding: 12px; text-align: center; color: #64748b;">Schedule milestones will appear here upon generating a plan.</div>`}
        </div>
      </div>

      <div style="margin-bottom: 14px;">
        <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">4. Action Checklist & Responsibilities</div>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          ${plan.checklist.length > 0 ? plan.checklist.map(item => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; padding: 7px 12px; border-radius: 5px;">
              <div style="font-size: 11px; color: #0f172a;">
                <span style="font-weight: bold; color: ${item.done ? '#059669' : '#64748b'}; margin-right: 6px;">[${item.done ? 'COMPLETED' : 'PENDING'}]</span>
                ${item.task}
              </div>
              <span style="font-size: 9px; text-transform: uppercase; padding: 2px 6px; border-radius: 3px; background: #e2e8f0; color: ${item.priority === 'High' ? '#dc2626' : '#b45309'}; font-weight: bold;">
                ${item.priority} Priority
              </span>
            </div>
          `).join('') : `<div style="padding: 12px; text-align: center; color: #64748b;">Action tasks will appear here upon generating a plan.</div>`}
        </div>
      </div>

      <div style="margin-top: 18px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 9px; color: #94a3b8;">
        Official Event Architecture Report • Eventora Studio
      </div>
    `;

    document.body.appendChild(printContainer);

    await new Promise((resolve) => setTimeout(resolve, 350));

    try {
      const canvas = await html2canvas(printContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        scrollY: 0,
        scrollX: 0
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Eventora_${safeTitle.replace(/\s+/g, '_')}_Masterplan.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      if (printContainer && printContainer.parentNode) {
        printContainer.parentNode.removeChild(printContainer);
      }
      setPdfDownloading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);

    const safeTitle = eventData.title.trim() || "My Special Event";
    const safeLocation = eventData.location.trim() || "New Delhi, India";
    const safeGuests = Number(eventData.guestCount) || 100;
    const safeBudget = Number(eventData.budget) || 500000;

    if (!ai) {
      setTimeout(() => {
        setPlan(generateTailoredPlan(safeTitle, safeLocation, safeGuests, safeBudget, eventData.currency));
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const detectedType = detectEventType(safeTitle);
      const prompt = `You are an elite event planner and architectural director. Formulate a fully bespoke, realistic, and highly practical event masterplan for the following specifications:
Event Title: "${safeTitle}"
Event Category: "${detectedType}"
Location: ${safeLocation}
Guest Attendance: ${safeGuests}
Total Budget: ${eventData.currency}${safeBudget}

STRICT INSTRUCTIONS:
- If this is a Corporate event, summit, conference, hackathon, or seminar: Provide keynote timelines, AV acoustics, delegate badges, coffee breaks, and networking banquets. DO NOT include weddings or birthday rituals.
- If this is a Birthday or social party: Focus on cake cutting, music entertainment, balloon architecture, and casual food spreads.
- If this is a Wedding: Focus on traditional ceremonies, heritage hospitality, formal banquets, and floral stages.
- Return 5 realistic, distinctive timeline steps matching the event format.
- Return 5 actionable, distinctive checklist tasks matching the event format.
- Language MUST be pure, professional, articulate English.
- Budget percentage MUST add up to 100%.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              concept: {
                type: Type.OBJECT,
                properties: {
                  themeTitle: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["themeTitle", "summary", "highlights"]
              },
              budget: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    allocated: { type: Type.NUMBER },
                    percentage: { type: Type.NUMBER },
                    note: { type: Type.STRING }
                  },
                  required: ["category", "allocated", "percentage", "note"]
                }
              },
              timeline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    title: { type: Type.STRING },
                    desc: { type: Type.STRING }
                  },
                  required: ["time", "title", "desc"]
                }
              },
              checklist: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    task: { type: Type.STRING },
                    category: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    done: { type: Type.BOOLEAN }
                  },
                  required: ["id", "task", "category", "priority", "done"]
                }
              }
            },
            required: ["concept", "budget", "timeline", "checklist"]
          }
        }
      });

      const parsed = JSON.parse(response.text);
      if (parsed.concept && parsed.budget && parsed.timeline?.length && parsed.checklist?.length) {
        setPlan(parsed);
      } else {
        setPlan(generateTailoredPlan(safeTitle, safeLocation, safeGuests, safeBudget, eventData.currency));
      }
    } catch (err) {
      console.warn("AI generation fallback activated:", err);
      setPlan(generateTailoredPlan(safeTitle, safeLocation, safeGuests, safeBudget, eventData.currency));
    } finally {
      setLoading(false);
    }
  };

  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatLoading(true);

    const isEventRelated = /budget|cost|expense|guest|people|attendee|venue|food|catering|birthday|wedding|party|decor|stage|timeline|invitation|photographer|cake|dj|hall|plate|summit|conference|corporate/i.test(userText);

    if (!isEventRelated) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            text: 'I specialize strictly in event planning, financial allocations, catering, and operational timelines. Please ask questions related to your event arrangements.' 
          }
        ]);
        setChatLoading(false);
      }, 400);
      return;
    }

    try {
      if (apiKey) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: userText }] }],
              systemInstruction: {
                parts: [{
                  text: "You are Eventora's professional AI Event Planning Concierge. Deliver structured, practical cost projections and operational advice in fluent, professional English. Format answers concisely with 3-4 bullet points using Indian Rupees (₹)."
                }]
              }
            })
          }
        );

        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          setMessages(prev => [...prev, { role: 'assistant', text: data.candidates[0].content.parts[0].text }]);
          setChatLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Direct chat fetch error:", err);
    }

    setTimeout(() => {
      let smartAnswer = "Estimated Event Benchmarks:\n\n";
      if (/300/i.test(userText) || /birthday/i.test(userText)) {
        smartAnswer += "• Venue & Hospitality: ₹45,000 – ₹75,000 (Private Terrace or Banquet Lounge)\n• Catering & Banquet (300 Guests): ₹1,80,000 – ₹2,40,000 (₹600–800/plate)\n• Audio, Cake & Photography: ₹30,000 – ₹50,000\n• Projected Total: Approximately ₹2.8 Lakh to ₹3.6 Lakh for an elevated experience.";
      } else {
        smartAnswer += "• Per-Person Benchmark: ₹750 – ₹1,200 (Catering + Standard Venue Facilities)\n• Decor & Lighting Share: Allocate 15% to 20% of your primary budget\n• Operational Timing: Schedule caterers and AV technicians to arrive 2 hours prior to doors opening.";
      }
      setMessages(prev => [...prev, { role: 'assistant', text: smartAnswer }]);
      setChatLoading(false);
    }, 600);
  };

  const loadPreset = (preset) => {
    setEventData(preset);
    setPlan(generateTailoredPlan(preset.title, preset.location, preset.guestCount, preset.budget, preset.currency));
    setPage('workspace');
  };

  const toggleTask = (id) => {
    setPlan(prev => ({
      ...prev,
      checklist: prev.checklist.map(t => t.id === id ? { ...t, done: !t.done } : t)
    }));
  };

  const perGuestSandbox = (simGuests > 0 && simBudget > 0) ? Math.round(simBudget / simGuests) : 0;
  const perGuestWorkspace = (Number(eventData.budget) > 0 && Number(eventData.guestCount) > 0) 
    ? Math.round(Number(eventData.budget) / Number(eventData.guestCount)) 
    : 0;

  const presets = [
    { 
      tag: "FLAGSHIP WEDDING",
      title: "The Jagmandir Palace Imperial Wedding", 
      type: "Wedding & Traditional", 
      location: "Udaipur, India", 
      guestCount: 220, 
      budget: 1500000, 
      currency: "₹", 
      vibe: "Candlelit courtyards, live sitar flute music, royal culinary feast." 
    },
    { 
      tag: "KEYNOTE & GALA",
      title: "Global AI & Founders Summit 2026", 
      type: "Corporate & Tech", 
      location: "Bengaluru, India", 
      guestCount: 450, 
      budget: 800000, 
      currency: "₹", 
      vibe: "Clean stage layout, high quality audio-video setup, high tea catering." 
    },
    { 
      tag: "PRIVATE SOIRÉE",
      title: "Sunset Terrace 30th Silver Birthday", 
      type: "Birthday & Social", 
      location: "Mumbai, India", 
      guestCount: 65, 
      budget: 200000, 
      currency: "₹", 
      vibe: "Rooftop view, fairy lights, live acoustic music, snack bar." 
    }
  ];

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden selection:bg-amber-400 selection:text-black flex flex-col justify-between">
      
      {/* ── 1. BACKGROUND MOTION SYSTEM ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#070913]">
        <div 
          className="absolute -top-36 left-1/2 w-[1100px] h-[550px] rounded-full pointer-events-none"
          style={{
            transform: `translate(calc(-50% + ${coords.champX}px), ${coords.champY}px) scale(${coords.champScale})`,
            opacity: coords.champOpacity,
            background: 'radial-gradient(ellipse at center, rgba(217, 180, 74, 0.45) 0%, rgba(180, 83, 9, 0.16) 50%, transparent 75%)',
            filter: 'blur(65px)',
            willChange: 'transform, opacity'
          }}
        />

        <div 
          className="absolute top-1/4 -left-28 w-[720px] h-[720px] rounded-full pointer-events-none"
          style={{
            transform: `translate(${coords.indigoX}px, ${coords.indigoY}px)`,
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(30, 27, 75, 0.16) 50%, transparent 70%)',
            filter: 'blur(75px)',
            willChange: 'transform'
          }}
        />

        <div 
          className="absolute top-1/2 -right-28 w-[680px] h-[680px] rounded-full pointer-events-none"
          style={{
            transform: `translate(${coords.amberX}px, ${coords.amberY}px)`,
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(67, 56, 202, 0.12) 50%, transparent 70%)',
            filter: 'blur(75px)',
            willChange: 'transform'
          }}
        />

        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* ── 2. FOREGROUND CONTENT WRAPPER ── */}
      <div className="relative z-10 w-full flex-1 flex flex-col">
        
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 border-b border-white/[0.08] backdrop-blur-2xl bg-[#070913]/90">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <button 
              onClick={() => setPage('home')} 
              className="cursor-pointer group flex items-center transition-transform duration-300 hover:scale-[1.03]"
            >
              <img 
                src="/logo.png" 
                alt="Eventora Event Planner" 
                className="h-9 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(217,180,74,0.35)]"
              />
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              {page === 'home' ? (
                <button
                  onClick={() => setPage('workspace')}
                  className="relative overflow-hidden text-xs font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.25)] flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 text-slate-950 group cursor-pointer"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <span className="relative z-10 font-bold">Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              ) : (
                <button
                  onClick={() => setPage('home')}
                  className="text-xs font-medium text-slate-400 hover:text-white transition flex items-center gap-1.5 py-1.5 px-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return Home
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── EXHIBITION HOME PAGE ── */}
        {page === 'home' && (
          <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-10 sm:pt-20 pb-20 space-y-16 sm:space-y-24">
            
            {/* Hero Header */}
            <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-amber-400/25 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase backdrop-blur-xl bg-amber-400/5 text-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Zero Event Stress • Pure Memories</span>
              </div>

              <h1 
                className="text-3xl sm:text-6xl md:text-7xl tracking-[-0.01em] leading-[1.15] text-white font-medium"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Because your milestone <br />
                <span 
                  className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  was never made for stress.
                </span>
              </h1>

              <p 
                className="text-xs sm:text-base text-slate-300/85 max-w-xl mx-auto leading-relaxed font-normal px-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                From visionary weddings to corporate galas—effortlessly balance budgets, timelines, and operational checklists so you can truly experience every moment.
              </p>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setPage('workspace')}
                  className="relative overflow-hidden px-7 sm:px-9 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.04] active:scale-95 shadow-[0_0_25px_rgba(251,191,36,0.3)] flex items-center gap-2.5 sm:gap-3 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 text-slate-950 group cursor-pointer"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <span className="relative z-10">Architect Your Event</span>
                  <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Interactive Live Allocation Engine */}
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-8 space-y-6 shadow-2xl backdrop-blur-2xl bg-[#090d18]/80 overflow-hidden">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300/90 font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Budget & Guest Calibration Sandbox
                  </span>
                  <h3 className="text-base sm:text-xl font-medium text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Simulate expenditures and attendee allocations
                  </h3>
                </div>

                <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <div className="inline-flex items-center p-1 rounded-xl sm:rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md min-w-full sm:min-w-0">
                    {[
                      { id: 'Wedding', label: 'Wedding' },
                      { id: 'Community', label: 'Corporate' },
                      { id: 'Birthday', label: 'Social Party' }
                    ].map((tab) => {
                      const isActive = simType === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setSimType(tab.id)}
                          className={`flex-1 sm:flex-none relative z-10 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer ${
                            isActive ? 'text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                          }`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {isActive && (
                            <span 
                              className="absolute inset-0 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 rounded-lg sm:rounded-xl -z-10 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                            />
                          )}
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main Calculator Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Controls Column */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                  
                  {/* Guest Count Card */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-black/30 space-y-3">
                    <div className="flex justify-between items-center text-xs gap-2">
                      <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] sm:text-[11px]">
                        Attendance (Guests)
                      </span>
                      
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 focus-within:border-amber-300">
                        <input
                          type="number"
                          min="0"
                          value={simGuests === 0 ? '' : simGuests}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                            setSimGuests(val);
                          }}
                          placeholder="0"
                          className="w-14 sm:w-20 bg-transparent font-mono text-xs sm:text-base font-bold text-white focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-[10px] sm:text-xs text-amber-300 font-normal">Guests</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max={Math.max(simGuests, 600)}
                      step="5"
                      value={simGuests}
                      onChange={(e) => setSimGuests(Number(e.target.value))}
                      className="w-full luxury-slider cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>0</span>
                      <span>300</span>
                      <span>600 (Custom)</span>
                    </div>
                  </div>

                  {/* Target Budget Card */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-black/30 space-y-3">
                    <div className="flex justify-between items-center text-xs gap-2">
                      <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] sm:text-[11px]">
                        Target Budget
                      </span>
                      
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg sm:rounded-xl bg-amber-400/10 border border-amber-400/30 focus-within:border-amber-300">
                        <span className="text-amber-300 font-mono font-bold text-xs sm:text-sm">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={simBudget === 0 ? '' : simBudget}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                            setSimBudget(val);
                          }}
                          placeholder="0"
                          className="w-20 sm:w-28 bg-transparent font-mono text-xs sm:text-base font-bold text-amber-300 focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max={SLIDER_MAX_BUDGET}
                      step="25000"
                      value={Math.min(simBudget, SLIDER_MAX_BUDGET)}
                      onChange={(e) => setSimBudget(Number(e.target.value))}
                      className="w-full luxury-slider cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>₹0</span>
                      <span className="text-slate-400">Drag or type</span>
                      <span>₹25L+</span>
                    </div>
                  </div>

                  {/* Cost Per Head Card */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-300/20 bg-gradient-to-r from-amber-400/5 to-transparent flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-mono text-amber-200/80 block uppercase tracking-widest">Cost / Attendee</span>
                      <div className="text-lg sm:text-2xl font-mono font-bold text-white mt-0.5">
                        ₹{perGuestSandbox.toLocaleString()} 
                        <span className="text-[10px] sm:text-xs font-normal text-slate-400 ml-1 font-sans">/ person</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newType = simType === 'Community' ? 'Corporate & Tech' : simType === 'Birthday' ? 'Birthday & Social' : 'Wedding & Traditional';
                        const defaultTitle = `${simType} Grand Showcase`;
                        setEventData({
                          title: defaultTitle,
                          type: newType,
                          location: "New Delhi, India",
                          guestCount: simGuests || 100,
                          budget: simBudget || 500000,
                          currency: "₹",
                          vibe: ""
                        });
                        setPlan(generateTailoredPlan(defaultTitle, "New Delhi, India", simGuests || 100, simBudget || 500000, "₹"));
                        setPage('workspace');
                      }}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-amber-300/30 bg-amber-400/15 text-amber-200 hover:bg-amber-400/25 active:scale-95 shrink-0 cursor-pointer"
                    >
                      <span>Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Interactive Chart */}
                <div className="lg:col-span-7 p-4 sm:p-7 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold flex items-center justify-between pb-3.5 border-b border-white/[0.08] gap-2">
                      <span className="flex items-center gap-1.5 sm:gap-2 text-slate-300 font-medium">
                        <Layers className="w-4 h-4 text-amber-300 shrink-0" /> Allocation Breakdown
                      </span>
                      <span className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md border shrink-0 ${
                        simBudget > 0 
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                          : 'text-slate-500 bg-white/5 border-white/10'
                      }`}>
                        {simBudget > 0 ? "Live Scaled" : "Awaiting Input"}
                      </span>
                    </div>

                    <div className="space-y-4 sm:space-y-6 pt-4">
                      {(() => {
                        const distributionMap = {
                          Wedding: [
                            { name: "Venue Lease & Heritage Suites", pct: 40 },
                            { name: "Artisanal Dining & Banquets", pct: 30 },
                            { name: "Floral Decor & Scenic Lighting", pct: 18 },
                            { name: "Cinematic Media & Production", pct: 12 }
                          ],
                          Community: [
                            { name: "Auditorium & Stage Engineering", pct: 45 },
                            { name: "Acoustic AV & Digital Streaming", pct: 25 },
                            { name: "Executive Catering & High-Tea", pct: 20 },
                            { name: "Delegate Kits & Operations", pct: 10 }
                          ],
                          Birthday: [
                            { name: "Private Terrace / Lounge Lease", pct: 35 },
                            { name: "Specialty Small Plates & Open Bar", pct: 35 },
                            { name: "Ambient Lighting & Theme Decor", pct: 20 },
                            { name: "DJ, Sound System & Photography", pct: 10 }
                          ]
                        };

                        const activeList = distributionMap[simType] || distributionMap.Wedding;
                        const budgetRatio = Math.min(1, simBudget / SLIDER_MAX_BUDGET);

                        return activeList.map((row, i) => {
                          const amount = Math.round((simBudget * row.pct) / 100);
                          let dynamicFillWidth = 0;
                          if (simBudget > 0) {
                            dynamicFillWidth = Math.min(100, Math.max(5, Math.round(budgetRatio * 100)));
                          }

                          return (
                            <div key={i} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs gap-2">
                                <span className="text-slate-300 font-medium text-[11px] sm:text-xs truncate">{row.name}</span>
                                <span className="font-mono text-xs font-semibold text-white shrink-0">
                                  {simBudget > 0 ? (
                                    <>
                                      ₹{amount.toLocaleString()}{' '}
                                      <span className="text-amber-300/80 text-[10px] font-normal">({row.pct}%)</span>
                                    </>
                                  ) : (
                                    <span className="text-slate-500 font-mono text-[10px]">₹0 (0%)</span>
                                  )}
                                </span>
                              </div>
                              
                              <div className="w-full bg-slate-900/90 rounded-full h-2 sm:h-2.5 overflow-hidden border border-white/[0.04] p-[1px]">
                                <div 
                                  className="h-full w-full rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 luxury-progress-fill"
                                  style={{ 
                                    transform: `scaleX(${dynamicFillWidth / 100})`
                                  }}
                                />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-white/[0.06]">
                    {simBudget === 0 ? (
                      <p className="text-[10px] sm:text-[11px] text-center text-slate-500 font-mono">
                        ↑ Input target budget above to simulate allocations
                      </p>
                    ) : (
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400">
                        <span>Benchmark (40/30/18/12)</span>
                        <button 
                          onClick={() => {
                            const newType = simType === 'Community' ? 'Corporate & Tech' : simType === 'Birthday' ? 'Birthday & Social' : 'Wedding & Traditional';
                            const defaultTitle = `${simType} Grand Showcase`;
                            setEventData({
                              title: defaultTitle,
                              type: newType,
                              location: "New Delhi, India",
                              guestCount: simGuests || 100,
                              budget: simBudget || 500000,
                              currency: "₹",
                              vibe: ""
                            });
                            setPlan(generateTailoredPlan(defaultTitle, "New Delhi, India", simGuests || 100, simBudget || 500000, "₹"));
                            setActiveTab('budget');
                            setPage('workspace');
                          }}
                          className="text-amber-300 hover:underline flex items-center gap-1 font-sans cursor-pointer"
                        >
                          Customize →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Curated Presets Deck */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300/90">Curated Blueprints</span>
                  <h3 className="text-sm sm:text-base font-semibold mt-0.5 text-white">Verified celebration archetypes</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">3 Portfolios</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {presets.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => loadPreset(p)}
                    className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0a0d18]/50 backdrop-blur-xl transition-all duration-200 cursor-pointer space-y-2.5 group hover:border-amber-300/30 shadow-md"
                  >
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 font-semibold text-amber-200">
                        {p.tag}
                      </span>
                      <span className="font-semibold text-white">₹{(p.budget / 100000).toFixed(1)}L</span>
                    </div>
                    <h4 className="font-semibold text-sm group-hover:text-amber-200 transition text-white">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-light line-clamp-2 leading-relaxed">
                      {p.vibe}
                    </p>
                    <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{p.guestCount} Guests</span>
                      <span className="flex items-center gap-1 text-amber-300 font-sans font-medium">
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>
        )}

        {/* ── WORKSPACE STUDIO (CLEAN INPUT & TAB PEEK SCROLL) ── */}
        {page === 'workspace' && (
          <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
            
            {/* Top Workspace Header */}
            <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#090d18]/85 backdrop-blur-2xl space-y-4 sm:space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-amber-300/80 font-medium block mb-1">
                    Event Title
                  </span>
                  <input
                    type="text"
                    value={eventData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const detected = detectEventType(newTitle);
                      setEventData(prev => ({ ...prev, title: newTitle, type: detected }));
                    }}
                    placeholder="e.g., Global AI Founders Summit 2026"
                    className="w-full text-lg sm:text-2xl font-bold bg-transparent border-b border-white/10 hover:border-slate-500 focus:border-amber-300 focus:outline-none transition text-white pb-1 placeholder:text-slate-600"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  />
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={pdfDownloading}
                    className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold hover:bg-white/10 transition flex items-center justify-center gap-1.5 text-white cursor-pointer disabled:opacity-50"
                  >
                    <Download className={`w-3.5 h-3.5 text-slate-300 ${pdfDownloading ? 'animate-bounce' : ''}`} />
                    <span>{pdfDownloading ? "Generating..." : "Export PDF"}</span>
                  </button>
                  <button 
                    onClick={handleGeneratePlan} 
                    disabled={loading} 
                    className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 text-slate-950 hover:brightness-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>{loading ? "Generating..." : "Generate Blueprint"}</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3 border-t border-white/[0.08]">
                <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 block mb-1 font-medium">Destination</span>
                  <input 
                    type="text" 
                    value={eventData.location} 
                    placeholder="e.g., Mumbai"
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })} 
                    className="w-full text-xs font-semibold bg-transparent focus:outline-none text-white placeholder:text-slate-600" 
                  />
                </div>
                
                <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 block mb-1 font-medium">Attendance</span>
                  <input 
                    type="number" 
                    value={eventData.guestCount === '' ? '' : eventData.guestCount} 
                    placeholder="e.g., 250"
                    onChange={(e) => setEventData({ ...eventData, guestCount: e.target.value === '' ? '' : Number(e.target.value) })} 
                    className="w-full text-xs font-semibold bg-transparent focus:outline-none text-white placeholder:text-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 block mb-1 font-medium">Total Budget</span>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-300 font-bold text-xs">{eventData.currency}</span>
                    <input 
                      type="number" 
                      value={eventData.budget === '' ? '' : eventData.budget} 
                      placeholder="e.g., 1000000"
                      onChange={(e) => setEventData({ ...eventData, budget: e.target.value === '' ? '' : Number(e.target.value) })} 
                      className="w-full text-xs font-semibold bg-transparent focus:outline-none text-white placeholder:text-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-200/80 block mb-1 font-medium">Cost / Attendee</span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {eventData.currency}{perGuestWorkspace.toLocaleString()} <span className="font-normal text-[9px] text-slate-400">/ person</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Screen Display Container */}
            <div className="space-y-5">
              
              {/* ── TABS: ACTIVE TAB VISIBLE + NEXT TAB PEEK PREVIEW ── */}
              <div 
                ref={tabsContainerRef}
                className="flex border-b border-white/10 gap-2.5 sm:gap-6 overflow-x-auto pb-1 scroll-smooth scrollbar-none"
              >
                {[
                  { id: 'overview', label: '1. Plan Summary', icon: Sparkles },
                  { id: 'budget', label: '2. Budget Allocation', icon: DollarSign },
                  { id: 'timeline', label: '3. Schedule & Timeline', icon: Clock },
                  { id: 'checklist', label: '4. Action Checklist', icon: CheckSquare }
                ].map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      ref={(el) => (tabButtonRefs.current[idx] = el)}
                      onClick={() => {
                        setActiveTab(tab.id);

                        // Current clicked tab ko left side offset ke sath scroll karein
                        // Isse active tab pura dikhega aur right side agle tab ka portion peek karega
                        const currentEl = tabButtonRefs.current[idx];
                        const container = tabsContainerRef.current;
                        
                        if (currentEl && container) {
                          const targetLeft = currentEl.offsetLeft - 16;
                          container.scrollTo({
                            left: Math.max(0, targetLeft),
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap -mb-px shrink-0 cursor-pointer ${
                        isActive
                          ? 'border-amber-300 text-amber-300 font-bold'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: SUMMARY */}
              {activeTab === 'overview' && (
                <div className="space-y-4 pt-1">
                  <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#090d18]/70 backdrop-blur-2xl space-y-2">
                    <span className="text-[10px] sm:text-[11px] font-mono text-amber-300 uppercase tracking-wider block">
                      Thematic Narrative
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {plan.concept.themeTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pt-1">
                      {plan.concept.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#090d18]/70 backdrop-blur-2xl space-y-2.5">
                      <span className="text-xs font-semibold text-slate-200 block pb-2 border-b border-white/[0.08]">
                        Strategic Event Pillars
                      </span>
                      <div className="space-y-2">
                        {plan.concept.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#090d18]/70 backdrop-blur-2xl space-y-2.5">
                      <span className="text-xs font-semibold text-slate-200 block pb-2 border-b border-white/[0.08]">
                        Architecture Status
                      </span>
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/40 border border-white/5">
                          <span className="text-[9px] sm:text-[10px] text-slate-400 block font-mono">TOTAL BUDGET</span>
                          <span className="text-xs sm:text-sm font-mono font-bold text-white mt-0.5 block">
                            {eventData.currency}{Number(eventData.budget || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/40 border border-white/5">
                          <span className="text-[9px] sm:text-[10px] text-slate-400 block font-mono">SCHEDULE</span>
                          <span className="text-xs sm:text-sm font-mono font-bold text-white mt-0.5 block">
                            {plan.timeline.length} Milestones
                          </span>
                        </div>
                        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/40 border border-white/5">
                          <span className="text-[9px] sm:text-[10px] text-slate-400 block font-mono">CHECKLIST</span>
                          <span className="text-xs sm:text-sm font-mono font-bold text-amber-300 mt-0.5 block">
                            {plan.checklist.filter(c => c.done).length} / {plan.checklist.length} Complete
                          </span>
                        </div>
                        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/40 border border-white/5">
                          <span className="text-[9px] sm:text-[10px] text-slate-400 block font-mono">STATUS</span>
                          <span className="text-xs sm:text-sm font-semibold text-emerald-400 mt-0.5 block truncate">
                            {plan.budget.length > 0 ? "Ready" : "Waiting"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BUDGET ALLOCATION */}
              {activeTab === 'budget' && (
                <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#090d18]/70 backdrop-blur-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-white">Itemized Budget Breakdown</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Estimated expenditures distributed across core operational verticals.</p>
                    </div>
                    <span className="self-start sm:self-auto text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-xl bg-amber-400/10 border border-amber-400/20">
                      Total: {eventData.currency}{Number(eventData.budget || 0).toLocaleString()}
                    </span>
                  </div>

                  {plan.budget.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 font-mono text-xs">
                      No budget breakdown generated yet. Provide event specifications above and click 'Generate Blueprint'.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {plan.budget.map((item, idx) => {
                        const currentAmt = Math.round((Number(eventData.budget || 0) * item.percentage) / 100);
                        return (
                          <div key={idx} className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h4 className="font-semibold text-xs sm:text-sm text-white">{item.category}</h4>
                                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed">{item.note}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs sm:text-base font-mono font-bold text-white block">
                                  {eventData.currency}{currentAmt.toLocaleString()}
                                </span>
                                <span className="text-[10px] sm:text-[11px] font-mono text-amber-300 font-medium">
                                  {item.percentage}%
                                </span>
                              </div>
                            </div>

                            <div className="w-full bg-slate-900 rounded-full h-1.5 sm:h-2 overflow-hidden border border-white/5">
                              <div 
                                className="bg-gradient-to-r from-amber-300 to-amber-500 h-full rounded-full" 
                                style={{ width: `${Math.min(100, item.percentage * 2)}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#090d18]/70 backdrop-blur-2xl space-y-4">
                  <div className="pb-3 border-b border-white/[0.08]">
                    <h3 className="font-bold text-sm sm:text-base text-white">Master Run-of-Show Timeline</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Chronological execution schedule and program transition timings.</p>
                  </div>

                  {plan.timeline.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 font-mono text-xs">
                      No schedule generated yet. Provide event specifications above and click 'Generate Blueprint'.
                    </div>
                  ) : (
                    <div className="relative border-l ml-3 sm:ml-4 space-y-4 sm:space-y-6 pt-2 border-amber-300/30">
                      {plan.timeline.map((slot, idx) => (
                        <div key={idx} className="ml-4 sm:ml-6 relative">
                          <span className="absolute -left-[23px] sm:-left-[31px] top-1.5 w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-amber-300 ring-4 ring-[#090d18]" />
                          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 bg-black/30 space-y-1">
                            <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-300 block">
                              ⏰ {slot.time}
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold text-white">{slot.title}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed font-light">{slot.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CHECKLIST */}
              {activeTab === 'checklist' && (
                <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#090d18]/70 backdrop-blur-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-white">Operational Action Checklist</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Track deliverables, contracts, and operational sign-offs.</p>
                    </div>
                    <span className="self-start sm:self-auto text-xs font-mono text-amber-300 px-2.5 py-1 rounded-xl bg-amber-400/10 border border-amber-400/20 font-bold">
                      {plan.checklist.filter(c => c.done).length} / {plan.checklist.length} Completed
                    </span>
                  </div>

                  {plan.checklist.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 font-mono text-xs">
                      No action items generated yet. Provide event specifications above and click 'Generate Blueprint'.
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      {plan.checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleTask(item.id)}
                          className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-xs cursor-pointer transition select-none gap-2 ${
                            item.done
                              ? 'opacity-40 bg-black/20 border-white/5 line-through'
                              : 'bg-black/40 border-white/10 hover:border-amber-300/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 text-slate-200 min-w-0">
                            <input 
                              type="checkbox" 
                              checked={item.done} 
                              onChange={() => {}} 
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded pointer-events-none accent-amber-400 shrink-0" 
                            />
                            <span className="font-medium text-xs sm:text-sm truncate">{item.task}</span>
                          </div>
                          <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md border font-mono uppercase shrink-0 ${
                            item.priority === 'High' 
                              ? 'text-rose-300 border-rose-500/30 bg-rose-500/10' 
                              : 'text-amber-200 border-amber-400/20 bg-amber-400/10'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </main>
        )}

      </div>

      {/* ── 3. FULL-WIDTH NATURAL FOOTER ── */}
      <footer className="w-full border-t border-white/10 bg-[#070913]/95 py-6 px-4 sm:px-8 mt-12 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-white font-bold tracking-wider font-sans text-sm">EVENTORA STUDIO</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] sm:text-xs text-amber-300/90 font-sans">Crafting memorable celebrations</span>
          </div>

          <div className="text-[11px] sm:text-xs text-slate-400 font-sans">
            Designed & developed with precision by{' '}
            <a 
              href="https://github.com/ArixenX" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-300 font-semibold hover:text-amber-200 underline underline-offset-4 decoration-amber-400/40 hover:decoration-amber-300 transition-all"
            >
              Aritra Mondal
            </a>
          </div>
        </div>
      </footer>

      {/* ── 4. FLOATING AI CONCIERGE ── */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {!isChatOpen ? (
          <div className="animate-gentle-float">
            <button
              onClick={() => setIsChatOpen(true)}
              className="relative group p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
              title="Event Concierge"
            >
              <span className="absolute -inset-1 rounded-full bg-amber-400/40 blur-sm animate-pulse" />
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
              <span className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#090d18]/95 border border-white/15 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none shadow-xl">
                Consult AI Event Concierge ✨
              </span>
            </button>
          </div>
        ) : (
          <div className="fixed inset-x-3 bottom-3 sm:static sm:inset-auto sm:w-[380px] h-[480px] max-h-[82vh] rounded-2xl sm:rounded-3xl border border-white/15 bg-[#090d18]/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
            
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">AI Event Concierge</h4>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs leading-relaxed">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 mt-0.5 text-amber-300">
                      <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-xl max-w-[85%] whitespace-pre-wrap break-words ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-amber-300 to-amber-400 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-black/60 border border-white/10 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] p-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                  <span>Analyzing parameters...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleChatSend} className="p-2.5 sm:p-3 border-t border-white/10 bg-black/50 flex items-end gap-2">
              <textarea
                rows="1"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSend(e);
                  }
                }}
                placeholder="Ask pricing, catering, timelines..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-300/60 resize-none"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="p-2 rounded-xl bg-amber-300 text-slate-950 font-bold hover:brightness-105 active:scale-95 disabled:opacity-40 transition shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        )}
      </div>

    </div>
  );
}