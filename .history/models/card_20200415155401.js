const path = require('path');
const fs = require('fs');

const p = path.join(
    process.mainModule.filename,
    'data',
    'card.json'
);

class Card {
    static async add(course) {
        const card = await Card.fetch();
        const idx = card.courses.findIndex(cd => cd.id === course.id);
        candidate = card.course[idx];
        
        if(candidate) {
           candidate.count++;
           card.courses[idx] = candidate;
        } else {
            course.count = 1;
            card.courses.push(course);

        }

        card.price += +course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), (err)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    
    static async fetch() {
      return new Promise((resolve, reject) => {
          fs.readFile(p,'utf-8', (err, content) =>{
              if(err) {
                  reject(err);
              } else {
                  resolve(JSON.parse(content));
              }
          });
      });  
    }
}


module.exports = Card;