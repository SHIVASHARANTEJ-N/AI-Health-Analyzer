import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms } = await req.json();
    
    if (!symptoms || typeof symptoms !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Symptoms text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a medical AI assistant that analyzes symptoms and provides preliminary health assessments. 

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text before or after.

Analyze the symptoms provided and return a structured analysis in this EXACT JSON format:
{
  "primaryDiagnosis": "Brief primary diagnosis",
  "summary": "Detailed summary of the analysis",
  "findings": [
    {
      "condition": "Condition name",
      "severity": "minor|moderate|major|critical",
      "description": "Description of the finding",
      "recommendation": "What to do about it",
      "remedies": ["remedy1", "remedy2"],
      "medicines": ["medicine1", "medicine2"],
      "doctorSpecialty": "Specialist type (only for major/critical)",
      "urgency": "urgent|very-urgent|emergency (only for major/critical)"
    }
  ]
}

Severity guidelines:
- minor: Self-treatable, rest and over-the-counter remedies
- moderate: Should see doctor soon, but not urgent
- major: Needs medical attention within 24-48 hours
- critical: Urgent medical attention required immediately

For minor/moderate: Include remedies and medicines arrays
For major/critical: Include doctorSpecialty and urgency fields`;

    console.log('Analyzing symptoms:', symptoms);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze these symptoms: ${symptoms}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse the JSON response from AI
    let analysisResult;
    try {
      analysisResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid response format from AI');
    }

    return new Response(
      JSON.stringify(analysisResult),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
