/**
 * Maps a team / country name (Swedish or English) to a flag emoji.
 * Returns '' for unknown names so it's safe to interpolate.
 */

const NAME_TO_CODE: Record<string, string> = {
  // Värdnationer
  'usa': 'US', 'united states': 'US', 'förenta staterna': 'US',
  'kanada': 'CA', 'canada': 'CA',
  'mexiko': 'MX', 'mexico': 'MX',

  // UEFA — Europa
  'sverige': 'SE', 'sweden': 'SE',
  'danmark': 'DK', 'denmark': 'DK',
  'norge': 'NO', 'norway': 'NO',
  'finland': 'FI',
  'island': 'IS', 'iceland': 'IS',
  'tyskland': 'DE', 'germany': 'DE',
  'frankrike': 'FR', 'france': 'FR',
  'spanien': 'ES', 'spain': 'ES',
  'italien': 'IT', 'italy': 'IT',
  'portugal': 'PT',
  'england': 'GB-ENG',
  'skottland': 'GB-SCT', 'scotland': 'GB-SCT',
  'wales': 'GB-WLS',
  'nordirland': 'GB-NIR', 'northern ireland': 'GB-NIR',
  'irland': 'IE', 'ireland': 'IE',
  'nederländerna': 'NL', 'netherlands': 'NL', 'holland': 'NL',
  'belgien': 'BE', 'belgium': 'BE',
  'schweiz': 'CH', 'switzerland': 'CH',
  'österrike': 'AT', 'austria': 'AT',
  'polen': 'PL', 'poland': 'PL',
  'tjeckien': 'CZ', 'czech republic': 'CZ', 'czechia': 'CZ',
  'slovakien': 'SK', 'slovakia': 'SK',
  'slovenien': 'SI', 'slovenia': 'SI',
  'ungern': 'HU', 'hungary': 'HU',
  'rumänien': 'RO', 'romania': 'RO',
  'kroatien': 'HR', 'croatia': 'HR',
  'serbien': 'RS', 'serbia': 'RS',
  'bosnien och hercegovina': 'BA', 'bosnia': 'BA', 'bosnia and herzegovina': 'BA',
  'montenegro': 'ME',
  'albanien': 'AL', 'albania': 'AL',
  'nordmakedonien': 'MK', 'north macedonia': 'MK',
  'kosovo': 'XK',
  'grekland': 'GR', 'greece': 'GR',
  'turkiet': 'TR', 'turkey': 'TR', 'türkiye': 'TR',
  'ukraina': 'UA', 'ukraine': 'UA',
  'ryssland': 'RU', 'russia': 'RU',
  'bulgarien': 'BG', 'bulgaria': 'BG',
  'cypern': 'CY', 'cyprus': 'CY',
  'israel': 'IL',
  'estland': 'EE', 'estonia': 'EE',
  'lettland': 'LV', 'latvia': 'LV',
  'litauen': 'LT', 'lithuania': 'LT',
  'georgien': 'GE', 'georgia': 'GE',

  // CONMEBOL — Sydamerika
  'brasilien': 'BR', 'brazil': 'BR',
  'argentina': 'AR',
  'uruguay': 'UY',
  'colombia': 'CO',
  'ecuador': 'EC',
  'chile': 'CL',
  'paraguay': 'PY',
  'peru': 'PE',
  'bolivia': 'BO',
  'venezuela': 'VE',

  // CAF — Afrika
  'senegal': 'SN',
  'marocko': 'MA', 'morocco': 'MA',
  'egypten': 'EG', 'egypt': 'EG',
  'algeriet': 'DZ', 'algeria': 'DZ',
  'tunisien': 'TN', 'tunisia': 'TN',
  'kamerun': 'CM', 'cameroon': 'CM',
  'ghana': 'GH',
  'elfenbenskusten': 'CI', 'ivory coast': 'CI', "côte d'ivoire": 'CI',
  'nigeria': 'NG',
  'sydafrika': 'ZA', 'south africa': 'ZA',
  'mali': 'ML',
  'kongo dr': 'CD', 'dr congo': 'CD', 'congo dr': 'CD',
  'cap verde': 'CV', 'kap verde': 'CV',

  // AFC — Asien
  'japan': 'JP',
  'sydkorea': 'KR', 'south korea': 'KR', 'korea republic': 'KR',
  'nordkorea': 'KP', 'north korea': 'KP',
  'saudiarabien': 'SA', 'saudi arabia': 'SA',
  'iran': 'IR',
  'australien': 'AU', 'australia': 'AU',
  'qatar': 'QA',
  'förenade arabemiraten': 'AE', 'uae': 'AE', 'united arab emirates': 'AE',
  'irak': 'IQ', 'iraq': 'IQ',
  'uzbekistan': 'UZ',
  'jordanien': 'JO', 'jordan': 'JO',

  // CONCACAF — Nord/Centralamerika
  'costa rica': 'CR',
  'panama': 'PA',
  'jamaica': 'JM',
  'honduras': 'HN',
  'el salvador': 'SV',
  'guatemala': 'GT',
  'trinidad och tobago': 'TT', 'trinidad and tobago': 'TT',
  'haiti': 'HT',
  'curacao': 'CW', 'curaçao': 'CW',

  // OFC — Oceanien
  'nya zeeland': 'NZ', 'new zealand': 'NZ',
};

const SUBDIVISION_FLAGS: Record<string, string> = {
  'GB-ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'GB-SCT': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'GB-WLS': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  // Nordirland har ingen egen flagga-emoji; använd brittisk som fallback.
  'GB-NIR': '🇬🇧',
};

function flagFromCode(code: string): string {
  if (SUBDIVISION_FLAGS[code]) return SUBDIVISION_FLAGS[code];
  if (code.length !== 2) return '';
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export function flagFor(teamName: string | null | undefined): string {
  if (!teamName) return '';
  const key = teamName.trim().toLowerCase();
  const code = NAME_TO_CODE[key];
  return code ? flagFromCode(code) : '';
}
