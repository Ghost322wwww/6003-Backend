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

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

connectDB();
app.use(express.json());

app.use('/api/hotels', hotelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;