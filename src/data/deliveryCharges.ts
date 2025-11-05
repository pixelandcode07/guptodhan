// Sample delivery charge data for all Bangladeshi districts
const deliveryCharges = [
  // Dhaka Division
  { divisionName: "Dhaka", districtName: "Dhaka", districtNameBangla: "ঢাকা", deliveryCharge: 80 },
  { divisionName: "Dhaka", districtName: "Gazipur", districtNameBangla: "গাজীপুর", deliveryCharge: 90 },
  { divisionName: "Dhaka", districtName: "Narayanganj", districtNameBangla: "নারায়ণগঞ্জ", deliveryCharge: 85 },
  { divisionName: "Dhaka", districtName: "Tangail", districtNameBangla: "টাঙ্গাইল", deliveryCharge: 100 },
  { divisionName: "Dhaka", districtName: "Kishoreganj", districtNameBangla: "কিশোরগঞ্জ", deliveryCharge: 110 },
  { divisionName: "Dhaka", districtName: "Manikganj", districtNameBangla: "মানিকগঞ্জ", deliveryCharge: 95 },
  { divisionName: "Dhaka", districtName: "Munshiganj", districtNameBangla: "মুন্সিগঞ্জ", deliveryCharge: 90 },
  { divisionName: "Dhaka", districtName: "Narsingdi", districtNameBangla: "নরসিংদী", deliveryCharge: 95 },
  { divisionName: "Dhaka", districtName: "Faridpur", districtNameBangla: "ফরিদপুর", deliveryCharge: 120 },
  { divisionName: "Dhaka", districtName: "Gopalganj", districtNameBangla: "গোপালগঞ্জ", deliveryCharge: 130 },
  { divisionName: "Dhaka", districtName: "Madaripur", districtNameBangla: "মাদারীপুর", deliveryCharge: 125 },
  { divisionName: "Dhaka", districtName: "Rajbari", districtNameBangla: "রাজবাড়ী", deliveryCharge: 135 },
  { divisionName: "Dhaka", districtName: "Shariatpur", districtNameBangla: "শরীয়তপুর", deliveryCharge: 130 },

  // Chattogram Division
  { divisionName: "Chattogram", districtName: "Chattogram", districtNameBangla: "চট্টগ্রাম", deliveryCharge: 120 },
  { divisionName: "Chattogram", districtName: "Cox's Bazar", districtNameBangla: "কক্সবাজার", deliveryCharge: 150 },
  { divisionName: "Chattogram", districtName: "Bandarban", districtNameBangla: "বান্দরবান", deliveryCharge: 160 },
  { divisionName: "Chattogram", districtName: "Rangamati", districtNameBangla: "রাঙ্গামাটি", deliveryCharge: 155 },
  { divisionName: "Chattogram", districtName: "Khagrachari", districtNameBangla: "খাগড়াছড়ি", deliveryCharge: 150 },
  { divisionName: "Chattogram", districtName: "Feni", districtNameBangla: "ফেনী", deliveryCharge: 110 },
  { divisionName: "Chattogram", districtName: "Lakshmipur", districtNameBangla: "লক্ষ্মীপুর", deliveryCharge: 115 },
  { divisionName: "Chattogram", districtName: "Noakhali", districtNameBangla: "নোয়াখালী", deliveryCharge: 120 },
  { divisionName: "Chattogram", districtName: "Chandpur", districtNameBangla: "চাঁদপুর", deliveryCharge: 110 },
  { divisionName: "Chattogram", districtName: "Cumilla", districtNameBangla: "কুমিল্লা", deliveryCharge: 100 },
  { divisionName: "Chattogram", districtName: "Brahmanbaria", districtNameBangla: "ব্রাহ্মণবাড়িয়া", deliveryCharge: 105 },

  // Sylhet Division
  { divisionName: "Sylhet", districtName: "Sylhet", districtNameBangla: "সিলেট", deliveryCharge: 140 },
  { divisionName: "Sylhet", districtName: "Moulvibazar", districtNameBangla: "মৌলভীবাজার", deliveryCharge: 145 },
  { divisionName: "Sylhet", districtName: "Habiganj", districtNameBangla: "হবিগঞ্জ", deliveryCharge: 150 },
  { divisionName: "Sylhet", districtName: "Sunamganj", districtNameBangla: "সুনামগঞ্জ", deliveryCharge: 155 },

  // Rajshahi Division
  { divisionName: "Rajshahi", districtName: "Rajshahi", districtNameBangla: "রাজশাহী", deliveryCharge: 160 },
  { divisionName: "Rajshahi", districtName: "Natore", districtNameBangla: "নাটোর", deliveryCharge: 155 },
  { divisionName: "Rajshahi", districtName: "Nawabganj", districtNameBangla: "নওগাঁ", deliveryCharge: 170 },
  { divisionName: "Rajshahi", districtName: "Pabna", districtNameBangla: "পাবনা", deliveryCharge: 165 },
  { divisionName: "Rajshahi", districtName: "Sirajganj", districtNameBangla: "সিরাজগঞ্জ", deliveryCharge: 160 },
  { divisionName: "Rajshahi", districtName: "Bogura", districtNameBangla: "বগুড়া", deliveryCharge: 155 },
  { divisionName: "Rajshahi", districtName: "Joypurhat", districtNameBangla: "জয়পুরহাট", deliveryCharge: 150 },

  // Khulna Division
  { divisionName: "Khulna", districtName: "Khulna", districtNameBangla: "খুলনা", deliveryCharge: 180 },
  { divisionName: "Khulna", districtName: "Jessore", districtNameBangla: "যশোর", deliveryCharge: 175 },
  { divisionName: "Khulna", districtName: "Jhenaidah", districtNameBangla: "ঝিনাইদহ", deliveryCharge: 170 },
  { divisionName: "Khulna", districtName: "Magura", districtNameBangla: "মাগুরা", deliveryCharge: 165 },
  { divisionName: "Khulna", districtName: "Narail", districtNameBangla: "নড়াইল", deliveryCharge: 160 },
  { divisionName: "Khulna", districtName: "Kushtia", districtNameBangla: "কুষ্টিয়া", deliveryCharge: 155 },
  { divisionName: "Khulna", districtName: "Meherpur", districtNameBangla: "মেহেরপুর", deliveryCharge: 150 },
  { divisionName: "Khulna", districtName: "Chuadanga", districtNameBangla: "চুয়াডাঙ্গা", deliveryCharge: 145 },
  { divisionName: "Khulna", districtName: "Satkhira", districtNameBangla: "সাতক্ষীরা", deliveryCharge: 185 },

  // Barishal Division
  { divisionName: "Barishal", districtName: "Barishal", districtNameBangla: "বরিশাল", deliveryCharge: 200 },
  { divisionName: "Barishal", districtName: "Bhola", districtNameBangla: "ভোলা", deliveryCharge: 210 },
  { divisionName: "Barishal", districtName: "Patuakhali", districtNameBangla: "পটুয়াখালী", deliveryCharge: 205 },
  { divisionName: "Barishal", districtName: "Barguna", districtNameBangla: "বরগুনা", deliveryCharge: 215 },
  { divisionName: "Barishal", districtName: "Pirojpur", districtNameBangla: "পিরোজপুর", deliveryCharge: 200 },
  { divisionName: "Barishal", districtName: "Jhalokathi", districtNameBangla: "ঝালকাঠি", deliveryCharge: 195 },

  // Rangpur Division
  { divisionName: "Rangpur", districtName: "Rangpur", districtNameBangla: "রংপুর", deliveryCharge: 220 },
  { divisionName: "Rangpur", districtName: "Dinajpur", districtNameBangla: "দিনাজপুর", deliveryCharge: 225 },
  { divisionName: "Rangpur", districtName: "Gaibandha", districtNameBangla: "গাইবান্ধা", deliveryCharge: 220 },
  { divisionName: "Rangpur", districtName: "Kurigram", districtNameBangla: "কুড়িগ্রাম", deliveryCharge: 230 },
  { divisionName: "Rangpur", districtName: "Lalmonirhat", districtNameBangla: "লালমনিরহাট", deliveryCharge: 235 },
  { divisionName: "Rangpur", districtName: "Nilphamari", districtNameBangla: "নীলফামারী", deliveryCharge: 240 },
  { divisionName: "Rangpur", districtName: "Panchagarh", districtNameBangla: "পঞ্চগড়", deliveryCharge: 245 },
  { divisionName: "Rangpur", districtName: "Thakurgaon", districtNameBangla: "ঠাকুরগাঁও", deliveryCharge: 250 },

  // Mymensingh Division
  { divisionName: "Mymensingh", districtName: "Mymensingh", districtNameBangla: "ময়মনসিংহ", deliveryCharge: 120 },
  { divisionName: "Mymensingh", districtName: "Jamalpur", districtNameBangla: "জামালপুর", deliveryCharge: 125 },
  { divisionName: "Mymensingh", districtName: "Netrokona", districtNameBangla: "নেত্রকোণা", deliveryCharge: 130 },
  { divisionName: "Mymensingh", districtName: "Sherpur", districtNameBangla: "শেরপুর", deliveryCharge: 115 }
];

// Export for use in API calls
export default deliveryCharges;