type Area = string;
type City = Record<string, Area[]>;
type Division = Record<string, City>;

export type DivisionWiseLocations = Division;


export const division_wise_locations: DivisionWiseLocations = {
    "Dhaka Division": {
        "Dhaka City": ["Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Motijheel"],
        Gazipur: ["Tongi", "Sreepur", "Kaliakair"],
        Narayanganj: ["Fatullah", "Sonargaon", "Rupganj"],
    },
    "Chattogram Division": {
        "Chattogram City": ["Agrabad", "Pahartali", "Halishahar", "Kotwali"],
        "Cox's Bazar": ["Ukhia", "Teknaf", "Ramu"],
        Rangamati: ["Baghaichhari", "Kaptai", "Barkal"],
    },
    "Sylhet Division": {
        "Sylhet City": ["Zindabazar", "Amberkhana", "South Surma"],
        Moulvibazar: ["Sreemangal", "Kulaura"],
        Habiganj: ["Madhabpur", "Ajmiriganj"],
    },
    "Rajshahi Division": {
        "Rajshahi City": ["Motihar", "Boalia", "Rajpara"],
        Pabna: ["Ishwardi", "Chatmohar"],
        Natore: ["Baraigram", "Singra"],
    },
    "Khulna Division": {
        "Khulna City": ["Sonadanga", "Khalishpur", "Daulatpur"],
        Jessore: ["Jashore Sadar", "Bagherpara"],
        Satkhira: ["Shyamnagar", "Tala"],
    },
    "Barishal Division": {
        "Barishal City": ["Band Road", "Kaunia"],
        Bhola: ["Char Fasson", "Lalmohan"],
        Patuakhali: ["Kuakata", "Dumki"],
    },
    "Rangpur Division": {
        "Rangpur City": ["Modern", "College Para"],
        Dinajpur: ["Birganj", "Phulbari"],
        Kurigram: ["Ulipur", "Chilmari"],
    },
    "Mymensingh Division": {
        "Mymensingh City": ["Ganginapar", "Charpara"],
        Jamalpur: ["Islampur", "Sarishabari"],
        Netrokona: ["Kendua", "Madan"],
    },
};


