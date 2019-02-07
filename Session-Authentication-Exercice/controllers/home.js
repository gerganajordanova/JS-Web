const Car = require('../models/Car')

module.exports = {
    index: (req, res) => {
        res.render('home/index');
    },
    searchingModel: (req, res) => {
        let searchingModel = req.query.model
        let searchedCars = []
        Car.find({}).then(allCars => {
            for (let car of allCars) {
                car.model = car.model.toLowerCase()
                let model = car.model.split(/\s+/)
                if (model.indexOf(searchingModel) >= 0) {
                    car.newModel = car.model.replace(/\b\w/g, function(l){ return l.toUpperCase() })
                    searchedCars.push(car)
                }
            }

            res.render('query/searchingModel', { searchedCars })
        })
        
    },
};