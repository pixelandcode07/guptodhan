import { DataTable } from "@/components/TableHelper/data-table";
import { QuestionAnswer, question_answer_columns } from "@/components/TableHelper/question_answer_columns";
import { Input } from "@/components/ui/input";

function getData(): QuestionAnswer[] {
  return [
    {
      id: 1,
      image: "",
      product: "RFL Polypropylene Classic Art Chair",
      customers_name: "John Doe",
      email: "john.doe@example.com",
      question: "What is the weight capacity of this chair?",
      answer_from_admin: "This chair can support up to 150kg weight capacity.",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 2,
      image: "",
      product: "DJI Osmo Mobile 6 Smartphone Gimbal",
      customers_name: "Jane Smith",
      email: "jane.smith@example.com",
      question: "Does this work with iPhone 14 Pro?",
      answer_from_admin: "Yes, it's compatible with iPhone 14 Pro and most modern smartphones.",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 3,
      image: "",
      product: "Organic Leg Piece",
      customers_name: "Mike Johnson",
      email: "mike.johnson@example.com",
      question: "What is the shelf life of this product?",
      answer_from_admin: "",
      created_at: "2024-08-18 09:58:42 pm"
    }
  ];
}

export default function ViewAllQuestionsAnswersPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Questions & Answers</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
      </div>
      <DataTable columns={question_answer_columns} data={data} />
    </div>
  );
}
