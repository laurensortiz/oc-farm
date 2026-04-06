# Instrucciones Para Claude Code: WebApp De Control De Ganado Y Caballos

## Objetivo

Necesito que construyas una **webapp mobile-first, offline-first**, enfocada en el control de una **única finca**.

El sistema debe permitir:

- gestionar **ganado bovino lechero**
- gestionar **caballos** únicamente para **control médico**
- funcionar bien en **móvil**
- soportar **modo offline** con sincronización posterior
- almacenar **una foto principal por animal** en la base de datos por ahora
- guardar historial de **padre y madre** de cada animal, incluyendo auditoría de cambios

No quiero una solución sobrearquitecturada. Quiero una base sólida, clara y extensible.

---

## Principios Del Proyecto

1. **Mobile-first real**
   - Diseñar primero para teléfono.
   - No hacer UI de desktop reducida.
   - Usar cards, formularios cortos, botones grandes y navegación simple.

2. **Offline-first**
   - La app debe poder abrir sin conexión.
   - Debe permitir consultar datos previamente sincronizados.
   - Debe permitir crear y editar registros offline.
   - Debe guardar operaciones pendientes localmente y sincronizarlas cuando vuelva la conexión.

3. **Una sola finca**
   - No modelar múltiples fincas, sedes ni ubicaciones complejas.
   - Como máximo, dejar abierta la posibilidad futura de áreas internas, pero no implementarlas ahora.

4. **Dominio principal**
   - Los **bovinos** son el flujo principal del negocio.
   - Los **caballos** solo requieren expediente básico y control médico.

5. **Simplicidad**
   - No usar microservicios.
   - No separar frontend y backend en esta fase.
   - Hacer un monolito limpio.

---

## Stack Requerido

Usa este stack salvo que exista una razón técnica fuerte para cambiarlo:

- **Astro** como framework principal
- **SSR** habilitado
- **PWA** con soporte offline
- **Tailwind CSS**
- **DaisyUI** para componentes base
- **PostgreSQL** como base de datos principal
- **Drizzle ORM** para esquema y migraciones
- **IndexedDB** para almacenamiento offline del lado cliente
- **TypeScript**

### Despliegue objetivo

Deja el proyecto preparado para cloud con esta orientación:

- app compatible con despliegue tipo SSR/PWA
- variables de entorno claras
- estructura lista para despliegue en Cloudflare Workers o equivalente
- base de datos PostgreSQL administrada externamente

No hace falta dejar el despliegue terminado, pero sí la estructura preparada.

---

## Entregables Esperados

Quiero que generes un proyecto funcional con lo siguiente:

1. estructura base del proyecto
2. configuración del stack
3. esquema de base de datos
4. migraciones iniciales
5. seed opcional con datos de ejemplo
6. UI base mobile-first
7. modo offline funcional para el MVP
8. README claro para correr localmente
9. módulos principales implementados en primera versión

---

## Alcance Del MVP

### 1. Gestión De Animales

Crear un módulo para registrar animales.

#### Campos comunes
- id
- código o identificador
- nombre
- especie: `bovino` o `equino`
- raza
- sexo
- fecha de nacimiento
- estado
- color o señas
- peso actual
- observaciones
- foto principal
- padre
- madre

#### Reglas
- padre y madre pueden apuntar a otro animal del sistema
- también pueden ser texto libre si el padre o madre no existen en el sistema
- se debe guardar historial de cambios de padre y madre
- la foto será una sola foto principal por animal

### 2. Bovinos

Además de los datos comunes, los bovinos deben soportar:

- producción de leche
- reproducción
- salud
- historial de eventos

### 3. Caballos

Los caballos deben soportar:

- ficha básica
- historial médico
- vacunas
- desparasitación
- tratamientos
- visitas veterinarias
- observaciones médicas
- próximas fechas de control

No implementar reproducción ni producción para caballos.

### 4. Producción De Leche

Solo para bovinos.

Campos mínimos:
- animalId
- fecha
- litros
- turno opcional: mañana o tarde
- observaciones

