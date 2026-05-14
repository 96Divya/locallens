import fs from "node:fs/promises";
import path from "node:path";

const HOTEL_STATE_MAP = {
  delhi: "Delhi",
  bangalore: "Karnataka",
  chennai: "Tamil Nadu",
  hyderabad: "Telangana",
  kolkata: "West Bengal",
  mumbai: "Maharashtra",
};

const HOTEL_DETAIL_CITY_STATE = {
  agra: "Uttar Pradesh",
  lucknow: "Uttar Pradesh",
  kanpur: "Uttar Pradesh",
  aligarh: "Uttar Pradesh",
  ayodhya: "Uttar Pradesh",
  bareilly: "Uttar Pradesh",
  jaipur: "Rajasthan",
  ajmer: "Rajasthan",
  alwar: "Rajasthan",
  jodhpur: "Rajasthan",
  "mount abu": "Rajasthan",
  "abu road": "Rajasthan",
  bangalore: "Karnataka",
  mumbai: "Maharashtra",
  pune: "Maharashtra",
  alibag: "Maharashtra",
  aurangabad: "Maharashtra",
  nagpur: "Maharashtra",
  nashik: "Maharashtra",
  chennai: "Tamil Nadu",
  hyderabad: "Telangana",
  kolkata: "West Bengal",
  ahmedabad: "Gujarat",
  anand: "Gujarat",
  disa: "Gujarat",
  palanpur: "Gujarat",
  surat: "Gujarat",
  vadodara: "Gujarat",
  cochin: "Kerala",
  ernakulam: "Kerala",
  alleppey: "Kerala",
  visakhapatnam: "Andhra Pradesh",
  bhopal: "Madhya Pradesh",
  indore: "Madhya Pradesh",
  amritsar: "Punjab",
  chandigarh: "Chandigarh",
  banjar: "Himachal Pradesh",
};

