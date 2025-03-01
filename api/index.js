import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser'
import connectDb from './config/connection.js';
import userRoute from './routes/userRoute.js'
import subjectRoute from './routes/subject.js'
import topicRoute from './routes/topic.js'
import { authenticate } from './middlewares/auth.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const HOST = 'localhost';

connectDb(process.env.CONNECTION_STRING)
	.then(() => {
		console.log('MongoDB Connected Successfully');
		app.listen(port, HOST, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((error) => {
		console.error("MongoDB Connection Error:", error);
	});

app.use(cors({
	origin: 'http://localhost:5173/',
	credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.use('/api/auth', userRoute);
app.use('/api/user', userRoute);
app.use('/api/subject', subjectRoute);
app.use('/api/subjects', topicRoute);
app.get('/api/verify', authenticate, (req, res) => {
	res.send('all good!')
})
app.get('/', (req, res) => {
	res.send('Hello World!')
})
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Something went wrong!' });
});