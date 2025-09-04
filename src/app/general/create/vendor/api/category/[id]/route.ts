import { NextResponse } from "next/server";
import { categories } from "../route";

// GET single category
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const category = categories.find(c => c.CategoryID === id);
  if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });
  return NextResponse.json(category);
}

// PUT (update category)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();
  const category = categories.find(c => c.CategoryID === id);
  if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });

  category.Name = body.Name ?? category.Name;
  category.CategoryIcon = body.CategoryIcon ?? category.CategoryIcon;
  category.CategoryBanner = body.CategoryBanner ?? category.CategoryBanner;
  category.IsFeatured = body.IsFeatured ?? category.IsFeatured;
  category.IsNavbar = body.IsNavbar ?? category.IsNavbar;
  category.Slug = body.Slug ?? category.Slug;
  category.Status = body.Status ?? category.Status;

  return NextResponse.json({ message: "Category updated", category });
}

// DELETE category
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const index = categories.findIndex(c => c.CategoryID === id);
  if (index === -1) return NextResponse.json({ message: "Category not found" }, { status: 404 });

  const deleted = categories.splice(index, 1)[0];
  return NextResponse.json({ message: "Category deleted", category: deleted });
}
