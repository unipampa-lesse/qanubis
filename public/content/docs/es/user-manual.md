# Manual de Usuario

Este manual cubre todas las funcionalidades disponibles en QAnubis v1. Usa el índice a continuación para navegar entre las secciones.

---

## Índice

1. [Primeros pasos](#primeros-pasos)
2. [Tu cuenta](#tu-cuenta)
3. [Proyectos](#proyectos)
4. [Documentos](#documentos)
5. [Visor de PDF y extracción de citas](#visor-de-pdf-y-extracción-de-citas)
6. [Esquema de códigos](#esquema-de-códigos)
7. [Memorandos](#memorandos)
8. [Informes](#informes)
9. [Soporte](#soporte)
10. [Panel de administración](#panel-de-administración) *(solo admin)*

---

## Primeros pasos

### Crear cuenta

Accede a `/auth/signup` y completa tu nombre, apellido, correo electrónico y una contraseña de al menos 8 caracteres. Tras enviar el formulario, se envía un enlace de verificación a tu correo — haz clic en él para activar tu cuenta antes de iniciar sesión.

### Iniciar sesión

Accede a `/auth/signin` e ingresa tu correo y contraseña, o usa **Iniciar sesión con Google / GitHub** si tu instancia tiene OAuth configurado.

Activa **Mantener sesión iniciada** para extender tu sesión a 30 días (el predeterminado es 24 horas).

### Restablecer contraseña

Haz clic en **Olvidaste tu contraseña?** en la página de inicio de sesión e ingresa tu correo. Se enviará un enlace de restablecimiento si el correo existe en el sistema.

---

## Tu cuenta

Haz clic en tu nombre en el encabezado superior derecho para abrir el menú de usuario.

### Perfil

Ve a **Perfil** para actualizar tu nombre para mostrar. Los cambios tienen efecto inmediato en toda la aplicación.

### Cambiar contraseña

En la página de **Perfil**, desplázate hasta **Cambiar contraseña**. Debes ingresar tu contraseña actual antes de establecer una nueva. Esta sección está oculta para cuentas creadas con Google o GitHub (las cuentas OAuth no tienen contraseña local).

---

## Proyectos

Los proyectos son el contenedor principal de todo tu material de investigación. Cada proyecto tiene sus propios documentos, códigos, memorandos e informes.

### Crear un proyecto

En el panel, haz clic en **Nuevo proyecto**. Completa:
- **Nombre** (obligatorio, máx. 100 caracteres)
- **Descripción** (opcional)
- **Color**  elige un color de la paleta para identificar visualmente el proyecto en tu lista

### Editar un proyecto

Abre el proyecto y haz clic en **Editar proyecto** (ícono de lápiz, arriba a la derecha, solo propietario). Puedes actualizar el nombre, la descripción y el color.

### Eliminar un proyecto

Haz clic en **Eliminar proyecto** (arriba a la derecha, solo propietario) y confirma el diálogo. Esto elimina permanentemente todos los documentos, citas, códigos y memorandos dentro del proyecto.

### Colaboración

#### Invitar a un colaborador

Abre la pestaña **Miembros** e ingresa el correo electrónico de la persona que deseas invitar. Recibirá un enlace de invitación. Si aún no tiene cuenta, puede registrarse primero y luego visitar el enlace de invitación.

#### Roles

| Rol | Puede editar contenido | Puede gestionar miembros | Puede eliminar el proyecto |
|-----|----------------------|------------------------|-----------------------------|
| Propietario |  |  |  |
| Colaborador |  |  |  |
| Visualizador |  |  |  |

#### Salir de un proyecto

Los no propietarios pueden salir de un proyecto desde la pestaña **Miembros** usando el botón **Salir** junto a su propio nombre.

#### Transferir la propiedad

Los propietarios pueden promover a otro miembro como Propietario desde la pestaña **Miembros**. El propietario original pasa a ser Colaborador.

---

## Documentos

### Subir un PDF

Abre la pestaña **Documentos** de un proyecto y haz clic en **Subir PDF**. Selecciona un archivo PDF (máx. 50 MB). El sistema extrae automáticamente el número de páginas y el título incorporado en los metadatos.

### Abrir un documento

Haz clic en el nombre del documento para abrirlo en el visor de PDF.

### Descargar un documento

Haz clic en el ícono de descarga () en la fila del documento para descargar el archivo PDF original.

### Eliminar un documento

Haz clic en el ícono de papelera en la fila del documento (solo Colaborador/Propietario). Esto elimina el archivo del almacenamiento y borra todas las citas asociadas.

---

## Visor de PDF y extracción de citas

### Navegar por el documento

Usa los botones ** ** para navegar entre páginas.

### Seleccionar texto y crear una cita

1. Haz clic y arrastra sobre el texto en el PDF para seleccionarlo.
2. Aparece un botón **Citar** cerca de tu selección  haz clic para crear la cita.
3. La nueva cita se agrega a la barra lateral derecha.

> **Documentos escaneados:** Si el PDF fue creado escaneando un documento físico sin OCR, aparecerá un banner de advertencia en la parte superior del visor. La selección de texto no está disponible para PDFs escaneados.

### Barra lateral de citas

Todas las citas se listan a la derecha, agrupadas por página. Cada tarjeta de cita muestra:
- El texto seleccionado
- Insignias de códigos asignados
- El color de resaltado
- Un botón con el contador de comentarios

#### Asignar un código

Haz clic en **Asignar código** dentro de la tarjeta de cita y selecciona un código del selector. Puedes asignar múltiples códigos a la misma cita.

#### Quitar un código

Haz clic en la **** junto a la insignia de código en la tarjeta de cita.

#### Cambiar el color de resaltado

Haz clic en el círculo de color en la tarjeta de cita para abrir un selector de color.

#### Agregar un comentario

Haz clic en el botón del contador de comentarios para expandir el hilo. Escribe en el campo de texto y presiona **Enter** o haz clic en **Enviar**.

#### Eliminar una cita

Haz clic en el ícono de papelera en la tarjeta (solo Colaborador/Propietario) y confirma el diálogo. Esto también elimina todos los códigos asignados y los comentarios.

### Resaltados en el visor

Las citas existentes se superponen en el PDF como resaltados de color. Haz clic en cualquier resaltado para que la barra lateral se desplace hasta esa cita.

---

## Esquema de códigos

Los códigos (también llamados categorías o etiquetas) son las etiquetas que aplicas a las citas para organizar tu análisis.

### Crear un código

Abre la pestaña **Códigos** y haz clic en **Nuevo código** o **+ Agregar subcódigo** en un código existente. Completa:
- **Nombre** (obligatorio)
- **Color de fondo**  elige de la paleta de colores
- **Color de texto**  calculado automáticamente para contraste, pero ajustable
- **Descripción** (opcional)

### Jerarquía

Los códigos admiten anidamiento padre-hijo ilimitado. Los subcódigos aparecen sangrados debajo de su padre en el árbol. Eliminar un padre convierte sus hijos en códigos raíz  **no** se eliminan.

### Editar un código

Haz clic en el ícono de lápiz en cualquier fila de código.

### Eliminar un código

Haz clic en el ícono de papelera. Un panel de confirmación muestra cuántas citas usan este código y cuántos subcódigos tiene. Eliminar un código borra todas sus asociaciones con citas.

### Comentarios de código

Haz clic en el ícono de **burbuja de chat** en cualquier fila de código para abrir el hilo de comentarios. Escribe una nota y haz clic en **Enviar**. Los comentarios son anotaciones analíticas compartidas con todos los miembros del proyecto.

Para eliminar un comentario, pasa el cursor sobre él y haz clic en el ícono de papelera. Solo puedes eliminar tus propios comentarios (los Propietarios del proyecto pueden eliminar cualquier comentario).

---

## Memorandos

Los memorandos son notas de investigación compartidas visibles para todos los miembros del proyecto.

### Crear un memorando

Abre la pestaña **Memorandos** y haz clic en **Nuevo memorando**. El memorando se abre de inmediato en el editor.

### Editar un memorando

- **Título**: Haz clic en el título del memorando para editarlo en línea. Presiona **Enter** o haz clic afuera para guardar.
- **Contenido**: El editor de texto enriquecido guarda automáticamente 800 ms después de que dejes de escribir. Aparece un indicador "Guardando" / "Guardado" junto al título.

El editor admite: negrita, cursiva, tachado, código en línea, encabezados (H2, H3), listas con viñetas, listas numeradas, citas en bloque, bloques de código y deshacer/rehacer.

### Insertar referencia de cita

Haz clic en el ícono de **burbuja de discurso** en la barra de herramientas para abrir el Selector de Citas. Busca o navega las citas del proyecto y haz clic en una para incrustarla como bloque de referencia en el memorando. El bloque muestra el texto de la cita, el nombre del documento y la página, con un enlace para abrir el documento.

### Eliminar un memorando

Haz clic en el ícono de papelera en el encabezado del memorando (solo Colaborador/Propietario) y confirma el diálogo.

---

## Informes

Abre la pestaña **Informes** para acceder a las herramientas de análisis y exportación. Los informes se construyen a partir de todas las citas del proyecto en todos los documentos.

### Explorador

Filtra citas por:
- **Documento** — muestra solo las citas de un documento
- **Código** — muestra solo las citas etiquetadas con un código específico
- **Solo sin código** — muestra solo las citas sin ningún código asignado
- **Búsqueda** — escribe al menos 2 caracteres para activar una búsqueda del lado del servidor en todos los textos de citas del proyecto; consultas más cortas filtran del lado del cliente los datos ya cargados

### Gráficos

Dos mapas de calor construidos con Observable Plot:
- **Citas  Códigos**  qué códigos aparecen en qué documentos (el color de la celda = cantidad de citas)
- **Co-ocurrencia de códigos**  qué códigos aparecen juntos en las citas

Los gráficos requieren al menos una cita con un código asignado para renderizarse.

### Resumen

Dos tablas con estadísticas agregadas:
- **Tabla de documentos**  cantidad de citas y número de códigos distintos usados por documento
- **Tabla de códigos**  cantidad de citas y número de documentos distintos por código, ordenados por más citados

### Exportar

Descarga tus datos en varios formatos:
- **Por código** — citas agrupadas bajo cada encabezado de código (TXT o CSV)
- **Por documento** — citas agrupadas bajo cada encabezado de documento (TXT o CSV)
- **JSON** — datos estructurados completos para uso con herramientas externas (Atlas.ti, NVivo, etc.)
- **Informe Narrativo (Markdown)** — informe estructurado por código → citas → extractos de memorando. Ideal para defensa de tesis o publicación académica. El archivo incluye todos los códigos con al menos una cita, con todas las citas asociadas y el texto completo de los memorandos del proyecto.

---

## Notificaciones

El ícono de campana en el encabezado superior muestra un badge con el número de notificaciones no leídas.

Haz clic en la campana para abrir el desplegable de notificaciones. Las notificaciones se entregan en tiempo real — no es necesario recargar la página.

### Qué genera una notificación

- Alguien comenta en una **cita que creaste**
- Alguien comenta en un **código de tu proyecto** (solo propietario del proyecto)

### Marcar como leída

Haz clic en cualquier notificación para marcarla como leída. Usa **Marcar todas como leídas** en la parte superior del desplegable para limpiar todas a la vez.

---

## Soporte

Abre un ticket de soporte para contactar a los administradores de la plataforma.

### Abrir un ticket

Ve a **Soporte** en la barra lateral (o desde el menú de usuario) y haz clic en **Nuevo ticket**. Ingresa un asunto y una descripción de tu problema.

### Ver tus tickets

La página de Soporte lista todos tus tickets abiertos y pasados con su estado:
- **Abierto**  esperando respuesta del administrador
- **En progreso**  el administrador está trabajando en ello
- **Resuelto**  el administrador ha proporcionado una resolución
- **Cerrado**  el ticket está cerrado, no es posible responder más

### Responder a un ticket

Abre un ticket y escribe tu respuesta en el campo de texto al final. Haz clic en **Enviar**. Si el ticket estaba marcado como Resuelto, tu respuesta lo reabrirá automáticamente.

---

## Panel de administración

El panel de administración está disponible en `/dashboard/admin` para usuarios con el rol **Admin**. Un enlace de **Administración** aparece en la barra lateral para las cuentas de administrador.

### Panel de estadísticas

Muestra totales de toda la plataforma: usuarios registrados, proyectos, documentos, citas y tickets de soporte abiertos.

### Usuarios

Lista todos los usuarios registrados con su cantidad de proyectos, citas, rol y estado. Acciones disponibles por usuario:
- **Suspender / Reactivar**  los usuarios suspendidos no pueden iniciar sesión
- **Hacer administrador / Hacer usuario**  alternar el rol Admin

### Proyectos

Lista todos los proyectos con conteo de miembros, documentos, códigos, memorandos, citas y **uso de almacenamiento** (tamaño total de todos los PDFs subidos).

### Tickets de soporte

Lista todos los tickets abiertos por cualquier usuario. Haz clic en un ticket para ver el hilo de mensajes, responder en nombre del soporte y cambiar el estado del ticket.
