import { countriesOfEurope } from './countries.js';

class Country {
  constructor(countryName, capital, flag) {
    this._countryName = countryName;
    this._capital = capital;
    this._flag = flag;
  }
  get countryName() {
    return this._countryName;
  }
  get capital() {
    return this._capital;
  }
  get flag() {
    return this._flag;
  }
}

class Quiz {
  constructor() {
    this._countries = countriesOfEurope.map(
      (c) => new Country(c.name, c.capital, c.flag)
    );
    this._questions = new Set();
    this._answers = new Map();
  }
  get countries() {
    return this._countries;
  }
  get questions() {
    return this._questions;
  }
  get answers() {
    return this._answers;
  }
  createQuestions() {
    while (this.questions.size < 10) {
      this.questions.add(
        this.countries[Math.ceil(Math.random() * this.countries.length - 1)]
      );
    }
  }
  getQuestion() {
    return [...this.questions][this.answers.size];
  }
  addAnswer(question, answer) {
    this.answers.set(question, answer);
  }

  getRandomCountryCapital() {
    return this.countries[Math.ceil(Math.random() * this.countries.length - 1)]
      .capital;
  }
}

class QuizApp {
  constructor() {
    this.showMessage(
      'Retrieving the countries, this can take some time...',
      true
    );
    new Promise((resolve) => {
      setTimeout(() => {
        this._quiz = new Quiz();
        resolve();
      }, 10000);
    })
      .then(() => {
        this.hideMessage();
        this.play();
      })
      .catch((wrong) => {
        this.showMessage(
          `Something went wrong while retrieving the data: ${wrong}`,
          false
        );
      });
  }
  play() {
    new Promise((resolve) => {
      this.showMessage(
        'Creating the questions, this can take some time...',
        true
      );
      setTimeout(() => {
        this._quiz.createQuestions();
        resolve();
      }, 10000);
    })
      .then(() => {
        this.hideMessage();
        document.getElementById('quiz').classList.remove('hide');
        this.showQuestion(this._quiz.getQuestion());
      })
      .catch((wrong) => {
        this.showMessage(
          `Something went wrong while creating the questions: ${wrong}`,
          false
        );
      });
  }
  showQuestion(question) {
    this.showMessage(
      'Creating the list of possible answers, this can take some time...',
      true
    );
    document.getElementById('country').innerHTML = question.countryName;
    document.getElementById('answersList').classList.add('hide');
    new Promise((resolve) => {
      setTimeout(() => {
        this.createSelectList(question.capital);
        resolve();
      }, 2000);
    })
      .then(() => {
        this.hideMessage();
        document.getElementById('answersList').classList.remove('hide');
        document.getElementById('capital').onchange = () => {
          this._quiz.addAnswer(
            question,
            document.getElementById('capital').value
          );
          this.showResult();
          if (this._quiz.getQuestion())
            this.showQuestion(this._quiz.getQuestion());
          else {
            document.getElementById('answersList').classList.add('hide');
            document.querySelector(
              '#quiz div'
            ).innerHTML = `<div class="form-group"> Hope you enjoyed the quiz...</div>`;
          }
        };
      })
      .catch((wrong) => {
        this.showMessage(
          `Something went wrong creating the answers list: ${wrong}`,
          false
        );
      });
  }

  showResult() {
    document.getElementById('answers').innerHTML = '';
    [...this._quiz.answers].forEach(([key, value]) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.appendChild(document.createTextNode(key.countryName));
      const td2 = document.createElement('td');
      td2.appendChild(document.createTextNode(key.capital));
      const td3 = document.createElement('td');
      td3.appendChild(document.createTextNode(value));
      const td4 = document.createElement('td');
      const icon = document.createElement('img');
      icon.src =
        key.capital.toLowerCase() === value.toLowerCase()
          ? 'images/correct.png'
          : 'images/wrong.png';
      icon.width = '25';
      icon.height = '25';
      td4.appendChild(icon);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      document.getElementById('answers').appendChild(tr);
    });
  }
  createSelectList(capital) {
    document.getElementById('capital').innerHTML = '';
    const capitalSet = new Set();
    capitalSet.add('-- Make your choice --');
    capitalSet.add(capital);
    while (capitalSet.size < 11) {
      capitalSet.add(this._quiz.getRandomCountryCapital());
    }
    [...capitalSet].sort().forEach((value) => {
      const opt = document.createElement('option');
      opt.appendChild(document.createTextNode(value));
      document.getElementById('capital').appendChild(opt);
    });
  }

  showMessage(message, spinner) {
    document.getElementById('message').classList.remove('hide');
    !spinner
      ? document.getElementById('spinner').classList.add('hide')
      : document.getElementById('spinner').classList.remove('hide');
    document.getElementById('messageText').innerText = message;
  }
  hideMessage() {
    document.getElementById('message').classList.add('hide');
    document.getElementById('messageText').innerText = '';
  }
}
window.onload = () => {
  new QuizApp();
};
