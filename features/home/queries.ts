export * from "./services/homeService";
import { fetchHomeData, fetchFaqs } from "./services/homeService";

/**
 * Deprecated: Use fetchHomeData or the useHome hook instead.
 */
export const getHomeData = fetchHomeData;

/**
 * Deprecated: Use fetchFaqs or the useHome hook instead.
 */
export const getFaqData = fetchFaqs;
