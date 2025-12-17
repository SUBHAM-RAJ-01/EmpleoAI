export async function extractJobFromEmail(emailContent) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    const prompt = `Extract job information from this email and return ONLY a valid JSON object:
{
  "company": "company name",
  "role": "job role",
  "package": "salary or null",
  "deadline": "YYYY-MM-DD or null",
  "assessmentDate": "YYYY-MM-DD or null",
  "interviewDate": "YYYY-MM-DD or null",
  "description": "brief description",
  "requirements": "requirements",
  "location": "location or null"
}

Email: ${emailContent}

Return ONLY the JSON object.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
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
    const text = data.candidates[0].content.parts[0].text
    
    console.log('✅ Gemini response:', text)
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in AI response')
    
    return JSON.parse(jsonMatch[0])
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

    const prompt = `Analyze this resume against the job description. Return ONLY valid JSON.

RESUME:
${resumeContent.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

Return this EXACT JSON structure (complete all arrays):
{
  "score": 85,
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": ["suggestion1", "suggestion2"],
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"]
}

IMPORTANT: Return ONLY the complete JSON object. No markdown, no explanation, just JSON.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
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
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data)
      throw new Error('No response from AI. Please try again.')
    }
    
    const text = data.candidates[0].content.parts[0].text
    console.log('✅ Gemini response:', text)
    
    // Try to extract JSON from the response
    let jsonText = null
    
    // Try to find JSON in code block first
    let jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1]
    } else {
      // Try to find raw JSON
      jsonMatch = text.match(/```\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        jsonText = jsonMatch[1]
      } else {
        // Try to find JSON without code blocks
        jsonMatch = text.match(/\{[\s\S]*\}/)
        jsonText = jsonMatch ? jsonMatch[0] : null
      }
    }
    
    if (!jsonText) {
      console.error('No JSON found in response:', text)
      throw new Error('Could not parse AI response. Please try again.')
    }
    
    // Clean up incomplete JSON
    jsonText = jsonText.trim()
    
    // If JSON is incomplete, try to fix it
    if (!jsonText.endsWith('}')) {
      // Find the last complete field
      const lastComma = jsonText.lastIndexOf(',')
      const lastBracket = jsonText.lastIndexOf('[')
      const lastQuote = jsonText.lastIndexOf('"')
      
      if (lastComma > lastBracket && lastComma > lastQuote) {
        jsonText = jsonText.substring(0, lastComma) + '\n}'
      } else if (lastBracket > lastQuote) {
        jsonText = jsonText.substring(0, lastBracket) + '[]}'
      } else {
        jsonText = jsonText + '}'
      }
    }
    
    console.log('📝 Cleaned JSON:', jsonText)
    
    const result = JSON.parse(jsonText)
    
    // Validate and provide defaults if needed
    const validatedResult = {
      score: result.score || 0,
      keywords: Array.isArray(result.keywords) ? result.keywords : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      gaps: Array.isArray(result.gaps) ? result.gaps : []
    }
    
    return validatedResult
  } catch (error) {
    console.error('❌ Tailor error:', error)
    if (error.message.includes('JSON')) {
      throw new Error('Failed to parse AI response. Please try again.')
    }
    throw error
  }
}
