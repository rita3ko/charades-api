!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){const r=n(1);function o(e){e=new URL(e);return gameId=/\/games\/(.*)\//gm.exec(e.pathname),null!==gameId&&(gameId=gameId[1]),gameId}addEventListener("fetch",e=>{e.respondWith(async function(e){const t=new r;return t.post(".*/games",()=>async function(){let e=function(){for(var e="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=t.length,r=0;r<15;r++)e+=t.charAt(Math.floor(Math.random()*n));return e}();console.log(e),await GAMES.put(e,"");let t={id:e};return new Response(JSON.stringify(t),{headers:{"content-type":"application/json","Access-Control-Allow-Origin":"*"},status:200,statusText:"ok"})}()),t.get(".*/games/.*/phrase",e=>async function(e){const t={headers:{"content-type":"application/json","Access-Control-Allow-Origin":"*"},status:200};let n=o(e.url),r=await PHRASES.list({prefix:n+"-"});if(r=r.keys,console.log(r),0==r.length)return new Response("Brainstorm and add some phrases to the game to get started! 💭",t);let s,a={used:!0,phrase:""};for(;a.used&&r.length>=1;){let e=Math.floor(Math.random()*(r.length-1));s=r[e],a=await PHRASES.get(s.name),a=JSON.parse(a),r.splice(e,1)}let i="";(r.length=a.used)?i="You've run out of phrases! Please add more":(i=a.phrase,a.used=!0,await PHRASES.put(s.name,JSON.stringify(a)));return new Response(i,t)}(e)),t.get("/games/.*",e=>async function(e){const t={headers:{"content-type":"application/json"},status:200};let n;gameId=o(e.url);let r=await GAMES.get(gameId);null==r?(n="No such game exists",t.status=400):n=JSON.stringify(r);return new Response(n,t)}(e)),t.post(".*/games/.*/phrase",e=>async function(e){let t=o(e.url),n=await e.text();n=n.split("=")[1];let r=await async function(e){const t=(new TextEncoder).encode(e),n=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(n)).map(e=>e.toString(16).padStart(2,"0")).join("")}(n),s=t+"-"+r,a={used:!1,phrase:n};console.log(n),console.log(a),a=JSON.stringify(a);await PHRASES.put(s,a);return new Response("noiiiice!",{headers:{"content-type":"application/json","Access-Control-Allow-Origin":"*"},status:200})}(e)),t.get("/",()=>new Response("Hello worker!")),await t.route(e)}(e.request))})},function(e,t){const n=e=>t=>t.method.toLowerCase()===e.toLowerCase(),r=n("connect"),o=n("delete"),s=n("get"),a=n("head"),i=n("options"),u=n("patch"),l=n("post"),c=n("put"),d=n("trace"),p=e=>t=>{const n=new URL(t.url).pathname;return(n.match(e)||[])[0]===n};e.exports=class{constructor(){this.routes=[]}handle(e,t){return this.routes.push({conditions:e,handler:t}),this}connect(e,t){return this.handle([r,p(e)],t)}delete(e,t){return this.handle([o,p(e)],t)}get(e,t){return this.handle([s,p(e)],t)}head(e,t){return this.handle([a,p(e)],t)}options(e,t){return this.handle([i,p(e)],t)}patch(e,t){return this.handle([u,p(e)],t)}post(e,t){return this.handle([l,p(e)],t)}put(e,t){return this.handle([c,p(e)],t)}trace(e,t){return this.handle([d,p(e)],t)}all(e){return this.handle([],e)}route(e){const t=this.resolve(e);return t?t.handler(e):new Response("resource not found",{status:404,statusText:"not found",headers:{"content-type":"text/plain"}})}resolve(e){return this.routes.find(t=>!(t.conditions&&(!Array.isArray(t)||t.conditions.length))||("function"==typeof t.conditions?t.conditions(e):t.conditions.every(t=>t(e))))}}}]);