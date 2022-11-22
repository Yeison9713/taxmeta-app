import { format_num, getBase64 } from "../plugins";

export const ticket = async (data) => {
    data.pasajeros.pop()

    let logo = await getBase64("taxsuper")

    let data_anulado = {
        text: "Anulado",
        angle: 60,
        color: "black",
        opacity: 0.2,
        fontSize: 100,
    };

    let watermark = data.estado_tiq === "0" ? "" : data_anulado

    let tiquete = parseFloat(data.nro_tiq);
    let nroint = parseFloat(data.nrointer_tiq);
    let agencia = data.descagencia_tiq;
    let taquillero = data.taquillero_tiq;
    let nroPasajeros = data.pasajeros.length;
    let destino = data.destino_tiq.trim();
    let total = 0;
    let idPas = [];
    let nombres = [];
    let dcto = 0;
    let bruto = 0;
    let stylePDF = {
        pageSize: {
            width: 200,
            height: "auto",
        },
        pageMargins: [20, 10, 10, 10],
    };

    data.pasajeros = data.pasajeros.filter(item => item.idpasajero_tiq);
    data.pasajeros.forEach((pa) => {
        idPas.push(parseFloat(pa.idpasajero_tiq));
        nombres.push(pa.nombrepasajero_tiq.trim() + "\n");
        dcto += parseFloat(pa.dcto_tiq.replace(/\,/g, ""));
        bruto += parseFloat(pa.vlrbruto_tiq.replace(/\,/g, ""));

        total += parseFloat(pa.vlrneto_tiq.replace(/\,/g, "")) || 0;
    });

    let linea = {
        text:
            "--------------------------------------------------------",
        bold: true,
        fontSize: 8,
    };

    let sillas = data.pasajeros.map(item => item.silla_tiq)

    let formapago = "";

    switch (data.pasajeros[0].formapago_tiq) {
        case "01":
            formapago = "Efectivo";
            break;
        case "02":
            formapago = "Tarjeta crédito";
            break;
        case "03":
            formapago = "Tarjeta débito";
            break;
        case "04":
            formapago = "Otro";
            break;
        case "06":
            formapago = "Yates";
            break;
        case "07":
            formapago = "Redbus";
            break;
        case "08":
            formapago = "Reserva";
            break;
        case "09":
            formapago = "Convenio Brasilia";
            break;
        case "10":
            formapago = "Pin Bus";
            break;
    }

    return {
        watermark,
        ...stylePDF,
        content: [
            { text: `${data.fecha} ${data.hora}\n\n`, fontSize: 3 },
            {
                stack: [
                    {
                        columns: [
                            {
                                image: logo.message.message,
                                width: 170,
                                height: 80,
                            },
                            // {
                            //     image: data.logoSuper,
                            //     width: 100,
                            //     height: 50,
                            // },
                        ],
                    },
                ],
            },
            {
                stack: [{ text: "TAX META S.A" }, { text: "Nit. 892000113 - 0" }],
                style: "titulo1",
            },
            {
                stack: [{ text: "TIQUETE TRANSPORTE DE PASAJEROS" }],
                style: "titulo2",
            },
            {
                stack: [
                    {
                        text:
                            "Documento equivalente a factura de venta Art5. Decreto 1165 - 1996 Póliza No 1003610860501",
                    },
                    { text: "Seguros Comerciales Bolivar SA" },
                ],
                style: "titulo3",
            },
            { ...linea },
            { text: "ORIGINAL", style: "center" },
            { ...linea },

            {
                columns: [
                    {
                        stack: [
                            "Consecutivo:",
                            "Taquilla:",
                            "Vendedor:",
                            " ",
                            "Expedición:",
                            "Origen:",
                            " ",
                            "Destino:",
                            " ",
                            "Fecha viaje:",
                            "Hora sala:",
                        ],
                        style: "contenido1",
                    },
                    {
                        stack: [
                            { text: `${tiquete}\n`, bold: true },
                            { text: `${agencia}\n`, fontSize: 8, alignment: "left", },
                            { text: `${taquillero}`, fontSize: 8, alignment: "left", },
                            `${data.fechaelab_tiq}`,
                            `${data.origen_tiq.trim()}\n`,
                            `${destino}\n\n`,
                            `${data.fechaemb_tiq}`,
                            `${data.horaemb_tiq}\n\n`,
                        ],
                        style: "contenido2",
                    },
                ],
            },

            {
                text: "Vehículo:" + `${nroint} - ${data.placa_tiq}\n\n`,
                fontSize: 12,
                alignment: "center",
                bold: true,
            },
            {
                columns: [
                    {
                        stack: [
                            "Servicio:",
                            "Pasajeros:",
                            "Sillas:",
                            "Cliente:",
                            ...idPas,
                        ],
                        style: "contenido3",
                    },
                    {
                        stack: [
                            "\n",
                            `${nroPasajeros}\n`,
                            { text: `${sillas.join(',')}\n`, bold: true },
                            "\n",
                            ...nombres,
                        ],
                        style: "contenido2",
                    },
                ],
            },

            { ...linea },
            {
                columns: [
                    {
                        stack: [
                            "Forma de pago:",
                            "Valor Tiquete:",
                            "Descuento:",
                            { text: "TOTAL:", fontSize: 12, bold: true },
                        ],
                        style: "contenido3",
                    },
                    {
                        stack: [
                            `${formapago}\n`,
                            `$${format_num(bruto) || "00"}\n`,
                            `$${format_num(dcto) || "00"}\n`,
                            { text: `${format_num(total)}\n`, fontSize: 12, bold: true },
                            // `$ ${format_num(total)}\n`,
                        ],
                        style: "contenido2",
                    },
                ],
            },
            {
                stack: [
                    { text: "Condiciones de viaje:", bold: true },
                    "En caso de daño imprevisto del vehículo al presentarse cualquier inconveniente en la vía,el conductor hará lo posible para que los pasajeros puedan continuar el viaje, la empresa no asume responsabilidad por perjuicios ocasionados por esta causa.",
                    "El pasajero declara conocer las condiciones de la empresa y asume la responsabilidad y riesgo del transporte",
                    "- Todo pasajero tiene derecho a llevar 15 kilos de equipaje pero la empresa no se responsabiliza por el contenido,perdida o cambios de maletas u otros objetos.",
                    "- Pasajero que no se presenta a la hora de salida perderá el valor del pasaje",
                    "- Si su equipaje contiene objetos de valor deberá aforarlos",
                    "- Si lleva equipaje reclame su sticker.",
                    "Vigilado superintendencia de Puertos y Transporte",
                ],
                style: "pie1",
                margin: [0, 10, 0, 0],
            },
            { ...linea },
            {
                stack: [
                    "Calle 38 32-41 - Villavicencio",
                    "310.563.5045",
                    { text: `${tiquete}\n`, bold: true },
                    "Fabricante y nombre del software:",
                    "TITAN SOLUCIONES SAS",
                    "901.289.171",
                ],
                style: "pie2",
            },
        ],
        styles: {
            titulo1: {
                fontSize: 14,
                alignment: "center",
                bold: true,
            },
            titulo2: {
                fontSize: 10,
                alignment: "center",
                bold: true,
            },
            titulo3: {
                fontSize: 8,
                alignment: "center",
            },
            contenido1: {
                fontSize: 10,
                alignment: "left",
            },
            contenido2: {
                fontSize: 10,
                alignment: "right",
            },

            contenido3: {
                fontSize: 10,
                alignment: "left",
            },

            pie1: {
                fontSize: 8,
                alignment: "center",
            },

            pie2: {
                fontSize: 8,
                alignment: "center",
            },

            center: {
                fontSize: 14,
                alignment: "center",
            },

            right: {
                fontSize: 16,
                alignment: "right",
            },
        },
        defaultStyle: {
            fontSize: 8,
        },
    };
}