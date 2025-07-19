// Import a library to parse markdown content
import { Remarkable } from 'remarkable';

// Define the types again for clarity
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  // Make sure to add any other fields you might need, like createdAt
  createdAt: string;
}

// This function fetches a SINGLE post based on its slug
async function getSinglePost(slug: string): Promise<{ data: Post[] }> {
  // We use Strapi's filtering feature to find the post with the matching slug
  const res = await fetch(`http://localhost:1337/api/posts?filters[slug][$eq]=${slug}`);

  if (!res.ok) {
    throw new Error('Failed to fetch single post');
  }

  return res.json();
}

// This is the main component for the single post page
export default async function PostPage({ params }: { params: { slug: string } }) {
  const { data } = await getSinglePost(params.slug);

  // If no post is found, you can show a 404 page or a message
  if (!data || data.length === 0) {
    return <div>پست مورد نظر یافت نشد.</div>;
  }

  const post = data[0]; // The post data is inside the first element of the array

  // Initialize the markdown parser
  const md = new Remarkable();
  const htmlContent = md.render(post.content);

  return (
    <article className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-gray-50">
        {post.title}
      </h1>
      <p className="text-gray-500 mb-8">
        منتشر شده در: {new Date(post.createdAt).toLocaleDateString('fa-IR')}
      </p>
      {/* We use dangerouslySetInnerHTML because our content is HTML from markdown */}
      <div
        className="prose dark:prose-invert lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
}