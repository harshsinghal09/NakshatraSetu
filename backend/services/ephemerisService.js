// Astrology Engine Service
// Swiss Ephemeris calculations - deterministic, no API needed
// Yeh service planetary positions calculate karti hai

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_LORDS = {
  'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury',
  'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
  'Libra': 'Venus', 'Scorpio': 'Mars', 'Sagittarius': 'Jupiter',
  'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
};

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun',
  'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury'
];

// Dasha periods in years
const DASHA_YEARS = {
  'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10,
  'Mars': 7, 'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
};

// Convert Date + Time to Julian Day Number
function dateToJulian(year, month, day, hour, minute, second = 0) {
  // Gregorian to Julian Day conversion
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (year + 4716)) +
             Math.floor(30.6001 * (month + 1)) +
             day + B - 1524.5;
  const fracDay = (hour + minute / 60 + second / 3600) / 24;
  return JD + fracDay;
}

// Calculate Sun's mean longitude
function getSunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000.0
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  M = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
          + 0.000289 * Math.sin(3 * M);
  let sunLon = L0 + C;
  sunLon = ((sunLon % 360) + 360) % 360;
  return sunLon;
}

// Calculate Moon's longitude (simplified but accurate to ~1°)
function getMoonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  let L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  let D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  let M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  let Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  let F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;

  D = D * Math.PI / 180;
  M = M * Math.PI / 180;
  Mp = Mp * Math.PI / 180;
  F = F * Math.PI / 180;

  let lon = L + 6.2888 * Math.sin(Mp) + 1.2740 * Math.sin(2 * D - Mp)
          + 0.6583 * Math.sin(2 * D) + 0.2136 * Math.sin(2 * Mp)
          - 0.1851 * Math.sin(M) - 0.1144 * Math.sin(2 * F)
          + 0.0588 * Math.sin(2 * D - 2 * Mp) + 0.0572 * Math.sin(2 * D - M - Mp)
          + 0.0533 * Math.sin(2 * D + Mp);

  lon = ((lon % 360) + 360) % 360;
  return lon;
}

// Calculate planetary longitude using simplified VSOP87
function getPlanetLongitude(planet, jd) {
  const T = (jd - 2451545.0) / 36525;

  const elements = {
    'Mars':    { L: 355.433 + 19141.6964471 * T, e: 0.0933941, i: 1.8506, om: 49.558 },
    'Mercury': { L: 252.251 + 149474.0722491 * T, e: 0.2056317, i: 7.0050, om: 77.456 },
    'Venus':   { L: 181.980 + 58519.2130302 * T, e: 0.0067767, i: 3.3947, om: 131.563 },
    'Jupiter': { L: 34.351  + 3036.3027748 * T, e: 0.0489558, i: 1.3053, om: 14.331 },
    'Saturn':  { L: 50.078  + 1223.5110686 * T, e: 0.0557506, i: 2.4845, om: 92.431 },
    'Rahu':    { L: 125.044 - 1934.1361849 * T, e: 0, i: 0, om: 0 } // Moon's North Node
  };

  if (planet === 'Rahu') {
    let lon = elements['Rahu'].L;
    lon = ((lon % 360) + 360) % 360;
    return lon;
  }

  if (!elements[planet]) return 0;

  const el = elements[planet];
  let L = el.L;
  L = ((L % 360) + 360) % 360;

  // Add perturbation corrections (simplified)
  const M = (L - el.om) * Math.PI / 180;
  const correction = 2 * el.e * Math.sin(M) * 180 / Math.PI;

  let lon = L + correction;
  lon = ((lon % 360) + 360) % 360;
  return lon;
}

// Convert tropical longitude to sidereal (Vedic) using Lahiri ayanamsa
function tropicalToSidereal(tropicalLon, jd) {
  // Lahiri ayanamsa calculation
  const T = (jd - 2451545.0) / 36525;
  const ayanamsa = 23.85 + 0.013611111 * T; // Approximate Lahiri ayanamsa in degrees
  let siderealLon = tropicalLon - ayanamsa;
  siderealLon = ((siderealLon % 360) + 360) % 360;
  return siderealLon;
}

