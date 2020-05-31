const { Router } = require('express');
const router = Router();
const Course = require('../models/courses');

router.get('/', async (req, res) => {
   const courses = await Course.find()
    .populate('userId')
    .select('email name');

   res.render('courses', {
      title: 'List of Courses',
      isCourses: true,
      courses
   });
});

router.get('/:id/edit', async (req, res) => {
   if (!req.query.allow) {
      return res.redirect('/');
   }

   const course = await Course.findById(req.params.id);
   courseTest = {
      id: Number,
      title: String,
      price: String,
      img: String
   };
   courseTest.id = course._id;
   courseTest.title = course.title;
   courseTest.price = course.price;
   courseTest.img = course.img;

   res.render('course-edit', {
      title: `Edit course: ${courseTest.title}`,
      course: courseTest
   });
});

router.post('/update', async (req, res) => {   
   const { id } = req.body;
   delete req.body.id;

   await Course.findByIdAndUpdate(id, req.body);
   res.redirect('/courses');
});

router.post('/remove', async (req, res) => {
   try{
      await Course.deleteOne({
         _id: req.body.id
        });
        res.redirect('/courses'); 
   }catch(er){
     console.log('Error delete:', er);
     
   }
  
   
});

router.get('/:id', async (req, res) => {
   const course = await Course.findById(req.params.id);

   courseTest = {
      id: Number,
      title: String,
      price: String,
      img: String
   };
   courseTest.id = course._id;
   courseTest.title = course.title;
   courseTest.price = course.price;
   courseTest.img = course.img;


   res.render('course', {
      layout: 'empty',
      title: `Course ${courseTest.title}`,
      course: courseTest

   });
});

module.exports = router;