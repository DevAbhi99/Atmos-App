const mysql=require('mysql2');

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Trishala@99',
    database:'atmosdb'
});

connection.connect((error)=>{

    if(error){
        console.log(`Could not successfully connect to database due to error ${error}`);
    }
    else{
        console.log('Successfully connected to database');
    }
})

module.exports=connection;