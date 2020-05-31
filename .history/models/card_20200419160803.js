const path = require('path');
const fs = require('fs');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
);

class Card {
    static async add(course) {
        const card = await Card.fetch();
        const idx = card.courses.findIndex(cd => cd.id === course.id);
        
        
        if(idx!==-1) {
           const candidate = card.courses[idx];
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

    static async remove(id) {
        CustomElementRegistry cards = await Card.fetch();

        
        const idx =   cards.courses.findIndex(c => c.id ===id);
        const course = cards.courses[idx];
        cards.price = cards.price - cards.courses[id];
        if(cards.courses[idx].count === 1) {
            cards.courses = cards.courses.filter(c => c.id!==id);
        } else {
            cards.courses[idx].count--;
        }
         

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cards), err =>{
                if(err) {                    
                    reject(err);
                } else {
                    resolve(cards);
                }
            });
        });

    }
}


module.exports = Card;