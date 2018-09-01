'use strict';

module.exports = (pluginContext) => {

  const preferences = pluginContext.preferences;

  function startup() {
      //TODO: on startup, show current timer and last tracked stuff?
  }
 
  function search(query, res) {
    var q = query.trim();

  }

  function execute(id, payload) {

  }

  return { startup, search, execute };
};