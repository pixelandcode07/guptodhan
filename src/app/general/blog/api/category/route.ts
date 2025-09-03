import { NextResponse } from "next/server";

//test
let blogCategories = [
  { blogCategoryID: 1, blogName: "Tech", slug: "tech", isFeatured: true, status: "active", createdTime: new Date() },
  { blogCategoryID: 2, blogName: "Health", slug: "health", isFeatured: false, status: "active", createdTime: new Date() },
];

// GET all categories
export async function GET() {
  return NextResponse.json(blogCategories);
}

// POST new category
export async function POST(req: Request) {
  const body = await req.json();
  const newCategory = {
    blogCategoryID: blogCategories.length + 1,
    blogName: body.blogName,
    slug: body.slug,
    isFeatured: body.isFeatured ?? false,
    status: body.status ?? "active",
    createdTime: new Date(),
  };
  blogCategories.push(newCategory);
  return NextResponse.json({ message: "Blog category added", category: newCategory });
}


export { blogCategories };
