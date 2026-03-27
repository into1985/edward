(function () {
  if (sessionStorage.getItem('edwardLoaderSeen')) return;
  sessionStorage.setItem('edwardLoaderSeen', '1');

  var overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed',
    'inset:0',
    'background:#F5F0E8',
    'z-index:99999',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'opacity:1',
    'transition:opacity 1s ease'
  ].join(';');

  var img = document.createElement('img');
  img.src = '/assets/edward-juuksestuudio-logo.svg';
  img.style.cssText = 'width:160px;opacity:0;transition:opacity 0.7s ease';

  overlay.appendChild(img);
  document.body.appendChild(overlay);
  document.documentElement.style.opacity = '';
  setTimeout(function () {
    img.style.opacity = '1';
  }, 100);

  var timerDone = false;
  var fontsDone = false;

  function tryFadeOut() {
    if (!timerDone || !fontsDone) return;
    overlay.style.opacity = '0';
    setTimeout(function () { overlay.remove(); }, 1050);
  }

  setTimeout(function () { timerDone = true; tryFadeOut(); }, 2400);

  document.fonts.ready.then(function () { fontsDone = true; tryFadeOut(); });
})();
