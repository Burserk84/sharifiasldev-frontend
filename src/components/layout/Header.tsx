import { getServerSession } from "next-auth";
import HeaderClient from "./HeaderClient";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/definitions";

// This is the fully corrected function to build the menu tree
const buildMenuTree = (categories: Category[], parentId: number | null = null, basePath: string = '/products'): unknown[] => {
  return categories
    .filter(cat => {
        // Correctly checks the flattened 'category' field for the parent ID
        const parent = cat.category;
        return (parent ? parent.id : null) === parentId;
    })
    .map(cat => {
      // Correctly accesses the slug from the flattened object
      const newPath = `${basePath}/${cat.slug}`;
      return {
        // Correctly accesses the name from the flattened object
        title: cat.name,
        link: newPath,
        submenu: buildMenuTree(categories, cat.id, newPath),
      }
    });
};

export default async function Header() {
  const session = await getServerSession();
  const allCategories = await getCategories();

  const storeSubmenu = buildMenuTree(allCategories, null, '/products');

  const menu = [
    { title: "خانه", link: "/" },
    {
      title: "فروشگاه",
      link: "/products",
      submenu: storeSubmenu,
    },
    { title: "بلاگ", link: "/blog" },
    { title: "نمونه کارها", link: "/portfolio" },
    { title: "تماس با ما", link: "/contact" },
    { title: "درباره ما", link: "/about" },
  ];

  return <HeaderClient session={session} menu={menu} />;
}