import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnv() {
  try {
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    return envVars;
  } catch (error) {
    console.error('Error loading .env file:', error.message);
    return {};
  }
}

const env = loadEnv();

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseSetup() {
  console.log('🔍 Verificando configuración de base de datos...\n');

  try {
    // Test basic connection
    console.log('📡 Probando conexión...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('weeks')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.error('❌ Error de conexión:', connectionError.message);
      return false;
    }

    console.log('✅ Conexión exitosa\n');

    // Check if tables exist by trying to query them
    const tables = ['weeks', 'expenses', 'incomes'];
    console.log('📋 Verificando tablas...\n');

    const tableChecks = await Promise.all(
      tables.map(async (table) => {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

          const exists = !error;
          console.log(`${exists ? '✅' : '❌'} Tabla '${table}' ${exists ? 'existe' : 'no existe'}`);
          return { table, exists };
        } catch (error) {
          console.log(`❌ Tabla '${table}' no existe o hay error:`, error.message);
          return { table, exists: false };
        }
      })
    );

    console.log('\n🔒 Verificando políticas RLS...');

    // Try to insert a test record to check RLS (this will fail if RLS is working and user is not authenticated)
    try {
      const { error } = await supabase.from('weeks').insert({
        start_date: '2024-01-01',
        end_date: '2024-01-07',
        user_id: '00000000-0000-0000-0000-000000000000' // fake user id
      });

      if (!error) {
        console.log('⚠️ RLS podría no estar configurado correctamente (se permitió inserción sin autenticación)');
        console.log('🔧 Ejecuta el archivo fix-rls.sql en SQL Editor de Supabase');
      } else {
        console.log('✅ RLS configurado correctamente');
      }
    } catch (error) {
      if (error.message.includes('policy') || error.message.includes('permission') || error.message.includes('violates')) {
        console.log('✅ RLS configurado correctamente');
      } else {
        console.log('⚠️ Error inesperado en RLS:', error.message);
        console.log('🔧 Ejecuta el archivo fix-rls.sql en SQL Editor de Supabase');
      }
    }

    const allTablesExist = tableChecks.every(check => check.exists);

    if (allTablesExist) {
      console.log('\n🎉 ¡Base de datos configurada correctamente!');
      return true;
    } else {
      console.log('\n⚠️ Faltan algunas tablas. Necesitas aplicar las migraciones.');
      console.log('\n📋 Para aplicar las migraciones:');
      console.log('1. Ve a tu proyecto Supabase Dashboard');
      console.log('2. Ve a SQL Editor');
      console.log('3. Ejecuta estos archivos en orden:');
      console.log('   - supabase/migrations/20250426051703_fragrant_rain.sql');
      console.log('   - supabase/migrations/20250426053821_calm_canyon.sql');
      return false;
    }

  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
    return false;
  }
}

function showMigrationInstructions() {
  console.log('\n📋 Para aplicar las migraciones manualmente:');
  console.log('1. Ve a tu proyecto Supabase Dashboard');
  console.log('2. Ve a SQL Editor');
  console.log('3. Ejecuta estos archivos en orden:');
  console.log('   - supabase/migrations/20250426051703_fragrant_rain.sql');
  console.log('   - supabase/migrations/20250426053821_calm_canyon.sql');
  console.log('\n💡 También puedes copiar y pegar el contenido de cada archivo SQL');
}

// Main execution
async function main() {
  const isSetup = await checkDatabaseSetup();

  if (!isSetup) {
    showMigrationInstructions();
  } else {
    console.log('\n🎉 ¡Todo está configurado correctamente!');
    console.log('La aplicación debería funcionar sin problemas.');
  }
}

main().catch(console.error);