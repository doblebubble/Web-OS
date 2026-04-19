import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const windowsToWrap = [
  'aboutme', 'appmaker', 'youtube', 'chrome', 'pc', 'stonemeni', 'claude', 'settings',
  'textdocs', 'flashplayer', 'sysmon', 'gchat', 'browser', 'imageviewer', 'angrybirds',
  'bouncyball', 'balloon', 'flappy', 'cydia', 'cydia_fake', 'doge_unlocked', 'talking_horror', 'doge'
];

for (const appId of windowsToWrap) {
  const regex = new RegExp(`(<Window id="${appId}"[\\s\\S]*?<\\/Window>)`, 'g');
  content = content.replace(regex, `{windowInstances.filter(w => w.appId === '${appId}').map(win => (\n        $1\n      ))}`);
}

// Now replace id="appId" with key={win.id} id={win.id}
for (const appId of windowsToWrap) {
  const regex = new RegExp(`id="${appId}"`, 'g');
  content = content.replace(regex, `key={win.id} id={win.id}`);
}

// Fix the taskbar context menu
content = content.replace(
  `{taskbarContextMenu.id && (
              <>
                <div 
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-red-500 hover:text-white rounded cursor-pointer text-sm text-gray-800 transition-colors font-semibold"
                  onClick={() => { closeWindow(taskbarContextMenu.id!); setTaskbarContextMenu(null); }}
                >
                  <img src={apps[taskbarContextMenu.id]?.icon} className="w-5 h-5" alt="" />
                  Close {apps[taskbarContextMenu.id]?.name}
                </div>`,
  `{taskbarContextMenu.id && (() => {
              const winInst = windowInstances.find(w => w.id === taskbarContextMenu.id);
              const app = winInst ? apps[winInst.appId] : null;
              if (!app) return null;
              return (
              <>
                <div 
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-red-500 hover:text-white rounded cursor-pointer text-sm text-gray-800 transition-colors font-semibold"
                  onClick={() => { closeWindow(taskbarContextMenu.id!); setTaskbarContextMenu(null); }}
                >
                  <img src={app.icon} className="w-5 h-5" alt="" />
                  Close {app.name}
                </div>
                <div className="border-b border-gray-200 my-1"></div>
              </>
              );
            })()}`
);

// Fix the "Close app" divider which was left outside the IIFE in the original code
content = content.replace(
  `                <div className="border-b border-gray-200 my-1"></div>
              </>
            )}`,
  `            )}`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Refactor complete');
