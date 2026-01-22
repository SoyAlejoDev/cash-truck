# ✅ Checklist: Verificar Add Expense & Add Income

## 1. Verificar Autenticación

```
- [ ] Está registrado y logueado en la app
- [ ] Ve el Dashboard cargado (no Loading)
- [ ] El usuario está visible en la UI
```

## 2. Verificar Estado Inicial

En **DevTools (F12) > Console**, ejecuta:

```javascript
// Debe mostrar las variables de entorno
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);

// Resultado esperado: URLs y claves sin "undefined"
```

## 3. Verificar Supabase Conectado

En **DevTools > Network**, cuando abres la app:

```
- [ ] Hay requests a "awjfnidcqfatvmuztllz.supabase.co"
- [ ] Las requests tienen status 200 (OK)
- [ ] No hay errores 401/403 (auth)
```

## 4. Verificar currentWeek

En **DevTools > Console**, ejecuta:

```javascript
// Esto debería estar disponible (necesita que abras App)
// Abre Developer Tools mientras ves el Dashboard
// Ve a Sources > App.tsx y busca currentWeek
```

## 5. Prueba Agregar Expense

1. Haz clic en botón **"Add Expense"**
2. Se abrirá un modal
3. **Llena el formulario:**
   - Date: ✓ Debe estar auto-rellenado con fecha actual
   - Category: Select "Fuel"
   - Amount: Escribe "50.00"
   - Description: "Test expense"
4. Haz clic en **"Add Expense"** (botón)
5. **Observa:**
   - [ ] El modal se cierra
   - [ ] El gasto aparece en la lista
   - [ ] No hay mensaje de error rojo

**Si hay error:**

- Mira la consola (DevTools > Console)
- Busca un mensaje rojo con el error
- Cópialo completo

## 6. Prueba Agregar Income

Repite paso 5 pero:

- Haz clic en **"Add Income"**
- Llena: Date, Amount: "100.00", Description: "Test income"
- Haz clic en **"Add Income"**

**Resultado esperado:**

- El ingreso aparece en la lista
- Los totales en el dashboard se actualizan

## 7. Verificar Base de Datos

Va a Supabase Dashboard:

1. Ve a **SQL Editor**
2. Ejecuta:

```sql
SELECT * FROM expenses ORDER BY created_at DESC LIMIT 5;
SELECT * FROM incomes ORDER BY created_at DESC LIMIT 5;
```

3. **Resultado esperado:** Deben aparecer los gastos e ingresos que agregaste

## 8. Revisar Logs en Consola

Si algo falló, verás en la consola:

```
Adding expense: { weekId: "...", expense: {...}, userId: "..." }
Expense added successfully: {...}
```

o

```
Expense insert error: {code: "...", message: "..."}
```

---

## 🔧 Si Todo Falla

### Opción A: Reiniciar todo

```bash
# Detén el servidor
Ctrl + C

# Limpia cache
rm -rf node_modules/.vite

# Reinicia
pnpm run dev
```

### Opción B: Verificar RLS Policies

Ve a Supabase Dashboard:

1. **Table Editor** > `expenses`
2. Haz clic en 🔒 (RLS)
3. Verifica que hay 1 policy activa

Si no hay, necesitas ejecutar las migraciones:

```bash
npx supabase db push
```

### Opción C: Verificar Migraciones

En Supabase Dashboard > SQL Editor:

```sql
-- Verifica que existen las tablas
SELECT tablename FROM pg_tables WHERE schemaname='public';
```

Resultado esperado: `expenses`, `incomes`, `weeks`

---

**Cuando todo funcione, verás:**
✅ Gastos en la lista al agregar  
✅ Ingresos en la lista al agregar  
✅ Totales se actualizan  
✅ Sin errores en consola  
✅ Datos guardados en Supabase
