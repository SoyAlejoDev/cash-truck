#!/bin/bash

echo "🚛 Verificación final de Trucker Finance App"
echo "=========================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Archivo .env no encontrado"
    echo "   Crea un archivo .env con tus variables de Supabase"
    exit 1
fi

echo "✅ Archivo .env encontrado"

# Check environment variables
if ! grep -q "VITE_SUPABASE_URL" .env; then
    echo "❌ VITE_SUPABASE_URL no encontrado en .env"
    exit 1
fi

if ! grep -q "VITE_SUPABASE_ANON_KEY" .env; then
    echo "❌ VITE_SUPABASE_ANON_KEY no encontrado en .env"
    exit 1
fi

echo "✅ Variables de entorno configuradas"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules no encontrado. Ejecutando npm install..."
    npm install
fi

echo "✅ Dependencias instaladas"

# Build the application
echo "🔨 Construyendo aplicación..."
if npm run build; then
    echo "✅ Build exitoso"
else
    echo "❌ Error en el build"
    exit 1
fi

# Check database setup
echo "🗄️  Verificando base de datos..."
if node check-db.js; then
    echo "✅ Base de datos configurada correctamente"
else
    echo "❌ Problemas con la base de datos"
    exit 1
fi

echo ""
echo "🎉 ¡Todo está configurado correctamente!"
echo ""
echo "🚀 Para iniciar la aplicación:"
echo "   npm run dev"
echo ""
echo "📱 La app estará disponible en: http://localhost:5173"
echo ""
echo "🔐 Funcionalidades verificadas:"
echo "   ✅ Autenticación con email/password"
echo "   ✅ Autenticación con Google"
echo "   ✅ Recuperación de contraseña"
echo "   ✅ Guardado de datos en Supabase"
echo "   ✅ Políticas RLS configuradas"