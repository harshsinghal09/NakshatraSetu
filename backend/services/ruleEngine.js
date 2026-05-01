// Vedic Astrology Rule Engine
// Pure code logic - No AI involved
// Planet + House combinations se insights generate karte hain

// =============================================================
// RULES DATABASE - Vedic Jyotish ke rules
// =============================================================

const VEDIC_RULES = [
  // ============ CAREER / PROFESSION RULES ============
  {
    planet: 'Saturn', house: 10, domain: 'career',
    rule: 'Saturn in 10th House',
    effect: 'Slow but extremely stable career growth with discipline',
    prediction: 'Aapka career mein success late aayegi, par jo milega woh solid aur permanent hoga. Government jobs ya large corporations mein success milne ke chances hain.',
    reason: 'Saturn 10th house ka karak hai aur yahan hone se discipline, hard work aur patience se career mein uchhai milti hai. Saturn delays but never denies.',
    based_on: 'Saturn + 10th House',
    strength: 'strong'
  },
  {
    planet: 'Sun', house: 10, domain: 'career',
    rule: 'Sun in 10th House',
    effect: 'Natural leadership and authority in career',
    prediction: 'Aap career mein leadership roles ke liye bane hain. Government, politics, administration ya management mein success milegi.',
    reason: 'Sun is the natural significator of authority. In the 10th house (Karma bhava), it gives strong desire for recognition and leadership.',
    based_on: 'Sun + 10th House',
    strength: 'strong'
  },
  {
    planet: 'Jupiter', house: 10, domain: 'career',
    rule: 'Jupiter in 10th House',
    effect: 'Respected profession, teacher, advisor, or judge',
    prediction: 'Aap teaching, law, finance, ya advisory roles mein bahut acha karte hain. Log aapki raay maante hain aur aap apne field mein guru ban sakte hain.',
    reason: 'Jupiter is the planet of wisdom, knowledge, and expansion. In the 10th house, it creates respectable and ethical career paths.',
    based_on: 'Jupiter + 10th House',
    strength: 'strong'
  },
  {
    planet: 'Mars', house: 10, domain: 'career',
    rule: 'Mars in 10th House',
    effect: 'Dynamic and aggressive career growth',
    prediction: 'Aap engineering, sports, military, police, ya entrepreneurship mein excel karte hain. Career mein competition se darte nahi.',
    reason: 'Mars in 10th house gives tremendous ambition, drive, and competitive spirit in professional life.',
    based_on: 'Mars + 10th House',
    strength: 'medium'
  },
  {
    planet: 'Mercury', house: 10, domain: 'career',
    rule: 'Mercury in 10th House',
    effect: 'Success in communication, writing, and business',
    prediction: 'Writing, media, IT, finance, ya business mein bahut success milegi. Aap multi-tasking mein mahir hain.',
    reason: 'Mercury rules communication, intellect, and business. 10th house placement makes these traits your career identity.',
    based_on: 'Mercury + 10th House',
    strength: 'medium'
  },
  {
    planet: 'Venus', house: 10, domain: 'career',
    rule: 'Venus in 10th House',
    effect: 'Creative and artistic career with fame',
    prediction: 'Art, music, fashion, entertainment, ya luxury goods mein career banana aapke liye perfect hai. Public mein popular rahenge.',
    reason: 'Venus in 10th house gives artistic talent, charm, and public appeal which translates into career success in creative fields.',
    based_on: 'Venus + 10th House',
    strength: 'medium'
  },
  {
    planet: 'Rahu', house: 10, domain: 'career',
    rule: 'Rahu in 10th House',
    effect: 'Unconventional career path with sudden rises',
    prediction: 'Technology, foreign connections, ya unusual fields mein bahut success milegi. Career mein sudden ups and downs aayenge.',
    reason: 'Rahu in 10th house creates an ambitious but unconventional approach to career. It can bring sudden fame and foreign connections.',
    based_on: 'Rahu + 10th House',
    strength: 'medium'
  },
  {
    planet: 'Moon', house: 10, domain: 'career',
    rule: 'Moon in 10th House',
    effect: 'Career in public service, hospitality, or care',
    prediction: 'Public dealing wale jobs, healthcare, hospitality, ya food industry mein acchi success milegi. Public mein popular rahenge.',
    reason: 'Moon rules the public and masses. In 10th house it creates connection with the public and emotional investment in career.',
    based_on: 'Moon + 10th House',
    strength: 'medium'
  },

  // ============ RELATIONSHIP RULES ============
  {
    planet: 'Mars', house: 7, domain: 'relationship',
    rule: 'Mangal Dosha - Mars in 7th House',
    effect: 'Relationship conflicts and strong passionate energy',
    prediction: 'Aapki relationships mein passion bahut zyada hoga. Partner ke saath arguments ho sakte hain. Manglik partner se vivah better rahega.',
    reason: 'Mars in 7th house (house of marriage) creates Mangal Dosha. It brings passion but also conflict, ego clashes and aggression in partnerships.',
    based_on: 'Mars + 7th House',
    strength: 'strong'
  },
  {
    planet: 'Venus', house: 7, domain: 'relationship',
    rule: 'Venus in 7th House',
    effect: 'Beautiful, harmonious and loving relationship',
    prediction: 'Aapka partner bahut attractive aur loving hoga. Marriage life sukh aur harmony se bhari rahegi. Dono ek doosre ko deeply samjhenge.',
    reason: 'Venus is the natural ruler of the 7th house. Its placement here gives a very favorable marriage with beauty, harmony, and love.',
    based_on: 'Venus + 7th House',
    strength: 'strong'
  },
  {
    planet: 'Jupiter', house: 7, domain: 'relationship',
    rule: 'Jupiter in 7th House',
    effect: 'Wise, learned and spiritual life partner',
    prediction: 'Aapka partner educated, wise aur dharmic hoga. Marriage late hogi par bahut achhi hogi. Partner aapko life mein grow karne mein help karega.',
    reason: 'Jupiter in 7th house blesses with a wise, well-educated and morally upright partner. Marriage brings wisdom and prosperity.',
    based_on: 'Jupiter + 7th House',
    strength: 'strong'
  },
  {
    planet: 'Saturn', house: 7, domain: 'relationship',
    rule: 'Saturn in 7th House',
    effect: 'Delayed marriage but stable long-term relationship',
    prediction: 'Vivah mein deri ho sakti hai. Partner aapse umar mein bade ya serious swabhav ke honge. Time ke saath relationship mature aur strong hoti hai.',
    reason: 'Saturn delays but strengthens whatever it touches. In 7th house, it delays marriage but makes the eventual partnership stable and lasting.',
    based_on: 'Saturn + 7th House',
    strength: 'medium'
  },
  {
    planet: 'Rahu', house: 7, domain: 'relationship',
    rule: 'Rahu in 7th House',
    effect: 'Unconventional or inter-caste marriage',
    prediction: 'Love marriage ya inter-caste vivah ki sambhavna hai. Partner foreign ya different background se ho sakta hai. Relationship dramatic reh sakti hai.',
    reason: 'Rahu in 7th house creates unusual and often cross-cultural partnerships. It brings obsession and karmic relationships.',
    based_on: 'Rahu + 7th House',
    strength: 'medium'
  },
  {
    planet: 'Moon', house: 7, domain: 'relationship',
    rule: 'Moon in 7th House',
    effect: 'Emotionally deep and nurturing partnership',
    prediction: 'Aap bahut emotionally connected partner chahte hain. Partner caring aur emotional hoga. Relationship mein emotional bonding bohot important hai aapke liye.',
    reason: 'Moon in 7th house creates strong emotional needs in partnerships and attracts nurturing partners.',
    based_on: 'Moon + 7th House',
    strength: 'medium'
  },

  // ============ WEALTH RULES ============
  {
    planet: 'Jupiter', house: 2, domain: 'wealth',
    rule: 'Jupiter in 2nd House',
    effect: 'Strong wealth accumulation and financial prosperity',
    prediction: 'Aapke paas paise ki kami kabhi nahi rahegi. Family se wealth milegi. Savings aur investments mein bahut success milegi. Luxurious life milegi.',
    reason: 'Jupiter in 2nd house (house of wealth and possessions) is one of the best combinations for material prosperity. Jupiter expands wealth.',
    based_on: 'Jupiter + 2nd House',
    strength: 'strong'
  },
  {
    planet: 'Venus', house: 2, domain: 'wealth',
    rule: 'Venus in 2nd House',
    effect: 'Wealth through beauty, luxury and artistic pursuits',
    prediction: 'Fashion, beauty, art, ya entertainment se paise milenge. Aap comforts aur luxuries enjoy karte hain aur woh milte bhi hain.',
    reason: 'Venus in 2nd house brings wealth through beautiful things and pleasures. It indicates accumulation of comforts and luxuries.',
    based_on: 'Venus + 2nd House',
    strength: 'strong'
  },
  {
    planet: 'Mercury', house: 2, domain: 'wealth',
    rule: 'Mercury in 2nd House',
    effect: 'Wealth through business, trade, and communication',
    prediction: 'Business, trading, ya communication-based work se bahut paise milenge. Multiple income sources ho sakte hain.',
    reason: 'Mercury in 2nd house gives business acumen and the ability to earn through trade, communication, and multiple sources.',
    based_on: 'Mercury + 2nd House',
    strength: 'medium'
  },
  {
    planet: 'Saturn', house: 2, domain: 'wealth',
    rule: 'Saturn in 2nd House',
    effect: 'Slow wealth accumulation but great savings ability',
    prediction: 'Paise dheere dheere aayenge par aap ache saver hain. Middle age mein financial stability achi ho jayegi. Karyadaksha hain paise ke mamle mein.',
    reason: 'Saturn in 2nd house delays prosperity but teaches the value of money. It creates disciplined financial habits.',
    based_on: 'Saturn + 2nd House',
    strength: 'medium'
  },
  {
    planet: 'Rahu', house: 2, domain: 'wealth',
    rule: 'Rahu in 2nd House',
    effect: 'Sudden gains but also unexpected losses',
    prediction: 'Achanak paise milne ke aur achintan se jaane ke chances hain. Foreign connection se dhan praapti ho sakti hai. Stock market se savdhan rahein.',
    reason: 'Rahu in 2nd house creates an insatiable desire for wealth and can bring sudden financial changes - both gains and losses.',
    based_on: 'Rahu + 2nd House',
    strength: 'medium'
  },

  // ============ PERSONALITY RULES ============
  {
    planet: 'Sun', house: 1, domain: 'personality',
    rule: 'Sun in 1st House (Lagna)',
    effect: 'Strong, confident and authoritative personality',
    prediction: 'Aap bahut confident, charismatic aur natural leader hain. Log aapki taraf naturally attract hote hain. Health achhi rehti hai.',
    reason: 'Sun in Lagna (1st house) gives strong self-identity, leadership qualities, and robust constitution.',
    based_on: 'Sun + 1st House',
    strength: 'strong'
  },
  {
    planet: 'Moon', house: 1, domain: 'personality',
    rule: 'Moon in 1st House (Lagna)',
    effect: 'Sensitive, intuitive and empathetic personality',
    prediction: 'Aap bahut sensitive aur intuitive hain. Logo ki feelings aap jaldi samajh lete hain. Mood mein changes ho sakte hain.',
    reason: 'Moon in 1st house gives emotional sensitivity, strong intuition, and changeability in nature and mood.',
    based_on: 'Moon + 1st House',
    strength: 'medium'
  },
  {
    planet: 'Mars', house: 1, domain: 'personality',
    rule: 'Mars in 1st House (Lagna)',
    effect: 'Dynamic, energetic and courageous personality',
    prediction: 'Aap bahut energetic, bold aur fearless hain. Competition se pyar karte hain aur kabhi bhi haar nahi maante. Physically strong hain.',
    reason: 'Mars in Lagna gives tremendous energy, courage, and competitive spirit. The person is action-oriented and brave.',
    based_on: 'Mars + 1st House',
    strength: 'strong'
  },
  {
    planet: 'Jupiter', house: 1, domain: 'personality',
    rule: 'Jupiter in 1st House (Lagna)',
    effect: 'Wise, optimistic and spiritually inclined personality',
    prediction: 'Aap bahut wise, generous aur optimistic hain. Log aapse advice lene aate hain. Spiritual inclination hai aur body bhi healthy rehti hai.',
    reason: 'Jupiter in Lagna is one of the best placements, giving wisdom, generosity, optimism, and divine grace to the personality.',
    based_on: 'Jupiter + 1st House',
    strength: 'strong'
  },
  {
    planet: 'Venus', house: 1, domain: 'personality',
    rule: 'Venus in 1st House (Lagna)',
    effect: 'Charming, artistic and attractive personality',
    prediction: 'Aap bahut charming, attractive aur social hain. Art, music, ya beauty ke towards natural inclination hai. Logo se easily connect karte hain.',
    reason: 'Venus in Lagna gives physical beauty, charm, artistic nature, and social grace.',
    based_on: 'Venus + 1st House',
    strength: 'strong'
  },
  {
    planet: 'Saturn', house: 1, domain: 'personality',
    rule: 'Saturn in 1st House (Lagna)',
    effect: 'Disciplined, serious and hard-working personality',
    prediction: 'Aap bahut disciplined, serious aur methodical hain. Kisi bhi kaam mein bahut mehnat karte hain. Life mein responsibilities bahut hain.',
    reason: 'Saturn in Lagna creates a serious, disciplined, and hard-working personality. The person takes life seriously and works methodically.',
    based_on: 'Saturn + 1st House',
    strength: 'medium'
  },
  {
    planet: 'Rahu', house: 1, domain: 'personality',
    rule: 'Rahu in 1st House (Lagna)',
    effect: 'Unconventional, ambitious and magnetic personality',
    prediction: 'Aap bahut unique aur unconventional hain. Log aapki taraf magnetically attract hote hain. Ambitions bahut bade hain par kabhi kabhi confusion bhi hoti hai identity ke baare mein.',
    reason: 'Rahu in Lagna creates an unusual, charismatic personality with big ambitions and a tendency toward unconventional behavior.',
    based_on: 'Rahu + 1st House',
    strength: 'medium'
  },

  // ============ HEALTH RULES ============
  {
    planet: 'Saturn', house: 6, domain: 'health',
    rule: 'Saturn in 6th House',
    effect: 'Good immunity but chronic minor health issues',
    prediction: 'Aapki immunity generally achhi hai aur aap bimariyon se jeet lete hain. Par chronic issues jaise joint pain ya skin problems ho sakte hain.',
    reason: 'Saturn in 6th house (house of disease) gives power to overcome illness but can cause chronic conditions related to Saturn like bones, joints, skin.',
    based_on: 'Saturn + 6th House',
    strength: 'medium'
  },
  {
    planet: 'Mars', house: 6, domain: 'health',
    rule: 'Mars in 6th House',
    effect: 'Strong constitution but prone to accidents or fever',
    prediction: 'Aap physically strong hain aur bimari se jaldi theek hote hain. Par accidents, injuries ya fever ka dhyan rakhein. Enemies par vijay milti hai.',
    reason: 'Mars in 6th house gives physical strength and victory over enemies and disease, but also risk of accidents and inflammatory conditions.',
    based_on: 'Mars + 6th House',
    strength: 'medium'
  },
  {
    planet: 'Jupiter', house: 6, domain: 'health',
    rule: 'Jupiter in 6th House',
    effect: 'Generally good health but watch for weight issues',
    prediction: 'Overall health achha rehta hai. Par weight gain ya liver/digestive issues se savdhan rahein. Spiritual practices health mein madad karengi.',
    reason: 'Jupiter in 6th house generally helps overcome disease but its expansive nature can cause excess in diet and weight-related issues.',
    based_on: 'Jupiter + 6th House',
    strength: 'medium'
  }
];

