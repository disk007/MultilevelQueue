export default class model{
    timeQuantum;
    selectQueue;
    turnaroundTime;
    constructor(processID,status,arrivalTime,burstTime,waitingTime,ioTime,waitIO,useMemory) {
        this.processID = processID;
        this.status = status;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.waitingTime = waitingTime;
        this.ioTime = ioTime;
        this.waitIO = waitIO;
        this.useMemory = useMemory;
    }
    setProcessID(processID){
        this.processID = processID;
    }
    setArrivalTime(arrivalTime){
        this.arrivalTime = arrivalTime;
    }
    setWaitingTime(waitingTime){
        this.waitingTime = waitingTime;
    }
    setIOTime(ioTime){
        this.ioTime = ioTime;
    }
    setBurstTime(burstTime){
        this.burstTime = burstTime;
    }
    setTimeQuantum(timeQuantum){
        this.timeQuantum = timeQuantum;
    }
    setTurnaroundTime(turnaroundTime){
        this.turnaroundTime = turnaroundTime;
    }
    setStatus(status){
        this.status = status;
    }
    getStatus(){
        return this.status;
    }
    getProcessID(){
        return this.processID;
    }
    getArrivalTime(){
        return this.arrivalTime;
    }
    getWaitingTime(){
        return this.waitingTime;
    }
    getIOTime(){
        return this.ioTime;
    }
    getBurstTime(){
        return this.burstTime;
    }
    getTimeQuantum() {
        return this.timeQuantum;
    }
    getTurnaroundTime(){
        return this.turnaroundTime;
    }
    setSelectQueue(selectQueue){
        this.selectQueue = selectQueue;
    }
    getSelectQueue(){
        return this.selectQueue;
    }
    setwaitIO(waitIO){
        this.waitIO = waitIO;
    }
    getwaitIO(){
        return this.waitIO;
    }
}