const STATE_RESTAURANT_CITIES = {
  Delhi: ["Delhi", "Noida", "Ghaziabad", "Gurgaon"],
  Karnataka: ["Bangalore"],
  "Tamil Nadu": ["Chennai"],
  Telangana: ["Hyderabad"],
  "West Bengal": ["Kolkata"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Gujarat: ["Ahmedabad", "Vadodara", "Surat"],
  Rajasthan: ["Jaipur", "Udaipur"],
  Chandigarh: ["Chandigarh"],
  Goa: ["Goa"],
  Kerala: ["Kochi"],
  Punjab: ["Ludhiana", "Chandigarh"],
  "Uttar Pradesh": ["Lucknow", "Agra", "Noida", "Ghaziabad"],
  "Madhya Pradesh": ["Indore"],
};

const STATE_FOODS = {
  Delhi: [
    { name: "Chole Bhature", where: "Sitaram Diwan Chand, Paharganj", description: "Big, fluffy bhature with spicy chickpeas for a full sightseeing day.", price: "Rs 120-220", emoji: "🍽️", mustTry: true },
    { name: "Butter Chicken", where: "Daryaganj or Pandara Road", description: "A classic Delhi dinner when you want something rich after a long city walk.", price: "Rs 350-650", emoji: "🍛", mustTry: true },
    { name: "Daulat Ki Chaat", where: "Old Delhi winter lanes", description: "A seasonal sweet foam that feels very local and hard to find outside Delhi.", price: "Rs 80-150", emoji: "🍨", mustTry: false },
    { name: "Paranthe", where: "Paranthe Wali Gali", description: "Stuffed breads with pickle and sabzi, ideal for a heritage-morning breakfast.", price: "Rs 100-220", emoji: "🥙", mustTry: false },
  ],
  Karnataka: [
    { name: "Bisi Bele Bath", where: "MTR or CTR Bengaluru", description: "Comforting rice-lentil meal that works well for a moderate budget day.", price: "Rs 120-240", emoji: "🍲", mustTry: true },
    { name: "Mysore Masala Dosa", where: "Vidyarthi Bhavan or local darshini", description: "Crisp dosa with chutney and spice, easy to fit into any city itinerary.", price: "Rs 80-180", emoji: "🥞", mustTry: true },
    { name: "Filter Coffee", where: "Neighborhood coffee house", description: "A quick recharge between museum stops, markets, and evening walks.", price: "Rs 30-90", emoji: "☕", mustTry: false },
    { name: "Donne Biryani", where: "Military hotels in Bengaluru", description: "Peppery biryani served in leaf bowls and loved by locals.", price: "Rs 180-320", emoji: "🍚", mustTry: false },
  ],
  "Tamil Nadu": [
    { name: "Filter Coffee", where: "Mylapore cafe circuit", description: "The easiest local ritual to add to a Chennai morning.", price: "Rs 30-80", emoji: "☕", mustTry: true },
    { name: "Chettinad Curry", where: "Traditional Chettinad restaurant", description: "Bold spice profile that suits travelers who want a proper regional meal.", price: "Rs 260-520", emoji: "🍛", mustTry: true },
    { name: "Kothu Parotta", where: "Late-night local stalls", description: "A filling evening plate after beach walks or temple hopping.", price: "Rs 140-240", emoji: "🥘", mustTry: false },
    { name: "Sundal", where: "Marina Beach vendors", description: "Simple beach-side snack that fits a budget-friendly food stop.", price: "Rs 40-80", emoji: "🥜", mustTry: false },
  ],
  Telangana: [
    { name: "Hyderabadi Biryani", where: "Shah Ghouse or Paradise area", description: "The obvious anchor meal for a Hyderabad trip and worth planning around.", price: "Rs 220-480", emoji: "🍚", mustTry: true },
    { name: "Irani Chai", where: "Old City cafes", description: "Pairs perfectly with a Charminar-area evening and quick snack break.", price: "Rs 30-70", emoji: "☕", mustTry: true },
    { name: "Osmania Biscuit", where: "Bakery near Abids or old cafes", description: "Local tea-time classic that is easy to carry between stops.", price: "Rs 20-60", emoji: "🍪", mustTry: false },
    { name: "Haleem", where: "Seasonal ramzan stalls", description: "Best when in season and great for travelers chasing iconic city flavors.", price: "Rs 160-320", emoji: "🥣", mustTry: false },
  ],
  Maharashtra: [
    { name: "Vada Pav", where: "Ashok Vada Pav or local stalls", description: "Fast, cheap, and perfect for a packed Mumbai day.", price: "Rs 25-70", emoji: "🍔", mustTry: true },
    { name: "Bombay Sandwich", where: "Churchgate or roadside stalls", description: "A light lunch pick between museums, promenades, and shopping streets.", price: "Rs 80-160", emoji: "🥪", mustTry: false },
    { name: "Misal Pav", where: "Maharashtrian breakfast joints", description: "Spicy and energizing for travelers who like bold flavors.", price: "Rs 90-180", emoji: "🥘", mustTry: true },
    { name: "Seafood Thali", where: "Coastal Maharashtrian kitchen", description: "A stronger dinner option if the trip includes the Konkan mood.", price: "Rs 350-850", emoji: "🐟", mustTry: false },
  ],
  "West Bengal": [
    { name: "Kathi Roll", where: "Park Street", description: "A practical walk-and-eat classic for a Kolkata city circuit.", price: "Rs 100-220", emoji: "🌯", mustTry: true },
    { name: "Kosha Mangsho", where: "Traditional Bengali restaurant", description: "Rich slow-cooked meat curry for a fuller evening meal.", price: "Rs 280-520", emoji: "🍛", mustTry: true },
    { name: "Misti Doi", where: "Neighborhood sweet shop", description: "Sweet finish that brings a softer side of the city into the plan.", price: "Rs 40-120", emoji: "🍮", mustTry: false },
    { name: "Puchka", where: "Street stalls near markets", description: "Best for a lively snack stop when the traveler wants local street flavor.", price: "Rs 40-90", emoji: "🥣", mustTry: false },
  ],
};

const REGION_FOODS = {
  North: [
    { name: "Stuffed Paratha", where: "Local breakfast dhaba", description: "Reliable, filling, and easy to build into an early sightseeing schedule.", price: "Rs 70-180", emoji: "🥙", mustTry: true },
    { name: "Lassi", where: "Market-side dairy shop", description: "Cooling drink for long afternoons in busy bazaars and old quarters.", price: "Rs 50-140", emoji: "🥛", mustTry: false },
  ],
  South: [
    { name: "Idli Sambar", where: "Neighborhood tiffin spot", description: "Simple, affordable, and travel-friendly for almost any South India route.", price: "Rs 50-140", emoji: "🍽️", mustTry: true },
    { name: "Banana Leaf Meal", where: "Popular local mess", description: "A good lunch anchor when you want one proper regional meal.", price: "Rs 140-320", emoji: "🍛", mustTry: false },
  ],
  West: [
    { name: "Thali", where: "Well-rated local restaurant", description: "Balanced meal with enough variety for travelers trying local staples quickly.", price: "Rs 180-420", emoji: "🍱", mustTry: true },
    { name: "Street Chaat", where: "City market lanes", description: "Works well as an evening snack stop near crowded landmarks.", price: "Rs 50-140", emoji: "🥗", mustTry: false },
  ],
  East: [
    { name: "Fish Curry Meal", where: "Local family restaurant", description: "Good fit for travelers who want a regional lunch instead of generic menus.", price: "Rs 220-420", emoji: "🐟", mustTry: true },
    { name: "Sweet Shop Sampling", where: "Heritage mithai store", description: "An easy cultural stop that doubles as a souvenir break.", price: "Rs 80-180", emoji: "🍬", mustTry: false },
  ],
  Northeast: [
    { name: "Smoked Pork Plate", where: "Community kitchen or local restaurant", description: "A stronger regional dish that makes the trip feel distinct from mainstream circuits.", price: "Rs 220-460", emoji: "🍖", mustTry: true },
    { name: "Tea and Snacks", where: "Hill-town cafe", description: "Useful for slower scenic days with shorter attraction hours.", price: "Rs 80-160", emoji: "🍵", mustTry: false },
  ],
  Central: [
    { name: "Poha-Jalebi", where: "Breakfast market", description: "Classic central India start that suits morning departures and town exploration.", price: "Rs 60-140", emoji: "🍽️", mustTry: true },
    { name: "Regional Thali", where: "Town-center restaurant", description: "Easy way to cover multiple local flavors without overcomplicating the food plan.", price: "Rs 160-320", emoji: "🍱", mustTry: false },
  ],
  Islands: [
    { name: "Fresh Seafood", where: "Beachside shack", description: "Works best as a sunset dinner plan near the water.", price: "Rs 300-850", emoji: "🦐", mustTry: true },
    { name: "Tender Coconut", where: "Beach kiosk", description: "Useful hydration stop for humid island itineraries.", price: "Rs 40-90", emoji: "🥥", mustTry: false },
  ],
};

const BUDGET_CONFIG = {
  budget: { dailyFood: [350, 800], dailyActivities: [200, 500], transportPerHop: [80, 250], stayLabel: "Budget / hostel / guesthouse" },
  moderate: { dailyFood: [900, 1800], dailyActivities: [400, 1200], transportPerHop: [250, 900], stayLabel: "Mid-range hotel / boutique stay" },
  luxury: { dailyFood: [1800, 3500], dailyActivities: [1200, 3000], transportPerHop: [900, 2500], stayLabel: "Premium hotel / resort" },
};

const STYLE_THEMES = {
  explorer: ["local neighborhoods", "slow discovery", "culture"],
  adventurer: ["outdoors", "scenic detours", "active travel"],
  foodie: ["markets", "regional food", "street-side finds"],
  spiritual: ["sacred spaces", "quiet moments", "heritage"],
};

const LOCAL_PHRASES = {
  Delhi: [
    { phrase: "Namaste", meaning: "Hello", language: "Hindi" },
    { phrase: "Kitna hai?", meaning: "How much is it?", language: "Hindi" },
  ],
  Karnataka: [
    { phrase: "Namaskara", meaning: "Hello", language: "Kannada" },
    { phrase: "Eshtu?", meaning: "How much?", language: "Kannada" },
  ],
  "Tamil Nadu": [
    { phrase: "Vanakkam", meaning: "Hello", language: "Tamil" },
    { phrase: "Nandri", meaning: "Thank you", language: "Tamil" },
  ],
  Telangana: [
    { phrase: "Namaskaram", meaning: "Hello", language: "Telugu" },
    { phrase: "Dhanyavadamulu", meaning: "Thank you", language: "Telugu" },
  ],
  Maharashtra: [
    { phrase: "Namaskar", meaning: "Hello", language: "Marathi" },
    { phrase: "Dhanyavaad", meaning: "Thank you", language: "Marathi" },
  ],
  "West Bengal": [
    { phrase: "Nomoshkar", meaning: "Hello", language: "Bengali" },
    { phrase: "Dhonnobad", meaning: "Thank you", language: "Bengali" },
  ],
};

const PACKING_BY_REGION = {
  North: ["Light layers", "Comfortable walking shoes", "Reusable water bottle", "Sunscreen", "ID copies"],
  South: ["Cotton clothes", "Umbrella", "Walking sandals", "Water bottle", "Sunscreen"],
  West: ["Cap", "Breathable clothes", "Power bank", "Walking shoes", "Water bottle"],
  East: ["Rain layer", "Comfortable footwear", "Mosquito repellent", "Water bottle", "Cash for local markets"],
  Northeast: ["Warm layer", "Rain jacket", "Good walking shoes", "Offline maps", "ID copies"],
  Central: ["Sun protection", "Walking shoes", "Light scarf", "Water bottle", "Power bank"],
  Islands: ["Quick-dry clothes", "Flip-flops", "Sunscreen", "Hat", "Dry bag"],
};

export function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(current);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    row.push(current);
    if (row.some((value) => value !== "")) rows.push(row);
  }

  if (!rows.length) return [];
  const headers = rows[0].map((header, index) => header || `column_${index}`);
  return rows.slice(1).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
}

