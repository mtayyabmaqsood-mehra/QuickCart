import { Inngest } from "inngest";  //
import connectDB from "./db";
import User from "@/Model/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });  // Creating a new instance of Impest with an ID "quickcart-next" and exporting it

// Impest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'  // Defining the function ID
    },
    { event: 'clerk/user.created' },  // Specifying which event this function should trigger on
    async ({event}) => {  // Defining an async function that handles the event
        const { id, first_name, last_name, email_addresses, image_url } = event.data  // Destructuring user data from event
        const userData = {  // Creating a userData object with formatted data
            _id: id,
            email: email_addresses[0].email_address,  // Taking the first email address
            name: first_name + ' ' + last_name,  // Combining first and last name
            imageUrl: image_url
        }
    await connectDB()
    await User.create(userData)
    }
)
// Impest Function to update user data to a database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'  // Defining the function ID
    },
    { event: 'clerk/user.updated' },  // Specifying which event this function should trigger on
    async ({event}) => {  // Defining an async function that handles the event
        const { id, first_name, last_name, email_addresses, image_url } = event.data  // Destructuring user data from event
        const userData = {  // Creating a userData object with formatted data
            _id: id,
            email: email_addresses[0].email_address,  // Taking the first email address
            name: first_name + ' ' + last_name,  // Combining first and last name
            imageUrl: image_url
        }
    await connectDB()
    await User.findByIdAndUpdate(id,userData)
    }
)
////Inngest function to Delete User from Database
// Impest Function to save user data to a database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'  // Defining the function ID
    },
    { event: 'clerk/user.deleted' },  // Specifying which event this function should trigger on
    async ({event}) => {  // Defining an async function that handles the event
        const { id } = event.data  // Destructuring user data from event
     
    await connectDB()
    await User.findByIdAndDelete(id)
    }
  )