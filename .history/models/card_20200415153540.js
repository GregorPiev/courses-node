const path = require('path');
const fs = require('fs');

const p = path.join(
    process.mainModule.filename,
    'data',
    'card.json'
);

class Card {
    add() {

    }
    
    static async fetch() {
      return new Promise((resolve, reject) => {
          fs.readFile(p,'utf-8', (err, conten) =>{
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