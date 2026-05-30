export const categories = {
  "Fashion & Apparel": {
    icon: "👕",
    subcategories: [
      "Men Clothing",
      "Women Clothing",
      "Kids Wear",
      "Footwear",
      "Accessories"
    ]
  },
  "Electronics": {
    icon: "📱",
    subcategories: [
      "Mobiles & Smartphones",
      "Laptops & Computers",
      "Tablets",
      "Headphones & Earbuds",
      "Smart Watches",
      "Cameras",
      "Accessories"
    ]
  },
  "Home & Living": {
    icon: "🏠",
    subcategories: [
      "Furniture",
      "Home Decor",
      "Kitchen Appliances",
      "Bedding & Curtains",
      "Lighting"
    ]
  },
  "Grocery & Daily Needs": {
    icon: "🍔",
    subcategories: [
      "Fruits & Vegetables",
      "Snacks & Beverages",
      "Dairy Products",
      "Personal Care",
      "Household Essentials"
    ]
  },
  "Beauty & Personal Care": {
    icon: "💄",
    subcategories: [
      "Makeup",
      "Skincare",
      "Hair Care",
      "Perfumes & Deodorants",
      "Grooming Products"
    ]
  },
  "Books & Stationery": {
    icon: "📚",
    subcategories: [
      "Academic Books",
      "Novels",
      "Competitive Exam Books",
      "Notebooks",
      "Office Supplies"
    ]
  },
  "Toys, Kids & Baby": {
    icon: "🧸",
    subcategories: [
      "Toys",
      "Baby Clothing",
      "Baby Care Products",
      "School Items"
    ]
  },
  "Sports & Fitness": {
    icon: "🏋️",
    subcategories: [
      "Gym Equipment",
      "Sports Gear",
      "Fitness Accessories",
      "Yoga Products"
    ]
  },
  "Automobile Accessories": {
    icon: "🚗",
    subcategories: [
      "Bike Accessories",
      "Car Accessories",
      "Helmets",
      "Tools & Parts"
    ]
  },
  "Gaming & Entertainment": {
    icon: "🎮",
    subcategories: [
      "Gaming Consoles",
      "Video Games",
      "Gaming Accessories",
      "VR Devices"
    ]
  }
};

export const getCategoryIcon = (category) => {
  return categories[category]?.icon || "📦";
};

export const getSubcategories = (category) => {
  return categories[category]?.subcategories || [];
};

export const getAllCategories = () => {
  return Object.keys(categories);
};
