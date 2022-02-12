import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';
import db from './dbConfig.js';
import {DB_USERNAME, DB_PASSWORD} from './Const.js';
import Adresa from './entities/Adresa.js';
import JobEmployee from './entities/JobEmployee.js';
import Joburi from './entities/Joburi.js';
import Employee from './entities/Employee.js';
import LikeOp from './Operators.js';

let app = express();
let router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

let conn;

mysql.createConnection({
    user: DB_USERNAME,
    password: DB_PASSWORD
})
.then(connection => {
    conn = connection;
    return connection.query("CREATE DATABASE IF NOT EXISTS Seminar9");
})
.then(() => {
    return conn.end();
})
.catch((err) => {
    console.warn(err.stack);
})

Employee.hasMany(Adresa, {as : "Adrese", foreignKey: "EmployeeId"});
Adresa.belongsTo(Employee, {foreignKey: "EmployeeId"});

Employee.belongsToMany(Joburi, {through: "JobEmployee", as: "Jobs", foreignKey: "EmployeeId"});
Joburi.belongsToMany(Employee, {through: "JobEmployee", as: "Employees", foreignKey: "JobId"});

db.sync();

// ---------------------- Begin Logic -------------------------

async function getEmployees(){
    return await Employee.findAll({include: ["Adrese"]});
}

async function getEmployeById(id){
    return await Employee.findByPk(id, {include: ["Adrese"]});
}

async function createEmployee(employee){
    return await Employee.create(employee, {include: [{model: Adresa, as : "Adrese"}]});
}

async function createJob(job){
    return await Joburi.create(job);
}

async function associatejobEmployee(jobEmployee){
    return await JobEmployee.create(jobEmployee);
}

async function getEmployeeByName(name){
    return await Employee.findAll({where: name ? {EmployeeName: name} : undefined})
}

async function filterEmployee(filter){
    let whereClause = {};

    if (filter.employeeName)
        whereClause.EmployeeName = {[LikeOp]: `%${filter.employeeName}%`};

    if (filter.employeeSurName)
        whereClause.EmployeeSurName = {[LikeOp]: `%${filter.employeeSurName}%`};   
        
    let whereIncludeClause = {};
    
    if (filter.city)
        whereIncludeClause.City = {[LikeOp]: `%${filter.city}%`};

    return await Employee.findAll({
        include:[
            {
                model: Adresa,
                as: "Adrese",
                where: whereIncludeClause
            }
        ],
        where: whereClause
    });    
}

// ------------------------ End Logic ------------------------



// ---------------------- Begin routes ------------------------

router.route('/employee').get(async (req, res) => {
    return res.json(await getEmployees());
})

router.route('/employee/:id').get(async (req, res) => {
    return res.json(await getEmployeById(req.params.id));
})

router.route('/employee').post(async (req, res) => {
    return res.send(201).json(await createEmployee(req.body));
})

router.route('/job').post(async (req, res) => {
    return res.send(201).json(await createJob(req.body));
})

router.route('/jobEmployee').post(async (req, res) => {
    return res.json(await associatejobEmployee(req.body));
})

router.route('/employeeFilter').get(async (req, res) => {
    return res.json(await getEmployeeByName(req.query.name));
})

router.route('/employeeFilter2').get(async (req, res) => {
    return res.json(await filterEmployee(req.query));
})

// --------------------- End routes --------------------------

let port = process.env.PORT || 8000;
app.listen(port);
console.log(`API is running at ${port}`);