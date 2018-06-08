class DataBase {
    addTask(Task){}
    getAllTask(){}
    updateTask(id,newTask){}
    removeTask(id){}
    markTaskComplete(id){}

}
class LocalStorage extends DataBase{
    constructor(){
        super();
        this.key="taskToDo";
        localStorage[this.key]=localStorage[this.key]?localStorage[this.key]:JSON.stringify([]);
    }
    addTask(Task){
        var curTasks=JSON.parse(localStorage[this.key]);
        curTasks.push(Task);
        localStorage[this.key]=JSON.stringify(curTasks);
    }
    getAllTask(){
        if(!localStorage[this.key]){
            return new Error("Key Not Available");
        }
        var curTasks=JSON.parse(localStorage[this.key]);
        return curTasks;
    }
    updateTask(id,newTask){
        var curTasks=JSON.parse(localStorage[this.key]);
        var index = curTasks.findIndex((task)=>task.id==id);
        if(index==-1){
            return new Error("Not a valid id");
        }
        curTasks[index].task = newTask;
        localStorage[this.key]=JSON.stringify(curTasks);
    }
    removeTask(id){

        var curTasks=JSON.parse(localStorage[this.key]);
        var index = curTasks.findIndex((task)=>task.id==id);
        if(index==-1){
            return new Error("Not a valid id");
        }
        curTasks.splice(index,1);
        localStorage[this.key]=JSON.stringify(curTasks);
    }
    markTaskComplete(id){
        var curTasks=JSON.parse(localStorage[this.key]);
        var index = curTasks.findIndex((task)=>task.id==id);
        console.log(index);
        if(index==-1){
            return new Error("Not a valid id");
        }
        curTasks[index].isDone=!curTasks[index].isDone;
        localStorage[this.key]=JSON.stringify(curTasks);
    }
}


class JSDB extends DataBase{
    constructor(){
        super();
        this.url = "http://localhost:3000/";
        this.xhttp = new XMLHttpRequest();
        this.key="taskToDo";
    }

    get(key){
        var that = this;
        this.xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                that = JSON.parse(this.responseText);
            }
        };
        this.xhttp.open("GET", this.url + key, false);
        this.xhttp.send();
        return that;
    }

    post(key,data){
        this.xhttp.open("POST", this.url + key, false);
        this.xhttp.setRequestHeader("Content-type", "application/json");
        this.xhttp.send(JSON.stringify(data));
    }
    put(key,data,id){
        this.xhttp.open("PUT", this.url + key + "/" + id, false);
        this.xhttp.setRequestHeader("Content-type", "application/json");
        this.xhttp.send(JSON.stringify(data));
    }
    delete(key,id){
        this.xhttp.open("DELETE", this.url + key + "/" + id, false);
        this.xhttp.send();
    }
    addTask(Task){
        this.post(this.key,Task);
    }
    getAllTask(){
        var curTasks=this.get(this.key);
        return curTasks;
    }
    removeTask(id){
        this.delete(this.key,id);
    }
    updateTask(id,newTask){
        var curTask=this.get(this.key+"/"+id);
        curTask.task = newTask;
        this.put(this.key,curTask,curTask.id);
    }
    markTaskComplete(id){
        var curTask=this.get(this.key+"/"+id);
        curTask.isDone = !curTask.isDone;
        this.put(this.key,curTask,curTask.id);
    }
}

export default class DataBaseFactory{
    static makeDatabase(type){
        switch(type){
            case "JSDB":
                return new JSDB();
            case "LocalStorage":
                return new LocalStorage();
        }
    }
}
