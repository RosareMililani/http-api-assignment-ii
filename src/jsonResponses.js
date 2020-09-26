// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
    // message: users,
  };

  // responseJSON.message = users;

  respondJSON(request, response, 200, responseJSON);
};

const notReal = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 400, responseJSON);
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
    users[body.name].name = body.name;
  }

  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  /* if (responseCode === 200) {
    responseJSON.message = 'Created nothing';
    return respondJSON(request, response, responseCode, responseJSON);
  } */

  return respondJSONMeta(request, response, responseCode);
};

const notRealUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'notFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  const responseCode = 404;

  if (responseCode === 404) {
    responseJSON.message = 'Resource Not Found';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

module.exports = {
  getUsers,
  addUser,
  notRealUser,
  notReal,
};
