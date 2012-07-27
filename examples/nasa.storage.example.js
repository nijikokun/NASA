/*
 * NASA Storage Module Example and Usage
 * 
 * This example shows basic session and storage usage 
 * with an example of showing how to initialize a 
 * temporary store based on time expiration.
 *
 * The following example can be run at the following url:
 * http://jsfiddle.net/hRzyj/
 *
 * Copyright 2012 Nijiko Yonskai (@vizualover)
 */

// Create local store
var store = nasa.storage();

// Create session store
var session = nasa.storage({ expires: 'session' });

// Create temporary store, data expires after five minutes.
var temp = nasa.storage({ expires: 5 * 60 * 1000 });

// Our Random Data
var random = Math.random() * 999999;

console.log("Previous key-store (should be empty):", store.get('settings'));
console.log("Previous key-session (should be an empty object):", session.get([ 'id', 'token' ]));

// Create a single key-store on local-store, example data.
store.set('settings', {
    renew: false,
    persist: true,
    auth: {
        method: 'facebook'
    }
});

// Import an object document key-store, each key creates a key-store.
// Good for a JSON Document.
session.import({
    id: random,
    token: 'QFTUrzm5HMGJugMpjEDrxdMP'
});

// Fetch a single key-store
console.log("Single key-store from local:", store.get('settings'));

// Fetch multiple key-stores
console.log("Multiple key-store from session:", session.get([ 'id', 'token' ]));
            
// Remove a single key-store
store.remove('settings');

// Remove multiple key-stores
// Optionally you could use .empty() if you want to clear the entire store.
session.remove([ 'id', 'token' ]);
​