const mongoose=require('mongoose');
const {Schema, model} = require('mongoose');
const cubeSchema = new Schema({
    name: {type: Schema.Types.String, required: true},
    description: {type: Schema.Types.String, required: true},
    imageUrl: {type: Schema.Types.String, required: true},
    difficulty: {type: Schema.Types.Number, required: true}

});
cubeSchema.path('name')
    .validate(function () {
        return this.name.length >= 3 && this.name.length <= 15;
    }, 'Name must be between 3 and 15 symbols!');

cubeSchema.path('description')
    .validate(function () {
        return this.description.length >= 20 && this.description.length <= 300;
    }, 'Description must be between 20 and 300 symbols!');

cubeSchema.path('imageUrl')
    .validate(function () {
        return this.imageUrl.startsWith('http') && (this.imageUrl.endsWith('.png')
            || this.imageUrl.endsWith('.jpg'));
    }, 'Image URL should be valid');

cubeSchema.path('difficulty')
    .validate(function () {
        return this.difficulty >= 1 && this.difficulty <= 6;
    }, 'Difficulty should be between 1 and 6!');

const Cube = mongoose.model('Cube', cubeSchema);
module.exports = Cube;