// Gemini AI Service
// AI sirf explain karta hai - predictions rule engine karta hai
// Hinglish mein friendly explanation generate karta hai

const axios = require('axios');

const GEMINI_API_URL ='https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

// Structured insights ko Gemini prompt mein convert karo
function buildKundaliPrompt(insights, lagnaInfo, mahadasha, userName) {
  const careerInsights = insights.career.map(i => `- ${i.rule}: ${i.effect}\n  Based on: ${i.based_on}\n  Reason: ${i.reason}`).join('\n');
  const relationshipInsights = insights.relationship.map(i => `- ${i.rule}: ${i.effect}\n  Based on: ${i.based_on}`).join('\n');
  const personalityInsights = insights.personality.map(i => `- ${i.rule}: ${i.effect}\n  Based on: ${i.based_on}`).join('\n');
  const wealthInsights = insights.wealth.map(i => `- ${i.rule}: ${i.effect}\n  Based on: ${i.based_on}`).join('\n');

  return `Tu ek experienced Vedic astrology advisor hai jo Hinglish mein (Hindi + English mix) friendly aur helpful advice deta hai.

Niche diye gaye astrology calculations aur rule-based insights ALREADY compute ho chuke hain. Tera kaam sirf inhe simple, warm, aur practical language mein explain karna hai.

**User Ka Naam:** ${userName || 'aap'}
**Lagna (Ascendant):** ${lagnaInfo.sign} Lagna - ${lagnaInfo.lord} is the lagna lord
**Current Mahadasha:** ${mahadasha.planet} Mahadasha

**COMPUTED CAREER INSIGHTS:**
${careerInsights || 'No strong career placements found'}

**COMPUTED RELATIONSHIP INSIGHTS:**
${relationshipInsights || 'No strong relationship placements found'}

**COMPUTED PERSONALITY INSIGHTS:**
${personalityInsights || 'No strong personality placements found'}

**COMPUTED WEALTH INSIGHTS:**
${wealthInsights || 'No strong wealth placements found'}

**INSTRUCTIONS:**
1. Inhe friendly Hinglish mein explain karo (jaise ek dost astrologer baat kar raha ho)
2. Practical life advice dena - sirf predictions nahi
3. Positive aur encouraging tone rakhna
4. Har section ke liye 2-3 sentences mein explain karo
5. Start karo "${userName ? userName + ' ji' : 'Aap'}, aapki kundali mein..." se
6. End karo ek motivating message ke saath
7. Exactly 4 sections banao: Vyaktitva (Personality), Career & Profession, Relationships & Marriage, Dhan & Samriddhi (Wealth)
8. Total response 400-500 words ke beech rakhna
9. No bullet points - flowing paragraphs mein likho

Sirf explanation do, koi extra commentary nahi.`;
}

// Chat ke liye prompt
function buildChatPrompt(userMessage, kundaliInsights, lagnaInfo, chatHistory) {
  const historyText = chatHistory
    .slice(-6) // Last 6 messages for context
    .map(m => `${m.role === 'user' ? 'User' : 'Astrologer'}: ${m.content}`)
    .join('\n');

  const summaryInsights = [
    ...kundaliInsights.career.slice(0, 2).map(i => `Career: ${i.effect} (${i.based_on})`),
    ...kundaliInsights.relationship.slice(0, 2).map(i => `Relationship: ${i.effect} (${i.based_on})`),
    ...kundaliInsights.personality.slice(0, 2).map(i => `Personality: ${i.effect} (${i.based_on})`),
    ...kundaliInsights.wealth.slice(0, 2).map(i => `Wealth: ${i.effect} (${i.based_on})`)
  ].join('\n');

  return `Tu ek experienced Vedic astrology advisor hai. User ki kundali ke pre-computed insights niche hain.

**Kundali Insights:**
${summaryInsights}

**Lagna:** ${lagnaInfo.sign}

**Pichli Conversation:**
${historyText || 'Nai conversation hai.'}

**User Ka Sawaal:** ${userMessage}

Instructions:
- Hinglish mein jawab do (friendly tone)
- Sirf kundali insights ke basis par jawab do - kuch bhi invent mat karo
- 3-4 sentences mein concise jawab do
- Practical aur helpful raho
- Agar sawaal kundali se related nahi toh politely redirect karo`;
}

// Main Gemini API call function
async function callGeminiAPI(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    // Return a mock response when no API key is configured
    return generateMockAIResponse();
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');
    return text;

  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('AI quota exceeded. Please try again later.');
    }
    if (error.response?.status === 403) {
      throw new Error('Invalid Gemini API key. Please check configuration.');
    }
    throw new Error(`AI explanation failed: ${error.message}`);
  }
}

// Generate kundali explanation
async function generateKundaliExplanation(insights, lagnaInfo, mahadasha, userName) {
  const prompt = buildKundaliPrompt(insights, lagnaInfo, mahadasha, userName);
  return await callGeminiAPI(prompt);
}

// Generate chat response
async function generateChatResponse(userMessage, kundaliInsights, lagnaInfo, chatHistory) {
  const prompt = buildChatPrompt(userMessage, kundaliInsights, lagnaInfo, chatHistory);
  return await callGeminiAPI(prompt);
}

// Mock response when API key not configured
function generateMockAIResponse() {
  return `Aap ki kundali mein bahut interesting planetary positions hain! 

**Vyaktitva (Personality):** Aapki janam kundali se pata chalta hai ki aap ek strong personality wale insaan hain. Aapke andar leadership qualities naturally hain aur log aapki taraf easily attract hote hain. Aap jab bhi kisi kaam mein lagte hain toh puri dedication ke saath lagte hain - yahi aapki sabse badi strength hai.

**Career & Profession:** Career ke maamle mein aapke liye achhe din aane wale hain. Aapke planets suggest karte hain ki hard work aur patience se aap apne field mein recognition zaroor payenge. Jo bhi profession choose karein, usmein consistency rakhein - Saturn ke influence se success thodi late aati hai par aati zaroor hai.

**Relationships & Marriage:** Aapke liye relationships mein communication key hai. Partner ke saath open aur honest rehna important hai. Aapki kundali suggest karti hai ki aap deeply loyal partner hain aur aapko bhi aisa hi partner milega jo aapko deeply appreciate kare.

**Dhan & Samriddhi (Wealth):** Financial matters mein aap dheere dheere stable ho rahe hain. Multiple income sources explore karna aapke liye beneficial rahega. Middle age mein financial position significantly improve hogi. Investments mein careful rehna aur long-term thinking rakhna beneficial hai.

Yaad rakhein - kundali ek map hai, destiny nahi. Aapki mehnat aur positive thinking aapke stars se bhi zyada powerful hai! 🌟`;
}

module.exports = {
  generateKundaliExplanation,
  generateChatResponse,
  buildKundaliPrompt
};
