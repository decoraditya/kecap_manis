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
    alertBox.className = 'cyber-alert d-none';
    alertBox.innerHTML = '';
}

function showFormAlert(message, type) {
    const alertBox = document.getElementById('registerAlert');
    alertBox.className = `cyber-alert alert-${type}-cyber`;
    alertBox.innerHTML = message;
}

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    resetAlertBox();

    const clientName = document.getElementById('inputName').value.trim();
    const clientNIK = document.getElementById('inputNIK').value.trim();
    const inputDateValue = document.getElementById('inputDate').value;

    if (!clientName || !clientNIK || !inputDateValue) {
        showFormAlert('SYS_ERROR: DATA FIELDS INCOMPLETE.', 'danger');
        return;
    }

    const selectedDateObj = new Date(inputDateValue);
    const todayDateObj = new Date();
    
    todayDateObj.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj < todayDateObj) {
        showFormAlert('SYS_ERROR: TIME TRAVEL DENIED. SELECT FUTURE DATE.', 'danger');
        return;
    }

    const selectedDayOfWeek = selectedDateObj.getDay();
    if (selectedDayOfWeek === 0 || selectedDayOfWeek === 6) {
        showFormAlert('SYS_ERROR: MAINFRAME OFFLINE DURING WEEKENDS.', 'danger');
        return;
    }

    const currentDayOfWeek = todayDateObj.getDay();
    const timeDifference = selectedDateObj.getTime() - todayDateObj.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (currentDayOfWeek >= 1 && currentDayOfWeek <= 4) {
        const remainingDaysThisWeek = 5 - currentDayOfWeek;
        if (dayDifference > remainingDaysThisWeek) {
            showFormAlert('SYS_ERROR: ACCESS RESTRICTED TO CURRENT WEEK.', 'danger');
            return;
        }
    } else if (currentDayOfWeek === 5) {
        const limitDaysToNextFriday = 7;
        if (dayDifference > limitDaysToNextFriday) {
            showFormAlert('SYS_ERROR: MAXIMUM RANGE IS NEXT FRIDAY.', 'danger');
            return;
        }
    } else {
        showFormAlert('SYS_ERROR: SYSTEM MAINTENANCE ON WEEKEND.', 'danger');
        return;
    }

    const existingRegistrations = queueDatabase.filter(data => data.date === inputDateValue).length;
    if (existingRegistrations >= maxQuotaPerDay) {
        showFormAlert('SYS_ERROR: SERVER CAPACITY FULL FOR SELECTED DATE.', 'danger');
        return;
    }

    const generatedTicket = 'SYS-' + Math.floor(Math.random() * 90000 + 10000);

    queueDatabase.push({
        ticketNumber: generatedTicket,
        fullName: clientName,
        nikNumber: clientNIK,
        date: inputDateValue,
        queueStatus: 'INITIALIZED'
    });

    showFormAlert(`UPLINK SUCCESS. KEY_ID: ${generatedTicket}`, 'success');
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
        statusListWrapper.innerHTML = '<div class="cyber-history-card"><p>NULL RESULT: NO MATCHING DATA IN MAINFRAME.</p></div>';
        return;
    }

    userHistoryData.forEach(entry => {
        const recordCard = document.createElement('div');
        recordCard.className = 'cyber-history-card';
        recordCard.innerHTML = `
            <p><strong>KEY_ID:</strong> ${entry.ticketNumber}</p>
            <p><strong>USER:</strong> ${entry.fullName}</p>
            <p><strong>CYCLE:</strong> ${entry.date}</p>
            <span class="cyber-badge">STATE: ${entry.queueStatus}</span>
        `;
        statusListWrapper.appendChild(recordCard);
    });
});