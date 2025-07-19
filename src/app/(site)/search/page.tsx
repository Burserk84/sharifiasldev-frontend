import { searchContent } from "@/lib/api";
import Link from 'next/link';

// This page receives `searchParams` as a prop
export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q;
  const results = await searchContent(query);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">
        نتایج جستجو برای: <span className="text-orange-400">{query}</span>
      </h1>

      {results.length > 0 ? (
        <ul className="space-y-6">
          {results.map((item) => (
            <li key={item.id}>
              <Link href={`/blog/${item.slug}`} className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700">
                <h2 className="text-2xl font-bold text-orange-400">{item.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg text-gray-400">هیچ نتیجه‌ای یافت نشد.</p>
      )}
    </div>
  );
}