import { supabase } from './lib/supabase';

export async function checkDatabaseSetup() {
  console.log('🔍 Verificando configuración de base de datos...');

  try {
    // Verificar conexión básica
    const { data: connectionTest, error: connectionError } = await supabase
      .from('weeks')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.error('❌ Error de conexión:', connectionError);
      return false;
    }

    console.log('✅ Conexión exitosa');

    // Verificar que las tablas existen consultando cada una
    const tables = ['weeks', 'expenses', 'incomes'];
    const tableChecks = await Promise.all(
      tables.map(async (table) => {
        try {
          const { error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          return { table, exists: !error };
        } catch (error) {
          return { table, exists: false };
        }
      })
    );

    tableChecks.forEach(({ table, exists }) => {
      console.log(`${exists ? '✅' : '❌'} Tabla '${table}' ${exists ? 'existe' : 'no existe'}`);
    });

    // Verificar políticas RLS
    console.log('🔒 Verificando políticas RLS...');
    const { data: weeksPolicies, error: policiesError } = await supabase
      .rpc('get_policies', { schemaname: 'public', tablename: 'weeks' });

    if (policiesError) {
      console.log('⚠️ No se pudieron verificar políticas RLS (esto es normal si no tienes permisos)');
    } else {
      console.log('✅ Políticas RLS verificadas');
    }

    const allTablesExist = tableChecks.every(check => check.exists);
    return allTablesExist;

  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
    return false;
  }
}

export async function applyMigrationsIfNeeded() {
  console.log('🚀 Aplicando migraciones si es necesario...');

  const isSetup = await checkDatabaseSetup();

  if (!isSetup) {
    console.log('⚠️ Las tablas no existen. Necesitas aplicar las migraciones manualmente en Supabase Dashboard.');
    console.log('📋 Pasos:');
    console.log('1. Ve a tu proyecto Supabase Dashboard');
    console.log('2. Ve a SQL Editor');
    console.log('3. Ejecuta las migraciones en orden:');
    console.log('   - 20250426051703_fragrant_rain.sql');
    console.log('   - 20250426053821_calm_canyon.sql');
    return false;
  }

  console.log('✅ Base de datos configurada correctamente');
  return true;
}