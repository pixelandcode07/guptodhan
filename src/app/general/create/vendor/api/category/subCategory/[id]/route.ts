import { NextResponse } from "next/server";
import { subCategories } from "../route";

// GET single subcategory
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const subcategory = subCategories.find(c => c.SubCategoryID === id);
  if (!subcategory) return NextResponse.json({ message: "Subcategory not found" }, { status: 404 });
  return NextResponse.json(subcategory);
}

// PUT (update)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();
  const subcategory = subCategories.find(c => c.SubCategoryID === id);
  if (!subcategory) return NextResponse.json({ message: "Subcategory not found" }, { status: 404 });

  subcategory.CategoryID = body.CategoryID ?? subcategory.CategoryID;
  subcategory.Name = body.Name ?? subcategory.Name;
  subcategory.Icon = body.Icon ?? subcategory.Icon;
  subcategory.Image = body.Image ?? subcategory.Image;
  subcategory.IsFeatured = body.IsFeatured ?? subcategory.IsFeatured;
  subcategory.Status = body.Status ?? subcategory.Status;
  subcategory.Slug = body.Slug ?? subcategory.Slug;

  return NextResponse.json({ message: "Subcategory updated", subcategory });
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const index = subCategories.findIndex(c => c.SubCategoryID === id);
  if (index === -1) return NextResponse.json({ message: "Subcategory not found" }, { status: 404 });

  const deleted = subCategories.splice(index, 1)[0];
  return NextResponse.json({ message: "Subcategory deleted", subcategory: deleted });
}
