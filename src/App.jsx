import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/v2/topojson-maps/world-110m.json";

// Country map as given
const countryMap = {
  "Afghanistan": "AF", "Ägypten": "EG", "Albanien": "AL", "Algerien": "DZ", "Andorra": "AD",
  "Angola": "AO", "Antigua und Barbuda": "AG", "Äquatorialguinea": "GQ", "Argentinien": "AR",
  "Armenien": "AM", "Aserbaidschan": "AZ", "Äthiopien": "ET", "Australien": "AU", "Bahamas": "BS",
  "Bahrain": "BH", "Bangladesch": "BD", "Barbados": "BB", "Belarus": "BY", "Belgien": "BE",
  "Belize": "BZ", "Benin": "BJ", "Bhutan": "BT", "Bolivien": "BO", "Bosnien und Herzegowina": "BA",
  "Botsuana": "BW", "Brasilien": "BR", "Brunei": "BN", "Bulgarien": "BG", "Burkina Faso": "BF",
  "Burundi": "BI", "Chile": "CL", "China": "CN", "Costa Rica": "CR", "Dänemark": "DK",
  "Deutschland": "DE", "Dominica": "DM", "Dominikanische Republik": "DO", "Dschibuti": "DJ",
  "Ecuador": "EC", "El Salvador": "SV", "Eritrea": "ER", "Estland": "EE", "Eswatini": "SZ",
  "Fidschi": "FJ", "Finnland": "FI", "Frankreich": "FR", "Gabun": "GA", "Gambia": "GM",
  "Georgien": "GE", "Ghana": "GH", "Grenada": "GD", "Griechenland": "GR", "Guatemala": "GT",
  "Guinea": "GN", "Guinea-Bissau": "GW", "Guyana": "GY", "Haiti": "HT", "Honduras": "HN",
  "Indien": "IN", "Indonesien": "ID", "Irak": "IQ", "Iran": "IR", "Irland": "IE",
  "Island": "IS", "Palästina": "PS", "Italien": "IT", "Jamaika": "JM", "Japan": "JP",
  "Jemen": "YE", "Jordanien": "JO", "Kambodscha": "KH", "Kamerun": "CM", "Kanada": "CA",
  "Kap Verde": "CV", "Kasachstan": "KZ", "Katar": "QA", "Kenia": "KE", "Kirgisistan": "KG",
  "Kiribati": "KI", "Kolumbien": "CO", "Komoren": "KM", "Kongo (Republik)": "CG",
  "Kongo (Demokratische Republik)": "CD", "Korea (Demokratische Volksrepublik)": "KP",
  "Korea (Republik)": "KR", "Kosovo": "XK", "Kroatien": "HR", "Kuba": "CU", "Kuwait": "KW",
  "Laos": "LA", "Lesotho": "LS", "Lettland": "LV", "Libanon": "LB", "Liberia": "LR",
  "Libyen": "LY", "Liechtenstein": "LI", "Litauen": "LT", "Luxemburg": "LU", "Madagaskar": "MG",
  "Malawi": "MW", "Malaysia": "MY", "Malediven": "MV", "Mali": "ML", "Malta": "MT",
  "Marokko": "MA", "Marshallinseln": "MH", "Mauretanien": "MR", "Mauritius": "MU",
  "Mexiko": "MX", "Mikronesien": "FM", "Moldau": "MD", "Monaco": "MC", "Mongolei": "MN",
  "Montenegro": "ME", "Mosambik": "MZ", "Myanmar": "MM", "Namibia": "NA", "Nauru": "NR",
  "Nepal": "NP", "Neuseeland": "NZ", "Nicaragua": "NI", "Niederlande": "NL", "Niger": "NE",
  "Nigeria": "NG", "Nordmazedonien": "MK", "Norwegen": "NO", "Oman": "OM", "Österreich": "AT",
  "Osttimor": "TL", "Pakistan": "PK", "Palau": "PW", "Panama": "PA", "Papua-Neuguinea": "PG",
  "Paraguay": "PY", "Peru": "PE", "Philippinen": "PH", "Polen": "PL", "Portugal": "PT",
  "Ruanda": "RW", "Rumänien": "RO", "Russland": "RU", "St. Kitts und Nevis": "KN",
  "St. Lucia": "LC", "St. Vincent und die Grenadinen": "VC", "Samoa": "WS", "San Marino": "SM",
  "São Tomé und Príncipe": "ST", "Saudi-Arabien": "SA", "Schweden": "SE", "Schweiz": "CH",
  "Senegal": "SN", "Serbien": "RS", "Seychellen": "SC", "Sierra Leone": "SL", "Simbabwe": "ZW",
  "Singapur": "SG", "Slowakei": "SK", "Slowenien": "SI", "Somalia": "SO", "Spanien": "ES",
  "Sri Lanka": "LK", "Südafrika": "ZA", "Sudan": "SD", "Südsudan": "SS", "Suriname": "SR",
  "Syrien": "SY", "Tadschikistan": "TJ", "Tansania": "TZ", "Thailand": "TH", "Togo": "TG",
  "Tonga": "TO", "Trinidad und Tobago": "TT", "Tschad": "TD", "Tschechien": "CZ",
  "Tunesien": "TN", "Türkei": "TR", "Turkmenistan": "TM", "Tuvalu": "TV", "Uganda": "UG",
  "Ukraine": "UA", "Ungarn": "HU", "Uruguay": "UY", "Usbekistan": "UZ", "Vanuatu": "VU",
  "Vatikanstadt": "VA", "Venezuela": "VE", "Vereinigte Arabische Emirate": "AE",
  "Vereinigte Staaten": "US", "Vereinigtes Königreich": "GB", "Vietnam": "VN",
  "Zentralafrikanische Republik": "CF", "Zypern": "CY", "Elfenbeinküste": "CI"
};

