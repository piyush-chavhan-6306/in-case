const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\offic\\.gemini\\antigravity-ide\\brain\\9e5c0cb6-aabc-401c-bb7f-488aac7d41db';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1440,900',
  'http://127.0.0.1:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9223/json');
    const tabs = await res.json();
    const incaseTab = tabs.find(t => t.url.includes('5173'));
    if (!incaseTab || !incaseTab.webSocketDebuggerUrl) {
      console.error('No tab found');
      edge.kill();
      return;
    }

    const ws = new WebSocket(incaseTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
      ws.send(JSON.stringify({
        id: 4,
        method: 'Emulation.setDeviceMetricsOverride',
        params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
      }));
    };

    let step = 0;
    ws.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);
      if (data.method === 'Runtime.exceptionThrown') {
        console.error('BROWSER EXCEPTION:', JSON.stringify(data.params.exceptionDetails, null, 2));
      }

      // Check when root has rendered and canvas is drawn
      if (data.id === 4) {
        // Poll for canvas frame to be drawn
        const checkDrawn = () => {
          ws.send(JSON.stringify({
            id: 50,
            method: 'Runtime.evaluate',
            params: { expression: 'Boolean(document.querySelector("canvas"))' }
          }));
        };
        setTimeout(checkDrawn, 1000);
      } else if (data.id === 50 && data.result?.result?.value) {
        // Wait 1.5s for frame 0 to decode and draw
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 100,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 1500);
      } else if (data.id === 100 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        const p = path.join(ARTIFACT_DIR, 'scene1_house.png');
        fs.writeFileSync(p, buf);
        console.log('Saved Scene 1 screenshot to:', p, 'bytes:', buf.length);

        // Scroll directly to Scene 7 (frame ~1550)
        ws.send(JSON.stringify({
          id: 201,
          method: 'Runtime.evaluate',
          params: { expression: 'window.scrollTo({ top: window.innerHeight * 9.1, behavior: "instant" }); window.scrollY' }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 200,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 2000);
      } else if (data.id === 200 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        const p = path.join(ARTIFACT_DIR, 'scene7_guardians.png');
        fs.writeFileSync(p, buf);
        console.log('Saved Scene 7 Guardians screenshot to:', p, 'bytes:', buf.length);

        // Scroll to Scene 8 (Rehearse Fire Drill: ~87% of total scrollable)
        ws.send(JSON.stringify({
          id: 301,
          method: 'Runtime.evaluate',
          params: { expression: 'window.scrollTo({ top: (document.body.scrollHeight - window.innerHeight) * 0.87, behavior: "instant" }); window.scrollY' }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 300,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 2000);
      } else if (data.id === 300 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        const p = path.join(ARTIFACT_DIR, 'scene8_rehearse.png');
        fs.writeFileSync(p, buf);
        console.log('Saved Scene 8 Rehearse screenshot to:', p, 'bytes:', buf.length);

        ws.close();
        edge.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error('Script error:', err);
    edge.kill();
    process.exit(1);
  }
}, 2000);
