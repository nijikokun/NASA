#NASA
=====

NASA Modules are a collection of thin javascript wrappers for the HTML5 API. The thought behind these NASA Modules is that each module can be used as a stand-alone module or together as a library. So whether you just need one, or all of them they just work, alone or together.

## Existing Wrappers

* [nasa.storage.js](https://github.com/Nijikokun/NASA/blob/master/nasa.storage.js) (localStorage, sessionStorage)

## Want to Contribute?

The following HTML5 api's currently don't exist, if you want why not adopt it and donate back to NASA?

* File / Filesystem API
* Drag Drop API
* Audio / Video
* UserMedia
* Geolocation
* PubSub (Web Workers / Websockets)
* Web Database
* Blob Builder
* Blob URLs
* FormData
* Server-Sent Events
* registerProtocolHandler
* App Cache
* History

### Contribution Setup

1. **Filename**
   
   Each module should follow the following filename scheme: `nasa.[module-name].js`
   
2. **Module Boilerplate**

    ```
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
     * Copyright 2012 [Your Name Here] ([twitter handle or email here]) 
     * License AOL <http://aol.nexua.org> (attribute-only-license)
     *
     * The following module was designed with humans in mind. All 
     * robots were harmed in the making of this.
     * 
     * @param  {Object} nasa The NASA Namespace
     * @return {Module}      NASA Module
     */
    (function (nasa) {
      // Code Goes Here, following a two-spaces indention policy!
    })(
      nasa
    );
    ```

3. **Module Tests**

    Each Module should have some sort of [test](https://github.com/Nijikokun/NASA/tree/master/tests/spec) spec written, for testing we use [jasmine](https://github.com/pivotal/jasmine/).
    If you don't wish to setup the framework, download this repository and create a spec file in the `spec` directory with the filename scheme of `nasa.[module].spec.js`, and add it to `index.html` along with your module script and simply run `index.html` to view your tests.

    That's about it for tests! Pretty simple, right?