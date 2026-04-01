#!/bin/bash

# Script de démarrage de LibraryManager - Frontend Angular

echo "═══════════════════════════════════════════════════════════"
echo "🚀 LibraryManager - Frontend Angular"
echo "═══════════════════════════════════════════════════════════"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erreur lors de l'installation${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dépendances installées${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Options disponibles:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}1)${NC} Démarrer le serveur de développement"
echo -e "${GREEN}2)${NC} Construire pour la production"
echo -e "${GREEN}3)${NC} Lancer les tests"
echo -e "${GREEN}4)${NC} Exécuter linter"
echo -e "${GREEN}5)${NC} Nettoyer le cache"
echo ""
read -p "Sélectionnez une option (1-5): " choice

case $choice in
    1)
        echo -e "${YELLOW}🔧 Démarrage du serveur de développement...${NC}"
        npm start
        ;;
    2)
        echo -e "${YELLOW}🏗️  Construction pour la production...${NC}"
        npm run build:prod
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Construction réussie${NC}"
            echo -e "📦 Les fichiers sont dans: ${YELLOW}dist/library-frontend/${NC}"
        else
            echo -e "${RED}❌ Erreur lors de la construction${NC}"
        fi
        ;;
    3)
        echo -e "${YELLOW}🧪 Lancement des tests...${NC}"
        npm test
        ;;
    4)
        echo -e "${YELLOW}🔍 Exécution du linter...${NC}"
        npm run lint
        ;;
    5)
        echo -e "${YELLOW}🧹 Nettoyage du cache...${NC}"
        rm -rf .angular/cache
        rm -rf node_modules
        npm install
        echo -e "${GREEN}✅ Cache nettoyé${NC}"
        ;;
    *)
        echo -e "${RED}❌ Option invalide${NC}"
        exit 1
        ;;
esac
