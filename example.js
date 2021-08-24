const uuidv1 = require("uuid/v1");

const data = [
    {
        "productId": uuidv1(),
        "name": "iPhone12",
        "description": "",
        "available": "yes"
    },
    {
        "productId": uuidv1(),
        "name": "iPhone11",
        "description": "",
        "available": "yes"
    },
    {
        "productId": uuidv1(),
        "name": "iPhone10",
        "description": "",
        "available": "yes"
    }
]

module.exports = data
