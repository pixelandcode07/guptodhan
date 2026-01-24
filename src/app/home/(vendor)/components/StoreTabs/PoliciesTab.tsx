import { Card } from "@/components/ui/card";
import { Package, ShieldCheck } from "lucide-react";

export default function PoliciesTab({ store }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 rounded-3xl border-none bg-muted/5">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-primary">
                    <ShieldCheck className="w-5 h-5" /> Return Policy
                </h3>
                <p className="text-sm text-muted-foreground">
                    {store?.returnPolicy || "Standard 7-day return policy apply."}
                </p>
            </Card>
            <Card className="p-6 rounded-3xl border-none bg-muted/5">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-primary">
                    <Package className="w-5 h-5" /> Shipping Info
                </h3>
                <p className="text-sm text-muted-foreground">
                    {store?.shippingPolicy || "Usually ships within 2-3 business days."}
                </p>
            </Card>
        </div>
    );
}