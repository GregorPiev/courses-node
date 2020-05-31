const {Router} = require('express');
const router = Router();
const Course = require('../models/courses');

router.get('/', async (req, res) =>{
   const courses = await Course.find();
   res.render('courses', {
      title: 'List of Courses',
      isCourses: true,
      courses   
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
   await Course.findByIdAndUpdate(req.body.id, req.body);
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