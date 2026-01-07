# Security Pre-Production Checklist

## ✅ Completed
- [x] Security audit performed
- [x] No dependency vulnerabilities found
- [x] CSP headers properly configured
- [x] Input validation and sanitization implemented
- [x] REVALIDATE_SECRET added to .env
- [x] Secrets properly stored in environment variables
- [x] HTTPS enforced via upgrade-insecure-requests
- [x] Supabase connection secured
- [x] Email service secured (Resend API)
- [x] reCAPTCHA v2 implemented on forms
- [x] SMTP credentials removed (using Resend instead)

## 🔴 CRITICAL (Must Fix Before Production)
- [ ] **Add REVALIDATE_SECRET to production environment**
  ```bash
  # In your hosting platform (Vercel/Netlify/etc):
  REVALIDATE_SECRET=pyPNTnPnSiMShrrlTZJWWAWF+V36XxleqBhf66jxKU4=
  ```

## 🟠 HIGH PRIORITY (Within 1 Week)

### 1. Implement Rate Limiting
- [ ] Install rate limiting package:
  ```bash
  npm install @upstash/ratelimit @upstash/redis
  ```
- [ ] Create Upstash Redis account (free tier available)
- [ ] Add rate limiting to `/api/contact` (5 requests per 15 min)
- [ ] Add rate limiting to `/api/revalidate` (10 requests per hour)

### 2. Configure CORS
- [ ] Add CORS headers to API routes
- [ ] Restrict to production domain only
- [ ] Test CORS configuration

### 3. Add Request Size Limits
- [ ] Update `next.config.js` with body size limits
- [ ] Test with large payloads

### 4. Verify Supabase RLS Policies
- [ ] Log into Supabase dashboard
- [ ] Check `contact_submissions` table policies
- [ ] Check `email_subscriptions` table policies
- [ ] Ensure anon users can only INSERT, not SELECT

## 🟡 MEDIUM PRIORITY (Within 2 Weeks)

### 5. Add Security.txt
- [ ] Create `/public/.well-known/security.txt`
- [ ] Add contact information for security researchers
- [ ] Set expiration date (1 year from now)

### 6. Improve Error Handling
- [ ] Add environment check for error details
- [ ] Only show detailed errors in development
- [ ] Generic errors in production

### 7. Set up Monitoring
- [ ] Install error tracking (Sentry, LogRocket, etc.)
- [ ] Set up security alerts
- [ ] Configure logging

### 8. GDPR Compliance
- [ ] Add cookie consent banner
- [ ] Create privacy policy
- [ ] Add terms of service
- [ ] Implement data deletion mechanism

## 🟢 LOW PRIORITY (Within 1 Month)

### 9. Add Subresource Integrity
- [ ] Add SRI hashes to external scripts
- [ ] Implement CSP reporting

### 10. Security Monitoring
- [ ] Set up automated security scans
- [ ] Schedule regular audits (quarterly)
- [ ] Implement intrusion detection

## 📝 Before Each Deployment

- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Review recent changes for security implications
- [ ] Ensure all environment variables are set
- [ ] Test reCAPTCHA in production
- [ ] Verify CSP headers in production
- [ ] Test contact form with real email
- [ ] Check rate limiting is working
- [ ] Review recent security logs

## 🎯 Production Environment Variables Checklist

Ensure these are set in your production hosting platform:

```bash
# Blogger API
BLOGGER_API_KEY=
NEXT_PUBLIC_BLOGGER_API_KEY=
MANUFACTURING_BLOG_ID=
NEXT_PUBLIC_ENABLE_ENGINEERING_BLOG=
NEXT_PUBLIC_ENGINEERING_BLOG_ID=
ENGINEERING_BLOG_ID=
SUCCESS_STORIES_BLOG_ID=
NEXT_PUBLIC_SUCCESS_STORIES_BLOG_ID=

# Email (Resend)
RESEND_API_KEY=

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# Revalidation
REVALIDATE_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=

# (Optional) Rate Limiting - if using Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## 📞 Security Contact

Create a dedicated security email:
- **Email:** security@emuski.com
- **Response Time:** Within 48 hours
- **Escalation:** [Define escalation path]

## 📅 Ongoing Security Tasks

### Weekly
- [ ] Review error logs
- [ ] Check for failed authentication attempts
- [ ] Monitor rate limiting hits

### Monthly
- [ ] Run `npm audit`
- [ ] Review access logs
- [ ] Update dependencies
- [ ] Review security alerts

### Quarterly
- [ ] Full security audit
- [ ] Penetration testing (if budget allows)
- [ ] Review and update security policies
- [ ] Train team on security best practices

---

**Last Updated:** January 8, 2026
**Next Review:** February 8, 2026
