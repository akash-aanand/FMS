import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Performs a robust, multi-word search across multiple fields.
 * @param searchTerm The full search string from the user.
 * @param fieldsToSearch An array of strings to search against (e.g., [student.name, student.rollNumber, student.email]).
 * @returns true if all words in the search term are found in the combined fields, false otherwise.
 */
export function robustSearch(searchTerm: string, fieldsToSearch: (string | undefined | null)[]): boolean {
  if (!searchTerm) {
    return true; // No search term means show all
  }

  const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
  const combinedFields = fieldsToSearch
    .filter(field => field) // Remove null/undefined fields
    .join(' ')
    .toLowerCase();

  return searchTerms.every(term => combinedFields.includes(term));
}