Proyecto IMC
============

Este proyecto es una aplicación para calcular el Índice de Masa Corporal (IMC). Consta de un frontend desarrollado en React con TypeScript y Vite, y un backend en Node.js con Express. El frontend está desplegado en Vercel, y el backend en Render. Elegimos estas plataformas por su accesibilidad, facilidad de uso y planes gratuitos, que nos permitieron implementar el proyecto sin costos.

Por qué usamos Render y Vercel
------------------------------

*   **Render**: Proporciona un entorno confiable y escalable para el backend, con soporte nativo para Node.js y una configuración sencilla de variables de entorno.
    
*   **Vercel**: Está optimizado para aplicaciones frontend, especialmente con React y Vite, y ofrece integración continua con GitHub para actualizaciones automáticas.
    

Organización del proyecto
-------------------------

Para facilitar la modularidad, trazabilidad y mantenimiento, el proyecto se divide en dos repositorios en GitHub:

*   **Backend**: Repositorio 2025\_proyecto1\_back\_imc. Incluye el código de la API, scripts de ejecución, configuración de dependencias (package.json), documentación de endpoints y configuraciones específicas.
    
*   **Frontend**: Repositorio 2025\_proyecto1\_front\_imc. Contiene el código de la aplicación cliente, scripts de construcción y ejecución para Vite, y configuraciones del framework (vite.config.js).
    

Esta separación permite gestionar versiones de forma independiente, simplifica la colaboración y agiliza las actualizaciones.

Cómo desplegar la aplicación
----------------------------

### Backend

*   **Tecnologías**: Node.js, Nest.js
    
*   **Plataforma**: Render
    
*   **Repositorio**: 2025\_proyecto1\_back\_imc
    

**Pasos para el despliegue en Render:**

1.  Creá una cuenta en [Render](https://render.com/).
    
2.  Creá un nuevo proyecto y vinculá el repositorio 2025\_proyecto1\_back\_imc desde GitHub.
    
3.  Configurá las variables de entorno necesarias, como PORT.
    
4.  Definí los comandos de construcción y arranque:
    
    *   npm install Este comando instala las dependencias listadas en package.json y crea la carpeta node\_modules.
        
    *   npm run start:prod Este comando ejecuta la versión optimizada de la aplicación para producción.
        
5.  Render genera una URL pública para el backend: https://proyecto-1-backend.onrender.com.
    
6.  Verificá el funcionamiento de la API con herramientas como Postman, probando endpoints como https://proyecto-1-backend.onrender.com/imc/calcular.
    

### Frontend

*   **Tecnologías**: React, TypeScript, Vite
    
*   **Plataforma**: Vercel
    
*   **Repositorio**: 2025\_proyecto1\_front\_imc
    

**Pasos para el despliegue en Vercel:**

1.  Creá una cuenta en [Vercel](https://vercel.com/).
    
2.  Importá el repositorio 2025\_proyecto1\_front\_imc desde GitHub.
    
3.  Definí el nombre del proyecto y seleccioná la rama principal (main).
    
4.  Vercel detecta automáticamente el framework (Vite) y usa las configuraciones predefinidas:
    
    *   Comando de build: npm run build
        
    *   Carpeta de salida: dist
        
5.  Hacé clic en "Deploy" para completar el proceso.
    
6.  Cada git push a la rama principal actualizará el despliegue automáticamente.
    
7.  Actualizár la solicitud del frontend para que apunte a la URL del backend: https://proyecto-1-backend.onrender.com/imc/calcular.
    

Cómo trabajar con Git
---------------------

1.  Hacé los cambios en tu máquina local.
    
2.  git add .git commit -m "Descripción de los cambios"
    
3.  git push origin main
    
4.  Render y Vercel actualizarán los despliegues automáticamente con cada push.
    

Problemas comunes y cómo solucionarlos
--------------------------------------

### 1\. Los cambios en el frontend no se reflejan en el despliegue

*   **Qué pasó**: El repositorio conectado a Vercel no es el correcto o está vinculado a un fork.
    
*   **Solución**: Verificá que Vercel esté conectado al repositorio 2025\_proyecto1\_front\_imc de tu cuenta de GitHub. Si usaste un fork, cloná el proyecto a un repositorio personal y reconectalo en Vercel.
    

### 2\. El frontend no se conecta al backend

*   **Qué pasó**: La URL del backend en el frontend está mal configurada, por ejemplo, apunta a localhost o a una URL antigua.
    
*   **Solución**:
    
    *   Confirmá la URL del backend en Render: https://proyecto-1-backend.onrender.com/imc/calcular.
        
    *   Volvé a desplegar el frontend en Vercel con git push.
        

### 3\. Error en el build del backend en Render

*   **Qué pasó**: Las dependencias no se instalaron correctamente o el package.json tiene errores.
    
*   **Solución**:
    
    *   Revisá que el archivo package.json esté completo y las dependencias sean correctas.
        
    *   Verificá que el comando npm install no tenga errores en los logs de Render.
        
    *   Si el problema persiste, probá eliminar la carpeta node\_modules y el archivo package-lock.json en local, ejecutá npm install de nuevo y subí los cambios.
        

### 4\. La API no responde en el endpoint esperado

*   **Qué pasó**: El endpoint está mal configurado o la URL pública de Render no está disponible.
    
*   **Solución**:
    
    *   Probá el endpoint en Postman (por ejemplo, https://proyecto-1-backend.onrender.com/imc/calcular).
        
    *   Asegurate de que el servicio en Render esté activo y no en modo "dormido" (puede pasar en el plan gratuito).
        
    *   Revisá los logs en Render para detectar errores en el servidor.
        

### 5\. Limitaciones del plan gratuito de Vercel o Render

*   **Qué pasó**: Los planes gratuitos tienen restricciones, como repositorios propios en Vercel o tiempos de inactividad en Render.
    
*   **Solución**:
    
    *   Para Vercel: Asegurate de usar un repositorio propio (2025\_proyecto1\_front\_imc) y no un fork.
        
    *   Para Render: Si el backend se "duerme", accedé a la URL pública para reactivarlo o considerá un plan pago para evitar suspensiones.
        

Consejos
--------

*   Usá archivos .env para manejar URLs y datos sensibles.
    
*   Probá la aplicación en local antes de subir cambios.
    
*   Verificá que las variables de entorno estén bien configuradas en Render y Vercel.
    
*   Mantené los repositorios organizados con commits claros y descriptivos.
    

Autores
--------
[Beccereca, Martín](martinbeccereca@gmail.com)

[Corazza, Carolina Paula](carolinapaulacorazza@gmail.com)

[De Miguel, Alejo José](alejodm12345@gmail.com)

[Ramello, Belén](belenramello@gmail.com)

[Saby, Juan Pablo](sabyjuanpablo2004@gmail.com)
