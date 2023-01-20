const express = require('express');
const app = express();
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const connection = require('express-myconnection');

//Config connection BDD
const optionBd = {
    host : "localhost",
    user : "root",
    password : "",
    port : 3306,
    database : "notes_bd"
};

//Définition du middleware pour connexion avec la bdd
app.use(myConnection(mysql,optionBd,'pool'));

//Extraction des données du formulaire
app.use(express.urlencoded({extended:false}));


//Définition du moteur d'affichage
app.set("view engine", "ejs");
app.set("views", "IHM");


app.get('/', (req, res) => {

    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query('SELECT * FROM notes', [], (erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.status(200).render("index", {resultat});
                }
            })
        }
    })
});


//Pour ajouter des données ds ma base 
//La route notes correspond à ma table ds la BDD
app.post("/notes", (req, res)=>{
    let titre = req.body.titre;
    let description = req.body.description;

    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(
                'INSERT INTO notes(id, titre, description) VALUES(?,?,?)', 
                [null, titre, description], (erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.status(300).redirect('/');
                }
            })
        }
    })
});

app.delete("/notes/:id", (req, res)=>{
    let id = req.params.id;
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query('DELETE FROM notes WHERE id = ?', [id],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                   res.status(200).json({routeRacine : '/'}); 
                }
            })
        }
    })
})

app.get('/apropos', (req, res) => {
    res.status(200).render("apropos");
});

app.use((req, res) => {
    res.status(404).render("pageIntrouvable");
});

app.listen(3001);