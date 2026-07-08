/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "tsy2pu12pfp7348",
    "created": "2026-05-25 22:03:53.206Z",
    "updated": "2026-05-25 22:03:53.206Z",
    "name": "import",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "9085tind",
        "name": "file",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "r4psu4ji",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tsy2pu12pfp7348");

  return dao.deleteCollection(collection);
})
