// Helper to extract JSON from AI response
function extractJSON(text) {
  if (!text) return null
  
  // Try to find JSON in code block first
  let match = text.match(/```json\s*([\s\S]*?)\s*```/)
  if (match) return match[1].trim()
  
  // Try generic code block
  match = text.match(/```\s*([\s\S]*?)\s*```/)
  if (match) return match[1].trim()
  
  // Try to find raw JSON object
  match = text.match(/\{[\s\S]*\}/)
  if (match) return match[0].trim()
  
  // If text itself looks like JSON
  if (text.trim().startsWith('{')) return text.trim()
  
  return null
}

// Helper to fix incomplete JSON
function fixIncompleteJSON(jsonText) {
  if (!jsonText) return null
  
  let fixed = jsonText.trim()
  
  // Count braces
  const openBraces = (fixed.match(/\{/g) || []).length
  const closeBraces = (fixed.match(/\}/g) || []).length
  
  // Add missing closing braces
  if (openBraces > closeBraces) {
    fixed += '}'.repeat(openBraces - closeBraces)
  }
  
  // Count brackets
  const openBrackets = (fixed.match(/\[/g) || []).length
  const closeBrackets = (fixed.match(/\]/g) || []).length
  
  // Add missing closing brackets before the last brace
  if (openBrackets > closeBrackets) {
    const lastBrace = fixed.lastIndexOf('}')
    const brackets = ']'.repeat(openBrackets - closeBrackets)
    fixed = fixed.slice(0, lastBrace) + brackets + fixed.slice(lastBrace)
  }
  
  return fixed
}

export async function extractJobFromEmail(emailContent) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    const prompt = `Extract job information from this email. Return a JSON object with these fields:
- company: company name (string)
- role: job title/role (string)
- package: salary if mentioned, otherwise null
- deadline: application deadline in YYYY-MM-DD format, otherwise null
- assessmentDate: assessment date in YYYY-MM-DD format, otherwise null
- interviewDate: interview date in YYYY-MM-DD format, otherwise null
- description: brief job description (string)
- requirements: job requirements (string)
- location: job location if mentioned, otherwise null

Email content:
${emailContent.substring(0, 4000)}

Return ONLY the JSON object, no other text.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json'
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Gemini API error:', error)
      throw new Error(error.error?.message || 'AI extraction failed')
    }

    const data = await response.json()
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid API response:', data)
      throw new Error('Invalid response from AI')
    }
    
    const text = data.candidates[0].content.parts[0].text
    console.log('✅ Gemini response:', text)
    
    let jsonText = extractJSON(text) || text
    jsonText = fixIncompleteJSON(jsonText)
    
    if (!jsonText) {
      throw new Error('Could not extract job information. Please try again.')
    }
    
    return JSON.parse(jsonText)
  } catch (error) {
    console.error('❌ Extract error:', error)
    throw error
  }
}

export async function tailorResume(resumeContent, jobDescription) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    const prompt = `Analyze this resume against the job description and provide:
1. A match score from 0-100
2. Relevant keywords found
3. Suggestions for improvement
4. Strengths that match the job
5. Gaps or missing qualifications

RESUME:
${resumeContent.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

Return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "keywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"]
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json'
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Gemini API error:', error)
      throw new Error(error.error?.message || 'AI analysis failed')
    }

    const data = await response.json()
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid API response:', data)
      throw new Error('No response from AI. Please try again.')
    }
    
    const text = data.candidates[0].content.parts[0].text
    console.log('✅ Gemini response:', text)
    
    let jsonText = extractJSON(text) || text
    jsonText = fixIncompleteJSON(jsonText)
    
    if (!jsonText) {
      throw new Error('Could not parse AI response. Please try again.')
    }
    
    const result = JSON.parse(jsonText)
    
    // Validate and provide defaults
    return {
      score: typeof result.score === 'number' ? result.score : 0,
      keywords: Array.isArray(result.keywords) ? result.keywords : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      gaps: Array.isArray(result.gaps) ? result.gaps : []
    }
  } catch (error) {
    console.error('❌ Tailor error:', error)
    throw error
  }
}
