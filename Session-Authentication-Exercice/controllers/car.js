const Car=require('../models/Car');
const Rent=require('../models/Rent');
const User=require('../models/User');

module.exports={
    addGet: (req,res)=>{
        res.render('car/add');
    },
    addPost:(req,res)=>{
        const carBody=req.body;
        carBody.pricePerDay=+carBody.pricePerDay;
        Car.create(carBody).then(()=>{
            res.redirect('/')
        }).catch(console.error);
    },
    allCars: (req,res)=>{
        Car.find({isRented:false})
        .then((cars)=>{
            res.render('car/all',{cars});
        }).catch(console.error)
    },
    rentGet: (req,res)=>{
        const carId=req.params.id;

        Car.findById(carId)
        .then((car)=>{
            res.render('car/rent',car);
        }).catch(console.error)
        
    },
    rentPost: (req,res)=>{
        const car=req.params.id;
        const user=req.user._id;
        const days=Number(req.body.days);

        Rent.create({
            days,
            user,
            car
        })
        .then(()=>{
            Car.findById(car)
            .then((c)=>{
               c.isRented=true;
              return c.save()
               
            })
            .then(()=>{
                 res.redirect('/car/all');
            }).catch(console.error);
            
        }).catch(console.error);
    },
    editGet: (req,res)=>{
        const carId=req.params.id;
        Car.findById(carId).then((car)=>{
            res.render('car/edit',car);
        })
        .catch(console.error)
    },
    editPost: (req,res)=>{
        const carId=req.params.id;
        const {model,imageUrl,pricePerDay}=req.body;

        Car.findById(carId).then((car)=>{
            car.model=model;
            car.imageUrl=imageUrl;
            car.pricePerDay=pricePerDay;
           return car.save();
        }).then(()=>{
            res.redirect('/car/all')
        })
        .catch(console.error);
    },
    rented: (req, res) => {
        let id = req.user._id
        Rent.find({ user: id }).populate('user').populate('car').then(
            info => {
                res.render('user/rented', {info})

            })
}
}