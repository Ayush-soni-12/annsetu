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

exports.annaChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "dummy") {
      return res.status(500).json({ success: false, message: "Gemini API Key missing" });
    }

    // 1. Build a VERY DETAILED System Prompt (Rules are static, no DB data here)
    const systemPrompt = `You are Anna, the friendly, empathetic, and highly intelligent customer support AI for Annsetu.
Annsetu is India's premier food donation platform bridging the gap between surplus food (from individuals/restaurants) and verified NGOs.

CORE PLATFORM RULES & KNOWLEDGE:
1. How to Donate: Users must sign up as a Donor, click 'Donate Food', fill out the details (serves, food type), and upload a photo of the food. 
2. AI Food Safety: Every uploaded food photo is scanned by our AI. If the food looks spoiled, moldy, or does not match the description, it is instantly REJECTED.
3. AI NGO Matching: After passing the safety check, our AI automatically matches the donation to the best verified NGO based on distance, capacity, and dietary preference.
4. NGO Approval: NGOs can sign up, but they must be manually approved by our Admin team before they can receive food.

YOUR DIRECTIVES:
- Always be polite and encouraging. Use short, concise paragraphs.
- If someone asks which NGOs are on the platform or asks for NGOs in a specific city, YOU MUST USE THE 'search_ngos' TOOL. Do not guess or hallucinate NGO names.
- If someone asks something unrelated to Annsetu, food donation, or charity, politely decline to answer.`;

    // 2. Define the Tools for Gemini
    const tools = [
      {
        functionDeclarations: [
          {
            name: "search_ngos",
            description: "Fetch a real-time list of verified NGOs currently active on the Annsetu platform. Optionally filter by city.",
            parameters: {
              type: "OBJECT",
              properties: {
                city: {
                  type: "STRING",
                  description: "The name of the city to filter NGOs by (e.g., 'Delhi', 'Mumbai'). Leave empty to get all NGOs."
                }
              }
            }
          }
        ]
      }
    ];

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      tools: tools
    });

    // 3. Format History
    // Gemini strictly requires the history to start with a 'user' message and alternate (user, model, user, model).
    // The frontend sends the initial 'assistant' greeting, which crashes Gemini.
    const rawHistory = history.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const geminiHistory = [];
    let expectedRole = "user";

    for (const msg of rawHistory) {
      if (msg.role === expectedRole) {
        geminiHistory.push(msg);
        expectedRole = expectedRole === "user" ? "model" : "user";
      } else if (geminiHistory.length > 0) {
        // If we get consecutive messages from the same role, merge them to keep Gemini happy
        geminiHistory[geminiHistory.length - 1].parts[0].text += "\n\n" + msg.parts[0].text;
      }
    }

    const chat = model.startChat({ history: geminiHistory });

    // 4. Send the user's message
    let result = await chat.sendMessage(message);

    // 5. Check if Gemini decided to call a Tool
    const functionCalls = result.response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      
      if (call.name === "search_ngos") {
        console.log(`Gemini triggered Tool: search_ngos. Args:`, call.args);
        
        // Execute real DB Query
        const query = { verified: true };
        if (call.args.city) {
          query.city = { $regex: new RegExp(call.args.city, "i") }; // Case insensitive search
        }
        
        const ngos = await NgoProfile.find(query)
          .select("orgName city contactPhone acceptedFoodTypes capacityMeals")
          .lean();
        
        const apiResponse = ngos.length > 0 
          ? { status: "success", ngos: ngos } 
          : { status: "not_found", message: "No verified NGOs found matching that criteria." };

        // Send the tool's result back to Gemini so it can formulate a human answer
        result = await chat.sendMessage([{
          functionResponse: {
            name: "search_ngos",
            response: apiResponse
          }
        }]);
      }
    }

    // 6. Return the final text
    const replyText = result.response.text();

    return res.status(200).json({
      success: true,
      reply: replyText
    });

  } catch (error) {
    console.error("Anna Chatbot Error:", error);
    return res.status(500).json({
      success: false,
      message: "Chatbot failed to respond: " + error.message,
    });
  }
};