export function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function toNumber(value) {
  const cleaned = String(value || "").replace(/[^0-9.]/g, "");
  return cleaned ? Number(cleaned) : null;
}

function formatRange(min, max, suffix = "") {
  return `Rs ${Math.round(min)}-${Math.round(max)}${suffix}`;
}

function estimateHotelPrice(rating) {
  if (rating >= 8.7) return 6500;
  if (rating >= 8.1) return 4500;
  if (rating >= 7.3) return 2800;
  if (rating >= 6.5) return 1800;
  return 1200;
}

function titleCase(value) {
  return String(value || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function cuisineEmoji(cuisineText) {
  const text = normalizeText(cuisineText);
  if (text.includes("biryani") || text.includes("north indian")) return "🍛";
  if (text.includes("cafe") || text.includes("coffee")) return "☕";
  if (text.includes("seafood")) return "🐟";
  if (text.includes("dessert") || text.includes("bakery")) return "🍨";
  if (text.includes("chinese") || text.includes("asian")) return "🥢";
  if (text.includes("italian") || text.includes("pizza")) return "🍝";
  if (text.includes("street") || text.includes("fast food")) return "🍔";
  return "🍽️";
}

function getStateFoods(stateName, regionName) {
  return STATE_FOODS[stateName] || REGION_FOODS[regionName] || REGION_FOODS.North;
}

function getLocalPhrases(stateName, regionName) {
  return LOCAL_PHRASES[stateName] || [
    { phrase: "Namaste", meaning: "Hello", language: regionName === "South" ? "Regional language" : "Hindi" },
    { phrase: "Shukriya", meaning: "Thank you", language: "Hindi / Urdu" },
  ];
}

function findAttractionRow(placeName, stateRows) {
  const target = normalizeText(placeName);
  return (
    stateRows.find((row) => normalizeText(row.Name) === target) ||
    stateRows.find((row) => normalizeText(row.City) === target) ||
    stateRows.find((row) => normalizeText(row.Name).includes(target) || target.includes(normalizeText(row.Name)))
  );
}

function chooseHotels(hotels, budgetKey) {
  if (!hotels.length) return [];

  const sorted = [...hotels]
    .map((hotel) => ({
      ...hotel,
      numericPrice: toNumber(hotel.Price),
      numericTax: toNumber(hotel.Tax) || 0,
      numericRating: toNumber(hotel.Rating) || 0,
    }))
    .filter((hotel) => hotel.numericPrice)
    .sort((a, b) => {
      if (budgetKey === "budget") return a.numericPrice - b.numericPrice;
      if (budgetKey === "luxury") return b.numericPrice - a.numericPrice;
      const mid = 4500;
      return Math.abs(a.numericPrice - mid) - Math.abs(b.numericPrice - mid);
    })
    .slice(0, 3);

  return sorted.map((hotel, index) => ({
    name: hotel["Hotel Name"],
    type: budgetKey === "budget" ? "Budget" : budgetKey === "luxury" ? "Luxury" : index === 0 ? "Mid-range" : "Boutique",
    location: hotel.Location || "Prime area",
    price: hotel.PriceNote || formatRange(hotel.numericPrice, hotel.numericPrice + hotel.numericTax, "/night"),
    highlight: hotel["Nearest Landmark"]
      ? `Close to ${hotel["Nearest Landmark"]} with ${hotel["Rating Description"]?.toLowerCase() || "solid"} guest feedback.`
      : `A practical ${budgetKey} pick with ${String(hotel.Reviews || "many").replace(/\s*reviews?$/i, "")} reviews and a ${hotel.Rating || "good"} rating${hotel.Source ? ` from ${hotel.Source}` : ""}.`,
    emoji: budgetKey === "luxury" ? "🏨" : budgetKey === "budget" ? "🛏️" : "🏠",
    rating: hotel.RatingScale ? `${hotel.Rating || "8.0"}/${hotel.RatingScale}` : `${hotel.Rating || "4.0"}/5`,
  }));
}

function stateFromHotelPlace(place) {
  const normalizedPlace = normalizeText(place);
  const match = Object.entries(HOTEL_DETAIL_CITY_STATE).find(([city]) => normalizedPlace.includes(city));
  return match?.[1] || "";
}

function normalizeHotelDetailRows(rows) {
  return rows
    .map((row) => {
      const state = stateFromHotelPlace(row.Place);
      const rating = toNumber(row.Rating);
      const estimatedPrice = estimateHotelPrice(rating || 0);
      return {
        "Hotel Name": row["Hotel Name"],
        State: state,
        Location: row.Place,
        Rating: rating ? String(rating) : "",
        RatingScale: "10",
        "Rating Description": row.Condition,
        Reviews: row["Total Reviews"],
        Price: String(estimatedPrice),
        Tax: "0",
        PriceNote: `Estimated Rs ${Math.round(estimatedPrice * 0.8)}-${Math.round(estimatedPrice * 1.25)}/night`,
        Source: "hotel_details.csv",
        Description: row.description,
      };
    })
    .filter((row) => row.State && row["Hotel Name"]);
}

function fallbackHotels(stateName, selectedPlaces, budgetKey) {
  const basePlace = selectedPlaces[0] || stateName;
  const stayTypes = {
    budget: [
      ["Budget guesthouse", 900, 1800, "A simple stay near the main transit or market area."],
      ["Backpacker hostel", 700, 1400, "Useful for short stays, solo travelers, and flexible check-ins."],
      ["Family lodge", 1100, 2200, "Practical rooms with easy access to the first sightseeing cluster."],
    ],
    moderate: [
      ["Mid-range hotel", 2500, 5200, "Balanced comfort close to restaurants and transport."],
      ["Boutique homestay", 2200, 4800, "A warmer local base with breakfast-style convenience."],
      ["Heritage-style stay", 3200, 6500, "Good for slower evenings after sightseeing-heavy days."],
    ],
    luxury: [
      ["Premium hotel", 7000, 14000, "A higher-comfort base with stronger service and easier transfers."],
      ["Resort stay", 8500, 18000, "Best when the trip needs downtime between attractions."],
      ["Luxury boutique stay", 9500, 22000, "A polished option for a more memorable final night."],
    ],
  };

  return (stayTypes[budgetKey] || stayTypes.moderate).map(([type, min, max, highlight], index) => ({
    name: `${stateName} ${type}`,
    type: type.replace(/\b\w/g, (char) => char.toUpperCase()),
    location: index === 0 ? basePlace : selectedPlaces[index] || "Central stay area",
    price: formatRange(min, max, "/night"),
    highlight,
    emoji: budgetKey === "luxury" ? "🏨" : budgetKey === "budget" ? "🛏️" : "🏠",
    rating: "Estimated",
  }));
}

function chooseRestaurants({ restaurants, stateName, selectedPlaces, stateInfo, budgetKey, styleKey }) {
  const budgetCap = budgetKey === "budget" ? 900 : budgetKey === "moderate" ? 2000 : 100000;
  const cityCandidates = [
    ...(STATE_RESTAURANT_CITIES[stateName] || []),
    ...selectedPlaces,
    ...(stateInfo?.places || []).slice(0, 6),
  ]
    .map((item) => normalizeText(item))
    .filter(Boolean);

  const matchingRestaurants = restaurants
    .map((row) => ({
      ...row,
      numericRating: toNumber(row.Rating) || 0,
      numericVotes: toNumber(row.Votes) || 0,
      numericCost: toNumber(row.Cost) || 0,
    }))
    .filter((row) => {
      const city = normalizeText(row.City);
      const locality = normalizeText(row.Locality);
      const location = normalizeText(row.Location);
      return cityCandidates.some(
        (candidate) =>
          city === candidate ||
          locality.includes(candidate) ||
          location.includes(candidate) ||
          candidate.includes(city),
      );
    })
    .filter((row) => row.numericCost > 0 && row.numericCost <= budgetCap + (budgetKey === "luxury" ? 4000 : 800))
    .sort((a, b) => {
      const styleBoostA = styleKey === "foodie" && normalizeText(a.Cuisine).includes("street") ? 1 : 0;
      const styleBoostB = styleKey === "foodie" && normalizeText(b.Cuisine).includes("street") ? 1 : 0;
      return (b.numericRating + styleBoostB + b.numericVotes / 10000) - (a.numericRating + styleBoostA + a.numericVotes / 10000);
    })
    .slice(0, 4);

  if (!matchingRestaurants.length) return [];

  return matchingRestaurants.map((restaurant, index) => {
    const cuisines = String(restaurant.Cuisine || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const primaryCuisine = cuisines[0] || "Multi-cuisine";
    return {
      name: primaryCuisine,
      where: `${restaurant.Name}, ${restaurant.City}`,
      description: `${restaurant.Name} in ${restaurant.Locality?.trim() || restaurant.City} is rated ${restaurant.Rating}/5 and is known for ${cuisines.slice(0, 3).join(", ").toLowerCase() || "regional favorites"}.`,
      price: formatRange(Math.max(100, restaurant.numericCost * 0.6), restaurant.numericCost),
      emoji: cuisineEmoji(primaryCuisine),
      mustTry: index < 2 || restaurant.numericRating >= 4.3,
    };
  });
}

export async function trainModel({ dataDir, outputPath }) {
  const topPlacesPath = path.join(dataDir, "top-places.csv");
  const restaurantsPath = path.join(dataDir, "restaurants.csv");
  const hotelDetailsPath = path.join(dataDir, "hotel_details.csv");
  const topPlaces = parseCsv(await fs.readFile(topPlacesPath, "utf8"));
  const restaurants = parseCsv(await fs.readFile(restaurantsPath, "utf8"));
  const hotelDetails = await fs
    .readFile(hotelDetailsPath, "utf8")
    .then((text) => normalizeHotelDetailRows(parseCsv(text)))
    .catch(() => []);

  const attractionsByState = {};
  for (const row of topPlaces) {
    const state = row.State;
    if (!state) continue;
    if (!attractionsByState[state]) attractionsByState[state] = [];
    attractionsByState[state].push(row);
  }

  const restaurantsByCity = {};
  for (const row of restaurants) {
    const city = row.City?.trim();
    if (!city) continue;
    if (!restaurantsByCity[city]) restaurantsByCity[city] = [];
    restaurantsByCity[city].push(row);
  }

  const hotelsByState = {};
  for (const [datasetName, stateName] of Object.entries(HOTEL_STATE_MAP)) {
    const hotelPath = path.join(dataDir, `${datasetName}.csv`);
    const hotelRows = parseCsv(await fs.readFile(hotelPath, "utf8"));
    hotelsByState[stateName] = hotelRows;
  }

  for (const row of hotelDetails) {
    if (!hotelsByState[row.State]) hotelsByState[row.State] = [];
    hotelsByState[row.State].push(row);
  }

  const model = {
    generatedAt: new Date().toISOString(),
    stats: {
      stateCount: Object.keys(attractionsByState).length,
      restaurantCityCount: Object.keys(restaurantsByCity).length,
      hotelStateCount: Object.keys(hotelsByState).length,
      hotelDetailsCount: hotelDetails.length,
    },
    attractionsByState,
    restaurantsByCity,
    hotelsByState,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(model, null, 2), "utf8");
  return model;
}

export async function loadModel(modelPath) {
  return JSON.parse(await fs.readFile(modelPath, "utf8"));
}

export function buildTripPlan({
  model,
  stateName,
  selectedPlaces = [],
  days,
  budgetKey,
  styleKey,
  stateInfo,
  hiddenExtra = [],
}) {
  const attractionRows = model.attractionsByState[stateName] || [];
  const restaurantCities = STATE_RESTAURANT_CITIES[stateName] || [];
  const restaurantRows = restaurantCities.flatMap((city) => model.restaurantsByCity[city] || []);
  const hotelRows = model.hotelsByState[stateName] || [];
  const budgetInfo = BUDGET_CONFIG[budgetKey] || BUDGET_CONFIG.moderate;
  const themes = STYLE_THEMES[styleKey] || STYLE_THEMES.explorer;
  const chosenPlaces = selectedPlaces.length ? selectedPlaces : (stateInfo?.places || []).slice(0, Math.min(days + 2, 5));

  const rankedAttractions = chosenPlaces.map((place, index) => {
    const row = findAttractionRow(place, attractionRows);
    const hours = toNumber(row?.["time needed to visit in hrs"]) || (index % 2 === 0 ? 2.5 : 1.5);
    const rating = toNumber(row?.["Google review rating"]) || 4.3;
    return {
      name: place,
      city: row?.City || stateName,
      type: row?.Type || "Sightseeing",
      significance: row?.Significance || "Local favorite",
      bestTime: row?.["Best Time to visit"] || "Morning",
      rating,
      hours,
    };
  });

  const fallbackAttractions = attractionRows
    .map((row) => ({
      name: row.Name,
      city: row.City,
      type: row.Type,
      significance: row.Significance,
      bestTime: row["Best Time to visit"],
      rating: toNumber(row["Google review rating"]) || 4.1,
      hours: toNumber(row["time needed to visit in hrs"]) || 2,
    }))
    .filter((item) => !chosenPlaces.some((place) => normalizeText(place) === normalizeText(item.name)))
    .sort((a, b) => b.rating - a.rating);

  const itineraryPool = [...rankedAttractions, ...fallbackAttractions].slice(0, Math.max(days * 2, 6));
  const foods = chooseRestaurants({
    restaurants: restaurantRows,
    stateName,
    selectedPlaces: chosenPlaces,
    stateInfo,
    budgetKey,
    styleKey,
  });
  const finalFoods = foods.length ? foods : getStateFoods(stateName, stateInfo?.region).slice(0, 4);
  const hotels = chooseHotels(hotelRows, budgetKey);
  const finalHotels = hotels.length ? hotels : fallbackHotels(stateName, chosenPlaces, budgetKey);
  const hidden = hiddenExtra.slice(0, 4).map((name, index) => ({
    name,
    why: `Less crowded than the headline spots and a strong match for a ${themes[0]}-first trip through ${stateName}.`,
    bestTime: index % 2 === 0 ? "Early morning" : "Late afternoon",
    emoji: "💎",
  }));

  const dayPlans = Array.from({ length: days }, (_, index) => {
    const morning = itineraryPool[(index * 2) % itineraryPool.length];
    const afternoon = itineraryPool[(index * 2 + 1) % itineraryPool.length];
    const eveningFood = finalFoods[index % finalFoods.length];
    const titlePlace = morning?.city && morning.city !== stateName ? morning.city : morning?.name || stateName;

    return {
      day: index + 1,
      title: `Day ${index + 1} in ${titleCase(titlePlace)}`,
      theme: themes[index % themes.length],
      morning: {
        activity: morning?.name || chosenPlaces[index % chosenPlaces.length] || stateName,
        description: `${morning?.type || "Sightseeing"} stop with ${morning?.significance?.toLowerCase() || "strong local appeal"} in ${morning?.city || stateName}. Start here when the light is softer and queues are shorter.`,
        tip: `Best visited in the ${String(morning?.bestTime || "morning").toLowerCase()} with about ${morning?.hours || 2} hours set aside.`,
        duration: `${Math.max(1, Math.round(morning?.hours || 2))} hrs`,
      },
      afternoon: {
        activity: afternoon?.name || stateInfo?.places?.[(index + 1) % stateInfo.places.length] || stateName,
        description: `Use the afternoon for ${afternoon?.type?.toLowerCase() || "another key attraction"} and keep transit short by staying around ${afternoon?.city || stateName}. This keeps the plan realistic instead of overpacked.`,
        tip: "Pair this stop with a short chai or snack break before moving again.",
        duration: `${Math.max(1, Math.round(afternoon?.hours || 2))} hrs`,
      },
      evening: {
        activity: `${eveningFood.name} + easy local walk`,
        description: `Wind down with ${eveningFood.name.toLowerCase()} around ${eveningFood.where}. This gives the itinerary a softer local finish instead of ending with another rushed attraction.`,
        tip: "Keep evenings flexible for shopping streets, waterfronts, or heritage lighting.",
        duration: "2-3 hrs",
      },
    };
  });

  const accommodationSource = finalHotels.length
    ? finalHotels.reduce(
        (acc, hotel) => {
          const [min, max] = hotel.price.match(/\d+/g)?.map(Number) || [0, 0];
          return { min: Math.min(acc.min, min), max: Math.max(acc.max, max) };
        },
        { min: Number.POSITIVE_INFINITY, max: 0 },
      )
    : { min: budgetKey === "budget" ? 900 : budgetKey === "luxury" ? 7000 : 2500, max: budgetKey === "budget" ? 1800 : budgetKey === "luxury" ? 14000 : 5500 };

  const nights = Math.max(days - 1, 0);
  const transportMin = budgetInfo.transportPerHop[0] * Math.max(days - 1, 1);
  const transportMax = budgetInfo.transportPerHop[1] * Math.max(days, 1);

  return {
    headline: `${stateName} for ${days} days, designed around real local picks`,
    tagline: `This trip keeps your plan rooted in ${String(stateInfo?.tagline || stateName).toLowerCase()} while staying realistic on time and budget. It mixes headline attractions with lighter local moments so the journey feels personal, not copy-pasted.`,
    weatherNote: `Best plan rhythm: follow ${String(stateInfo?.region || "regional").toLowerCase()} travel timing, start major sightseeing early, and leave room for weather and traffic shifts.`,
    days: dayPlans,
    food: finalFoods,
    hotels: finalHotels,
    transport: [
      {
        mode: budgetKey === "budget" ? "Metro / bus / auto" : budgetKey === "luxury" ? "Private cab" : "Metro + cab mix",
        from: "Arrival point",
        to: chosenPlaces[0] || stateName,
        detail: "Start with the most efficient city transfer and cluster nearby stops on the same day to save time and money.",
        cost: formatRange(budgetInfo.transportPerHop[0], budgetInfo.transportPerHop[1]),
        emoji: budgetKey === "luxury" ? "🚖" : "🚌",
        duration: "30 mins-2 hrs",
      },
      {
        mode: "Local transit",
        from: chosenPlaces[0] || stateName,
        to: chosenPlaces[1] || "Food and market circuit",
        detail: "Keep afternoon transfers short and avoid zig-zag routing across the city or state.",
        cost: formatRange(budgetInfo.transportPerHop[0], budgetInfo.transportPerHop[1]),
        emoji: "🚇",
        duration: "20 mins-1.5 hrs",
      },
    ],
    hiddenGems: hidden,
    packingEssentials: PACKING_BY_REGION[stateInfo?.region] || PACKING_BY_REGION.North,
    localPhrases: getLocalPhrases(stateName, stateInfo?.region),
    budgetSummary: {
      accommodation: formatRange(accommodationSource.min, accommodationSource.max, "/night"),
      food: formatRange(budgetInfo.dailyFood[0], budgetInfo.dailyFood[1], "/day"),
      transport: formatRange(transportMin, transportMax, " total"),
      activities: formatRange(budgetInfo.dailyActivities[0], budgetInfo.dailyActivities[1], "/day"),
      total: formatRange(
        accommodationSource.min * nights + budgetInfo.dailyFood[0] * days + transportMin + budgetInfo.dailyActivities[0] * days,
        accommodationSource.max * nights + budgetInfo.dailyFood[1] * days + transportMax + budgetInfo.dailyActivities[1] * days,
        ` for ${days} days`,
      ),
    },
    modelInfo: {
      generatedAt: model.generatedAt,
      stats: model.stats,
    },
  };
}
