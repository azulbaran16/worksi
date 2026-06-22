// Canadian provinces/territories and major cities, for dropdown + city autocomplete.
export const PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

// Major cities per province (focused on where WorkSi operates: GTA, Ottawa, BC).
export const CITIES_BY_PROVINCE = {
  ON: [
    "Ajax", "Alliston", "Amherstburg", "Ancaster", "Aurora", "Aylmer", "Barrie",
    "Belleville", "Bolton", "Bowmanville", "Bracebridge", "Bradford", "Brampton",
    "Brantford", "Brockville", "Burlington", "Caledon", "Cambridge", "Chatham",
    "Clarington", "Cobourg", "Collingwood", "Cornwall", "Dundas", "East Gwillimbury",
    "Etobicoke", "Fort Erie", "Georgetown", "Georgina", "Grimsby", "Guelph",
    "Hamilton", "Innisfil", "Kanata", "Kawartha Lakes", "Keswick", "King City",
    "Kingston", "Kitchener", "Leamington", "Lindsay", "London", "Markham", "Midland",
    "Milton", "Mississauga", "Nepean", "Newmarket", "Niagara Falls",
    "Niagara-on-the-Lake", "North Bay", "North York", "Oakville", "Orangeville",
    "Orillia", "Oshawa", "Ottawa", "Owen Sound", "Paris", "Pembroke", "Peterborough",
    "Pickering", "Port Hope", "Quinte West", "Richmond Hill", "Sarnia",
    "Sault Ste. Marie", "Scarborough", "Simcoe", "St. Catharines", "St. Thomas",
    "Stoney Creek", "Stratford", "Sudbury", "Tecumseh", "Thornhill", "Thunder Bay",
    "Tillsonburg", "Timmins", "Toronto", "Uxbridge", "Vaughan", "Wasaga Beach",
    "Waterloo", "Welland", "Whitby", "Whitchurch-Stouffville", "Windsor",
    "Woodbridge", "Woodstock",
  ],
  BC: [
    "Vancouver", "Surrey", "Burnaby", "Richmond", "Abbotsford", "Coquitlam",
    "Langley", "Delta", "Kelowna", "Victoria", "Nanaimo", "Kamloops", "Chilliwack",
    "Maple Ridge", "New Westminster", "Port Coquitlam", "North Vancouver",
    "West Vancouver", "Mission", "Penticton", "Vernon", "Prince George",
    "Courtenay", "Campbell River", "Squamish", "White Rock", "Port Moody",
  ],
  AB: [
    "Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert", "Medicine Hat",
    "Airdrie", "Grande Prairie", "Spruce Grove", "Leduc", "Fort McMurray",
    "Okotoks", "Cochrane", "Sherwood Park", "Camrose",
  ],
  QC: [
    "Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke",
    "Lévis", "Trois-Rivières", "Terrebonne", "Saint-Jérôme", "Drummondville",
    "Saint-Hyacinthe", "Granby", "Brossard", "Repentigny",
  ],
  MB: ["Winnipeg", "Brandon", "Steinbach"],
  SK: ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw"],
  NS: ["Halifax", "Dartmouth", "Sydney"],
  NB: ["Moncton", "Saint John", "Fredericton"],
  NL: ["St. John's", "Mount Pearl"],
  PE: ["Charlottetown", "Summerside"],
  NT: ["Yellowknife"],
  YT: ["Whitehorse"],
  NU: ["Iqaluit"],
};

export const ALL_CITIES = Array.from(
  new Set(Object.values(CITIES_BY_PROVINCE).flat())
).sort();
