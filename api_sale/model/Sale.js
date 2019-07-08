const mongoose = require('mongoose');

const mongoose_pagination = require('mongoose-paginate');

//definicao do model
const SaleSchema = mongoose.Schema({
    client:{
        type: String,
        require: true,
    },
    status:{
        type: Boolean,
        default:false,
    },
    value:{
        type: Number,
        require: true
    },
    created_at:{
        type: Date,
        default: Date.now,
    },
})

//usa a paginacao
SaleSchema.plugin(mongoose_pagination);

//exporta
module.exports = mongoose.model('Sale', SaleSchema);