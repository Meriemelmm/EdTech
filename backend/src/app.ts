import express from 'express';

import authRoutes from './routes/AuthRoute';
import userRoutes from './routes/userRoutes';
import classRoutes from './routes/classRoutes';
import studentRoute from './routes/studentRoute';
import subjectRoute from './routes/subjectRoute'

const app = express();

// ⚠️ MIDDLEWARES GLOBAUX - AVANT LES ROUTES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/whoami', (req, res) => {
  res.json({ app: 'main app' });
});


// ✅ ROUTES
console.log('📦 Chargement des routes...');
app.use('/auth', authRoutes);
console.log('✅ Routes /auth chargées');

app.use('/api/users', userRoutes);


app.use('/api/classes', classRoutes);
app.use('/api/student', studentRoute);
app.use('/api/subject',subjectRoute)
// console.log('✅ Routes /classes chargées');


// 404 - DOIT ÊTRE APRÈS TOUTES LES ROUTES


const PORT = process.env.PORT || 3000;


export default app;