var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
    identity: 'recipe',
    connection: 'disk',
    attributes: {
        foodName: 'string',
        foodType: 'string',
        datum: {
            type: 'date',
            defaultsTo: function () { return new Date(); }
        },
        user: {
            model: 'user'
        },
        ingredients: 'string',
        preparation: 'string'
    }
});