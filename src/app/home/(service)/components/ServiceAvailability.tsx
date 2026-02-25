import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  timeSlots: string[];
  workingDays: string[];
  toolsProvided: boolean;
};

export default function ServiceAvailability({ timeSlots, workingDays, toolsProvided }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Working Days
          </h4>
          <div className="flex flex-wrap gap-2">
            {workingDays.map((day) => (
              <Badge key={day} variant="outline">
                {day}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> Available Time Slots
          </h4>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <Badge key={slot} variant="secondary">
                {slot}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5">
              <Wrench className="h-4 w-4" />
              Tools & Equipment
            </span>
            <Badge variant={toolsProvided ? "default" : "outline"}>
              {toolsProvided ? "Provided by provider" : "Customer should provide"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}