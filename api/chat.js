import { GoogleGenAI } from '@google/genai';

const AURA_SYSTEM_PROMPT = `
# Role & Identity
You are "Aura", the Senior AI Real Estate Assistant for Nitin Real Estate. Your goal is to guide visitors, qualify buyer/renter leads, answer property questions clearly, and schedule site visits.

# Strict Dynamic Language Rule
1. Detect the user's input language and respond in the EXACT same language and script:
   - Hinglish input (e.g., "Mujhe 2 BHK flat chahiye") -> Reply in Hinglish (e.g., "Nitin Real Estate me aapka swagat hai! Aapka preferred location aur budget kitna hai?").
   - Hindi input (e.g., "मुझे 3 BHK फ्लैट देखना है") -> Reply in clear Hindi (e.g., "नमस्ते! क्या आप हमें अपना पसंदीदा इलाका और बजट बता सकते हैं?").
   - English input (e.g., "Show me available villas") -> Reply in professional English.
2. Never force English if the client speaks Hindi/Hinglish.
3. Keep real estate terms simple (BHK, Budget, Carpet Area, Site Visit, Possession).

# Communication & Output Guidelines
- Fast & Concise: Keep answers under 2-3 sentences whenever possible. Use clean bullet points for property specs.
- Lead Qualification: Step-by-step gather (1) Buy/Rent intent, (2) Budget, (3) Preferred Area, (4) Contact Number/Name for site visit confirmation.
- Direct Answers: Do not give generic filler intros. Answer the user's core query immediately in the first sentence.
- Unknown Listings: If a specific property detail or listing data is not available, say: "Main ye detail hamare property consultant se check karke aapko call back karwa deta hu. Aapka phone number mil sakta hai?" (or matching language equivalent).

# Lead Capture Trigger
Whenever a user wants to book a site visit, view a flat, or get price sheets, ask for their preferred day/time and mobile number.
`;

