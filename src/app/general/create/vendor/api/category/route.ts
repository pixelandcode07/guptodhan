import { NextResponse } from "next/server";

//test data
let categories = [
  {
    CategoryID: 1,
    Name: "Electronics",
    CategoryIcon: "electronics-icon.png",
    CategoryBanner: "electronics-banner.png",
    IsFeatured: true,
    IsNavbar: true,
    Slug: "electronics",
    Status: "active",
    CreatedTime: new Date()
  },
  {
    CategoryID: 2,
    Name: "Clothing",
    CategoryIcon: "clothing-icon.png",
    CategoryBanner: "",
    IsFeatured: false,
    IsNavbar: true,
    Slug: "clothing",
    Status: "active",
    CreatedTime: new Date()
  }
];

// GET all categories
export async function GET() {
  return NextResponse.json(categories);
}

// POST new category
export async function POST(req: Request) {
  const body = await req.json();
  const newCategory = {
    CategoryID: categories.length + 1,
    Name: body.Name,
    CategoryIcon: body.CategoryIcon,
    CategoryBanner: body.CategoryBanner ?? "",
    IsFeatured: body.IsFeatured ?? false,
    IsNavbar: body.IsNavbar ?? false,
    Slug: body.Slug,
    Status: body.Status ?? "active",
    CreatedTime: new Date()
  };
  categories.push(newCategory);
  return NextResponse.json({ message: "Category added", category: newCategory });
}


export { categories };
