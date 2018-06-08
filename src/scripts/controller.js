import  DatabaseFactory from './database.js'
var database=DatabaseFactory.makeDatabase("JSDB");

var controller = {

    getAllTasks:()=>{
        return database.getAllTask();
    },

    addTask:(newTask)=>{
        database.addTask({task:newTask,isDone:false,id:controller.getId()});
    },

    changeTask:(id,newTask)=>{
        database.updateTask(id,newTask);
    },

    removeTask:(id)=>{
        database.removeTask(id);
    },


    markTaskComplete:(id)=>{
        database.markTaskComplete(id);
    },

    removeCompletedTask:()=>{
        var taskToDo=database.getAllTask();
        taskToDo.forEach(task=>task.isDone&&database.removeTask(task.id));
    },

    getCurrentState:()=>{
        return database.getCurrentState();
    },

    setCurrentState:(newState)=>{
        database.setCurrentState(newState);
    },

    getId:()=>{
        var taskToDo=database.getAllTask();
        const max=taskToDo.reduce((curMax,{id})=> Math.max(curMax,id),-1);
        return max+1;
    }
}
export default controller;


