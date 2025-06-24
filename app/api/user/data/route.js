import connectDB from "@/config/db";
import User from "@/Model/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Get the user ID from the authentication token
        const { userId } = getAuth(request);
        
        // Connect to the MongoDB database
        await connectDB();
        
        // Find the user in the database using the userId
        const user = await User.findById(userId);
        
        // If user not found, return error response
        if (!user) {
            return NextResponse.json({ success: false, message: "User Not Found" });
        }
        
        // Return successful response with user data
        return NextResponse.json({ success: true, user });
    } catch (error) {
        // Handle any errors that occur during the process
        return NextResponse.json({ success: false, message: error.message });
    }
}

