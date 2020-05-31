}

static getAll() {
    return new Promise((resolve, reject) => {
        fs.readFile(
            path.join(__dirname, '..', 'data', 'courses.json'),
            'utf-8',
            (err, content) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(content));
                } 
            }
        );
    });
    
}

static async getById(id) {
    const courses = await Course.getAll();
    return courses.find(c => c.id === id );
}
}

module.exports = Course;
