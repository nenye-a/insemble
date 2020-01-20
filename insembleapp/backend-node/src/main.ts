import express from 'express';

let app = express();
let port = 3000;

app.get('/', (request, response) => {
    response.send('Hello world.');
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://127.0.0.1:${port}`);
});
