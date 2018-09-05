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
    data: '',
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

//TODO: in case of 0 data, the promise just doesnt return. how to fix?
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

  fetch(stop, { ...dataObject.stop, headers: getHeader(token) })
    .then((res) => {
      logger.log('Stop response status: ' + res.status + " " + res.statusText);
    });
}

function startTimer(token) {
}

module.exports.stopTimer = stopTimer;
module.exports.getRunning = getRunning;
module.exports.startTimer = startTimer;