const http = require('http');
const { spawn } = require('child_process');

// Launch Edge with remote debugging
const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-first-run',
  '--no-default-browser-check',
  'http://127.0.0.1:5173/'
]);

setTimeout(async () => {
  try {
    // Get WebSocket URL from debugger
    const res = await fetch('http://127.0.0.1:9222/json');
    const tabs = await res.json();
    console.log('Tabs:', tabs.map(t => ({ title: t.title, url: t.url, ws: t.webSocketDebuggerUrl })));
    
    const incaseTab = tabs.find(t => t.url.includes('5173'));
    if (incaseTab && incaseTab.webSocketDebuggerUrl) {
      console.log('Connecting to InCase tab:', incaseTab.title);
      const ws = new WebSocket(incaseTab.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
        ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
      };
      const fs = require('fs');
      ws.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);
        if (data.method === 'Runtime.exceptionThrown') {
          console.error('BROWSER EXCEPTION:', JSON.stringify(data.params.exceptionDetails, null, 2));
        } else if (data.id === 10) {
          console.log('DOM ROOT INNERHTML LENGTH:', data.result?.result?.value);
          // Scroll page down to test scrubbing
          ws.send(JSON.stringify({
            id: 15,
            method: 'Runtime.evaluate',
            params: { expression: 'window.scrollTo({ top: 3500, behavior: "instant" }); window.scrollY' }
          }));
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 20,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 1500);
        } else if (data.id === 20 && data.result?.data) {
          const buffer = Buffer.from(data.result.data, 'base64');
          fs.writeFileSync('D:\\in case project\\app_screenshot_scrolled.png', buffer);
          console.log('SCROLLED SCREENSHOT SAVED! Size:', buffer.length);
        }
      };
      
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: { expression: 'document.getElementById("root")?.innerHTML?.length || 0' }
        }));
      }, 2500);

      await new Promise((r) => setTimeout(r, 4500));
    }
  } catch (e) {
    console.error('Debug error:', e.message);
  } finally {
    edge.kill();
  }
}, 2000);
