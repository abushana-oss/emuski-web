# Large File Handling Guide

## Current File Size Limits

### ✅ EMUSKI Web Application
- **Upload Limit:** 500MB (configurable via `MAX_UPLOAD_SIZE_MB` env var)
- **Supported Formats:** STEP, STL, IGES, OBJ, PDF
- **Status:** ✅ Ready for large industrial CAD models

### ⚠️ External Service Limitations

#### CAD Engine Service
- **Current Limit:** ~100MB (external service)
- **Error:** 413 Request Entity Too Large
- **Solution:** Contact CAD engine service provider to increase limits

#### Supabase Storage
- **Default Limit:** 50MB per file
- **Solution:** Run migration to increase to 500MB
- **Command:** `npx supabase db push`

## Error Handling

### 413 Error (File Too Large)
```javascript
// Example error response for 413
{
  "error": "File is too large for the CAD conversion service...",
  "supportEmail": "support@emuski.com"
}
```

### 400 Error (Supabase Storage)
- **Cause:** Storage bucket file size limit exceeded
- **Solution:** Apply storage migration

## Configuration

### Environment Variables
```bash
# Set custom upload limit (in MB)
MAX_UPLOAD_SIZE_MB=1000  # Allows 1GB uploads

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### Next.js Configuration
```javascript
// next.config.js
experimental: {
  serverActions: {
    bodySizeLimit: '500mb', // Matches upload limit
  },
}
```

## Production Deployment Steps

1. **Update Environment Variables**
   ```bash
   MAX_UPLOAD_SIZE_MB=500
   ```

2. **Apply Database Migrations**
   ```bash
   npx supabase db push
   ```

3. **Contact External Services**
   - CAD Engine: Request file size limit increase
   - Hosting Provider: Ensure adequate bandwidth

4. **Monitor Performance**
   - Large file uploads may take longer
   - Consider implementing upload progress indicators
   - Set appropriate timeout values

## Troubleshooting

### 413 Error from CAD Engine
- **Temporary Solution:** Use smaller files
- **Permanent Solution:** Contact CAD engine provider

### 400 Error from Supabase
- **Check:** Storage bucket policies are applied
- **Verify:** File size limits in Supabase dashboard

### 503 Service Unavailable
- **Check:** All environment variables are set
- **Verify:** External services are accessible

## Contact Information

For large file processing support:
- **Email:** support@emuski.com
- **Subject:** Large File Processing Request
- **Include:** File size, format, and use case