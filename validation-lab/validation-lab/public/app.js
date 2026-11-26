const form = document.getElementById('registerForm');
const status = document.getElementById('status');

const validators = window.ValidationRules;

function showError(field, message) {
  const element = document.querySelector(`[data-error-for="${field}"]`);
  const input = form.elements[field];
  if (element) element.textContent = message;
  if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validateField(field) {
  const input = form.elements[field];
  const message = validators[field](input.value);
  showError(field, message);
  return message === '';
}


Object.keys(validators).forEach((field) => {
  form.elements[field].addEventListener('blur', () => validateField(field));
  form.elements[field].addEventListener('input', () => {
    if (form.elements[field].getAttribute('aria-invalid') === 'true') validateField(field);
  });
});


form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = '';
  status.className = 'status';

  const fields = Object.keys(validators);
  const allValid = fields.map(validateField).every(Boolean);
  if (!allValid) {
    status.textContent = 'Форма содержит ошибки — исправьте поля.';
    status.classList.add('status--error');
    return;
  }

  const payload = {};
  fields.forEach((field) => {
    payload[field] = form.elements[field].value;
  });

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (response.ok && data.ok) {
      status.textContent = `Успешно зарегистрирован пользователь: ${data.user.name}, ${data.user.email}`;
      status.classList.add('status--ok');
      form.reset();
      fields.forEach((field) => showError(field, ''));
    } else {
      Object.entries(data.errors || {}).forEach(([field, message]) => showError(field, message));
      status.textContent = response.status === 409 ? 'Этот email уже зарегистрирован.' : 'Сервер отклонил данные. Исправьте поля и повторите.';
      status.classList.add('status--error');
    }
  } catch (error) {
    status.textContent = 'Сервер недоступен. Запустите node server.js.';
    status.classList.add('status--error');
  }
});
