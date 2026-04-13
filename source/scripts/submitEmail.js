document.getElementById('submit-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('project-description').value.trim();
  const status = document.getElementById('form-status');
  const btn = document.getElementById('submit-btn');
  const key = document.getElementById('contact-form').dataset.w3fKey;

  // Client-side guard
  if (!email || !message) {
    status.textContent = 'Please fill in both fields.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.textContent = '';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_key: key, email, message })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      status.textContent = 'Sent. We\'ll be in touch.';
      status.style.color = '#3d3d3d';
      btn.disabled = false;
      btn.textContent = 'Send';
      document.getElementById('email').value = '';
      document.getElementById('project-description').value = '';
    } else {
      status.textContent = data.message || 'Something went wrong. Try the email link below.';
      status.style.color = "#c8392b";
      btn.disabled = false;
      btn.textContent = 'Send';
    }
  } catch {
    status.textContent = 'Network error. Try the email link below.';
    status.style.color = "#c8392b";
    btn.disabled = false;
    btn.textContent = 'Send';
  }
});