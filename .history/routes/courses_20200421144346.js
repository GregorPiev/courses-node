const {Router} = require('express');
const router = Router();
const Course = require('../models/courses');

router.get('/', async (req, res) =>{
   let corsesList = [];
   const courses = await Course.find();

   console.log('Courses=>courses get:', courses);
   corsesList.push(courses);
   console.log('Courses=>corsesList get:', corsesList);

   res.render('courses', {
      title: 'List of Courses',
      isCourses: true,
      courses: corsesList 
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