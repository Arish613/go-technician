"use client";

import { useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, CheckCircle2, Minus, Plus, Clock, Calendar } from "lucide-react";
import { z } from "zod";
import { format, isValid, parseISO } from "date-fns";


// Validation schemas
const contactSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").or(z.literal("")),
});

const addressSchema = z.object({
  region: z.string().min(2, "Region is required"),
  flatNo: z.string().min(1, "Flat/House number is required"),
  landmark: z.string().min(2, "Landmark is required"),
});

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getFormattedDate = (dateStr: string) => {
  if (!dateStr) return "Pick a date";
  const date = parseISO(dateStr);
  if (!isValid(date)) return "Pick a date";
  return format(date, "d MMM (EEEE)");
};

function isSlotDisabled(slot: string, selectedDate: string) {
  if (!selectedDate) return false;
  const today = new Date();
  const selected = new Date(selectedDate);

  // Only check if selected date is today
  if (
    today.getFullYear() === selected.getFullYear() &&
    today.getMonth() === selected.getMonth() &&
    today.getDate() === selected.getDate()
  ) {
    // Parse slot hour (e.g., "10:00 AM" => 10, "01:00 PM" => 13)
    const [time, period] = slot.split(" ");
    const [hourStr, minuteStr] = time.split(":");
    let hour = Number(hourStr);
    const minute = Number(minuteStr);
    if (period === "AM" && hour === 12) hour = 0;

    // Compare with current hour and minute
    if (
      hour < today.getHours() ||
      (hour === today.getHours() && minute <= today.getMinutes())
    ) {
      return true;
    }
  }
  return false;
}

