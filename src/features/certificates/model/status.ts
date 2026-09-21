import { addYears } from "../../../shared/lib/format";
import type { Certificate } from "../../../types";

export function ageYears(c: Certificate) {
  return Number(c.baseYears) + Number(c.extraYears || 0);
}

export function validTo(c: Certificate) {
  return addYears(c.validFrom, ageYears(c));
}

export function daysLeft(c: Certificate) {
  return Math.floor((new Date(validTo(c)).getTime() - Date.now()) / 86400000);
}

export function isExpired(c: Certificate) {
  if (c.pending || c.status === "Pending") return false;
  return daysLeft(c) < 0;
}

export function isExpiringSoon(c: Certificate) {
  const d = daysLeft(c);
  return d >= 0 && d <= 60;
}

export function remaining(c: Certificate) {
  if (c.pending || c.status === "Pending") {
    return "Enrollment submitted. The CA will issue this certificate after review.";
  }
  const days = daysLeft(c);
  if (days < 0) {
    return "This certificate expired " + Math.abs(days) + " days ago. Extend validity to restore it.";
  }
  const y = Math.floor(days / 365);
  const d = days % 365;
  if (isExpiringSoon(c)) return "Expires soon — " + days + " day(s) remaining.";
  return y <= 0 ? d + " days remaining" : y + " year(s), " + d + " days remaining";
}

export function statusTag(c: Certificate) {
  if (c.pending || c.status === "Pending") return { label: "Pending", cls: "tag-soon", status: "Enrollment pending" };
  if (isExpired(c)) return { label: "Expired", cls: "tag-expired", status: "Expired" };
  if (isExpiringSoon(c)) return { label: "Expires soon", cls: "tag-soon", status: "Active — expiring soon" };
  return { label: "Active", cls: "tag-active", status: "Active" };
}
