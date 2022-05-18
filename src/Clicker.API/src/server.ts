import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = 8080; // process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Clicker API');
});

app.get('/Project', (req: Request, res: Response) => {
    res.send('Project details');
});

app.get('/Project/GetById/:id', (req: Request, res: Response) => {
    res.send('ID is ' + req.params[`id`]);
});

app.post('/Project/Create', (req: Request, res: Response) => {
    res.send('Clicker API');
});

app.post('/Project/ProjectDelete', (req: Request, res: Response) => {
    res.send('Clicker API');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});