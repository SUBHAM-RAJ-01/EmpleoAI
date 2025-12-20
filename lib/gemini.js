const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent'

// Rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 2000 // 2 seconds between requests

async function waitForRateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    )
  }
  lastRequestTime = Date.now()
}

// Extract JSON from AI response
function extractJSON(text) {
  if (!text) return null

  console.log('📝 Raw response:', text.substring(0, 300))

  // Remove markdown code blocks
  let cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim()

  // Find JSON boundaries
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')

  if (start === -1) return null

  let jsonStr = end > start ? cleaned.substring(start, end + 1) : cleaned.substring(start)

  // Fix incomplete JSON
  jsonStr = fixJSON(jsonStr)

  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('JSON parse error:', e.message)
    return extractManually(jsonStr)
  }
}

function fixJSON(jsonStr) {
  let fixed = jsonStr.trim()

  // Remove trailing incomplete parts
  fixed = fixed.replace(/,\s*"[^"]*$/, '')
  fixed = fixed.replace(/,\s*$/, '')

  // Close brackets
  const openBrackets = (fixed.match(/\[/g) || []).length
  const closeBrackets = (fixed.match(/\]/g) || []).length
  if (openBrackets > closeBrackets) {
    fixed += ']'.repeat(openBrackets - closeBrackets)
  }

  // Close braces
  const openBraces = (fixed.match(/\{/g) || []).length
  const closeBraces = (fixed.match(/\}/g) || []).length
  if (openBraces > closeBraces) {
    fixed += '}'.repeat(openBraces - closeBraces)
  }

  return fixed
}

function extractManually(jsonStr) {
  try {
    const scoreMatch = jsonStr.match(/"score"\s*:\s*(\d+)/)
    const keywordsMatch = jsonStr.match(/"keywords"\s*:\s*\[(.*?)\]/s)
    const suggestionsMatch = jsonStr.match(/"suggestions"\s*:\s*\[(.*?)\]/s)
    const strengthsMatch = jsonStr.match(/"strengths"\s*:\s*\[(.*?)\]/s)
    const gapsMatch = jsonStr.match(/"gaps"\s*:\s*\[(.*?)\]/s)

    if (scoreMatch) {
      const parseArray = (match) => {
        if (!match) return []
        const strings = match[1].match(/"([^"]+)"/g)
        return strings ? strings.map((s) => s.replace(/"/g, '')) : []
      }

      return {
        score: parseInt(scoreMatch[1], 10),
        keywords: parseArray(keywordsMatch),
        suggestions: parseArray(suggestionsMatch),
        strengths: parseArray(strengthsMatch),
        gaps: parseArray(gapsMatch),
      }
    }
  } catch (e) {
    console.error('Manual extraction failed:', e.message)
  }
  return null
}

async function callGemini(prompt, maxTokens = 2048) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  await waitForRateLimit()

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: maxTokens,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Gemini API error:', error)
    throw new Error(error.error?.message || 'AI request failed')
  }

  const data = await response.json()

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid response from AI')
  }

  return data.candidates[0].content.parts[0].text
}

export async function extractJobFromEmail(emailContent) {
  const prompt = `Extract job info from this email as JSON.

EMAIL:
${emailContent.substring(0, 3000)}

Return ONLY this JSON format:
{"company":"name","role":"title","package":null,"deadline":null,"assessmentDate":null,"interviewDate":null,"description":"desc","requirements":"reqs","location":null}

Use null for missing fields. Dates as YYYY-MM-DD.`

  try {
    const text = await callGemini(prompt, 1000)
    const result = extractJSON(text)
    
    if (!result) {
      return {
        company: 'Unknown',
        role: 'Unknown',
        package: null,
        deadline: null,
        assessmentDate: null,
        interviewDate: null,
        description: 'Could not extract',
        requirements: 'Could not extract',
        location: null,
      }
    }

    return {
      company: result.company || 'Unknown',
      role: result.role || 'Unknown',
      package: result.package || null,
      deadline: result.deadline || null,
      assessmentDate: result.assessmentDate || null,
      interviewDate: result.interviewDate || null,
      description: result.description || '',
      requirements: result.requirements || '',
      location: result.location || null,
    }
  } catch (error) {
    console.error('❌ Extract error:', error)
    throw error
  }
}

export async function tailorResume(resumeContent, jobDescription) {
  const prompt = `Analyze resume vs job. Return clean, simple JSON.

RESUME:
${resumeContent.substring(0, 2500)}

JOB:
${jobDescription.substring(0, 1000)}

Return JSON with SHORT, NATURAL language points (no markdown, no asterisks, no numbering):

- score: number 0-100
- keywords: 5-8 matching technical skills (single words or short phrases)
- suggestions: 3-5 simple tips (like "Add numbers to show project impact" not "**Quantify:** Add measurable...")
- strengths: 3-5 good things about the resume (like "Strong React experience" not long explanations)
- gaps: 3-5 missing things (like "No cloud experience mentioned" not detailed paragraphs)

RULES:
1. Each item must be under 60 characters
2. Use simple everyday language
3. No bold, no asterisks, no colons in the middle of sentences
4. Write like you're giving quick verbal feedback

Example output:
{"score":75,"keywords":["React","Node.js","Python","MongoDB","Git"],"suggestions":["Add numbers to show project impact","Include a short summary at top","Mention any team leadership","List relevant certifications"],"strengths":["Good match with required tech stack","Solid project experience","Strong educational background"],"gaps":["No cloud platform experience","Missing testing knowledge","No agile experience mentioned"]}`

  try {
    const text = await callGemini(prompt, 2000)
    const result = extractJSON(text)
    
    // Clean any markdown/formatting from responses
    const cleanText = (str) => {
      if (typeof str !== 'string') return str
      return str
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/^\d+\.\s*/, '')
        .replace(/^[-•]\s*/, '')
        .trim()
    }
    
    const cleanArray = (arr) => {
      if (!Array.isArray(arr)) return []
      return arr
        .map(item => cleanText(item))
        .filter(item => item.length > 0 && item.length < 150)
    }
    
    if (!result) {
      return {
        score: 50,
        keywords: ['Analysis incomplete'],
        suggestions: ['Please try again'],
        strengths: ['Resume uploaded successfully'],
        gaps: ['Unable to complete analysis'],
      }
    }

    return {
      score: typeof result.score === 'number' ? Math.min(100, Math.max(0, result.score)) : 50,
      keywords: cleanArray(result.keywords).slice(0, 10),
      suggestions: cleanArray(result.suggestions).slice(0, 6),
      strengths: cleanArray(result.strengths).slice(0, 6),
      gaps: cleanArray(result.gaps).slice(0, 6),
    }
  } catch (error) {
    console.error('❌ Tailor error:', error)
    throw error
  }
}
