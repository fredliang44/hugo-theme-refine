importScripts("https://blog.fredliang.cn/js/workbox/3.6.3/workbox-sw.js");

workbox.setConfig({
  modulePathPrefix: "https://blog.fredliang.cn/js/workbox/3.6.3/",
  debug: false,
});

const CACHE_PREFIX = "blog";

const PRECACHE_LIST = ["/", "/offline/", '{{ .Scratch.Get "jsHref"}}'];

const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "storage.fredliang.cn",
  "*.lzb.im",
];

workbox.setConfig({
  modulePathPrefix: "https://blog.fredliang.cn/js/workbox/3.6.3/",
});

workbox.core.setCacheNameDetails({ prefix: CACHE_PREFIX });

workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.suppressWarnings();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */

var networkFirstHandler = workbox.strategies.networkFirst({
  cacheName: "default",
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 10,
    }),
    new workbox.cacheableResponse.Plugin({
      statuses: [200],
    }),
  ],
});

const matcher = ({ event }) => event.request.mode === "navigate";
const handler = (args) =>
  networkFirstHandler
    .handle(args)
    .then((response) => (!response ? caches.match("/offline/") : response));

// active offline page
workbox.routing.registerRoute(matcher, handler);

workbox.routing.registerRoute(
  new RegExp(".*.(?:html|json)"),
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  new RegExp(".*.(?:js|css)"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "workbox:js",
  })
);

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "workbox:image",
  })
);

/** exclude big files
workbox.routing.registerRoute(
  new RegExp('https://storage\\.fredliang\\.cn/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'workbox:storage',
  })
);
**/

workbox.routing.registerRoute(
  new RegExp(
    "https://storage\\.fredliang\\.cn/.*?(?<!mp4|mov|mp4|avi|rmvb|wmv|mkv|flv)$"
  ),
  workbox.strategies.staleWhileRevalidate()
);

self.addEventListener("install", function (event) {
  console.log("installed!");
});

self.addEventListener("activate", function (event) {
  console.log("activated!");
});

workbox.precaching.precacheAndRoute(PRECACHE_LIST);

/**   @preserve  latest built at {{ now }} **/
