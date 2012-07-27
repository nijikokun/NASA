/**
 * Namespace Check
 * 
 * Here we check to see if nasa already exists as a namespace and is an object,
 * if both of these parameters are true we utilize it, otherwise we create a 
 * new namespace.
 */
var nasa = (typeof nasa === 'undefined' || typeof nasa !== 'object') ? {} : nasa;

/**
 * NASA Module
 * Copyright 2012 Nijiko Yonskai (@vizualover) 
 * License AOL <http://aol.nexua.org> (attribute-only-license)
 *
 * The following module was designed with humans in mind. All 
 * robots were harmed in the making of this.
 * 
 * @param  {Object} nasa The NASA Namespace
 * @return {Module}      NASA Module
 */
(function (nasa) {
  /**
   * Storage Reference Object
   *
   * By default this references the localStorage API, 
   * by using `session` this object will reference the 
   * sessionStorage API.
   * 
   * @type {Reference}
   */
  var $store = localStorage;

  /**
   * Nasa Storage Module
   *
   * Creates a thin wrapper around the HTML5 LocalStorage API 
   * for ease of access and control, as well as additional 
   * functionality for fast prototyping and coding.
   * 
   * @return {Object} Gives quick methods to accessing localStorage API
   */
  nasa.storage = function (settings) {
    var expires;

    if (!settings) settings = {};
    if (settings.expires === 'session') $store = sessionStorage; 
    if (typeof $store == 'undefined') return false;

    if ("expires" in settings && typeof settings.expires == 'number' && settings.expires > 0)
      expires = (+new Date) + settings.expires;

    return {
      /**
       * Save a single key-store document to storage:
       *
       *     store
       *     .set("key", "value")
       *     .set("another", "value"); // Chaining is possible.
       * 
       * @param {Mixed} key  Data store reference, key.
       * @param {Object} data Stored data.
       */
      set: function (key, data) {
        var value = { "nasa:store" : data };
        (expires) && (value["nasa:expires"] = expires);
        $store.setItem(key, JSON.stringify(value));
        return this;
      },

      /**
       * Given a string it will return a single key-store value:
       *
       *     store.get("key") -> value
       *
       * Given an array it will return a  object filled with key-stores:
       *
       *     store.get([
       *       "key", 
       *       "another"
       *     ]) -> {
       *       key: "value",
       *       another: "value" 
       *     }
       *
       * This function also checks against the expiration value on the key-store, 
       * if the key-store has expired it will remove it from storage and return a 
       * null value.
       * 
       * @param  {Mixed} keys Accepts array of keys or single key string.
       * @return {Object}      The stored data.
       */
      get: function (keys) {
        var data, value, now = (+new Date), $self = this, i, exists = false;

        /**
         * Private Data Check function to prevent re-typing this twice.
         * @param  {Object} data Stored Object
         * @return {Mixed}       Stored data or null
         */
        function check (data) {
          if(data === null) return null;
          if("nasa:store" in data)
            if("nasa:expires" in data && now >= data["nasa:expires"])
              $self.remove(keys);
            else return value["nasa:store"];
          return null;
        };

        try {
          if(Object.prototype.toString.call(keys) === '[object Array]') {
            data = {};
            for (i = 0; i < keys.length; i++) {
              value = JSON.parse($store.getItem(keys[i]));
              if (value !== null) {
                if (!exists) exists = true;
                data[keys[i]] = value;
              }
            }
            data = (exists) ? data : null;
          } else {
            value = JSON.parse($store.getItem(keys));
            data = check(value);
          }
        } catch (error) { console.log(error.message); }

        return data;
      },

      /**
       * Imports an object filled with key-store values hassle-free:
       * 
       *     store.import({
       *       key: "value",
       *       another: "value"
       *     })
       * 
       * @param  {Object} data Object container holding key:value data.
       * @return {this}
       */
      "import": function (data) {
        var key;
        for (key in data) if (data.hasOwnProperty(key)) this.set(key, data[key]);
        return this;
      },

      /**
       * Given a string it will remove a single key-store:
       *
       *      store.remove("key")
       *
       * Given an array it will remove multiple key-stores:
       *
       *      store.remove([
       *        "key",
       *        "another"
       *      ])
       * 
       * @param  {Mixed} keys key(s) to remove
       * @return {this}
       */
      "remove": function (keys) {
        if(Object.prototype.toString.call(keys) === '[object Array]') {
          for(var i = 0; i < keys.length; i++) $store.removeItem(keys[i]);
        } else {
          $store.removeItem(keys);
        }

        return this;
      },
      
      /**
       * Empty the current store completely, wipes all data.
       * 
       * @return {this}
       */
      empty: function () {
        $store.clear();
        
        return this;
      }
    }
  }
})(
  nasa
);