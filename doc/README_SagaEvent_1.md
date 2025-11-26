# 🧭 Vista de Formulario de Evento (Flujo Saga)

## Descripción general

La vista **Formulario de Evento** representa un flujo donde un dominio del sistema ejecuta un evento concreto dentro de una saga.  
Su objetivo es permitir al usuario **visualizar todos los eventos disponibles** en el dominio actual y **rellenar y enviar el formulario correspondiente al evento activo**.

El comportamiento debe ser claro, accesible y ofrecer una experiencia de usuario fluida y visualmente organizada.

---

## Flujo funcional

Los datos para iniciar el flujo se encuentran en la url actual. Por ejemplo:
http://{dominio}.tia.deployreal.com

1. **Identificación del dominio actual**
   - El sistema obtiene el identificador del dominio actual a partir del {dominio} indicado en la url.

2. **Obtención de datos del flujo**

- El JSON se obtendrá del contenido ofrecido por la url http://{dominio}.{todo el resto}/config.json
- Una vez obtenido el dominio actual mediante la url y el JSON, se busca en el array "domains" el objeto que coincida "name" con nuestro dominio actual, no importa que haya diferencias entre mayúscula y minúsculas.
- Con el objeto obtenido usamos el array de la propiedad "listeners" para hacer un GET por cada elemento del array, devolvemos su resultado en un array mediante una promesa de js.
  Los GETS se construirían de la siguiente manera:
  GET https://{dominio}.tia.deployreal.com/{id del listener}
  así pues, para el dominio :

  {
  "id": "Payroll",
  "queue": "payroll-queue",
  "publishes": [
  {
  "event": "configuracion-pago-payroll",
  "payloadSchema": {
  "empleadoId": "string",
  "nombre": "string",
  "apellido": "string",
  "email": "string"
  }
  }
  ],
  "listeners": [
  {
  "id": "payroll-on-registro-hr",
  "on": {
  "event": "registro-empleado-hr",
  "fromDomain": "HR"
  },
  "actions": [
  {
  "type": "emit",
  "event": "configuracion-pago-payroll",
  "mapping": {
  "empleadoId": "empleadoId",
  "nombre": "nombre",
  "apellido": "apellido",
  "email": "email"
  }
  }
  ]
  }
  ]
  }
  Se llamaría a un solo GET https://payroll-on-registro-hr.Payroll.tia.deployreal.com

  en uno de los elementos del array resultado llegará un objeto con esta estructura
  {event: "registro-empleado-hr"}

- Si por lo menos una llamada da success, guardamos el evento que devuelve. Ese será nuestro evento actual. Si por el contrario ninguno devuelve un success con su campo "event", consideraremos nuestro evento el campo "event" del array "publishes" señalado con un "start": true en el "publishes" de nuestro dominio

**Ejemplo simplificado del endpoint dominio:**

```json
{
  "event": "OrderPlaced"
}
```

**Ejemplo simplificado del JSON:**

```json
{
  "name": "alta-empleado-choreography",
  "version": 2,
  "domains": [
    {
      "id": "Payroll" /*Nombre del dominio*/,
      "queue": "payroll-queue" /*cola*/,
      "publishes": [
        {
          "event": "configuracion-pago-payroll" /* Nombre del evento*/,
          "payloadSchema": {
            "empleadoId": "string",
            "nombre": "string",
            "apellido": "string",
            "email": "string"
          } /* Esquema del formulario */,
          "start": true
        }
      ] /* Eventos */,
      "listeners": [
        {
          "id": "payroll-on-registro-hr" /* identificador del listener*/,
          "on": {
            "event": "registro-empleado-hr" /* Evento a ejecutar en el POST del formulario*/,
            "fromDomain": "HR" /*Dominio en el que se ejecuta el evento*/
          } /*Datos del evento que dispara este listener*/,
          "actions": [
            {
              "type": "emit" /* tipo de evento */,
              "event": "configuracion-pago-payroll" /* Evento a ejecutar en el POST del formulario*/,
              "mapping": {
                "empleadoId": "empleadoId",
                "nombre": "nombre",
                "apellido": "apellido",
                "email": "email"
              } /* Valores por defecto del formulario. Se emparejan mediante la clave con los elementos de su payloadSchema correspondiente  */
            }
          ]
        }
      ] /*listeners asociados a los eventos*/
    }
  ]
}
```

