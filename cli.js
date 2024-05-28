#! /usr/bin/env node
const pkg = require('./package.json')
const colors = require('colors')
const axios = require('axios')
const inquirer = require('inquirer')
const { program } = require('commander')
program.version(pkg.version).description('查看版本号')
program.description('命令行中的apiPost').action(async()=>{
  console.log('fs');
  const result = await inquirer.prompt([
    {
      type: "list",
      name: "method",
      message: "请选择请求方法",
      choices: ['get','post','put','delete','patch','options'],
      default: "GET"
    },
    {
      type: "input",
      name: "address",
      message: "请输入请求地址",
      default: "",
      validate: (value)=>{
        if(value.length < 1){
          return '此选项必填'
        }
        if(!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value)){
          return '请输入正确的地址'
        }
        return true;
      }
    },
    {
      type: "input",
      name: "params",
      message: "请输入参数(用,号分隔)",
      default: ""
    },
  ]);
  startHttp(result)
})
function startHttp(result) {
    axios[result.method](result.address,{
      params:toObj(result.params),
      timeout:2000,
    })
    .then(res=>{
      console.log(colors.rainbow('success').inverse);
      console.log(res.data);
    })
    .catch (error => {
      console.log('请求出错'.inverse);
      console.log('请确认方法和地址是否正确，错误原因：');
      console.log(colors.underline.red(error.response.status,error.response.statusText));
    });
}
function toObj(str) {
  if(!str) return;
  const obj = {};
// 基于分隔符解析字符串并赋值给对象
str.split(',').forEach(pair => {
  const [key, value] = pair.split(':');
  obj[key] = value;
});
return obj
}
program.command('get').description('get请求').action(async()=>{
  const {address} = await inquirer.prompt([
    {
      type: "input",
      name: "address",
      message: "请输入请求地址",
      default: "",
      validate: (value)=>{
        if(value.length < 1){
          return '此选项必填'
        }
        if(!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value)){
          return '请输入正确的地址'
        }
        return true;
      }
    },
  ]);
  startHttp({method:'get',address:address,params:''})
})
program.command('post').description('post请求').action(async()=>{
  const {address,params} = await inquirer.prompt([
    {
      type: "input",
      name: "address",
      message: "请输入请求地址",
      default: "",
      validate: (value)=>{
        if(value.length < 1){
          return '此选项必填'
        }
        if(!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value)){
          return '请输入正确的地址'
        }
        return true;
      }
    },
    {
      type: "input",
      name: "params",
      message: "请输入参数(用,号分隔)",
      default: ""
    },
  ]);
  startHttp({method:'post',address:address,params:params})
})
program.parse(process.argv);
