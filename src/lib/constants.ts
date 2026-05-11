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
  { id: 1, name: "Coffee Discount", cost: 50, emoji: "☕", description: "50% off your next coffee" },
  { id: 2, name: "Eco Tote Bag", cost: 100, emoji: "👜", description: "Reusable organic cotton tote" },
  { id: 3, name: "Plant Sapling", cost: 150, emoji: "🌱", description: "A real sapling planted in your name" },
  { id: 4, name: "Eco T-Shirt", cost: 200, emoji: "👕", description: "Organic cotton eco-awareness tee" },
  { id: 5, name: "Bamboo Utensils", cost: 250, emoji: "🥢", description: "Portable bamboo cutlery set" },
  { id: 6, name: "Reusable Water Bottle", cost: 300, emoji: "🧴", description: "Stainless steel insulated bottle" },
] as const

export const MATERIAL_COLORS: Record<Material, { bg: string; text: string; badge: string }> = {
  Plastic: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-300", badge: "bg-amber-500" },
  Metal: { bg: "bg-slate-100 dark:bg-slate-800/40", text: "text-slate-700 dark:text-slate-300", badge: "bg-slate-500" },
  Glass: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-800 dark:text-cyan-300", badge: "bg-cyan-500" },
  Paper: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-300", badge: "bg-blue-500" },
  "Food Waste": { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-300", badge: "bg-green-600" },
}