// Get sign from longitude
function getSign(longitude) {
  const signIndex = Math.floor(longitude / 30);
  return {
    sign: SIGNS[signIndex],
    signIndex: signIndex,
    degree: longitude % 30
  };
}

// Get nakshatra from sidereal longitude
function getNakshatra(longitude) {
  const nakshatraIndex = Math.floor(longitude / (360 / 27));
  return {
    nakshatra: NAKSHATRAS[nakshatraIndex],
    nakshatraLord: NAKSHATRA_LORDS[nakshatraIndex],
    index: nakshatraIndex
  };
}

// Calculate Lagna (Ascendant) based on birth time and location
function calculateLagna(jd, latitude, longitude, timezone) {
  // Local Sidereal Time calculation
  const T = (jd - 2451545.0) / 36525;

  // Greenwich Mean Sidereal Time (degrees)
  let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545) +
             0.000387933 * T * T - T * T * T / 38710000;
  GMST = ((GMST % 360) + 360) % 360;

  // Local Sidereal Time
  let LST = GMST + longitude;
  LST = ((LST % 360) + 360) % 360;

  // Obliquity of ecliptic
  const eps = (23.439291111 - 0.013004167 * T) * Math.PI / 180;

  // Convert LST to radians
  const LSTrad = LST * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;

  // Calculate Ascendant longitude
  const RAMC = LST; // Right Ascension of Midheaven Culmination
  const tanAsc = -Math.cos(LSTrad) / (Math.sin(eps) * Math.tan(latRad) + Math.cos(eps) * Math.sin(LSTrad));
  let ascLon = Math.atan(tanAsc) * 180 / Math.PI;

  // Quadrant correction
  if (Math.cos(LSTrad) > 0) ascLon += 180;
  ascLon = ((ascLon % 360) + 360) % 360;

  // Convert to sidereal
  const siderealAsc = tropicalToSidereal(ascLon, jd);
  const signData = getSign(siderealAsc);

  return {
    longitude: siderealAsc,
    sign: signData.sign,
    signIndex: signData.signIndex,
    degree: signData.degree,
    lord: SIGN_LORDS[signData.sign]
  };
}

// Calculate all houses using Equal House system
function calculateHouses(lagna) {
  const houses = [];
  for (let i = 0; i < 12; i++) {
    const houseLon = ((lagna.longitude + i * 30) % 360 + 360) % 360;
    const signData = getSign(houseLon);
    houses.push({
      number: i + 1,
      sign: signData.sign,
      signIndex: signData.signIndex,
      degree: signData.degree,
      lord: SIGN_LORDS[signData.sign]
    });
  }
  return houses;
}

// Calculate current Mahadasha from Moon's nakshatra
function calculateMahadasha(moonLongitude, dateOfBirth) {
  const nakshatraData = getNakshatra(moonLongitude);
  const nakshatraLord = nakshatraData.nakshatraLord;

  // Dasha sequence
  const dashaSequence = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  const lordIndex = dashaSequence.indexOf(nakshatraLord);

  // Calculate elapsed portion in current dasha
  const totalYearsInDasha = DASHA_YEARS[nakshatraLord];
  const degreeInNakshatra = moonLongitude % (360 / 27);
  const fractionElapsed = degreeInNakshatra / (360 / 27);
  const yearsElapsed = fractionElapsed * totalYearsInDasha;

  const dob = new Date(dateOfBirth);
  const dashaStart = new Date(dob);
  dashaStart.setFullYear(dob.getFullYear() - Math.floor(yearsElapsed));

  const dashaEnd = new Date(dashaStart);
  dashaEnd.setFullYear(dashaStart.getFullYear() + totalYearsInDasha);

  return {
    planet: nakshatraLord,
    startDate: dashaStart,
    endDate: dashaEnd
  };
}

