"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, InfoIcon } from "lucide-react";

interface ProductDialogProps {
  product: {
    id: string;
    name: string;
    description?: string | null;
    image?: string | null;
    whatsIncluded?: string[];
    additionalInfo?: string[];
  };
}

export function ProductDialog({ product }: ProductDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-primary transition-colors cursor-pointer p-1">
          <Info className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={300}
              className="rounded-lg object-cover mx-auto"
            />
          )}
          <DialogTitle>{product.name}</DialogTitle>
          {product.description && (
            <DialogDescription>{product.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* What You Get */}
          {product.whatsIncluded && product.whatsIncluded.length > 0 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <span className="text-green-600">✓</span> What You Get
                </h4>
                <ul className="space-y-1.5">
                  {product.whatsIncluded.map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {product.additionalInfo && product.additionalInfo.length > 0 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <InfoIcon className="w-4" /> Additional Information
                </h4>
                <ul className="space-y-1.5">
                  {product.additionalInfo.map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
