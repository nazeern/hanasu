import { NextResponse } from "next/server";

export async function GET() {
    // Temporarily disable the daily notification
    return new NextResponse("Daily notifications are temporarily disabled.", { status: 200 });
}