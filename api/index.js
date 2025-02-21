import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser'
import connectDb from './config/connection.js';
import userRoute from './routes/userRoute.js'
import subjectRoute from './routes/subject.js'
import topicRoute from './routes/topic.js'
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


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/auth', userRoute);
app.use('/api/subject', subjectRoute);
app.use('/api/subjects', topicRoute);
