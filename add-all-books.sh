#!/bin/bash

echo "🔐 Connexion admin..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Erreur de connexion"
  exit 1
fi

echo "✅ Token obtenu"
echo "📚 Ajout des livres...\n"

# Liste des livres
BOOKS=(
  '{"title":"Le Petit Prince","author":"Antoine de Saint-Exupéry","isbn":"9782070612758","genres":["Fiction","Classic"],"totalCopies":5,"availableCopies":5,"publishedYear":1943}'
  '{"title":"1984","author":"George Orwell","isbn":"9780451524935","genres":["Science Fiction","Dystopie"],"totalCopies":3,"availableCopies":2,"publishedYear":1949}'
  '{"title":"Dune","author":"Frank Herbert","isbn":"9780441172719","genres":["Science Fiction","Aventure"],"totalCopies":4,"availableCopies":3,"publishedYear":1965}'
  '{"title":"L'\''Étranger","author":"Albert Camus","isbn":"9782070360024","genres":["Fiction","Philosophie"],"totalCopies":3,"availableCopies":3,"publishedYear":1942}'
  '{"title":"Fondation","author":"Isaac Asimov","isbn":"9782070415793","genres":["Science Fiction"],"totalCopies":2,"availableCopies":1,"publishedYear":1951}'
  '{"title":"Le Seigneur des Anneaux","author":"J.R.R. Tolkien","isbn":"9782266286567","genres":["Fantasy","Aventure"],"totalCopies":5,"availableCopies":4,"publishedYear":1954}'
  '{"title":"Harry Potter","author":"J.K. Rowling","isbn":"9782070584628","genres":["Fantasy","Jeunesse"],"totalCopies":6,"availableCopies":5,"publishedYear":1997}'
)

for BOOK in "${BOOKS[@]}"; do
  TITLE=$(echo $BOOK | grep -o '"title":"[^"]*"' | cut -d'"' -f4)
  echo "📖 Ajout de: $TITLE"
  
  RESPONSE=$(curl -s -X POST http://localhost:5000/api/books \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$BOOK")
  
  if [[ $RESPONSE == *"success\":true"* ]]; then
    echo "  ✅ Succès"
  else
    echo "  ❌ Échec: $RESPONSE"
  fi
  
  sleep 1
done

echo -e "\n📊 Vérification finale:"
curl -s http://localhost:5000/api/books | grep -o '"title":"[^"]*"' | head -10

echo -e "\n✅ Terminé!"
