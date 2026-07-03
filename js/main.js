// ===== Mobile nav toggle =====
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // ===== Modal popups (data-modal-target / data-modal-close) =====
  document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var id = trigger.getAttribute('data-modal-open');
      var modal = document.getElementById(id);
      if (modal) modal.classList.add('open');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.classList.remove('open');
    });
    overlay.querySelectorAll('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { overlay.classList.remove('open'); });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (o) {
        o.classList.remove('open');
      });
    }
  });
});
