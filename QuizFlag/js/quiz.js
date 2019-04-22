import {
	countriesOfEurope
} from './countries.js';


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
			const qCountry = [...this.questionsQuiz][q - 1]
			new Promise((resolve, reject) => {
					document.getElementById("flag").src = qCountry.flag;
					this.createSelectList(qCountry.countryName);
					document.getElementById("country").onchange = () => {
						const answer = document.getElementById("country").value;
						resolve(answer);
					}
				})
				.then((answer) => {
					this.answers.set(qCountry, answer);
					this.showResult();
					this.askQuestion(q + 1);
				})
				.catch((wrong) => {
					console.log("Something went wrong during the quiz!")
				});
		} else {
			document.getElementById("country") = '';
		}

	}
	createQuestions() {
		new Promise((resolve, reject) => {
				while (this.questionsQuiz.size < 10) {
					this.questionsQuiz.add(this.countriesArray[Math.ceil(Math.random() * this.countriesArray.length - 1)]);
				}
				resolve();
			})
			.then(() => {
				this.askQuestion(1)
			})
			.catch(() => {
				console.log("Something went wrong with creating the questions!")
			})
	}
	showResult() {
		document.getElementById("answers").innerHTML = '';
		[...this.answers].forEach(([key, value]) => {
			const tr = document.createElement("tr");
			const td1 = document.createElement("td");
			const img = document.createElement("img");
			img.src = key.flag;
			img.width = "35";
			img.height = "25";
			td1.appendChild(img);
			const td2 = document.createElement("td");
			td2.appendChild(document.createTextNode(key.countryName));
			const td3 = document.createElement("td");
			td3.appendChild(document.createTextNode(value));
			const td4 = document.createElement("td");
			const icon = document.createElement("img");
			icon.src = key.countryName.toLowerCase() === value.toLowerCase() ? "images/correct.png" : "images/wrong.png";
			icon.width = "25";
			icon.height = "25";
			td4.appendChild(icon);
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			tr.appendChild(td4);
			document.getElementById("answers").appendChild(tr);
		});
	}
	createSelectList(c) {
		document.getElementById("country").innerHTML = '';
		const countrySet = new Set();
		countrySet.add("-- Make your choice --");
		countrySet.add(c);
		while (countrySet.size < 11) {
			countrySet.add(this.countriesArray[Math.ceil(Math.random() * this.countriesArray.length - 1)].countryName);
		}
		[...countrySet].sort().forEach((value) => {
			const opt = document.createElement("option");
			opt.appendChild(document.createTextNode(value));
			document.getElementById("country").appendChild(opt);
		});
	}
}

window.onload = () => {
	const app = new QuizApp();
	app.createQuestions();
};