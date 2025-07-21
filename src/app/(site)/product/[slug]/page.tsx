import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Remarkable } from "remarkable";
import type { DescriptionBlock } from "@/lib/definitions";
import { getProductBySlug } from "@/lib/api";
import ProductGallery from "@/components/products/ProductGallery";
import ProductComments from "@/components/products/ProductComments";

// Helper function to convert Strapi's Rich Text JSON to a string
function richTextToString(description: DescriptionBlock[] | null): string {
  if (!description) return "";
  return description
    .map((block) => block.children.map((child) => child.text).join(""))
    .join("\n\n");
}

// A component for the details table
function DetailsTable({
  details,
}: {
  details: { [key: string]: string } | null;
}) {
  if (!details) return null;
  const entries = Object.entries(details);
  if (entries.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {entries.map(([key, value], index) => (
          <div
            key={key}
            className={`flex justify-between p-4 text-sm ${
              index < entries.length - 1 ? "border-b border-gray-700" : ""
            }`}
          >
            <dt className="text-gray-400">{key}</dt>
            <dd className="font-semibold text-white">{value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SingleProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const productData = await getProductBySlug(slug);

  if (!productData) {
    notFound();
  }

  const product = productData;
  const { name, price, description, productImage, gallery, details } = product;

  // Combine main image and gallery images
  const mainImage = productImage?.[0];
  const galleryImages = gallery;

  const formattedPrice = new Intl.NumberFormat("fa-IR", {
    /* ... */
  })
    .format(price * 10)
    .replace("ریال", "تومان");
  const md = new Remarkable();
  const htmlDescription = description
    ? md.render(richTextToString(description))
    : "";

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div>
          {mainImage && galleryImages ? (
            <ProductGallery
              mainImage={mainImage}
              galleryImages={galleryImages}
            />
          ) : (
            <div className="relative w-full aspect-square bg-gray-800 rounded-lg">
              <p className="text-center text-gray-500">No Image</p>
            </div>
          )}
        </div>

        {/* Right Column: Product Details */}
        <div className="text-right">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white">
            {name}
          </h1>
          <p className="mt-4 text-4xl font-bold text-orange-400">
            {formattedPrice}
          </p>

          <div className="mt-8">
            <Button size="lg" className="w-full">
              افزودن به سبد خرید
            </Button>
          </div>

          <DetailsTable details={details} />

          {htmlDescription && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                توضیحات محصول
              </h2>
              <div
                className="prose prose-invert max-w-none text-right leading-relaxed"
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
              />
            </div>
          )}
        </div>
      </div>

      {/* comment section */}
      <div className="max-w-4xl mx-auto mt-16">
        <ProductComments productId={product.id} />
      </div>
    </div>
  );
}
