
const express = require('express');
const router = express.Router();

// Get all interviews
router.get('/', async (req, res, next) => {
  try {
    const interviews = await req.prisma.interview.findMany({
      include: { user: true }
    });
    res.json(interviews);
  } catch (error) {
    next(error);
  }
});

// Get interview by ID
router.get('/:id', async (req, res, next) => {
  try {
    const interview = await req.prisma.interview.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });
    
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    res.json(interview);
  } catch (error) {
    next(error);
  }
});

// Create new interview
router.post('/', async (req, res, next) => {
  try {
    const { type, date, time, userId, additionalInfo } = req.body;
    
    if (!type || !date || !time || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const interview = await req.prisma.interview.create({
      data: {
        type,
        date: new Date(date),
        time,
        userId,
        additionalInfo,
      }
    });
    
    res.status(201).json(interview);
  } catch (error) {
    next(error);
  }
});

// Update interview
router.put('/:id', async (req, res, next) => {
  try {
    const { type, date, time, additionalInfo, status } = req.body;
    
    const interview = await req.prisma.interview.update({
      where: { id: req.params.id },
      data: {
        ...(type && { type }),
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(additionalInfo && { additionalInfo }),
        ...(status && { status }),
      }
    });
    
    res.json(interview);
  } catch (error) {
    next(error);
  }
});

// Delete interview
router.delete('/:id', async (req, res, next) => {
  try {
    await req.prisma.interview.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
