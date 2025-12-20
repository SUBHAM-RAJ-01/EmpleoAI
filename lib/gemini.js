const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent'

// Rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000

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
    // Try manual extraction for tailor response
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
    const text = await callGemini(prompt, 800)
    console.log('✅ Gemini response:', text.substring(0, 200))

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
  const prompt = `Analyze resume vs job. Return JSON only.

RESUME:
${resumeContent.substring(0, 2000)}

JOB:
${jobDescription.substring(0, 800)}

Return ONLY this JSON (keep items short):
{"score":75,"keywords":["skill1","skill2","skill3"],"suggestions":["tip1","tip2","tip3"],"strengths":["str1","str2"],"gaps":["gap1","gap2"]}

Score 0-100. Max 5 items per array.`

  try {
    const text = await callGemini(prompt, 1500)
    console.log('✅ Gemini response:', text.substring(0, 200))

    const result = extractJSON(text)
    if (!result) {
      return {
        score: 50,
        keywords: ['Analysis failed'],
        suggestions: ['Please try again'],
        strengths: ['Resume uploaded'],
        gaps: ['Try again'],
      }
    }

    return {
      score: typeof result.score === 'number' ? Math.min(100, Math.max(0, result.score)) : 50,
      keywords: Array.isArray(result.keywords) ? result.keywords.slice(0, 10) : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions.slice(0, 5) : [],
      strengths: Array.isArray(result.strengths) ? result.strengths.slice(0, 5) : [],
      gaps: Array.isArray(result.gaps) ? result.gaps.slice(0, 5) : [],
    }
  } catch (error) {
    console.error('❌ Tailor error:', error)
    throw error
  }
}
