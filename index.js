const db = require('./db')
const inquirer = require('inquirer')
module.exports.add = async(title)=>{
	const list = await db.read()
	list.push({title,done:false})
	await db.write(list)
}

module.exports.clear = async(title)=>{
	await db.write([])
}

module.exports.showAll = async()=>{
	const list = await db.read()
	printTasks(list)
}


function printTasks(list) {
	inquirer
		.prompt(
			{
				type:'list',
				name:'index',
				message:'请选择需要操作的任务',
				choices: [...list.map((task,index)=>{
					return {name:`${index+1}. ${task.title} 【${task.done ? '已完成':'未完成'}】`,value:index.toString()}
				}),{name:'+ 创建任务',value:'-2'},{name:'退出',value:'-1'}]
			}).then(answer=>{
		const index = parseInt(answer.index)

		if(index>=0){
			askForAction(list,index)
		}else if(index === -2){
			createTask(list)
		}
	})
}//操作任务||创建任务

function createTask(list) {
	inquirer.prompt({
		type:'input',
		name:'title',
		message:'输入标题名'
	}).then(answer =>{
		list.push({
			title:answer.title,
			done:false
		})
		db.write(list)
	})
}//创建任务

function askForAction(list,index) {
	const actions = {markAsDone, markAsUndone, update, remove}
	inquirer
		.prompt(
			{
				type:'list',
				name:'action',
				message:'请选择操作',
				choices: [
					{name:'已完成',value:'markAsDone'},
					{name:'未完成',value:'markAsUndone'},
					{name:'修改标题',value:'update'},
					{name:'删除',value:'remove'},
					{name:'退出',value:'quit'},
				]
			}).then(answer=>{
		const action = actions[answer.action]
		action && action(list,index)
	})
}//操作任务

function markAsDone(list,index) {
	list[index].done = true
	db.write(list)
}//1

function markAsUndone(list,index) {
	list[index].done = false
	db.write(list)
}//2

function update(list,index) {
	inquirer.prompt({
		type:'input',
		name:'title',
		message:'新的标题',
		default:list[index].title
	}).then(answer =>{
		list[index].title = answer.title
		db.write(list)
	})
}//3

function remove(list,index) {
	list.splice(index,1)
	db.write(list)
}//4
