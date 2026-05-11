export const POINTS = {
  Plastic: 10,
  Metal: 5,
  Glass: 5,
  Paper: 3,
  "Food Waste": 2,
} as const

export type Material = keyof typeof POINTS

export const TREE_STAGES = [
  { threshold: 0, label: "Seed", emoji: "🌰" },
  { threshold: 50, label: "Sprout", emoji: "🌱" },
  { threshold: 150, label: "Sapling", emoji: "🌿" },
  { threshold: 350, label: "Growing", emoji: "🌳" },
  { threshold: 700, label: "Fully Grown", emoji: "🌲" },
] as const

export const WASTE_FACTS = [
  "A plastic bottle takes 450 years to decompose.",
  "Recycling one aluminum can saves enough energy to power a TV for 3 hours.",
  "Glass can be recycled endlessly without losing quality.",
  "Food waste in landfills produces methane, a potent greenhouse gas.",
  "Paper can be recycled 5-7 times before fibers get too short.",
  "Recycling one ton of paper saves 17 trees.",
  "Plastic straws take up to 200 years to decompose.",
  "Metal cans are the most recycled beverage container.",
  "Composting food waste reduces landfill methane by up to 50%.",
  "Recycling plastic uses 75% less energy than making new plastic.",
  "The average person creates 4.4 pounds of waste per day.",
  "About 91% of plastic isn't recycled.",
  "Recycling glass reduces mining waste by 50%.",
  "One recycled tin can saves enough energy to power a radio for 3 hours.",
  "Cardboard can be recycled 7 times on average.",
  "Recycling 1 kg of paper saves 2.5 kg of CO2 emissions.",
  "Aluminum cans can be recycled and back on shelves in 60 days.",
  "Food waste accounts for 8% of global greenhouse gas emissions.",
  "Recycling plastic bottles saves enough energy to power a lightbulb for 6 hours.",
  "Every ton of recycled glass saves 300 kg of CO2.",
]

export const REWARDS = [
  // ── Entry level (50–300 pts = 5–30 bottles) ──
  { id: 1, name: "₹20 Amazon Pay Voucher", cost: 150, emoji: "🛒", description: "Amazon Pay balance added to your account instantly" },
  { id: 2, name: "₹50 Flipkart Gift Card", cost: 350, emoji: "📦", description: "Flipkart gift voucher — shop anything on the platform" },
  { id: 3, name: "₹50 Zomato Food Credit", cost: 350, emoji: "🍕", description: "Zomato credit for your next food delivery order" },
  { id: 4, name: "₹50 Amazon Pay Voucher", cost: 400, emoji: "🛒", description: "Amazon Pay balance — pay bills, shop, recharge" },
  { id: 5, name: "₹100 Swiggy Money", cost: 700, emoji: "🍔", description: "Swiggy money for food delivery and dining out" },
  // ── Mid tier (750–2000 pts) ──
  { id: 6, name: "₹100 Amazon Pay Voucher", cost: 800, emoji: "🛒", description: "₹100 Amazon Pay — shop millions of products" },
  { id: 7, name: "₹100 Flipkart Gift Card", cost: 800, emoji: "📦", description: "Flipkart voucher valid across all categories" },
  { id: 8, name: "₹200 Amazon Pay Voucher", cost: 1500, emoji: "🛒", description: "₹200 Amazon Pay — bigger savings on your purchases" },
  { id: 9, name: "₹250 Myntra Fashion Voucher", cost: 1800, emoji: "👕", description: "Myntra credit for fashion, accessories & more" },
  // ── High tier (2500–5000 pts) ──
  { id: 10, name: "₹500 Amazon Pay Voucher", cost: 3500, emoji: "🛒", description: "₹500 Amazon Pay — major reward for dedicated recyclers" },
  { id: 11, name: "₹500 Flipkart Gift Card", cost: 3500, emoji: "📦", description: "₹500 Flipkart voucher — treat yourself" },
  { id: 12, name: "₹1000 Amazon Pay Voucher", cost: 6500, emoji: "💎", description: "₹1,000 Amazon Pay — our premium reward for eco-champions" },
] as const

