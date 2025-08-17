const express = require('express');
const router = express.Router();
const applicationModel = require('../models/applicationModel');

// Middleware to check if user is authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
}

// GET all applications for the logged-in user
router.get('/', ensureAuth, async (req, res) => {
  try {
    const apps = await applicationModel.getApplicationsByUser(req.user.id);
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single application
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const app = await applicationModel.getApplicationById(req.params.id, req.user.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new application
router.post('/', ensureAuth, async (req, res) => {
  try {
    const newApp = await applicationModel.createApplication({
      user_id: req.user.id,
      ...req.body,
    });
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update application
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    const updatedApp = await applicationModel.updateApplication(
      req.params.id,
      req.user.id,
      req.body
    );
    if (!updatedApp) return res.status(404).json({ message: 'Application not found' });
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE application
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await applicationModel.deleteApplication(req.params.id, req.user.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
