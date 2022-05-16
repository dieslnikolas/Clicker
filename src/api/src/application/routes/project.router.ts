//express imports
import express = require('express');
export const router = express.Router();

//Routes
router.get(``, (req, res) => { return `helo` });
// router.put(`${base}/:id`, (req, res) => { projectController.putFunction(req, res) })
// router.delete(`${base}/:id`, (req, res) => { projectController.deleteById(res, req.params.id)})
// base}/:id`, (req, res) => { projectController.findById(res, req.params.id)})

