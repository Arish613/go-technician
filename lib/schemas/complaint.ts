import { z } from "zod";

export const complaintSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[0-9+\-\s]+$/, "Please enter a valid phone number"),
  city: z.string().min(1, "Please select a city"),
  complaintType: z.string().min(1, "Please select a complaint type"),
  bookingId: z.string().optional(),
  description: z
    .string()
    .min(5, "Description must be at least 20 characters")
    .max(1000, "Description must not exceed 1000 characters"),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;

export const cities = [
  { label: "Mumbai", value: "mumbai" },
];

export const complaintTypes = [
  { label: "Service Quality Issue", value: "service_quality" },
  { label: "Technician Behavior", value: "technician_behavior" },
  { label: "Delayed Service", value: "delayed_service" },
  { label: "Incorrect Billing", value: "incorrect_billing" },
  { label: "Incomplete Work", value: "incomplete_work" },
  { label: "Damage During Service", value: "damage" },
  { label: "Refund Request", value: "refund" },
  { label: "Other", value: "other" },
];
