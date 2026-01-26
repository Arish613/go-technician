import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/action/send-email";

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    const result = await sendBookingEmail(bookingData);
    
    if (result.status === 200) {
      return NextResponse.json(
        { message: result.message },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error("Error processing booking:", error);
    return NextResponse.json(
      { message: "Failed to process booking" },
      { status: 500 }
    );
  }
}
