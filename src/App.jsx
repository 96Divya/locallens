import { useEffect, useState, useMemo, useRef } from "react";

const SEA = "#2A9D8F";
const SEA_D = "#1B7A6E";
const SEA_L = "#E6F5F1";
const BLUSH = "#F4A7B9";
const BLUSH_D = "#E0758F";
const BLUSH_L = "#FDE8EF";
const BG = "#F0FAF8";
const WHITE = "#FFFFFF";
const TXT = "#1A2E2B";
const TXT_M = "#4A6B66";
const TXT_L = "#7A9E99";
const BDR = "rgba(42,157,143,0.18)";
const BDR_B = "rgba(244,167,185,0.3)";

const INDIA = {
  "Jammu & Kashmir": { emoji: "🏔️", region: "North", tagline: "Heaven on Earth", places: ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg", "Dal Lake", "Yusmarg", "Vaishno Devi", "Patnitop", "Doodhpathri", "Betaab Valley", "Aru Valley", "Wular Lake", "Verinag", "Achabal", "Kokernag", "Charar-i-Sharief", "Gurez Valley", "Lolab Valley", "Bangus Valley", "Naranag Ruins"] },
  "Ladakh": { emoji: "☀️", region: "North", tagline: "Land of High Passes", places: ["Leh", "Pangong Lake", "Nubra Valley", "Turtuk", "Diskit", "Hemis Monastery", "Khardung La", "Zanskar Valley", "Hanle", "Magnetic Hill", "Lamayuru", "Alchi Monastery", "Sham Valley", "Aryan Valley (Dah Hanu)", "Kargil", "Drass", "Suru Valley", "Padum", "Phugtal Monastery", "Rangdum"] },
  "Himachal Pradesh": { emoji: "🌲", region: "North", tagline: "Land of Snow-Capped Gods", places: ["Shimla", "Manali", "Dharamshala", "Kasauli", "Dalhousie", "Spiti Valley", "Bir Billing", "Kullu", "Chail", "Kinnaur", "Chitkul", "Kalpa", "Sangla Valley", "Tirthan Valley", "Jibhi", "Sarahan", "Narkanda", "Barot", "Prashar Lake", "Lahaul & Pangi Valley"] },
  "Uttarakhand": { emoji: "🕉️", region: "North", tagline: "Devbhoomi – Land of Gods", places: ["Rishikesh", "Haridwar", "Mussoorie", "Nainital", "Jim Corbett", "Auli", "Lansdowne", "Chakrata", "Munsiyari", "Valley of Flowers", "Kedarnath", "Badrinath", "Gangotri", "Yamunotri", "Chopta", "Binsar", "Kausani", "Ranikhet", "Pithoragarh", "Jaunsar Bawar"] },
  "Uttar Pradesh": { emoji: "🛕", region: "Central", tagline: "Sacred rivers, royal cities and living heritage", places: ["Agra", "Varanasi", "Lucknow", "Ayodhya", "Mathura", "Vrindavan", "Prayagraj", "Sarnath", "Fatehpur Sikri", "Jhansi", "Noida", "Greater Noida", "Kanpur", "Meerut", "Aligarh", "Chitrakoot", "Kushinagar", "Dudhwa National Park", "Bithoor", "Bateshwar"] },
  "Punjab": { emoji: "🌾", region: "North", tagline: "Land of Five Rivers", places: ["Amritsar", "Chandigarh", "Patiala", "Anandpur Sahib", "Bathinda", "Kapurthala", "Tarn Taran", "Faridkot", "Sirhind", "Kiratpur Sahib"] },
  "Haryana": { emoji: "🏟️", region: "North", tagline: "Cradle of Civilization", places: ["Kurukshetra", "Sultanpur Bird Sanctuary", "Morni Hills", "Badhkal Lake", "Pinjore Gardens", "Damdama Lake", "Panipat", "Sohna", "Bhindawas Lake", "Surajkund"] },
  "Delhi": { emoji: "🏛️", region: "North", tagline: "Heart of India", places: ["Red Fort", "Qutub Minar", "India Gate", "Humayun's Tomb", "Lotus Temple", "Akshardham", "Chandni Chowk", "Lodhi Garden", "Hauz Khas Village", "Jama Masjid", "Raj Ghat", "Purana Qila", "Agrasen Ki Baoli", "Tughlaqabad Fort", "Mehrauli Village"] },
  "Chandigarh": { emoji: "🌹", region: "North", tagline: "The City Beautiful", places: ["Rock Garden", "Rose Garden", "Sukhna Lake", "Capitol Complex", "Leisure Valley", "Pinjore Garden", "Morni Hills", "Fateh Burj", "Chandigarh Museum"] },
  "Rajasthan": { emoji: "🏰", region: "West", tagline: "Land of Kings", places: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar", "Ranthambore", "Bundi", "Bikaner", "Chittorgarh", "Mount Abu", "Ajmer", "Sariska", "Shekhawati", "Osian", "Barmer", "Karauli", "Ranakpur", "Mandawa", "Abhaneri", "Gagron Fort"] },
  "Gujarat": { emoji: "🦁", region: "West", tagline: "Land of Legends", places: ["Rann of Kutch", "Gir Forest", "Ahmedabad", "Vadodara", "Dwarka", "Somnath", "Saputara", "Diu", "Polo Forest", "Patan", "Champaner", "Lothal", "Modhera", "Palitana", "Gondal", "Dholavira", "Mandvi", "Nal Sarovar", "Shoolpaneshwar", "Balasinor Fossil Park"] },
  "Maharashtra": { emoji: "🌊", region: "West", tagline: "Gateway of India", places: ["Mumbai", "Pune", "Aurangabad", "Lonavala", "Mahabaleshwar", "Matheran", "Kolhapur", "Nashik", "Alibaug", "Tarkarli", "Ajanta Caves", "Ellora Caves", "Sindhudurg", "Dapoli", "Amboli", "Panchgani", "Raigad Fort", "Bhimashankar", "Kaas Plateau", "Sandhan Valley"] },
  "Goa": { emoji: "🌴", region: "West", tagline: "Sun, Sand & Spice", places: ["Panaji", "Calangute", "Palolem", "Arambol", "Anjuna", "Colva", "Vagator", "Divar Island", "Old Goa", "Dudhsagar Falls", "Netravali", "Cotigao Sanctuary", "Cabo de Rama", "Galjibag Beach", "Polem Beach", "Tambdi Surla Temple", "Rivona Caves", "Agonda", "Bondla", "Mollem"] },
  "Madhya Pradesh": { emoji: "🐯", region: "Central", tagline: "Heart of India", places: ["Khajuraho", "Orchha", "Bandhavgarh", "Kanha", "Pench", "Bhopal", "Gwalior", "Ujjain", "Pachmarhi", "Mandu", "Jabalpur", "Sanchi", "Maheshwar", "Omkareshwar", "Amarkantak", "Chanderi", "Bhimbetka", "Satpura", "Chambal Ravines", "Bhedaghat"] },
  "Chhattisgarh": { emoji: "🌿", region: "Central", tagline: "Rice Bowl of India", places: ["Jagdalpur", "Chitrakote Falls", "Bastar Tribal Region", "Tirathgarh Falls", "Bhoramdeo Temple", "Kanger Valley", "Barnawapara", "Kanker", "Dantewada", "Mainpat", "Achanakmar", "Sirpur", "Ratanpur", "Kondagaon Tribal Villages", "Abhujmad Forest"] },
  "Jharkhand": { emoji: "⛏️", region: "Central", tagline: "Land of Forests", places: ["Ranchi", "Deoghar", "Hazaribagh", "Netarhat", "Betla National Park", "Parasnath Hill", "Hundru Falls", "Panchghagh Falls", "Rajrappa", "Baidyanath Dham", "Patratu Valley", "Lodh Falls", "Dalma Wildlife Sanctuary", "Topchanchi Lake", "Mccluskieganj"] },
  "West Bengal": { emoji: "🐅", region: "East", tagline: "Cultural Heartland", places: ["Darjeeling", "Kolkata", "Sundarbans", "Kalimpong", "Dooars", "Digha", "Bishnupur", "Murshidabad", "Shantiniketan", "Cooch Behar", "Mirik", "Sandakphu", "Gorumara", "Samsing", "Mandarmani", "Neora Valley", "Taki", "Bakkhali", "Purulia", "Jhargram"] },
  "Odisha": { emoji: "🛕", region: "East", tagline: "Soul of India", places: ["Bhubaneswar", "Puri", "Konark", "Chilika Lake", "Cuttack", "Simlipal", "Bhitarkanika", "Daringbadi", "Sambalpur", "Koraput", "Rayagada", "Kandhamal", "Jeypore", "Satkosia Gorge", "Khandadhar Falls", "Nandankanan", "Lalitgiri", "Ratnagiri", "Tikarpada", "Phulbani"] },
  "Bihar": { emoji: "☸️", region: "East", tagline: "Land of Buddha", places: ["Bodh Gaya", "Nalanda", "Patna", "Rajgir", "Vaishali", "Pawapuri", "Vikramshila", "Kesariya Stupa", "Sitamarhi", "Sasaram", "Bhagalpur", "Madhubani Art Villages", "Darbhanga", "Valmiki Nagar", "Lauriya Nandangarh"] },
  "Assam": { emoji: "🦏", region: "Northeast", tagline: "The Orchid State", places: ["Kaziranga", "Kamakhya Temple", "Majuli Island", "Sivasagar", "Tezpur", "Manas", "Pobitora", "Bhalukpong", "Haflong", "Dibru-Saikhowa", "Hoollongapar Gibbon Sanctuary", "Sualkuchi", "Diphu (Dima Hasao)", "Bodoland / Kokrajhar", "Raimona National Park"] },
  "Arunachal Pradesh": { emoji: "🌅", region: "Northeast", tagline: "Land of Rising Sun", places: ["Tawang", "Bomdila", "Ziro", "Pasighat", "Namdapha", "Along", "Itanagar", "Roing", "Dirang", "Mechuka", "Anini", "Dong (Easternmost Village)", "Walong", "Kibithu", "Kaho", "Tirap", "Longding", "Changlang", "Pakke", "Shergaon"] },
  "Meghalaya": { emoji: "☁️", region: "Northeast", tagline: "Abode of Clouds", places: ["Shillong", "Cherrapunji", "Mawlynnong", "Dawki", "Nongriat Root Bridges", "Mawsynram", "Jowai", "Tura", "Nongpoh", "Umiam Lake", "Laitlum Canyons", "Nohkalikai Falls", "Elephant Falls", "Balphakram", "Siju Cave", "Jaintia Hills", "Garo Hills", "Nongkhnum Island", "Mawphlang Sacred Grove", "Baghmara"] },
  "Nagaland": { emoji: "🎭", region: "Northeast", tagline: "Land of Festivals", places: ["Kohima", "Dimapur", "Dzukou Valley", "Khonoma Village", "Mon (Konyak Tribe)", "Hornbill Festival", "Tuensang", "Kiphire", "Mokokchung", "Wokha", "Phek", "Zunheboto", "Peren", "Meluri", "Shamator"] },
  "Manipur": { emoji: "💃", region: "Northeast", tagline: "Jewel of India", places: ["Imphal", "Loktak Lake", "Keibul Lamjao", "Moreh", "Ukhrul", "Senapati", "Kangla Fort", "Churachandpur", "Bishnupur", "Tamenglong", "Dzuko Valley", "Shirui Peak", "Nungba", "Chandel Hills", "Phangrei Plateau"] },
  "Mizoram": { emoji: "🦋", region: "Northeast", tagline: "Land of Blue Mountains", places: ["Aizawl", "Phawngpui Blue Mountain", "Champhai", "Lunglei", "Reiek Hill", "Tam Dil Lake", "Vantawng Falls", "Palak Lake", "Murlen National Park", "Dampa Tiger Reserve", "Serchhip", "Hmuifang"] },
  "Tripura": { emoji: "🏯", region: "Northeast", tagline: "Unexpected Backpacker Paradise", places: ["Agartala", "Ujjayanta Palace", "Neermahal", "Unakoti", "Sepahijala", "Jampui Hills", "Trishna Wildlife Sanctuary", "Kamalasagar", "Pilak", "Matabari", "Chabimura", "Dumboor Lake", "Rowa Wildlife", "Sipahijala"] },
  "Sikkim": { emoji: "🌸", region: "Northeast", tagline: "Kingdom in the Clouds", places: ["Gangtok", "Pelling", "Lachung", "Yumthang Valley", "Gurudongmar Lake", "Tsomgo Lake", "Ravangla", "Namchi", "Yuksom", "Zuluk", "Rinchenpong", "Tashiding", "Khecheopalri Lake", "Varsey Sanctuary", "Barsey", "Kaluk", "Dentam", "Soreng", "Dzongu", "West Sikkim Villages"] },
  "Tamil Nadu": { emoji: "🛕", region: "South", tagline: "Classical Civilization", places: ["Chennai", "Ooty", "Kodaikanal", "Madurai", "Mahabalipuram", "Thanjavur", "Rameswaram", "Kanyakumari", "Vellore", "Yelagiri", "Yercaud", "Trichy", "Chidambaram", "Kumbakonam", "Tranquebar", "Valparai", "Anamalai Hills", "Hogenakkal", "Pichavaram Mangroves", "Kolli Hills"] },
  "Kerala": { emoji: "🌿", region: "South", tagline: "God's Own Country", places: ["Munnar", "Alleppey", "Wayanad", "Kochi", "Thekkady", "Kovalam", "Varkala", "Thrissur", "Kozhikode (Malabar)", "Kumarakom", "Bekal", "Athirapilly", "Vagamon", "Nelliampathi Hills", "Silent Valley", "Parambikulam", "Pookode Lake", "Banasura Sagar", "Nilambur", "Attapadi Tribal"] },
  "Karnataka": { emoji: "🏛️", region: "South", tagline: "One State Many Worlds", places: ["Coorg", "Hampi", "Mysuru", "Chikmagalur", "Gokarna", "Sakleshpur", "Agumbe Rainforest", "Bangalore", "Badami–Aihole–Pattadakal", "Kabini", "Dandeli", "Jog Falls", "Udupi", "Belur & Halebidu", "Shravanabelagola", "Bijapur", "Bidar", "Kudremukh", "Yana Caves", "Devarayanadurga"] },
  "Andhra Pradesh": { emoji: "🌶️", region: "South", tagline: "The Rising State", places: ["Visakhapatnam", "Tirupati", "Vijayawada", "Araku Valley", "Horsley Hills", "Nagarjunasagar", "Srisailam", "Belum Caves", "Gandikota", "Lepakshi", "Amaravati", "Undavalli Caves", "Borra Caves", "Papikondalu", "Maredumilli", "Tada Falls", "Pulicat Lake", "Buddhist Rock-Cut Caves", "Rollapadu Bird Sanctuary", "Ananthagiri Hills"] },
  "Telangana": { emoji: "💎", region: "South", tagline: "The Emerging State", places: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Golconda Fort", "Charminar", "Hussain Sagar", "Ramappa Temple", "Bhongir Fort", "Yadadri", "Kuntala Falls", "Pocharam Sanctuary", "Kinnerasani", "Medak Cathedral", "Kolanupaka", "Alampur", "Keesaragutta", "Mallela Teertha Falls", "Nagarjunasagar", "Srisailam"] },
  "Andaman & Nicobar": { emoji: "🏝️", region: "Islands", tagline: "Jewel of Bay of Bengal", places: ["Port Blair", "Havelock Island", "Neil Island", "Radhanagar Beach", "Cellular Jail", "Barren Island", "Little Andaman", "Diglipur", "North Bay Island", "Ross Island", "Jolly Buoy Island", "Elephant Beach", "Baratang Limestone Caves", "Cinque Island", "Chidiya Tapu", "Mount Harriet", "Long Island", "Interview Island", "Passage Island", "Saddle Peak"] },
  "Lakshadweep": { emoji: "🐠", region: "Islands", tagline: "Azure Yonder", places: ["Kavaratti Island", "Agatti Island", "Bangaram Island", "Minicoy Island", "Amindivi Islands", "Kadmat Island", "Kalpeni Island", "Andrott Island", "Kiltan Island", "Bitra Island"] },
  "Puducherry": { emoji: "🇫🇷", region: "South", tagline: "French Riviera of the East", places: ["White Town Pondicherry", "Auroville", "Promenade Beach", "Paradise Beach", "Sri Aurobindo Ashram", "Serenity Beach", "Rock Beach", "Botanical Garden", "Ousteri Lake", "Karaikal", "Mahe", "Yanam", "Chunnambar Backwaters", "Tranquebar", "Arikamedu Roman Site"] },
  "Dadra & Nagar Haveli and Daman & Diu": { emoji: "⛵", region: "West", tagline: "Coastal forts, island beaches and forested escapes", places: ["Daman Fort", "Diu Fort", "Gangeshwar Temple", "Nagoa Beach", "Silvassa", "Tribal Museum Dadra", "Vanganga Lake", "Dudhni Lake", "Hirwavan Garden", "St Paul's Church Diu", "Jampore Beach", "Devka Beach", "Khanvel", "Satmaliya Deer Park"] },
};

const REGIONS = ["All", "North", "West", "Central", "East", "Northeast", "South", "Islands"];

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

const STYLE_THEMES = {
  explorer: ["local neighborhoods", "slow discovery", "culture"],
  adventurer: ["outdoors", "scenic detours", "active travel"],
  foodie: ["markets", "regional food", "street-side finds"],
  spiritual: ["sacred spaces", "quiet moments", "heritage"],
};

const BUDGET_CONFIG = {
  budget: { dailyFood: [350, 800], dailyActivities: [200, 500], transportPerHop: [80, 250], stayLabel: "Budget / hostel / guesthouse" },
  moderate: { dailyFood: [900, 1800], dailyActivities: [400, 1200], transportPerHop: [250, 900], stayLabel: "Mid-range hotel / boutique stay" },
  luxury: { dailyFood: [1800, 3500], dailyActivities: [1200, 3000], transportPerHop: [900, 2500], stayLabel: "Premium hotel / resort" },
};

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function toNumber(value) {
  const cleaned = String(value || "").replace(/[^0-9.]/g, "");
  return cleaned ? Number(cleaned) : null;
}

function formatRange(min, max, suffix = "") {
  return `Rs ${Math.round(min)}-${Math.round(max)}${suffix}`;
}

function titleCase(value) {
  return String(value || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function findAttractionRow(placeName, stateRows) {
  const target = normalizeText(placeName);
  return (
    stateRows.find((row) => normalizeText(row.Name) === target) ||
    stateRows.find((row) => normalizeText(row.City) === target) ||
    stateRows.find((row) => normalizeText(row.Name).includes(target) || target.includes(normalizeText(row.Name)))
  );
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
    price: formatRange(hotel.numericPrice, hotel.numericPrice + hotel.numericTax, "/night"),
    highlight: hotel["Nearest Landmark"]
      ? `Close to ${hotel["Nearest Landmark"]} with ${hotel["Rating Description"]?.toLowerCase() || "solid"} guest feedback.`
      : `A practical ${budgetKey} pick with ${hotel.Reviews || "many"} reviews and a ${hotel.Rating || "good"} rating.`,
    emoji: budgetKey === "luxury" ? "🏨" : budgetKey === "budget" ? "🛏️" : "🏠",
    rating: `${hotel.Rating || "4.0"}/5`,
  }));
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
    ...stateInfo.places.slice(0, 6),
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

function buildTripPlan({
  stateName,
  selectedPlaces,
  days,
  budgetKey,
  styleKey,
  stateInfo,
  hiddenExtra,
  attractionRows,
  hotelRows,
  restaurantRows,
}) {
  const budgetInfo = BUDGET_CONFIG[budgetKey] || BUDGET_CONFIG.moderate;
  const themes = STYLE_THEMES[styleKey] || STYLE_THEMES.explorer;
  const chosenPlaces = selectedPlaces.length ? selectedPlaces : stateInfo.places.slice(0, Math.min(days + 2, 5));

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
  const finalFoods = foods.length ? foods : getStateFoods(stateName, stateInfo.region).slice(0, 4);
  const hotels = chooseHotels(hotelRows, budgetKey);
  const finalHotels = hotels.length ? hotels : fallbackHotels(stateName, chosenPlaces, budgetKey);
  const hidden = (hiddenExtra || []).slice(0, 4).map((name, index) => ({
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
        activity: afternoon?.name || stateInfo.places[(index + 1) % stateInfo.places.length],
        description: `Use the afternoon for ${afternoon?.type?.toLowerCase() || "another key attraction"} and keep transit short by staying around ${afternoon?.city || stateName}. This keeps the plan realistic instead of overpacked.`,
        tip: `Pair this stop with a short chai or snack break before moving again.`,
        duration: `${Math.max(1, Math.round(afternoon?.hours || 2))} hrs`,
      },
      evening: {
        activity: `${eveningFood.name} + easy local walk`,
        description: `Wind down with ${eveningFood.name.toLowerCase()} around ${eveningFood.where}. This gives the itinerary a softer local finish instead of ending with another rushed attraction.`,
        tip: `Keep evenings flexible for shopping streets, waterfronts, or heritage lighting.`,
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
    tagline: `This trip keeps your plan rooted in ${stateInfo.tagline.toLowerCase()} while staying realistic on time and budget. It mixes headline attractions with lighter local moments so the journey feels personal, not copy-pasted.`,
    weatherNote: `Best plan rhythm: follow ${stateInfo.region.toLowerCase()} travel timing, start major sightseeing early, and leave room for weather and traffic shifts.`,
    days: dayPlans,
    food: finalFoods,
    hotels: finalHotels,
    transport: [
      {
        mode: budgetKey === "budget" ? "Metro / bus / auto" : budgetKey === "luxury" ? "Private cab" : "Metro + cab mix",
        from: "Arrival point",
        to: chosenPlaces[0] || stateName,
        detail: `Start with the most efficient city transfer and cluster nearby stops on the same day to save time and money.`,
        cost: formatRange(budgetInfo.transportPerHop[0], budgetInfo.transportPerHop[1]),
        emoji: budgetKey === "luxury" ? "🚖" : "🚌",
        duration: "30 mins-2 hrs",
      },
      {
        mode: "Local transit",
        from: chosenPlaces[0] || stateName,
        to: chosenPlaces[1] || "Food and market circuit",
        detail: `Keep afternoon transfers short and avoid zig-zag routing across the city or state.`,
        cost: formatRange(budgetInfo.transportPerHop[0], budgetInfo.transportPerHop[1]),
        emoji: "🚇",
        duration: "20 mins-1.5 hrs",
      },
    ],
    hiddenGems: hidden,
    packingEssentials: PACKING_BY_REGION[stateInfo.region] || PACKING_BY_REGION.North,
    localPhrases: getLocalPhrases(stateName, stateInfo.region),
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
  };
}

export default function App() {
  const [step, setStep] = useState(0);
  const [selState, setSelState] = useState(null);
  const [selPlaces, setSelPlaces] = useState([]);
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("moderate");
  const [tStyle, setTStyle] = useState("explorer");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("itinerary");
  const [stateQ, setStateQ] = useState("");
  const [placeQ, setPlaceQ] = useState("");
  const [region, setRegion] = useState("All");
  const [showHidden, setShowHidden] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("locallens_token") || "");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const planRef = useRef(null);

  useEffect(() => {
    if (!authToken) return;

    let cancelled = false;
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Session expired.");
        if (!cancelled) setAuthUser(payload.user);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem("locallens_token");
          setAuthToken("");
          setAuthUser(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  useEffect(() => {
    const shareId = new URLSearchParams(window.location.search).get("share");
    if (!shareId) return;

    let cancelled = false;
    setLoading(true);
    setShareStatus("Loading shared plan...");

    fetch(`/api/share/${encodeURIComponent(shareId)}`)
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Shared plan could not be loaded.");
        return payload.item;
      })
      .then((item) => {
        if (cancelled) return;
        setSelState(item.stateName || null);
        setSelPlaces(Array.isArray(item.selectedPlaces) ? item.selectedPlaces : []);
        setDays(Number(item.days) || 3);
        setBudget(item.budgetKey || "moderate");
        setTStyle(item.styleKey || "explorer");
        setPlan(item.plan);
        setTab("itinerary");
        setStep(3);
        setShareStatus("Shared plan loaded.");
      })
      .catch((error) => {
        if (!cancelled) setShareStatus(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const saveAuth = ({ token, user }) => {
    localStorage.setItem("locallens_token", token);
    setAuthToken(token);
    setAuthUser(user);
    setAuthError("");
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch(`/api/auth/${authMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Authentication failed.");
      saveAuth(payload);
      setAuthForm({ name: "", email: "", password: "" });
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    if (authToken) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }

    localStorage.removeItem("locallens_token");
    setAuthToken("");
    setAuthUser(null);
    setPlan(null);
    setStep(0);
  };

  const HIDDEN_EXTRA = useMemo(() => ({
    "Himachal Pradesh": ["Tirthan Valley", "Jibhi", "Barot", "Lahaul & Pangi Valley", "Seraj Region", "Prashar Lake", "Karsog", "Rajgundha Valley"],
    "Uttarakhand": ["Munsiyari", "Milam Glacier", "Dharchula", "Jaunsar Bawar", "Niti Village", "Malari", "Dayara Bugyal", "Mana Village"],
    "Ladakh": ["Hanle Dark Sky Reserve", "Phugtal Monastery", "Wanla", "Karsha Monastery", "Zangla Fort", "Nimmu Village"],
    "Jammu & Kashmir": ["Gurez Valley", "Lolab Valley", "Bangus Valley", "Warwan Valley", "Tosamaidan", "Naranag Ruins"],
    "Meghalaya": ["Nongriat", "Laitlum Canyons", "Mawlynnong", "Siju Cave", "Balphakram", "Nongkhnum Island"],
    "Nagaland": ["Mon Konyak Tribe", "Khonoma Village", "Kiphire Frontier", "Meluri", "Shamator", "Noklak"],
    "Arunachal Pradesh": ["Mechuka", "Anini", "Dong", "Walong", "Kibithu", "Kaho", "Shergaon", "Pakke Deep Forest"],
    "Sikkim": ["Zuluk Silk Route", "Rinchenpong", "Dzongu", "Barsey", "Kaluk", "Dentam", "Soreng"],
    "Rajasthan": ["Bundi", "Shekhawati Havelis", "Osian Desert Temples", "Karauli", "Abhaneri", "Kheechan Bird Village"],
    "Gujarat": ["Dholavira Harappan Site", "Polo Forest", "Gondal Palace", "Balasinor Fossil Park", "Shoolpaneshwar"],
    "Maharashtra": ["Tarkarli", "Amboli", "Kaas Plateau", "Purushwadi", "Bhandardara", "Sandhan Valley"],
    "Goa": ["Divar Island", "Netravali Bubble Lake", "Cabo de Rama", "Tambdi Surla Temple", "Rivona Caves"],
    "Karnataka": ["Agumbe Rainforest", "Badami-Aihole-Pattadakal", "Yana Caves", "Kudremukh", "Devarayanadurga"],
    "Kerala": ["Nelliampathi Hills", "Vagamon", "Silent Valley", "Attapadi Tribal", "Parambikulam"],
    "Tamil Nadu": ["Tranquebar", "Pichavaram Mangroves", "Kolli Hills", "Yelagiri", "Karaikudi Chettinad"],
    "Andhra Pradesh": ["Gandikota Grand Canyon", "Buddhist Rock-Cut Caves", "Papikondalu Gorge", "Maredumilli"],
    "Odisha": ["Daringbadi", "Koraput Tribal", "Satkosia Gorge", "Khandadhar Falls", "Bhitarkanika Inside"],
    "West Bengal": ["Sandakphu", "Samsing", "Purulia Chotanagpur", "Taki", "Jayanti", "Mousuni Island"],
    "Assam": ["Majuli Island", "Haflong Hills", "Diphu Dima Hasao", "Bodoland Kokrajhar", "Dehing Patkai"],
    "Madhya Pradesh": ["Orchha", "Mandu", "Maheshwar Ghats", "Chanderi", "Bhimbetka", "Satpura", "Chambal"],
    "Chhattisgarh": ["Bastar Tribal Villages", "Kanger Caves", "Mainpat Tibet of CG", "Sirpur", "Kondagaon"],
  }), []);

  const filteredStates = useMemo(() => {
    const q = stateQ.toLowerCase().trim();
    return Object.keys(INDIA).filter(s => {
      const info = INDIA[s];
      const rOk = region === "All" || info.region === region;
      if (!q) return rOk;
      const extra = HIDDEN_EXTRA[s] || [];
      return rOk && (
        s.toLowerCase().includes(q) ||
        info.places.some(p => p.toLowerCase().includes(q)) ||
        extra.some(h => h.toLowerCase().includes(q))
      );
    });
  }, [stateQ, region, HIDDEN_EXTRA]);

  const displayPlaces = useMemo(() => {
    if (!selState) return [];
    const info = INDIA[selState];
    const extra = HIDDEN_EXTRA[selState] || [];
    const pool = showHidden ? [...new Set([...info.places, ...extra])] : info.places;
    if (!placeQ.trim()) return pool;
    return pool.filter(p => p.toLowerCase().includes(placeQ.toLowerCase()));
  }, [selState, showHidden, placeQ, HIDDEN_EXTRA]);

  const togglePlace = (p) => setSelPlaces(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const generatePlan = async () => {
    if (!authToken) {
      setAuthError("Please log in before generating a trip plan.");
      return;
    }

    setLoading(true);
    setPlan(null);
    const info = INDIA[selState];

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          stateName: selState,
          selectedPlaces: selPlaces,
          days,
          budgetKey: budget,
          styleKey: tStyle,
          stateInfo: info,
          hiddenExtra: HIDDEN_EXTRA[selState] || [],
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) {
          setAuthError(payload.error || "Please log in to continue.");
          localStorage.removeItem("locallens_token");
          setAuthToken("");
          setAuthUser(null);
          return;
        }
        throw new Error(payload.error || "Backend plan generation failed");
      }

      const payload = await response.json();
      setPlan(payload.plan);
      setShareStatus("");
      setTab("itinerary");
      setStep(3);
      setTimeout(() => { if (planRef.current) planRef.current.scrollIntoView({ behavior: "smooth" }); }, 150);
    } catch (e) {
      console.error("Backend plan generation error, using local fallback:", e);
      const fallbackPlan = buildTripPlan({
        stateName: selState,
        selectedPlaces: selPlaces,
        days,
        budgetKey: budget,
        styleKey: tStyle,
        stateInfo: info,
        hiddenExtra: HIDDEN_EXTRA[selState],
        attractionRows: [],
        hotelRows: [],
        restaurantRows: [],
      });
      setPlan(fallbackPlan);
      setShareStatus("");
      setTab("itinerary");
      setStep(3);
    } finally {
      setLoading(false);
    }
    return; /*

    const prompt = `You are LocalLands, India's best travel curator. Create a hyper-local, authentic trip plan.

State: ${selState} (${info.tagline})
Places: ${selPlaces.join(", ")}
Days: ${days}
Budget: ${budget} (budget=under Rs1500/day, moderate=Rs1500-4000/day, luxury=Rs4000+/day)
Style: ${tStyle}

Return ONLY valid JSON, no markdown fences:
{
  "headline": "8-word poetic headline",
  "tagline": "2 vivid sentences about this journey",
  "weatherNote": "season and weather tips",
  "days": [{"day":1,"title":"Day 1 title with emoji","theme":"word","morning":{"activity":"name","description":"2 sentences","tip":"insider tip","duration":"X hrs"},"afternoon":{"activity":"name","description":"2 sentences","tip":"insider tip","duration":"X hrs"},"evening":{"activity":"name","description":"2 sentences","tip":"insider tip","duration":"X hrs"}}],
  "food": [{"name":"dish","where":"actual dhaba or restaurant name","description":"what makes it special","price":"Rs XX-YY","emoji":"🍛","mustTry":true}],
  "hotels": [{"name":"property name","type":"Budget/Homestay/Mid-range/Luxury/Camp","location":"area","price":"Rs XXX-YYYY/night","highlight":"USP","emoji":"🏡","rating":"4.2/5"}],
  "transport": [{"mode":"bus/train/taxi/etc","from":"origin","to":"destination","detail":"practical advice","cost":"Rs XX-YY","emoji":"🚌","duration":"X hrs"}],
  "hiddenGems": [{"name":"hidden spot name","why":"why special and unknown","bestTime":"when to visit","emoji":"💎"}],
  "packingEssentials": ["item1","item2","item3","item4","item5"],
  "localPhrases": [{"phrase":"local word","meaning":"English meaning","language":"language name"}],
  "budgetSummary": {"accommodation":"Rs X-Y/night","food":"Rs X-Y/day","transport":"Rs X-Y total","activities":"Rs X-Y/day","total":"Rs X-Y for ${days} days"}
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const raw = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : "{}";
      const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setPlan(parsed);
      setTab("itinerary");
      setStep(3);
      setTimeout(() => { if (planRef.current) planRef.current.scrollIntoView({ behavior: "smooth" }); }, 150);
    } catch (e) {
      console.error("Plan generation error:", e);
    } finally {
      setLoading(false);
    }
    */
  };

  const reset = () => {
    if (window.location.search.includes("share=")) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    setStep(0); setSelState(null); setSelPlaces([]);
    setDays(3); setBudget("moderate"); setTStyle("explorer");
    setPlan(null); setStateQ(""); setPlaceQ(""); setRegion("All"); setShowHidden(false); setShareStatus("");
  };

  const sharePlan = async () => {
    if (!plan) return;
    if (!authToken) {
      setShareStatus("Please log in to create a share link.");
      return;
    }

    setShareStatus("Creating share link...");
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          stateName: selState,
          selectedPlaces: selPlaces,
          days,
          budgetKey: budget,
          styleKey: tStyle,
          plan,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not create share link.");

      const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(payload.id)}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus(`Share link copied: ${shareUrl}`);
    } catch (error) {
      setShareStatus(error.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TXT, fontFamily: "Georgia, serif" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        body { background: ${BG}; }
        input, button { font-family: Georgia, serif; }
        input:focus { outline: none; border-color: ${SEA} !important; box-shadow: 0 0 0 3px rgba(42,157,143,0.15) !important; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: rgba(42,157,143,0.2); width: 100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${SEA}; cursor: pointer; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(42,157,143,0.25); border-radius: 3px; }
        button:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(240,250,248,0.96)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${BDR}`, boxShadow: "0 2px 16px rgba(42,157,143,0.08)" }}>
        <div style={{ width: "100%", padding: "13px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 26 }}>🇮🇳</span>
            <span style={{ fontSize: "1.65rem", fontWeight: 900, color: TXT }}>Local<em style={{ color: SEA, fontStyle: "italic" }}>Lands</em></span>
          </button>
          {authUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "0.78rem", color: TXT_M }}>Hi, <strong style={{ color: SEA_D }}>{authUser.name}</strong></span>
              <button onClick={logout} style={{ fontSize: "0.72rem", fontWeight: 700, color: SEA, background: SEA_L, padding: "7px 14px", borderRadius: 100, border: `1px solid ${BDR}`, cursor: "pointer" }}>Logout</button>
            </div>
          ) : (
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: SEA, background: SEA_L, padding: "5px 14px", borderRadius: 100, border: `1px solid ${BDR}` }}>Discover Hidden India</span>
          )}
        </div>
      </header>

      {/* STEP BAR */}
      {authUser && step < 3 && (
        <div style={{ width: "100%", padding: "14px 40px", display: "flex" }}>
          {["Choose State", "Select Places", "Trip Details"].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0, background: i < step ? SEA : i === step ? BLUSH : "rgba(42,157,143,0.12)", color: i <= step ? "#fff" : TXT_L }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: "0.82rem", whiteSpace: "nowrap", color: i === step ? SEA_D : i < step ? SEA : TXT_L, fontWeight: i === step ? 700 : 400 }}>{l}</span>
              {i < 2 && <div style={{ width: 32, height: 1, background: BDR, flexShrink: 0, margin: "0 8px" }} />}
            </div>
          ))}
        </div>
      )}

      {/* MAIN */}
      <main style={{ width: "100%", padding: "0 0 60px" }}>
        {!authUser && !plan ? (
          <AuthPanel
            authError={authError}
            authForm={authForm}
            authLoading={authLoading}
            authMode={authMode}
            setAuthError={setAuthError}
            setAuthForm={setAuthForm}
            setAuthMode={setAuthMode}
            submitAuth={submitAuth}
          />
        ) : (
          <>

        {/* ── STEP 0: STATE ── */}
        {step === 0 && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <div style={{ textAlign: "center", padding: "52px 0 40px" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", color: SEA, marginBottom: 12 }}>🇮🇳 ALL OF INDIA, UNLOCKED</div>
              <h1 style={{ fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 14, color: TXT }}>
                Where in <em style={{ color: SEA, fontStyle: "italic" }}>Incredible India</em><br />are you headed?
              </h1>
              <p style={{ fontSize: "1rem", color: TXT_M, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 28px" }}>
                36 States & UTs · 1000+ places · Hidden gems only locals know
              </p>
              <div style={{ maxWidth: 520, margin: "0 auto", position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: 16, fontSize: 14, pointerEvents: "none" }}>🔍</span>
                <input
                  autoFocus
                  value={stateQ}
                  onChange={e => setStateQ(e.target.value)}
                  placeholder="Search state, city or hidden place (e.g. Zanskar, Dzukou, Gandikota)…"
                  style={{ width: "100%", padding: "13px 44px", background: WHITE, border: `1.5px solid ${BDR}`, borderRadius: 100, color: TXT, fontSize: "0.9rem", boxShadow: "0 2px 14px rgba(42,157,143,0.1)" }}
                />
                {stateQ && <button onClick={() => setStateQ("")} style={{ position: "absolute", right: 14, background: "none", border: "none", cursor: "pointer", color: TXT_L, fontSize: 13 }}>✕</button>}
              </div>
              {stateQ && <p style={{ fontSize: "0.78rem", color: TXT_L, marginTop: 8 }}>{filteredStates.length} state{filteredStates.length !== 1 ? "s" : ""} matched</p>}
            </div>

            {/* REGION PILLS */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 30 }}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegion(r)} style={{ padding: "6px 15px", borderRadius: 100, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all .2s", background: region === r ? SEA : WHITE, color: region === r ? "#fff" : TXT_M, border: `1px solid ${region === r ? SEA : BDR}`, boxShadow: region === r ? "0 4px 14px rgba(42,157,143,0.28)" : "none" }}>
                  {r}
                </button>
              ))}
            </div>

            {/* STATE GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(195px,1fr))", gap: 14 }}>
              {filteredStates.map(s => {
                const info = INDIA[s];
                return (
                  <button key={s} onClick={() => { setSelState(s); setSelPlaces([]); setStep(1); }}
                    style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 16, padding: "22px 18px", cursor: "pointer", textAlign: "left", color: TXT, boxShadow: "0 2px 10px rgba(42,157,143,0.05)", transition: "all .25s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(244,167,185,0.3)"; e.currentTarget.style.borderColor = BLUSH; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 10px rgba(42,157,143,0.05)"; e.currentTarget.style.borderColor = BDR; }}>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>{info.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.97rem", marginBottom: 4 }}>{s}</div>
                    <div style={{ fontSize: "0.74rem", color: TXT_M, lineHeight: 1.5, marginBottom: 10 }}>{info.tagline}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.65rem", color: SEA, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>{info.region}</span>
                      <span style={{ fontSize: "0.7rem", color: BLUSH_D, background: BLUSH_L, padding: "2px 9px", borderRadius: 100, fontWeight: 600 }}>{info.places.length}+</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {filteredStates.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: TXT_L, fontSize: "0.95rem" }}>
                No results for "<strong>{stateQ}</strong>" — try "Dzukou", "Tarkarli" or "Gurez"
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1: PLACES ── */}
        {step === 1 && selState && (
          <div style={{ paddingTop: 36, animation: "fadeUp 0.5s ease" }}>
            <button onClick={() => setStep(0)} style={{ background: "none", border: `1px solid ${BDR}`, color: TXT_M, padding: "7px 16px", borderRadius: 100, cursor: "pointer", fontSize: "0.82rem", marginBottom: 16 }}>← Back</button>
            <div style={{ display: "inline-block", background: SEA_L, color: SEA_D, fontSize: "0.74rem", fontWeight: 700, padding: "5px 14px", borderRadius: 100, border: `1px solid ${BDR}`, marginBottom: 10 }}>{INDIA[selState].emoji} {selState}</div>
            <h2 style={{ fontSize: "clamp(1.7rem,4vw,2.5rem)", fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 8, color: TXT }}>Which places call to you?</h2>
            <p style={{ fontSize: "0.96rem", color: TXT_M, lineHeight: 1.65, marginBottom: 24 }}>Select as many as you like. Toggle hidden gems for offbeat spots.</p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
              <div style={{ maxWidth: 360, position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: 14, fontSize: 13, pointerEvents: "none" }}>🔍</span>
                <input value={placeQ} onChange={e => setPlaceQ(e.target.value)} placeholder="Search places here…"
                  style={{ padding: "10px 38px 10px 36px", background: WHITE, border: `1.5px solid ${BDR}`, borderRadius: 100, color: TXT, fontSize: "0.87rem", width: "100%" }} />
                {placeQ && <button onClick={() => setPlaceQ("")} style={{ position: "absolute", right: 12, background: "none", border: "none", cursor: "pointer", color: TXT_L, fontSize: 12 }}>✕</button>}
              </div>
              <button onClick={() => setShowHidden(!showHidden)}
                style={{ padding: "10px 16px", borderRadius: 100, fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", background: showHidden ? BLUSH_L : WHITE, border: `1px solid ${showHidden ? BLUSH : BDR_B}`, color: BLUSH_D }}>
                {showHidden ? "✨ Showing Hidden Gems" : "💎 Show Hidden Gems"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(165px,1fr))", gap: 10, marginBottom: 26 }}>
              {displayPlaces.map(p => {
                const extra = HIDDEN_EXTRA[selState] || [];
                const isHidden = extra.includes(p) && !INDIA[selState].places.includes(p);
                const active = selPlaces.includes(p);
                return (
                  <button key={p} onClick={() => togglePlace(p)}
                    style={{ background: active ? SEA_L : isHidden ? "rgba(244,167,185,0.06)" : WHITE, border: `1px solid ${active ? SEA : isHidden ? "rgba(224,117,143,0.3)" : BDR}`, borderRadius: 12, padding: "13px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, color: TXT, textAlign: "left", position: "relative", boxShadow: active ? "0 4px 14px rgba(42,157,143,0.16)" : "none", transition: "all .18s" }}>
                    {isHidden && <span style={{ position: "absolute", top: 5, right: 7, fontSize: "0.58rem", fontWeight: 700, color: BLUSH_D }}>💎</span>}
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: active ? SEA : SEA_L, color: active ? "#fff" : SEA, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0 }}>{active ? "✓" : "+"}</span>
                    <span style={{ fontSize: "0.86rem", fontWeight: 600, lineHeight: 1.3 }}>{p}</span>
                  </button>
                );
              })}
            </div>

            {selPlaces.length > 0 && (
              <div style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 14, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", boxShadow: "0 4px 20px rgba(42,157,143,0.1)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selPlaces.map(p => <span key={p} style={{ background: SEA_L, color: SEA_D, border: `1px solid ${BDR}`, padding: "4px 11px", borderRadius: 100, fontSize: "0.77rem", fontWeight: 600 }}>{p}</span>)}
                </div>
                <button onClick={() => setStep(2)} style={{ background: SEA, color: "#fff", padding: "12px 26px", borderRadius: 100, border: "none", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700, boxShadow: "0 6px 20px rgba(42,157,143,0.33)", whiteSpace: "nowrap" }}>
                  Plan with {selPlaces.length} Place{selPlaces.length > 1 ? "s" : ""} →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: DETAILS ── */}
        {step === 2 && (
          <div style={{ paddingTop: 36, animation: "fadeUp 0.5s ease" }}>
            <button onClick={() => setStep(1)} style={{ background: "none", border: `1px solid ${BDR}`, color: TXT_M, padding: "7px 16px", borderRadius: 100, cursor: "pointer", fontSize: "0.82rem", marginBottom: 16 }}>← Back</button>
            <div style={{ display: "inline-block", background: SEA_L, color: SEA_D, fontSize: "0.74rem", fontWeight: 700, padding: "5px 14px", borderRadius: 100, border: `1px solid ${BDR}`, marginBottom: 10 }}>{INDIA[selState].emoji} {selState} · {selPlaces.join(", ")}</div>
            <h2 style={{ fontSize: "clamp(1.7rem,4vw,2.5rem)", fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 8, color: TXT }}>How do you travel?</h2>
            <p style={{ fontSize: "0.96rem", color: TXT_M, lineHeight: 1.65, marginBottom: 28 }}>Every recommendation will be tailored just for you.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
              {/* Days */}
              <div style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 16, padding: "24px 20px" }}>
                <h3 style={{ fontSize: "0.86rem", fontWeight: 700, color: TXT_M, marginBottom: 18 }}>📅 Trip Duration</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 18 }}>
                  <button onClick={() => setDays(Math.max(1, days - 1))} style={{ width: 36, height: 36, borderRadius: "50%", background: SEA_L, color: SEA, border: `1px solid ${BDR}`, cursor: "pointer", fontSize: "1.2rem", fontWeight: 700 }}>−</button>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.8rem", fontWeight: 900, color: SEA, lineHeight: 1 }}>{days}</div>
                    <div style={{ fontSize: "0.78rem", color: TXT_L }}>day{days > 1 ? "s" : ""}</div>
                  </div>
                  <button onClick={() => setDays(Math.min(14, days + 1))} style={{ width: 36, height: 36, borderRadius: "50%", background: SEA_L, color: SEA, border: `1px solid ${BDR}`, cursor: "pointer", fontSize: "1.2rem", fontWeight: 700 }}>+</button>
                </div>
                <input type="range" min="1" max="14" value={days} onChange={e => setDays(Number(e.target.value))} style={{ marginBottom: 6 }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: TXT_L }}><span>1 day</span><span>14 days</span></div>
              </div>

              {/* Budget */}
              <div style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 16, padding: "24px 20px" }}>
                <h3 style={{ fontSize: "0.86rem", fontWeight: 700, color: TXT_M, marginBottom: 16 }}>💰 Budget Level</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[{ id: "budget", emoji: "🎒", label: "Budget", desc: "Under Rs 1,500/day" }, { id: "moderate", emoji: "✈️", label: "Moderate", desc: "Rs 1,500–4,000/day" }, { id: "luxury", emoji: "💎", label: "Luxury", desc: "Rs 4,000+/day" }].map(b => (
                    <button key={b.id} onClick={() => setBudget(b.id)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, cursor: "pointer", color: TXT, transition: "all .2s", background: budget === b.id ? SEA_L : BG, border: `1px solid ${budget === b.id ? SEA : BDR}`, boxShadow: budget === b.id ? "0 4px 12px rgba(42,157,143,0.14)" : "none" }}>
                      <span style={{ fontSize: "1.3rem" }}>{b.emoji}</span>
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{b.label}</div>
                        <div style={{ fontSize: "0.74rem", color: TXT_L }}>{b.desc}</div>
                      </div>
                      {budget === b.id && <span style={{ color: SEA, fontWeight: 700 }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 16, padding: "24px 20px", gridColumn: "1 / -1" }}>
                <h3 style={{ fontSize: "0.86rem", fontWeight: 700, color: TXT_M, marginBottom: 16 }}>🎭 Travel Style</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
                  {[{ id: "explorer", emoji: "🧭", label: "Explorer", desc: "Hidden gems & local life" }, { id: "adventurer", emoji: "⛰️", label: "Adventurer", desc: "Treks & outdoor thrills" }, { id: "foodie", emoji: "🍛", label: "Foodie", desc: "Culinary & street food" }, { id: "spiritual", emoji: "🕉️", label: "Spiritual", desc: "Temples & inner peace" }].map(s => (
                    <button key={s.id} onClick={() => setTStyle(s.id)}
                      style={{ padding: "17px 10px", borderRadius: 12, cursor: "pointer", color: TXT, textAlign: "center", transition: "all .2s", background: tStyle === s.id ? SEA_L : BG, border: `1px solid ${tStyle === s.id ? SEA : BDR}`, boxShadow: tStyle === s.id ? "0 4px 14px rgba(42,157,143,0.17)" : "none" }}>
                      <div style={{ fontSize: "1.7rem", marginBottom: 7 }}>{s.emoji}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{s.label}</div>
                      <div style={{ fontSize: "0.71rem", color: TXT_L, marginTop: 4, lineHeight: 1.4 }}>{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={generatePlan} disabled={loading}
                style={{ background: `linear-gradient(135deg,${SEA},${SEA_D})`, color: "#fff", padding: "15px 46px", borderRadius: 100, border: "none", cursor: "pointer", fontSize: "1.05rem", fontWeight: 700, boxShadow: "0 8px 26px rgba(42,157,143,0.36)" }}>
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin .7s linear infinite", display: "inline-block" }} />
                      Crafting your {selState} adventure…
                    </span>
                  : "✨ Generate My LocalLands Plan"}
              </button>
              <p style={{ fontSize: "0.78rem", color: TXT_L, marginTop: 10 }}>AI-powered · Hyper-local · Hidden gems included</p>
            </div>
          </div>
        )}

        {/* ── STEP 3: PLAN ── */}
        {step === 3 && plan && (
          <div ref={planRef} style={{ animation: "fadeUp 0.5s ease" }}>
            {/* Banner */}
            <div style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg,${SEA},${SEA_D})`, borderRadius: 20, marginBottom: 20, padding: "48px 40px", boxShadow: "0 12px 40px rgba(42,157,143,0.28)" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 80% at 85% 40%, rgba(255,255,255,0.14), transparent)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                  {INDIA[selState] && INDIA[selState].emoji} {selState} · {days} Days · {budget.charAt(0).toUpperCase() + budget.slice(1)}
                </div>
                <h1 style={{ fontSize: "clamp(1.7rem,4vw,2.8rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 12, color: "#fff" }}>{plan.headline}</h1>
                <p style={{ fontSize: "0.97rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, maxWidth: 600, marginBottom: 16 }}>{plan.tagline}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                  {selPlaces.map(p => <span key={p} style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "4px 14px", borderRadius: 100, fontSize: "0.8rem", fontWeight: 600 }}>{p}</span>)}
                </div>
                {plan.weatherNote && <div style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.12)", padding: "9px 16px", borderRadius: 10, display: "inline-block" }}>🌤 {plan.weatherNote}</div>}
              </div>
            </div>

            {/* Budget summary */}
            {plan.budgetSummary && (
              <div style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 14, padding: "16px 22px", display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 20, justifyContent: "space-around" }}>
                {Object.entries(plan.budgetSummary).map(([k, v]) => (
                  <div key={k} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.66rem", color: TXT_L, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>{k.charAt(0).toUpperCase() + k.slice(1)}</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: SEA_D }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* TABS */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", borderBottom: `1px solid ${BDR}`, marginBottom: 22 }}>
              {[{ id: "itinerary", l: "🗓 Itinerary" }, { id: "food", l: "🍛 Food" }, { id: "hotels", l: "🏨 Hotels" }, { id: "transport", l: "🚌 Transport" }, { id: "hidden", l: "💎 Hidden Gems" }, { id: "tips", l: "🎒 Tips" }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ background: tab === t.id ? SEA_L : "none", border: "none", cursor: "pointer", padding: "10px 16px", color: tab === t.id ? SEA : TXT_M, fontSize: "0.83rem", fontWeight: 600, borderBottom: `2px solid ${tab === t.id ? SEA : "transparent"}`, borderRadius: "8px 8px 0 0", transition: "all .2s" }}>
                  {t.l}
                </button>
              ))}
            </div>

            <div style={{ paddingBottom: 24 }}>
              {tab === "itinerary" && <ItinTab days={plan.days} />}
              {tab === "food" && <FoodTab food={plan.food} />}
              {tab === "hotels" && <HotelsTab hotels={plan.hotels} />}
              {tab === "transport" && <TransTab transport={plan.transport} />}
              {tab === "hidden" && <HiddenTab gems={plan.hiddenGems} />}
              {tab === "tips" && <TipsTab packing={plan.packingEssentials} phrases={plan.localPhrases} stateName={selState} />}
            </div>

            <div style={{ textAlign: "center", paddingBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                {authUser && (
                  <button onClick={sharePlan} style={{ background: `linear-gradient(135deg,${BLUSH},${BLUSH_D})`, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 100, cursor: "pointer", fontSize: "0.9rem", fontWeight: 800, boxShadow: "0 8px 24px rgba(224,117,143,0.25)" }}>🔗 Copy Share Link</button>
                )}
              </div>
              {shareStatus && <p style={{ maxWidth: 720, margin: "0 auto 14px", color: shareStatus.includes("copied") || shareStatus.includes("loaded") ? SEA_D : BLUSH_D, fontSize: "0.82rem", lineHeight: 1.55, wordBreak: "break-word" }}>{shareStatus}</p>}
              <button onClick={reset} style={{ background: SEA_L, color: SEA, border: `1px solid ${BDR}`, padding: "12px 32px", borderRadius: 100, cursor: "pointer", fontSize: "0.92rem", fontWeight: 700 }}>🔄 Plan Another Trip</button>
            </div>
          </div>
        )}
          </>
        )}
      </main>

      <footer style={{ borderTop: `1px solid ${BDR}`, padding: "20px 32px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: "0.82rem", color: TXT_M, background: WHITE }}>
        <span>🇮🇳 <strong style={{ color: SEA }}>LocalLands</strong> — Discover the Real India</span>
        <span style={{ color: TXT_L }}>36 States & UTs · 1000+ Places · AI-Powered</span>
      </footer>
    </div>
  );
}

/* ── ITINERARY ── */
function AuthPanel({
  authError,
  authForm,
  authLoading,
  authMode,
  setAuthError,
  setAuthForm,
  setAuthMode,
  submitAuth,
}) {
  const isSignup = authMode === "signup";

  return (
    <section style={{ minHeight: "calc(100vh - 120px)", display: "grid", placeItems: "center", padding: "52px 20px" }}>
      <div style={{ width: "min(440px, 100%)", background: WHITE, border: `1px solid ${BDR}`, borderRadius: 18, padding: "30px 28px", boxShadow: "0 16px 48px rgba(42,157,143,0.16)" }}>
        <div style={{ marginBottom: 22, textAlign: "center" }}>
          <div style={{ display: "inline-block", background: SEA_L, color: SEA_D, fontSize: "0.72rem", fontWeight: 700, padding: "5px 13px", borderRadius: 100, border: `1px solid ${BDR}`, marginBottom: 12 }}>
            Secure trip planning
          </div>
          <h1 style={{ color: TXT, fontSize: "2rem", lineHeight: 1.1, marginBottom: 8 }}>
            {isSignup ? "Create your LocalLands account" : "Welcome back"}
          </h1>
          <p style={{ color: TXT_M, fontSize: "0.94rem", lineHeight: 1.6 }}>
            {isSignup ? "Save your access before generating personalized travel plans." : "Log in to generate your personalized India itinerary."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: BG, borderRadius: 100, padding: 5, marginBottom: 20 }}>
          {["login", "signup"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setAuthMode(mode);
                setAuthError("");
              }}
              style={{ border: "none", borderRadius: 100, padding: "10px 12px", cursor: "pointer", fontWeight: 700, color: authMode === mode ? "#fff" : TXT_M, background: authMode === mode ? SEA : "transparent" }}
            >
              {mode === "login" ? "Login" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={submitAuth} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {isSignup && (
            <label style={{ display: "flex", flexDirection: "column", gap: 7, color: TXT_M, fontSize: "0.78rem", fontWeight: 700 }}>
              Name
              <input
                value={authForm.name}
                onChange={(event) => setAuthForm((form) => ({ ...form, name: event.target.value }))}
                placeholder="Your name"
                style={{ padding: "13px 14px", borderRadius: 12, border: `1.5px solid ${BDR}`, color: TXT, background: BG, fontSize: "0.92rem" }}
              />
            </label>
          )}

          <label style={{ display: "flex", flexDirection: "column", gap: 7, color: TXT_M, fontSize: "0.78rem", fontWeight: 700 }}>
            Email
            <input
              type="email"
              value={authForm.email}
              onChange={(event) => setAuthForm((form) => ({ ...form, email: event.target.value }))}
              placeholder="you@example.com"
              style={{ padding: "13px 14px", borderRadius: 12, border: `1.5px solid ${BDR}`, color: TXT, background: BG, fontSize: "0.92rem" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 7, color: TXT_M, fontSize: "0.78rem", fontWeight: 700 }}>
            Password
            <input
              type="password"
              value={authForm.password}
              onChange={(event) => setAuthForm((form) => ({ ...form, password: event.target.value }))}
              placeholder="Minimum 8 characters"
              style={{ padding: "13px 14px", borderRadius: 12, border: `1.5px solid ${BDR}`, color: TXT, background: BG, fontSize: "0.92rem" }}
            />
          </label>

          {authError && (
            <div style={{ color: BLUSH_D, background: BLUSH_L, border: `1px solid ${BDR_B}`, borderRadius: 12, padding: "10px 12px", fontSize: "0.82rem", lineHeight: 1.45 }}>
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            style={{ marginTop: 4, background: `linear-gradient(135deg,${SEA},${SEA_D})`, color: "#fff", padding: "14px 20px", borderRadius: 100, border: "none", cursor: "pointer", fontSize: "0.98rem", fontWeight: 800, boxShadow: "0 8px 26px rgba(42,157,143,0.28)" }}
          >
            {authLoading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}

function ItinTab({ days = [] }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {days.map((d, i) => (
        <div key={i} style={{ background: "#fff", border: `1px solid ${BDR}`, borderRadius: 13, overflow: "hidden" }}>
          <button onClick={() => setOpen(open === i ? -1 : i)}
            style={{ width: "100%", padding: "17px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", color: TXT, fontFamily: "Georgia,serif" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${SEA},${SEA_D})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.97rem", fontWeight: 900, flexShrink: 0 }}>{d.day}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>{d.title}</div>
                <div style={{ fontSize: "0.74rem", color: SEA }}>{d.theme}</div>
              </div>
            </div>
            <span style={{ color: SEA, fontSize: 14 }}>{open === i ? "▲" : "▼"}</span>
          </button>
          {open === i && (
            <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
              {["morning", "afternoon", "evening"].map(sl => d[sl] && (
                <div key={sl} style={{ background: BG, border: `1px solid ${BDR}`, borderRadius: 12, padding: "14px" }}>
                  <div style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.3rem" }}>{sl === "morning" ? "🌅" : sl === "afternoon" ? "☀️" : "🌙"}</span>
                    <div>
                      <div style={{ fontSize: "0.67rem", color: TXT_L, textTransform: "uppercase", letterSpacing: "0.1em" }}>{sl} · {d[sl].duration}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.97rem", color: TXT }}>{d[sl].activity}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.86rem", color: TXT_M, lineHeight: 1.65, marginBottom: 10 }}>{d[sl].description}</p>
                  <div style={{ fontSize: "0.79rem", color: SEA_D, background: SEA_L, border: `1px solid ${BDR}`, padding: "8px 12px", borderRadius: 8, lineHeight: 1.5 }}>💡 {d[sl].tip}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── FOOD ── */
function FoodTab({ food = [] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(245px,1fr))", gap: 14 }}>
      {food.map((f, i) => (
        <div key={i} style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 16, padding: "22px 20px", position: "relative" }}>
          {f.mustTry && <div style={{ position: "absolute", top: 12, right: 12, background: BLUSH_L, color: BLUSH_D, border: `1px solid ${BDR_B}`, fontSize: "0.67rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>🔥 Must Try</div>}
          <div style={{ fontSize: "2.2rem", marginBottom: 10 }}>{f.emoji}</div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 5 }}>{f.name}</h3>
          <div style={{ fontSize: "0.78rem", color: SEA, marginBottom: 9 }}>📍 {f.where}</div>
          <p style={{ fontSize: "0.85rem", color: TXT_M, lineHeight: 1.65, marginBottom: 12 }}>{f.description}</p>
          <div style={{ fontWeight: 700, color: SEA_D, fontSize: "0.88rem" }}>{f.price}</div>
        </div>
      ))}
    </div>
  );
}

/* ── HOTELS ── */
function HotelsTab({ hotels = [] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(245px,1fr))", gap: 14 }}>
      {hotels.map((h, i) => (
        <div key={i} style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 16, padding: "22px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: "2rem" }}>{h.emoji}</span>
            <span style={{ background: SEA_L, color: SEA_D, border: `1px solid ${BDR}`, fontSize: "0.7rem", fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>{h.type}</span>
          </div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 5 }}>{h.name}</h3>
          <div style={{ fontSize: "0.78rem", color: SEA, marginBottom: 9 }}>📍 {h.location}</div>
          <p style={{ fontSize: "0.85rem", color: TXT_M, lineHeight: 1.65, marginBottom: 12 }}>{h.highlight}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: SEA_D, fontSize: "0.9rem" }}>{h.price}</span>
            <span style={{ fontSize: "0.82rem", color: TXT_L }}>⭐ {h.rating}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── TRANSPORT ── */
function TransTab({ transport = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {transport.map((t, i) => (
        <div key={i} style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 14, padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
          <span style={{ fontSize: "2rem", flexShrink: 0 }}>{t.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: SEA, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.mode}</div>
            <div style={{ fontWeight: 700, fontSize: "0.97rem", color: TXT, margin: "4px 0" }}>{t.from} → {t.to}</div>
            <p style={{ fontSize: "0.85rem", color: TXT_M, lineHeight: 1.65 }}>{t.detail}</p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontWeight: 700, color: SEA_D, fontSize: "0.88rem" }}>{t.cost}</div>
            <div style={{ fontSize: "0.75rem", color: TXT_L, marginTop: 4 }}>⏱ {t.duration}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── HIDDEN GEMS ── */
function HiddenTab({ gems = [] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(245px,1fr))", gap: 14 }}>
      {gems.map((g, i) => (
        <div key={i} style={{ background: WHITE, border: `1px solid ${BDR_B}`, borderRadius: 16, padding: "22px 20px" }}>
          <div style={{ fontSize: "2.2rem", marginBottom: 10 }}>{g.emoji}</div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8 }}>{g.name}</h3>
          <p style={{ fontSize: "0.85rem", color: TXT_M, lineHeight: 1.65, marginBottom: 12 }}>{g.why}</p>
          <div style={{ fontSize: "0.78rem", color: SEA_D, background: SEA_L, border: `1px solid ${BDR}`, padding: "7px 12px", borderRadius: 8 }}>🕐 Best time: {g.bestTime}</div>
        </div>
      ))}
    </div>
  );
}

/* ── TIPS ── */
function TipsTab({ packing = [], phrases = [], stateName }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <div style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 16, padding: "24px 22px" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 16 }}>🎒 Packing for {stateName}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {packing.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: SEA, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: "0.87rem", color: TXT_M }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: WHITE, border: `1px solid ${BDR}`, borderRadius: 16, padding: "24px 22px" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 16 }}>🗣 Local Phrases</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {phrases.map((p, i) => (
            <div key={i} style={{ background: SEA_L, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontWeight: 700, color: SEA_D, fontSize: "1rem" }}>{p.phrase}</div>
              <div style={{ fontSize: "0.84rem", color: TXT_M, marginTop: 3 }}>{p.meaning}</div>
              <div style={{ fontSize: "0.7rem", color: TXT_L, marginTop: 2 }}>{p.language}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
