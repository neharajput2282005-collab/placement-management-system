// server.js - Main Backend Server
const express = require('express');
const cors    = require('cors');
const db      = require('./db');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🎓 Placement Management System API is running!' });
});

// ═════════════════════════════════════════
//  STUDENTS
// ═════════════════════════════════════════

// GET all students
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM Student ORDER BY full_name', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single student
app.get('/api/students/:id', (req, res) => {
  db.query('SELECT * FROM Student WHERE student_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(results[0]);
  });
});

// POST add student
app.post('/api/students', (req, res) => {
  const { student_id, full_name, email, phone, dob, gender, branch, batch_year, cgpa, backlogs, address, uid } = req.body;
  const sql = `INSERT INTO Student (student_id, full_name, email, phone, dob, gender, branch, batch_year, cgpa, backlogs, address, uid)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [student_id, full_name, email, phone, dob, gender, branch, batch_year, cgpa, backlogs, address, uid], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Student added successfully', student_id });
  });
});

// PUT update student
app.put('/api/students/:id', (req, res) => {
  const { full_name, email, phone, cgpa, backlogs, branch } = req.body;
  const sql = `UPDATE Student SET full_name=?, email=?, phone=?, cgpa=?, backlogs=?, branch=? WHERE student_id=?`;
  db.query(sql, [full_name, email, phone, cgpa, backlogs, branch, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Student updated successfully' });
  });
});

// DELETE student
app.delete('/api/students/:id', (req, res) => {
  db.query('DELETE FROM Student WHERE student_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Student deleted successfully' });
  });
});

// ═════════════════════════════════════════
//  COMPANIES
// ═════════════════════════════════════════

// GET all companies
app.get('/api/companies', (req, res) => {
  db.query('SELECT * FROM Company ORDER BY company_name', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST add company
app.post('/api/companies', (req, res) => {
  const { company_name, industry, website, hr_contact_name, hr_email, hr_phone, address, description } = req.body;
  const sql = `INSERT INTO Company (company_name, industry, website, hr_contact_name, hr_email, hr_phone, address, description)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [company_name, industry, website, hr_contact_name, hr_email, hr_phone, address, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Company added successfully', company_id: result.insertId });
  });
});

// DELETE company
app.delete('/api/companies/:id', (req, res) => {
  db.query('DELETE FROM Company WHERE company_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Company deleted' });
  });
});

// ═════════════════════════════════════════
//  JOB OPENINGS
// ═════════════════════════════════════════

// GET all jobs with company name
app.get('/api/jobs', (req, res) => {
  const sql = `SELECT j.*, c.company_name FROM Job_Opening j
               JOIN Company c ON j.company_id = c.company_id
               ORDER BY j.drive_date DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST add job
app.post('/api/jobs', (req, res) => {
  const { company_id, job_title, job_type, location, package_lpa, min_cgpa, max_backlogs, eligible_branches, application_deadline, drive_date, description } = req.body;
  const sql = `INSERT INTO Job_Opening (company_id, job_title, job_type, location, package_lpa, min_cgpa, max_backlogs, eligible_branches, application_deadline, drive_date, description)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [company_id, job_title, job_type, location, package_lpa, min_cgpa, max_backlogs, eligible_branches, application_deadline, drive_date, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Job added successfully', job_id: result.insertId });
  });
});

// DELETE job
app.delete('/api/jobs/:id', (req, res) => {
  db.query('DELETE FROM Job_Opening WHERE job_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Job deleted' });
  });
});

// ═════════════════════════════════════════
//  APPLICATIONS
// ═════════════════════════════════════════

// GET all applications with student + job info
app.get('/api/applications', (req, res) => {
  const sql = `SELECT a.*, s.full_name, s.branch, s.cgpa, j.job_title, c.company_name
               FROM Application a
               JOIN Student s ON a.student_id = s.student_id
               JOIN Job_Opening j ON a.job_id = j.job_id
               JOIN Company c ON j.company_id = c.company_id
               ORDER BY a.applied_on DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST apply for a job
app.post('/api/applications', (req, res) => {
  const { student_id, job_id } = req.body;
  db.query('INSERT INTO Application (student_id, job_id) VALUES (?, ?)', [student_id, job_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Application submitted', application_id: result.insertId });
  });
});

// PUT update application status
app.put('/api/applications/:id', (req, res) => {
  const { status, remarks } = req.body;
  db.query('UPDATE Application SET status=?, remarks=? WHERE application_id=?', [status, remarks, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Application status updated' });
  });
});

// ═════════════════════════════════════════
//  PLACEMENT RESULTS
// ═════════════════════════════════════════

// GET all placement results
app.get('/api/results', (req, res) => {
  const sql = `SELECT pr.*, s.full_name, s.branch, j.job_title, c.company_name, pr.package_offered
               FROM Placement_Result pr
               JOIN Student s ON pr.student_id = s.student_id
               JOIN Job_Opening j ON pr.job_id = j.job_id
               JOIN Company c ON pr.company_id = c.company_id
               ORDER BY pr.offer_date DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST add placement result
app.post('/api/results', (req, res) => {
  const { student_id, job_id, company_id, offer_date, joining_date, package_offered } = req.body;
  const sql = `INSERT INTO Placement_Result (student_id, job_id, company_id, offer_date, joining_date, package_offered)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [student_id, job_id, company_id, offer_date, joining_date, package_offered], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Placement result added', result_id: result.insertId });
  });
});

// ═════════════════════════════════════════
//  DASHBOARD STATS
// ═════════════════════════════════════════

app.get('/api/stats', (req, res) => {
  const queries = {
    totalStudents:  'SELECT COUNT(*) AS count FROM Student',
    totalCompanies: 'SELECT COUNT(*) AS count FROM Company',
    totalJobs:      'SELECT COUNT(*) AS count FROM Job_Opening WHERE status="Open"',
    totalPlaced:    'SELECT COUNT(*) AS count FROM Placement_Result WHERE status="Placed"',
    avgPackage:     'SELECT ROUND(AVG(package_offered),2) AS avg FROM Placement_Result WHERE status="Placed"',
    branchStats:    `SELECT branch, COUNT(*) AS placed FROM Placement_Result pr
                     JOIN Student s ON pr.student_id = s.student_id
                     WHERE pr.status='Placed' GROUP BY branch`
  };

  const stats = {};
  let done = 0;
  const total = Object.keys(queries).length;

  for (const [key, sql] of Object.entries(queries)) {
    db.query(sql, (err, results) => {
      if (err) { stats[key] = null; }
      else {
        stats[key] = key === 'branchStats' ? results :
                     key === 'avgPackage'  ? results[0].avg :
                     results[0].count;
      }
      if (++done === total) res.json(stats);
    });
  }
});

// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
