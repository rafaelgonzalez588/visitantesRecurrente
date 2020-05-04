const express = require('express');
const app = express();
const mongoose = require('mongoose');

//conexion db
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on("error", function (error) {
    console.log("Error", error);
});

//esquema
const recurringVisitorSchema = mongoose.Schema({
    name: String,
    count: Number,

});
const RecurringVisitor = mongoose.model("RecurringVisitor", recurringVisitorSchema);


app.get('/', async (req, res) => {
    var name = req.query.name;

    var visitor = await RecurringVisitor.find({ name: name });

    if (!visitor.length) {
        const person = new RecurringVisitor({
            name: name,
            count: 1
        });
        person.save((error) => {
            if (error) {
                return res.send(`error`)
            }
        });
    } else if (!name) {
        name = "Anónimo"

        const person = new RecurringVisitor({
            name: name,
            count: 1
        });
        person.save((error) => {
            if (error) {
                return res.send(`error`)
            }
        });
    } else {
        RecurringVisitor.updateOne({ name: name }, { $inc: { count: 1 } }, console.log);
    };

    RecurringVisitor.find(function (err, table) {
        if (err) return console.error(err);
        let tr = '';
        table.forEach((item) => {
            tr += ('<tr><td>' + item['_id'] + '</td>' +
                '<td>' + item.name + '</td>' +
                '<td>' + item.count + '</td></tr>');
        }
        );

        let result = ('<table><thead><tr>' +
            '<th class="text-center">' + "Id" + '</th>' +
            '<th class="text-center">' + "name" + '</th>' +
            '<th class="text-center">' + "visits" + '</th>' +
            '</tr></thead><tbody>' + tr + '</tbody></table>'
        );
        return res.send(result);
    });
});
  app.listen('3000', () => console.log('Listening on port 3000!'));