import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export interface GeneratedCode {
  html: string
  css: string
  javascript: string
}

export async function POST(request: NextRequest) {
  let userPrompt = 'Default Application'
  
  try {
    const { prompt: receivedPrompt } = await request.json()
    
    if (!receivedPrompt || typeof receivedPrompt !== 'string') {
      return NextResponse.json(
        { error: 'Valid prompt is required' },
        { status: 400 }
      )
    }
    
    userPrompt = receivedPrompt

    // Initialize ZAI
    const zai = await ZAI.create()

    const systemPrompt = `You are an expert web developer. Generate a complete, functional web application based on the user's prompt. 
    Return the response as a JSON object with three properties: 'html', 'css', and 'javascript'. 
    Each property should contain the complete code for that file type.
    
    The HTML should be a complete, valid HTML5 document with proper structure.
    The CSS should include modern styling with responsive design.
    The JavaScript should include interactive functionality.
    
    Make sure the code is well-formatted, properly indented, and includes comments where appropriate.
    Keep the code concise but functional - aim for files that are comprehensive but not excessively long.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Generate a complete web application for: ${userPrompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const response = completion.choices[0]?.message?.content
    
    if (!response) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    try {
      const generatedCode = JSON.parse(response)
      
      // Validate the response has the required properties
      if (!generatedCode.html || !generatedCode.css || !generatedCode.javascript) {
        throw new Error('Invalid response format - missing required code files')
      }

      return NextResponse.json({
        html: generatedCode.html,
        css: generatedCode.css,
        javascript: generatedCode.javascript
      })
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse generated code' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error generating code:', error)
    
    // Return fallback code if AI fails
    const fallbackCode = generateFallbackCode(userPrompt)
    return NextResponse.json(fallbackCode)
  }
}

// Fallback code generation when AI is not available
function generateFallbackCode(prompt: string): GeneratedCode {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>${prompt}</h1>
        <div class="content">
            <p>Generated application for: ${prompt}</p>
            <button id="actionBtn">Click Me</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`

  const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    width: 90%;
    text-align: center;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 2rem;
}

.content {
    color: #666;
    line-height: 1.6;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 1rem;
    transition: all 0.3s ease;
}

button:hover {
    background: #764ba2;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}`

  const javascript = `document.addEventListener('DOMContentLoaded', function() {
    const actionBtn = document.getElementById('actionBtn');
    
    actionBtn.addEventListener('click', function() {
        alert('Hello! This is a generated application for: ${prompt}');
        
        // Add some visual feedback
        this.style.background = '#4CAF50';
        this.textContent = 'Clicked!';
        
        setTimeout(() => {
            this.style.background = '#667eea';
            this.textContent = 'Click Me';
        }, 2000);
    });
    
    // Add some interactive animations
    const container = document.querySelector('.container');
    
    container.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    container.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});`

  return { html, css, javascript }
}