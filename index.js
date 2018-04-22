const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://ahmad:century@ds253889.mlab.com:53889/todos');
const db = mongoose.connection;

const todo = {
  value: String,
  id: String,
  completed: Boolean,
  date: String
};

const Todo = mongoose.model('Todo', todo);

app.post('/add', (req, res) => {
  new Todo(req.body).save();
  res.sendStatus(304);
});

app.post('/edit', (req, res) => {
  Todo.findOne({id: req.body.id}, function (err, doc) {
    doc.value = req.body.value;
    doc.save();
    res.sendStatus(304);
  });
});

app.post('/remove', (req, res) => {
  Todo.findOne({id: req.body.id}, function (err, doc) {
    doc.remove();
    res.sendStatus(304);
  });
});

app.post('/complete', (req, res) => {
  Todo.findOne({id: req.body.id}, function (err, doc) {
    doc.completed = !doc.completed;
    doc.save();
    res.sendStatus(304);
  });
});

app.post('/delete_completed', (req, res) => {
  Todo.find({completed: true}, function (err, docs) {
    docs.forEach((doc) => {
      doc.remove();
    });
    res.sendStatus(304);
  });
});

app.get('/todos', (req, res) => {
  Todo.find({}, function (err, docs) {
    res.send(docs);
  });
});

app.set('port', (process.env.PORT || 9000));

app.use(express.static(__dirname + '/client'));
app.set('views', __dirname + '/client');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function (req, res) {
  res.render('index.html')
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
