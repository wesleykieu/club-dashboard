// Credit conversion utilities

import type { Director, ProCreditStatus } from "./types"

/**
 * Convert credit value to numeric for sorting and totals
 */
export function creditToNumeric(
  credit: number | ProCreditStatus,
  director: Director
): number {
  if (director === "procredits") {
    switch (credit) {
      case "clear":
        return 0
      case "yellow":
        return 0.5
      case "green":
        return 1
      default:
        return 0
    }
  }

  if (director === "brotherhood" || director === "education") {
    return credit === 1 || credit === true ? 1 : 0
  }

  // fundraising, service, or rush
  return typeof credit === "number" ? credit : 0
}

/**
 * Get display label for credit value
 */
export function creditToLabel(
  credit: number | ProCreditStatus,
  director: Director
): string {
  if (director === "procredits") {
    if (typeof credit === "string") {
      return credit.charAt(0).toUpperCase() + credit.slice(1)
    }
    // Map numeric to status
    if (credit === 0) return "No Credit"
    if (credit === 0.5) return "Half Credit"
    if (credit === 1) return "Full Credit"
    return "No Credit"
  }

  if (director === "brotherhood" || director === "education") {
    return credit === 1 || credit === true ? "Here" : "Not here"
  }

  // fundraising, service, or rush
  return typeof credit === "number" ? credit.toFixed(1) : "0.0"
}

/**
 * Validate credit value for a director
 */
export function isValidCredit(
  credit: number | ProCreditStatus,
  director: Director
): boolean {
  if (director === "procredits") {
    return ["clear", "yellow", "green"].includes(credit as string)
  }

  if (director === "brotherhood" || director === "education") {
    return credit === 0 || credit === 1 || typeof credit === "boolean"
  }

  // fundraising, service, or rush - must be multiple of 0.5
  if (typeof credit === "number") {
    return credit >= 0 && (credit * 2) % 1 === 0
  }

  return false
}

/**
 * Get director display name
 */
export function getDirectorLabel(director: Director): string {
  const labels: Record<Director, string> = {
    procredits: "Pro-Credits",
    brotherhood: "Brotherhood",
    fundraising: "Fundraising",
    service: "Service",
    education: "Education",
    rush: "Rush",
  }
  return labels[director]
}
