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
    const incaseTab = tabs.find(t => t.url.includes('5173'));
    if (!incaseTab || !incaseTab.webSocketDebuggerUrl) {
      console.error('No tab found');
      edge.kill();
      return;
    }

    const ws = new WebSocket(incaseTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
      ws.send(JSON.stringify({
        id: 3,
        method: 'Emulation.setDeviceMetricsOverride',
        params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
      }));
    };

    ws.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);

      if (data.id === 3) {
        // Wait 3.5 seconds for CinematicLoader to finish
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 10,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                const el = document.querySelector('img[src*="reality_desk_bg"]');
                if (el) {
                  el.parentElement.parentElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                  true;
                } else {
                  window.scrollTo({ top: document.body.scrollHeight - 1600, behavior: 'instant' });
                  false;
                }
              `
            }
          }));
        }, 3600);
      } else if (data.id === 10) {
        // Wait 1.5 seconds for render, then capture Problem and Pillars screenshot
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 20,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 1500);
      } else if (data.id === 20 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        const p = path.join(ARTIFACT_DIR, 'problem_and_pillars_matched.png');
        fs.writeFileSync(p, buf);
        console.log('Saved Problem & Pillars matched screenshot to:', p, 'bytes:', buf.length);

        // Now open the Unlock Modal by clicking the Unlock button in FloatingNavbar
        ws.send(JSON.stringify({
          id: 30,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              const buttons = Array.from(document.querySelectorAll('button'));
              const unlockBtn = buttons.find(b => b.textContent.includes('Unlock'));
              if (unlockBtn) {
                unlockBtn.click();
                true;
              } else {
                false;
              }
            `
          }
        }));
      } else if (data.id === 30) {
        // Wait for modal animation to settle
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 40,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 1000);
      } else if (data.id === 40 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        const p = path.join(ARTIFACT_DIR, 'unlock_modal_matched.png');
        fs.writeFileSync(p, buf);
        console.log('Saved Unlock Modal matched screenshot to:', p, 'bytes:', buf.length);

        ws.close();
        edge.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error('Error running test script:', err);
    edge.kill();
    process.exit(1);
  }
}, 2000);
