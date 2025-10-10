export interface EmailTemplate {
  to: string
  subject: string
  html: string
}

export class EmailService {
  static async sendWelcomeEmail(studentEmail: string, studentName: string) {
    const template: EmailTemplate = {
      to: studentEmail,
      subject: "Welcome to FolaIgnite! 🚀",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to FolaIgnite!</h1>
              </div>
              <div class="content">
                <h2>Hi ${studentName},</h2>
                <p>We're thrilled to have you join our community of passionate learners! 🎉</p>
                <p>You're about to embark on an exciting 30-day learning journey that will transform your skills and open new opportunities.</p>
                <p><strong>Here's what to expect:</strong></p>
                <ul>
                  <li>Daily 30-minute learning sessions</li>
                  <li>Hands-on projects and exercises</li>
                  <li>Mentorship from industry experts</li>
                  <li>A supportive community of fellow learners</li>
                  <li>Certificate upon completion</li>
                </ul>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/student/dashboard" class="button">Go to Dashboard</a>
                <p>Remember: Consistency is key! Just 30 minutes a day for 30 days can make a huge difference.</p>
                <p>Let's build something amazing together!</p>
                <p>Best regards,<br>The FolaIgnite Team</p>
              </div>
              <div class="footer">
                <p>© 2025 FolaIgnite. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    return this.sendEmail(template)
  }

  static async sendDailyReminder(studentEmail: string, studentName: string, currentDay: number) {
    const template: EmailTemplate = {
      to: studentEmail,
      subject: `Day ${currentDay} - Time to Learn! 📚`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Hi ${studentName}! 👋</h2>
              <p>It's time for your Day ${currentDay} learning session!</p>
              <p>Remember, just 30 minutes today will keep your streak alive and bring you closer to your goals.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/student/dashboard" style="display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Start Learning</a>
              <p>You've got this! 💪</p>
            </div>
          </body>
        </html>
      `,
    }

    return this.sendEmail(template)
  }

  static async sendCertificateEmail(studentEmail: string, studentName: string, certificateUrl: string) {
    const template: EmailTemplate = {
      to: studentEmail,
      subject: "🎉 Congratulations! Your FolaIgnite Certificate is Ready",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
              <h1 style="color: #1e3a8a;">🎉 Congratulations, ${studentName}!</h1>
              <p style="font-size: 18px;">You've successfully completed the 30-day FolaIgnite challenge!</p>
              <p>Your dedication and hard work have paid off. We're incredibly proud of your achievement!</p>
              <a href="${certificateUrl}" style="display: inline-block; background: #f97316; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; margin: 30px 0; font-size: 16px;">Download Certificate</a>
              <p>Share your achievement on social media and inspire others!</p>
              <p style="margin-top: 40px; color: #6b7280;">Keep learning and building amazing things!</p>
            </div>
          </body>
        </html>
      `,
    }

    return this.sendEmail(template)
  }

  static async sendMentorRequestNotification(mentorEmail: string, mentorName: string, studentName: string) {
    const template: EmailTemplate = {
      to: mentorEmail,
      subject: "New Mentorship Request",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Hi ${mentorName},</h2>
              <p>${studentName} has requested a mentorship session with you!</p>
              <p>Log in to your mentor dashboard to view the details and respond.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/mentor/dashboard" style="display: inline-block; background: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0;">View Request</a>
            </div>
          </body>
        </html>
      `,
    }

    return this.sendEmail(template)
  }

  private static async sendEmail(template: EmailTemplate) {
    // In production, integrate with email service (SendGrid, Resend, etc.)
    console.log("[v0] Email would be sent:", {
      to: template.to,
      subject: template.subject,
    })

    // Simulate email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, messageId: `msg-${Date.now()}` })
      }, 100)
    })
  }
}
