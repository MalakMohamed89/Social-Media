import * as z from "zod";
 
export const registerSchema=z.object({
  name: z.string().trim() .min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters").nonempty("Name is required"),
  email:z.string().trim().nonempty("Email is required").regex( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Please enter a valid email address"),
 dateOfBirth:z.string().nonempty("Birth of Date is required").refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

if(age<13){
    return false
}
else{
    return true
}
      }, "You must be at least 13 years old"),

   gender:z.enum(["male", "female"], { message: "Please select your gender",}),
  password:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character").nonempty("Password is required"),
  rePassword:z.string().nonempty("Please confirm your password")
}).refine((data)=>data.password===data.rePassword,{
      message: "Passwords do not match",
      path: ["rePassword"],})

export type registerSchemaType=z.infer<typeof registerSchema>; 