const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
//TODO: remove fs and use sequelize instead
const db = require('./models');
const methodOverride = require('method-override');
const port = 3000;

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/', function(req, res) {
    res.render('index')
});


// GET /dinosaurs - index route - get ALL dinos
app.get('/dinosaurs/', function(req, res) {
    // TODO remove file system stuff and use sequelize functions
    //let dinosaurs = fs.readFileSync("./dinosaurs.json");
    //let dinoData = JSON.parse(dinosaurs)
    db.dinosaur.findAll().then(function(dinosaurs) {
        res.render('dinosaurs/index', {dinosaurs});
    })
})

// GET /dinosaurs/new - serve up our NEW dino form
app.get('/dinosaurs/new', function(req,res) {
    res.render('dinosaurs/new');
})

// GET /dinosaurs/:id edit - serve up our EDIT dino form
app.get('/dinosaurs/:id/edit', function(req, res) {
    //let dinosaurs = fs.readFileSync('./dinosaurs.json');
    //let dinoData = JSON.parse(dinosaurs);
    //let id = parseInt(req.params.id);
    db.dinosaur.findOne({
        where: {id: parseInt(req.params.id)}
    })
        .then(function(dinosaur) {
            res.render('dinosaurs/edit', {dinosaur});
        });
});

// GET /dinosaurs/:id - show route - get ONE dino
app.get('/dinosaurs/:id', function(req, res) {
    //let dinosaurs = fs.readFileSync('./dinosaurs.json');
    //let dinoData = JSON.parse(dinosaurs);
    //let id = parseInt(req.params.id)
    db.dinosaur.findByPk(parseInt(req.params.id))
    .then(function(dinosaur) {
        res.render('dinosaurs/show', {dinosaur})
    });
})


// POST /dinosaurs/:id - show route - gets ONE dino
//app.get('/dinosaurs/id', function(req, res) {
    //let dinosaurs = fs.readFileSync('./dinosaurs.json');
    //let dinoData = JSON.parse(dinosaurs);
//})


//POST /dinosaurs
app.post('/dinosaurs', function(req, res) {
    // read in our json file
    //let dinosaurs = fs.readFileSync('./dinosaurs.json');
    // convert it into an array
    //let dinoData = JSON.parse(dinosaurs);
    // push our new data into an array
    let newDino = {
        type: req.body.type,
        name: req.body.name
    }
    //dinoData.push(newDino);
    // write the array back to the file
    //fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    db.dinosaur.create(newDino).then(function(dino) {
        res.redirect('/dinosaurs');
    })
})


app.delete('/dinosaurs/:id', function(req, res) {
    db.dinosaur.destroy ({
        where: {id: parseInt(req.params.id)}
        }).then(function(response) {
        res.redirect('/dinosaurs');
        })
});

app.put('/dinosaurs/:id', function(req, res) {
    db.dinosaur.update({
        name: req.body.name,
        type: req.body.type
    }, {
        where: {id: parseInt(req.params.id)}
        }).then(function(dino){
        res.redirect('/dinosaurs/' + req.params.id);
        })
});


app.listen(port, function() {
    console.log('We are listening on port: ' + port);
})



