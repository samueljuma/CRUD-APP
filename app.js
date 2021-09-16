const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

// database connection
const mysql = require('mysql');

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'exp_crud'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM writers";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('writer_index', {
            title : 'CRUD Application ExpressJS / MySQL',
            writers : rows
        });
    });
});


app.get('/add',(req, res) => {
    res.render('writer_add', {
        title : 'Add New Entry'
    });
});
 
app.post('/save',(req, res) => { 
    let data = {name: req.body.name, phone: req.body.phone, residence: req.body.residence, tasks_handled: req.body.tasks_handled};
    let sql = "INSERT INTO writers SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


app.get('/edit/:writerId',(req, res) => {
    const writerId = req.params.writerId;
    let sql = `Select * from writers where writer_id = ${writerId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('writer_edit', {
            title : 'Edit Fields',
            writer : result[0]
        });
    });
});

app.post('/update',(req, res) => {
    const writerId = req.body.writer_id;
    let sql = "UPDATE writers SET name='"+req.body.name+"', phone='"+req.body.phone+"', residence='"+req.body.residence+"', tasks_handled='"+req.body.tasks_handled+"', where writer_id ="+writerId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/delete/:writerId',(req, res) => {
    const writerId = req.params.writerId;
    let sql = `DELETE from writers where writer_id = ${writerId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});
 


// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});
