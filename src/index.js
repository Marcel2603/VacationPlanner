let currentDate = new Date();
let users = new Map([
	[1, "Marcel Herhold"],
	[2, "Foo"],
	[3, "Bar"],
	[4, "FooBar"],
	[5, "BarFoo"]
]);
let vacations = [
	{userId: 1, start: new Date(2022, 10, 7), end: new Date(2022, 10, 10)},
	{userId: 1, start: new Date(2022, 10, 7), end: new Date(2022, 10, 10)},
	{userId: 5, start: new Date(2022, 9, 7), end: new Date(2022, 10, 10)},
	{userId: 4, start: new Date(2022, 10, 7), end: new Date(2022, 10, 10)},
	{userId: 2, start: new Date(2022, 10, 7), end: new Date(2022, 10, 10)},
	{userId: 1, start: new Date(2022, 11, 7), end: new Date(2022, 11, 10)},
	{userId: 3, start: new Date(2022, 10, 14), end: new Date(2022, 10, 18)},
];
window.onload = () => {
	render();
};

function render() {
	_renderCurrentDate();
	renderMonthHeader();
	renderUsers();
}

function selectNextMonth() {
	currentDate.setMonth(currentDate.getMonth() + 1);
	render();
}

function selectLastMonth() {
	currentDate.setMonth(currentDate.getMonth() - 1);
	render();
}

function renderMonthHeader() {
	document.getElementById("monthHeader").replaceChildren();
	const th = document.createElement('th');
	th.innerHTML = _getSearchHeader();
	document.getElementById("monthHeader").appendChild(th);
	const days = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
	const dayDate = new Date(currentDate);
	for (let date = 1; date <= days; date++) {
		dayDate.setDate(date);
		_renderDay(dayDate);
	}
}

function _getSearchHeader() {
	return `<div>
                    <label>
                        <input placeholder="Search for Employee">
                    </label>
                </div>`;
}

function _renderCurrentDate() {
	document.getElementById("currentDate").innerText = `${currentDate.getMonth() + 1} ${currentDate.getFullYear()}`;
}

function _renderDay(date) {
	const element = `<div style="display: flex; flex-direction: column">
                    <span>${date.getDate()}</span>
                    <span>${_renderDayName(date.getDay())}</span>
                </div>
	`;
	let th = document.createElement('th');
	th.innerHTML = element;
	document.getElementById("monthHeader").appendChild(th);
}

function _renderDayName(day) {
	const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
	return days[day % 7];
}

function renderUsers() {
	document.getElementById("userBody").replaceChildren();
	users.forEach(
		(value, key) => renderUser(value, key)
	);
}

function getClassNameForDay(dayDate) {
	let baseClasses = "day";
	switch (dayDate.getDay()) {
		case 0:
			return `${baseClasses} sunday`;
		case 6:
			return `${baseClasses} saturday`;
		default:
			return baseClasses;
	}
}

function setVacation(element) {
	element.classList.contains("vacation") ? element.classList.remove("vacation") : element.classList.add("vacation");
}

function renderUser(username, id) {
	let tr = document.createElement("tr");
	let days = [`<td>${username}</td>`];
	const dayDate = new Date(currentDate.setHours(0, 0, 0, 0));
	const userVac = vacations.filter(vac => vac.userId === id);
	for (let date = 1; date <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(); date++) {
		dayDate.setDate(date);
		const hasVac = userVac.filter(vac => {
			return vac.start.setHours(0, 0, 0, 0) <= dayDate && vac.end.setHours(0, 0, 0, 0) >= dayDate;
		}).length > 0;
		console.log(dayDate, hasVac);
		let classNames = getClassNameForDay(dayDate);
		days.push(`<td onclick="setVacation(this)" class="${hasVac ? classNames + " vacation" : classNames}"></td>`);
	}
	tr.innerHTML = days.join(`\n`);
	document.getElementById("userBody").appendChild(tr);
}
