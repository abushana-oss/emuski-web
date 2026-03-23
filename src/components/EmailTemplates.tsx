// Email Templates for Daily Newsletter
export const generateDailyNewsletterHTML = (date: string, featuredArticle: any, insights: string[], marketUpdate: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMUSKI Daily Manufacturing Insights - ${date}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background-color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #4fd3d4 0%, #3ba9aa 100%);
            padding: 30px 40px;
            text-align: center;
        }
        .logo {
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            text-decoration: none;
        }
        .tagline {
            color: #e6f9f9;
            font-size: 16px;
            margin: 0;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 18px;
            color: #1a202c;
            margin-bottom: 25px;
        }
        .featured-section {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-left: 4px solid #4fd3d4;
            padding: 25px;
            margin-bottom: 30px;
            border-radius: 0 8px 8px 0;
        }
        .featured-title {
            font-size: 20px;
            font-weight: bold;
            color: #1a202c;
            margin-bottom: 15px;
            line-height: 1.3;
        }
        .featured-excerpt {
            color: #4a5568;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .read-more-btn {
            display: inline-block;
            background-color: #4fd3d4;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: background-color 0.3s ease;
        }
        .read-more-btn:hover {
            background-color: #3ba9aa;
        }
        .insights-section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1a202c;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
        }
        .insight-item {
            margin-bottom: 12px;
            padding-left: 20px;
            position: relative;
        }
        .insight-item::before {
            content: "→";
            color: #4fd3d4;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        .market-update {
            background-color: #fff5f5;
            border: 1px solid #feb2b2;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .market-update-title {
            color: #c53030;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 20px;
            margin: 25px 0;
        }
        .stat-card {
            text-align: center;
            padding: 15px;
            background-color: #f7fafc;
            border-radius: 8px;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #4fd3d4;
            display: block;
        }
        .stat-label {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .social-links {
            text-align: center;
            margin: 30px 0;
        }
        .social-link {
            display: inline-block;
            margin: 0 10px;
            padding: 10px;
            background-color: #4fd3d4;
            color: #ffffff;
            text-decoration: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            line-height: 20px;
        }
        .footer {
            background-color: #2d3748;
            color: #a0aec0;
            padding: 30px 40px;
            text-align: center;
        }
        .footer-links {
            margin-bottom: 20px;
        }
        .footer-link {
            color: #4fd3d4;
            text-decoration: none;
            margin: 0 15px;
        }
        .unsubscribe {
            font-size: 12px;
            margin-top: 20px;
        }
        .unsubscribe a {
            color: #a0aec0;
            text-decoration: underline;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
            .header {
                padding: 20px !important;
            }
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <a href="https://EMUSKI.com" class="logo">EMUSKI</a>
            <p class="tagline">Manufacturing Excellence Through Innovation</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">
                Good morning! Here's your daily dose of manufacturing insights for ${date}.
            </div>

            <!-- Featured Article -->
            <div class="featured-section">
                <h2 class="featured-title">${featuredArticle.title}</h2>
                <p class="featured-excerpt">${featuredArticle.excerpt}</p>
                <a href="https://EMUSKI.com/blog/${featuredArticle.slug}" class="read-more-btn">Read Full Article →</a>
            </div>

            <!-- Key Insights -->
            <div class="insights-section">
                <h3 class="section-title">🚀 Today's Key Insights</h3>
                ${insights.map(insight => `<div class="insight-item">${insight}</div>`).join('')}
            </div>

            <!-- Market Update -->
            <div class="market-update">
                <div class="market-update-title">📊 Market Update</div>
                <p>${marketUpdate}</p>
            </div>

            <!-- Stats -->
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">2.3M+</span>
                    <span class="stat-label">Manufacturers Served</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">$5.2B</span>
                    <span class="stat-label">Cost Savings Generated</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">15%</span>
                    <span class="stat-label">Avg. Efficiency Gain</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">99.8%</span>
                    <span class="stat-label">Client Satisfaction</span>
                </div>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #4fd3d4 0%, #3ba9aa 100%); border-radius: 8px;">
                <h3 style="color: white; margin-bottom: 10px;">Ready to Transform Your Manufacturing?</h3>
                <p style="color: #e6f9f9; margin-bottom: 20px;">Get personalized insights for your organization</p>
                <a href="https://EMUSKI.com/contact" style="background-color: white; color: #4fd3d4; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Schedule Consultation</a>
            </div>

            <!-- Social Links -->
            <div class="social-links">
                <a href="https://linkedin.com/company/EMUSKI" class="social-link">Li</a>
                <a href="https://twitter.com/EMUSKI" class="social-link">Tw</a>
                <a href="https://youtube.com/EMUSKI" class="social-link">Yt</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="https://EMUSKI.com/blog" class="footer-link">Blog</a>
                <a href="https://EMUSKI.com/services" class="footer-link">Services</a>
                <a href="https://EMUSKI.com/contact" class="footer-link">Contact</a>
            </div>
            
            <p style="margin: 10px 0;">
                EMUSKI Manufacturing Solutions<br>
                Transforming Manufacturing Through Innovation
            </p>
            
            <div class="unsubscribe">
                You received this email because you subscribed to EMUSKI insights.<br>
                <a href="https://EMUSKI.com/unsubscribe?email={{email}}">Unsubscribe</a> | 
                <a href="https://EMUSKI.com/preferences?email={{email}}">Update Preferences</a> | 
                <a href="https://EMUSKI.com/privacy">Privacy Policy</a>
            </div>
        </div>
    </div>
</body>
</html>`;
};

export const generateWelcomeEmailHTML = (subscriberEmail: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to EMUSKI Manufacturing Insights</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background-color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #4fd3d4 0%, #3ba9aa 100%);
            padding: 40px;
            text-align: center;
        }
        .logo {
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .welcome-title {
            color: #ffffff;
            font-size: 24px;
            margin: 0;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 20px;
            color: #1a202c;
            margin-bottom: 25px;
            text-align: center;
        }
        .welcome-message {
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .benefits-list {
            background-color: #f7fafc;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .benefit-item {
            margin-bottom: 15px;
            padding-left: 25px;
            position: relative;
        }
        .benefit-item::before {
            content: "✓";
            color: #4fd3d4;
            font-weight: bold;
            position: absolute;
            left: 0;
            background-color: #e6fffa;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        .cta-section {
            text-align: center;
            margin: 35px 0;
            padding: 30px;
            background: linear-gradient(135deg, #4fd3d4 0%, #3ba9aa 100%);
            border-radius: 8px;
        }
        .cta-title {
            color: white;
            font-size: 20px;
            margin-bottom: 15px;
        }
        .cta-button {
            display: inline-block;
            background-color: white;
            color: #4fd3d4;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px;
        }
        .footer {
            background-color: #2d3748;
            color: #a0aec0;
            padding: 30px 40px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">EMUSKI</div>
            <h1 class="welcome-title">Welcome to Our Community!</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                🎉 Thank you for subscribing!
            </div>

            <div class="welcome-message">
                <p>Welcome to the EMUSKI community of manufacturing excellence! You've just joined thousands of industry professionals who rely on our insights to stay ahead of the curve.</p>
                
                <p>Every morning, you'll receive our carefully curated newsletter featuring:</p>
            </div>

            <div class="benefits-list">
                <div class="benefit-item">
                    <strong>Expert Analysis:</strong> Deep dives into manufacturing trends and technologies
                </div>
                <div class="benefit-item">
                    <strong>Cost Optimization Tips:</strong> Proven strategies to reduce operational costs
                </div>
                <div class="benefit-item">
                    <strong>Industry Case Studies:</strong> Real-world success stories and lessons learned
                </div>
                <div class="benefit-item">
                    <strong>AI & Innovation Updates:</strong> Latest developments in manufacturing technology
                </div>
                <div class="benefit-item">
                    <strong>Market Intelligence:</strong> Key insights that impact your business decisions
                </div>
                <div class="benefit-item">
                    <strong>Exclusive Resources:</strong> Access to whitepapers, guides, and tools
                </div>
            </div>

            <div class="cta-section">
                <h3 class="cta-title">Get Started Today</h3>
                <p style="color: #e6f9f9; margin-bottom: 25px;">
                    Explore our latest insights and discover how EMUSKI can transform your manufacturing operations.
                </p>
                <a href="https://www.emuski.com/blog" class="cta-button">Read Latest Insights</a>
                <a href="https://www.emuski.com/manufacturing-services" class="cta-button">Learn More</a>
                <a href="https://www.emuski.com/cost-engineering" class="cta-button">Explore Precision Engineering</a>
            </div>

            <div style="text-align: center; margin: 30px 0; color: #718096;">
                <p>Questions? Need help? Simply reply to this email and our team will assist you.</p>
                <p><strong>Follow us on social media for even more insights:</strong></p>
                <div style="margin-top: 15px;">
                    <a href="https://linkedin.com/company/EMUSKI" style="color: #4fd3d4; margin: 0 10px;">LinkedIn</a>
                    <a href="https://twitter.com/EMUSKI" style="color: #4fd3d4; margin: 0 10px;">Twitter</a>
                    <a href="https://youtube.com/EMUSKI" style="color: #4fd3d4; margin: 0 10px;">YouTube</a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                EMUSKI Manufacturing Solutions<br>
                Your Partner in Manufacturing Excellence
            </p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="https://www.emuski.com/unsubscribe?email=${subscriberEmail}" style="color: #a0aec0;">Unsubscribe</a> | 
                <!-- Use the correct privacy policy URL that exists on the site -->
                <a href="https://www.emuski.com/privacy-policy" style="color: #a0aec0;">Privacy Policy</a>
            </div>
        </div>
    </div>
</body>
</html>`;
};

export const generateEmailContent = (templateType: 'daily' | 'welcome', data: any) => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  if (templateType === 'welcome') {
    return {
      subject: 'Welcome to EMUSKI Manufacturing Insights!',
      html: generateWelcomeEmailHTML(data.email),
      text: `Welcome to EMUSKI Manufacturing Insights! Thank you for subscribing to our daily newsletter featuring expert analysis, cost optimization tips, and the latest in manufacturing innovation.`
    };
  }

  // Daily newsletter content
  const dailyInsights = [
    "AI-powered quality control systems are reducing defect rates by up to 90% in automotive manufacturing",
    "New VAVE methodology implementations show average cost reductions of 25-30% across industrial equipment sector",
    "Supply chain digitization initiatives are improving delivery performance by 45% while reducing inventory costs",
    "Predictive maintenance technologies are extending equipment lifespan by 20-35% in heavy manufacturing",
    "Lean manufacturing integration with IoT sensors is driving 15-25% productivity improvements"
  ];

  const marketUpdates = [
    "Manufacturing PMI shows continued growth with sustainability investments driving 12% increase in green technology adoption across the sector.",
    "Global supply chain resilience initiatives are creating new opportunities for domestic manufacturing partnerships and cost optimization strategies.",
    "Industry 4.0 implementation rates accelerate with 67% of manufacturers planning smart factory investments in the next 18 months.",
    "Energy efficiency regulations are spurring innovation in manufacturing processes, with companies achieving 20-30% energy cost reductions through AI optimization."
  ];

  const featuredArticle = data.featuredArticle || {
    title: "Mithran AI Platform: Transforming Manufacturing Intelligence",
    excerpt: "Discover how AI-powered manufacturing platforms are delivering 30% faster sourcing cycles and 15% cost savings through intelligent automation and predictive analytics.",
    slug: "mithran-ai-platform-future-intelligent-manufacturing"
  };

  return {
    subject: `EMUSKI Daily Insights: ${today} - Manufacturing Excellence Updates`,
    html: generateDailyNewsletterHTML(
      today,
      featuredArticle,
      dailyInsights,
      marketUpdates[Math.floor(Math.random() * marketUpdates.length)]
    ),
    text: `EMUSKI Daily Manufacturing Insights for ${today}\n\nFeatured: ${featuredArticle.title}\n${featuredArticle.excerpt}\n\nRead more at https://www.emuski.com/blog/${featuredArticle.slug}`
  };
};