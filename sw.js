if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,c)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let n={};const f=e=>i(e,r),u={module:{uri:r},exports:n,require:f};s[r]=Promise.all(a.map((e=>u[e]||f(e)))).then((e=>(c(...e),n)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_app/immutable/assets/0.DmjL_DMq.css",revision:"83b58f88835ea555c711e3d2b5143a4b"},{url:"_app/immutable/assets/2.DPI_R4TA.css",revision:"388f0074c8f75603228582fe8d0ec9ce"},{url:"_app/immutable/chunks/B7aTruGB.js",revision:"c74e93fa0021e02d6e256ebced912014"},{url:"_app/immutable/chunks/BCQ4AXhQ.js",revision:"20f2120f20578a61cab95cff9cd54b8a"},{url:"_app/immutable/chunks/D4k4vJAq.js",revision:"5a20b9bb7f3190d82acecae9f7474a5f"},{url:"_app/immutable/chunks/DhWqEYSG.js",revision:"d63f33db11cc8feb136dc335ee5579e6"},{url:"_app/immutable/chunks/DMqeO2by.js",revision:"8c6bb61cc5b27757b43e20bb7afebacf"},{url:"_app/immutable/chunks/ZAsNvhcv.js",revision:"d73ae903b6c7a41db3e3ae814f841ddb"},{url:"_app/immutable/entry/app.CffmwBKr.js",revision:"406e1764fcca7f82fc1d0090edcad3a3"},{url:"_app/immutable/entry/start.6-4JYCPW.js",revision:"9dc24e70f72e0c5cc318ffe2760a8da0"},{url:"_app/immutable/nodes/0.BuQ2TACW.js",revision:"3c77ef655fb1bfec5a80660adf856ed7"},{url:"_app/immutable/nodes/1.B379dH__.js",revision:"139fcbe8f0a61884cbb0055aa7069022"},{url:"_app/immutable/nodes/2.jMzO1dKk.js",revision:"6902dccc932c8b6cf10d3e0dcdcfd991"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"favicon.png",revision:"ed607deb55535242aa419bde71d8dd2b"},{url:"manifest.webmanifest",revision:"a7522970b157bc88f6e166739490a8d6"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
