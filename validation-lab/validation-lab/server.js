const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const rules = require('./public/rules.js');

const app = express();
const PORT = process.env.PORT || 3000;
const users = new Map();

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register', async (req, res, next) => {
  try {
    const errors = {};
    Object.keys(rules).filter((key) => typeof rules[key] === 'function' && key !== 'normalizePhone').forEach((field) => {
      const message = rules[field](req.body?.[field]);
      if (message) errors[field] = message;
    });
    if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

    const email = req.body.email.trim().toLowerCase();
    if (users.has(email)) return res.status(409).json({ ok: false, errors: { email: 'Этот email уже зарегистрирован' } });

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name.trim(),
      email,
      age: Number(req.body.age),
      phone: rules.normalizePhone(req.body.phone),
      passwordHash
    };
    users.set(email, user);
    return res.status(201).json({ ok: true, user: { name: user.name, email: user.email, age: user.age, phone: user.phone } });
  } catch (error) { return next(error); }
});


app.use((err, req, res, next) => {
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ ok: false, errors: { body: 'Некорректный JSON' } });
  if (err?.type === 'entity.too.large') return res.status(413).json({ ok: false, errors: { body: 'Размер запроса превышает 10 КБ' } });
  return res.status(500).json({ ok: false, errors: { server: 'Внутренняя ошибка сервера' } });
});


app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
