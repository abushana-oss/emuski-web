# Google Analytics Tracking Guide

## ✅ What's Being Tracked

### 1. **Page Views** (Automatic)
- Every page visit is automatically tracked
- Includes page path, title, and location
- Enhanced measurement enabled for:
  - Scroll depth
  - Outbound clicks
  - Site search
  - Video engagement
  - File downloads

### 2. **Email Subscriptions**
- Event: `subscribe`
- Category: `engagement`
- Label: `email_newsletter`
- Tracks both successful and failed subscriptions

### 3. **Contact Form Submissions**
- Event: `generate_lead`
- Category: `contact`
- Label: `contact_form`
- Value: 100 (estimated lead value)
- Includes whether file was attached

### 4. **Errors & Exceptions**
- All form errors are tracked as exceptions
- Non-fatal errors for analytics purposes
- Helps identify user experience issues

### 5. **User Engagement**
- Scroll tracking
- Time on page
- Outbound link clicks
- File downloads

## 🔧 Google Analytics Configuration

### Enabled Features:
- ✅ **Google Signals**: Cross-device tracking and demographics
- ✅ **Enhanced Measurement**: Automatic event tracking
- ✅ **Ad Personalization**: For remarketing
- ✅ **Custom Dimensions & Metrics**: User properties and engagement metrics

### Privacy & Compliance:
- ✅ IP Anonymization enabled
- ✅ GDPR/CCPA compliant consent mode
- ✅ Cookie consent configured
- ✅ 2-year cookie expiration

## 📊 How to View Your Data

### Google Analytics 4 Dashboard:
1. Go to https://analytics.google.com
2. Select your property (GA4 - G-QFDFYZLZPK)
3. View reports:
   - **Reports > Engagement > Events**: See all tracked events
   - **Reports > Engagement > Pages**: See page views and engagement
   - **Reports > User > Demographics**: See user demographics (requires Google Signals)
   - **Reports > Acquisition**: See how users found your site

### Key Metrics to Watch:
- **Email Subscriptions**: Filter events by `subscribe`
- **Contact Forms**: Filter events by `generate_lead`
- **Page Engagement**: Scroll depth, time on page
- **Conversion Rate**: Contact forms / Total visitors

### Google Tag Manager (GTM):
1. Go to https://tagmanager.google.com
2. Select container: GTM-T5MDL48M
3. View dataLayer events in Preview mode

## 🧪 Testing Analytics

### Local Testing:
1. Run `npm run dev`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for Google Analytics requests starting with: `https://www.google-analytics.com/g/collect`

### Production Testing:
1. Visit your live site: https://www.emuski.com
2. Install "Google Analytics Debugger" Chrome extension
3. Open DevTools and check for GA events
4. OR use GA4 DebugView:
   - Go to Google Analytics
   - Admin > DebugView
   - Visit your site and see events in real-time

## 📈 Enhanced Events Being Tracked

| Event Type | Event Name | Description |
|------------|-----------|-------------|
| Subscription | `subscribe` | Email newsletter signup |
| Lead Generation | `generate_lead` | Contact form submission |
| Engagement | `scroll` | User scrolls 90% of page |
| Engagement | `file_download` | File download clicks |
| Engagement | `click` | Outbound link clicks |
| Errors | `exception` | Form errors and issues |

## 🎯 Conversion Events

Configured conversion events with values:
- **Quote Request**: $100 estimated value
- **Contact Form**: $100 estimated value
- **Email Signup**: $20 estimated value

These help you calculate ROI and track business goals.

## 🔍 Custom Dimensions & Metrics

### Custom Dimensions (User Properties):
- `user_type`: customer, prospect, visitor
- `industry`: User's industry
- `company_size`: small, medium, large
- `content_type`: blog, service, product

### Custom Metrics:
- `scroll_depth`: How far user scrolled
- `time_on_page`: Engagement time
- `pages_per_session`: Pages viewed per visit
- `quote_value`: Estimated value of quotes

## ✅ Verification Checklist

After deployment, verify:
- [ ] Page views are being recorded
- [ ] Email subscription events appear
- [ ] Contact form submissions tracked as leads
- [ ] Google Signals is enabled (check in GA4 Admin)
- [ ] Enhanced Measurement is active
- [ ] No console errors related to gtag

## 🚀 Next Steps

1. **Set up Goals** in GA4:
   - Create conversion event for `subscribe`
   - Create conversion event for `generate_lead`

2. **Enable Audience Building**:
   - Create audiences based on user behavior
   - Use for remarketing campaigns

3. **Set up Custom Reports**:
   - Create dashboard for key metrics
   - Set up email reports for weekly summaries

---

**Note**: It may take 24-48 hours for data to fully populate in Google Analytics after deployment.
