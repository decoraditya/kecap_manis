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
    alertBox.className = 'd-none';
    alertBox.innerHTML = '';
}

function showFormAlert(message, type) {
    const alertBox = document.getElementById('registerAlert');
    alertBox.className = `alert alert-${type} alert-dismissible fade show`;
    alertBox.innerHTML = `${message} <button type="button" class="btn-close" onclick="resetAlertBox()"></button>`;
}

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    resetAlertBox();

    const clientName = document.getElementById('inputName').value.trim();
    const clientNIK = document.getElementById('inputNIK').value.trim();
    const inputDateValue = document.getElementById('inputDate').value;

    if (!clientName || !clientNIK || !inputDateValue) {
        showFormAlert('Error: All fields are required.', 'danger');
        return;
    }

    const selectedDateObj = new Date(inputDateValue);
    const todayDateObj = new Date();
    
    todayDateObj.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj < todayDateObj) {
        showFormAlert('Error: Past dates are invalid.', 'danger');
        return;
    }

    const selectedDayOfWeek = selectedDateObj.getDay();
    if (selectedDayOfWeek === 0 || selectedDayOfWeek === 6) {
        showFormAlert('Error: Weekend appointments are unavailable.', 'danger');
        return;
    }

    const currentDayOfWeek = todayDateObj.getDay();
    const timeDifference = selectedDateObj.getTime() - todayDateObj.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (currentDayOfWeek >= 1 && currentDayOfWeek <= 4) {
        const remainingDaysThisWeek = 5 - currentDayOfWeek;
        if (dayDifference > remainingDaysThisWeek) {
            showFormAlert('Error: You can only register for the current week.', 'danger');
            return;
        }
    } else if (currentDayOfWeek === 5) {
        const limitDaysToNextFriday = 7;
        if (dayDifference > limitDaysToNextFriday) {
            showFormAlert('Error: Registration is limited up to next Friday.', 'danger');
            return;
        }
    } else {
        showFormAlert('Error: Weekend registration system is currently offline.', 'danger');
        return;
    }

    const existingRegistrations = queueDatabase.filter(data => data.date === inputDateValue).length;
    if (existingRegistrations >= maxQuotaPerDay) {
        showFormAlert('Error: Daily quota exceeded for this date.', 'danger');
        return;
    }

    const generatedTicket = 'TRK-' + Math.floor(Math.random() * 90000 + 10000);

    queueDatabase.push({
        ticketNumber: generatedTicket,
        fullName: clientName,
        nikNumber: clientNIK,
        date: inputDateValue,
        queueStatus: 'QUEUED'
    });

    showFormAlert(`Success! Your Ticket ID is <strong>${generatedTicket}</strong>`, 'success');
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
        statusListWrapper.innerHTML = `
            <div class="alert alert-warning mb-0">
                No matching NIK found in our database.
            </div>`;
        return;
    }

    userHistoryData.forEach(entry => {
        const recordCard = document.createElement('div');
        recordCard.className = 'card history-card border-0 shadow-sm p-4';
        recordCard.innerHTML = `
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h5 class="text-primary fw-bold mb-1">${entry.ticketNumber}</h5>
                    <p class="mb-1 text-dark fw-semibold">${entry.fullName}</p>
                    <p class="mb-0 text-secondary small"><i class="fas fa-calendar-alt me-2"></i>${entry.date}</p>
                </div>
                <div>
                    <span class="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">
                        STATUS: ${entry.queueStatus}
                    </span>
                </div>
            </div>
        `;
        statusListWrapper.appendChild(recordCard);
    });
});