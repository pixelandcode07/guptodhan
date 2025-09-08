import SMSCard from "./components/SMSCard";




export type SMSFormValues = {
  api_endpoint?: string;
  api_key?: string;
  secret_key?: string;
  sender_Id?: string;
  // password?: string;
  // paymentMode: { label: string, value: string } | null;
  // status: { label: string, value: string } | null;
};

const gateways = [
  { name: "KhudeBarta SMS Gateway", fields: ["API Endpoint", "API Key", "Secret Key", "Sender ID"], logo: "https://app-area.guptodhan.com/images/khudebarta.jpg" },
  { name: "Reve SMS Gateway", fields: ["API Endpoint", "API Key", "Secret Key", "Sender ID"], logo: "https://app-area.guptodhan.com/images/revesms.png" },
  { name: "ElitBuzz SMS Gateway", fields: ["API Endpoint", "API Key", "Secret Key", "Sender ID"], logo: "https://app-area.guptodhan.com/images/elitebuzz.png" },
];



export default function SmsGetway() {
  return (
    <div className="space-y-6 my-5">
      {/* <p className="border border-amber-500 rounded-sm p-1 text-sm text-gray-600 font-semibold">
        <span className="font-semibold">Note:</span> Premium add-ons are not included in the initial package purchase and must be purchased separately. However, cash on delivery is available at no additional cost.
      </p> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gateways.map((gateway) => (
          <SMSCard key={gateway.name} gateway={gateway} />
        ))}
      </div>
    </div>
  );
}
