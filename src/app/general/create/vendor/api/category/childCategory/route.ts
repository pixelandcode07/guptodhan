import { NextResponse } from "next/server";

// In-memory test data
let childCategories = [
  {
    ChildCategoryID: 1,
    CategoryID: 1,       // FK to CategoryID
    SubCategoryID: 1,    // FK to SubCategoryID
    Name: "Android Phones",
    Icon: "android-icon.png",
    Slug: "android-phones",
    Status: "active",
    CreatedTime: new Date()
  },
  {
    ChildCategoryID: 2,
    CategoryID: 1,
    SubCategoryID: 2,
    Name: "Gaming Laptops",
    Icon: "gaming-laptop-icon.png",
    Slug: "gaming-laptops",
    Status: "active",
    CreatedTime: new Date()
  }
];

// GET all child categories
export async function GET() {
  return NextResponse.json(childCategories);
}

// POST new child category
export async function POST(req: Request) {
  const body = await req.json();
  const newChildCategory = {
    ChildCategoryID: childCategories.length + 1,
    CategoryID: body.CategoryID,
    SubCategoryID: body.SubCategoryID,
    Name: body.Name,
    Icon: body.Icon,
    Slug: body.Slug,
    Status: body.Status ?? "active",
    CreatedTime: new Date()
  };
  childCategories.push(newChildCategory);
  return NextResponse.json({ message: "Child category added", childCategory: newChildCategory });
}


export { childCategories };
