#!/usr/bin/env node

/**
 * Deployment script for careers.emuski.com
 * This script prepares the Next.js app for careers subdomain deployment
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function deployToCareersDomain() {
  console.log('🚀 Preparing deployment for careers.emuski.com...');

  try {
    // Check if we're in the right directory
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    
    if (!packageJson.name.includes('emuski')) {
      throw new Error('This script must be run from the emuski-web project root');
    }

    // Create a careers-specific next.config.js if needed
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    const nextConfigExists = await fs.access(nextConfigPath).then(() => true).catch(() => false);

    if (!nextConfigExists) {
      const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'build',
  images: {
    unoptimized: true
  },
  experimental: {
    appDir: true
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  // Base path for careers subdomain (if needed)
  // basePath: '/careers',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/careers',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig;
`;
      await fs.writeFile(nextConfigPath, nextConfig);
      console.log('✅ Created next.config.js for careers deployment');
    }

    // Check environment variables
    console.log('🔍 Checking environment variables...');
    const requiredEnvVars = [
      'NEXT_PUBLIC_GA_MEASUREMENT_ID',
      'GA4_API_SECRET',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const envPath = path.join(process.cwd(), '.env');
    const envExists = await fs.access(envPath).then(() => true).catch(() => false);

    if (envExists) {
      const envContent = await fs.readFile(envPath, 'utf8');
      const missingVars = requiredEnvVars.filter(envVar => !envContent.includes(envVar));
      
      if (missingVars.length > 0) {
        console.warn('⚠️  Missing environment variables:', missingVars.join(', '));
        console.log('📝 Add these to your Netlify environment variables:');
        missingVars.forEach(envVar => {
          console.log(`   ${envVar}=your_value_here`);
        });
      } else {
        console.log('✅ All required environment variables found');
      }
    } else {
      console.warn('⚠️  No .env file found. Make sure to set environment variables in Netlify dashboard');
    }

    // Instructions for Netlify deployment
    console.log('\\n📋 Netlify Deployment Instructions:');
    console.log('1. Connect your GitHub repository to Netlify');
    console.log('2. Set up custom domain: careers.emuski.com');
    console.log('3. Add environment variables in Netlify dashboard:');
    console.log('   - NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QFDFYZLZPK');
    console.log('   - GA4_API_SECRET=AFANHPPgSJ-2D8niLc1AIA');
    console.log('   - NEXT_PUBLIC_GTM_ID=GTM-T5MDL48M');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    console.log('   - ANTHROPIC_API_KEY=your_anthropic_key');
    console.log('   - RESEND_API_KEY=your_resend_key');
    console.log('   - NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key');
    console.log('   - RECAPTCHA_SECRET_KEY=your_recaptcha_secret');
    console.log('4. Deploy branch: main');
    console.log('5. Build command: npm run build');
    console.log('6. Publish directory: .next');

    console.log('\\n🌐 DNS Configuration:');
    console.log('Add CNAME record: careers.emuski.com → your-site-name.netlify.app');

    console.log('\\n✨ Ready for deployment to careers.emuski.com!');

  } catch (error) {
    console.error('❌ Deployment preparation failed:', error.message);
    process.exit(1);
  }
}

// Run the deployment preparation
deployToCareersDomain();