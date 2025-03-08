
const express = require('express');
const router = express.Router();

// Get all resources
router.get('/', async (req, res, next) => {
  try {
    const { type, category } = req.query;
    
    const filter = {
      ...(type && type !== 'all' && { type }),
      ...(category && category !== 'all' && { category })
    };
    
    const resources = await req.prisma.resource.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// Get resource by ID
router.get('/:id', async (req, res, next) => {
  try {
    const resource = await req.prisma.resource.findUnique({
      where: { id: req.params.id }
    });
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Create new resource
router.post('/', async (req, res, next) => {
  try {
    const { title, description, content, imageUrl, url, type, category, tags } = req.body;
    
    if (!title || !description || !type || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const resource = await req.prisma.resource.create({
      data: {
        title,
        description,
        content,
        imageUrl,
        url,
        type,
        category,
        tags,
      }
    });
    
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
});

// Update resource
router.put('/:id', async (req, res, next) => {
  try {
    const { title, description, content, imageUrl, url, type, category, tags } = req.body;
    
    const resource = await req.prisma.resource.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(content && { content }),
        ...(imageUrl && { imageUrl }),
        ...(url && { url }),
        ...(type && { type }),
        ...(category && { category }),
        ...(tags && { tags }),
      }
    });
    
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Delete resource
router.delete('/:id', async (req, res, next) => {
  try {
    await req.prisma.resource.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
