import express from 'express';

const router = express.Router();

router.get('', (req, res) => {
  console.log(req.user);
  res.send('Hi');
});

export default router;
