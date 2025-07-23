import type { Category, PortfolioItem, Product, Post } from "./definitions";

/**
 * @file src/lib/api.ts
 * @description This file contains all functions for fetching data from the Strapi API.
 * Centralizing fetch logic here improves readability and maintainability.
 */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * A generic helper function to fetch data from the Strapi API.
 * It handles the base URL, headers, caching strategy, and basic error handling.
 * @param {string} path The API path to fetch (e.g., '/posts')
 * @param {RequestInit} options Custom options for the fetch request
 * @returns {Promise<any>} The JSON response from the API.
 */
async function fetchAPI(path: string, options: RequestInit = {}) {
  try {
    const defaultOptions: RequestInit = {
      headers: { "Content-Type": "application/json" },
      // This tells Next.js not to cache these API requests.
      cache: "no-store",
    };
    const mergedOptions = { ...defaultOptions, ...options };
    const res = await fetch(`${STRAPI_URL}/api${path}`, mergedOptions);

    if (!res.ok) {
      console.error(`Failed to fetch from ${path}: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error in fetchAPI:", error);
    return null;
  }
}

// --- All functions below now use the central fetchAPI helper ---

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const response = await fetchAPI("/portfolios?populate=*");
  // Handles both standard and "flattened" responses
  return response?.data || response || [];
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetchAPI("/products?populate=*");
  return response?.data || response || [];
}

export async function getPosts(): Promise<Post[]> {
  const response = await fetchAPI("/posts?populate=*");
  return response?.data || []; // Posts use the standard structure
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetchAPI("/categories?populate=*");
  return response?.data || []; // Categories use the standard structure
}

export async function searchContent(query: string): Promise<Post[]> {
  if (!query) return [];
  const response = await fetchAPI(
    `/posts?filters[title][$containsi]=${query}&populate=*`
  );
  return response?.data || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const response = await fetchAPI(
    `/posts?filters[slug][$eq]=${slug}&populate=*`
  );
  return response?.data?.[0] || null;
}

export async function getPortfolioItemBySlug(
  slug: string
): Promise<PortfolioItem | null> {
  const response = await fetchAPI(
    `/portfolios?filters[slug][$eq]=${slug}&populate=*`
  );
  const data = response?.data || response;
  return data?.[0] || null;
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const response = await fetchAPI(
    `/products?populate=*&filters[categories][slug][$eq]=${categorySlug}`
  );
  return response?.data || response || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetchAPI(
    `/products?filters[slug][$eq]=${slug}&populate=*`
  );
  const data = response?.data || response;
  return data?.[0] || null;
}
