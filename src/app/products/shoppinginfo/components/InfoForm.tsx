"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from 'next-auth/react'

// Complete Bangladesh Location Data ensuring consistency
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

interface FormData {
  name: string
  phone: string
  email: string
  district: string
  upazila: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface InfoFormProps {
  onFormDataChange: (data: FormData) => void
  initialData?: Partial<FormData>
}

// Updated Helper function to handle JSON Array strings and normal strings
const extractCleanAddress = (rawAddress?: string) => {
  if (!rawAddress) return '';
  
  try {
    const parsedData = JSON.parse(rawAddress);
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      if (parsedData[0].address) return parsedData[0].address;
    } else if (typeof parsedData === 'object' && parsedData !== null) {
      if (parsedData.address) return parsedData.address;
    }
  } catch (error) {
    if (rawAddress.includes('fullName:') || rawAddress.includes('address:')) {
      const match = rawAddress.match(/address:\s*([^,}]+)/);
      if (match && match[1]) {
        return match[1].replace(/["']/g, '').trim();
      }
    }
  }
  
  return rawAddress;
};

export default function InfoForm({ onFormDataChange, initialData }: InfoFormProps) {
  const { data: session } = useSession()
  const user = session?.user
  
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    district: initialData?.district || '',
    upazila: initialData?.upazila || '',
    address: extractCleanAddress(initialData?.address) || '',
    city: initialData?.city || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'Bangladesh'
  })

  // Derive all districts from the locationData
  const allDistricts = useMemo(() => {
    return Object.values(locationData).flatMap(division => Object.keys(division)).sort();
  }, []);

  // Helper function to find upazilas for a selected district
  const getUpazilasForDistrict = (districtName: string) => {
    for (const division of Object.values(locationData)) {
      if (division[districtName]) {
        return division[districtName];
      }
    }
    return [];
  };

  const getPostalCodeByDistrict = (districtName: string) => {
    const postalCodeMap: { [key: string]: string } = {
      'Dhaka': '1000', 'Chattogram': '4000', 'Sylhet': '3100', 'Rajshahi': '6000', 'Khulna': '9000', 'Barishal': '8200', 'Rangpur': '5400', 'Mymensingh': '2200', 'Cumilla': '3500', 'Bogura': '5800', 'Jessore': '7400', 'Dinajpur': '5200', 'Tangail': '1900', 'Kushtia': '7000', 'Pabna': '6600', 'Faridpur': '7800', 'Narayanganj': '1400', 'Gazipur': '1700', 'Chandpur': '3600', 'Lakshmipur': '3700'
    }
    return postalCodeMap[districtName] || '1000'
  }

  const getPostalCodeByUpazila = (upazilaName: string, districtName: string) => {
    const upazilaPostalMap: { [key: string]: string } = {
      'Savar': '1340', 'Dhamrai': '1350', 'Keraniganj': '1310', 'Nawabganj': '1320', 'Dohar': '1330',
      'Gazipur Sadar': '1700', 'Tongi': '1710', 'Kaliakair': '1750', 'Kapasia': '1730', 'Sreepur': '1740',
      'Narayanganj Sadar': '1400', 'Bandar': '1410', 'Sonargaon': '1440', 'Araihazar': '1450', 'Rupganj': '1460', 'Fatullah': '1420', 'Siddhirganj': '1430',
      // ... Add more if needed. Using district fallback for missing ones to keep code clean.
    }
    return upazilaPostalMap[upazilaName] || getPostalCodeByDistrict(districtName)
  }

  const handleDistrictChange = (districtName: string) => {
    const cityName = districtName
    const postalCode = getPostalCodeByDistrict(districtName)
    
    setFormData(prev => {
      const newData = {
        ...prev,
        district: districtName,
        upazila: '',
        city: cityName,
        postalCode: postalCode
      }
      onFormDataChange(newData)
      return newData
    })
  }

  const handleUpazilaChange = (upazilaName: string) => {
    const postalCode = getPostalCodeByUpazila(upazilaName, formData.district)
    
    setFormData(prev => {
      const newData = {
        ...prev,
        upazila: upazilaName,
        postalCode: postalCode
      }
      onFormDataChange(newData)
      return newData
    })
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onFormDataChange(newData)
  }

  const isFormValid = () => {
    return formData.name && formData.phone && formData.email && formData.district && formData.upazila && formData.address && formData.city && formData.postalCode && formData.country
  }

  const availableUpazilas = formData.district ? getUpazilasForDistrict(formData.district) : [];

  return (
    <div className="space-y-5 rounded-lg bg-white p-4 sm:p-6 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Delivery Information</h1>
        {!user && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            Login required to place order
          </div>
        )}
      </div>

      {/* Contact Information */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-gray-900 sm:text-lg">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <Input 
              placeholder="Enter your full name" 
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              disabled={!user}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <Input 
              placeholder="Enter your phone number" 
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              disabled={!user}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <Input 
              placeholder="Enter your email address" 
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              disabled={!user}
            />
          </div>
        </div>
      </section>

      {/* Location Information */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-gray-900 sm:text-lg">Delivery Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
            <Select 
              value={formData.district} 
              onValueChange={handleDistrictChange}
              disabled={!user}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {allDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upazila/Thana *</label>
            <Select 
              value={formData.upazila} 
              onValueChange={handleUpazilaChange}
              disabled={!user || !formData.district}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select upazila/thana" />
              </SelectTrigger>
              <SelectContent>
                {availableUpazilas.map((upazila) => (
                  <SelectItem key={upazila} value={upazila}>
                    {upazila}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* City and Postal Code */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-gray-900 sm:text-lg">City & Postal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <Input 
              placeholder="City name" 
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              disabled={!user}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
            <Input 
              placeholder="Postal code" 
              value={formData.postalCode}
              onChange={(e) => updateFormData('postalCode', e.target.value)}
              disabled={!user}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <Input 
              placeholder="Country" 
              value={formData.country}
              onChange={(e) => updateFormData('country', e.target.value)}
              disabled={!user}
            />
          </div>
        </div>
      </section>

      {/* Address Details */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-gray-900 sm:text-lg">Address Details</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
          <Textarea 
            placeholder="Enter your detailed address (house number, road, area)" 
            className="min-h-24"
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            disabled={!user}
          />
        </div>
      </section>

      {/* Login Required Message */}
      {!user && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-orange-800">Login Required</p>
              <p className="text-orange-700 text-xs mt-1">
                Please login or register to fill out the delivery information and place your order.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Status */}
      {user && (
        <div className="text-sm text-gray-600">
          {isFormValid() ? (
            <span className="text-green-600">✓ All required information provided</span>
          ) : (
            <span className="text-orange-600">Please fill in all required fields</span>
          )}
        </div>
      )}
    </div>
  )
}