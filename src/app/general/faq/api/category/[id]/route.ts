import { NextResponse } from "next/server";
import { faqCategories } from "../route"; 

// GET single category
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const category = faqCategories.find(c => c.faqCategoryID === id);
  if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });
  return NextResponse.json(category);
}

// PUT (update)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();
  const category = faqCategories.find(c => c.faqCategoryID === id);
  if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });

  category.categoryName = body.categoryName ?? category.categoryName;
  category.isActive = body.isActive ?? category.isActive;

  return NextResponse.json({ message: "Category updated", category });
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const index = faqCategories.findIndex(c => c.faqCategoryID === id);
  if (index === -1) return NextResponse.json({ message: "Category not found" }, { status: 404 });

  const deleted = faqCategories.splice(index, 1)[0];
  return NextResponse.json({ message: "Category deleted", category: deleted });
}
