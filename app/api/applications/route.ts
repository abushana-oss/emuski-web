import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    let body, resumeFile = null
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()
      body = {
        jobTitle: formData.get('jobTitle'),
        jobId: formData.get('jobId'),
        applicant: JSON.parse(formData.get('applicant') as string),
        responses: JSON.parse(formData.get('responses') as string),
        submittedAt: formData.get('submittedAt'),
        recaptchaToken: formData.get('recaptchaToken')
      }
      resumeFile = formData.get('resumeFile') as File
    } else {
      body = await request.json()
    }
    
    const {
      jobTitle,
      jobId,
      applicant,
      responses,
      submittedAt,
      recaptchaToken
    } = body
    
    const resumeUploaded = resumeFile ? resumeFile.name : null

    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #f8f9fa; padding: 20px; border-bottom: 2px solid #e9ecef; }
            .content { padding: 20px; }
            .section { margin-bottom: 20px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #495057; }
            .value { margin-left: 10px; }
            .footer { background-color: #f8f9fa; padding: 15px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>New Job Application - ${jobTitle}</h1>
            <p><strong>Job ID:</strong> ${jobId}</p>
            <p><strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString()}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>Applicant Information</h2>
              <div class="field">
                <span class="label">Name:</span>
                <span class="value">${applicant.name}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <span class="value">${applicant.email}</span>
              </div>
              <div class="field">
                <span class="label">Phone:</span>
                <span class="value">${applicant.phone}</span>
              </div>
              <div class="field">
                <span class="label">Location:</span>
                <span class="value">${applicant.location}</span>
              </div>
              ${resumeUploaded ? `
              <div class="field">
                <span class="label">Resume:</span>
                <span class="value">${resumeUploaded}</span>
              </div>
              ` : ''}
            </div>

            <div class="section">
              <h2>Application Responses</h2>
              <div class="field">
                <span class="label">Authorized to work in India:</span>
                <span class="value">${responses.workAuthorization === 'yes' ? 'Yes' : 'No'}</span>
              </div>
              <div class="field">
                <span class="label">Can attend office 4 days per week:</span>
                <span class="value">${responses.officeAttendance === 'yes' ? 'Yes' : 'No'}</span>
              </div>
              <div class="field">
                <span class="label">Interest in EMUSKI:</span>
                <div class="value" style="white-space: pre-wrap; background: #f8f9fa; padding: 10px; border-left: 3px solid #007bff; margin-top: 5px;">${responses.aboutEmuski}</div>
              </div>
              <div class="field">
                <span class="label">AI Experience:</span>
                <div class="value" style="white-space: pre-wrap; background: #f8f9fa; padding: 10px; border-left: 3px solid #007bff; margin-top: 5px;">${responses.aiExperience}</div>
              </div>
              <div class="field">
                <span class="label">Role Interest:</span>
                <div class="value" style="white-space: pre-wrap; background: #f8f9fa; padding: 10px; border-left: 3px solid #007bff; margin-top: 5px;">${responses.roleInterest}</div>
              </div>
              ${responses.exerciseUrl ? `
              <div class="field">
                <span class="label">Exercise URL:</span>
                <span class="value"><a href="${responses.exerciseUrl}" target="_blank">${responses.exerciseUrl}</a></span>
              </div>
              ` : ''}
              <div class="field">
                <span class="label">Agreed to contact for opportunities:</span>
                <span class="value">${responses.agreeToContact ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This application was submitted through the EMUSKI careers portal.</p>
            <p>Applicant's email: ${applicant.email}</p>
          </div>
        </body>
      </html>
    `

    const fromEmail = 'onboarding@resend.dev'
    const toEmail = 'enquiries@emuski.com'
    
    // Prepare email with optional attachment
    const emailOptions: any = {
      from: fromEmail,
      to: [toEmail],
      subject: `New Application: ${jobTitle} - ${applicant.name}`,
      html: emailHtml,
      replyTo: applicant.email,
    }
    
    if (resumeFile) {
      const fileBuffer = await resumeFile.arrayBuffer()
      emailOptions.attachments = [
        {
          filename: resumeFile.name,
          content: Buffer.from(fileBuffer),
        }
      ]
    }
    
    const emailResult = await resend.emails.send(emailOptions)
    
    if (emailResult.error) {
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      emailId: emailResult.data?.id
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    )
  }
}