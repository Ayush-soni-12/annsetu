import { z } from "zod";

export const donationSchema = z.object({
  donorName: z.string().min(2, "Name must be at least 2 characters"),

  phone: z
    .string()
    .min(10, "Enter a valid 10-digit phone number")
    .regex(/^\d+$/, "Phone number must contain only digits"),

  foodName: z.string().min(1, "Food name is required"),

  foodType: z.enum(["Cooked Food", "Raw Ingredients", "Packaged Food"], {
    errorMap: () => ({ message: "Please select a food type" }),
  }),

  foodCategory: z.enum(["Vegetarian", "Non-Vegetarian", "Vegan"], {
    errorMap: () => ({ message: "Please select a food category" }),
  }),

  quantity: z.string().min(1, "Quantity is required"),

  serves: z
    .string()
    .min(1, "This field is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a valid positive number",
    }),

  pickupTime: z
    .string()
    .min(1, "Pickup date is required")
    .refine(
      (val) => {
        if (!val || val.trim() === "") return false;
        const date  = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(date.getTime()) && date >= today;
      },
      { message: "Pickup date must be today or in the future" }
    ),

  address: z.string().min(5, "Please enter a complete address"),

  instructions: z.string().optional(),
});
