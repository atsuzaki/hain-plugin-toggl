'use strict';

const fetch = require('node-fetch');

const uri = {
  START: 'https://www.toggl.com/api/v8/time_entries/start',
  STOP: 'https://www.toggl.com/api/v8/time_entries/{time_entry_id}/stop',
  GET_RUNNING: 'https://www.toggl.com/api/v8/time_entries/current',
}

let dataObject = {
  header: {
    'Authorization': '',
  },
  get: {
    method: 'GET',
    headers: {},
  },
  start: {
    method: 'POST',
    headers: {},
    body: '',
  },
  stop: {
    method: 'PUT',
    headers: {},
    body: '',
  }
};

function getHeader(token) {
  let auth = 'Basic ' + Buffer.from(token).toString("base64");
  return { ...dataObject.header, 'Authorization': auth};
}

function getRunning(token, logger) {
  let req = fetch(uri.GET_RUNNING, { ...dataObject.get, headers: getHeader(token) })
    .then((res) => { 
      logger.log('GetRunning response status: ' + res.status + " " + res.statusText);
      return res.json() })
    .then((data) => {
      if (data.data){
        return data.data;
      } else {
        return data;
      }
     })
    .catch(err => logger.log('Error:' + err));

  return req;
}

function stopTimer(token, currentTimerId, logger) { 
  let stop = uri.STOP;
  stop = stop.replace("{time_entry_id}", currentTimerId);

  return fetch(stop, { ...dataObject.stop, headers: getHeader(token) })
    .then((res) => {
      logger.log('Stop response status: ' + res.status + " " + res.statusText);
    });
}

function startTimer(token, data, logger) {
  let header = {...getHeader(token), "Content-Type": "application/json"};
  return fetch(uri.START, { ...dataObject.start, headers: header, body: JSON.stringify(data)})
    .then((res) => {
      logger.log('Start response status: ' + res.status + " " + res.statusText);
    });
}

module.exports.stopTimer = stopTimer;
module.exports.getRunning = getRunning;
module.exports.startTimer = startTimer;