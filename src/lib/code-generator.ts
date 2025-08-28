export interface GeneratedCode {
  html: string
  css: string
  javascript: string
}

export class CodeGenerator {
  private static instance: CodeGenerator

  private constructor() {}

  public static async getInstance(): Promise<CodeGenerator> {
    if (!CodeGenerator.instance) {
      CodeGenerator.instance = new CodeGenerator()
    }
    return CodeGenerator.instance
  }

  async generateCode(prompt: string): Promise<GeneratedCode> {
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate code')
      }

      const data = await response.json()
      
      // Validate the response has the required properties
      if (!data.html || !data.css || !data.javascript) {
        throw new Error('Invalid response format - missing required code files')
      }

      return {
        html: data.html,
        css: data.css,
        javascript: data.javascript
      }
    } catch (error) {
      console.error('Error generating code:', error)
      // Use fallback if API fails
      return CodeGenerator.generateFallbackCode(prompt)
    }
  }

  // Fallback code generation when API is not available
  static generateFallbackCode(prompt: string): GeneratedCode {
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
}