const { z } = require("zod");

// Reusable Zod validation middleware factory
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Format Zod errors into readable messages
    const errors = result.error.errors.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: errors[0].message, // send the first error as the main message
      errors,                      // also send all errors for the frontend
    });
  }

  // Attach validated (and sanitized) data to req.body
  req.body = result.data;
  next();
};

// ─── Schemas ─────────────────────────────────────────────────────
const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please enter a valid email"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please enter a valid email"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

const donationSchema = z.object({
  donorName: z
    .string({ required_error: "Your name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters"),

  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(10, "Enter a valid phone number"),

  foodName: z
    .string({ required_error: "Food name is required" })
    .trim()
    .min(1, "Food name cannot be empty"),

  foodType: z.enum(["Cooked Food", "Raw Ingredients", "Packaged Food"], {
    errorMap: () => ({ message: "Please select a valid food type" }),
  }),

  foodCategory: z.enum(["Vegetarian", "Non-Vegetarian", "Vegan"], {
    errorMap: () => ({ message: "Please select a food category" }),
  }),

  quantity: z
    .string({ required_error: "Quantity is required" })
    .trim()
    .min(1, "Quantity cannot be empty"),

  serves: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Serves must be a positive number",
    }),

  pickupTime: z
    .string({ required_error: "Pickup date & time is required" })
    .min(1, "Pickup date & time is required"),

  address: z
    .string({ required_error: "Pickup address is required" })
    .trim()
    .min(5, "Please enter a complete address"),

  instructions: z.string().trim().optional().default(""),
  
  foodImageUrl: z.string().url("Must be a valid URL").optional(),
});

module.exports = {
  validate,
  signupSchema,
  loginSchema,
  donationSchema,
};
