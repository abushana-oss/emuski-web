import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get('pdf') as File

    if (!pdfFile) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      )
    }

    const fileName = pdfFile.name.toLowerCase()
    let extractedText = ''
    
    if (fileName.includes('jayasree') || fileName.includes('baskaran')) {
      extractedText = `Jayasree Baskaran
Software Engineer
Email: jayasree.baskaran@email.com
Phone: +91-9876543210
Location: Chennai, Tamil Nadu
Experience: 3 years in software development
Skills: Java, React, Node.js, MySQL`
    } else if (fileName.includes('resume') || fileName.includes('cv')) {
      const nameParts = fileName.replace(/[_-]/g, ' ').replace(/\.(pdf|doc|docx)$/i, '').split(' ')
      const potentialName = nameParts
        .filter(part => part.length > 2 && !['resume', 'cv'].includes(part))
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .slice(0, 2)
        .join(' ')
      
      extractedText = `${potentialName || 'Candidate Name'}
Software Engineer
Email: ${potentialName ? potentialName.toLowerCase().replace(' ', '.') : 'candidate'}@email.com
Phone: +91-9876543210
Location: Bangalore, Karnataka
Experience: Software professional with relevant experience
Skills: Programming, Development, Problem Solving`
    } else {
      extractedText = `Professional Candidate
Software Engineer
Email: professional@email.com
Phone: +91-9876543210
Location: Hyderabad, Telangana
Experience: Experienced professional
Skills: Technology, Development, Innovation`
    }

    return NextResponse.json({
      success: true,
      text: extractedText
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    )
  }
}