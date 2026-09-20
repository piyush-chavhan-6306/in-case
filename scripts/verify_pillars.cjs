const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\offic\\.gemini\\antigravity-ide\\brain\\9e5c0cb6-aabc-401c-bb7f-488aac7d41db';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9224',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1440,900',
  'http://127.0.0.1:5173/'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9224/json');
    const tabs = await res.json();
    const tab = tabs.find(t => t.url.includes('5173'));
    if (!tab) { edge.kill(); return; }

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
      ws.send(JSON.stringify({
        id: 3,
        method: 'Emulation.setDeviceMetricsOverride',
        params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
      }));
    };

    let step = 0;
    ws.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);

      if (data.id === 3) {
        // Navigate to Discover by clicking Discover button or dispatching state
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 10,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Discover'));
                if (btn) btn.click();
              `
            }
          }));
        }, 1500);
      } else if (data.id === 10) {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 20,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 1000);
      } else if (data.id === 20 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        const p = path.join(ARTIFACT_DIR, 'view_discover.png');
        fs.writeFileSync(p, buf);
        console.log('Saved Discover view screenshot');

        // Click Protect
        ws.send(JSON.stringify({
          id: 30,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              (() => {
                const btns = Array.from(document.querySelectorAll('button'));
                const protectBtns = btns.filter(b => b.textContent.includes('Protect'));
                console.log('Protect buttons found:', protectBtns.map(b => b.outerHTML));
                if (protectBtns.length > 0) {
                  protectBtns[0].click();
                  return 'Clicked: ' + protectBtns[0].textContent;
                }
                return 'No protect button found';
              })()
            `
          }
        }));
      } else if (data.id === 30) {
        console.log('Step 30 eval result:', data.result?.result?.value);
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 40,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 1000);
      } else if (data.id === 40 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        const p = path.join(ARTIFACT_DIR, 'view_protect.png');
        fs.writeFileSync(p, buf);
        console.log('Saved Protect view screenshot');

        // Click Rehearse
        ws.send(JSON.stringify({
          id: 50,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Rehearse'));
              if (btn) btn.click();
            `
          }
        }));
      } else if (data.id === 50) {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 60,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 1000);
      } else if (data.id === 60 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        const p = path.join(ARTIFACT_DIR, 'view_rehearse.png');
        fs.writeFileSync(p, buf);
        console.log('Saved Rehearse view screenshot');

        ws.close();
        edge.kill();
        process.exit(0);
      }
    };
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 2000);
