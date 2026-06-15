/**
 * Centralized Application Constants and Types
 * 
 * Defines enums and types for user roles, account lock status, 
 * registration processing, and class enrollment tracks.
 */

export const UserRole = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const AccountStatus = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
  ARCHIVED: "ARCHIVED",
} as const;

export type AccountStatus = typeof AccountStatus[keyof typeof AccountStatus];

export const RegistrationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type RegistrationStatus = typeof RegistrationStatus[keyof typeof RegistrationStatus];

export const EnrollmentStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export type EnrollmentStatus = typeof EnrollmentStatus[keyof typeof EnrollmentStatus];
