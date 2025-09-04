import { NextResponse } from "next/server";
import { blogCategories } from "../route"; // import the array from parent folder

// GET single category
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const category = blogCategories.find(c => c.blogCategoryID === id);
  if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });
  return NextResponse.json(category);
}

// PUT (update)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();
  const category = blogCategories.find(c => c.blogCategoryID === id);
  if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });

  category.blogName = body.blogName ?? category.blogName;
  category.slug = body.slug ?? category.slug;
  category.isFeatured = body.isFeatured ?? category.isFeatured;
  category.status = body.status ?? category.status;

  return NextResponse.json({ message: "Blog category updated", category });
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const index = blogCategories.findIndex(c => c.blogCategoryID === id);
  if (index === -1) return NextResponse.json({ message: "Category not found" }, { status: 404 });

  const deleted = blogCategories.splice(index, 1)[0];
  return NextResponse.json({ message: "Blog category deleted", category: deleted });
}