// ============================================================
// RULE ENGINE FUNCTION - Planet positions ko rules se match karo
// ============================================================

function applyRuleEngine(planets, houses, lagna) {
  const insights = {
    career: [],
    relationship: [],
    personality: [],
    health: [],
    wealth: []
  };

  // Har planet ke liye rules check karo
  planets.forEach(planet => {
    VEDIC_RULES.forEach(rule => {
      if (rule.planet === planet.name && rule.house === planet.house) {
        const insight = {
          prediction: rule.prediction,
          based_on: rule.based_on,
          reason: rule.reason,
          rule: rule.rule,
          effect: rule.effect,
          planet: planet.name,
          house: planet.house,
          sign: planet.sign,
          strength: rule.strength
        };

        insights[rule.domain].push(insight);
      }
    });
  });

  // Lagna-based personality insights
  const lagnaSignInsights = getLagnaInsights(lagna);
  if (lagnaSignInsights) {
    insights.personality.push(lagnaSignInsights);
  }

  // Ensure har domain mein kuch toh ho
  if (insights.career.length === 0) {
    insights.career.push(getDefaultInsight('career', planets, lagna));
  }
  if (insights.relationship.length === 0) {
    insights.relationship.push(getDefaultInsight('relationship', planets, lagna));
  }
  if (insights.personality.length === 0) {
    insights.personality.push(getDefaultInsight('personality', planets, lagna));
  }

  return insights;
}

