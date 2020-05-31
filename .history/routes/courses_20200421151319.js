const {Router} = require('express');
const router = Router();
const Course = require('../models/courses');

router.get('/', async (req, res) =>{
  const courses = await Course.find();
  const coursesList = [];

   // console.log('Courses=>courses get:', courses[0]['title']);
   courses.map(item =>{
      console.log(item);
      courseTest = {
         id: Number,
         title: String,
         price: String,
         img: String
      };
      courseTest.id = item._id;
      courseTest.title = item.title;
      courseTest.price = item.price;
      courseTest.img = item.img;         
      coursesList.push(courseTest);
   });

   

   res.render('courses', {
      title: 'List of Courses',
      isCourses: true,
      courses: coursesList 
  }); 
});

router.get('/:id/edit', async(req, res) => {
   if(!req.query.allow) {
      return res.redirect('/');
   }

   const course = await Course.findById(req.params.id);

   res.render('course-edit', {
      title: `Edit course: ${course.title}`,
      course
   });
});

router.post('/update', async (req, res) => {
   console.log('Edit:', req.body);
   const {id} = req.body;
   delete req.body.id;

   await Course.findByIdAndUpdate(id, req.body);
   res.redirect('/courses');
});

router.get('/:id', async (req, res) => {
   const course = await Course.findById(req.params.id);
   res.render('course', {
      layout: 'empty',     
      title: `Course ${course.title}`,
      course

   });
});

module.exports = router;