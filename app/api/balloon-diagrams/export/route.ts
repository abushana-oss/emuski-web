import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/jwt-auth';
import { withRateLimit } from '@/lib/rate-limiter';
import { withSecurity } from '@/lib/security-middleware';
import { z } from 'zod';

// Validation schema for balloon diagram export
const BalloonExportSchema = z.object({
  pdfUrl: z.string().url().optional(),
  pdfImageBase64: z.string().optional(),
  balloons: z.array(z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    number: z.number().int().min(1),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    style: z.enum(['circle', 'square', 'diamond']),
    note: z.string().max(100).optional(),
  })).min(1).max(50),
  containerWidth: z.number().int().min(100).max(2000),
  containerHeight: z.number().int().min(100).max(2000),
  balloonSize: z.number().int().min(1).max(5),
});

async function handleBalloonExport(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const authResult = await authenticateRequest(authHeader);
    
    if (!authResult.valid || !authResult.userId) {
      return NextResponse.json(
        { error: 'Authentication required for diagram export' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = BalloonExportSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid export data',
          details: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    const { 
      pdfUrl,
      pdfImageBase64, 
      balloons, 
      containerWidth, 
      containerHeight, 
      balloonSize
    } = validation.data;

    try {
      const { createCanvas, loadImage } = await import('canvas');
      
      let canvas;
      let context;
      
      // Since we're using client-side PDF.js canvas, we don't need server-side PDF rendering
      // Just create a fallback layout for reference
      if (pdfImageBase64) {
        // Use provided PDF image
        const base64Data = pdfImageBase64.replace(/^data:image\/\w+;base64,/, '');
        const pdfImageBuffer = Buffer.from(base64Data, 'base64');
        const pdfImage = await loadImage(pdfImageBuffer);
        
        const scale = 2;
        canvas = createCanvas(containerWidth * scale, containerHeight * scale);
        context = canvas.getContext('2d');
        
        context.imageSmoothingEnabled = true;
        if (context.imageSmoothingQuality) {
          context.imageSmoothingQuality = 'high';
        }
        
        context.scale(scale, scale);
        context.drawImage(pdfImage, 0, 0, containerWidth, containerHeight);
        
      } else {
        // Fallback - create professional template with instructions
        const scale = 2;
        canvas = createCanvas(containerWidth * scale, containerHeight * scale);
        context = canvas.getContext('2d');
        
        context.imageSmoothingEnabled = true;
        if (context.imageSmoothingQuality) {
          context.imageSmoothingQuality = 'high';
        }
        
        context.scale(scale, scale);
        
        // White background
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, containerWidth, containerHeight);
        
        // Add border
        context.strokeStyle = '#cccccc';
        context.lineWidth = 2;
        context.strokeRect(10, 10, containerWidth - 20, containerHeight - 20);
        
        // Add instructions
        context.fillStyle = '#333333';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.fillText('BALLOON DIAGRAM LAYOUT', containerWidth / 2, containerHeight / 2 - 40);
        
        context.font = '16px Arial';
        context.fillStyle = '#666666';
        context.fillText('Use this layout reference with your PDF document', containerWidth / 2, containerHeight / 2 - 10);
        context.fillText('Balloon positions are preserved from your original design', containerWidth / 2, containerHeight / 2 + 20);
        
        // Add grid for reference
        context.strokeStyle = '#f0f0f0';
        context.lineWidth = 1;
        const gridSize = 50;
        
        for (let x = gridSize; x < containerWidth; x += gridSize) {
          context.beginPath();
          context.moveTo(x, 20);
          context.lineTo(x, containerHeight - 20);
          context.stroke();
        }
        
        for (let y = gridSize; y < containerHeight; y += gridSize) {
          context.beginPath();
          context.moveTo(20, y);
          context.lineTo(containerWidth - 20, y);
          context.stroke();
        }
      }

      // Draw balloons over the content
      // Calculate the actual canvas dimensions and scale
      const actualWidth = canvas.width / (context.getTransform ? context.getTransform().a : 2);
      const actualHeight = canvas.height / (context.getTransform ? context.getTransform().d : 2);
      
      balloons.forEach((balloon: any) => {
        const x = (balloon.x * actualWidth) / 100;
        const y = (balloon.y * actualHeight) / 100;
        const size = (12 + (balloonSize - 1) * 4) * 1.2; // Professional size

        context.save();
        
        // Enhanced shadow for better visibility on PDF content
        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        context.shadowBlur = 6;
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        
        context.fillStyle = balloon.color;
        context.strokeStyle = '#ffffff';
        context.lineWidth = 4; // Thicker border for better visibility

        if (balloon.style === 'circle') {
          context.beginPath();
          context.arc(x, y, size / 2, 0, 2 * Math.PI);
          context.fill();
          context.shadowColor = 'transparent';
          context.stroke();
        } else if (balloon.style === 'square') {
          context.fillRect(x - size / 2, y - size / 2, size, size);
          context.shadowColor = 'transparent';
          context.strokeRect(x - size / 2, y - size / 2, size, size);
        } else if (balloon.style === 'diamond') {
          context.beginPath();
          context.moveTo(x, y - size / 2);
          context.lineTo(x + size / 2, y);
          context.lineTo(x, y + size / 2);
          context.lineTo(x - size / 2, y);
          context.closePath();
          context.fill();
          context.shadowColor = 'transparent';
          context.stroke();
        }

        // Draw number with enhanced visibility
        context.shadowColor = 'rgba(0, 0, 0, 0.8)';
        context.shadowBlur = 2;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.fillStyle = '#ffffff';
        context.font = `bold ${Math.max(14, size * 0.7)}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(balloon.number.toString(), x, y);

        // Draw enhanced note if exists
        if (balloon.note && balloon.note.trim()) {
          const noteX = x + size / 2 + 20;
          const noteY = y - size / 2 - 15;
          
          context.shadowColor = 'rgba(0, 0, 0, 0.4)';
          context.shadowBlur = 4;
          context.shadowOffsetX = 2;
          context.shadowOffsetY = 2;
          
          context.fillStyle = 'rgba(255, 255, 255, 0.95)';
          context.strokeStyle = balloon.color;
          context.lineWidth = 3;
          
          const noteWidth = Math.max(140, balloon.note.length * 9);
          const noteHeight = 40;
          
          // Draw note background with rounded corners effect
          context.beginPath();
          context.rect(noteX, noteY, noteWidth, noteHeight);
          context.fill();
          context.shadowColor = 'transparent';
          context.stroke();
          
          // Note text with shadow for better readability
          context.shadowColor = 'rgba(0, 0, 0, 0.3)';
          context.shadowBlur = 1;
          context.fillStyle = '#000000';
          context.font = 'bold 12px Arial';
          context.textAlign = 'left';
          context.textBaseline = 'middle';
          const noteDisplay = balloon.note.length > 16 ? balloon.note.substring(0, 16) + '...' : balloon.note;
          context.fillText(noteDisplay, noteX + 10, noteY + noteHeight / 2);
        }

        context.restore();
      });

      const buffer = canvas.toBuffer('image/png');
      
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': buffer.length.toString(),
        },
      });

    } catch (canvasError) {
      console.error('Canvas creation error:', canvasError);
      return NextResponse.json({ error: 'Failed to create export image' }, { status: 500 });
    }

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json({ 
      error: 'Export failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Apply security middleware and rate limiting
export const POST = withSecurity(
  withRateLimit(handleBalloonExport, '/api/balloon-diagrams/export')
);