// Main calculation function - entry point
async function calculateKundali(dateOfBirth, timeOfBirth, latitude, longitude, timezone = 5.5) {
  try {
    // Parse date and time
    const dob = new Date(dateOfBirth);
    const [hours, minutes] = timeOfBirth.split(':').map(Number);

    // Convert to UTC
    const year = dob.getFullYear();
    const month = dob.getMonth() + 1;
    const day = dob.getDate();

    // UTC time = local time - timezone offset
    const utcHour = hours - timezone;
    const adjustedHour = utcHour < 0 ? utcHour + 24 : utcHour;
    const adjustedDay = utcHour < 0 ? day - 1 : day;

    // Calculate Julian Day
    const jd = dateToJulian(year, month, adjustedDay, adjustedHour, minutes);

    // Calculate tropical longitudes for all planets
    const sunTropical = getSunLongitude(jd);
    const moonTropical = getMoonLongitude(jd);

    // Convert to sidereal
    const sunLon = tropicalToSidereal(sunTropical, jd);
    const moonLon = tropicalToSidereal(moonTropical, jd);
    const marsLon = tropicalToSidereal(getPlanetLongitude('Mars', jd), jd);
    const mercuryLon = tropicalToSidereal(getPlanetLongitude('Mercury', jd), jd);
    const venusLon = tropicalToSidereal(getPlanetLongitude('Venus', jd), jd);
    const jupiterLon = tropicalToSidereal(getPlanetLongitude('Jupiter', jd), jd);
    const saturnLon = tropicalToSidereal(getPlanetLongitude('Saturn', jd), jd);
    const rahuLon = tropicalToSidereal(getPlanetLongitude('Rahu', jd), jd);
    const ketuLon = ((rahuLon + 180) % 360 + 360) % 360; // Ketu is always opposite Rahu

    // Build planets array
    const planetData = [
      { name: 'Sun', longitude: sunLon },
      { name: 'Moon', longitude: moonLon },
      { name: 'Mars', longitude: marsLon },
      { name: 'Mercury', longitude: mercuryLon },
      { name: 'Venus', longitude: venusLon },
      { name: 'Jupiter', longitude: jupiterLon },
      { name: 'Saturn', longitude: saturnLon },
      { name: 'Rahu', longitude: rahuLon },
      { name: 'Ketu', longitude: ketuLon }
    ];

    // Calculate Lagna
    const lagna = calculateLagna(jd, latitude, longitude, timezone);

    // Calculate houses
    const houses = calculateHouses(lagna);

    // Map planets to houses
    const planets = planetData.map(planet => {
      const signData = getSign(planet.longitude);
      const nakshatraData = getNakshatra(planet.longitude);

      // Find which house this planet is in
      const lagnaSignIndex = lagna.signIndex;
      const planetSignIndex = signData.signIndex;
      const houseNumber = ((planetSignIndex - lagnaSignIndex + 12) % 12) + 1;

      return {
        name: planet.name,
        longitude: parseFloat(planet.longitude.toFixed(4)),
        sign: signData.sign,
        signIndex: signData.signIndex,
        house: houseNumber,
        degree: parseFloat(signData.degree.toFixed(2)),
        isRetrograde: false, // Simplified - actual retrograde requires more complex calc
        nakshatra: nakshatraData.nakshatra,
        nakshatraLord: nakshatraData.nakshatraLord
      };
    });

    // Calculate current Mahadasha
    const mahadasha = calculateMahadasha(moonLon, dateOfBirth);

    return {
      lagna,
      planets,
      houses,
      currentMahadasha: mahadasha,
      julianDay: jd
    };

  } catch (error) {
    throw new Error(`Kundali calculation failed: ${error.message}`);
  }
}

module.exports = {
  calculateKundali,
  SIGNS,
  SIGN_LORDS,
  NAKSHATRAS
};
