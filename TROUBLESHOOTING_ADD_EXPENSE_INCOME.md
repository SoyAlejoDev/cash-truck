# Fix: Add Expense & Add Income Not Working

## Problemas Identificados y Corregidos

### 1. **currentWeek no se inicializaba**

**Problema:** Después de cargar los datos del usuario, `currentWeekId` nunca se establecía, lo que causaba que `currentWeek` fuera `undefined`.

**Solución:** En `AppContext.tsx`, añadido un segundo dispatch después de `INITIALIZE`:

```typescript
const userData = await SupabaseService.loadUserData();
dispatch({ type: "INITIALIZE", payload: userData });

// Automatically select current week after loading data
const currentWeekData = await SupabaseService.getOrCreateWeek(new Date());
dispatch({ type: "SELECT_WEEK", payload: currentWeekData });
```

### 2. **Sin validación de currentWeek en addExpense/addIncome**

**Problema:** Las funciones retornaban silenciosamente si `currentWeek` era undefined, sin error.

**Solución:** Cambiado para lanzar un error explícito:

```typescript
if (!currentWeek) {
  throw new Error("No current week selected");
}
```

### 3. **Sin reset del formulario después de submit**

**Problema:** El formulario mantenía los datos anteriores.

**Solución:** Añadido reset después de guardar:

```typescript
setFormData({
  date: currentWeek?.startDate || new Date().toISOString().split("T")[0],
  amount: 0,
  category: "fuel",
  description: null,
});
setErrors({});
```

### 4. **Mensajes de error no informativos**

**Problema:** Los errores de submit no se mostraban en la UI.

**Solución:** Añadido error box en formularios:

```tsx
{
  errors.submit && (
    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
      {errors.submit}
    </div>
  );
}
```

## Archivos Modificados

- `src/context/AppContext.tsx` - Inicialización de currentWeek
- `src/components/expenses/ExpenseForm.tsx` - Error handling y reset
- `src/components/income/IncomeForm.tsx` - Error handling y reset

## Verificación

Para verificar que todo funciona:

1. ✅ Estar autenticado en la app
2. ✅ El dashboard debe cargar la semana actual automáticamente
3. ✅ Hacer clic en "Add Expense" o "Add Income"
4. ✅ Llenar el formulario y enviar
5. ✅ El gasto/ingreso debe aparecer en la lista
6. ✅ Si hay error, debe mostrarse en la UI

## Variables de Entorno

Asegúrate de que `.env.local` tiene:

```env
VITE_SUPABASE_URL=https://awjfnidcqfatvmuztllz.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_kNgJP_OSl0cFiREfak3qfQ_Y_L9Mui9
```

## Si aún hay problemas

1. **Verifica en la consola del navegador** - Habrá un mensaje de error más específico
2. **Abre DevTools** - F12 > Network > Mira las requests a Supabase
3. **Revisa la BD** - Ve a Supabase Dashboard y verifica si se crean las tablas
4. **RLS Policies** - Asegúrate que las políticas de Row Level Security estén habilitadas
