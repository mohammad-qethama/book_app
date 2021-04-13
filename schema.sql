DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  categories VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT
     
);

INSERT INTO books (author ,title,isbn,categories,image_url,description) 
VALUES('Diane Flowers','Preserving Flowers','ISBN_13 9781402753886','Crafts & Hobbies','http://books.google.com/books/content?id=YgK6iJyu-ZEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','Learn how easy pressing and preserving flowers can be and then create spectacular, one-of-a-king arrangements. More than 40 original designs for gorgeous wreaths, centerpieces, picture frames, and more, all featuring plants that you have dried, will showcase your talent and brighten your home.--COVER.');


INSERT INTO books (author ,title,isbn,categories,image_url,description) 
VALUES('Flowers','100 Flowers','ISBN_13 9798640765274','History','http://books.google.com/books/content?id=YG2CzQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api','This is a pre-1923 historical reproduction that was curated for quality. Quality assurance was conducted on each of these books in an attempt to remove books with imperfections introduced by the digitization process. Though we have made best efforts - the books may have occasional errors that do not impede the reading experience. We believe this work is culturally important and have elected to bring the book back into print as part of our continuing commitment to the preservation of printed works worldwide.');