// Compute Levenshtein Distance between two strings
function levenshteinDistance(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: an + 1 }, () => Array(bn + 1).fill(0));

  for (let i = 0; i <= an; i++) matrix[i][0] = i;
  for (let j = 0; j <= bn; j++) matrix[0][j] = j;

  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,    // deletion
        matrix[i][j - 1] + 1,    // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[an][bn];
}

export default function App() {
  const [guess, setGuess] = useState("");
  const [foundCountries, setFoundCountries] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [gameOver, setGameOver] = useState(false);
  const [hint, setHint] = useState(null);

  const totalCountries = Object.keys(countryMap).length;

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setGameOver(true);
    }
  }, [timeLeft]);

  const handleChange = (e) => {
    const value = e.target.value;
    setGuess(value);
    setHint(null);

    const trimmed = value.trim();
    const isoCode = countryMap[trimmed];
    if (isoCode && !foundCountries.includes(isoCode) && !gameOver) {
      // Correct guess
      setFoundCountries((prev) => [...prev, isoCode]);
      setGuess("");
      setHint(null);
    } else if (!isoCode && trimmed.length >= 4 && !gameOver) {
      // No exact match, let's check if close to any country
      const hintCountry = findCloseMatch(trimmed);
      if (hintCountry) {
        setHint(`Meintest du vielleicht: "${hintCountry}"?`);
      } else {
        setHint(null);
      }
    }
  };

  const findCloseMatch = (input) => {
    let bestMatch = null;
    let bestDistance = Infinity;
    for (const country of Object.keys(countryMap)) {
      // Ignore already found countries
      if (foundCountries.includes(countryMap[country])) continue;
      const dist = levenshteinDistance(input, country);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestMatch = country;
      }
    }

    // If best match is within 2 edits, we return it as a hint
    return bestDistance <= 2 ? bestMatch : null;
  };

  const resetGame = () => {
    setGuess("");
    setFoundCountries([]);
    setTimeLeft(1200);
    setGameOver(false);
    setHint(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Errate die Länder der Welt (Deutsch)</h1>
      <div style={styles.infoContainer}>
        <div style={styles.infoItem}>
          <strong>Zeit:</strong> {timeLeft}s
        </div>
        <div style={styles.infoItem}>
          <strong>Gefundene Länder:</strong> {foundCountries.length} / {totalCountries}
        </div>
      </div>

      <div style={styles.mapContainer}>
        <ComposableMap projectionConfig={{ scale: 200 }} style={styles.svgMap}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isoCode = geo.properties.ISO_A2;
                const isFound = foundCountries.includes(isoCode);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isFound ? "#4CAF50" : "#E0E0E0",
                        outline: "none",
                        stroke: "#9E9E9E",
                        transition: "fill 0.3s ease"
                      },
                      hover: {
                        fill: isFound ? "#81C784" : "#BDBDBD",
                        outline: "none",
                        transition: "fill 0.3s ease"
                      },
                      pressed: {
                        fill: isFound ? "#388E3C" : "#757575",
                        outline: "none",
                        transition: "fill 0.3s ease"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Gib ein Land ein (z.B. Deutschland)"
          value={guess}
          onChange={handleChange}
          style={styles.input}
          disabled={gameOver}
        />
        <button type="button" style={styles.button} onClick={resetGame}>
          Reset
        </button>
      </div>

      {hint && (
        <div style={styles.hint}>
          {hint}
        </div>
      )}

      {gameOver && (
        <div style={styles.gameOver}>
          <strong>Zeit abgelaufen!</strong> Du hast {foundCountries.length} von {totalCountries} Ländern gefunden.
        </div>
      )}

      <footer style={styles.footer}>
        <p style={styles.footerText}>Powered by Mohamedamin Kraiem für Boosteno Students</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Open Sans', Arial, sans-serif",
    margin: "0 auto",
    padding: "20px",
    maxWidth: "800px",
    textAlign: "center",
    background: "linear-gradient(to bottom right, #fafafa, #ffffff)",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)"
  },
  title: {
    fontSize: "2rem",
    marginBottom: "15px",
    color: "#333",
    fontWeight: "bold"
  },
  infoContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "15px",
    fontSize: "1.2rem",
    color: "#555",
    flexWrap: "wrap",
    gap: "10px"
  },
  infoItem: {
    background: "#E0F7FA",
    padding: "10px 15px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    minWidth: "140px"
  },
  mapContainer: {
    width: "100%",
    height: "auto",
    marginBottom: "20px",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #CCC"
  },
  svgMap: {
    width: "100%",
    height: "auto"
  },
  form: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    flex: 1,
    fontSize: "1.2rem",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #9E9E9E",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    maxWidth: "300px"
  },
  button: {
    fontSize: "1.2rem",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    background: "#4CAF50",
    color: "#FFF",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background 0.3s ease, transform 0.2s ease"
  },
  hint: {
    fontSize: "1rem",
    marginTop: "10px",
    color: "#0277BD",
    fontStyle: "italic",
    background: "#E3F2FD",
    display: "inline-block",
    padding: "10px 15px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    animation: "fadeIn 0.3s ease-in"
  },
  gameOver: {
    fontSize: "1.5rem",
    marginTop: "20px",
    color: "#D32F2F",
    fontWeight: "bold"
  },
  footer: {
    marginTop: "20px",
    padding: "10px",
    background: "linear-gradient(to right, #4CAF50, #81C784)",
    color: "#FFF",
    textAlign: "center",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
  },
  footerText: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: "bold"
  },
  "@media (max-width: 600px)": {
    title: {
      fontSize: "1.5rem"
    },
    input: {
      fontSize: "1rem"
    },
    button: {
      fontSize: "1rem",
      padding: "8px 15px"
    }
  }
};