// Lagna sign ke basis par personality insights
function getLagnaInsights(lagna) {
  const lagnaInsights = {
    'Aries':       { prediction: 'Aap bold, pioneering aur action-oriented hain. Leadership naturally aata hai aapko.', reason: 'Aries lagna Mars ki energy deta hai - courage, aggression, aur leadership.' },
    'Taurus':      { prediction: 'Aap patient, reliable aur beauty-loving hain. Material comforts aapke liye important hain.', reason: 'Taurus lagna Venus ki energy deta hai - stability, sensuality, aur persistence.' },
    'Gemini':      { prediction: 'Aap curious, communicative aur versatile hain. Multiple interests hain aapke.', reason: 'Gemini lagna Mercury ki energy deta hai - intellect, adaptability, aur communication.' },
    'Cancer':      { prediction: 'Aap caring, intuitive aur home-loving hain. Family aapke liye sabse pehle hai.', reason: 'Cancer lagna Moon ki energy deta hai - emotional depth, nurturing, aur protectiveness.' },
    'Leo':         { prediction: 'Aap charismatic, creative aur proud hain. Recognition aur respect chahiye aapko.', reason: 'Leo lagna Sun ki energy deta hai - confidence, creativity, aur natural authority.' },
    'Virgo':       { prediction: 'Aap analytical, detail-oriented aur service-minded hain. Perfection chahte hain aap.', reason: 'Virgo lagna Mercury ki earth energy deta hai - analysis, precision, aur practicality.' },
    'Libra':       { prediction: 'Aap balanced, diplomatic aur relationship-oriented hain. Fairness aapke liye important hai.', reason: 'Libra lagna Venus ki air energy deta hai - harmony, beauty, aur social grace.' },
    'Scorpio':     { prediction: 'Aap intense, mysterious aur transformative hain. Depth mein jaana pasand hai aapko.', reason: 'Scorpio lagna Mars/Ketu ki energy deta hai - intensity, research, aur transformation.' },
    'Sagittarius': { prediction: 'Aap philosophical, adventurous aur truth-seeking hain. Freedom aur knowledge chahiye aapko.', reason: 'Sagittarius lagna Jupiter ki energy deta hai - wisdom, optimism, aur spiritual seeking.' },
    'Capricorn':   { prediction: 'Aap ambitious, disciplined aur practical hain. Success ke liye hard work karte hain.', reason: 'Capricorn lagna Saturn ki energy deta hai - discipline, ambition, aur perseverance.' },
    'Aquarius':    { prediction: 'Aap innovative, humanitarian aur independent hain. Society ke liye kuch karna chahte hain.', reason: 'Aquarius lagna Saturn ki air energy deta hai - originality, humanitarianism, aur detachment.' },
    'Pisces':      { prediction: 'Aap imaginative, empathetic aur spiritually inclined hain. Intuition bahut strong hai aapki.', reason: 'Pisces lagna Jupiter ki water energy deta hai - compassion, imagination, aur spiritual connection.' }
  };

  const data = lagnaInsights[lagna.sign];
  if (!data) return null;

  return {
    prediction: data.prediction,
    based_on: `${lagna.sign} Lagna (Ascendant)`,
    reason: data.reason,
    rule: `${lagna.sign} Lagna personality`,
    effect: `${lagna.sign} ascendant traits`,
    planet: 'Lagna',
    house: 1,
    sign: lagna.sign,
    strength: 'strong'
  };
}

