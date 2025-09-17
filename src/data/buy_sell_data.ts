export interface Subcategory {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    logo: string;
    subcategories: Subcategory[];
}



export const categories: Category[] = [
    {
        id: 1,
        name: "Phone",
        logo: "/img/buysell/phone.png",
        subcategories: [
            { id: 1, name: "Mobile Phones" },
            { id: 2, name: "Tablets & iPads" },
            { id: 3, name: "Mobile Phone Accessories" },
            { id: 4, name: "Wearable Tech" },
            { id: 5, name: "Phone Parts" }
        ]
    },
    {
        id: 2,
        name: "Device & Gadgets",
        logo: "/img/buysell/gadgets.png",
        subcategories: [
            { id: 1, name: "Cameras & Drones" },
            { id: 2, name: "Laptops & Computers" },
            { id: 3, name: "Computer Accessories" },
            { id: 4, name: "Printers & Scanners" },
            { id: 5, name: "Audio & Sound Systems" },
            { id: 6, name: "Gaming Consoles & Accessories" }
        ]
    },
    {
        id: 3,
        name: "Electronics",
        logo: "/img/buysell/electronics.png",
        subcategories: [
            { id: 1, name: "Televisions" },
            { id: 2, name: "Home Appliances" },
            { id: 3, name: "Kitchen Appliances" },
            { id: 4, name: "Video & Projectors" },
            { id: 5, name: "Security & Surveillance" }
        ]
    },
    {
        id: 4,
        name: "Property",
        logo: "/img/buysell/property.png",
        subcategories: [
            { id: 1, name: "Apartments & Flats" },
            { id: 2, name: "Houses" },
            { id: 3, name: "Commercial Space" }
        ]
    },
    {
        id: 5,
        name: "Furniture",
        logo: "/img/buysell/furniture.png",
        subcategories: [
            { id: 1, name: "Living Room Furniture" },
            { id: 2, name: "Bedroom Furniture" },
            { id: 3, name: "Kitchen & Dining" },
            { id: 4, name: "Office Furniture" },
            { id: 5, name: "Outdoor Furniture" }
        ]
    },
    {
        id: 6,
        name: "Essentials",
        logo: "/img/buysell/essentials.png",
        subcategories: [
            { id: 1, name: "Health & Beauty Products" },
            { id: 2, name: "Baby & Kids Products" },
            { id: 3, name: "Home & Cleaning Supplies" },
            { id: 4, name: "Pet Supplies" },
            { id: 5, name: "Grocery & Food Items" }
        ]
    },
    {
        id: 7,
        name: "Vehicle's",
        logo: "/img/buysell/vehicles.png",
        subcategories: [
            { id: 1, name: "Cars" },
            { id: 2, name: "Motorcycles & Scooters" },
            { id: 3, name: "Bicycles" },
            { id: 4, name: "Commercial Vehicles" },
            { id: 5, name: "Auto Parts & Accessories" }
        ]
    },
    {
        id: 8,
        name: "Women's Fashion",
        logo: "/img/buysell/women-fashion.png",
        subcategories: [
            { id: 1, name: "Clothing" },
            { id: 2, name: "Shoes" },
            { id: 3, name: "Bags & Wallets" },
            { id: 4, name: "Jewelry & Accessories" },
            { id: 5, name: "Watches" }
        ]
    },
    {
        id: 9,
        name: "Men's Fashion",
        logo: "/img/buysell/men-fashion.png",
        subcategories: [
            { id: 1, name: "Clothing" },
            { id: 2, name: "Shoes" },
            { id: 3, name: "Watches & Accessories" },
            { id: 4, name: "Grooming Products" },
            { id: 5, name: "Suits & Blazers" }
        ]
    },
    {
        id: 10,
        name: "Agriculture",
        logo: "/img/buysell/agriculture.png",
        subcategories: [
            { id: 1, name: "Crops, Grains & Produce" },
            { id: 2, name: "Livestock & Poultry" },
            { id: 3, name: "Farming Tools & Machinery" },
            { id: 4, name: "Seeds & Fertilizers" },
            { id: 5, name: "Fishery & Aquaculture" }
        ]
    },
    {
        id: 11,
        name: "Educations",
        logo: "/img/buysell/education.png",
        subcategories: [
            { id: 1, name: "Textbooks & Study Materials" }
        ]
    },
    {
        id: 12,
        name: "Sports",
        logo: "/img/buysell/sports.png",
        subcategories: [
            { id: 1, name: "Fitness & Gym Equipment" },
            { id: 2, name: "Cricket" },
            { id: 3, name: "Football" },
            { id: 4, name: "Bicycles & Cycling Gear" },
            { id: 5, name: "Outdoor & Camping Equipment" }
        ]
    }
];

