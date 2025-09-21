type Area = string;
type City = Record<string, Area[]>;
type Division = Record<string, City>;

export type DivisionWiseLocations = Division;


export const division_wise_locations: DivisionWiseLocations = {
    "Dhaka Division": {
        "Dhaka City": ["Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Motijheel", "Banani", "Bashundhara", "Mohammadpur", "Tejgaon", "Khilgaon", "Rampura", "Shahbagh", "Puran Dhaka", "Badda", "Farmgate", "Kalabagan", "New Market", "Ramna", "Jatrabari", "Uttarkhan"],
        "Gazipur": ["Tongi", "Sreepur", "Kaliakair", "Kapasia", "Narsingdi"],
        "Narayanganj": ["Fatullah", "Sonargaon", "Rupganj", "Bandar", "Araihazar"],
        "Narsingdi": ["Belabo", "Monohardi", "Raipura", "Shibpur"]
    },
    "Chattogram Division": {
        "Chattogram City": ["Agrabad", "Pahartali", "Halishahar", "Kotwali", "Nasirabad", "Chandgaon", "Panchlaish", "Khulshi", "GEC", "Patenga", "Bakalia", "Muradpur", "Chawk Bazar", "Anwara", "Bayezid"],
        "Cox's Bazar": ["Ukhia", "Teknaf", "Ramu", "Kutupalong", "Maheshkhali", "Cox's Bazar Sadar"],
        "Rangamati": ["Baghaichhari", "Kaptai", "Barkal", "Rajasthali", "Rangamati Sadar"],
        "Feni": ["Feni Sadar", "Parshuram", "Chhagalnaiya", "Daganbhuiyan"]
    },
    "Sylhet Division": {
        "Sylhet City Division": ["Zindabazar", "Amberkhana", "South Surma", "Kotwali", "Noyagaon", "Bimanbandar", "Shibganj"],
        "Moulvibazar": ["Sreemangal", "Kulaura", "Barlekha", "Rajnagar"],
        "Habiganj": ["Madhabpur", "Ajmiriganj", "Baniachang", "Lakhai"]
    },
    "Rajshahi Division": {
        "Rajshahi City": ["Motihar", "Boalia", "Rajpara", "Shah Mokhdum", "Paba", "Godagari"],
        "Pabna": ["Ishwardi", "Chatmohar", "Bera", "Santhia"],
        "Natore": ["Baraigram", "Singra", "Bagatipara", "Lalpur"]
    },
    "Khulna Division": {
        "Khulna City": ["Sonadanga", "Khalishpur", "Daulatpur", "Kotwali", "Harintana", "Khalishpur Bazar"],
        "Jessore": ["Jashore Sadar", "Bagherpara", "Chaugachha", "Keshabpur"],
        "Satkhira": ["Shyamnagar", "Tala", "Debhata", "Kaliganj"]
    },
    "Barishal Division": {
        "Barishal City": ["Band Road", "Kaunia", "Katorbazar", "College Road"],
        "Bhola": ["Char Fasson", "Lalmohan", "Bhola Sadar", "Borhanuddin"],
        "Patuakhali": ["Kuakata", "Dumki", "Patuakhali Sadar", "Mirzaganj"]
    },
    "Rangpur Division": {
        "Rangpur City": ["Modern", "College Para", "Kochukhet", "Lalbagh", "Haragachh"],
        "Dinajpur": ["Birganj", "Phulbari", "Dinajpur Sadar", "Parbatipur"],
        "Kurigram": ["Ulipur", "Chilmari", "Kurigram Sadar", "Phulbari"]
    },
    "Mymensingh Division": {
        "Mymensingh City": ["Ganginapar", "Charpara", "Trishal Road", "Sheshmor", "Kewatkhali"],
        "Jamalpur": ["Islampur", "Sarishabari", "Madarganj", "Dewanganj"],
        "Netrokona": ["Kendua", "Madan", "Netrokona Sadar", "Atpara"]
    }
}


