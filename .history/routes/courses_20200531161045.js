const { Router } = require('express');
const router = Router();
const Course = require('../models/courses');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');
const courseValidation = require('../utils/validators');

function isOwner(course, req) {
   return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
   try {
      const courses = await Course.find()
         .populate('userId', 'email name')
         .select('price title img');

      res.render('courses', {
         title: 'List of Courses',
         isCourses: true,
         userId: req.user ? req.user._id.toString() : null,
         courses
      });
   } catch (err) {
      console.error('Get list of courses:', err);
   }
});

router.get('/:id/edit', auth, async (req, res) => {
   if (!req.query.allow) {
      return res.redirect('/');
   }

   try {
      const course = await Course.findById(req.params.id);

      if (!isOwner(course, req)) {
         return res.redirect('/courses');
      }

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
   } catch (err) {
      console.error('Edit course:', err)
   }

});

router.post('/update', auth, courseValidation.courseValidators, async (req, res) => {
   const errorEdit = validationResult(req);
   if (!errorEdit.isEmpty()) {
      console.info('Enter in get course after get Error');
      return res.status(422).render('courses/:id/edit', {
         error: errorEdit.array()[0].msg
      });
   }


   try {
      const { id } = req.body;
      const course = await Course.findById(id);

      if (!isOwner(course, req)) {
         return res.redirect('/courses');
      }

      delete req.body.id;
      Object.assign(course, req.body);
      await course.save();

      res.redirect('/courses');
   } catch (err) {
      console.error('Update course:', err);
   }
});

router.post('/remove', auth, async (req, res) => {
   try {
      await Course.deleteOne({
         _id: req.body.id,
         userId: req.user._id
      });
      res.redirect('/courses');
   } catch (er) {
      console.log('Error delete:', er);

   }


});

router.get('/:id', async (req, res) => {
   try {
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
   } catch (err) {
      console.log('Get course by id:', err);
   }

});

module.exports = router;