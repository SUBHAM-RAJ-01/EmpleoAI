import { NextResponse } from 'next/server'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

export const runtime = 'nodejs'

export async function POST(request) {
  let tempFilePath = null
  
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    tempFilePath = join(tmpdir(), `pdf-${Date.now()}.pdf`)
    await writeFile(tempFilePath, buffer)

    // Parse PDF using pdf2json
    const PDFParser = require('pdf2json')
    const pdfParser = new PDFParser()

    const pdfData = await new Promise((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError))
      pdfParser.on('pdfParser_dataReady', pdfData => resolve(pdfData))
      pdfParser.loadPDF(tempFilePath)
    })

    // Extract text from parsed data
    let fullText = ''
    
    if (pdfData.Pages) {
      for (const page of pdfData.Pages) {
        if (page.Texts) {
          for (const text of page.Texts) {
            if (text.R) {
              for (const r of text.R) {
                if (r.T) {
                  fullText += decodeURIComponent(r.T) + ' '
                }
              }
            }
          }
          fullText += '\n'
        }
      }
    }

    // Clean up temp file
    if (tempFilePath) {
      await unlink(tempFilePath).catch(() => {})
    }

    if (!fullText || fullText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. The PDF might be image-based or protected.' },
        { status: 400 }
      )
    }

    console.log('✅ PDF parsed successfully:', fullText.length, 'characters')

    return NextResponse.json({
      text: fullText.trim(),
      pages: pdfData.Pages?.length || 0
    })
  } catch (error) {
    // Clean up temp file on error
    if (tempFilePath) {
      await unlink(tempFilePath).catch(() => {})
    }
    
    console.error('❌ PDF parsing error:', error)
    return NextResponse.json(
      { error: 'Failed to parse PDF: ' + error.message },
      { status: 500 }
    )
  }
}
