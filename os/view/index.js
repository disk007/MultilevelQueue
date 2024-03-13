let tb = document.getElementById("tb");
let add = document.getElementById("add");
let tHead = document.getElementById("tHead");
add.addEventListener("click", function () {
    tb.classList.add("table-bordered");
    let id = 1;
    let status = "New";
    let arrivalTime = 3;
    let burstTime = 5;
    let waitingTime = 0;
    let ioTime = 0;
    data = [id, status, arrivalTime, burstTime, waitingTime, ioTime];
    let tr = document.createElement("tr");

    for (let i = 0; i < data.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = data[i];
        tr.appendChild(th);
    }
    tb.appendChild(tr);
    tHead.appendChild(tr);
});