---

## Comportamiento esperado

1. **Visualización general**
   - La vista muestra un **timeline o lista** con todos los eventos del dominio actual.
   - Cada evento aparece en una **tarjeta o caja** con su nombre visible.
   - El evento **activo** debe destacarse visualmente.

2. **Formulario del evento activo**
   - Los campos se validan al hacer click en el botón de submit. A partir de hacer la primera validación de los campos del formularios los campos se validarán en tiempo real.
   - Bajo la tarjeta del evento activo se muestra un **formulario dinámico** generado automáticamente a partir de la definición del campo `payloadSchema`.
   - Cada campo del formulario se genera según el tipo de dato definido:
     - `string` → campo de texto.
     - `number` → campo numérico.
   - Si un campo es un **objeto**, sus propiedades se agrupan dentro de una **caja con título** (el nombre de la clave).
   - Si un campo es un **array de objetos**, cada objeto se representa como una **subcaja con sus campos individuales**.
     - El bloque completo muestra el título de la clave del array.
     - Se debe permitir añadir o eliminar elementos del array de forma sencilla.
   - Los valores iniciales del formulario se definen en la propiedad `listeners`, siendo el elemento del array correspondiente el `listener` en el que coincida el campo on.event con el campo `name` del evento. Dentro de esta objeto, en la propiedad `mapping` se muestran propiedades que indican el valor por defecto de los campos del formulario, ya que coinciden las claves de estos valores con las claves de `payloadSchema`

3. **Envío del formulario**
   - Al pulsar el botón **Enviar**, los datos introducidos deben enviarse en **exactamente la misma estructura** que el `payloadSchema` original.
   - Se hará una llamada POST https://{dominio}.tia.deployreal.com/{queue}/{evento}.
   - Mientras el envío esté en curso:
     - Todos los campos y el botón de envío se bloquean.
     - Al botón "Enviar" se le añade después del texto pero dentro del botón un spinner animado
   - Si el envío termina correctamente:
     - Se mantiene todo bloqueado.
     - Se sustituye el formulario por un **banner de éxito** con un mensaje claro. Este mensaje se mostrará con un icono de éxito, centrado y con letras grandes.
     - Se muestra también banner **banner spinner** que indica que se está volviendo a llamar a **endpoint dominio** para actualizar el evento actual y se vuelve a llamar cada 5s para volver a realizar el mismo proceso actualizado con el formulario del evento indicado por el nuevo resultado del endpoint.
   - Si el envío falla:
     - No se bloquea la interfaz.
     - Se muestra un **banner de error modal** con el mensaje correspondiente.

---

## Reglas de experiencia de usuario (UX)

1. **Claridad visual**
   - Cada nivel de anidación (array u objeto) debe estar **separado visualmente** por espacios o recuadros.
   - Los títulos de las secciones deben coincidir con las claves de los objetos o arrays del JSON.
   - Los formularios deben mantener un **espaciado uniforme** y un diseño legible, con jerarquía clara.

2. **Interacción cómoda**
   - Los botones para añadir/eliminar elementos de arrays deben ser visibles y accesibles.
   - El foco inicial debe situarse en el primer campo del formulario.
   - El botón **Enviar** debe estar alineado a la derecha en la parte inferior del formulario.

3. **Mensajes y estado**
   - **Éxito:** “Enviado con éxito”.
   - **Error:** “Error al enviar la información”.
   - Los banners deben aparecer debajo del formulario, claramente diferenciados por color o icono.
   - No se debe perder la información introducida en caso de error.

