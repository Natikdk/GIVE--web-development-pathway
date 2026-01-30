import React, { useState, useRef } from 'react';
import '../styles/component/SimplePlayground.css';

const SimplePlayground = ({ initialHTML = '', initialCSS = '', initialJS = '', instructions = '' }) => {
  const [html, setHtml] = useState(initialHTML);
  const [css, setCss] = useState(initialCSS);
  const [js, setJs] = useState(initialJS);
  const iframeRef = useRef(null);

  const runCode = () => {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
   //yhe templatu new
    const code = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch(error) {
              console.error(error);
            }
          </script>
        </body>
      </html>
    `;
    
    iframeDoc.open();
    iframeDoc.write(code);
    iframeDoc.close();
  };

  const resetCode = () => {
    setHtml(initialHTML);
    setCss(initialCSS);
    setJs(initialJS);
  };

  return (
    <div className="simple-playground">
      {instructions && (
        <div className="playground-instructions">
          <h4>🎯 Try It Yourself</h4>
          <p>{instructions}</p>
        </div>
      )}

      <div className="editor-container">
        <div className="editor-section">
          <label>HTML</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Write your HTML here..."
            className="code-editor"
            rows="8"
          />
        </div>

        <div className="editor-section">
          <label>CSS</label>
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder="Write your CSS here..."
            className="code-editor"
            rows="8"
          />
        </div>

        <div className="editor-section">
          <label>JavaScript</label>
          <textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            placeholder="Write your JavaScript here..."
            className="code-editor"
            rows="8"
          />
        </div>
      </div>

      <div className="playground-controls">
        <button onClick={runCode} className="btn-run">
          ▶ Run Code
        </button>
        <button onClick={resetCode} className="btn-reset">
          ⟳ Reset
        </button>
      </div>

      <div className="preview-container">
        <h4>Preview</h4>
        <iframe
          ref={iframeRef}
          title="Code Preview"
          className="preview-frame"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default SimplePlayground;