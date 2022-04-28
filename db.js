const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const p = require('path');
const path = p.join(home,'.todo');
const fs = require('fs');
const db = {
    read(){
        return new Promise((resolve,reject)=>{
        fs.readFile(path,{flat:'a+'},(error,data)=>{
            if(error) return reject(error)
                let list
                try{
                    list = JSON.parse(data.toString())
                }catch (error) {
                    list = []
                }
                resolve(list)
            })
        })
    },
    write(list){
        return new Promise((resolve,reject)=>{
            const string = JSON.stringify(list)
            fs.writeFile(path,string,(error)=>{
                if(error) reject(error)
                resolve()
            })
        })
    }
}
module.exports = db