4. **Comportamiento general**
   - El formulario debe adaptarse automáticamente al evento activo del dominio actual.
   - Debe ser posible reutilizar la misma vista para diferentes sagas y dominios sin cambios manuales.

---

## Resultado esperado

- El usuario visualiza una **lista de eventos** del dominio actual.
- El evento activo muestra un **formulario dinámico** generado a partir del esquema recibido.
- Puede **completar los campos**, añadir o eliminar elementos si hay arrays.
- Al enviar, ve un **mensaje de éxito o error** según el resultado.
- El flujo es **intuitivo, limpio y coherente** con el resto de la aplicación.

## mock JSON

```JSON
{
  "name": "alta-empleado-choreography",
  "version": 2,
  "domains": [
   {
    "id": "HR",
    "queue": "hr-queue",
    "publishes": [
     {
      "event": "registro-empleado-hr",
      "payloadSchema": {
       "empleadoId": "string",
       "nombre": "string",
       "apellido": "string",
       "email": "string"
      },
       "start": true
     }
    ],
    "listeners": []
   },
   {
    "id": "Payroll",
    "queue": "payroll-queue",
    "publishes": [
     {
      "event": "configuracion-pago-payroll",
      "payloadSchema": {
       "empleadoId": "string",
       "nombre": "string",
       "apellido": "string",
       "email": "string"
      }
     }
    ],
    "listeners": [
     {
      "id": "payroll-on-registro-hr",
      "on": {
       "event": "registro-empleado-hr",
       "fromDomain": "HR"
      },
      "actions": [
       {
        "type": "emit",
        "event": "configuracion-pago-payroll",
        "mapping": {
         "empleadoId": "empleadoId",
         "nombre": "nombre",
         "apellido": "apellido",
         "email": "email"
        }
       }
      ]
     }
    ]
   },
   {
    "id": "Facilities",
    "queue": "facilities-queue",
    "publishes": [
     {
      "event": "asignacion-espacio-facilities",
      "payloadSchema": {
       "empleadoId": "string",
       "nombre": "string",
       "apellido": "string"
      }
     }
    ],
    "listeners": [
     {
      "id": "facilities-on-configuracion-payroll",
      "on": {
       "event": "configuracion-pago-payroll",
       "fromDomain": "Payroll"
      },
      "actions": [
       {
        "type": "emit",
        "event": "asignacion-espacio-facilities",
        "mapping": {
         "empleadoId": "empleadoId",
         "nombre": "nombre",
         "apellido": "apellido"
        }
       }
      ]
     }
    ]
   }
  ]
 }
```

##Ejemplo de ejecución:

Primer Dominio (HR)
http://hr.tia.deployreal.com

JSON
http://hr.tia.deployreal.com/config

GETs
No hay llamada GET ya que no tiene listeners. Se busca el evento correspondiente mediante la propiedad "start": true en el evento
{
"event": "registro-empleado-hr",
"payloadSchema": {
"empleadoId": "string",
"nombre": "string",
"apellido": "string",
"email": "string"
},
"start": true
}

2. POST
   POST hr.tia.deployreal.com/hr-queue/registro-empleado-hr
   {
   "empleadoId": "string",
   "nombre": "string",
   "apellido": "string",
   "email": "string"
   }

Segundo dominio (Payroll)

1. GET payroll-on-registro-hr.Payroll.tia.deployreal.com
2. POST payroll-queue.Payroll.tia.deployreal.com/payroll-queue/configuracion-pago-payroll
   {
   "empleadoId": "empleadoId",
   "nombre": "nombre",
   "apellido": "apellido",
   "email": "email"
   }

flowchart TD
A[Obtener dominio desde URL] --> B[GET config.json]
B --> C[Buscar dominio en JSON]
C --> D[Ejecutar GETs de listeners]
D --> E[Determinar evento activo]
E --> F[Renderizar formulario dinámico]
F --> G[POST envío]
G --> H[Mostrar banners y actualizar estado]
