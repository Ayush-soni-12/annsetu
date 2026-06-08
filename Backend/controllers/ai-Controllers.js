const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.analyzeFoodSafety = async (req, res) => {
  try {
    console.log("=== AI Food Safety Check Started ===");
    const { imageUrl, foodName, foodType } = req.body;
    console.log("Received data:", { imageUrl, foodName, foodType });

    // --- Input validation ---
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image URL is required" });
    }

    // Validate imageUrl is a proper HTTP/HTTPS URL (prevents SSRF attacks)
    try {
      const parsed = new URL(imageUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      return res.status(400).json({ success: false, message: "Invalid image URL: must be a valid http or https URL" });
    }

    const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "dummy";
    const hasOpenRouter = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "dummy";

    if (!hasGemini && !hasOpenRouter) {
      return res.status(500).json({ success: false, message: "Server misconfiguration: No AI API Keys found (Need GEMINI_API_KEY or OPENROUTER_API_KEY)" });
    }

    // Fallback values so prompt never says "undefined"
    const safeFoodName = foodName || "unknown food";
    const safeFoodType = foodType || "unknown type";

    const prompt = `You are an expert food safety inspector. Analyze the provided image of food being donated.
Context: The food is described as "${safeFoodName}" and is of type "${safeFoodType}".
Look closely for visible signs of spoilage, severe discoloration, mold, hazardous packaging, or extreme unhygienic conditions.
You must return a JSON response matching exactly this structure:
{
  "safetyScore": <number between 0 and 100>,
  "verdict": "<SAFE | CAUTION | REJECT>",
  "notes": "<short explanation of your finding (max 2 sentences)>"
}
Scoring guide:
- SAFE (80-100): Food looks clean, freshly prepared or well-packaged, no visible issues, AND it matches the description.
- CAUTION (50-79): Image is blurry, packaging is questionable, or it's hard to tell. (Always err on caution if unsure).
- REJECT (0-49): Obvious mold, severe decay, very dirty container, raw meat sitting at room temperature in a dangerous way.

CRITICAL REJECTION RULES:
1. If the image does NOT contain food at all (e.g., a selfie, a car, a random object), you MUST set verdict to "REJECT", score to 0, and note "No food detected in image."
2. If the food in the image clearly DOES NOT MATCH the description "${safeFoodName}" (e.g. description says 'dal' but image shows 'chicken'), you MUST set verdict to "REJECT", score to 0, and explain the mismatch in the notes.

Return ONLY the raw JSON object. Do not wrap it in markdown code blocks.`;

    let responseText = "";

    // ==========================================
    // OPTION 1: GOOGLE GEMINI (Prioritized because it's fast & free)
    // ==========================================
    if (hasGemini) {
      console.log("Using Google Gemini Engine...");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash",
          generationConfig: { responseMimeType: "application/json" }
      });

      // Fetch the image from Cloudinary URL and convert to Buffer for Gemini
      const imageResp = await fetch(imageUrl);
      if (!imageResp.ok) throw new Error("Failed to fetch image from Cloudinary for Gemini");
      const arrayBuffer = await imageResp.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = imageResp.headers.get("content-type") || "image/jpeg";

      const imagePart = {
          inlineData: {
              data: buffer.toString("base64"),
              mimeType
          }
      };

      const result = await model.generateContent([prompt, imagePart]);
      responseText = result.response.text();

    } 
    // ==========================================
    // OPTION 2: OPENROUTER (Fallback if Gemini is missing)
    // ==========================================
    else if (hasOpenRouter) {
      console.log("Using OpenRouter Engine...");
      const VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "openrouter/free";
      const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });

      // --- Timeout via AbortController (60 seconds for slow free models) ---
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      try {
        const response = await openai.chat.completions.create(
          {
            model: VISION_MODEL,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: imageUrl } },
                ],
              },
            ],
            temperature: 0,
          },
          { signal: controller.signal }
        );
        responseText = response.choices[0].message.content.trim();
      } catch (aiError) {
        if (aiError.name === "AbortError") {
          return res.status(504).json({ success: false, message: "OpenRouter request timed out after 60 seconds. Model queue too long." });
        }
        throw aiError; // re-throw other AI errors to outer catch
      } finally {
        clearTimeout(timeoutId);
      }
    }

    // Clean markdown code fences if LLM wraps response anyway
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    // --- Safe JSON parse ---
    let analysis;
    try {
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", cleanedText);
      return res.status(502).json({
        success: false,
        message: "AI returned an unexpected response format",
        raw: cleanedText, // useful for debugging
      });
    }

    // --- Validate response shape ---
    const { safetyScore, verdict, notes } = analysis;
    const validVerdicts = ["SAFE", "CAUTION", "REJECT"];

    if (
      typeof safetyScore !== "number" ||
      safetyScore < 0 ||
      safetyScore > 100 ||
      !validVerdicts.includes(verdict) ||
      typeof notes !== "string"
    ) {
      console.error("AI response failed shape validation:", analysis);
      return res.status(502).json({
        success: false,
        message: "AI response is missing or has invalid required fields (safetyScore, verdict, notes)",
      });
    }

    console.log("AI Analysis Complete:", analysis);
    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("AI Food Safety Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze food safety: " + error.message,
    });
  }
};

