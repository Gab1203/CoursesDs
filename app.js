const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const path = require('path')


const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json)

const db = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: 'Gab123',
    database: 'curso_online'
})

db.connect((err) => {

    if(err){

        throw err
    }
    console.log('Conectado ao banco de dados!')

})



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})



app.post('/submit', (req,res) => {

    const {gmail, senha} = req.body
    const query = 'INSERT INTO usuario values (?,?)'
    db.query(query, [gmail, senha], (err, result) => {

        if(err){
            throw err
        }
        res.json({ message: 'Cadastro realizado!'})
    } )

})

app.get('/getData', (req,res) => {
    const query = 'SELECT * FROM usuario'
    db.query(query, (err,results) => {
        if(err){
            throw err
        }
        res.json(results)
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})






app.post('/auth', function(req,res) {
        let gmail = req.body.gmail
        let senha = req.body.senha

        if(gmail && senha){
            db.query('SELECT * FROM usuario where gmail = ? and senha = ?', [gmail,senha], function(error, results, fields){

                if(err) throw err

                if(results.length > 0){
                    
                    res.redirect('/Home')
                }else{
                    res.send('Gmail ou senha incorretos!')
                }
                res.end()
            })
        }else{

            res.send('Digite um gmail e senha!')
            res.end()
        }
})

/*
app.get('/home', function(req,res){
if(req.session.loggedin){
    res.end('Bem-vindo de volta, ' + req.session.gmail )

}else{

    res.send('Faça login para acessar essa página!')
}

res.end()

})
*/

