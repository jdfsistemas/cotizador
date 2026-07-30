# Cotizador Troqueles Colombia

Aplicativo web estatico creado con la informacion de la primera hoja del archivo:

`C:\Users\sistemas\Downloads\DOCUMENTOS\FORMATO COTIZACION TROQUEL  COLOMBIA.xlsx`

## Como usarlo con base de datos

Ejecute el servidor local:

```powershell
python server.py
```

Luego abra:

`http://127.0.0.1:8000`

La base de datos se crea automaticamente como `cotizador.db` en esta carpeta.

Para usar la app sin guardar en base de datos, todavia puede abrir `index.html` directamente en el navegador.

La app permite editar:

- Cliente, entrega, PO, PO Huella, fecha y tiempo de entrega.
- Cada linea permite elegir tipo de troquel: Universal, 3L vida extendida o Cromo. Se pueden cotizar varios tipos en la misma proforma.
- El boton `Agregar item` crea nuevas lineas de cotizacion cuando el cliente necesita mas de tres items.
- TRM hoy, ajuste de TRM, IVA, cantidades, productos y precio USD Kocher.

Los calculos incluidos replican la hoja base:

- Precio proforma USD = USD Kocher / (1 - 20%). Ejemplo: 100 USD Kocher = 125 USD proforma.
- Total proforma USD = Precio proforma USD * cantidad.
- PO Huella = dos primeras letras de las dos primeras palabras del cliente + fecha `ddmmaaaa`.
- La cotizacion queda en dolares. La TRM se conserva solo como dato de referencia.
- Flete Colombia = base 72 USD por grupos: 1-4 troqueles cobra 72, 5-8 cobra 144, 9-12 cobra 216, 13-16 cobra 288 y 17-20 cobra 360.
- Manejo Colombia segun agente: DHL usa la tabla en USD del Excel; FEDEX usa la tabla COP convertida con base 3600. Ambos suman combustible de 11.94 USD cuando el total Kocher por cantidad es mayor o igual a 200.
- En la proforma del cliente se muestra una sola linea `Flete`, que suma flete + manejo.
- IVA calculado solo sobre el subtotal de productos; no se calcula IVA sobre flete ni manejo.

Use el boton `Imprimir` para sacar la factura proforma desde el navegador.

Use el boton `Guardar cotizacion` para almacenar la cotizacion completa en SQLite.

Para consultar por web las cotizaciones guardadas, abra:

`http://127.0.0.1:8000/cotizaciones.html`
