import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import hotelRoutes from './routes/hotels';
import authRoutes from './routes/auth';
import favoriteRoutes from './routes/favorites';
import messageRoutes from './routes/messages';
import uploadRoutes from './routes/upload';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true,
}));

connectDB();
app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/hotels', hotelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.get('/', (_req, res) => {
  res.send('Wanderlust API running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
