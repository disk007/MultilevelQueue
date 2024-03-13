import model from "../model/model.js";

export default class controller {
    constructor(){
        this.pid = 1; //ลำดับ process
        this.countProcesses = 0; // count process
        this.monitorQueue = []; // array ที่เก็บ monitorQueue
        this.usbQueue = []; // array ที่เก็บusbQueue
        this.jobQueue = []; // array ที่เก็บ jobQueue
        this.RRBQueue = []; // array ที่เก็บ roundRobinQueue
        this.FCFSQueue = []; // array firstComeFirstServedQueue
        this.terminateQueue = []; // array terminateQueue
        this.timeQuantum = 0;  // ตัวแปรที่ใช้เก็บ timeQuantum เพื่อกำหนดเวลาในการทำงานของ process
        this.timeRunning = 0;   //ตัวแปรที่ใช้เก็บ timeRunning เพื่อกำหนดลำดับการทำงาน
        this.waitingTime = 0; // ตัวแปรที่ใช้เก็บ waitingTime
        this.bTFcfs = 0; // // ตัวแปรที่ใช้เก็บ burstTime ของ FCFS
        this.resetTimeQuantum = null// ตัวแปรที่ใช่ดึงค่า timeQuantum เพื่อโยนค่าให้กับตัว Process แต่ละตัวให้ทํางานตาม timeQuantum
        this.burstTime = 0; // ตัวแปรที่ใช้เก็บ burstTime
        this.ioTime = 0;
        this.waitingTimeMon = 0;
        this.waitingTimeUsb = 0; 
        this.avgTTime = 0;
        this.avgWaitTime = 0;
        this.Momory = 1024;
        this.useMemory = 0;
        this.keepMemory = 0;
        this.Model = new model();
    }
    select(Precent){
        let lengthJobQueue = this.jobQueue.length;
        if(Precent<0.5){
            this.FCFSQueue.push(this.jobQueue[lengthJobQueue-1]); // add jobQueue to FCFSQueue
            this.jobQueue[lengthJobQueue-1].setSelectQueue(2); // setSelectQueue = 2
            console.log("FCFS");
        }
        else {
            this.RRBQueue.push(this.jobQueue[lengthJobQueue-1]); // add jobQueue to RRBQueue
            let lengthRRB = this.RRBQueue.length
            this.jobQueue[lengthJobQueue-1].setSelectQueue(1); // setSelectQueue = 1
            this.RRBQueue[lengthRRB-1].setTimeQuantum(this.resetTimeQuantum); // setTimeQuantum ให้กับ RRBQueue
            console.log("RRB");
        } 
    }
    addProcess(clock,timeQuantum){
        this.resetTimeQuantum = timeQuantum; // set timeQuantum ให้กับ resetTimeQuantum
        this.useMemory = (10*this.Momory)/100;  // เฉลี่ยให้ทุกใช้ memory เท่าๆกัน
        this.keepMemory += this.useMemory; 
        this.Model = new model(this.pid,"New",clock,0,0,0,0,this.useMemory); // add to model
        this.jobQueue.push(this.Model); // add model to jobQueue 
        this.select(Math.random()); // เมทอด สุ่มเลือกว่าจะเข้า FCFS หรือ RRB
        this.pid++; //เพิ่มค่า count ที่ละ 1
        this.countProcesses++; //เพิ่มค่า count ที่ละ 1
    }
    checkMomory(){
        let resultMemory = (this.keepMemory/this.Momory)*100; //หา % memory
        console.log(resultMemory);
        return (resultMemory).toFixed(2);
    }
    firstComeFirstServedQueue() {
        try {
            for (let i = 0; i < this.jobQueue.length; i++) { 
                if (this.FCFSQueue[0] === this.jobQueue[i]) { // เช็ค FCFS ตำแหน่งที่ 0 ว่าเท่ากับ jobQueue[i] 
                    this.jobQueue[i].setStatus("Running");  // setStatus ของ jobQueue ให้เป็น Running
                    this.burstTime = this.jobQueue[i].getBurstTime();  // ดึงค่า burstTime เก็บไว้ในตัวแปร burstTime
                    this.burstTime++;  
                    this.jobQueue[i].setBurstTime(this.burstTime); //set burstTime ให้กับ jobQueue 
                } else if (this.jobQueue[i].getStatus() !== "Waiting") {// เช็ค FCFS ที่ไม่เท่ากับ Waiting
                    this.jobQueue[i].setStatus("Ready"); // setStatus ของ jobQueue ให้เป็น Waiting
                }
            }
        } catch (e) {}
    }
    roundRobinQueue(){
        try {
            for (let i = 0; i < this.jobQueue.length; i++) {
                if (this.RRBQueue[0] === this.jobQueue[i]) {
                    this.timeQuantum = this.jobQueue[i].getTimeQuantum(); // getTimeQueantum เก็บไว้ในตัวแปร และ ลดค่า timeQuantum ลง
                    this.timeQuantum--; 
                    this.jobQueue[i].setTimeQuantum(this.timeQuantum); // set TimeQueantum ให้กับ jobQueue
                    console.log("timeQuantum ", this.timeQuantum); 
                    this.burstTime = this.jobQueue[i].getBurstTime(); // getBurstTime เก็บไว้ในตัวแปร และ บวกค่า BurstTime 
                    this.burstTime++;
                    this.jobQueue[i].setStatus("Running"); // setStatus ของ jobQueue ให้เป็น Running และ set burstTime ให้กับ jobQueue 
                    this.jobQueue[i].setBurstTime(this.burstTime);
                    if (this.jobQueue[i].getTimeQuantum() === 0) { // เช็คว่าถ้า TimeQuantum == 0  จะ setStatus == Ready 
                        this.jobQueue[i].setStatus("Ready");
                        this.RRBQueue.push(this.jobQueue[i]); // add jobQueue to RRBQueue
                        this.RRBQueue.shift(); // ลบ RRBQueue ตัวแรกออก 
                        this.RRBQueue[this.RRBQueue.length - 1].setTimeQuantum(this.resetTimeQuantum);//// กำหนดเวลาสำหรับกระบวนการที่ออกจากคิว RRBQueue ใหม่
                    }
                } else if (this.jobQueue[i].getStatus() !== "Waiting") {
                    this.jobQueue[i].setStatus("Ready");
                }
            }
        } catch (e) {}
    }
    startWaitingTime(){
        for (let i = 0; i < this.jobQueue.length; i++) {
            if (this.jobQueue[i].getStatus() === "Ready") { // ถ้า jobQueue == "Ready" ให้ waitingTime เพิ่มค่าและ setWaitingTime ให้กับ jobQueue 
                this.waitingTime = this.jobQueue[i].getWaitingTime();
                this.waitingTime++;
                this.jobQueue[i].setWaitingTime(this.waitingTime);
            }
        }
    }
    randomRunning(){
        try{
            if(!this.jobQueue.length == 0){ 
                if(this.FCFSQueue.length == 0){ // ถ้า FCFS ว่างให้เข้าไปทำ roundRobinQueue()
                this.roundRobinQueue();
                this.timeRunning = 0; 
                }
                else if(this.RRBQueue.length == 0){ //ถ้า RRB ว่างให้เข้าไปทำ firstComeFirstServedQueue()
                    this.firstComeFirstServedQueue();
                    this.timeRunning = 0;
                }
                else if(!this.FCFSQueue.length == 0 && !this.RRBQueue.length == 0){
                    if(this.timeRunning < 80 ){ // ถ้า timeRunning อยู่ระหว่าง 0 ถึง 79 ให้เข้าไปทำ roundRobinQueue()
                        this.roundRobinQueue();
                        this.timeRunning = ++this.timeRunning%100;
                    }
                    else if(this.timeRunning > 79 ){// ถ้า timeRunning อยู่ระหว่ง 80 ถึง 99 ให้เข้าไปทำ firstComeFirstServedQueue()
                        this.firstComeFirstServedQueue();
                        this.timeRunning = ++this.timeRunning%100;
                    }
                }
            }
            console.log("time running: " + this.timeRunning);
        
        }
        catch(e){}
    }
    //การทำงานของ monitor
    monitor(){
        try {
            this.ioTime = this.monitorQueue[0].getIOTime(); 
            this.ioTime++;
            this.monitorQueue[0].setIOTime(this.ioTime);
        } catch (e) {}
    }
    addMonitorQueue() {
        try {
            if (this.RRBQueue.length > 0) {
                for (let i = 0; i < this.RRBQueue.length; i++) {
                    if (this.RRBQueue[i].getStatus() === "Running") { // ถ้า RRBQueue  == Running ให้ setStaus เป็น Waiting 
                        this.RRBQueue[i].setStatus("Waiting");
                        this.monitorQueue.push(this.RRBQueue[i]); //add RRBQueue to monitorQueue
                        this.RRBQueue.splice(i, 1); //และRRBQueue ออก
                        break;
                    }
                }
            }
            if (this.FCFSQueue.length > 0) {
                for (let i = 0; i < this.FCFSQueue.length; i++) {
                    if (this.FCFSQueue[i].getStatus() === "Running") { // ถ้า FCFSQueue  == Running ให้ setStaus เป็น Waiting 
                        this.FCFSQueue[i].setStatus("Waiting"); 
                        this.monitorQueue.push(this.FCFSQueue[i]); //add FCFSQueue to monitorQueue
                        this.FCFSQueue.splice(i, 1); //และFCFSQueue ออก
                        break;
                    }
                }
            }
        } catch (e) {}
    }
    RemoveMonitorQueue() {
        try {
            if (this.monitorQueue[0].getSelectQueue() == 1) { // ถ้าเป็น RRB ให้ setStaus ของ monitorQueue ของ  เท่ากับ Ready แล้ว monitorQueue ให้กับ RRBQueue 
                this.monitorQueue[0].setStatus("Ready");
                this.RRBQueue.push(this.monitorQueue[0]);
                this.monitorQueue.shift();// และ monitorQueue ออก
            } 
            else if(this.monitorQueue[0].getSelectQueue() == 2){ // ถ้าเป็น FCFS ให้ setStaus ของ monitorQueue ของ  เท่ากับ Ready แล้ว monitorQueue ให้กับ FCFSQueue 
                this.monitorQueue[0].setStatus("Ready");
                this.FCFSQueue.push(this.monitorQueue[0]);
                this.monitorQueue.shift();// และ monitorQueue ออก
            }
        } catch (e) {}
    }
    waitingTimeMonitorQueue() {
        for (let i = 1; i < this.monitorQueue.length; i++) { 
            if (this.monitorQueue[i].getStatus() === "Waiting") {
                this.waitingTimeMon = this.monitorQueue[i].getwaitIO();  //โดย get ค่า waitingTime มาใช้งาน
                this.waitingTimeMon++; //เพิ่มค่า waitingTime ขึ้นทีละ 1
                this.monitorQueue[i].setwaitIO(this.waitingTimeMon);//โดยนําค่า waitingTime มาเก็บยัง setBurstTime ของ Process นั้น
            }
        }
    }
    usb(){
        try {
            this.ioTime = this.usbQueue[0].getIOTime();
            this.ioTime++;
            this.usbQueue[0].setIOTime(this.ioTime);
        } catch (e) {}
    }
    addUsbQueue() {
        try {
            if (this.RRBQueue.length > 0) {
                for (let i = 0; i < this.RRBQueue.length; i++) {
                    if (this.RRBQueue[i].getStatus() === "Running") {
                        this.RRBQueue[i].setStatus("Waiting");
                        this.usbQueue.push(this.RRBQueue[i]);
                        this.RRBQueue.splice(i, 1);
                        break;
                    }
                }
            }
            if (this.FCFSQueue.length > 0) {
                for (let i = 0; i < this.FCFSQueue.length; i++) {
                    if (this.FCFSQueue[i].getStatus() === "Running") {
                        this.FCFSQueue[i].setStatus("Waiting")
                        this.usbQueue.push(this.FCFSQueue[i]);
                        this.FCFSQueue.splice(i, 1);
                        break;
                    }
                }
            }
        } catch (e) {}
    }
    RemoveUsbQueue() {
        try {
            if (this.usbQueue[0].getSelectQueue() == 1) {
                this.usbQueue[0].setStatus("Ready");
                this.RRBQueue.push(this.usbQueue[0]);
                this.usbQueue.shift();
            } 
            else if(this.usbQueue[0].getSelectQueue() == 2){
                this.usbQueue[0].setStatus("Ready");
                this.FCFSQueue.push(this.usbQueue[0]);
                this.usbQueue.shift();
            }
        } catch (e) {}
    }
    waitingTimeUsbQueue() {
        for (let i = 1; i < this.usbQueue.length; i++) { 
            if (this.usbQueue[i].getStatus() === "Waiting") {  
                this.waitingTimeUsb = this.usbQueue[i].getwaitIO();  //โดย get ค่า waitingTime มาใช้งาน
                this.waitingTimeUsb++; //เพิ่มค่า waitingTime ขึ้นทีละ 1
                this.usbQueue[i].setwaitIO(this.waitingTimeUsb);//โดยนําค่า waitingTime มาเก็บยัง setBurstTime ของ Process นั้น
            }
        }
    }
    avgWaitingTime(waitingTime) {
        this.avgWaitTime = this.avgWaitTime + waitingTime;
    }
    getAvgWaitingTime() {
        if (this.terminateQueue.length == 0) {
            return 0;
        }
        else{
            return (this.avgWaitTime / this.terminateQueue.length).toFixed(2);
        }
    }
    avgTurnaroundTime(turnaroundTime) {
        this.avgTTime = this.avgTTime + turnaroundTime;
    }
    getAvgTurnaroundTime() {
        if (this.terminateQueue.length == 0) {
            return 0;
        }
        else{
            return (this.avgTTime / this.terminateQueue.length).toFixed(2);
        }
    }
    removeQueue(clock) {
        try {
            for (let i = 0; i < this.jobQueue.length; i++) { 
                if (!this.RRBQueue.length == 0) {
                    if (this.RRBQueue[0].getStatus() == "Running") {
                        if (this.RRBQueue[0] == this.jobQueue[i]) { 
                            this.jobQueue[i].setStatus("Terminate");
                            let arr = this.jobQueue[i].getArrivalTime();
                            this.jobQueue[i].setTurnaroundTime(clock-arr); // setTurnaroundTime โดยใช้เวลานะขณะนั้น
                            this.avgTurnaroundTime(this.jobQueue[i].getTurnaroundTime()); //getTurnaround ของ jobQueue เข้าเมทอด avgTurnaroundTime
                            this.terminateQueue.push(this.jobQueue[i]);//เพิ่มเข้า terminateQueue
                            this.avgWaitingTime(this.jobQueue[i].getWaitingTime()); //getWaiting ของ jobQueue เข้าเมทอด avgWaitingTime
                            this.jobQueue.splice(i,1); // ลบ jobQueue,RRBQueue และ ลดค่า count
                            this.RRBQueue.shift(); 
                            this.countProcesses--;
                            this.keepMemory -= (10*this.Momory)/100; 
                            break;
                        }
                    }
                }
                if (!this.FCFSQueue.length == 0) {
                    if (this.FCFSQueue[0].getStatus() == "Running") {
                        if (this.FCFSQueue[0] == this.jobQueue[i]) {
                            this.jobQueue[i].setStatus("Terminate");
                            let arr = this.jobQueue[i].getArrivalTime();
                            this.jobQueue[i].setTurnaroundTime(clock-arr); // setTurnaroundTime โดยใช้เวลานะขณะนั้น
                            this.avgTurnaroundTime(this.jobQueue[i].getTurnaroundTime()); //getTurnaround ของ jobQueue เข้าเมทอด avgTurnaroundTime
                            this.terminateQueue.push(this.jobQueue[i]); //เพิ่มเข้า terminateQueue
                            this.avgWaitingTime(this.jobQueue[i].getWaitingTime()); //getWaiting ของ jobQueue เข้าเมทอด avgWaitingTime
                            this.jobQueue.splice(i,1);// ลบ jobQueue,FCFSQueue และ ลดค่า count
                            this.FCFSQueue.shift();
                            this.countProcesses--;
                            this.keepMemory -= (10*this.Momory)/100; 
                            break;
                        }
                    }
                }
            }
        } catch (e) { }
    }
    
    
}
let c = new controller();
