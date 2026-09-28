const maxQuotaPerDay = 50;
let queueDatabase = [];

const navHome = document.getElementById('navHome');
const linkRegister = document.getElementById('linkRegister');
const linkStatus = document.getElementById('linkStatus');
const btnHeroRegister = document.getElementById('btnHeroRegister');

const viewSections = {
    home: document.getElementById('homeSection'),
    register: document.getElementById('registerSection'),
    status: document.getElementById('statusSection')
};

function switchView(targetView) {
    Object.values(viewSections).forEach(section => {
        section.classList.remove('active-section');
    });
    viewSections[targetView].classList.add('active-section');
}

navHome.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('home');
});

linkRegister.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('register');
});

linkStatus.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('status');
});

btnHeroRegister.addEventListener('click', () => {
    switchView('register');
});

function resetAlertBox() {
    const alertBox = document.getElementById('registerAlert');
    alertBox.className = 'custom-alert d-none';
    alertBox.innerHTML = '';
}

function showFormAlert(message, type) {
    const alertBox = document.getElementById('registerAlert');
    alertBox.className = `custom-alert alert-${type}-custom`;
    alertBox.innerHTML = message;
}

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    resetAlertBox();

    const clientName = document.getElementById('inputName').value.trim();
    const clientNIK = document.getElementById('inputNIK').value.trim();
    const inputDateValue = document.getElementById('inputDate').value;

    if (!clientName || !clientNIK || !inputDateValue) {
        showFormAlert('All fields must be filled completely.', 'danger');
        return;
    }

    const selectedDateObj = new Date(inputDateValue);
    const todayDateObj = new Date();
    
    todayDateObj.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj < todayDateObj) {
        showFormAlert('You cannot register for a past date.', 'danger');
        return;
    }

    const selectedDayOfWeek = selectedDateObj.getDay();
    if (selectedDayOfWeek === 0 || selectedDayOfWeek === 6) {
        showFormAlert('Registration is strictly for weekdays (Monday to Friday).', 'danger');
        return;
    }

    const currentDayOfWeek = todayDateObj.getDay();
    const timeDifference = selectedDateObj.getTime() - todayDateObj.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (currentDayOfWeek >= 1 && currentDayOfWeek <= 4) {
        const remainingDaysThisWeek = 5 - currentDayOfWeek;
        if (dayDifference > remainingDaysThisWeek) {
            showFormAlert('You are only allowed to register for dates within this current week.', 'danger');
            return;
        }
    } else if (currentDayOfWeek === 5) {
        const limitDaysToNextFriday = 7;
        if (dayDifference > limitDaysToNextFriday) {
            showFormAlert('As today is Friday, you can only register up to next Friday.', 'danger');
            return;
        }
    } else {
        showFormAlert('The registration system is closed on weekends.', 'danger');
        return;
    }

    const existingRegistrations = queueDatabase.filter(data => data.date === inputDateValue).length;
    if (existingRegistrations >= maxQuotaPerDay) {
        showFormAlert('The quota for your selected date has been reached.', 'danger');
        return;
    }

    const generatedTicket = 'ID-' + Math.floor(Math.random() * 90000 + 10000);

    queueDatabase.push({
        ticketNumber: generatedTicket,
        fullName: clientName,
        nikNumber: clientNIK,
        date: inputDateValue,
        queueStatus: 'Pending Review'
    });

    showFormAlert(`Registration successful! Your generated Ticket Number is ${generatedTicket}`, 'success');
    this.reset();
});

document.getElementById('statusForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const searchNIKValue = document.getElementById('searchNIK').value.trim();
    const resultContainer = document.getElementById('statusResultContainer');
    const statusListWrapper = document.getElementById('statusList');

    statusListWrapper.innerHTML = '';
    resultContainer.classList.remove('d-none');

    const userHistoryData = queueDatabase.filter(data => data.nikNumber === searchNIKValue);

    if (userHistoryData.length === 0) {
        statusListWrapper.innerHTML = '<div class="history-card"><p>No data found matching the provided NIK.</p></div>';
        return;
    }

    userHistoryData.forEach(entry => {
        const recordCard = document.createElement('div');
        recordCard.className = 'history-card';
        recordCard.innerHTML = `
            <p><strong>Ticket</strong> : ${entry.ticketNumber}</p>
            <p><strong>Name</strong> : ${entry.fullName}</p>
            <p><strong>Date</strong> : ${entry.date}</p>
            <span class="status-badge">${entry.queueStatus}</span>
        `;
        statusListWrapper.appendChild(recordCard);
    });
});