const NgoProfile = require("../models/ngoProfile");

exports.matchDonation = async (req, res) => {
  try {
    console.log("=== AI Smart Donation Matching Started ===");
    const { foodType, foodCategory, serves, address } = req.body;

    if (!address || !serves || !foodType || !foodCategory) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: address, serves, foodType, foodCategory" 
      });
    }

    const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "dummy";
    const hasOpenRouter = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "dummy";

    if (!hasGemini && !hasOpenRouter) {
      return res.status(500).json({ success: false, message: "No AI API Keys found" });
    }

    // 1. PRE-FILTER: Ask the database for NGOs that match the strict rules
    // Rule: Must be verified, must have capacity, must accept food type & category
    const eligibleNgos = await NgoProfile.find({
      verified: true, // Only match with verified NGOs
      capacityMeals: { $gte: Number(serves) }, // NGO must have enough capacity
      acceptedFoodTypes: foodType,             // NGO must accept "Cooked Food" etc.
      dietaryPref: foodCategory                // NGO must accept "Vegetarian" etc.
    }).select("_id orgName address city capacityMeals"); // Only fetch what AI needs

    if (!eligibleNgos || eligibleNgos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No verified NGOs found matching this capacity and food type right now."
      });
    }

    // 2. AI GEOGRAPHIC MATCHING: Ask AI to find the closest NGO
    const prompt = `You are Annsetu's AI logistics coordinator. 
A donor is donating food from this pickup address: "${address}".

Here is a list of pre-filtered NGOs that have the capacity and accept this food type:
${JSON.stringify(eligibleNgos)}

Your job is to determine which NGO is geographically closest to the donor's address.
Return ONLY a raw JSON object strictly matching this format (no markdown fences):
{
  "bestMatchNgoId": "<the _id string of the chosen NGO>",
  "bestMatchName": "<orgName of the chosen NGO>",
  "matchScore": <a number 0-100 representing confidence in the distance match>,
  "reason": "<A 1-sentence explanation of why this NGO is the best location match>"
}`;

    let responseText = "";

    // Run via Gemini (Preferred for speed/free tier)
    if (hasGemini) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    } 
    // Run via OpenRouter fallback
    else {
      const VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "openrouter/free";
      const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });
      const response = await openai.chat.completions.create({
        model: VISION_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      });
      responseText = response.choices[0].message.content.trim();
    }

    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const matchData = JSON.parse(cleanedText);

    console.log("AI Match Complete:", matchData);
    return res.status(200).json({
      success: true,
      match: matchData
    });

  } catch (error) {
    console.error("AI Matching Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to match donation: " + error.message,
    });
  }
};