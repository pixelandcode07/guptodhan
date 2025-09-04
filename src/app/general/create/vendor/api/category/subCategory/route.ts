import { NextResponse } from "next/server";

// In-memory test data
let subCategories = [
  {
    SubCategoryID: 1,
    CategoryID: 1, // FK to CategoryID
    Name: "Smartphones",
    Icon: "smartphone-icon.png",
    Image: "smartphone-banner.png",
    IsFeatured: true,
    Status: "active",
    Slug: "smartphones",
    CreatedTime: new Date()
  },
  {
    SubCategoryID: 2,
    CategoryID: 1,
    Name: "Laptops",
    Icon: "laptop-icon.png",
    Image: "",
    IsFeatured: false,
    Status: "active",
    Slug: "laptops",
    CreatedTime: new Date()
  }
];

// GET all subcategories
export async function GET() {
  return NextResponse.json(subCategories);
}

// POST new subcategory
export async function POST(req: Request) {
  const body = await req.json();
  const newSubCategory = {
    SubCategoryID: subCategories.length + 1,
    CategoryID: body.CategoryID,
    Name: body.Name,
    Icon: body.Icon,
    Image: body.Image ?? "",
    IsFeatured: body.IsFeatured ?? false,
    Status: body.Status ?? "active",
    Slug: body.Slug,
    CreatedTime: new Date()
  };
  subCategories.push(newSubCategory);
  return NextResponse.json({ message: "Subcategory added", subcategory: newSubCategory });
}


export { subCategories };
