const express = require('express');
const db = require('../src/config/db');
const authRouter = require('../src/routes/login');          
const userRouter = require('../src/routes/users');         
const authenticateToken = require('../src/middlewares/authmiddle'); 
const campaignRouter = require('./routes/campaign');
const donationRouter = require('./routes/donation');
const milestoneRouter = require('./routes/milestones');
const milestoneReportRouter = require('./routes/milestoneReports');
const milestoneVerificationRouter = require('./routes/milestoneVerifications');
const disbursementRouter = require('./routes/disbursements');
const dashboardRouter = require('./routes/dashboard');

const app = express();
const port = 5000;
console.log('MIDDLEWARE LOADED:', authenticateToken ? 'OK' : 'FAIL');
app.use(express.json());

app.get('/test-db', (req, res) => {
  res.json({ message: 'TEST-DB OK!' });
});

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/campaign', campaignRouter);
app.use('/donations', donationRouter);
app.use('/milestones', milestoneRouter);
app.use('/milestone-reports', milestoneReportRouter);
app.use('/milestone-verifications', milestoneVerificationRouter);
app.use('/disbursements', disbursementRouter);
app.use('/dashboard', dashboardRouter);

app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});