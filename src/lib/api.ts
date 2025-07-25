import type {
  Category,
  PortfolioItem,
  Product,
  Post,
  Comment,
} from "./definitions";

/**
 * @file src/lib/api.ts
 * @description This file contains all functions for fetching data from the Strapi API.
 */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * A generic helper function to fetch data from the Strapi API.
 * It centralizes the URL, caching, and error handling.
 * @param {string} path The API path to fetch (e.g., '/posts')
 * @param {RequestInit} options Custom options for the fetch request
 * @returns {Promise<unknown>} The JSON response from the API.
 */
async function fetchAPI(path: string, options: RequestInit = {}) {
  try {
    const defaultOptions: RequestInit = {
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Prevents Next.js from caching API requests
    };
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    const res = await fetch(`${STRAPI_URL}/api${path}`, mergedOptions);

    if (!res.ok) {
      console.error(
        `Failed to fetch from ${path}: ${res.status} ${res.statusText}`
      );
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error in fetchAPI:", error);
    return null;
  }
}

/**
 * Fetches all portfolio items.
 */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const response = await fetchAPI("/portfolios?populate=*");
  return response?.data || [];
}

/**
 * Fetches all products.
 */
export async function getProducts(): Promise<Product[]> {
  const response = await fetchAPI("/products?populate=*");
  return response?.data || [];
}

/**
 * Fetches all posts.
 */
export async function getPosts(): Promise<Post[]> {
  const response = await fetchAPI("/posts?populate=*");
  return response?.data || [];
}

/**
 * Fetches all product categories.
 */
export async function getCategories(): Promise<Category[]> {
  const response = await fetchAPI("/categories?populate=parent");
  return response?.data || [];
}

/**
 * Searches for posts based on a query string.
 */
/**
 * Searches across multiple content types (Posts, Products, Portfolio) in Strapi.
 * @param {string} query The user's search term.
 * @returns {Promise<unknown[]>} A combined array of results.
 */
export async function searchContent(query: string): Promise<unknown[]> {
  if (!query) return [];

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Define the endpoints to search
  const endpoints = [
    `/api/posts?filters[title][$containsi]=${query}&populate=*`,
    `/api/products?filters[name][$containsi]=${query}&populate=*`,
    `/api/portfolios?filters[title][$containsi]=${query}&populate=*`,
  ];

  // Make all API calls in parallel for better performance
  const responses = await Promise.all(
    endpoints.map((endpoint) => fetch(`${STRAPI_URL}${endpoint}`))
  );

  const data = await Promise.all(responses.map((res) => res.json()));

  // Add a 'type' to each result so we know where it came from
  const posts = data[0].data.map((item: unknown) => ({
    ...item.attributes,
    type: "blog",
    id: item.id,
  }));
  const products = (data[1].data || data[1]).map((item: unknown) => ({
    ...item.attributes,
    type: "product",
    id: item.id,
  }));
  const portfolios = (data[2].data || data[2]).map((item: unknown) => ({
    ...item.attributes,
    type: "portfolio",
    id: item.id,
  }));

  // Combine all results into a single array
  return [...posts, ...products, ...portfolios];
}

/**
 * Fetches a single post by its slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const response = await fetchAPI(
    `/posts?filters[slug][$eq]=${slug}&populate=*`
  );
  return response?.data?.[0] || null;
}

/**
 * Fetches a single portfolio item by its slug.
 */
export async function getPortfolioItemBySlug(
  slug: string
): Promise<PortfolioItem | null> {
  const response = await fetchAPI(
    `/portfolios?filters[slug][$eq]=${slug}&populate=*`
  );
  return response?.data?.[0] || null;
}

/**
 * Fetches all products that belong to a specific category.
 */
export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const response = await fetchAPI(
    `/products?populate=*&filters[categories][slug][$eq]=${categorySlug}`
  );
  return response?.data || [];
}

/**
 * Fetches a single product by its slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetchAPI(
    `/products?filters[slug][$eq]=${slug}&populate=*`
  );
  return response?.data?.[0] || null;
}

/**
 * Fetches all comments made by the currently logged-in user.
 */
export async function getUserComments(jwt: string): Promise<Comment[]> {
  const response = await fetchAPI("/comments/user/me", {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  // The comments plugin returns a flat array, not a {data: []} object
  return response || [];
}