export function CartDialog({ open, onOpenChange }: CartDialogProps) {
  const { items, removeFromCart, clearCart, getTotalPrice, updateQuantity } = useCart();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const dateInputRef = useRef<HTMLInputElement>(null);

  // Form data
  const [contactData, setContactData] = useState({ phone: "", email: "" });
  const [addressData, setAddressData] = useState({
    region: "",
    flatNo: "",
    landmark: "",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Error states
  const [contactErrors, setContactErrors] = useState<{ phone?: string; email?: string }>({});
  const [addressErrors, setAddressErrors] = useState<{ region?: string; flatNo?: string; landmark?: string }>({});

  const handleNext = () => {
    if (step === 1 && items.length === 0) {
      return; // Don't proceed if cart is empty
    }

    if (step === 2) {
      // Validate contact info
      const result = contactSchema.safeParse(contactData);
      if (!result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errors: any = {};
        result.error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });
        setContactErrors(errors);
        return;
      }
      setContactErrors({});
    }

    if (step === 3) {
      // Validate address
      const result = addressSchema.safeParse(addressData);
      if (!result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errors: any = {};
        result.error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });
        setAddressErrors(errors);
        return;
      }
      setAddressErrors({});
    }

    if (step === 4) {
      // Validate date and time
      if (!selectedDate || !selectedTime) {
        alert("Please select date and time for booking");
        return;
      }
      handleSubmit();
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const bookingData = {
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.discountedPrice || item.price,
          quantity: item.quantity,
        })),
        contact: contactData,
        address: addressData,
        schedule: {
          date: selectedDate,
          time: selectedTime,
        },
        totalPrice: getTotalPrice(),
      };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setStep(5); // Success step
      } else {
        throw new Error("Failed to submit booking");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (step === 5) {
      clearCart();
      setStep(1);
      setContactData({ phone: "", email: "" });
      setAddressData({ region: "", flatNo: "", landmark: "" });
      setSelectedDate("");
      setSelectedTime("");
    }
    onOpenChange(false);
  };

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM",
    "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" forceMount>
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Your Cart"}
            {step === 2 && "Contact Information"}
            {step === 3 && "Service Address"}
            {step === 4 && "Booking Schedule"}
            {step === 5 && "Booking Confirmed"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Progress indicator */}
          {step < 5 && (
            <div className="flex items-center justify-between mb-6 px-4 ml-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${i <= step
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {i}
                  </div>
                  {i < 4 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${i < step ? "bg-primary" : "bg-gray-200"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Cart Items */}
          {step === 1 && (
            <div className="space-y-4">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Your cart is empty
                </p>
              ) : (
                <>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between border rounded-lg p-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <p className="text-sm font-medium">
                            ₹{item.discountedPrice || item.price}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {/* <p className="text-sm font-semibold mt-2">
                          Subtotal: ₹{(item.discountedPrice || item.price) * item.quantity}
                        </p> */}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className=" md:flex justify-between items-center text-lg font-bold">
                      <span className="max-sm:mr-2">Total:</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <form className="space-y-4" autoComplete="on">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={contactData.phone}
                  onChange={(e) =>
                    setContactData({ ...contactData, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                />
                {contactErrors.phone && (
                  <p className="text-sm text-red-500 mt-1">{contactErrors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={contactData.email}
                  onChange={(e) =>
                    setContactData({ ...contactData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
                {contactErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{contactErrors.email}</p>
                )}
              </div>
            </form>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <form className="space-y-4" autoComplete="on">
              <div>
                <Label htmlFor="region">Region/City *</Label>
                <Input
                  id="region"
                  name="region"
                  value={addressData.region}
                  onChange={(e) =>
                    setAddressData({ ...addressData, region: e.target.value })
                  }
                  placeholder="Enter your city/region"
                  autoComplete="address-level2"
                />
                {addressErrors.region && (
                  <p className="text-sm text-red-500 mt-1">{addressErrors.region}</p>
                )}
              </div>
              <div>
                <Label htmlFor="flatNo">Flat/House Number & Building *</Label>
                <Input
                  id="flatNo"
                  name="flatNo"
                  value={addressData.flatNo}
                  onChange={(e) =>
                    setAddressData({ ...addressData, flatNo: e.target.value })
                  }
                  placeholder="Enter flat/house number and building name"
                  autoComplete="street-address"
                />
                {addressErrors.flatNo && (
                  <p className="text-sm text-red-500 mt-1">{addressErrors.flatNo}</p>
                )}
              </div>
              <div>
                <Label htmlFor="landmark">Landmark *</Label>
                <Input
                  id="landmark"
                  name="landmark"
                  value={addressData.landmark}
                  onChange={(e) =>
                    setAddressData({ ...addressData, landmark: e.target.value })
                  }
                  placeholder="Enter nearby landmark"
                  autoComplete="address-line2"
                />
                {addressErrors.landmark && (
                  <p className="text-sm text-red-500 mt-1">{addressErrors.landmark}</p>
                )}
              </div>
            </form>
          )}

          {/* Step 4: Booking Schedule */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Select Date *</Label>
                <div className="relative">
                  <Input
                    ref={dateInputRef}
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="cursor-pointer pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => dateInputRef.current?.showPicker()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
                {selectedDate && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Selected: {getFormattedDate(selectedDate)}
                  </div>
                )}
              </div>
              <div>
                <Label>Select Time Slot *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-3 border rounded-lg text-left transition-colors ${selectedTime === slot
                        ? "border-primary bg-primary/10"
                        : "hover:border-gray-400"
                        }`}
                      disabled={isSlotDisabled(slot, selectedDate)}
                      style={isSlotDisabled(slot, selectedDate) ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{slot}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  id="agree"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="accent-primary"
                />
                <label htmlFor="agree" className="select-none">
                  By submitting this form, you agree to our{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground mb-4">
                Thank you for your booking. We&apos;ve sent a confirmation email to{" "}
                {contactData.email}
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                <p>
                  <strong>Date:</strong> {selectedDate}
                </p>
                <p>
                  <strong>Time:</strong> {selectedTime}
                </p>
                <p>
                  <strong>Total:</strong> ₹{getTotalPrice()}
                </p>
              </div>
              <div className="mt-6 text-sm text-muted-foreground">
                For any assistance, call us at <a href="tel:7977661546" className="underline hover:text-primary"> 7977661546</a> or email <a href="mailto:gotechnicians.com@gmail.com" className="underline hover:text-primary">gotechnicians.com@gmail.com</a>.<br />
                Your satisfaction is our priority. Thank you for choosing GoTechnicians!
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="md:flex justify-between pt-4 border-t items-center">
          {/* Total always visible */}
          {step > 1 && step < 5 && (<div className="font-bold text-lg mb-2 md:mb-0">
            Total: ₹{getTotalPrice()}
          </div>)}

          <div className="flex gap-2 w-full md:w-auto justify-end">
            {step > 1 && step < 5 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {step < 4 && (
              <Button
                onClick={handleNext}
                disabled={step === 1 && items.length === 0}
                className={`ml-auto ${step === 1 && "max-sm:mr-12"}`}
              >
                Next
              </Button>
            )}
            {step === 4 && (
              <Button
                onClick={handleNext}
                disabled={isSubmitting || !agreed}
                className="ml-auto"
              >
                {isSubmitting ? "Submitting..." : "Confirm Booking"}
              </Button>
            )}
            {step === 5 && (
              <Button onClick={handleClose} className="ml-auto">
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
