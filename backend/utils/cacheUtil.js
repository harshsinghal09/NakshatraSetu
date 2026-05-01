// Cache utility - AI responses ko cache karne ke liye
// Same kundali ke liye repeated API calls avoid karo

const crypto = require('crypto');

// Planet positions ka hash banao for caching
function generateCacheKey(planets, lagnaSign) {
  const planetString = planets
    .map(p => `${p.name}:${p.house}:${p.sign}`)
    .sort()
    .join('|');
  
  const input = `${lagnaSign}:${planetString}`;
  return crypto.createHash('sha256').update(input).digest('hex').substring(0, 32);
}

module.exports = { generateCacheKey };
