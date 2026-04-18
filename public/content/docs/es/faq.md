# Preguntas Frecuentes

## General

**¿Qué es QAnubis?**
QAnubis es una plataforma CAQDAS (Análisis Cualitativo de Datos Asistido por Computadora). Permite a los investigadores subir documentos PDF, seleccionar fragmentos de texto para crear citas, organizarlas con un esquema jerárquico de códigos, escribir memorandos colaborativos y generar informes visuales — todo dentro de un espacio de proyecto compartido.

**¿Qué formatos de archivo son compatibles?**
Solo PDF. Otros formatos (DOCX, imágenes) están planificados para versiones futuras. Si el documento es un PDF escaneado sin capa de texto, el visor mostrará un aviso y la selección de texto no estará disponible.

**¿QAnubis es gratuito?**
Sí. QAnubis es de código abierto (licencia MIT). Puedes usar la instancia alojada o hacer tu propio despliegue — consulta [Arquitectura](/docs/architecture) para las opciones de implementación.

---

## Cuenta

**¿Cómo verifico mi correo electrónico después de registrarme?**
Al crear tu cuenta, se envía un correo de verificación a la dirección que proporcionaste. Haz clic en el enlace de ese correo para activar tu cuenta. Si no lo encuentras, revisa la carpeta de spam. Puedes solicitar un nuevo enlace desde la página de inicio de sesión.

**Olvidé mi contraseña. ¿Qué hago?**
Haz clic en **¿Olvidaste tu contraseña?** en la página de inicio de sesión e ingresa tu correo. Se enviará un enlace de restablecimiento si existe una cuenta con ese correo.

**¿Puedo iniciar sesión con Google o GitHub en lugar de correo?**
Sí, si la instancia que usas tiene OAuth configurado. Busca los botones **Iniciar sesión con Google** o **Iniciar sesión con GitHub** en la página de inicio de sesión. Las cuentas OAuth no tienen contraseña local.

**¿Cómo elimino mi cuenta?**
Ve a **Perfil** y desplázate hasta la sección **Eliminar cuenta**. La eliminación es permanente y borra tus datos personales, pero no elimina los proyectos a los que perteneces — simplemente serás removido como miembro.

---

## Proyectos y Colaboración

**¿Cómo funcionan las invitaciones?**
Los propietarios de proyectos pueden invitar a cualquier persona por correo electrónico desde la pestaña **Miembros**. El invitado recibe un enlace válido por 48 horas. Si no tiene cuenta, puede registrarse primero y luego visitar el enlace de invitación para unirse. Después de 48 horas el enlace expira, pero el propietario puede enviar uno nuevo.

**¿Cómo cambio el rol de un miembro?**
Abre la pestaña **Miembros** (solo el propietario), haz clic en el badge de rol junto al nombre del miembro y selecciona el nuevo rol. Los roles son: Propietario, Colaborador y Visualizador.

**¿Cuál es la diferencia entre los roles?**

| Acción | Propietario | Colaborador | Visualizador |
|--------|------------|-------------|--------------|
| Ver todo el contenido | ✅ | ✅ | ✅ |
| Crear/editar/eliminar citas, códigos, memorandos | ✅ | ✅ | ❌ |
| Invitar/eliminar miembros | ✅ | ❌ | ❌ |
| Editar configuración del proyecto | ✅ | ❌ | ❌ |
| Eliminar proyecto | ✅ | ❌ | ❌ |

**¿Pueden varias personas trabajar en el mismo proyecto al mismo tiempo?**
Sí. Todos los miembros comparten los mismos documentos, códigos, citas y memorandos en tiempo real (los cambios aparecen al recargar la página o navegar).

---

## Documentos y Citas

**¿Qué pasa con las citas si elimino un documento?**
Todas las citas asociadas a ese documento se eliminan permanentemente, incluyendo sus asignaciones de código y comentarios.

**¿Qué pasa si elimino un código que tiene citas asignadas?**
El código se elimina de todas las citas a las que estaba asignado. Las citas en sí no se eliminan. Si deseas reasignarlas, hazlo antes de eliminar el código.

**¿Puedo cambiar el color de resaltado de una cita?**
Sí. Haz clic en el círculo de color en la tarjeta de cita en la barra lateral del visor de PDF para abrir un selector de colores.

---

## Informes y Exportación

**¿Puedo exportar mis datos?**
Sí. La pestaña **Informes** ofrece descargas en texto plano y CSV, agrupados por código o por documento.

**¿Qué gráficos están disponibles en Informes?**
- **Mapa de calor Citas × Códigos** — muestra qué códigos aparecen en qué documentos
- **Mapa de calor de co-ocurrencia de códigos** — muestra qué códigos aparecen juntos en las mismas citas
- Los gráficos requieren al menos una cita con un código asignado para renderizarse.

---

## Autoalojamiento

**¿Cómo ejecuto QAnubis localmente?**
Consulta la [Guía de Contribución](/docs/contribution-guidelines) para un paso a paso de configuración local.

**¿Qué infraestructura necesita QAnubis?**
Una base de datos PostgreSQL, almacenamiento de objetos compatible con S3 (AWS S3, Cloudflare R2 o MinIO) y un servidor SMTP para correo. Todo puede ejecutarse localmente via Docker Compose para desarrollo.
