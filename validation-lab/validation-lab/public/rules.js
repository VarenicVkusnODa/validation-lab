(function (root) {
  const rules = {
    name(value) {
      const normalized = typeof value === 'string' ? value.trim() : '';
      return /^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z -]{1,49}$/.test(normalized) ? '' : 'Имя: от 2 до 50 символов, только буквы, пробел и дефис';
    },
    email(value) {
      const normalized = typeof value === 'string' ? value.trim() : '';
      return /^[^\s@]+@[^\s@]+\.[A-Za-zА-Яа-яЁё]{2,}$/.test(normalized) && normalized.length <= 254 ? '' : 'Email: формат user@example.ru';
    },
    password(value) {
      const password = typeof value === 'string' ? value : '';
      return password.length >= 8 && password.length <= 72 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) ? '' : 'Пароль: от 8 до 72 символов, заглавная и строчная латинская буква, цифра';
    },
    age(value) {
      const age = Number(value);
      return Number.isInteger(age) && age >= 18 && age <= 120 ? '' : 'Возраст: целое число от 18 до 120';
    },
    phone(value) {
      const normalized = typeof value === 'string' ? value.replace(/[\s()-]/g, '') : '';
      return /^\+7\d{10}$/.test(normalized) ? '' : 'Телефон: формат +7XXXXXXXXXX (11 цифр)';
    },
    normalizePhone(value) {
      return typeof value === 'string' ? value.replace(/[\s()-]/g, '') : '';
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = rules;
  root.ValidationRules = rules;
})(typeof window !== 'undefined' ? window : globalThis);
