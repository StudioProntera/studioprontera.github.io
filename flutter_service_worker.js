'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"404.html": "a96c3d2b3dbe3a118db415168c943ab9",
"assets/AssetManifest.bin": "269ab49c450cbbff937e2ba401046fac",
"assets/AssetManifest.bin.json": "53906125e48924e51f08ae5fe692c378",
"assets/AssetManifest.json": "1ed5d04e6a370189bd39cfc4c711b84f",
"assets/assets/fonts/NotoSans-Bold.ttf": "2ea5e0855d5a3ec3f561b5bc62b39805",
"assets/assets/fonts/NotoSans-Light.ttf": "1e81ec98e0668cbee241a1f0a0ab90ad",
"assets/assets/fonts/NotoSans-Medium.ttf": "a1311858ffd88b69aa5eadafd8f5c164",
"assets/assets/fonts/NotoSans-Regular.ttf": "f46b08cc90d994b34b647ae24c46d504",
"assets/assets/fonts/NotoSans-SemiBold.ttf": "f5a1e1476234ba356911d9b4e287e30d",
"assets/assets/fonts/NotoSansJP-Bold.ttf": "485e5ded4ecbe334b90b239f662c968b",
"assets/assets/fonts/NotoSansJP-Light.ttf": "daa12f424c62019044536d563cd3ab11",
"assets/assets/fonts/NotoSansJP-Medium.ttf": "90f49e4198daccead3dab1e56b598e3f",
"assets/assets/fonts/NotoSansJP-Regular.ttf": "d7b3c0ac56050de4c152bd8394a16c9a",
"assets/assets/fonts/NotoSansJP-SemiBold.ttf": "d3e5f9927153d02f5b42d1a863b39061",
"assets/assets/fonts/NotoSansKR-Bold.ttf": "315ddcf9a31dd6d7051f9f9cb3134cf6",
"assets/assets/fonts/NotoSansKR-Light.ttf": "c3e7124067e457534f24e33e850f91cd",
"assets/assets/fonts/NotoSansKR-Medium.ttf": "b8165f63b5501b9bcb376762fafadec2",
"assets/assets/fonts/NotoSansKR-Regular.ttf": "bec8dbb27b423cafdf3e921c590d65a2",
"assets/assets/fonts/NotoSansKR-SemiBold.ttf": "6929fa11db4b9b3f744f3307735c2dde",
"assets/assets/images/timeboxer_favicon_v0.1.png": "2ba033a21312ae1fa24502075da2d8d3",
"assets/assets/images/timeboxer_favicon_v2.svg": "11879e7c90a5536b11b6103391427c66",
"assets/assets/images/timeboxer_logo_v0.1.png": "114701ff47f8f41840e712ed3d6493dc",
"assets/assets/images/timeboxer_logo_v2.png": "19af27f7c5d677e3ce95345d2ce8f725",
"assets/assets/images/timeboxer_mockup_screen.png": "ae81907434c11f2cd8bcc898c4cb0a0d",
"assets/FontManifest.json": "d1e5b5da7cf8eca4c0184574ab88d080",
"assets/fonts/MaterialIcons-Regular.otf": "327bd0cf81b40bc2f8158937e060a34b",
"assets/NOTICES": "7b8d9ff624f50ff28ec0e994bc45c69e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"delete-account/index.html": "0dd9cd2960b0f19d876ca7e786e038fa",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"flutter_bootstrap.js": "bdabfd9d17681d83b7bd91bcfee21734",
"index.html": "ba00d32077eefd507c451bc0837aa790",
"/": "ba00d32077eefd507c451bc0837aa790",
"main.dart.js": "f924221001864dc9d26041d1af7b0b2d",
"version.json": "011fc31f7840af78c9e53923c19bd82d"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
