#!/bin/bash

# Script de migration React -> Angular
# Ce script nettoie les fichiers React obsolètes

echo "═══════════════════════════════════════════════════════════"
echo "🔄 MIGRATION REACT → ANGULAR"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "⚠️  Ce script va supprimer les fichiers React obsolètes"
echo ""
read -p "Êtes-vous sûr ? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Suppression des fichiers React..."
    
    # Sauvegarder les anciens fichiers
    mv src src.react.backup 2>/dev/null || true
    mv public public.react.backup 2>/dev/null || true
    
    # Supprimer les fichiers React spécifiques
    rm -f tailwind.config.js.react
    rm -f postcss.config.js.react
    
    echo "✅ Fichiers React mis en backup dans:"
    echo "   - src.react.backup/"
    echo "   - public.react.backup/"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "✅ Migration complétée!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "Prochaines étapes:"
    echo "1. npm install"
    echo "2. npm start"
    echo ""
else
    echo "❌ Opération annulée"
fi
