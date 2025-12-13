# 🔒 Reglas de Seguridad de Firestore

## ⚠️ IMPORTANTE: Configurar estas reglas en Firebase Console

Para que la edición de perfil funcione, **DEBES** configurar estas reglas en Firebase:

### 📍 Dónde configurar:
1. Ve a **Firebase Console** → https://console.firebase.google.com
2. Selecciona tu proyecto: **proyect-1-25133**
3. En el menú lateral: **Firestore Database** → pestaña **Reglas**
4. Copia y pega las reglas de abajo
5. Click en **Publicar**

---

## 📋 Reglas Recomendadas (Producción)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // =============================================
    // USUARIOS: Lectura pública, escritura propia
    // =============================================
    match /usuarios/{userId} {
      // Cualquier usuario autenticado puede leer perfiles
      allow read: if request.auth != null;
      
      // Solo el dueño puede crear/actualizar su propio perfil
      allow create, update: if request.auth != null && 
                               request.auth.uid == userId;
      
      // Solo el dueño puede eliminar su perfil
      allow delete: if request.auth != null && 
                       request.auth.uid == userId;
    }
    
    // =============================================
    // PARTIDOS: Lectura pública, escritura controlada
    // =============================================
    match /partidos/{partidoId} {
      // Cualquier usuario autenticado puede leer partidos
      allow read: if request.auth != null;
      
      // Cualquier usuario autenticado puede crear partidos
      allow create: if request.auth != null;
      
      // Solo el anfitrión o jugadores pueden actualizar
      allow update: if request.auth != null && 
        (resource.data.anfitrionId == request.auth.uid || 
         request.auth.uid in resource.data.jugadores);
      
      // Solo el anfitrión puede eliminar
      allow delete: if request.auth != null && 
                       resource.data.anfitrionId == request.auth.uid;
    }
    
    // =============================================
    // MATCHMAKING: Lectura pública, escritura propia
    // =============================================
    match /matchmaking/{docId} {
      // Cualquier usuario autenticado puede leer la cola
      allow read: if request.auth != null;
      
      // Cualquier usuario puede crear su entrada en la cola
      allow create: if request.auth != null;
      
      // Solo el dueño puede eliminar su entrada
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🧪 Reglas para Testing (Temporal - NO usar en producción)

Si necesitas testear rápidamente, puedes usar estas reglas **TEMPORALMENTE**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **ADVERTENCIA:** Estas reglas permiten que cualquier usuario autenticado lea/escriba TODOS los documentos. Solo usar para desarrollo.

---

## 🔐 Reglas de Realtime Database (para Chat)

También necesitas configurar las reglas de **Realtime Database**:

### 📍 Dónde:
Firebase Console → **Realtime Database** → pestaña **Reglas**

### Reglas recomendadas:

```json
{
  "rules": {
    "chats": {
      "$partidoId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

---

## 🧪 Testing de Reglas

### Prueba 1: Verificar que puedes leer tu propio perfil
```javascript
// En la consola del navegador (F12):
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './src/services/firebase';

const docRef = doc(db, 'usuarios', auth.currentUser.uid);
const docSnap = await getDoc(docRef);
console.log(docSnap.data());
```

### Prueba 2: Verificar que puedes actualizar tu perfil
```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './src/services/firebase';

const docRef = doc(db, 'usuarios', auth.currentUser.uid);
await setDoc(docRef, { edad: 25, zona: 'Test' }, { merge: true });
console.log('✅ Actualización exitosa');
```

---

## 🐛 Troubleshooting

### Error: "Missing or insufficient permissions"
**Solución:** Las reglas de Firestore están bloqueando la escritura. Verifica:
1. Que las reglas estén publicadas
2. Que uses la colección correcta: `usuarios` (no `users`)
3. Que el usuario esté autenticado (`auth.currentUser` no sea null)

### Error: "PERMISSION_DENIED"
**Solución:** Aplica las reglas de Realtime Database para el chat.

### Los datos no se guardan pero no hay error
**Solución:** 
1. Abre la consola del navegador (F12)
2. Busca los logs con emoji (🔄, ✅, ❌)
3. Si ves "✅ Perfil actualizado", revisa la colección en Firebase Console

---

## 📝 Notas Importantes

1. **Colección corregida:** Ahora usamos `usuarios` en vez de `users`
2. **Logging mejorado:** Todos los errores se loguean con emojis para fácil identificación
3. **Feedback visual:** El botón "Guardar" muestra "⏳ Guardando..." y luego mensaje de éxito/error
4. **Race condition:** Agregamos un delay de 500ms después de login para que `onAuthStateChanged` actualice el estado

---

**Último paso:** Ve a Firebase Console y configura las reglas 👆
