var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM students ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('students',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('students',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('students/add', {
        opiskelija: '',
        opintojakso: '',
        arviointi: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let opiskelija = req.body.opiskelija;
    let opintojakso	= req.body.opintojakso;
	let arviointi	= req.body.arviointi;
    let errors = false;

    if(opiskelija.length === 0 || opintojakso.length === 0 || arviointi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Lisaa opiskelija, opintojakso ja arviointi");
        // render to add.ejs with flash message
        res.render('students/add', {
            opiskelija: opiskelija,
            opintojakso: opintojakso,
			arviointi: arviointi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            opiskelija: opiskelija,
            opintojakso: opintojakso,
			arviointi: arviointi
        }
        
        // insert query
        dbConn.query('INSERT INTO students SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('students/add', {
                    opiskelija: form_data.opiskelija,
                    opintojakso: form_data.opintojakso,
                    arviointi: form_data.arviointi
                })
            } else {                
                req.flash('success', 'Student successfully added');
                res.redirect('/students');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM students WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Student not found with id = ' + id)
            res.redirect('/students')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('students/edit', {
                title: 'Edit Student', 
                id: rows[0].id,
                opiskelija: rows[0].opiskelija,
                opintojakso: rows[0].opintojakso,
				arviointi: rows[0].arviointi
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let opiskelija = req.body.opiskelija;
    let opintojakso = req.body.opintojakso;
	let arviointi = req.body.arviointi;
    let errors = false;

    if(opiskelija.length === 0 || opintojakso.length === 0 || arviointi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Lisaa opiskelija, opintojakso ja arviointi");
        // render to add.ejs with flash message
        res.render('students/edit', {
            id: req.params.id,
            opiskelija: opiskelija,
            opintojakso: opintojakso,
			arviointi: arviointi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            opiskelija: opiskelija,
            opintojakso: opintojakso,
			arviointi: arviointi
        }
        // update query
        dbConn.query('UPDATE students SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('students/edit', {
                    id: req.params.id,
                    opiskelija: form_data.opiskelija,
                    opintojakso: form_data.opintojakso,
                    arviointi: form_data.arviointi
                })
            } else {
                req.flash('success', 'Student successfully updated');
                res.redirect('/students');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM students WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/students')
        } else {
            // set flash message
            req.flash('success', 'Student successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/students')
        }
    })
})

module.exports = router;