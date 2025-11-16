# 🧭 Vista de Formulario de Evento (Flujo Saga)

## Descripción general

La vista **Formulario de Evento** representa un flujo donde un dominio del sistema ejecuta un evento concreto dentro de una saga.  
Su objetivo es permitir al usuario **visualizar todos los eventos disponibles** en el dominio actual y **rellenar y enviar el formulario correspondiente al evento activo**.

El comportamiento debe ser claro, accesible y ofrecer una experiencia de usuario fluida y visualmente organizada.

---

## Flujo funcional

1. **Identificación del dominio actual**
   - El sistema obtiene el identificador del dominio actual a partir de una variable global (`VITE_DOMAIN`).
   - Ese dominio se utilizará para determinar qué parte del flujo se está mostrando.

2. **Obtención de datos del flujo**
   - Se realiza una llamada (mockeada en esta fase) al servicio `/sagaEvent`.
   - Este servicio devuelve un **JSON** que describe toda la saga, sus dominios y los eventos disponibles en cada uno.

   **Ejemplo simplificado del JSON:**

   ```json
   {
     "name": "Retailer Happy Path Saga",
     "version": 1,
     "event": "OrderPlaced",
     "domains": [
       {
         "id": "order",
         "queue": "orders",
         "events": [
           {
             "name": "OrderPlaced",
             "payloadSchema": {
               "orderId": "string",
               "lines": [{ "sku": "string", "qty": "number" }],
               "amount": "number",
               "address": {
                 "line1": "string",
                 "city": "string",
                 "zip": "string",
                 "country": "string"
               }
             }
           },
           {
             "name": "PaymentCaptured",
             "payloadSchema": {
               "paymentId": "string",
               "orderId": "string",
               "amount": "number"
             }
           },
           {
             "name": "OrderConfirmed",
             "payloadSchema": {
               "orderId": "string",
               "status": "string"
             }
           }
         ]
       }
     ]
   }
   ```

---

## Comportamiento esperado

1. **Visualización general**
   - La vista muestra un **timeline o lista** con todos los eventos del dominio actual.
   - Cada evento aparece en una **tarjeta o caja** con su nombre visible.
   - El evento **activo** (indicado en el campo `event` del JSON) debe destacarse visualmente.

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

