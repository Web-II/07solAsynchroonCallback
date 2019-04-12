import {
	countriesOfEurope
} from './countries.js';

function shuffle() {

}

class Country {
	constructor(countryName, capital, flag) {
		this.countryName = countryName;
		this.capital = capital;
		this.flag = flag;
	}
	get countryName() {
		return this._countryName;
	}
	set countryName(countryName) {
		this._countryName = countryName;
	}
	get capital() {
		return this._capital;
	}
	set capital(capital) {
		this._capital = capital
	}
	get flag() {
		return this._flag;
	}
	set flag(flag) {
		this._flag = flag;
	}
}

class QuizApp {
	constructor() {
		this.countriesArray = countriesOfEurope.map(c => new Country(c.name, c.capital, c.flag));
		this.questionsQuiz = new Set();
		this.answers = new Map();
	}
	get countriesArray() {
		return this._countriesArray;
	}
	set countriesArray(value) {
		this._countriesArray = value;
	}
	get questionsQuiz() {
		return this._questionsQuiz;
	}
	set questionsQuiz(value) {
		this._questionsQuiz = value;
	}
	get answers() {
		return this._answers
	}
	set answers(value) {
		this._answers = value
	}
	askQuestion(q) {
		if (q <= 10) {
			const qCountry = [...this.questionsQuiz][q-1]
			new Promise((resolve, reject) => {
					document.getElementById("country").innerHTML = qCountry.countryName;
					this.createSelectList(qCountry.capital);
					document.getElementById("capital").onchange = () => {
						const answer = document.getElementById("capital").value;
						resolve(answer);
					}
				})
				.then((answer) => {
					this.answers.set(qCountry, answer);
					this.showResult();
					this.askQuestion(q+1);
				})
				.catch((wrong) => {
					console.log("Something went wrong during the quiz!")
				});
		} else {
			document.getElementById("country").innerHTML = '';
			document.getElementById("capital").innerHTML = '';
		}

	}
	createQuestions(){
		new Promise((resolve,reject)=>{
			while (this.questionsQuiz.size < 10) {
				this.questionsQuiz.add(this.countriesArray[Math.ceil(Math.random() * this.countriesArray.length - 1)]);
			}
			resolve();
		})
		.then(()=>{this.askQuestion(1)})
		.catch(()=>{console.log("Something went wrong with creating the questions!")})
	}
	showResult() {
		document.getElementById("answers").innerHTML = '';
		[...this.answers].forEach(([key, value]) => {
			const tr = document.createElement("tr");
			tr.style.backgroundColor =
				key.capital.toLowerCase() === value.toLowerCase() ? "green" : "red";
			const td1 = document.createElement("td");
			td1.appendChild(document.createTextNode(key.countryName));
			const td2 = document.createElement("td");
			td2.appendChild(document.createTextNode(key.capital));
			const td3 = document.createElement("td");
			td3.appendChild(document.createTextNode(value));
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			document.getElementById("answers").appendChild(tr);
		});
	}
	createSelectList(c) {
		document.getElementById("capital").innerHTML = '';
		const capitalSet = new Set();
		capitalSet.add("-- Make your choice --");
		capitalSet.add(c);
		while (capitalSet.size < 11) {
			capitalSet.add(this.countriesArray[Math.ceil(Math.random() * this.countriesArray.length - 1)].capital);
		}
		[...capitalSet].sort().forEach((value) => {
			const opt = document.createElement("option");
			opt.appendChild(document.createTextNode(value));
			document.getElementById("capital").appendChild(opt);
		});
	}
}

window.onload = () => {
	const app = new QuizApp();
	app.createQuestions();
};