"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from 'next-auth/react'

interface District {
  district: string
}

interface Upazila {
  _id: string
  district: string
  upazilaThanaEnglish: string
  upazilaThanaBangla: string
  websiteLink: string
  createdAt: string
}

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
  districts?: District[]
  upazilas?: Upazila[]
}

// JSON Array string parsing for Initial Address Data
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

export default function InfoForm({ onFormDataChange, initialData, upazilas = [] }: InfoFormProps) {
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

  // State for dynamic API districts
  const [apiDistricts, setApiDistricts] = useState<string[]>([])

  // Fetch Delivery Charges to get active districts directly from API
  useEffect(() => {
    const fetchApiDistricts = async () => {
      try {
        const res = await fetch('/api/v1/delivery-charge', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const data = await res.json();
        if (data?.data && Array.isArray(data.data)) {
          const fetchedDistricts = data.data.map((item: any) => item.districtName);
          const uniqueDistricts = Array.from(new Set(fetchedDistricts)).sort() as string[];
          setApiDistricts(uniqueDistricts);
        }
      } catch (err) {
        console.error("Failed to fetch districts from delivery-charge API", err);
      }
    };
    fetchApiDistricts();
  }, []);

  // Helper function to get postal code based on district name
  const getPostalCodeByDistrict = (districtName: string) => {
    const postalCodeMap: { [key: string]: string } = {
      'Dhaka': '1000', 'Chattogram': '4000', 'Sylhet': '3100', 'Rajshahi': '6000', 'Khulna': '9000', 'Barishal': '8200', 'Rangpur': '5400', 'Mymensingh': '2200', 'Cumilla': '3500', 'Bogura': '5800', 'Jashore': '7400', 'Dinajpur': '5200', 'Tangail': '1900', 'Kushtia': '7000', 'Pabna': '6600', 'Faridpur': '7800', 'Narayanganj': '1400', 'Gazipur': '1700', 'Chandpur': '3600', 'Lakshmipur': '3700'
    }
    return postalCodeMap[districtName] || '1000'
  }

  // Helper function to get postal code based on upazila/thana name (Large Map)
  const getPostalCodeByUpazila = (upazilaName: string, districtName: string) => {
    const upazilaPostalMap: { [key: string]: string } = {
      // Dhaka Division
      'Savar': '1340', 'Dhamrai': '1350', 'Keraniganj': '1310', 'Nawabganj': '1320', 'Dohar': '1330',
      'Gazipur Sadar': '1700', 'Tongi': '1710', 'Kaliakair': '1750', 'Kapasia': '1730', 'Sreepur': '1740',
      'Narayanganj Sadar': '1400', 'Bandar': '1410', 'Sonargaon': '1440', 'Araihazar': '1450', 'Rupganj': '1460', 'Fatullah': '1420', 'Siddhirganj': '1430',
      'Narsingdi Sadar': '1600', 'Palash': '1610', 'Shibpur': '1620', 'Monohardi': '1650', 'Belabo': '1640', 'Raipura': '1630',
      'Faridpur Sadar': '7800', 'Bhanga': '7830', 'Boalmari': '7860', 'Sadarpur': '7820', 'Nagarkanda': '7840', 'Alfanga': '7850', 'Madhukhali': '7860',
      'Gopalganj Sadar': '8100', 'Tungipara': '8120', 'Kotalipara': '8110', 'Kashiani': '8130', 'Muksudpur': '8140',
      'Madaripur Sadar': '7900', 'Shibchar': '7930', 'Rajoir': '7910', 'Kalkini': '7920',
      'Shariatpur Sadar': '8000', 'Naria': '8020', 'Zajira': '8010', 'Bhedarganj': '8030', 'Gosairhat': '8050', 'Damudya': '8040',
      'Tangail Sadar': '1900', 'Mirzapur': '1940', 'Gopalpur': '1990', 'Ghatail': '1980', 'Madhupur': '1996', 'Kalihati': '1970', 'Bhuapur': '1960',
      'Kishoreganj Sadar': '2300', 'Bhairab': '2350', 'Bajitpur': '2336', 'Katiadi': '2310', 'Hossainpur': '2320', 'Pakundia': '2326',
      'Manikganj Sadar': '1800', 'Singair': '1820', 'Saturia': '1810', 'Ghior': '1840', 'Shivalaya': '1850',
      'Munshiganj Sadar': '1500', 'Sirajdikhan': '1540', 'Sreenagar': '1550', 'Lauhajang': '1530', 'Gazaria': '1510', 'Tongibari': '1520',
      
      // Chattogram Division
      'Chattogram Sadar': '4000', 'Pahartali': '4202', 'Double Mooring': '4000', 'Hathazari': '4330', 'Patiya': '4370', 'Boalkhali': '4366', 'Chandanaish': '4380', 'Anwara': '4376', 'Banshkhali': '4392', 'Satkania': '4386', 'Lohagara': '4396', 'Fatikchhari': '4350', 'Raozan': '4340', 'Rangunia': '4360', 'Mirsharai': '4320', 'Sitakunda': '4310', 'Sandwip': '4300', 'Roufabad': '4214',
      'Cox\'s Bazar Sadar': '4700', 'Chakaria': '4740', 'Maheshkhali': '4710', 'Teknaf': '4760', 'Ukhia': '4750', 'Ramu': '4730', 'Pekua': '4740', 'Kutubdia': '4720',
      'Bandarban Sadar': '4600', 'Lama': '4640', 'Alikadam': '4650', 'Naikhongchhari': '4660', 'Rowangchhari': '4610', 'Ruma': '4620', 'Thanchi': '4630',
      'Rangamati Sadar': '4500', 'Kaptai': '4530', 'Kawkhali': '4510', 'Langadu': '4580', 'Naniarchar': '4520', 'Barkal': '4560', 'Baghaichhari': '4590',
      'Khagrachhari Sadar': '4400', 'Dighinala': '4420', 'Lakshmichhari': '4470', 'Mahalchhari': '4430', 'Manikchhari': '4460', 'Matiranga': '4450', 'Panchhari': '4410',
      'Cumilla Sadar': '3500', 'Laksam': '3570', 'Daudkandi': '3516', 'Chauddagram': '3550', 'Brahmanpara': '3526', 'Burichang': '3520', 'Chandina': '3510', 'Homna': '3546', 'Muradnagar': '3540', 'Barura': '3560',
      'Brahmanbaria Sadar': '3400', 'Kasba': '3460', 'Akhaura': '3450', 'Ashuganj': '3402', 'Banchharampur': '3420', 'Nabinagar': '3410', 'Nasirnagar': '3440',
      'Chandpur Sadar': '3600', 'Hajiganj': '3610', 'Matlab': '3630', 'Faridganj': '3650', 'Kachua': '3620', 'Haimchar': '3660',
      'Feni Sadar': '3900', 'Chhagalnaiya': '3910', 'Daganbhuiyan': '3920', 'Parshuram': '3940', 'Sonagazi': '3930',
      'Noakhali Sadar': '3800', 'Begumganj': '3820', 'Chatkhil': '3870', 'Companiganj': '3830', 'Senbagh': '3860', 'Hatiya': '3890',
      'Lakshmipur Sadar': '3700', 'Ramganj': '3720', 'Raipur': '3710', 'Ramgati': '3730',

      // Sylhet Division
      'Sylhet Sadar': '3100', 'South Surma': '3110', 'Bishwanath': '3130', 'Golapganj': '3160', 'Beanibazar': '3170', 'Ziganj': '3180', 'Balaganj': '3120', 'Fenchuganj': '3150', 'Gowainghat': '3150', 'Jaintiapur': '3150', 'Kanaighat': '3180',
      'Moulvibazar Sadar': '3200', 'Sreemangal': '3210', 'Kulaura': '3230', 'Kamalganj': '3220', 'Barlekha': '3250', 'Rajnagar': '3240', 'Juri': '3230',
      'Habiganj Sadar': '3300', 'Chunarughat': '3320', 'Madhabpur': '3330', 'Nabiganj': '3370', 'Baniachong': '3350', 'Ajmiriganj': '3360', 'Bahubal': '3310',
      'Sunamganj Sadar': '3000', 'Chhatak': '3080', 'Jagannathpur': '3060', 'Bishwamvarpur': '3010', 'Derai': '3040', 'Dharamapasha': '3030', 'Dowarabazar': '3070', 'Jamalganj': '3020', 'Sullah': '3050', 'Tahirpur': '3030',

      // Rajshahi Division
      'Rajshahi Sadar': '6000', 'Godagari': '6290', 'Tanore': '6260', 'Bagmara': '6250', 'Puthia': '6260', 'Charghat': '6270', 'Bagha': '6280', 'Mohanpur': '6220', 'Durgapur': '6240',
      'Natore Sadar': '6400', 'Singra': '6450', 'Baraigram': '6430', 'Bagatipara': '6410', 'Gurudaspur': '6440', 'Lalpur': '6420',
      'Naogaon Sadar': '6500', 'Patnitala': '6540', 'Niamatpur': '6520', 'Badalgachhi': '6570', 'Dhamoirhat': '6580', 'Manda': '6510', 'Mohadevpur': '6530', 'Porsha': '6560', 'Raninagar': '6590', 'Sapahar': '6550',
      'Chapainawabganj Sadar': '6300', 'Shibganj': '6340', 'Bholahat': '6330', 'Gomastapur': '6320', 'Nachole': '6310',
      'Pabna Sadar': '6600', 'Ishwardi': '6620', 'Sujanagar': '6660', 'Atgharia': '6610', 'Bera': '6680', 'Chatmohar': '6630', 'Santhia': '6670',
      'Sirajganj Sadar': '6700', 'Ullahpara': '6760', 'Shahjadpur': '6770', 'Belkuchi': '6740', 'Chauhali': '6730', 'Kamarkhanda': '6720', 'Kazipur': '6710', 'Raiganj': '6780', 'Tarash': '6790',
      'Bogura Sadar': '5800', 'Sherpur': '5840', 'Adamdighi': '5890', 'Dhunat': '5850', 'Dupchanchia': '5880', 'Gabtali': '5820', 'Kahaloo': '5870', 'Nandigram': '5860', 'Sariakandi': '5830',
      'Joypurhat Sadar': '5900', 'Panchbibi': '5920', 'Akkelpur': '5940', 'Kalai': '5930', 'Khetlal': '5910',

      // Khulna Division
      'Khulna Sadar': '9000', 'Dumuria': '9250', 'Phultala': '9210', 'Batiaghata': '9260', 'Dacope': '9270', 'Paikgachha': '9280', 'Koyra': '9290', 'Terokhada': '9220', 'Rupsha': '9240', 'Dighalia': '9230',
      'Bagerhat Sadar': '9300', 'Mongla': '9350', 'Morrelganj': '9330', 'Fakirhat': '9370', 'Chitalmari': '9360', 'Mollahat': '9380', 'Rampal': '9340', 'Sarankhola': '9320',
      'Satkhira Sadar': '9400', 'Tala': '9420', 'Shyamnagar': '9450', 'Assasuni': '9430', 'Debhata': '9410', 'Kalaroa': '9410',
      'Jashore Sadar': '7400', 'Abhaynagar': '7460', 'Jhikargachha': '7420', 'Navaron': '7430', 'Chaugachha': '7410', 'Bagherpara': '7470', 'Keshabpur': '7450', 'Manirampur': '7440',
      'Narail Sadar': '7500', 'Kalia': '7520',
      'Magura Sadar': '7600', 'Mohammadpur': '7630', 'Shalikha': '7620',
      'Jhenaidah Sadar': '7300', 'Shailkupa': '7320', 'Harinakunda': '7310', 'Kotchandpur': '7330', 'Maheshpur': '7340',
      'Chuadanga Sadar': '7200', 'Alamdanga': '7210', 'Damurhuda': '7220', 'Jibannagar': '7230',
      'Kushtia Sadar': '7000', 'Bheramara': '7040', 'Kumarkhali': '7010', 'Daulatpur': '7050', 'Khoksa': '7020',
      'Meherpur Sadar': '7100', 'Gangni': '7110', 'Mujibnagar': '7120',

      // Barishal Division
      'Barishal Sadar': '8200', 'Bakerganj': '8280', 'Babuganj': '8210', 'Wazirpur': '8220', 'Banaripara': '8230', 'Gournadi': '8230', 'Agailjhara': '8240', 'Muladi': '8250', 'Hizla': '8270', 'Mehendiganj': '8270',
      'Bhola Sadar': '8300', 'Borhanuddin': '8320', 'Char Fasson': '8340', 'Lalmohan': '8330', 'Daulatkhan': '8310', 'Manpura': '8350', 'Tazumuddin': '8360',
      'Patuakhali Sadar': '8600', 'Bauphal': '8620', 'Galachipa': '8630', 'Dashmina': '8630', 'Kalapara': '8650', 'Dumki': '8602', 'Mirzaganj': '8610',
      'Barguna Sadar': '8700', 'Amtali': '8710', 'Patharghata': '8720', 'Bamna': '8730', 'Betagi': '8740', 'Taltali': '8710',
      'Pirojpur Sadar': '8500', 'Bhandaria': '8550', 'Mathbaria': '8560', 'Swarupkati': '8520', 'Kaukhali': '8510', 'Nazirpur': '8540', 'Zianagar': '8530',
      'Jhalokati Sadar': '8400', 'Nalchity': '8420', 'Rajapur': '8410', 'Kathalia': '8430',

      // Rangpur Division
      'Rangpur Sadar': '5400', 'Badarganj': '5430', 'Mithapukur': '5460', 'Taraganj': '5420', 'Gangachhara': '5410', 'Kaunia': '5440', 'Pirgachha': '5450',
      'Dinajpur Sadar': '5200', 'Birganj': '5220', 'Kaharole': '5230', 'Biral': '5210', 'Parbatipur': '5250', 'Phulbari': '5260', 'Ghoraghat': '5290', 'Bochaganj': '5240', 'Chirirbandar': '5270', 'Hakimpur': '5280', 'Khansama': '5230',
      'Thakurgaon Sadar': '5100', 'Baliadangi': '5140', 'Haripur': '5130', 'Ranisankail': '5120',
      'Panchagarh Sadar': '5000', 'Boda': '5010', 'Debiganj': '5020', 'Tetulia': '5030', 'Atwari': '5040',
      'Nilphamari Sadar': '5300', 'Saidpur': '5320', 'Domar': '5340', 'Dimla': '5350', 'Jaldhaka': '5330',
      'Kurigram Sadar': '5600', 'Ulipur': '5620', 'Nageshwari': '5660', 'Bhurungamari': '5670', 'Rajarhat': '5610', 'Chilmari': '5630', 'Rajibpur': '5650', 'Rowmari': '5640',
      'Lalmonirhat Sadar': '5500', 'Aditmari': '5510', 'Hatibandha': '5530', 'Patgram': '5540',
      'Gaibandha Sadar': '5700', 'Sadullapur': '5710', 'Palashbari': '5730', 'Gobindaganj': '5740', 'Sundarganj': '5720', 'Phulchhari': '5750', 'Saghata': '5760',

      // Mymensingh Division
      'Mymensingh Sadar': '2200', 'Muktagachha': '2210', 'Fulbaria': '2216', 'Trishal': '2220', 'Bhaluka': '2240', 'Gaffargaon': '2230', 'Nandail': '2290', 'Ishwarganj': '2280', 'Gouripur': '2270', 'Phulpur': '2250', 'Haluaghat': '2260', 'Dhobaura': '2260', 'Tarakanda': '2250',
      'Jamalpur Sadar': '2000', 'Melandaha': '2010', 'Islampur': '2020', 'Dewanganj': '2030', 'Sarishabari': '2050', 'Madarganj': '2040', 'Baksiganj': '2030',
      'Sherpur Sadar': '2100', 'Nakla': '2150', 'Sreebardi': '2130', 'Jhenaigati': '2120', 'Nalitabari': '2110',
      'Netrokona Sadar': '2400', 'Kendua': '2420', 'Madan': '2490', 'Mohanganj': '2440', 'Barhatta': '2430', 'Kalmakanda': '2430', 'Purbadhala': '2410', 'Durgapur': '2420', 'Atpara': '2470', 'Khaliajuri': '2450'
    }
    return upazilaPostalMap[upazilaName] || getPostalCodeByDistrict(districtName)
  }

  // ✅ Auto-fill postal code when District changes
  const handleDistrictChange = (districtName: string) => {
    const postalCode = getPostalCodeByDistrict(districtName)
    setFormData(prev => {
      const newData = {
        ...prev,
        district: districtName,
        upazila: '',
        city: districtName, 
        postalCode: postalCode
      }
      onFormDataChange(newData)
      return newData
    })
  }

  // ✅ Auto-fill postal code when Upazila changes
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
                {apiDistricts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
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
                {upazilas && upazilas.length > 0 ? (
                  upazilas.map((upazila) => (
                    <SelectItem key={upazila._id} value={upazila.upazilaThanaEnglish}>
                      {upazila.upazilaThanaEnglish} ({upazila.upazilaThanaBangla})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No Upazilas available</SelectItem>
                )}
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