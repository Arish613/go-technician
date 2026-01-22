"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormFields from "@/components/FormFields";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { sendContactFormEmail } from "@/lib/action/send-email";
import z from "zod";


export const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    city: z.string().min(2, "Please enter your city"),
    service: z.string().min(1, "Please select a service"),
    message: z.string().min(1, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const services = [
    { value: "ac_repair", label: "AC Repair" },
    { value: "laptop_service", label: "Laptop Service" },
    { value: "appliance_repair", label: "Appliance Repair" },
    { value: "home_cleaning", label: "Home Cleaning" },
    { value: "plumbing", label: "Plumbing" },
    { value: "other", label: "Other" },
];

export function ContactForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, reset } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            city: "",
            service: "ac_repair",
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsLoading(true);
        try {
            const result = await sendContactFormEmail(data);

            if (result.status === 200) {
                setIsSubmitted(true);
                reset();
            }
        } catch (error) {
            console.error("Error submitting contact form:", error);
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
                        Message Sent Successfully!
                    </h3>
                    <p className="mb-6 max-w-md text-green-700">
                        Thank you for contacting us. We&apos;ll get back to you within 4 working hours.
                    </p>
                    <Button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        Send Another Message
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 bg-white shadow-xl shadow-blue-100/60">
            <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                    Tell us a little about your request
                </CardTitle>
                <p className="text-sm text-slate-500">
                    Fill the form and we&apos; respond within a few hours. Urgent? Call or WhatsApp us.
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormFields
                            name="name"
                            control={control}
                            label="Full Name"
                            placeholder="Enter your full name"
                            autocomplete="name"
                        />
                        <FormFields
                            name="phoneNumber"
                            control={control}
                            label="Phone Number"
                            placeholder="Enter your phone number"
                            type="tel"
                            autocomplete="tel"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <FormFields
                            name="email"
                            control={control}
                            label="Email Address"
                            placeholder="Enter your email"
                            type="email"
                            autocomplete="email"
                        />
                        <FormFields
                            name="city"
                            control={control}
                            label="City"
                            placeholder="Enter your city"
                        />
                    </div>

                    <FormFields
                        name="service"
                        control={control}
                        label="Select a Service"
                        placeholder="Choose a service"
                        type="select"
                        options={services}
                    />

                    <FormFields
                        name="message"
                        control={control}
                        label="How can we help you?"
                        placeholder="Tell us about your requirements..."
                        type="textarea"
                    />

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-linear-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-fuchsia-600"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit request"
                        )}
                    </Button>

                    <p className="text-xs text-slate-500">
                        By submitting, you agree to receive updates via phone, WhatsApp, or email.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}