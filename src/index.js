let currentDate = new Date();
let users = new Map([
	[1, {name: "Marcel Herhold", func: "Meister", area: "TB", totalVacation: 30}],
	[2, {name: "Foo", func: "Meister", area: "TB", totalVacation: 30}],
	[3, {name: "Bar", func: "Meister", area: "TB", totalVacation: 30}],
	[4, {name: "FooBar", func: "Meister", area: "TB", totalVacation: 30}],
	[5, {name: "BarFoo", func: "Meister", area: "TB", totalVacation: 30}],
]);
let vacations = [
	// {userId: 1, start: new Date(2022, 10, 7), end: new Date(2022, 10, 10)},
	// {userId: 1, start: new Date(2022, 10, 7), end: new Date(2022, 10, 10)},
	// {userId: 5, start: new Date(2022, 9, 7), end: new Date(2022, 10, 10)},
	// {userId: 4, start: new Date(2022, 10, 7), end: new Date(2022, 10, 10)},
	// {userId: 2, start: new Date(2022, 10, 7), end: new Date(2022, 10, 10)},
	// {userId: 1, start: new Date(2022, 11, 7), end: new Date(2022, 11, 10)},
	// {userId: 3, start: new Date(2022, 10, 14), end: new Date(2022, 10, 18)},
];
let isMouseDown = false;
let lastIndx = 0;

window.onload = () => {
	render();
};

window.onmouseup = () => {
	isMouseDown = false
}

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
	let header = document.getElementById("monthHeader")
	_getStaticHeaders().map(html => {
		const th = document.createElement('th');
		th.innerHTML = html;
		return th;
	}).forEach(th => header.appendChild(th));
	const days = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
	const dayDate = new Date(currentDate);
	for (let date = 1; date <= days; date++) {
		dayDate.setDate(date);
		_renderDay(dayDate);
	}
}

function _getStaticHeaders() {
	return [`<th>Bereich</th>`, `<th>Funkt.</th>`, `<th>Name</th>`, `<th>Jahresurlaub</th>`];
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

function handleDaySelection(td, ind, arr) {
	td.onmousedown = () => {
		isMouseDown = true;
		td.classList.add("highlighted");
		lastIndx = ind
		return false;
	};
	td.onmouseover = () => {
		if (isMouseDown) {
			if (td.classList.contains("highlighted")) {
				arr[lastIndx].classList.remove("highlighted")
				lastIndx = ind
			} else  {
				td.classList.add("highlighted");
				lastIndx = ind
			}
		}
	};
	td.onmouseup = () => {
		isMouseDown = false;
	};
}

function renderUser(user, id) {
	let tr = document.createElement("tr");
	let days = [`<td>${user.area}</td>`, `<td>${user.func}</td>`, `<td>${user.name}</td>`, `<td>${user.totalVacation}</td>`];
	const dayDate = new Date(currentDate.setHours(0, 0, 0, 0));
	const userVac = vacations.filter(vac => vac.userId === id);
	for (let date = 1; date <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(); date++) {
		dayDate.setDate(date);
		const hasVac = userVac.filter(vac => {
			return vac.start.setHours(0, 0, 0, 0) <= dayDate && vac.end.setHours(0, 0, 0, 0) >= dayDate;
		}).length > 0;
		let classNames = getClassNameForDay(dayDate);
		days.push(`<td class="${hasVac ? classNames + " vacation" : classNames} day"></td>`);
	}
	tr.innerHTML = days.join(`\n`);
	let userBody = document.getElementById("userBody");
	userBody.appendChild(tr);
	userBody.querySelectorAll(".day").forEach((td, ind, arr) => handleDaySelection(td, ind, arr))
}
