const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent'

// Simple rate limiting - track last request time
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 second between requests

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

// Extract JSON from text - handles all common formats including truncated responses
function extractJSON(text) {
  if (!text) return null

  console.log('📝 Raw AI text:', text)

  // Remove markdown code blocks
  let cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim()

  // Find the JSON object start
  const start = cleaned.indexOf('{')
  if (start === -1) {
    console.error('❌ No JSON start found')
    return null
  }

  // Find the JSON object end - if not found, the response was truncated
  let end = cleaned.lastIndexOf('}')
  
  let jsonStr
  if (end === -1 || end <= start) {
    // Response was truncated - try to fix it
    console.log('⚠️ Truncated response detected, attempting to fix...')
    jsonStr = cleaned.substring(start)
    
    // Close any open strings, arrays, and objects
    jsonStr = fixTruncatedJSON(jsonStr)
  } else {
    jsonStr = cleaned.substring(start, end + 1)
  }
  
  console.log('📝 Extracted JSON string:', jsonStr.substring(0, 500))

  // Try to parse directly first
  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    console.log('⚠️ Direct parse failed, attempting fixes...')
  }

  // Fix common issues
  try {
    // Fix trailing commas
    jsonStr = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')

    // Fix unquoted keys (rare but possible)
    jsonStr = jsonStr.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')

    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('❌ JSON fix attempt failed:', e.message)
  }

  // Last resort: try to build a valid object from partial data
  try {
    // Extract key-value pairs manually
    const scoreMatch = jsonStr.match(/"score"\s*:\s*(\d+)/)
    const keywordsMatch = jsonStr.match(/"keywords"\s*:\s*\[(.*?)\]/s)
    const suggestionsMatch = jsonStr.match(/"suggestions"\s*:\s*\[(.*?)\]/s)
    const strengthsMatch = jsonStr.match(/"strengths"\s*:\s*\[(.*?)\]/s)
    const gapsMatch = jsonStr.match(/"gaps"\s*:\s*\[(.*?)\]/s)

    if (scoreMatch) {
      const parseArray = (match) => {
        if (!match) return []
        try {
          const arr = JSON.parse('[' + match[1] + ']')
          return Array.isArray(arr) ? arr : []
        } catch {
          // Extract quoted strings manually
          const strings = match[1].match(/"([^"]+)"/g)
          return strings ? strings.map((s) => s.replace(/"/g, '')) : []
        }
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
    console.error('❌ Manual extraction failed:', e.message)
  }

  return null
}

// Fix truncated JSON by closing open structures
function fixTruncatedJSON(jsonStr) {
  let fixed = jsonStr.trim()

  // Find the last complete key-value pair
  // Look for patterns like "key": value, or "key": [...]
  const lastCompleteArray = fixed.lastIndexOf(']')
  const lastCompleteString = fixed.lastIndexOf('",')
  const lastCompleteNumber = fixed.search(/\d,\s*"[^"]+"\s*:\s*$/)

  // Find where we should truncate to get valid JSON
  let truncateAt = Math.max(lastCompleteArray, lastCompleteString)

  if (truncateAt > 0) {
    fixed = fixed.substring(0, truncateAt + 1)
  } else {
    // No complete value found, try to salvage what we can
    // Remove any incomplete string at the end
    const lastQuote = fixed.lastIndexOf('"')
    if (lastQuote > 0) {
      const afterQuote = fixed.substring(lastQuote + 1)
      // If we're in the middle of a value, truncate
      if (!afterQuote.match(/^\s*[,\]\}:]/)) {
        // Find the last complete item
        const lastComma = fixed.lastIndexOf(',')
        if (lastComma > 0) {
          fixed = fixed.substring(0, lastComma)
        }
      }
    }
  }

  // Remove any trailing incomplete parts
  fixed = fixed.replace(/,\s*"[^"]*$/, '') // Remove incomplete key
  fixed = fixed.replace(/,\s*$/, '') // Remove trailing comma
  fixed = fixed.replace(/:\s*\[$/, ': []') // Close empty array
  fixed = fixed.replace(/:\s*"[^"]*$/, ': ""') // Close incomplete string

  // Count and close brackets
  const openBrackets = (fixed.match(/\[/g) || []).length
  const closeBrackets = (fixed.match(/\]/g) || []).length
  if (openBrackets > closeBrackets) {
    fixed += ']'.repeat(openBrackets - closeBrackets)
  }

  // Count and close braces
  const openBraces = (fixed.match(/\{/g) || []).length
  const closeBraces = (fixed.match(/\}/g) || []).length
  if (openBraces > closeBraces) {
    fixed += '}'.repeat(openBraces - closeBraces)
  }

  return fixed
}

async function callGemini(prompt, maxTokens = 2048) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  // Wait for rate limit
  await waitForRateLimit()

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
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
    console.error('Invalid API response structure:', JSON.stringify(data))
    throw new Error('Invalid response from AI')
  }

  return data.candidates[0].content.parts[0].text
}

export async function extractJobFromEmail(emailContent) {
  const prompt = `You are a JSON generator. Extract job info from this email.

EMAIL:
${emailContent.substring(0, 3000)}

OUTPUT FORMAT - Return ONLY this JSON, nothing else:
{"company":"CompanyName","role":"JobTitle","package":null,"deadline":null,"assessmentDate":null,"interviewDate":null,"description":"Brief description","requirements":"Key requirements","location":null}

Rules:
- Use null for missing fields
- Dates must be YYYY-MM-DD or null
- No markdown, no explanation, ONLY the JSON object`

  try {
    const text = await callGemini(prompt, 800)
    const result = extractJSON(text)

    if (!result) {
      // Return default structure if parsing fails
      console.warn('⚠️ Using default job structure')
      return {
        company: 'Unknown Company',
        role: 'Unknown Role',
        package: null,
        deadline: null,
        assessmentDate: null,
        interviewDate: null,
        description: 'Could not extract description',
        requirements: 'Could not extract requirements',
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
  const prompt = `Analyze resume vs job match. Return JSON only, keep responses concise.

RESUME:
${resumeContent.substring(0, 2000)}

JOB:
${jobDescription.substring(0, 800)}

Return this exact JSON format with short, concise items:
{"score":75,"keywords":["skill1","skill2","skill3","skill4","skill5"],"suggestions":["Short suggestion 1","Short suggestion 2","Short suggestion 3"],"strengths":["Strength 1","Strength 2","Strength 3"],"gaps":["Gap 1","Gap 2","Gap 3"]}

IMPORTANT: Keep each array item under 50 characters. Return ONLY the JSON, no markdown.`

  try {
    const text = await callGemini(prompt, 1500)
    const result = extractJSON(text)

    if (!result) {
      console.warn('⚠️ Using default analysis structure')
      return {
        score: 50,
        keywords: ['Unable to analyze'],
        suggestions: ['Please try again with a different resume format'],
        strengths: ['Resume uploaded successfully'],
        gaps: ['Analysis incomplete - try again'],
      }
    }

    return {
      score:
        typeof result.score === 'number'
          ? Math.min(100, Math.max(0, result.score))
          : 50,
      keywords: Array.isArray(result.keywords)
        ? result.keywords.slice(0, 10)
        : [],
      suggestions: Array.isArray(result.suggestions)
        ? result.suggestions.slice(0, 6)
        : [],
      strengths: Array.isArray(result.strengths)
        ? result.strengths.slice(0, 6)
        : [],
      gaps: Array.isArray(result.gaps) ? result.gaps.slice(0, 6) : [],
    }
  } catch (error) {
    console.error('❌ Tailor error:', error)
    throw error
  }
}
