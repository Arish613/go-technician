"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FormFields from "@/components/FormFields";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { sendEmailForComplaint } from "@/lib/action/send-email";
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
    .min(5, "Description must be at least 5 characters")
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


export function ComplaintForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      city: "mumbai",
      complaintType: "service_quality",
      bookingId: "",
      description: "",
    },
  });

  const onSubmit = async (data: ComplaintFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      setIsSubmitted(true);
      console.log("Complaint submitted:", data);
      await sendEmailForComplaint({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        city: data.city,
        complaintType: data.complaintType,
        bookingId: data.bookingId,
        description: data.description,

      })

      reset();
    } catch (error) {
      console.error("Error submitting complaint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-green-800">
            Complaint Submitted Successfully!
          </h3>
          <p className="mb-6 max-w-md text-green-700">
            Thank you for reaching out. Our team will review your complaint and
            get back to you within 24-48 hours.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            className="bg-green-600 hover:bg-green-700"
          >
            Submit Another Complaint
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormFields
                name="name"
                control={control}
                label="Full Name"
                placeholder="Enter your full name"
                autocomplete="name"
              />
              <FormFields
                name="email"
                control={control}
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                autocomplete="email"
              />
              <FormFields
                name="phoneNumber"
                control={control}
                label="Phone Number"
                placeholder="Enter your phone number"
                type="tel"
                autocomplete="tel"
              />
              <FormFields
                name="city"
                control={control}
                label="City"
                placeholder="Select your city"
                type="select"
                options={cities}
              />
            </div>
          </div>

          {/* Complaint Details */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Complaint Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormFields
                name="complaintType"
                control={control}
                label="Complaint Type"
                placeholder="Select complaint type"
                type="select"
                options={complaintTypes}
              />
              <FormFields
                name="bookingId"
                control={control}
                label="Booking ID (Optional)"
                placeholder="Enter booking ID if available"
                description="You can find this in your booking confirmation"
              />
            </div>
            <div className="mt-4">
              <FormFields
                name="description"
                control={control}
                label="Describe Your Complaint"
                placeholder="Please provide detailed information about your complaint. Include dates, technician name, and any other relevant details that will help us resolve your issue quickly."
                type="textarea"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              We typically respond within 24-48 hours
            </p>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
