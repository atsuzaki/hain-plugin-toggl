'use strict';

const fetch = require('node-fetch');

const uri = {
  STOP: 'https://www.toggl.com/api/v8/time_entries/start',
  START: 'https://www.toggl.com/api/v8/time_entries/{time_entry_id}/stop',
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
    data: '',
    headers: {},
  },
  stop: {
    method: 'PUT',
    headers: {},
  }
};

function basicAuth(token) { //temp?
  return 'Basic ' + Buffer.from(token).toString("base64");
}

//TODO: in case of 0 data, the promise just doesnt return. how to fix?
function getRunning(token, logger) {
  let h = { ...dataObject.header, 'Authorization': basicAuth(token)};
  let req = fetch(uri.GET_RUNNING, { ...dataObject.get, headers: h })
    .then((res) => { 
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

//TODO:
function stopTimer(token, currentTimerId) {
  getRunning(token);

  let stop = uri.STOP;
  stop = stop.replace("{time_entry_id}", currentTimerId);
  let h = { ...dataObject.header, 'Authorization': token };

  fetch(stop, { ...dataObject.stop, header: h });
}

function startTimer(token) {

}

module.exports.stopTimer = stopTimer;
module.exports.getRunning = getRunning;
module.exports.startTimer = startTimer;