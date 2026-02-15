"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReviewForm } from "./ReviewForm";
import { Plus } from "lucide-react";

interface ReviewFormDialogProps {
  serviceId: string;
  serviceName: string;
  triggerButton?: React.ReactNode;
}

export function ReviewFormDialog({ 
  serviceId, 
  serviceName, 
  triggerButton 
}: ReviewFormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Write a Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {serviceName}
          </DialogDescription>
        </DialogHeader>
        <ReviewForm 
          serviceId={serviceId} 
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
