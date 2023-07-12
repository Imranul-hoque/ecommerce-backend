const mongoose = require('mongoose');

const validateMongoId = (id) => {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new Error('Id is not valid');
}


module.exports = { validateMongoId }