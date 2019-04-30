importScripts('https://g.alicdn.com/kg/workbox/3.6.3/workbox-sw.js');

workbox.setConfig({
  modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.6.3/',
  debug: false
});

const CACHE_PREFIX = 'blog'

const PRECACHE_LIST = [
    "/",
    "/offline/",
    "/css/refine.min.css"
]

const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "storage.fredliang.cn",
]

workbox.setConfig({
  modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.6.3/'
});

workbox.core.setCacheNameDetails({prefix: CACHE_PREFIX});

workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.suppressWarnings();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */

workbox.precaching.precacheAndRoute(PRECACHE_LIST);

var networkFirstHandler = workbox.strategies.networkFirst({
    cacheName: 'default',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200]
      })
    ]
  });
const matcher = ({event}) => event.request.mode === 'navigate';
const handler = (args) => networkFirstHandler.handle(args).then((response) => (!response) ? caches.match('/offline/') : response);
// active offline page
workbox.routing.registerRoute(matcher, handler);

// html的缓存策略
workbox.routing.registerRoute(
  new RegExp('.*\.(?:html|json)'),
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  new RegExp('.*\.(?:js|css)'),
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('https://stroage\.fredliang.\.cn/'),
  workbox.strategies.staleWhileRevalidate()
);

self.addEventListener('install', function(event){
  console.log('installed!');
})

self.addEventListener('activate', function(event){
  console.log('activated!');
});