Para el MVP, si complica mucho, se puede dejar un solo registro diario por vaca sin separar turnos, pero estructura el modelo para soportarlo.

### 5. Reproducción Bovina

Solo para bovinos.

Eventos mínimos:
- celo
- inseminación o monta
- diagnóstico de preñez
- parto
- aborto

### 6. Salud / Control Médico

Para bovinos y caballos.

Debe permitir registrar:
- vacuna
- desparasitación
- tratamiento
- enfermedad
- medicamento
- dosis
- fecha
- próxima fecha de control
- notas

### 7. Historial De Eventos

Cada animal debe tener una línea de tiempo o historial.

Tipos de eventos iniciales:
- nacimiento
- pesaje
- vacunación
- enfermedad
- tratamiento
- producción registrada
- evento reproductivo
- venta
- muerte
- observación general

---

## Modelo De Datos Esperado

Implementa un esquema relacional limpio.

### Tablas mínimas

#### `animals`
Campos sugeridos:
- `id`
- `code`
- `name`
- `species`
- `breed`
- `sex`
- `birth_date`
- `status`
- `marks`
- `current_weight`
- `notes`
- `father_animal_id` nullable
- `mother_animal_id` nullable
- `father_text` nullable
- `mother_text` nullable
- timestamps

#### `animal_photos`
- `id`
- `animal_id`
- `file_name`
- `mime_type`
- `file_size`
- `photo_data` como binario
- `uploaded_at`

#### `animal_parent_history`
- `id`
- `animal_id`
- `relation_type` (`father` | `mother`)
- valor anterior por referencia o texto
- valor nuevo por referencia o texto
- fecha del cambio
- usuario o marcador del origen del cambio
- observación opcional

#### `medical_records`
- `id`
- `animal_id`
- `record_type`
- `date`
- `medication`
- `dose`
- `next_check_date`
- `notes`
- timestamps

#### `milk_production`
- `id`
- `animal_id`
- `date`
- `shift` nullable
- `liters`
- `notes`
- timestamps

#### `reproductive_records`
- `id`
- `animal_id`
- `event_type`
- `date`
- `notes`
- timestamps

#### `animal_events`
- `id`
- `animal_id`
- `event_type`
- `event_date`
- `title`
- `description`
- metadata opcional
- timestamps

Puedes agregar tablas auxiliares si lo consideras necesario, pero no compliques el modelo.

---

## Requisitos Offline

Este punto es obligatorio.

### La app debe:
- poder instalarse como PWA
- cargar sin internet una vez visitada
- almacenar localmente datos sincronizados
- permitir crear registros offline
- permitir editar registros offline
- guardar una cola de operaciones pendientes
- sincronizar al recuperar conexión
- mostrar visualmente el estado de conectividad y sincronización

### Implementación esperada

Usa IndexedDB para:
- caché local de animales
- caché local de registros médicos
- caché local de producción
- caché local de eventos
- cola de operaciones pendientes

### Cola de operaciones

Implementa una estructura local tipo:
- id local
- tipo de entidad
- tipo de operación
- payload
- fecha de creación
- estado de sync
- cantidad de reintentos

### Estrategia inicial de conflictos

Para el MVP usa una política simple:
- **última escritura gana**
- registrar en logs o auditoría lo necesario
- dejar el código preparado para mejorar esta estrategia después

---

## Requisitos De UX

### Diseño
- mobile-first
- navegación sencilla
- botones grandes
- formularios cortos
- cards en vez de tablas para móvil
- layout tipo app, no tipo dashboard de escritorio

### Pantallas mínimas

#### Inicio
- resumen simple
- accesos rápidos

#### Lista De Animales
- cards
- búsqueda
- filtros por especie y estado

#### Detalle Del Animal
- foto
- información básica
- padre y madre
- historial
- acciones rápidas

#### Registrar Evento
- formulario rápido

#### Registrar Control Médico
- formulario rápido

#### Registrar Producción
- solo para bovinos

