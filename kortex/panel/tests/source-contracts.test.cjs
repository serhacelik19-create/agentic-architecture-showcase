const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(file) {
  return fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
}

test('panel app notifications remain wired to parents attendance and trending APIs', () => {
  const source = read('src/App.tsx');

  assert.match(source, /api\.getParents\(\)/);
  assert.match(source, /api\.getAttendanceRisk\(\)/);
  assert.match(source, /api\.getTrendingStudents\(\)/);
  assert.match(source, /risk\.studentName/);
  assert.match(source, /risk\.riskLevel === 'High'/);
});

test('panel student list keeps student and class loading flow', () => {
  const source = read('src/StudentList.tsx');

  assert.match(source, /Promise\.all\(\[/);
  assert.match(source, /api\.getStudents\(\)/);
  assert.match(source, /api\.getClasses\(\)/);
  assert.match(source, /api\.createStudent\(newStudent\)/);
  assert.match(source, /api\.updateStudent\(editingStudent\.id, editingStudent\)/);
  assert.match(source, /api\.deleteStudent\(id\)/);
});

test('panel attendance screen keeps bulk attendance and risk flows', () => {
  const source = read('src/Attendance.tsx');

  assert.match(source, /api\.getAttendance\(date\)/);
  assert.match(source, /api\.getClasses\(\)/);
  assert.match(source, /api\.getAttendanceRisk\(\)/);
  assert.match(source, /api\.updateAttendance\(\{ studentId, date, status \}\)/);
  assert.match(source, /api\.bulkAttendance\(\{ date, studentIds, status: 'geldi' \}\)/);
  assert.match(source, /window\.open\(url, '_blank'\)/);
});

test('panel api client exposes critical feature methods', () => {
  const source = read('src/api.ts');

  [
    'getDashboardStats',
    'getTrendingStudents',
    'getParents',
    'batchGenerateReports',
    'getBatchSuggestIntro',
    'getAttendanceRisk',
    'bulkUploadExams',
    'updateInstitutionSettings',
    'getWhatsAppNumbers',
  ].forEach((method) => {
    assert.match(source, new RegExp(`${method}: async \\(`));
  });
});
