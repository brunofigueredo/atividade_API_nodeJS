const mongoose = require('mongoose');
const User = mongoose.model('User', {name: String, cpf: String, age: Number, cell: Number});
module.exports = User;