3. **Envío del formulario**
   - Al pulsar el botón **Enviar**, los datos introducidos deben enviarse en **exactamente la misma estructura** que el `payloadSchema` original.
   - El resultado del envío se simula con un log o mensaje de confirmación.
   - Mientras el envío esté en curso:
     - Todos los campos y el botón de envío se bloquean.
     - Al botón "Enviar" se le añade después del texto pero dentro del botón un spinner animado
   - Si el envío termina correctamente:
     - Se mantiene todo bloqueado.
     - Se sustituye el formulario por un **banner de éxito** con un mensaje claro. Este mensaje se mostrará con un icono de éxito, centrado y con letras grandes.
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
  "name": "Retailer Happy Path Saga",
  "version": 1,
  "domains": [
    {
      "id": "order",
      "queue": "orders",
      "events": [
        {
          "name": "OrderPlaced",
          "payloadSchema": {
            "orderId": "string",
            "lines": [
              {
                "sku": "string",
                "qty": "number"
              }
            ],
            "amount": "number",
            "address": {
              "line1": "string",
              "city": "string",
              "zip": "string",
              "country": "string"
            }
          }
        },
        {
          "name": "PaymentCaptured",
          "payloadSchema": {
            "paymentId": "string",
            "orderId": "string",
            "amount": "number"
          }
        },
        {
          "name": "OrderConfirmed",
          "payloadSchema": {
            "orderId": "string",
            "status": "string"
          }
        }
      ],
      "listeners": [
        {
          "id": "order-on-OrderPlaced",
          "delayMs": 20,
          "on": { "event": "OrderPlaced" },
          "actions": [
            {
              "type": "set-state",
              "status": "PLACED"
            },
            {
              "type": "emit",
              "event": "InventoryReserved",
              "toDomain": "inventory",
              "mapping": {
                "reservationId": { "const": "RES-001" },
                "orderId": "orderId",
                "items": {
                  "arrayFrom": "lines",
                  "map": {
                    "sku": "sku",
                    "qty": "qty"
                  }
                },
                "amount": "amount",
                "address": {
                  "map": {
                    "line1": { "from": "line1" },
                    "city": { "from": "city" },
                    "zip": { "from": "zip" },
                    "country": { "from": "country" }
                  },
                  "objectFrom": "address"
                }
              }
            }
          ]
        },
        {
          "id": "order-on-PaymentCaptured",
          "delayMs": 25,
          "on": { "event": "PaymentCaptured" },
          "actions": [
            {
              "type": "set-state",
              "status": "CONFIRMED"
            },
            {
              "type": "emit",
              "event": "OrderConfirmed",
              "toDomain": "order",
              "mapping": {
                "orderId": "orderId",
                "status": { "const": "CONFIRMED" }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "inventory",
      "queue": "inventory",
      "events": [
        {
          "name": "InventoryReserved",
          "payloadSchema": {
            "reservationId": "string",
            "orderId": "string",
            "items": [
              {
                "sku": "string",
                "qty": "number"
              }
            ],
            "amount": "number",
            "address": {
              "line1": "string",
              "city": "string",
              "zip": "string",
              "country": "string"
            }
          }
        }
      ],
      "listeners": [
        {
          "id": "inventory-on-InventoryReserved",
          "delayMs": 30,
          "on": { "event": "InventoryReserved" },
          "actions": [
            {
              "type": "set-state",
              "status": "RESERVED"
            },
            {
              "type": "emit",
              "event": "PaymentAuthorized",
              "toDomain": "payments",
              "mapping": {
                "paymentId": { "const": "PAY-001" },
                "orderId": "orderId",
                "reservationId": "reservationId",
                "amount": "amount",
                "address": {
                  "objectFrom": "address",
                  "map": {
                    "line1": "line1",
                    "city": "city",
                    "zip": "zip",
                    "country": "country"
                  }
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "payments",
      "queue": "payments",
      "events": [
        {
          "name": "PaymentAuthorized",
          "payloadSchema": {
            "paymentId": "string",
            "orderId": "string",
            "reservationId": "string",
            "amount": "number",
            "address": {
              "line1": "string",
              "city": "string",
              "zip": "string",
              "country": "string"
            }
          }
        }
      ],
      "listeners": [
        {
          "id": "payments-on-PaymentAuthorized",
          "delayMs": 40,
          "on": { "event": "PaymentAuthorized" },
          "actions": [
            {
              "type": "set-state",
              "status": "AUTHORIZED"
            },
            {
              "type": "emit",
              "event": "ShipmentPrepared",
              "toDomain": "shipping",
              "mapping": {
                "shipmentId": { "const": "SHIP-001" },
                "orderId": "orderId",
                "paymentId": "paymentId",
                "amount": "amount",
                "address": {
                  "objectFrom": "address",
                  "map": {
                    "line1": "line1",
                    "city": "city",
                    "zip": "zip",
                    "country": "country"
                  }
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "shipping",
      "queue": "shipping",
      "events": [
        {
          "name": "ShipmentPrepared",
          "payloadSchema": {
            "shipmentId": "string",
            "orderId": "string",
            "paymentId": "string",
            "amount": "number",
            "address": {
              "line1": "string",
              "city": "string",
              "zip": "string",
              "country": "string"
            }
          }
        }
      ],
      "listeners": [
        {
          "id": "shipping-on-ShipmentPrepared",
          "delayMs": 50,
          "on": { "event": "ShipmentPrepared" },
          "actions": [
            {
              "type": "set-state",
              "status": "PREPARED"
            },
            {
              "type": "emit",
              "event": "PaymentCaptured",
              "toDomain": "order",
              "mapping": {
                "paymentId": "paymentId",
                "orderId": "orderId",
                "amount": "amount"
              }
            }
          ]
        }
      ]
    }
  ]
}
```
