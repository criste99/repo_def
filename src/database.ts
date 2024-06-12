import mongoose from "mongoose";

mongoose.connect('mongodb://localhost/test', {
})
    .then(db => console.log('Database esta conectada'))
    .catch(err => console.log(err));