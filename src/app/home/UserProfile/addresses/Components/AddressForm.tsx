'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Complete Bangladesh Location Data
const locationData: Record<string, Record<string, string[]>> = {
  "Dhaka": {
    "Dhaka": ["Savar", "Dhamrai", "Keraniganj", "Nawabganj", "Dohar", "Mirpur", "Uttara", "Gulshan", "Dhanmondi", "Mohammadpur", "Badda", "Motijheel", "Banasree", "Cantonment", "Paltan"],
    "Gazipur": ["Gazipur Sadar", "Tongi", "Kaliakair", "Kapasia", "Sreepur"],
    "Narayanganj": ["Narayanganj Sadar", "Bandar", "Sonargaon", "Araihazar", "Rupganj", "Fatullah", "Siddhirganj"],
    "Narsingdi": ["Narsingdi Sadar", "Palash", "Shibpur", "Monohardi", "Belabo", "Raipura"],
    "Faridpur": ["Faridpur Sadar", "Bhanga", "Boalmari", "Sadarpur", "Nagarkanda", "Alfanga", "Madhukhali"],
    "Gopalganj": ["Gopalganj Sadar", "Tungipara", "Kotalipara", "Kashiani", "Muksudpur"],
    "Madaripur": ["Madaripur Sadar", "Shibchar", "Rajoir", "Kalkini"],
    "Shariatpur": ["Shariatpur Sadar", "Naria", "Zajira", "Bhedarganj", "Gosairhat", "Damudya"],
    "Tangail": ["Tangail Sadar", "Mirzapur", "Gopalpur", "Ghatail", "Madhupur", "Kalihati", "Bhuapur"],
    "Kishoreganj": ["Kishoreganj Sadar", "Bhairab", "Bajitpur", "Katiadi", "Hossainpur", "Pakundia"],
    "Manikganj": ["Manikganj Sadar", "Singair", "Saturia", "Ghior", "Shivalaya"],
    "Munshiganj": ["Munshiganj Sadar", "Sirajdikhan", "Sreenagar", "Lauhajang", "Gazaria", "Tongibari"],
    "Rajbari": ["Rajbari Sadar", "Goalanda", "Pangsha", "Baliakandi", "Kalukhali"]
  },
  "Chattogram": {
    "Chattogram": ["Chattogram Sadar", "Pahartali", "Double Mooring", "Hathazari", "Patiya", "Boalkhali", "Chandanaish", "Anwara", "Banshkhali", "Satkania", "Lohagara", "Fatikchhari", "Raozan", "Rangunia", "Mirsharai", "Sitakunda", "Sandwip", "Roufabad"],
    "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Maheshkhali", "Teknaf", "Ukhia", "Ramu", "Pekua", "Kutubdia"],
    "Bandarban": ["Bandarban Sadar", "Lama", "Alikadam", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"],
    "Rangamati": ["Rangamati Sadar", "Kaptai", "Kawkhali", "Langadu", "Naniarchar", "Barkal", "Baghaichhari"],
    "Khagrachhari": ["Khagrachhari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari"],
    "Cumilla": ["Cumilla Sadar", "Laksam", "Daudkandi", "Chauddagram", "Brahmanpara", "Burichang", "Chandina", "Homna", "Muradnagar", "Barura"],
    "Brahmanbaria": ["Brahmanbaria Sadar", "Kasba", "Akhaura", "Ashuganj", "Banchharampur", "Nabinagar", "Nasirnagar"],
    "Chandpur": ["Chandpur Sadar", "Hajiganj", "Matlab", "Faridganj", "Kachua", "Haimchar"],
    "Feni": ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Sonagazi"],
    "Noakhali": ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Senbagh", "Hatiya"],
    "Lakshmipur": ["Lakshmipur Sadar", "Ramganj", "Raipur", "Ramgati"]
  },
  "Sylhet": {
    "Sylhet": ["Sylhet Sadar", "South Surma", "Bishwanath", "Golapganj", "Beanibazar", "Ziganj", "Balaganj", "Fenchuganj", "Gowainghat", "Jaintiapur", "Kanaighat"],
    "Moulvibazar": ["Moulvibazar Sadar", "Sreemangal", "Kulaura", "Kamalganj", "Barlekha", "Rajnagar", "Juri"],
    "Habiganj": ["Habiganj Sadar", "Chunarughat", "Madhabpur", "Nabiganj", "Baniachong", "Ajmiriganj", "Bahubal"],
    "Sunamganj": ["Sunamganj Sadar", "Chhatak", "Jagannathpur", "Bishwamvarpur", "Derai", "Dharamapasha", "Dowarabazar", "Jamalganj", "Sullah", "Tahirpur"]
  },
  "Rajshahi": {
    "Rajshahi": ["Rajshahi Sadar", "Godagari", "Tanore", "Bagmara", "Puthia", "Charghat", "Bagha", "Mohanpur", "Durgapur"],
    "Natore": ["Natore Sadar", "Singra", "Baraigram", "Bagatipara", "Gurudaspur", "Lalpur"],
    "Naogaon": ["Naogaon Sadar", "Patnitala", "Niamatpur", "Badalgachhi", "Dhamoirhat", "Manda", "Mohadevpur", "Porsha", "Raninagar", "Sapahar"],
    "Chapainawabganj": ["Chapainawabganj Sadar", "Shibganj", "Bholahat", "Gomastapur", "Nachole"],
    "Pabna": ["Pabna Sadar", "Ishwardi", "Sujanagar", "Atgharia", "Bera", "Chatmohar", "Santhia"],
    "Sirajganj": ["Sirajganj Sadar", "Ullahpara", "Shahjadpur", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Tarash"],
    "Bogura": ["Bogura Sadar", "Sherpur", "Adamdighi", "Dhunat", "Dupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi"],
    "Joypurhat": ["Joypurhat Sadar", "Panchbibi", "Akkelpur", "Kalai", "Khetlal"]
  },
  "Khulna": {
    "Khulna": ["Khulna Sadar", "Dumuria", "Phultala", "Batiaghata", "Dacope", "Paikgachha", "Koyra", "Terokhada", "Rupsha", "Dighalia"],
    "Bagerhat": ["Bagerhat Sadar", "Mongla", "Morrelganj", "Fakirhat", "Chitalmari", "Mollahat", "Rampal", "Sarankhola"],
    "Satkhira": ["Satkhira Sadar", "Tala", "Shyamnagar", "Assasuni", "Debhata", "Kalaroa"],
    "Jashore": ["Jashore Sadar", "Abhaynagar", "Jhikargachha", "Navaron", "Chaugachha", "Bagherpara", "Keshabpur", "Manirampur"],
    "Narail": ["Narail Sadar", "Kalia"],
    "Magura": ["Magura Sadar", "Mohammadpur", "Shalikha"],
    "Jhenaidah": ["Jhenaidah Sadar", "Shailkupa", "Harinakunda", "Kotchandpur", "Maheshpur"],
    "Chuadanga": ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
    "Kushtia": ["Kushtia Sadar", "Bheramara", "Kumarkhali", "Daulatpur", "Khoksa"],
    "Meherpur": ["Meherpur Sadar", "Gangni", "Mujibnagar"]
  },
  "Barishal": {
    "Barishal": ["Barishal Sadar", "Bakerganj", "Babuganj", "Wazirpur", "Banaripara", "Gournadi", "Agailjhara", "Muladi", "Hizla", "Mehendiganj"],
    "Bhola": ["Bhola Sadar", "Borhanuddin", "Char Fasson", "Lalmohan", "Daulatkhan", "Manpura", "Tazumuddin"],
    "Patuakhali": ["Patuakhali Sadar", "Bauphal", "Galachipa", "Dashmina", "Kalapara", "Dumki", "Mirzaganj"],
    "Barguna": ["Barguna Sadar", "Amtali", "Patharghata", "Bamna", "Betagi", "Taltali"],
    "Pirojpur": ["Pirojpur Sadar", "Bhandaria", "Mathbaria", "Swarupkati", "Kaukhali", "Nazirpur", "Zianagar"],
    "Jhalokati": ["Jhalokati Sadar", "Nalchity", "Rajapur", "Kathalia"]
  },
  "Rangpur": {
    "Rangpur": ["Rangpur Sadar", "Badarganj", "Mithapukur", "Taraganj", "Gangachhara", "Kaunia", "Pirgachha"],
    "Dinajpur": ["Dinajpur Sadar", "Birganj", "Kaharole", "Biral", "Parbatipur", "Phulbari", "Ghoraghat", "Bochaganj", "Chirirbandar", "Hakimpur", "Khansama"],
    "Thakurgaon": ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Ranisankail"],
    "Panchagarh": ["Panchagarh Sadar", "Boda", "Debiganj", "Tetulia", "Atwari"],
    "Nilphamari": ["Nilphamari Sadar", "Saidpur", "Domar", "Dimla", "Jaldhaka"],
    "Kurigram": ["Kurigram Sadar", "Ulipur", "Nageshwari", "Bhurungamari", "Rajarhat", "Chilmari", "Rajibpur", "Rowmari"],
    "Lalmonirhat": ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Patgram"],
    "Gaibandha": ["Gaibandha Sadar", "Sadullapur", "Palashbari", "Gobindaganj", "Sundarganj", "Phulchhari", "Saghata"]
  },
  "Mymensingh": {
    "Mymensingh": ["Mymensingh Sadar", "Muktagachha", "Fulbaria", "Trishal", "Bhaluka", "Gaffargaon", "Nandail", "Ishwarganj", "Gouripur", "Phulpur", "Haluaghat", "Dhobaura", "Tarakanda"],
    "Jamalpur": ["Jamalpur Sadar", "Melandaha", "Islampur", "Dewanganj", "Sarishabari", "Madarganj", "Baksiganj"],
    "Sherpur": ["Sherpur Sadar", "Nakla", "Sreebardi", "Jhenaigati", "Nalitabari"],
    "Netrokona": ["Netrokona Sadar", "Kendua", "Madan", "Mohanganj", "Barhatta", "Kalmakanda", "Purbadhala", "Durgapur", "Atpara", "Khaliajuri"]
  }
};

type AddressFormProps = {
  initialData?: any;
  onCancel: () => void;
  onSave: (data: any) => void;
};

// Helper function to safely parse incoming initialData
const getParsedInitialData = (data: any) => {
  if (!data) return {};
  try {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    if (Array.isArray(parsedData) && parsedData.length > 0) return parsedData[0];
    if (typeof parsedData === 'object' && parsedData !== null) return parsedData;
  } catch (error) {
    console.error("Failed to parse initialData:", error);
  }
  return {};
};

export default function AddAddressForm({
  initialData,
  onCancel,
  onSave,
}: AddressFormProps) {
  
  const parsedData = getParsedInitialData(initialData);

  const [formData, setFormData] = useState({
    fullName: parsedData.fullName || '',
    phone: parsedData.phone || '',
    landmark: parsedData.landmark || '',
    province: parsedData.province || '',
    city: parsedData.city || '',
    zone: parsedData.zone || '',
    address: parsedData.address || '',
    addressType: parsedData.addressType || 'Home',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Reset dependencies when parent changes
      if (name === 'province') {
        newData.city = '';
        newData.zone = '';
      } else if (name === 'city') {
        newData.zone = '';
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.province || !formData.city || !formData.zone) {
      alert('Please fill all required fields including location dropdowns.');
      return;
    }
    onSave(formData);
  };

  // Dynamically calculate options based on current selection
  const regions = Object.keys(locationData);
  const cities = formData.province ? Object.keys(locationData[formData.province] || {}) : [];
  const zones = (formData.province && formData.city) ? (locationData[formData.province][formData.city] || []) : [];

  return (
    <form onSubmit={handleSubmit} className="bg-white space-y-6 border p-6 rounded-md shadow-sm">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold">
          {initialData ? 'Edit Address' : 'Add New Address'}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name *</label>
            <Input name="fullName" value={formData.fullName} onChange={handleInputChange} required className="rounded-none mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone Number *</label>
            <Input name="phone" value={formData.phone} onChange={handleInputChange} required className="rounded-none mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Landmark (Optional)</label>
            <Input name="landmark" value={formData.landmark} onChange={handleInputChange} className="rounded-none mt-1" />
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Region *</label>
              <Select value={formData.province} onValueChange={(val) => handleSelectChange('province', val)}>
                <SelectTrigger className="rounded-none mt-1"><SelectValue placeholder="Select Region" /></SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">City *</label>
              <Select disabled={!formData.province} value={formData.city} onValueChange={(val) => handleSelectChange('city', val)}>
                <SelectTrigger className="rounded-none mt-1"><SelectValue placeholder="Select City" /></SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Zone / Area *</label>
            <Select disabled={!formData.city} value={formData.zone} onValueChange={(val) => handleSelectChange('zone', val)}>
              <SelectTrigger className="rounded-none mt-1"><SelectValue placeholder="Select Zone/Area" /></SelectTrigger>
              <SelectContent>
                {zones.map((zone) => (
                  <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Detailed Address *</label>
            <Textarea name="address" value={formData.address} onChange={handleInputChange} required className="rounded-none mt-1" placeholder="House, Road, Block..." />
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="button" 
              variant={formData.addressType === 'Home' ? 'default' : 'outline'} 
              className={`flex-1 rounded-none ${formData.addressType === 'Home' ? 'bg-blue-600' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, addressType: 'Home' }))}>
              HOME
            </Button>
            <Button type="button" 
              variant={formData.addressType === 'Office' ? 'default' : 'outline'} 
              className={`flex-1 rounded-none ${formData.addressType === 'Office' ? 'bg-blue-600' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, addressType: 'Office' }))}>
              OFFICE
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-none px-6">CANCEL</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-none px-6">SAVE ADDRESS</Button>
      </div>
    </form>
  );
}