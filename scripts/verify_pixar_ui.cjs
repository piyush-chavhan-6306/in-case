const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\offic\\.gemini\\antigravity-ide\\brain\\9e5c0cb6-aabc-401c-bb7f-488aac7d41db';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9224',
  '--user-data-dir=C:\\Users\\offic\\.gemini\\antigravity-ide\\brain\\9e5c0cb6-aabc-401c-bb7f-488aac7d41db\\scratch\\edge_profile',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1440,900',
  'http://127.0.0.1:5173/'
]);

async function connect() {
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9224/json');
      const tabs = await res.json();
      const incaseTab = tabs.find(t => t.url.includes('5173'));
      if (incaseTab && incaseTab.webSocketDebuggerUrl) {
        return incaseTab;
      }
    } catch (e) {
      // wait 500ms
    }
    await new Promise(r => setTimeout(r, 500));
  }
  return null;
}

setTimeout(async () => {
  try {
    const incaseTab = await connect();
    if (!incaseTab || !incaseTab.webSocketDebuggerUrl) {
      console.error('No tab found after retries');
      edge.kill();
      return;
    }

    const ws = new WebSocket(incaseTab.webSocketDebuggerUrl);
    
    const send = (id, method, params = {}) => {
      ws.send(JSON.stringify({ id, method, params }));
    };

    const evalScript = (id, expression) => {
      send(id, 'Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    };

    const takeScreenshot = (id) => {
      send(id, 'Page.captureScreenshot', { format: 'png' });
    };

    ws.onopen = () => {
      send(1, 'Runtime.enable');
      send(2, 'Page.enable');
      send(3, 'Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    };

    ws.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);

      if (data.id === 3) {
        // Wait 2s for page to hydrate, then switch to Discover view
        setTimeout(() => {
          evalScript(10, `
            const btn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('Discover'));
            if (btn) btn.click();
            true;
          `);
        }, 2000);
      } else if (data.id === 10) {
        setTimeout(() => {
          takeScreenshot(100); // discover view screenshot
        }, 1500);
      } else if (data.id === 100 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(ARTIFACT_DIR, 'pixar_ui_discover.png'), buf);
        console.log('Saved pixar_ui_discover.png');

        // Switch to Protect view
        evalScript(20, `
          const btn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('Protect'));
          if (btn) btn.click();
          true;
        `);
      } else if (data.id === 20) {
        setTimeout(() => {
          takeScreenshot(200); // protect view screenshot
        }, 1500);
      } else if (data.id === 200 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(ARTIFACT_DIR, 'pixar_ui_protect.png'), buf);
        console.log('Saved pixar_ui_protect.png');

        // Switch to Rehearse view
        evalScript(30, `
          const btn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent.includes('Rehearse'));
          if (btn) btn.click();
          true;
        `);
      } else if (data.id === 30) {
        setTimeout(() => {
          takeScreenshot(300); // rehearse view screenshot
        }, 1500);
      } else if (data.id === 300 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(ARTIFACT_DIR, 'pixar_ui_rehearse.png'), buf);
        console.log('Saved pixar_ui_rehearse.png');

        // Open Fire Drill Modal
        evalScript(40, `
          const btns = Array.from(document.querySelectorAll('button'));
          const drillBtn = btns.find(b => b.textContent.includes('Launch Fire Drill') || b.textContent.includes('Fire Drill'));
          if (drillBtn) drillBtn.click();
          true;
        `);
      } else if (data.id === 40) {
        setTimeout(() => {
          takeScreenshot(400); // fire drill modal screenshot
        }, 1500);
      } else if (data.id === 400 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(ARTIFACT_DIR, 'pixar_ui_firedrill.png'), buf);
        console.log('Saved pixar_ui_firedrill.png');

        // Close modal and switch to Emergency view
        evalScript(50, `
          const closeBtn = document.querySelector('button svg.lucide-x')?.parentElement;
          if (closeBtn) closeBtn.click();
          setTimeout(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const emergBtn = btns.find(b => b.textContent.includes('Emergency Mode') || b.textContent.includes('Emergency'));
            if (emergBtn) emergBtn.click();
          }, 300);
          true;
        `);
      } else if (data.id === 50) {
        setTimeout(() => {
          takeScreenshot(500); // emergency mode screenshot
        }, 1500);
      } else if (data.id === 500 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(ARTIFACT_DIR, 'pixar_ui_emergency.png'), buf);
        console.log('Saved pixar_ui_emergency.png');

        // Click Copilot tab
        evalScript(60, `
          const btns = Array.from(document.querySelectorAll('button'));
          const copilotBtn = btns.find(b => b.textContent.includes('COPILOT') || b.textContent.includes('Copilot'));
          if (copilotBtn) copilotBtn.click();
          true;
        `);
      } else if (data.id === 60) {
        setTimeout(() => {
          takeScreenshot(600); // copilot tab screenshot
        }, 1500);
      } else if (data.id === 600 && data.result?.data) {
        const buf = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(ARTIFACT_DIR, 'pixar_ui_copilot.png'), buf);
        console.log('Saved pixar_ui_copilot.png');

        console.log('All Pixar UI screenshots captured successfully!');
        edge.kill();
        process.exit(0);
      }
    };
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1000);
