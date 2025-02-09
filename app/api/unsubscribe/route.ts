import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    if (!userId) {
        return new NextResponse("Could not unsubscribe. No user id was provided.")
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from('profiles')
        .update({ notify: false })
        .eq('id', userId)
    if (error) {
        console.log(error)
        return new NextResponse("Failed to unsubscribe user.")
    } else {
        return new NextResponse("You have been successfully unsubscribed.")
    }
}