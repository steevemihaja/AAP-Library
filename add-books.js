const fetch = require('node-fetch');

const books = [
  {
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    isbn: "9782070612758",
    genres: ["Fiction", "Classic"],
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 1943,
    description: "Le Petit Prince est une œuvre de langue française, la plus connue d'Antoine de Saint-Exupéry.",
    language: "Français",
    pages: 96
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    genres: ["Science Fiction", "Dystopie"],
    totalCopies: 3,
    availableCopies: 2,
    publishedYear: 1949,
    description: "Dans une société totalitaire, Winston Smith lutte contre le Parti unique.",
    language: "Français",
    pages: 328
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    isbn: "9780441172719",
    genres: ["Science Fiction", "Aventure"],
    totalCopies: 4,
    availableCopies: 3,
    publishedYear: 1965,
    description: "Sur la planète désertique Arrakis, Paul Atréides doit survivre.",
    language: "Français",
    pages: 896
  },
  {
    title: "L'Étranger",
    author: "Albert Camus",
    isbn: "9782070360024",
    genres: ["Fiction", "Philosophie"],
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1942,
    description: "Meursault, un homme indifférent, commet un meurtre et est jugé.",
    language: "Français",
    pages: 192
  },
  {
    title: "Fondation",
    author: "Isaac Asimov",
    isbn: "9782070415793",
    genres: ["Science Fiction"],
    totalCopies: 2,
    availableCopies: 1,
    publishedYear: 1951,
    description: "Hari Seldon invente la psychohistoire pour sauver la civilisation.",
    language: "Français",
    pages: 320
  }
];

async function addBooks() {
  console.log('📚 Ajout des livres...\n');
  
  for (const book of books) {
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ ${book.title} - ${book.author}`);
      } else {
        console.log(`❌ ${book.title}: ${data.error || 'Erreur inconnue'}`);
      }
    } catch (err) {
      console.log(`❌ ${book.title}: Erreur de connexion`);
    }
    
    // Petit délai
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Vérification...');
  
  // Vérifier le nombre de livres
  try {
    const check = await fetch('http://localhost:5000/api/books');
    const data = await check.json();
    console.log(`✅ Total livres dans la base: ${data.pagination?.totalItems || 0}`);
  } catch (err) {
    console.log('❌ Impossible de vérifier');
  }
}

addBooks();
