const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Question = require('./database/models/Question');
const Answer = require('./database/models/Answer');

//EJS as view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  Question.findAll({ raw: true, order: [['id', 'DESC']] }).then((questions) => {
    res.render('index', {
      questions,
    });
  });
});

app.get('/question', (req, res) => {
  res.render('listQuestions');
});

app.post('/savequestion', (req, res) => {
  let { title, description } = req.body;
  Question.create({
    title,
    description,
  }).then(() => {
    res.redirect('/');
  });
});

app.get('/question/:id', (req, res) => {
  let id = req.params.id;
  Question.findOne({
    where: { id },
  }).then((question) => {
    if (question != undefined) {
      Answer.findAll({
        where: { questionId: question.id },
        order: [['id', 'DESC']],
      }).then((answers) => {
        res.render('question', {
          question,
          answers,
        });
      });
    } else {
      res.redirect('/');
    }
  });
});

app.post('/ask', (req, res) => {
  let { body, questionId } = req.body;
  Answer.create({
    body,
    questionId,
  }).then(() => {
    res.redirect(`/question/${questionId}`);
  });
});

app.listen(8080, () => {
  console.log('Running on port:8080');
});