const generateMultilingualFallback = (userText) => {
  const text = userText.toLowerCase();
  const isHindiScript = /[\u0900-\u097F]/.test(userText);
  const isHinglish = /mujhe|chahiye|batao|bechna|dekhna|kaise|hisaab|hai|mein|kya|dikhayein|sir|bhai|flats|kitne|under|lakh|crore|dekhni|book|karna|hoga|ke|par/.test(text);

  const isBooking = text.includes('book') || text.includes('tour') || text.includes('viewing') || text.includes('visit') || text.includes('dekhna') || text.includes('विजिट') || text.includes('बुक');
  const is3BHK = text.includes('3-bhk') || text.includes('3bhk') || text.includes('50 lakh') || text.includes('50l') || text.includes('50 लाख') || text.includes('flat');
  const isVilla = text.includes('villa') || text.includes('luxury') || text.includes('house') || text.includes('विला');
  const isSell = text.includes('sell') || text.includes('list') || text.includes('my property') || text.includes('bechna') || text.includes('बेचना') || text.includes('लिस्ट');
  const isLegal = text.includes('legal') || text.includes('tax') || text.includes('deed') || text.includes('document') || text.includes('कागजात');

  if (isHindiScript) {
    if (isBooking) return "मैं आपकी प्राइवेट प्रॉपर्टी विजिट बुक करने में मदद कर सकती हूँ! 📅\n\nकृपया अपना पसंदीदा **दिन/समय** और **फ़ोन नंबर** साझा करें, हमारे सीनियर एजेंट 15 मिनट में आपसे संपर्क करके अपॉइंटमेंट कंफर्म करेंगे।";
    if (is3BHK) return "आपके **₹50 लाख के बजट** में सबसे बेहतरीन **3-BHK फ्लैट्स** उपलब्ध हैं:\n\n• **सनराइज रेजीडेंसी (Ref #SR-302)** — **₹45.5 लाख** | 3 BHK | सेक्टर 62, नोएडा\n• **ग्रीन वैली हाइट्स (Ref #GV-108)** — **₹48.0 लाख** | 3 BHK | ग्रेटर नोएडा वेस्ट\n\nक्या आप साइट विजिट बुक करना चाहेंगे?";
    if (isVilla) return "यहाँ प्राइम सेक्टर्स में उपलब्ध **लक्जरी विला** लिस्टिंग हैं:\n\n• **इम्पीरियल गोल्फ एस्टेट** — **₹3.20 करोड़** | 5 BHK विला | सेक्टर 128, नोएडा\n• **रॉयल पाल्म्स विला** — **₹1.85 करोड़** | 4 BHK डुप्लेक्स\n\nक्या आप प्राइवेट साइट विजिट शेड्यूल करना चाहते हैं?";
    if (isSell) return "**नितिन रियल एस्टेट** पर अपनी संपत्ति लिस्ट करना बेहद आसान है! 🔑\n\nआप हमारे **Sell** पेज पर विवरण जमा कर सकते हैं या एजेंट कॉल बैक के लिए अपना फोन नंबर साझा कर सकते हैं।";
    if (isLegal) return "हमारे लाइसेंस प्राप्त प्रॉपर्टी वकील और सीनियर एजेंट आपके साथ सटीक टैक्स, रजिस्ट्री और डीड विवरण की समीक्षा कर सकते हैं।";
    return "मैं यह विवरण हमारे प्रॉपर्टी कंसल्टेंट से चेक करके आपको कॉल बैक करवा देती हूँ। क्या आपका फ़ोन नंबर मिल सकता है?";
  }

  if (isHinglish) {
    if (isBooking) return "Main aapki private viewing book karne me help kar sakti hu! 📅\n\nKripya apna preferred **Day/Time** aur **Phone Number** share karein, hamare senior agent 15 minute me confirm karenge.";
    if (is3BHK) return "Aapke budget **₹50 Lakhs ke under** ye top verified **3-BHK flats** available hain:\n\n• **Sunrise Residency (Ref #SR-302)** — **₹45.5 Lakhs** | 3 BHK | Sector 62, Noida\n• **Green Valley Heights (Ref #GV-108)** — **₹48.0 Lakhs** | 3 BHK | Greater Noida West\n\nKya aap inka site visit book karna chahenge?";
    if (isVilla) return "Ye rahe top prime locations ke **Luxury Villa listings**:\n\n• **Imperial Golf Estate** — **₹3.20 Cr** | 5 BHK Villa | Sector 128, Noida\n• **Royal Palms Villa** — **₹1.85 Cr** | 4 BHK Duplex\n\nKya aap private walkthrough tour schedule karna chahenge?";
    if (isSell) return "**Nitin Real Estate** par apna property list karna bahut aasan hai! 🔑\n\nAap hamare **Sell** page par details submit kar sakte hain ya apna number share karein agent callback ke liye.";
    if (isLegal) return "Main standard market estimates bata sakti hu, lekin exact tax aur registry documents hamare senior agents aapke saath review karenge.";
    return "Main ye detail hamare property consultant se check karke aapko call back karwa deta hu. Aapka phone number mil sakta hai?";
  }

  if (isBooking) return "I would be happy to schedule a private viewing for you! 📅\n\nPlease let me know your preferred **Day/Time** and **Phone Number**, and our senior agent will confirm your appointment within 15 minutes.";
  if (is3BHK) return "Here are top verified **3-BHK flats under ₹50 Lakhs** available right now:\n\n• **Sunrise Residency** — **₹45.5 Lakhs** | 3 BHK | Sector 62, Noida\n• **Green Valley Heights** — **₹48.0 Lakhs** | 3 BHK | Greater Noida West\n\nWould you like to book an on-site visit?";
  if (isVilla) return "Here are featured **Luxury Villa listings** in top prime sectors:\n\n• **Imperial Golf Estate** — **₹3.20 Cr** | 5 BHK Villa | Sector 128, Noida\n• **Royal Palms Villa** — **₹1.85 Cr** | 4 BHK Duplex\n\nWould you like to schedule a private walkthrough tour?";
  if (isSell) return "Listing your property with **Nitin Real Estate** is fast & easy! 🔑\n\nYou can submit your property details directly on our **Sell** page or leave your phone number for an immediate agent callback.";
  if (isLegal) return "While I can provide standard market estimates, our licensed property attorneys can review exact tax, deed, and registration details with you.";
  return "I will check this detail with our senior property consultant and request a callback for you. May I have your mobile number?";
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history, userName } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let dynamicSystemPrompt = AURA_SYSTEM_PROMPT;
    if (userName) {
      dynamicSystemPrompt += `\n\nClient Name: The current client interacting with you is named "${userName}". Address them naturally by their name.`;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // If GEMINI_API_KEY is not set on Vercel yet, execute Aura Multilingual engine & return status 200 OK!
      const auraReply = generateMultilingualFallback(message, userName);
      return res.status(200).json({
        success: true,
        reply: auraReply,
        note: 'GEMINI_API_KEY is not set on Vercel environment variables yet. Using Aura Multilingual Engine.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format chat history for Gemini API
    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      history.forEach(item => {
        if (item.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'aura' || item.sender === 'model') {
          contents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Call official @google/genai SDK using gemini-2.5-flash model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: dynamicSystemPrompt,
        temperature: 0.7,
      }
    });

    const replyText = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || 'I am here to help you find your dream property at Nitin Real Estate!';

    return res.status(200).json({
      success: true,
      reply: replyText
    });
  } catch (err) {
    console.error('❌ Vercel Serverless Gemini Error:', err);
    // Fallback on error to ensure 200 OK response
    const fallbackReply = generateMultilingualFallback(req.body?.message || '');
    return res.status(200).json({
      success: true,
      reply: fallbackReply
    });
  }
}
