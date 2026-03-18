// goofish_app_redirect: helper
function getQueryParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}

function openDeepLink(deepLink) {
  // iOS/Telegram WebView often requires a user gesture.
  // We'll still attempt, but provide a visible button.
  window.location.href = deepLink;
}

function wirePage() {
  const deepLink = getQueryParam('deep');
  const web = getQueryParam('web');
  const title = getQueryParam('title');

  const btn = document.getElementById('openApp');
  const copyBtn = document.getElementById('copyDeep');
  const webLink = document.getElementById('openWeb');
  const hint = document.getElementById('hint');
  const tEl = document.getElementById('title');

  if (title && tEl) tEl.textContent = title;

  if (web && webLink) {
    webLink.href = web;
    webLink.textContent = '若无法打开App：改用网页打开商品';
  }

  if (!deepLink) {
    if (hint) hint.textContent = '缺少 deep link 参数（deep=...）。请用生成器生成正确链接。';
    if (btn) btn.disabled = true;
    return;
  }

  if (btn) {
    btn.addEventListener('click', () => openDeepLink(deepLink));
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(deepLink);
        copyBtn.textContent = '已复制';
        setTimeout(() => (copyBtn.textContent = '复制App链接'), 1200);
      } catch (e) {
        alert('复制失败，请长按选择复制：\n' + deepLink);
      }
    });
  }

  // Optional auto-attempt (may be blocked). Keep it gentle.
  // We only try once shortly after load.
  setTimeout(() => {
    // Only attempt if user hasn't interacted yet.
    // Some WebViews will block; button remains.
    try { window.location.href = deepLink; } catch (e) {}
  }, 400);
}

document.addEventListener('DOMContentLoaded', wirePage);