#### Sincronización
- indicador de online/offline
- cantidad de cambios pendientes
- botón manual de sincronizar como respaldo

---

## Requisitos Técnicos

### Arquitectura del código
Quiero una estructura ordenada por dominio o módulos. Por ejemplo:

```txt
src/
  components/
    animals/
    medical/
    milk/
    reproductive/
    shared/
  pages/
  layouts/
  lib/
    db/
    offline/
    validators/
    services/
  actions/
  styles/
```

### Validación
- validar formularios del lado cliente y servidor
- manejar errores amigables

### Fotos
- aceptar jpg, jpeg, png
- limitar tamaño
- comprimir o redimensionar antes de guardar si es razonable
- guardar la imagen en PostgreSQL por ahora
- diseñar la capa para que luego sea fácil moverla a S3 o storage externo

### Código
- TypeScript estricto
- código limpio
- nombres claros
- evitar magia innecesaria
- comentarios solo donde aporten valor real

---

## Qué No Quiero En Esta Fase

No implementar todavía:

- múltiples fincas
- roles complejos y permisos avanzados
- contabilidad completa
- dashboards pesados
- microservicios
- sockets en tiempo real
- árboles genealógicos avanzados
- galería de múltiples fotos por animal
- integración con sensores o GPS
- notificaciones push complejas

---

## Tareas Que Quiero Que Ejecutes

Te pido que construyas el proyecto en este orden:

### Fase 1. Setup base
1. crear el proyecto Astro con TypeScript
2. configurar Tailwind
3. configurar DaisyUI
4. configurar SSR
5. configurar PWA
6. preparar estructura de carpetas
7. configurar variables de entorno
8. preparar Drizzle con PostgreSQL

### Fase 2. Base de datos
1. definir esquema relacional
2. crear migraciones iniciales
3. dejar seeds de ejemplo si aplica

### Fase 3. Offline
1. configurar service worker
2. crear capa IndexedDB
3. implementar caché local de entidades clave
4. implementar cola de operaciones pendientes
5. implementar sincronización manual y automática

### Fase 4. Módulos principales
1. animales
2. detalle de animal
3. foto principal
4. historial de padre y madre
5. control médico
6. producción de leche
7. reproducción bovina
8. historial de eventos

### Fase 5. UX final del MVP
1. mejorar formularios para móvil
2. usar cards y navegación simple
3. agregar estados visuales online/offline/sync
4. dejar README de uso local

---

## Criterios De Aceptación

El proyecto se considera bien encaminado si cumple esto:

1. se puede correr localmente sin fricción
2. la base de datos se crea con migraciones
3. se pueden registrar animales bovinos y equinos
4. se puede subir una foto principal
5. se puede registrar padre y madre
6. se guarda historial de cambios de padre y madre
7. se puede registrar control médico para bovinos y caballos
8. se puede registrar producción de leche para bovinos
9. se puede registrar reproducción para bovinos
10. la app funciona bien en móvil
11. la app puede abrir sin conexión
12. se pueden crear registros offline
13. existe mecanismo de sincronización posterior
14. el código queda limpio y bien estructurado

---

## Decisiones De Diseño Que Debes Respetar

- usar **PostgreSQL**, no NoSQL
- usar **modelo relacional**
- usar **Astro** como base del proyecto
- usar **DaisyUI** como librería de componentes principal
- hacer la app **mobile-first**
- hacer la app **offline-first**
- guardar **foto en DB por ahora**
- tratar a los **bovinos** como flujo principal
- tratar a los **caballos** solo como expediente básico y control médico

---

## Qué Quiero En Tu Respuesta Como Claude Code

Quiero que avances ejecutando el trabajo, no solo explicándolo.

Necesito que:

1. generes la estructura del proyecto
2. crees archivos y configuración base
3. definas el esquema inicial
4. implementes el MVP en pasos razonables
5. expliques brevemente las decisiones cuando sea útil
6. dejes el proyecto listo para seguir iterando

Si tienes que tomar decisiones menores, tómales con criterio técnico y sigue adelante sin frenar el progreso.

