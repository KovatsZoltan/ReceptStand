var express = require('express');
var passport = require('passport');
var router = new express.Router;

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.flash('error', 'A kért tartalom megtekintéséhez be kell jelentkezni!');
    res.redirect('/login/login');
}

function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        } else {
            //res.status(403).send('mennyinnen');
            req.flash('error', 'Nem vagy jogosult erre a műveletre!');
            res.redirect('/list');
        }
    }
}

router.route('/login/login')
    .get(function (req, res) {
        res.render('login/index', {
            uzenetek: req.flash()
        });
    })
    .post(passport.authenticate('local-login', {
        successRedirect: '/list',
        failureRedirect: '/login/login',
        failureFlash: true,
        badRequestMessage: 'Hibás felhasználó vagy jelszó!'
    }));
    
router.route('/login/signup')
    .get(function (req, res) {
        res.render('login/signup', {
            uzenetek: req.flash()
        });
    })
    .post(passport.authenticate('local-signup', {
        successRedirect:    '/login/login',
        failureRedirect:    '/login/signup',
        failureFlash:       true,
        badRequestMessage:  'Hiányzó adatok'
    }));

router.use('/login/logout', function (req, res) {
    req.logout();
    res.redirect('/login/login');
});

router.route('/')
    .get(function (req, res) {
        res.render('info');
    });
router.route('/add')
    .get(ensureAuthenticated, function (req, res) { 
        res.render('add', {
            uzenetek: req.flash()
        }); 
    })
    .post(ensureAuthenticated, function (req, res) {
        //console.log("The request: "+ req.xhr);
        console.log("Bodyja:" + req.body);
        req.checkBody('foodName').notEmpty().withMessage('Kihagytad az étel nevét!');
        req.checkBody('ingredients').notEmpty().withMessage('Kihagytad a hozzávalókat!');
        req.checkBody('preparation').notEmpty().withMessage('Hogy készíted el? Kihagytad...');
        if (req.validationErrors()) {
            req.validationErrors().forEach(function (error) {
                req.flash('error', error.msg);
            });
            if(req.xhr){
                res.status(400).send(req.flash());
            }else{
                res.redirect('/add');    
            }
            
        } else {
            req.app.models.recipe.create({
                foodName: req.body.foodName,
                foodType: req.body.foodType,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation
            })
            .then(function () {
                req.flash('success', 'Recept sikeresen létrehozva.');
                if (req.xhr) {
                res.status(200).send(req.flash());
                } else {
                    res.redirect('/add');
                }
            });
        }
    });
router.route('/list')
    .get(ensureAuthenticated, function (req, res) {
        
        var result;
        
        if (req.query.kereses) {
            result = req.app.models.recipe.find({
                foodName: { 'contains': req.query.kereses }
            });
        } else {
            result = req.app.models.recipe.find();
        }
        
        result.then(function (recipes) {
            res.render('list', {
                uzenetek: req.flash(),
                recipes: recipes
            });
        });
    });
router.route('/delete/:id')
    .get(ensureAuthenticated, function (req, res) {
        req.app.models.recipe.destroy({
            id: req.params.id
        }).then(function () {
            req.flash('success', 'Recept törölve.');
            res.redirect('/list');  
        });
    });

router.route('/recipe/:id')
    .get(ensureAuthenticated, function (req, res) {
        //console.log(req.params);
        req.app.models.recipe.findOne({
            id: req.params.id
        }).then(function (recipe) {
            if (req.xhr) {
                res.render('recipe', {
                    recipe: recipe,
                    layout: false
                });
            } else {
                res.render('recipe', {
                    recipe: recipe
                });
            }
        });
    });
    
router.route('/alter/:id')
    .get(ensureAuthenticated, function (req, res) {
        //console.log(req.params);
        req.app.models.recipe.findOne({
            id: req.params.id
        }).then(function (recipe) {
            if (req.xhr) {
               res.render('alter', {
                recipe: recipe
            })
            } else {
                res.render('alter', {
                    recipe: recipe
                });
            }
        });
    });
    
router.route('/alter')
    .post(ensureAuthenticated, function (req, res) {
        console.log(req.body.id);
        req.checkBody('foodName').notEmpty().withMessage('Kihagytad az étel nevét!');
        req.checkBody('ingredients').notEmpty().withMessage('Kihagytad a hozzávalókat!');
        req.checkBody('preparation').notEmpty().withMessage('Hogy készíted el? Kihagytad...');
         if (req.validationErrors()) {
            req.validationErrors().forEach(function (error) {
                req.flash('error', error.msg);
            });
            if(req.xhr){
                res.status(400).send(req.flash());
            }else{
                res.redirect('/alter');    
            }
            
        } else {
            req.app.models.recipe.update({
                id: req.body.id
                }, {
                    foodName: req.body.foodName,
                    foodType: req.body.foodType,
                    ingredients: req.body.ingredients,
                    preparation: req.body.preparation
                }).then(function () {
                     req.flash('success', 'Recept sikeresen módosítva.');
                    if (req.xhr) {
                    res.status(200).send(req.flash());
                    } else {
                        res.redirect('/list');
                }
                });
        }
    });
    
router.route('/modal')
    .get(function (req, res) {
       if (req.xhr) {
           res.render('partials/modal', {
               layout: false
           });
       } 
    });
module.exports = router;