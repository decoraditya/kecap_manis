document.addEventListener("DOMContentLoaded", () => {
    feather.replace();

    const dropdownTrigger = document.querySelector("#productsDropdown .dropdown-trigger");
    const dropdownParent = document.getElementById("productsDropdown");

    dropdownTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        dropdownParent.classList.toggle("open");
    });

    const menuToggle = document.getElementById("menuToggle");
    const appSidebar = document.getElementById("appSidebar");

    menuToggle.addEventListener("click", () => {
        appSidebar.classList.toggle("active");
    });

    const invoiceForm = document.getElementById("invoiceForm");
    invoiceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const invoiceNo = document.getElementById("invoiceNo").value;
        const invoiceNotes = document.getElementById("invoiceNotes").value;
        if (invoiceNo || invoiceNotes) {
            console.log("RECORD SAVED:", { invoiceNo, invoiceNotes });
            invoiceForm.reset();
        }
    });

    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchInput = searchForm.querySelector(".search-input").value;
        console.log("SEARCH QUERY:", searchInput);
    });

    const table = document.getElementById("customersTable");
    const headers = table.querySelectorAll("th");
    const tbody = table.querySelector("tbody");
    let sortDirections = Array.from(headers).map(() => false);

    headers.forEach((header) => {
        header.addEventListener("click", () => {
            const colIndex = parseInt(header.getAttribute("data-col"));
            const sortType = header.getAttribute("data-sort");
            const isAscending = sortDirections[colIndex];
            
            sortDirections[colIndex] = !isAscending;

            const rows = Array.from(tbody.querySelectorAll("tr"));

            rows.sort((a, b) => {
                const cellA = a.children[colIndex].textContent.trim();
                const cellB = b.children[colIndex].textContent.trim();

                if (sortType === "number") {
                    return isAscending 
                        ? parseFloat(cellB) - parseFloat(cellA)
                        : parseFloat(cellA) - parseFloat(cellB);
                } else {
                    return isAscending
                        ? cellB.localeCompare(cellA)
                        : cellA.localeCompare(cellB);
                }
            });

            tbody.innerHTML = "";
            rows.forEach(row => tbody.appendChild(row));
            feather.replace();
        });
    });
});