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
    
    setTimeout(() => {
        viewSections[targetView].classList.add('active-section');
    }, 10);
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
    alertBox.className = 'alert d-none';
    alertBox.innerHTML = '';
}

function showFormAlert(message, type) {
    const alertBox = document.getElementById('registerAlert');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerHTML = message;
}

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    resetAlertBox();

    const clientName = document.getElementById('inputName').value.trim();
    const clientNIK = document.getElementById('inputNIK').value.trim();
    const inputDateValue = document.getElementById('inputDate').value;

    if (!clientName || !clientNIK || !inputDateValue) {
        showFormAlert('Please provide all necessary details.', 'danger');
        return;
    }

    const selectedDateObj = new Date(inputDateValue);
    const todayDateObj = new Date();
    
    todayDateObj.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj < todayDateObj) {
        showFormAlert('Registration for past dates is not permitted.', 'danger');
        return;
    }

    const selectedDayOfWeek = selectedDateObj.getDay();
    if (selectedDayOfWeek === 0 || selectedDayOfWeek === 6) {
        showFormAlert('Appointments can only be made on weekdays.', 'danger');
        return;
    }

    const currentDayOfWeek = todayDateObj.getDay();
    const timeDifference = selectedDateObj.getTime() - todayDateObj.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (currentDayOfWeek >= 1 && currentDayOfWeek <= 4) {
        const remainingDaysThisWeek = 5 - currentDayOfWeek;
        if (dayDifference > remainingDaysThisWeek) {
            showFormAlert('You can only register within the current operational week.', 'danger');
            return;
        }
    } else if (currentDayOfWeek === 5) {
        const limitDaysToNextFriday = 7;
        if (dayDifference > limitDaysToNextFriday) {
            showFormAlert('Registration is strictly limited until next Friday.', 'danger');
            return;
        }
    } else {
        showFormAlert('System processing is unavailable on weekends.', 'danger');
        return;
    }

    const existingRegistrations = queueDatabase.filter(data => data.date === inputDateValue).length;
    if (existingRegistrations >= maxQuotaPerDay) {
        showFormAlert('The allocation quota for your selected date is full.', 'danger');
        return;
    }

    const generatedTicket = 'SFT-' + Math.floor(Math.random() * 90000 + 10000);

    queueDatabase.push({
        ticketNumber: generatedTicket,
        fullName: clientName,
        nikNumber: clientNIK,
        date: inputDateValue,
        queueStatus: 'Registered'
    });

    showFormAlert(`Registration successful. Your ticket reference is ${generatedTicket}.`, 'success');
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
        statusListWrapper.innerHTML = '<div class="history-card text-secondary">No data corresponding to this NIK was found.</div>';
        return;
    }

    userHistoryData.forEach(entry => {
        const recordCard = document.createElement('div');
        recordCard.className = 'history-card';
        recordCard.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="mb-0 text-primary fw-bold">${entry.ticketNumber}</h5>
                <span class="badge bg-success px-3 py-2 rounded-pill">${entry.queueStatus}</span>
            </div>
            <p class="mb-1 text-dark"><strong>Name:</strong> ${entry.fullName}</p>
            <p class="mb-0 text-secondary small"><i class="fas fa-calendar-alt me-1"></i> ${entry.date}</p>
        `;
        statusListWrapper.appendChild(recordCard);
    });
});