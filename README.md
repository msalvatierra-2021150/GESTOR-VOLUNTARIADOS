# Gestor Voluntariados (Volunteer360)

Este es un RestServer con conexión a MongoDB.

## Requisitos previos
Asegúrate de tener instalado Node.js en tu sistema. Puedes descargarlo en [Node.js Official Website](https://nodejs.org/).

## Configuración de variables de entorno

1. Renombra el archivo `example.env` a `.env` en la raíz del proyecto. Esto es necesario para tener las variables de entorno configuradas en el proyecto.

2. Abre el archivo `.env` y asegúrate de configurar las siguientes variables de entorno:

   - `PORT` : El puerto en el que deseas que el servidor escuche.
   - `MONGODB_CNN` : La cadena de conexión a tu base de datos MongoDB.
   - `SECRET_KEY_FOR_TOKEN` : La clave secreta utilizada para firmar y verificar tokens de autenticación.

## Instalación de dependencias

Para instalar los módulos de Node.js necesarios, ejecuta el siguiente comando en la raíz del proyecto:

```
npm install
```


## Ejecución del proyecto

Para iniciar el servidor, utiliza el siguiente comando:
```
npm run dev
```


El servidor estará disponible en el puerto especificado en tu archivo `.env`.

## Notas adicionales

- Asegúrate de tener una base de datos MongoDB configurada y que la cadena de conexión sea correcta en tu archivo `.env`.

- Este README proporciona una guía básica para comenzar con el proyecto. A medida que se agreguen más funcionalidades al proyecto, considera expandir este README para proporcionar documentación adicional.

¡Disfruta trabajando en el Proyecto Volunteer360!
