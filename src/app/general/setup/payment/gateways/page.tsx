
import PaymentCard from "./components/PaymentCard";


export const dynamic = 'force-dynamic'


export type PaymentFormValues = {
  storeId?: string;
  storePassword?: string;
  apiKey?: string;
  secretKey?: string;
  username?: string;
  password?: string;
  paymentMode: { label: string, value: string } | null;
  status: { label: string, value: string } | null;
};

const gateways = [
  { name: "SSL Commerz", fields: ["storeId", "storePassword", "username", "password"], logo: "https://i.ibb.co.com/YBbpYFjK/sslcommerz.png" },
  { name: "Stripe", fields: ["apiKey", "secretKey", "username", "password"], logo: "https://i.ibb.co.com/CpWhwzGJ/stripe.png" },
  { name: "bKash", fields: ["apiKey", "secretKey", "username", "password"], logo: "https://i.ibb.co.com/B27qFZWW/bkash.png" },
  { name: "Amar Pay", fields: ["apiKey", "secretKey", "username", "password"], logo: "https://i.ibb.co.com/ccg8bC5W/amarPay.png" },
  { name: "Paypal", fields: ["apiKey", "secretKey", "username", "password"], logo: "https://i.ibb.co.com/N6jsYc57/paypal.png" },
];



export default function PaymentGateways() {
  return (
    <div className="space-y-6 my-5">
      <p className="border border-amber-500 rounded-sm p-1 text-sm text-gray-600 font-semibold">
        <span className="font-semibold">Note:</span> Premium add-ons are not included in the initial package purchase and must be purchased separately. However, cash on delivery is available at no additional cost.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {gateways.map((gateway) => (
          <PaymentCard key={gateway.name} gateway={gateway} />
        ))}
      </div>
    </div>
  );
}
