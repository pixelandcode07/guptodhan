import { DataTable } from "@/components/TableHelper/data-table";
import { Review, review_columns } from "@/components/TableHelper/review_columns";
import { Input } from "@/components/ui/input";

function getData(): Review[] {
  return [
    {
      id: 1,
      image: "",
      product: "RFL Polypropylene Classic Art Chair",
      rating: 5,
      review: "Excellent product! Very comfortable and stylish.",
      reply_from_admin: "Thank you for your positive feedback!",
      customer: "customer@example.com",
      name: "John Doe",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 2,
      image: "",
      product: "DJI Osmo Mobile 6 Smartphone Gimbal",
      rating: 4,
      review: "Good quality, easy to use. Would recommend.",
      reply_from_admin: "",
      customer: "customer2@example.com",
      name: "Jane Smith",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 3,
      image: "",
      product: "Organic Leg Piece",
      rating: 3,
      review: "Average quality, could be better.",
      reply_from_admin: "We appreciate your feedback and will work on improving quality.",
      customer: "customer3@example.com",
      name: "Mike Johnson",
      status: "Active",
      created_at: "2024-08-18 09:58:42 pm"
    }
  ];
}

export default function ViewAllReviewsPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Ratings & Review</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
      </div>
      <DataTable columns={review_columns} data={data} />
    </div>
  );
}
