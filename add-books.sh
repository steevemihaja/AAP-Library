#!/bin/bash

echo "📚 Ajout de livres à la bibliothèque..."

# Liste des livres à ajouter
BOOKS=(
  '{"title":"Le Petit Prince","author":"Antoine de Saint-Exupéry","isbn":"9782070612758","genres":["Fiction","Classic"],"totalCopies":5,"availableCopies":5,"publishedYear":1943,"description":"Le Petit Prince est une œuvre de langue française, la plus connue d'Antoine de Saint-Exupéry.","language":"Français","pages":96}'
  
  '{"title":"1984","author":"George Orwell","isbn":"9780451524935","genres":["Science Fiction","Dystopie"],"totalCopies":3,"availableCopies":2,"publishedYear":1949,"description":"Dans une société totalitaire, Winston Smith lutte contre le Parti unique et son chef Big Brother.","language":"Français","pages":328}'
  
  '{"title":"Dune","author":"Frank Herbert","isbn":"9780441172719","genres":["Science Fiction","Aventure"],"totalCopies":4,"availableCopies":3,"publishedYear":1965,"description":"Sur la planète désertique Arrakis, Paul Atréides doit survivre pour venger sa famille.","language":"Français","pages":896}'
  
  '{"title":"L\'Étranger","author":"Albert Camus","isbn":"9782070360024","genres":["Fiction","Philosophie"],"totalCopies":3,"availableCopies":3,"publishedYear":1942,"description":"Meursault, un homme indifférent, commet un meurtre et est jugé.","language":"Français","pages":192}'
  
  '{"title":"Fondation","author":"Isaac Asimov","isbn":"9782070415793","genres":["Science Fiction"],"totalCopies":2,"availableCopies":1,"publishedYear":1951,"description":"Hari Seldon invente la psychohistoire pour sauver la civilisation.","language":"Français","pages":320}'
  
  '{"title":"Le Seigneur des Anneaux","author":"J.R.R. Tolkien","isbn":"9782266286567","genres":["Fantasy","Aventure"],"totalCopies":5,"availableCopies":4,"publishedYear":1954,"description":"Frodon doit détruire l\'Anneau Unique en Mordor.","language":"Français","pages":1200}'
  
  '{"title":"Harry Potter à l\'école des sorciers","author":"J.K. Rowling","isbn":"9782070584628","genres":["Fantasy","Jeunesse"],"totalCopies":6,"availableCopies":5,"publishedYear":1997,"description":"Harry découvre qu\'il est un sorcier et intègre Poudlard.","language":"Français","pages":320}'
  
  '{"title":"Les Misérables","author":"Victor Hugo","isbn":"9782253004226","genres":["Classic","Historique"],"totalCopies":2,"availableCopies":2,"publishedYear":1862,"description":"Jean Valjean, un ancien forçat, cherche la rédemption.","language":"Français","pages":1468}'
  
  '{"title":"Crime et Châtiment","author":"Fiodor Dostoïevski","isbn":"9782070422067","genres":["Classic","Psychologique"],"totalCopies":2,"availableCopies":2,"publishedYear":1866,"description":"Raskolnikov, un étudiant, commet un meurtre et doit faire face à sa conscience.","language":"Français","pages":800}'
  
  '{"title":"Le Comte de Monte-Cristo","author":"Alexandre Dumas","isbn":"9782070418602","genres":["Aventure","Classic"],"totalCopies":3,"availableCopies":2,"publishedYear":1844,"description":"Edmond Dantès, injustement emprisonné, s\'évade et se venge.","language":"Français","pages":1312}'
)

# Ajouter chaque livre
for BOOK in "${BOOKS[@]}"; do
  echo "Ajout de : $(echo $BOOK | jq -r '.title')"
  curl -X POST http://localhost:5000/api/books \
    -H "Content-Type: application/json" \
    -d "$BOOK"
  echo ""
  sleep 1
done

echo "✅ Tous les livres ont été ajoutés !"
