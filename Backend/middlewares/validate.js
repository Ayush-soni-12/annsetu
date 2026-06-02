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

module.exports = {
  validate,
  signupSchema,
  loginSchema,
};