// Default insights jab koi specific rule match na ho
function getDefaultInsight(domain, planets, lagna) {
  const defaults = {
    career: {
      prediction: 'Aapka career trajectory aapke lagna lord ki position se influence hoti hai. Hard work aur consistency se success milegi.',
      based_on: `${lagna.sign} Lagna`,
      reason: 'Lagna lord ki position career ke direction ko define karti hai.',
      rule: 'Lagna lord career analysis',
      effect: 'Career guidance based on lagna'
    },
    relationship: {
      prediction: 'Aapki relationships 7th house lord se influence hoti hain. Mutual respect aur understanding se relationships successful rahenge.',
      based_on: '7th House Analysis',
      reason: '7th house partnership aur marriage ka ghar hai.',
      rule: '7th house relationship analysis',
      effect: 'Relationship insights'
    },
    personality: {
      prediction: `${lagna.sign} lagna se aapki personality defined hoti hai. Aap apne sign ki qualities strongly manifest karte hain.`,
      based_on: `${lagna.sign} Ascendant`,
      reason: 'Lagna (Ascendant) personality aur physical appearance ko represent karta hai.',
      rule: 'Ascendant personality analysis',
      effect: 'Core personality traits'
    }
  };

  return { ...defaults[domain], planet: 'Lagna', house: 1, sign: lagna.sign, strength: 'medium' };
}

module.exports = { applyRuleEngine, VEDIC_RULES };
