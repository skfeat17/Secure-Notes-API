const express = require('express');
const router = express.Router();
const { sign_up,log_in } = require('../controllers/authControllers');
const {profile,createNote,getNote ,putNote,deleteNote} = require('../controllers/utilityController')
router.post('/signup', sign_up);
router.post('/login', log_in);
router.post('/note/create', createNote);
router.get('/note/get', getNote);
router.put('/note/put',putNote)
router.delete('/note/delete',deleteNote)
router.get('/profile',profile);
module.exports = router;
