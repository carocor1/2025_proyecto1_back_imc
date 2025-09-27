# 📊 Integración de Metabase con la Calculadora IMC

Este documento describe la configuración e integración de **Metabase** con nuestra aplicación de la Calculadora IMC (frontend + backend).  
Metabase se utilizó para construir gráficos estadísticos basados en la información de los usuarios almacenada en **MongoDB**, y se integró de forma embebida en la aplicación para que cada usuario autenticado pueda ver únicamente sus propios datos.

---

## 🚀 Pasos de Configuración

### 1. Levantar Metabase con Docker

Se utilizó la imagen oficial de Metabase en un contenedor Docker, expuesta en el puerto **4000**:

```bash
docker run -d -p 4000:3000 --name metabase metabase/metabase
```

- `-p 4000:3000`: expone el puerto 3000 de Metabase en el 4000 local.
- `--name metabase`: nombre del contenedor.

Acceso desde el navegador:  
👉 [http://localhost:4000](http://localhost:4000)

---

### 2. Iniciar Sesión en Metabase

- Crear cuenta de administrador al iniciar por primera vez.
- Guardar usuario y contraseña.

---

### 3. Vincular la Base de Datos MongoDB

Desde la interfaz de administración de Metabase:

1. Ir a **Administración → Configuración → Agregar base de datos**.
2. Seleccionar **MongoDB**.
3. Completar la información de conexión.

Metabase usará esta conexión para ejecutar las consultas directamente sobre los datos que también utiliza el backend.

---

### 4. Crear Consultas y Dashboards

Se crearon distintas consultas para obtener métricas del IMC.  
Algunas de las más importantes fueron:

#### 📈 Evolución de Peso y Altura

```json
[
  { "$match": { "userId": {{user_id}} } },
  { "$project": { "_id": false, "peso": "$peso", "altura": "$altura", "fechaHora": "$fechaHora" } },
  { "$sort": { "fechaHora": 1 } }
]
```

#### 🏷️ Veces que se obtuvo cada categoría

```json
[
  { "$match": { "userId": {{user_id}} } },
  { "$group": { "_id": "$categoria", conteo: { "$sum": 1 } } },
  { "$project": { _id: 0, categoria: "$_id", conteo: 1 } },
  { "$sort": { conteo: -1 } }
]
```

#### 📅 IMC Promedio por Mes

```json
[
  { "$match": { "userId": {{user_id}} } },
  { "$group": {
      _id: { "$dateToString": { format: "%Y-%m", date: "$fechaHora" } },
      promedio: { "$avg": "$imc" }
  }},
  { "$project": { _id: 0, mes: "$_id", imcPromedio: "$promedio" } },
  { "$sort": { mes: 1 } }
]
```

#### 📉 Evolución del IMC en el tiempo

```json
[
  { "$match": { "userId": {{user_id}} } },
  { "$project": { _id: 0, fechaHora: 1, imc: 1 } },
  { "$sort": { fechaHora: 1 } }
]
```

---

### 5. Parametrización con `user_id`

- Se definió un **parámetro dinámico** (`user_id`) en cada consulta.
- De esta forma, los dashboards muestran únicamente la información del usuario autenticado.

---

### 6. Crear Dashboards

- Se guardaron las consultas creadas en pasos anteriores.
- Luego se organizaron en **dashboards**, mostrando en gráficos:
  - Evolución de peso y altura.
  - Evolución del IMC en el tiempo.
  - Distribución de categorías de IMC.
  - Promedio mensual del IMC.

---

### 7. Habilitar Embedding de Dashboards

1. Ir a **Administración → Configuración → Embedding in other applications**.
2. Activar la opción de dashboards embebidos.
3. Copiar el **Secret Key de Metabase**, necesario para firmar los tokens de acceso desde el backend.

---

### 8. Seguridad con Tokens

- El backend genera un **token JWT firmado** con el Secret Key de Metabase.
- Este token incluye:
  - El ID del dashboard.
  - El parámetro `user_id`.
  - Fecha de expiración (10 min).
- El frontend recibe una **Signed URL** construida con este token y la inserta en un **iframe**.

De esta forma, cada usuario autenticado visualiza únicamente sus propios datos.

---

### 9. Documentación Visual

![alt text](image.png)

---

## Autores

[Beccereca, Martín](martinbeccereca@gmail.com)

[Corazza, Carolina Paula](carolinapaulacorazza@gmail.com)

[De Miguel, Alejo José](alejodm12345@gmail.com)

[Ramello, Belén](belenramello@gmail.com)

[Saby, Juan Pablo](sabyjuanpablo2004@gmail.com)
