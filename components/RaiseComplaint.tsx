"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FormFields from "@/components/FormFields";
import {
  complaintSchema,
  type ComplaintFormData,
  cities,
  complaintTypes,
} from "@/lib/schemas/complaint";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

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
      console.log("Complaint submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
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
