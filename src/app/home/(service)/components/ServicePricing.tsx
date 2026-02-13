import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

type Props = {
    pricingType: "fixed" | "hourly";
    basePrice: number;
    minimumCharge: number;
};

export default function ServicePricing({ pricingType, basePrice, minimumCharge }: Props) {
    return (
        <Card className="border-2 border-primary/30 shadow-md">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Pricing
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">
                        {pricingType === "hourly" ? "Hourly Rate" : "Fixed Price"}
                    </span>
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                        ৳{basePrice}
                        {pricingType === "hourly" && <span className="text-sm font-normal">/hr</span>}
                    </Badge>
                </div>

                {minimumCharge > 0 && basePrice !== minimumCharge && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Minimum Charge</span>
                        <span>৳{minimumCharge}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}