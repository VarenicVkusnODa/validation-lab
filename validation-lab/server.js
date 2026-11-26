const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-zА-Яа-яЁё]{2,}$/;
const NAME_RE = /^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z -]{1,49}$/;
const PHONE_RE = /^\+7\d{10}$/;

function normalizePhone(value) {
  return typeof value === 'string' ? value.replace(/[\s()-]/g, '') : '';
}


function validate(data = {}) {
  const errors = {};
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!NAME_RE.test(name)) {
    errors.name = 'Имя: от 2 до 50 символов, только буквы, пробел и дефис';
  }

  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (!EMAIL_RE.test(email) || email.length > 254) {
    errors.email = 'Email: формат user@example.ru';
  }

  const password = typeof data.password === 'string' ? data.password : '';
  if (
    password.length < 8 ||
    password.length > 72 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password)
  ) {
    errors.password = 'Пароль: от 8 до 72 символов, заглавная и строчная латинская буква, цифра';
  }

  const age = Number(data.age);
  if (!Number.isInteger(age) || age < 18 || age > 120) {
    errors.age = 'Возраст: целое число от 18 до 120';
  }

  const phone = normalizePhone(data.phone);
  if (!PHONE_RE.test(phone)) {
    errors.phone = 'Телефон: формат +7XXXXXXXXXX (11 цифр)';
  }

  return errors;
}


app.post('/api/register', (req, res) => {
  const errors = validate(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const { password, name, email, age, phone } = req.body;
  return res.status(201).json({
    ok: true,
    user: {
      name: name.trim(),
      email: email.trim(),
      age: Number(age),
      phone: normalizePhone(phone)
    }
  });
});


app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, errors: { body: 'Некорректный JSON' } });
  }
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, errors: { body: 'Размер запроса превышает 10 КБ' } });
  }
  return next(err);
});


app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
