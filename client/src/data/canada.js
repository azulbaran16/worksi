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
    "Toronto", "Mississauga", "Brampton", "Hamilton", "Ottawa", "London", "Markham",
    "Vaughan", "Kitchener", "Windsor", "Richmond Hill", "Oakville", "Burlington",
    "Oshawa", "Barrie", "Guelph", "Cambridge", "Whitby", "Ajax", "Pickering",
    "Milton", "Brantford", "Niagara Falls", "St. Catharines", "Kingston",
  ],
  BC: [
    "Vancouver", "Surrey", "Burnaby", "Richmond", "Abbotsford", "Coquitlam",
    "Langley", "Delta", "Kelowna", "Victoria", "Nanaimo", "Kamloops", "Chilliwack",
    "Maple Ridge", "New Westminster", "Port Coquitlam",
  ],
  AB: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert", "Medicine Hat", "Airdrie"],
  QC: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Lévis"],
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
