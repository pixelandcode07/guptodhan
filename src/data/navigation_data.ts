type NavigationDataType = {
    title: string
    subtitles: {
        title: string
        href: string
    }[]
}

export const navigationData: NavigationDataType[] = [
    {
        title: "Mobile",
        subtitles: [
            { title: "Smartphones", href: "/mobile/smartphones" },
            { title: "Feature Phones", href: "/mobile/feature-phones" },
            { title: "Accessories", href: "/mobile/accessories" },
            { title: "Tablets", href: "/mobile/tablets" },
        ],
    },
    {
        title: "Gadgets",
        subtitles: [
            { title: "Smart Watches", href: "/gadgets/smart-watches" },
            { title: "Fitness Bands", href: "/gadgets/fitness-bands" },
            { title: "VR Headsets", href: "/gadgets/vr-headsets" },
            { title: "Power Banks", href: "/gadgets/power-banks" },
        ],
    },
    {
        title: "Electronics",
        subtitles: [
            { title: "Televisions", href: "/electronics/televisions" },
            { title: "Cameras", href: "/electronics/cameras" },
            { title: "Speakers", href: "/electronics/speakers" },
            { title: "Gaming Consoles", href: "/electronics/gaming-consoles" },
        ],
    },
    {
        title: "Men's Fashion",
        subtitles: [
            { title: "Shirts", href: "/mens-fashion/shirts" },
            { title: "Trousers", href: "/mens-fashion/trousers" },
            { title: "Watches", href: "/mens-fashion/watches" },
            { title: "Sunglasses", href: "/mens-fashion/sunglasses" },
        ],
    },
    {
        title: "Women Fashion",
        subtitles: [
            { title: "Dresses", href: "/women-fashion/dresses" },
            { title: "Handbags", href: "/women-fashion/handbags" },
            { title: "Jewelry", href: "/women-fashion/jewelry" },
            { title: "Cosmetics", href: "/women-fashion/cosmetics" },
        ],
    },
    {
        title: "Shoes",
        subtitles: [
            { title: "Sneakers", href: "/shoes/sneakers" },
            { title: "Formal Shoes", href: "/shoes/formal-shoes" },
            { title: "Sandals", href: "/shoes/sandals" },
            { title: "Boots", href: "/shoes/boots" },
        ],
    },
    {
        title: "Computer",
        subtitles: [
            { title: "Desktops", href: "/computer/desktops" },
            { title: "Monitors", href: "/computer/monitors" },
            { title: "Keyboards", href: "/computer/keyboards" },
            { title: "Mice", href: "/computer/mice" },
        ],
    },
    // {
    //     title: "Laptop",
    //     subtitles: [
    //         { title: "Gaming Laptops", href: "/laptop/gaming-laptops" },
    //         { title: "Business Laptops", href: "/laptop/business-laptops" },
    //         { title: "2-in-1 Laptops", href: "/laptop/2-in-1-laptops" },
    //         { title: "Ultrabooks", href: "/laptop/ultrabooks" },
    //     ],
    // },
    // {
    //     title: "Furniture",
    //     subtitles: [
    //         { title: "Sofas", href: "/furniture/sofas" },
    //         { title: "Beds", href: "/furniture/beds" },
    //         { title: "Chairs", href: "/furniture/chairs" },
    //         { title: "Tables", href: "/furniture/tables" },
    //     ],
    // },
    // {
    //     title: "Machine",
    //     subtitles: [
    //         { title: "Washing Machines", href: "/machine/washing-machines" },
    //         { title: "Refrigerators", href: "/machine/refrigerators" },
    //         { title: "Microwaves", href: "/machine/microwaves" },
    //         { title: "Air Conditioners", href: "/machine/air-conditioners" },
    //     ],
    // },
    {
        title: "More",
        subtitles: [
            { title: "Books", href: "/more/books" },
            { title: "Toys", href: "/more/toys" },
            { title: "Sports", href: "/more/sports" },
            { title: "Groceries", href: "/more/groceries" },
        ],
    },
]
