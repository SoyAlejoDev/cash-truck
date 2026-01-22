# Configuración de Google OAuth

Esta guía te explica cómo configurar la autenticación con Google para tu aplicación Trucker Finance.

## 🚀 Pasos para configurar Google OAuth

### 1. Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google+ API" y habilita

### 2. Crear credenciales OAuth

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configura:
   - **Application type**: Web application
   - **Name**: Trucker Finance App
   - **Authorized redirect URIs**: Agrega esta URL:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
     _(Reemplaza `your-project` con el ID de tu proyecto Supabase)_

4. Copia el **Client ID** y **Client Secret** que se generan

### 3. Configurar en Supabase

1. Ve al dashboard de tu proyecto Supabase
2. Ve a "Authentication" > "Providers"
3. Habilita el provider de Google
4. Ingresa:
   - **Client ID**: El Client ID de Google
   - **Client Secret**: El Client Secret de Google
5. Opcionalmente, configura URLs de redirección adicionales

### 4. Verificar configuración

1. Reinicia tu aplicación
2. El botón "Sign in with Google" debería aparecer en la página de login
3. Prueba el flujo de autenticación

## 🔧 Solución de problemas

### Error: "Invalid OAuth access token"

- Verifica que el redirect URI en Google Cloud Console coincida exactamente con el formato de Supabase
- Asegúrate de que la API de Google+ esté habilitada

### Error: "OAuth provider not configured"

- Verifica que hayas habilitado Google en Supabase Authentication > Providers
- Confirma que las credenciales sean correctas

### Botón de Google no aparece

- Verifica que las variables de entorno estén configuradas correctamente
- Revisa la consola del navegador por errores

## 📝 Variables de entorno

Asegúrate de tener estas variables en tu archivo `.env.local` (este archivo NO debe commiterse):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxx
```

## 🔄 Obtener/Regenerar claves de Supabase

Si necesitas obtener o regenerar las claves de Supabase:

1. Ve a tu proyecto Supabase > Settings > API Keys
2. Copia la Project URL
3. Copia la Publishable Key (nuevo formato: sb_publishable_xxx)
4. Actualiza tu archivo `.env.local`

⚠️ **IMPORTANTE:** La Publishable Key es segura para usar en el cliente. NUNCA expongas la service_role key en el navegador 4. Reinicia la aplicación

## 📞 Soporte

Si tienes problemas con la configuración, revisa:

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Guía de OAuth de Google](https://developers.google.com/identity/protocols/oauth2)
