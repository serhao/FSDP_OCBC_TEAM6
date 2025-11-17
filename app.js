import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'signup.html'));
});

// Serve dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'dashboard.html'));
});

// Serve transfer page
app.get('/transfer', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'transfer.html'));
});

// Serve investments simulation page
app.get('/investments', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'investments.html'));
});

// Serve investment page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'investment-learn-article.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Open your browser to view the login page');
});

export default app;
