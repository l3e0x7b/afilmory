export function generateGateHtml(options: {
  siteName: string
  redirectTo: string
  lang: 'en' | 'zh-CN'
  t: {
    subtitle: string
    placeholder: string
    enter: string
    error: string
    lockout: string
  }
}): string {
  const { siteName, redirectTo, lang, t } = options

  return `<!doctype html>
<html lang="${lang}" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(siteName)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=optional" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:#1c1c1e;
  background-image:radial-gradient(ellipse at 20% 50%,rgba(0,122,255,0.15) 0%,transparent 50%),radial-gradient(ellipse at 80% 50%,rgba(0,122,255,0.08) 0%,transparent 50%);
  font-family:'Geist',ui-sans-serif,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased
}
.gate-card{
  width:min(360px,calc(100% - 2.5rem));padding:2.5rem;display:flex;flex-direction:column;align-items:center;gap:1.5rem;
  background-color:rgba(28,28,30,0.75);
  background-image:linear-gradient(to bottom right,rgba(28,28,30,0.98),rgba(28,28,30,0.95));
  border:1px solid rgba(0,122,255,0.2);border-radius:1.25rem;
  backdrop-filter:blur(24px);
  position:relative;
  box-shadow:0 8px 32px rgba(0,122,255,0.08),0 4px 16px rgba(0,122,255,0.06),0 2px 8px rgba(0,0,0,0.1)
}
@media(max-width:480px){.gate-card{padding:1.5rem}}
@media(max-width:360px){
  .gate-card{padding:1.25rem}
  .gate-title{font-size:1.125rem}
  .gate-subtitle{font-size:0.8125rem}
}
.gate-card-inner-glow{
  pointer-events:none;position:absolute;inset:0;border-radius:1.25rem;
  background:linear-gradient(to bottom right,rgba(0,122,255,0.05),transparent,rgba(0,122,255,0.05))
}
.gate-icon{
  width:3rem;height:3rem;border-radius:1rem;background:rgba(255,255,255,0.06);
  backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 12px rgba(0,0,0,0.3)
}
.gate-icon svg{width:18px;height:18px;stroke:rgba(255,255,255,0.7);stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
.gate-title{font-size:1.25rem;font-weight:600;color:rgba(255,255,255,0.9);letter-spacing:-0.01em}
.gate-subtitle{font-size:0.875rem;color:rgba(255,255,255,0.5);margin-top:-1rem}
.gate-form{width:100%;display:flex;flex-direction:column;gap:0.75rem}
@keyframes gate-spin{to{transform:rotate(360deg)}}
.gate-spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:gate-spin 0.6s linear infinite;vertical-align:middle}
.gate-input{width:100%;box-sizing:border-box;padding:0.75rem 1rem;border:1px solid rgba(0,122,255,0.15);border-radius:0.75rem;background:rgba(0,122,255,0.05);color:rgba(255,255,255,0.9);font-size:0.875rem;outline:none;transition:border-color 0.2s,box-shadow 0.2s}
.gate-input:focus{border-color:rgba(0,122,255,0.4);box-shadow:0 0 0 3px rgba(0,122,255,0.15)}
.gate-input::placeholder{color:rgba(255,255,255,0.3)}
.gate-button{width:100%;box-sizing:border-box;height:2.75rem;display:inline-flex;align-items:center;justify-content:center;padding:0.75rem 1rem;border:1px solid transparent;border-radius:0.75rem;background:#007aff;color:#fff;font-size:0.875rem;font-weight:500;cursor:pointer;transition:background 0.2s,opacity 0.2s}
.gate-button:hover{background:#0a84ff}
.gate-button:disabled,.gate-input:disabled{opacity:0.5;cursor:default}
.gate-error{
  position:absolute;left:0;right:0;bottom:0.68rem;
  margin:0;padding:0;line-height:1.4;font-size:0.8125rem;
  color:#f87171;text-align:center;pointer-events:none
}
@media(max-width:480px){.gate-error{bottom:0.18rem}}
@media(max-width:360px){.gate-error{bottom:0.06rem}}
</style>
</head>
<body>
<div class="gate-card">
<div class="gate-card-inner-glow"></div>
<div class="gate-icon"><svg viewBox="0 0 24 24"><path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg></div>
<h1 class="gate-title">${escapeHtml(siteName)}</h1>
<p class="gate-subtitle">${t.subtitle}</p>
<form class="gate-form" id="gate-form">
<input type="hidden" name="redirect" value="${escapeAttr(redirectTo)}">
<input type="password" name="password" class="gate-input" placeholder="${t.placeholder}" autofocus aria-label="${t.placeholder}" id="password-input">
<button type="submit" class="gate-button" id="submit-btn" disabled>${t.enter}</button>
</form>
<p class="gate-error" id="password-error" role="alert" style="opacity:0">${t.error}</p>
</div>
<script>
(function(){
  var f=document.getElementById('gate-form'),
      b=document.getElementById('submit-btn'),
      i=document.getElementById('password-input'),
      p=document.getElementById('password-error'),
      submitting=false;
  function u(){b.disabled=submitting||!i.value.length;i.disabled=submitting}
  function e(m){
    if(m&&!submitting){p.textContent=m;p.style.opacity='1';i.setAttribute('aria-invalid','true');i.setAttribute('aria-describedby','password-error')}
    else{p.style.opacity='0';i.removeAttribute('aria-invalid');i.removeAttribute('aria-describedby')}
  }
  i.addEventListener('input',function(){u();if(!i.value.length)e('')});
  u();
  f.addEventListener('submit',function(h){
    h.preventDefault();var d=new FormData(f);submitting=true;u();e('');b.innerHTML='<span class="gate-spinner"></span>';
    fetch('/api/verify-password',{method:'POST',body:d}).then(function(r){return r.json()}).then(function(j){
      if(j&&j.redirectTo){window.location.replace(j.redirectTo);return}
      submitting=false;u();b.textContent=${JSON.stringify(t.enter)};
      e(j&&j.lockout?${JSON.stringify(t.lockout)}:j&&j.error?${JSON.stringify(t.error)}:'')
    }).catch(function(){submitting=false;u();b.textContent=${JSON.stringify(t.enter)}})
  })
})();
</script>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
