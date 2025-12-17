export async function extractJobFromEmail(emailContent) {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Extract job placement information from this email and return ONLY a valid JSON object with these exact fields:
{
  "company": "company name",
  "role": "job role/position",
  "package": "salary/stipend if mentioned, otherwise null",
  "deadline": "application deadline in YYYY-MM-DD format if mentioned, otherwise null",
  "assessmentDate": "assessment/test date in YYYY-MM-DD format if mentioned, otherwise null",
  "interviewDate": "interview date in YYYY-MM-DD format if mentioned, otherwise null",
  "description": "brief job description",
  "requirements": "key requirements or skills needed",
  "location": "job location if mentioned, otherwise null"
}

Email content:
${emailContent}

Return ONLY the JSON object, no additional text.`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      throw new Error('Gemini API request failed')
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }
    
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error extracting job from email:', error)
    throw error
  }
}

export async function tailorResume(resumeContent, jobDescription) {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this resume against the job description and provide tailoring suggestions. Return ONLY a valid JSON object:
{
  "score": 75,
  "keywords": ["keyword1", "keyword2"],
  "suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2"
  ],
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"]
}

Resume:
${resumeContent}

Job Description:
${jobDescription}

Return ONLY the JSON object, no additional text.`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      throw new Error('Gemini API request failed')
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }
    
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error tailoring resume:', error)
    throw error
  }
}
