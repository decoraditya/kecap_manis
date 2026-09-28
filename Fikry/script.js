const dateInput = document.getElementById('bookingDate');
const bookingForm = document.getElementById('bookingForm');
const paymentInfo = document.getElementById('paymentInfo');
const totalPriceEl = document.getElementById('totalPrice');
const historyTableBody = document.getElementById('historyTableBody');

const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 7);

const formatTanggal = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

dateInput.min = formatTanggal(today);
dateInput.max = formatTanggal(maxDate);

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const court = document.getElementById('courtSelect').value;
    const name = document.getElementById('fullName').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('startTime').value;
    const duration = parseInt(document.getElementById('duration').value, 10);
    
    const timeParts = time.split(':');
    const hour = parseInt(timeParts[0], 10);
    
    if (hour < 6 || hour >= 23) {
        alert('Maaf, jam operasional lapangan kami adalah pukul 06:00 hingga 23:00.');
        return;
    }
    
    if ((hour + duration) > 23) {
        alert('Durasi sewa melebihi jam tutup operasional (23:00). Silakan kurangi durasi atau pilih jam lebih awal.');
        return;
    }
    
    const pricePerHour = 100000;
    const total = pricePerHour * duration;
    
    totalPriceEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
    paymentInfo.classList.remove('d-none');
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="px-4 fw-medium">${name}</td>
        <td class="px-4">${court}</td>
        <td class="px-4">${date}, ${time}</td>
        <td class="px-4">${duration} Jam</td>
        <td class="px-4"><span class="badge bg-warning text-dark">Menunggu Pembayaran</span></td>
    `;
    
    historyTableBody.insertBefore(newRow, historyTableBody.firstChild);
    
    window.scrollTo({
        top: paymentInfo.offsetTop - 100,
        behavior: 'smooth'
    });
    
    bookingForm.reset();
});