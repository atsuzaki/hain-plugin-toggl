'use strict';

const COMMANDS_RE = /(start)(\s+(.)+)/i;
const OPTIONS_RE = /((-.))(\s+([^.\-])+|)/ig;
const MESSAGE_RE = /(([^-])+)/i
//^ matches -. and string behind it? 
//maybe change -. to specific params

const OPT_WO_MSG = ['-b', '-h']; //billable, help
const OPT_WITH_MSG = ['-p', '-t']; //project, tag

module.exports = (pluginContext) => {
  const preferences = pluginContext.preferences;
  const token = preferences.get().token;

  function startup() {
      //TODO: on startup, show current timer and last tracked stuff?
  }

  function parseCommand(query, res) { //res is temp
    const parsed = COMMANDS_RE.exec(query.toLowerCase()); //this doesnt parse w/o message

    if (!parsed){
      return; //TODO: prompt a command not found thingy
    }

    res.add({
      id: 'test',
      payload: query,
      title: `${parsed[1]} ${parsed[2]}`,
    });
  }

  function search(query, res) {
    //show query for debugging
    res.add({
        id: 'stop',
        payload: query,
        title: `${query}`,
      });

    if (query.toLowerCase() == 'stop') {
      //TODO: check if timer is on
      res.add({
        id: 'stop',
        payload: query,
        title: `Stop current timer`,
      });
    } 
    else if (query.toLowerCase() == 'start') {
      //TODO: check if timer is on
      res.add({
        id: 'start',
        payload: query,
        title: `Start timer`,
      });
    }
    else parseCommand(query, res);
  }

  function execute(id, payload) {
  }

  return { startup, search, execute };
};