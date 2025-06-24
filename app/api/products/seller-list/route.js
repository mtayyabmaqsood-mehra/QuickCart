// import connectDB from '@/config/db'
// import authSeller from '@/lib/authSeller'
// import Product from '@/Model/Product'
// import { getAuth } from '@clerk/nextjs/server'
// import { NextResponse } from 'next/server'

// export async function GET(request) {
//   try {
//     const { userId } = getAuth(request)

//     const isSeller = authSeller(userId)

//     if (!isSeller) {
//       return NextResponse.json({success:false, message:"not authorized"})
//     }
// await connectDB()
// const products=await Product.find({})

//   } catch (error) {
// return NextResponse.json({success:false, message:error.message})
//   }
// }

import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Product from '@/Model/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Authenticated User
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "User not authenticated" }, {status: 401});
    }

    // Check if seller
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized" }, {status: 403});
    }

    // Connect to DB first
    await connectDB();

    // Filter products by their userId
    const products = await Product.find({ userId });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, {status: 500});
  }
}



