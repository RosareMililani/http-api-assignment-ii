const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const body = [];

    // error occurs while trying to read information from client
    // asynchronus
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    // get last chunk - new piece of info
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // take all elements of array and combine
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addUser(request, response, bodyParams);
    });
  }

  if (parsedUrl.pathname === '/notReal') {
    const body = [];

    // error occurs while trying to read information from client
    // asynchronus
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 404;
      response.end();
    });

    // get last chunk - new piece of info
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // take all elements of array and combine
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.notRealUser(request, response, bodyParams);
    });
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsers(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/badUsers') {
    htmlHandler.notRealUser(request, response);
  } else {
    htmlHandler.getNotFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
