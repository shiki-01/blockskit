if(!self.define){let e,s={};const i=(i,c)=>(i=new URL(i+".js",c).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(c,a)=>{const b=e||("document"in self?document.currentScript.src:"")||location.href;if(s[b])return;let r={};const n=e=>i(e,b),u={module:{uri:b},exports:r,require:n};s[b]=Promise.all(c.map((e=>u[e]||n(e)))).then((e=>(a(...e),r)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_app/immutable/assets/0.DmjL_DMq.css",revision:"83b58f88835ea555c711e3d2b5143a4b"},{url:"_app/immutable/assets/2.DPI_R4TA.css",revision:"388f0074c8f75603228582fe8d0ec9ce"},{url:"_app/immutable/chunks/BCQ4AXhQ.js",revision:"20f2120f20578a61cab95cff9cd54b8a"},{url:"_app/immutable/chunks/CYGA8lVB.js",revision:"3b4eb02946f40f94b783517d740aeb22"},{url:"_app/immutable/chunks/D4k4vJAq.js",revision:"5a20b9bb7f3190d82acecae9f7474a5f"},{url:"_app/immutable/chunks/DhWqEYSG.js",revision:"d63f33db11cc8feb136dc335ee5579e6"},{url:"_app/immutable/chunks/DMqeO2by.js",revision:"8c6bb61cc5b27757b43e20bb7afebacf"},{url:"_app/immutable/chunks/ZAsNvhcv.js",revision:"d73ae903b6c7a41db3e3ae814f841ddb"},{url:"_app/immutable/entry/app.B4qkyNBA.js",revision:"e3c5be000fcaca3acb603b7084e714ce"},{url:"_app/immutable/entry/start.G0BxHlCH.js",revision:"0ec937c6ce1a39a9c827fab0569b0b5e"},{url:"_app/immutable/nodes/0.BuQ2TACW.js",revision:"3c77ef655fb1bfec5a80660adf856ed7"},{url:"_app/immutable/nodes/1.ChGskbNl.js",revision:"34874f87c4521051993bfd015ba6cc2e"},{url:"_app/immutable/nodes/2.jMzO1dKk.js",revision:"6902dccc932c8b6cf10d3e0dcdcfd991"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"favicon.png",revision:"ed607deb55535242aa419bde71d8dd2b"},{url:"manifest.webmanifest",revision:"a7522970b157bc88f6e166739490a8d6"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
