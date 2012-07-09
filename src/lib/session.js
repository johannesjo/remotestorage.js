define(['./platform', './webfinger', './hardcoded'], function(platform, webfinger, hardcoded) {
  var prefix = 'remoteStorage_session_',
    memCache = {},
    stateHandler = function(){},
    errorHandler = function(){};
  function set(key, value) {
    localStorage.setItem(prefix+key, JSON.stringify(value));
    memCache[key]=value;
  }
  function remove(key) {
    localStorage.removeItem(prefix+key);
    delete memCache[key];
  }
  function get(key) {
    if(typeof(memCache[key]) == 'undefined') {
      var valStr = localStorage.getItem(prefix+key);
      if(typeof(valStr) == 'string') {
        try {
          memCache[key] = JSON.parse(valStr);
        } catch(e) {
          localStorage.removeItem(prefix+key);
          memCache[key] = null;
        }
      } else {
        memCache[key] = null;
      }
    }
    return memCache[key];
  }
  function disconnectRemote() {
    remove('storageType');
    remove('storageHref');
    remove('bearerToken');
  }
  function getState() {
    if(get('storageType') && get('storageHref')) {
      if(get('bearerToken')) {
        return 'connected';
      } else {
        return 'authing';
      }
    } else {
      return 'anonymous';
    }
  }
  function on(eventType, cb) {
    if(eventType == 'state') {
      stateHandler = cb;
    } else if(eventType == 'error') {
      errorHandler = cb;
    }
  }

  
  return {
    setStorageInfo   : function(type, href) { set('storageType', type); set('storageHref', href); },
    getStorageType   : function() { return get('storageType'); },
    getStorageHref   : function() { return get('storageHref'); },
    
    setBearerToken   : function(bearerToken) { set('bearerToken', bearerToken); },
    getBearerToken   : function() { return get('bearerToken'); },
    
    disconnectRemote : disconnectRemote,
    on               : on,
    getState         : getState
  }
});