# ⚡ Quick Start: Probar Add Expense & Add Income

## 1️⃣ Inicia el servidor (si no está corriendo)

```bash
cd /home/alejo/Study/trucker-finance-app
pnpm run dev
```

Debe mostrar:

```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

## 2️⃣ Abre la app en el navegador

```
http://localhost:5173
```

## 3️⃣ Inicia sesión o regístrate

- Email: test@example.com
- Password: Test123!

## 4️⃣ Abre DevTools (F12)

- Ve a la pestaña **Console**
- Aquí verás los logs cuando agregues datos

## 5️⃣ Prueba Add Expense

1. Haz clic en botón **"Add Expense"** (arriba a la derecha)
2. Se abrirá un modal
3. Llena así:
   ```
   Date: [auto-rellenado con hoy]
   Category: Fuel
   Amount: 50.00
   Description: Test expense from dashboard
   ```
4. Haz clic en **"Add Expense"** (botón verde)
5. **Espera 2 segundos**

### ✅ Resultado esperado:

- Modal se cierra
- Gasto aparece en la lista "Expenses"
- En console ves: `✅ Expense added to state`
- Total en dashboard se actualiza

### ❌ Si hay error:

- Busca en console un mensaje rojo como:
  ```
  ❌ Error adding expense: ...
  ```
- Cópialo completo

## 6️⃣ Prueba Add Income

1. Haz clic en botón **"Add Income"** (arriba a la derecha)
2. Llena así:
   ```
   Date: [auto-rellenado con hoy]
   Amount: 100.00
   Description: Test income from dashboard
   ```
3. Haz clic en **"Add Income"** (botón verde)
4. **Espera 2 segundos**

### ✅ Resultado esperado:

- Modal se cierra
- Ingreso aparece en la lista "Income"
- En console ves: `✅ Income added to state`
- Total en dashboard se actualiza

---

## 🔍 Verificación en Supabase

Para confirmar que los datos se guardaron en la BD:

1. Abre [Supabase Dashboard](https://app.supabase.com)
2. Selecciona el proyecto `trucker-finance-app`
3. Ve a **SQL Editor**
4. Ejecuta esto:

```sql
SELECT id, date, amount, category, description, created_at
FROM expenses
ORDER BY created_at DESC
LIMIT 5;
```

5. Deberías ver tus gastos de prueba

---

## 📊 Ejemplo Completo

**Logs esperados en console:**

```
📝 Adding expense: { currentWeekId: 'abc-123', expense: {…} }
Adding expense: { weekId: 'abc-123', expense: {…}, userId: 'user-456' }
Expense added successfully: { id: 'exp-789', week_id: 'abc-123', amount: 50, … }
✅ Expense added to state: { id: 'exp-789', … }
```

---

## 🆘 Troubleshooting Rápido

### "No current week selected"

→ Recarga la página (F5)  
→ Espera a que cargue completamente

### "No authenticated user"

→ Cierra sesión y vuelve a iniciar

### "Failed to add expense: ..."

→ Abre console y mira el error completo  
→ Comparte el error exacto

### No aparece el gasto en la lista

→ Recarga la página (F5)  
→ Verifica en Supabase que esté en la BD

---

## 📝 Notas

- Los datos se guardan en **Supabase** (no solo localmente)
- Cada semana es independiente (Sun-Sat)
- Los gastos se pueden eliminar (botón ❌ en cada item)
- Los totales se calculan automáticamente

---

**¡Listo!** Ahora prueba a agregar un gasto e ingreso. 🎉
