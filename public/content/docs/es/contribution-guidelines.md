# Guía de Contribución

¡Gracias por considerar contribuir con QAnubis! Para garantizar una colaboración fluida y eficiente, sigue estas pautas al enviar contribuciones.

## Cómo Contribuir

1. **Clona el Repositorio**: Clona el repositorio de QAnubis en tu máquina local.
    ```bash
    git clone https://github.com/unipampa-lesse/qanubis.git
    ```
2. **Crea una Rama**: Crea una nueva rama para tu contribución.
    ```bash
    git checkout -b feat/{numero-de-issue}
    ```
3. **Implementa los Cambios**: Realiza tus cambios, ya sean correcciones de bugs, nuevas funcionalidades o mejoras en la documentación.
4. **Haz el Commit**: Commitea tus cambios con un mensaje claro y descriptivo. Se recomienda el uso de conventional commits.
    ```bash
    git commit -m "feat: Descripción de la funcionalidad"
    ```
5. **Envía al Repositorio**: Envía tus cambios al repositorio bifurcado.
    ```bash
    git push origin feat/{numero-de-issue}
    ```
6. **Abre un Pull Request**: Abre un pull request contra la rama `main` del repositorio QAnubis. Incluye una descripción detallada de tus cambios y referencia los issues relacionados.

## Ramas

- Usa ramas de funcionalidad con el nombre `feat/{numero-de-issue}` para nuevas features.
- Usa ramas de corrección con el nombre `fix/{numero-de-issue}` para correcciones de bugs.

## Mensajes de Commit

- Usa mensajes de commit claros y concisos.
- Sigue el formato de conventional commits: `tipo: descripción` (ej: `feat: Agregar login de usuario`).
- Los tipos convencionales incluyen `feat`, `fix`, `docs`, `style`, `refactor`, `test` y `chore`.

## Proceso de Revisión

Todas las contribuciones serán revisadas por los mantenedores. Es posible que se te pida hacer cambios o proporcionar información adicional. Ten paciencia y sé receptivo durante este proceso.

## Licencia

Al contribuir con QAnubis, aceptas que tus contribuciones se licenciarán bajo la misma licencia del proyecto (Licencia MIT).
¡Gracias por ayudar a mejorar QAnubis!

## Ejecutar Localmente

Para ejecutar QAnubis localmente para desarrollo o pruebas, sigue los pasos a continuación.

### Prerrequisitos

- **Node.js ≥ 24** — [nodejs.org](https://nodejs.org/)
- **pnpm** — `npm install -g pnpm`
- **Docker** con el plugin Compose — [docker.com/get-started](https://www.docker.com/get-started)

### Pasos

1. **Clona el repositorio**
    ```bash
    git clone https://github.com/unipampa-lesse/qanubis.git
    cd qanubis
    ```

2. **Copia el archivo de variables de entorno**
    ```bash
    cp .env.example .env
    ```

3. **Inicia los servicios locales** (PostgreSQL, MinIO, MailHog)
    ```bash
    docker compose up -d
    ```
    | Servicio | URL |
    |---------|-----|
    | App (tras el paso 6) | http://localhost:3000 |
    | Consola MinIO | http://localhost:9001 |
    | MailHog (captura de emails) | http://localhost:8025 |

4. **Instala las dependencias**
    ```bash
    pnpm install
    ```

5. **Configura la base de datos**

    Genera el cliente Prisma, aplica las migraciones y carga los datos de ejemplo en un solo paso:
    ```bash
    pnpm prisma:generate
    pnpm setup
    ```
    > En la primera ejecución de migraciones se pedirá un nombre — escribe `initial` y presiona Enter.

    El seed crea las siguientes cuentas:

    | Correo | Contraseña | Rol | Notas |
    |--------|------------|-----|-------|
    | admin@qanubis.local | admin123 | Admin | Acceso completo al panel de administración |
    | owner@qanubis.local | user123 | User | Propietario de *Remote Work Study* |
    | collaborator@qanubis.local | user123 | User | Colaborador en *Remote Work Study*, Propietario de *Interview Archive* |
    | viewer@qanubis.local | user123 | User | Visualizador en *Remote Work Study* |
    | researcher@qanubis.local | user123 | User | Cuenta de compatibilidad |

    El seed también crea dos proyectos de ejemplo, códigos con jerarquía, memorandos y tickets de soporte para que puedas explorar todas las funcionalidades de inmediato.

6. **Inicia el servidor de desarrollo**
    ```bash
    pnpm dev
    ```

7. Abre **http://localhost:3000** e inicia sesión con una de las cuentas del seed.
