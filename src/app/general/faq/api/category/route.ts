import { NextResponse } from "next/server";

// In-memory test data
let faqCategories = [
  { faqCategoryID: 1, categoryName: "General", isActive: true },
  { faqCategoryID: 2, categoryName: "Billing", isActive: true },
];

// GET all categories
export async function GET() {
  return NextResponse.json(faqCategories);
}

// POST a new category
export async function POST(req: Request) {
  const body = await req.json();
  const newCategory = {
    faqCategoryID: faqCategories.length + 1,
    categoryName: body.categoryName,
    isActive: body.isActive ?? true,
  };
  faqCategories.push(newCategory);
  return NextResponse.json({ message: "Category added", category: newCategory });
}


export { faqCategories };
