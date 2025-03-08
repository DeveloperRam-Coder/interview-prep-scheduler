
const express = require('express');
const router = express.Router();

// Get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await req.prisma.user.findMany({
      include: { skills: true }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.params.id },
      include: { 
        skills: true, 
        interviews: true 
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Create new user
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, jobTitle, location, bio, github, linkedin, skills } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Check if user with email already exists
    const existingUser = await req.prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Process skills - connect existing or create new ones
    let skillsData = [];
    if (skills && skills.length > 0) {
      skillsData = skills.map(skill => {
        return {
          connectOrCreate: {
            where: { name: skill },
            create: { name: skill }
          }
        };
      });
    }
    
    const user = await req.prisma.user.create({
      data: {
        name,
        email,
        phone,
        jobTitle,
        location,
        bio,
        github,
        linkedin,
        skills: {
          ...(skillsData.length > 0 && { connect: skillsData })
        }
      },
      include: { skills: true }
    });
    
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, phone, jobTitle, location, bio, github, linkedin, skills } = req.body;
    
    // Process skills if provided
    let skillsData = undefined;
    if (skills && skills.length > 0) {
      // First disconnect all existing skills
      await req.prisma.user.update({
        where: { id: req.params.id },
        data: {
          skills: {
            set: []
          }
        }
      });
      
      // Then connect or create new skills
      skillsData = {
        connect: skills.map(skill => ({
          connectOrCreate: {
            where: { name: skill },
            create: { name: skill }
          }
        }))
      };
    }
    
    const user = await req.prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(jobTitle !== undefined && { jobTitle }),
        ...(location !== undefined && { location }),
        ...(bio !== undefined && { bio }),
        ...(github !== undefined && { github }),
        ...(linkedin !== undefined && { linkedin }),
        ...(skillsData && { skills: skillsData })
      },
      include: { skills: true }
    });
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    // Delete all interviews associated with this user
    await req.prisma.interview.deleteMany({
      where: { userId: req.params.id }
    });
    
    // Delete the user
    await req.prisma.user.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
