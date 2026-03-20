import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// System prompt for DFM (Design for Manufacturing) analysis
export const DFM_SYSTEM_PROMPT = `You are an expert manufacturing engineer and design analyst. You provide helpful, specific answers to user questions about CAD models, manufacturing, costs, applications, and design optimization.

RESPONSE REQUIREMENTS:
- Answer the user's specific question directly
- Keep responses under 500 words
- Use simple markdown formatting (##, -, **)
- Be conversational and helpful
- Provide specific, actionable insights

CAPABILITIES:
- Manufacturing analysis and process recommendations
- Cost estimation and optimization suggestions
- Application identification and use case analysis
- Material selection and design improvements
- Quality control and inspection recommendations
- Lead time and production planning advice

INSTRUCTIONS:
1. Read the user's question carefully
2. Provide a direct answer addressing their specific concern
3. Include relevant manufacturing insights when applicable
4. Use the provided geometry data to support your analysis
5. Be helpful and educational

Always respond to what the user is actually asking, not just provide generic manufacturing analysis.`;

// Helper function to build DFM analysis prompts with CAD data
export function buildDFMPrompt(
  userMessage: string, 
  geometryData: any, 
  fileName: string
): string {
  const dimensions = geometryData?.dimensions || {};
  const features = geometryData?.features || {};
  const volume = geometryData?.volume || 0;
  
  // Determine if this is a general analysis request or a specific question
  const isSpecificQuestion = userMessage && 
    (userMessage.toLowerCase().includes('what') || 
     userMessage.toLowerCase().includes('how') || 
     userMessage.toLowerCase().includes('why') ||
     userMessage.toLowerCase().includes('cost') ||
     userMessage.toLowerCase().includes('application') ||
     userMessage.toLowerCase().includes('contact') ||
     userMessage.toLowerCase().includes('emuski') ||
     userMessage.trim() === 'hi');

  if (isSpecificQuestion) {
    return `
**User Question:** ${userMessage}

**CAD Model Context:**
- File: ${fileName}
- Dimensions: ${dimensions.length || 'N/A'}mm × ${dimensions.width || 'N/A'}mm × ${dimensions.height || 'N/A'}mm
- Volume: ${volume > 0 ? (volume / 1000).toFixed(2) + ' cm³' : 'Unknown'}
- Part Type: ${inferPartType(fileName)}

Please answer the user's specific question. If they're asking about:
- Applications: Suggest what this part might be used for based on its geometry
- Costs: Provide realistic manufacturing cost estimates 
- Emuski/Contact: Explain that Emuski is a manufacturing analysis platform
- General greetings: Respond conversationally and offer help with manufacturing analysis

Use the CAD data to support your answer when relevant.
`;
  }

  // Default manufacturing analysis format
  return `
**CAD Model Analysis Request:**

**File:** ${fileName}
**User Request:** ${userMessage || 'Please analyze this part for manufacturability'}

**Geometry Data:**
- Dimensions: ${dimensions.length || 'N/A'}mm × ${dimensions.width || 'N/A'}mm × ${dimensions.height || 'N/A'}mm
- Volume: ${volume > 0 ? (volume / 1000).toFixed(2) + ' cm³' : 'Calculating...'}
- Surface Area: ${geometryData?.surfaceArea ? (geometryData.surfaceArea / 100).toFixed(1) + ' cm²' : 'Calculating...'}

**Detected Features:**
- Holes: ${features.holes?.count || 0} detected
- Pockets: ${features.pockets?.count || 0} detected  
- Walls: ${features.walls?.count || 0} detected
- Fillets: ${features.fillets?.count || 0} detected
- Chamfers: ${features.chamfers?.count || 0} detected

**Manufacturing Context:**
- Part appears to be a ${inferPartType(fileName)} based on filename
- Complexity Level: ${assessComplexity(geometryData)}

Please provide manufacturing analysis addressing the user's request while considering the geometric constraints and manufacturing implications.
`;
}

// Helper function to infer part type from filename
function inferPartType(fileName: string): string {
  const name = fileName.toLowerCase();
  if (name.includes('bracket')) return 'mounting bracket';
  if (name.includes('housing')) return 'protective housing';
  if (name.includes('cover')) return 'cover or lid';
  if (name.includes('plate')) return 'mounting plate';
  if (name.includes('handle')) return 'user interface component';
  if (name.includes('gear')) return 'mechanical gear';
  if (name.includes('shaft')) return 'rotating shaft';
  if (name.includes('connector')) return 'connection component';
  return 'mechanical component';
}

// Helper function to assess manufacturing complexity
function assessComplexity(geometryData: any): string {
  const features = geometryData?.features || {};
  const totalFeatures = (features.holes?.count || 0) + 
                       (features.pockets?.count || 0) + 
                       (features.walls?.count || 0);
  
  if (totalFeatures > 10) return 'High (many features require complex machining)';
  if (totalFeatures > 5) return 'Medium (moderate machining complexity)';
  return 'Low (simple geometry, straightforward manufacturing)';
}

// Single attempt Claude API call with clear error messaging
export async function callClaudeWithRetry(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });

    // Extract text content from Claude's response
    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    } else {
      throw new Error('AI_RESPONSE_ERROR: No text content received');
    }
  } catch (error: any) {
    // Throw specific error types for UI to handle
    if (error?.status === 401) {
      throw new Error('AI_AUTH_ERROR: AI service authentication failed');
    }
    if (error?.status === 429) {
      throw new Error('AI_RATE_LIMIT: Too many requests. Please wait and try again');
    }
    if (error?.status === 400) {
      throw new Error('AI_INPUT_ERROR: Invalid request format');
    }
    if (error?.status >= 500) {
      throw new Error('AI_SERVER_ERROR: AI service temporarily unavailable');
    }
    
    throw new Error(`AI_ERROR: ${error.message || 'Unknown AI service error'}`);
  }
}