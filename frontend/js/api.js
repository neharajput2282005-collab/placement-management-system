// js/api.js — shared API helper
const BASE = 'http://localhost:5000/api';

const api = {
  get:    (path)         => fetch(BASE + path).then(r => r.json()),
  post:   (path, data)   => fetch(BASE + path, { method:'POST',   headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  put:    (path, data)   => fetch(BASE + path, { method:'PUT',    headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  delete: (path)         => fetch(BASE + path, { method:'DELETE' }).then(r => r.json()),
};

// Mark active sidebar link
document.querySelectorAll('.nav-item').forEach(link => {
  if (link.href === window.location.href) link.classList.add('active');
  else link.classList.remove('active');
});
