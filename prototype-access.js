(function () {
  "use strict";

  var STORAGE_KEY = "tracken_prototype_access_v1";
  var EXPECTED_LOGIN = "tracken";
  var EXPECTED_PASSWORD = "TRACKen@2026#";
  var root = document.documentElement;

  function hasAccess() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === "granted";
    } catch (error) {
      return false;
    }
  }

  if (hasAccess()) return;

  root.classList.add("prototype-auth-pending");

  var style = document.createElement("style");
  style.id = "prototype-access-style";
  style.textContent = [
    "html.prototype-auth-pending, html.prototype-auth-pending body { min-height: 100%; background: #050505 !important; }",
    "html.prototype-auth-pending body { overflow: hidden !important; }",
    "html.prototype-auth-pending body > *:not(#prototype-access-gate) { display: none !important; }",
    "#prototype-access-gate { position: fixed; inset: 0; z-index: 2147483647; display: grid; place-items: center; box-sizing: border-box; padding: 24px; background: #050505; color: #fff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }",
    "#prototype-access-gate * { box-sizing: border-box; }",
    ".prototype-access-card { width: min(100%, 380px); }",
    ".prototype-access-brand { margin: 0 0 44px; color: #fff; font-size: 25px; font-weight: 800; letter-spacing: -.04em; text-align: center; }",
    ".prototype-access-brand span { color: #42c829; }",
    ".prototype-access-title { margin: 0 0 8px; font-size: 20px; font-weight: 700; text-align: center; }",
    ".prototype-access-copy { margin: 0 0 28px; color: #8f8f8f; font-size: 14px; line-height: 1.5; text-align: center; }",
    ".prototype-access-field { display: block; margin-bottom: 16px; }",
    ".prototype-access-field span { display: block; margin-bottom: 8px; color: #b8b8b8; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }",
    ".prototype-access-input-wrap { position: relative; }",
    ".prototype-access-field input { width: 100%; height: 52px; border: 1px solid #303030; border-radius: 8px; outline: none; background: #111; color: #fff; padding: 0 15px; font: inherit; transition: border-color .18s, box-shadow .18s; }",
    ".prototype-access-field input::placeholder { color: #666; }",
    ".prototype-access-field input:focus { border-color: #42c829; box-shadow: 0 0 0 3px rgba(66, 200, 41, .14); }",
    ".prototype-access-password { padding-right: 66px !important; }",
    ".prototype-access-toggle { position: absolute; top: 50%; right: 12px; transform: translateY(-50%); border: 0; background: transparent; color: #8f8f8f; padding: 6px; font: 600 12px/1 inherit; cursor: pointer; }",
    ".prototype-access-toggle:hover, .prototype-access-toggle:focus-visible { color: #fff; outline: none; }",
    ".prototype-access-error { min-height: 20px; margin: -4px 0 12px; color: #ff6b6b; font-size: 13px; }",
    ".prototype-access-submit { width: 100%; height: 52px; border: 0; border-radius: 8px; background: #42c829; color: #071104; font: 800 15px/1 inherit; cursor: pointer; transition: background .18s, transform .18s; }",
    ".prototype-access-submit:hover { background: #52dc38; }",
    ".prototype-access-submit:active { transform: translateY(1px); }",
    ".prototype-access-footer { margin: 24px 0 0; color: #626262; font-size: 12px; text-align: center; }"
  ].join("");
  document.head.appendChild(style);

  function unlock() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "granted");
    } catch (error) {
      // O acesso continua válido para a página atual quando o storage não está disponível.
    }
    var gate = document.getElementById("prototype-access-gate");
    if (gate) gate.remove();
    root.classList.remove("prototype-auth-pending");
    style.remove();
  }

  function mount() {
    var gate = document.createElement("div");
    gate.id = "prototype-access-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "prototype-access-title");
    gate.innerHTML = [
      '<main class="prototype-access-card">',
      '<p class="prototype-access-brand">TRACK<span>en</span></p>',
      '<h1 class="prototype-access-title" id="prototype-access-title">Acesso ao protótipo</h1>',
      '<p class="prototype-access-copy">Entre com suas credenciais para continuar.</p>',
      '<form id="prototype-access-form">',
      '<label class="prototype-access-field"><span>Login</span><input id="prototype-access-login" name="username" type="text" autocomplete="username" placeholder="Digite seu login" required /></label>',
      '<label class="prototype-access-field"><span>Senha</span><span class="prototype-access-input-wrap"><input class="prototype-access-password" id="prototype-access-password" name="password" type="password" autocomplete="current-password" placeholder="Digite sua senha" required /><button class="prototype-access-toggle" id="prototype-access-toggle" type="button" aria-label="Mostrar senha">Mostrar</button></span></label>',
      '<p class="prototype-access-error" id="prototype-access-error" role="alert" aria-live="polite"></p>',
      '<button class="prototype-access-submit" type="submit">Entrar</button>',
      '</form>',
      '<p class="prototype-access-footer">Acesso restrito · Protótipo TRACKen</p>',
      '</main>'
    ].join("");
    document.body.prepend(gate);

    var form = document.getElementById("prototype-access-form");
    var login = document.getElementById("prototype-access-login");
    var password = document.getElementById("prototype-access-password");
    var toggle = document.getElementById("prototype-access-toggle");
    var errorMessage = document.getElementById("prototype-access-error");

    toggle.addEventListener("click", function () {
      var show = password.type === "password";
      password.type = show ? "text" : "password";
      toggle.textContent = show ? "Ocultar" : "Mostrar";
      toggle.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
      password.focus();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var loginMatches = login.value.trim().toLowerCase() === EXPECTED_LOGIN;
      var passwordMatches = password.value === EXPECTED_PASSWORD;

      if (loginMatches && passwordMatches) {
        unlock();
        return;
      }

      errorMessage.textContent = "Login ou senha inválidos.";
      password.value = "";
      password.focus();
    });

    login.addEventListener("input", function () { errorMessage.textContent = ""; });
    password.addEventListener("input", function () { errorMessage.textContent = ""; });
    login.focus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
