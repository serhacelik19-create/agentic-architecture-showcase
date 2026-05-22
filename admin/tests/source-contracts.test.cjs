const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(file) {
  return fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
}

test('login remains restricted to the super admin flow', () => {
  const source = read('src/Login.tsx');

  assert.match(source, /adminApi\.login\(username, password\)/);
  assert.match(source, /response\.user\.role === 'super_admin'/);
});

test('app focuses on institution, user and maintenance management', () => {
  const source = read('src/App.tsx');

  assert.match(source, /Bakim Modlari/);
  assert.match(source, /Kurum Yonetimi/);
  assert.match(source, /Kullanici Yonetimi/);
  assert.match(source, /Kurum erisimi ve notlar/);
  assert.match(source, /Admin Sifresi Sifirla/);
  assert.match(source, /handleToggleInstitutionPanelAccess/);
  assert.match(source, /adminApi\.getSystemSettings\(\)/);
  assert.match(source, /adminApi\.updateSystemSettings\(systemSettings\)/);
});

test('api client exposes institution control and maintenance endpoints', () => {
  const source = read('src/api.ts');

  assert.match(source, /getSystemSettings: async \(\)/);
  assert.match(source, /updateSystemSettings: async \(data: unknown\)/);
  assert.match(source, /updateInstitutionSettings: async \(id: number, data: unknown\)/);
  assert.match(source, /resetInstitutionAdminPassword: async \(id: number, password: string\)/);
});
