const CACHE_NAME = "nana-home-v1";

// 预缓存静态页面资源，API接口不走缓存
const ASSETS_TO_CACHE = [
  "/",
  "/index.html"
];

// 安装阶段缓存静态资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// 激活：清理旧版本缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
    ])
  );
});

// 请求拦截：API直接走网络；静态资源网络优先，断网读取缓存
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // 只处理 GET 请求
  if (req.method !== "GET") return;

  // 只处理 http/https 请求（跳过 chrome-extension 等）
  if (!req.url.startsWith("http")) return;

  // /api/ 后端接口永远不走缓存
  if (req.url.includes("/api/")) {
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith(
    fetch(req)
      .then(networkResponse => {
        // 只缓存成功的响应
        if (networkResponse && networkResponse.status === 200) {
          // 先克隆，再用克隆体存缓存（原 response 返回给页面）
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(req, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // 网络失败时从缓存读取
        return caches.match(req).then(cached => {
          return cached || caches.match("/index.html");
        });
      })
  );
});