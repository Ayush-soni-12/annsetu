/**
 * Per-step validation for the NGO multi-step signup form.
 * Returns an errors object. Empty object means the step is valid.
 *
 * @param {number}  step  - current step index (0 = Account, 1 = Organisation, 2 = Preferences)
 * @param {object}  form  - current form state
 * @returns {{ [fieldKey: string]: string }}
 */
export function validateNgoStep(step, form) {
  const errors = {};

  if (step === 0) {
    if (!form.name?.trim() || form.name.length < 2)
      errors.name = "Name must be at least 2 characters";

    if (!form.email?.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errors.email = "Enter a valid email";

    if (!form.password || form.password.length < 6)
      errors.password = "Password must be at least 6 characters";
  }

  if (step === 1) {
    if (!form.orgName?.trim() || form.orgName.length < 2)
      errors.orgName = "Organisation name is required";

    if (!form.address?.trim() || form.address.length < 5)
      errors.address = "Full address is required";

    if (!form.city?.trim())
      errors.city = "City is required";

    if (!form.contactPhone?.trim() || form.contactPhone.length < 10)
      errors.contactPhone = "Enter a valid phone number";
  }

  if (step === 2) {
    if (!form.capacityMeals || Number(form.capacityMeals) <= 0)
      errors.capacityMeals = "Enter a valid capacity";

    if (!form.dietaryPref || form.dietaryPref.length === 0)
      errors.dietaryPref = "Select at least one dietary preference";
  }

  return errors;
}
