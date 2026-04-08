export * from "../services/blogService";
import { fetchBlogs, fetchBlogBySlug } from "../services/blogService";

/**
 * Deprecated: Use fetchBlogs or the useBlogs hook instead.
 */
export const getBlogs = fetchBlogs;

/**
 * Deprecated: Use fetchBlogBySlug or the useBlogs hook instead.
 */
export const getBlogBySlug = fetchBlogBySlug;