export const ACHIEVEMENTS = [
  { id: "first_scan", name: "First Step", desc: "Complete your first waste scan", icon: "🌱", check: (s: number, p: number) => s >= 1 },
  { id: "scout", name: "Eco Scout", desc: "Scan 10 items", icon: "🔍", check: (s: number) => s >= 10 },
  { id: "recycler", name: "Dedicated Recycler", desc: "Scan 50 items", icon: "♻️", check: (s: number) => s >= 50 },
  { id: "master", name: "Waste Master", desc: "Scan 100 items", icon: "🏆", check: (s: number) => s >= 100 },
  { id: "legend", name: "Recycling Legend", desc: "Scan 500 items", icon: "👑", check: (s: number) => s >= 500 },
  { id: "points_100", name: "Point Collector", desc: "Earn 100 EcoPoints", icon: "⭐", check: (s: number, p: number) => p >= 100 },
  { id: "points_500", name: "Eco Saver", desc: "Earn 500 EcoPoints", icon: "💎", check: (s: number, p: number) => p >= 500 },
  { id: "points_1000", name: "Green Investor", desc: "Earn 1,000 EcoPoints", icon: "🌿", check: (s: number, p: number) => p >= 1000 },
  { id: "plastic", name: "Plastic Warrior", desc: "Recycle 10 plastic items", icon: "🛡️", check: (s: number, p: number, m?: Record<string, number>) => (m?.Plastic ?? 0) >= 10 },
  { id: "paper", name: "Paper Saver", desc: "Recycle 10 paper items", icon: "📄", check: (s: number, p: number, m?: Record<string, number>) => (m?.Paper ?? 0) >= 10 },
  { id: "glass", name: "Glass Guardian", desc: "Recycle 10 glass items", icon: "🫙", check: (s: number, p: number, m?: Record<string, number>) => (m?.Glass ?? 0) >= 10 },
  { id: "metal", name: "Metal Miner", desc: "Recycle 10 metal items", icon: "⚙️", check: (s: number, p: number, m?: Record<string, number>) => (m?.Metal ?? 0) >= 10 },
  { id: "food", name: "Compost King", desc: "Sort 10 food waste items", icon: "🍎", check: (s: number, p: number, m?: Record<string, number>) => (m?.["Food Waste"] ?? 0) >= 10 },
] as const

export const MATERIAL_INFO: Record<string, { category: string; bin: string; color: string; tips: string[] }> = {
  Plastic: {
    category: "Recyclable",
    bin: "Blue Bin",
    color: "#f59e0b",
    tips: ["Rinse before recycling", "Remove caps and labels", "Flatten bottles to save space", "Check for resin code #1 or #2"],
  },
  Metal: {
    category: "Recyclable",
    bin: "Blue Bin",
    color: "#64748b",
    tips: ["Rinse food cans thoroughly", "Aluminum foil can be recycled if clean", "Cans can be crushed to save space", "Remove any plastic liners"],
  },
  Glass: {
    category: "Recyclable",
    bin: "Blue Bin",
    color: "#06b6d4",
    tips: ["Rinse bottles and jars", "Remove lids and corks", "Separate by color if your facility requires it", "Never recycle broken windows or mirrors"],
  },
  Paper: {
    category: "Recyclable",
    bin: "Blue Bin",
    color: "#3b82f6",
    tips: ["Keep dry and clean", "Remove plastic windows from envelopes", "Flatten cardboard boxes", "Shred sensitive documents first"],
  },
  "Food Waste": {
    category: "Compostable",
    bin: "Green Bin",
    color: "#16a34a",
    tips: ["Use a countertop compost bin", "Avoid meat and dairy in home compost", "Coffee grounds make excellent compost", "Eggshells add calcium to compost"],
  },
}
