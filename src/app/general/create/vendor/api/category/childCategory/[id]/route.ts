import { NextResponse } from "next/server";
import { childCategories } from "../route";

// GET single child category
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const childCategory = childCategories.find(c => c.ChildCategoryID === id);
  if (!childCategory) return NextResponse.json({ message: "Child category not found" }, { status: 404 });
  return NextResponse.json(childCategory);
}

// PUT (update)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();
  const childCategory = childCategories.find(c => c.ChildCategoryID === id);
  if (!childCategory) return NextResponse.json({ message: "Child category not found" }, { status: 404 });

  childCategory.CategoryID = body.CategoryID ?? childCategory.CategoryID;
  childCategory.SubCategoryID = body.SubCategoryID ?? childCategory.SubCategoryID;
  childCategory.Name = body.Name ?? childCategory.Name;
  childCategory.Icon = body.Icon ?? childCategory.Icon;
  childCategory.Slug = body.Slug ?? childCategory.Slug;
  childCategory.Status = body.Status ?? childCategory.Status;

  return NextResponse.json({ message: "Child category updated", childCategory });
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const index = childCategories.findIndex(c => c.ChildCategoryID === id);
  if (index === -1) return NextResponse.json({ message: "Child category not found" }, { status: 404 });

  const deleted = childCategories.splice(index, 1)[0];
  return NextResponse.json({ message: "Child category deleted", childCategory: deleted });
}
