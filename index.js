'use strict';

const COMMANDS_RE = /(start)(\s+(.)+)/i;
const OPTIONS_RE = /((-.))(\s+([^.\-])+|)/ig;
const MESSAGE_RE = /(([^-])+)/i
//^ matches -. and string behind it? 
//maybe change -. to specific params

const OPT_WO_MSG = ['-b', '-h']; //billable, help
const OPT_WITH_MSG = ['-p', '-t']; //project, tag

module.exports = (pluginContext) => {
  const api = require('./api'); //figure out how to do these export bullshit
  const ro = require('./respondObjects');

  const preferences = pluginContext.preferences;
  const token = preferences.get().token + ':api_token';

  let currentTimerId = -1;

  function startup() {
  }

  function parseCommand(query, res) { //res is temp
    const parsed = COMMANDS_RE.exec(query.toLowerCase());
    if (!parsed){
      return; //TODO: prompt a command not found thingy
    }

    res.add({
      id: 'test',
      payload: query,
      title: `${parsed[1]} : ${parsed[2]}`,
    });
  }

  function onStartUp(res) {
    api.getRunning(token, pluginContext.logger)
      .then((data) => { 
        if (data['id']) {
          res.add({
            id: 'timer',
            title: `Hello ${data['id']}`,
          });
          currentTimerId = data['id'];
        } else 
        {
          res.add({
            id: 'noAction',
            title: 'Timer is not running.',
          });
          currentTimerId = -1;
        }
      },
        (reason) => {
          res.add({
            id: 'error',
            title: 'An error has occured',
          });
      });
  }

  function onStop(res) {
    if (currentTimerId !== -1) {
        res.add({
          id: 'stop',
          title: 'Stop current timer',
        });
      } else {
        res.add({
          id: 'noAction',
          title: 'Timer is not running.',
        });
    }
  }

  function onStart(res) {
    if (currentTimerId == -1) {
        res.add({
          id: 'start',
          title: 'Start Timer',
        });
      } else {
        res.add({
          id: 'stopAndStart',
          title: 'Stop ongoing timer and start new',
        });
    }
  }

  function search(query, res) {
    //show query for debugging
    res.add({
        id: 'debug',
        title: `Timer id: ${currentTimerId} , ${query}`,
      });

    let q = query.toLowerCase().trim();

    if (q == '') {
      onStartUp(res);
    }
    else if (q == 'stop') {
      onStop(res);
    } 
    else if (q == 'start') {
      onStart(res)
    }
    else parseCommand(query, res);
  }

  function execute(id, payload) {
    //how to force refresh & empty query?
    switch(id){
      case 'start':
        api.startTimer(token);
        break;
      case 'stop':
        api.stopTimer(token, currentTimerId, pluginContext.logger);
        currentTimerId = -1;
        break;
      case 'stopAndStart':
        api.stopTimer(token);
        api.startTimer(token);
        break;
    }
  }

  // how does this method work?
  function renderPreview(id, payload, render) {
  }

  return { startup, search, execute, renderPreview };
};