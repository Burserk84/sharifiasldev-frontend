import { getProductsByCategory } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import { Metadata } from "next";

// The props now receive an array of slugs
interface ProductCategoryPageProps {
  params: { slug: string[] };
}

export async function generateMetadata({
  params,
}: ProductCategoryPageProps): Promise<Metadata> {
  // Use the last slug for the category name
  const categoryName = params.slug[params.slug.length - 1].replace("-", " ");
  return {
    title: `${categoryName} | فروشگاه`,
  };
}

export default async function ProductCategoryPage({
  params,
}: ProductCategoryPageProps) {
  // The actual category we need to filter by is the LAST segment in the URL
  const currentCategorySlug = params.slug[params.slug.length - 1];
  const products = await getProductsByCategory(currentCategorySlug);
  const categoryName = currentCategorySlug.replace("-", " ");

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-white capitalize">
          {categoryName}
        </h1>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          محصولی در این دسته‌بندی یافت نشد.
        </p>
      )}
    </div>
  );
}
