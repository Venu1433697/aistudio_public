const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/usersController');

router.get('/', auth, getAllUsers);
router.post('/', auth, createUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;
