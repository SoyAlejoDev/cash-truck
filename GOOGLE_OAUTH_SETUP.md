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
     *(Reemplaza `your-project` con el ID de tu proyecto Supabase)*

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

Asegúrate de tener estas variables en tu archivo `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🔄 Regenerar variables de entorno

Si necesitas regenerar las claves de Supabase:

1. Ve a tu proyecto Supabase > Settings > API
2. Copia la nueva Project URL y anon key
3. Actualiza tu archivo `.env`
4. Reinicia la aplicación

## 📞 Soporte

Si tienes problemas con la configuración, revisa:
- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Guía de OAuth de Google](https://developers.google.com/identity/protocols/oauth2)