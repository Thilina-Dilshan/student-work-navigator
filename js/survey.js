// =====================================================================
// Survey / feedback form 
// =====================================================================

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyHNB93GXuUe_fxizWe5kRFjfZtCvpyNZggw6EWBqdAfT65E8yWR_ew7SQbxMr79uiQ/exec";

document.addEventListener('DOMContentLoaded', function () {
  // ---- Star rating widget ----
  var stars = document.querySelectorAll('.rating-star');
  var ratingInput = document.getElementById('rating');
  stars.forEach(function (star) {
    star.addEventListener('click', function () {
      var val = parseInt(star.getAttribute('data-value'), 10);
      ratingInput.value = val;
      stars.forEach(function (s) {
        s.classList.toggle('active', parseInt(s.getAttribute('data-value'), 10) <= val);
      });
    });
  });

  // ---- Form submit ----
  var form = document.getElementById('feedback-form');
  var statusBox = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.indexOf('PASTE_YOUR') === 0) {
        showStatus('This form is not connected to Data Base yet. Contact the Developer via https://github.com/Thilina-Dilshan', 'err');
        return;
      }

      var payload = {
        name: document.getElementById('f-name').value.trim(),
        country: document.getElementById('f-country').value.trim(),
        program: document.getElementById('f-program').value.trim(),
        jobType: document.getElementById('f-jobtype').value,
        rating: ratingInput.value || '',
        message: document.getElementById('f-message').value.trim(),
        timestamp: new Date().toISOString()
      };

      if (!payload.name || !payload.message) {
        showStatus('Please add at least your name and a short message.', 'err');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          showStatus('Thank you! Your feedback has been saved.', 'ok');
          form.reset();
          stars.forEach(function (s) { s.classList.remove('active'); });
          ratingInput.value = '';
          loadRecentFeedback();
        })
        .catch(function (err) {
          showStatus('Something went wrong sending your feedback. Please try again later.', 'err');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Feedback';
        });
    });
  }

  function showStatus(msg, type) {
    if (!statusBox) return;
    statusBox.textContent = msg;
    statusBox.className = 'form-status show ' + type;
  }

  // ---- Load recent feedback (optional live results) ----
  function loadRecentFeedback() {
    var list = document.getElementById('recent-feedback');
    if (!list || !APPS_SCRIPT_URL || APPS_SCRIPT_URL.indexOf('PASTE_YOUR') === 0) return;

    fetch(APPS_SCRIPT_URL, { method: 'GET' })
      .then(function (res) { return res.json(); })
      .then(function (rows) {
        if (!Array.isArray(rows) || rows.length === 0) return;
        list.innerHTML = '';
        rows.slice(-9).reverse().forEach(function (row) {
          var card = document.createElement('div');
          card.className = 'testi-card';
          var stars = '\u2605'.repeat(Number(row.rating) || 0) + '\u2606'.repeat(5 - (Number(row.rating) || 0));
          card.innerHTML =
            '<div class="testi-quote">\u201C</div>' +
            '<p class="msg"></p>' +
            '<div class="testi-name"></div>' +
            '<div style="font-size:.78rem;color:var(--text-muted);margin-top:2px;">' + stars + '</div>';
          card.querySelector('.msg').textContent = row.message || '';
          card.querySelector('.testi-name').textContent =
            (row.name || 'Anonymous') + (row.country ? (', ' + row.country) : '');
          list.appendChild(card);
        });
      })
      .catch(function () { /* silently ignore - keep static content */ });
  }

  loadRecentFeedback();
});
