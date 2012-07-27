
describe("nasa.storage", function () {
  var store, results;

  describe("local-store", function () {
    beforeEach(function () {
      store = nasa.storage();
      results = null;
    });

    it("should be an object", function () {
      expect(store).not.toEqual(null);
    });

    it("should be able to save a key-store", function () {
      results = store.set('key', 'value');

      expect(results).not.toEqual(null);
    });

    it("should be able to retrieve a single key-store", function () {
      results = store.get('key');

      expect(results).toEqual('value');
    });

    it("should be able to remove a single key-store", function () {
      results = store.remove('key');

      expect(results).not.toEqual(null);
    });

    it("should be able to import an object", function () {
      results = store.import({
        a: 1,
        b: 2
      });

      expect(results).not.toEqual(null);
    });

    it("should be able to retrieve multiple key-stores", function () {
      results = store.get([ 'a', 'b' ]);

      expect(typeof results).toEqual('object');
      expect(results.a).toEqual(1);
      expect(results.b).toEqual(2);
    });

    it("should be able to remove multiple key-stores", function () {
      results = store.remove([ 'a', 'b' ]);
      
      expect(results).not.toEqual(null);
    });

    it("should be able to clean up", function () {
      results = store.empty();

      expect(results).not.toEqual(null);
    });
  });
});