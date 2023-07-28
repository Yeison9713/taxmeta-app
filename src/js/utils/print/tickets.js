import { format_num, getBase64 } from "../plugins";

const ticket = async (data) => {
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
        case "11":
            formapago = "Gamarra";
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

const travel_book = async (data) => {
    let logo = await getBase64("taxsuper")

    let data_anulado = {
        text: "Anulado",
        angle: 60,
        color: "black",
        opacity: 0.2,
        fontSize: 70,
    };

    let watermark = data.estado_lvia === "0" ? "" : data_anulado

    let stylePDF = {
        pageSize: {
            width: 200,
            height: "auto",
        },
        pageMargins: [20, 10, 10, 10],
    };

    let pasajeros = [];
    let pasajerosV2 = []
    let totalvlr_lvia = parseFloat(data.vlrbruto_lvia)
    let avances_lvia = parseFloat(data.vlravances_lvia) || 0;
    let recaudo_lvia = parseFloat(data.vlrrecaudo_lvia) || 0;
    let ssocial_lvia = parseFloat(data.vlrssocial_lvia) || 0;
    let totalPagar_lvia = totalvlr_lvia - avances_lvia - recaudo_lvia - ssocial_lvia;

    let get_row = (label, value) => {
        return {
            columns: [
                { text: label + ': ' },
                { text: value }
            ]
        }
    }

    data.tiquetes_lvia.pop();
    let tiquetes = data.tiquetes_lvia.filter(el => el.tiquete_lvia && el.tiquete_lvia.trim())

    tiquetes.forEach((pas) => {
        pasajerosV2.push([
            {
                colSpan: 7,
                stack: [
                    { ...get_row('Tiquete', parseInt(pas.tiquete_lvia.trim())) },
                    { ...get_row('Pasajero', pas.pasajero_lvia.trim()) },
                    { ...get_row('Destino', pas.destino_lvia.trim()) },
                    { ...get_row('Sillas', pas.sillas_lvia.trim()) },
                    { ...get_row('F.Pago', pas.fpago_lvia.trim()) },
                    { ...get_row('Cant', pas.cantidad_lvia.trim()) },
                    { ...get_row('Valor', "$" + format_num(pas.vlrtiq_lvia)) },
                ]
            }, {}, {}, {}, {}, {}, {}
        ])
    });

    let layout = {
        vLineColor: "#A4A4A4",
        hLineColor: "#A4A4A4",
        hLineWidth: function (i, node) {
            return 0.3;
        },
        vLineWidth: function (i, node) {
            return 0.3;
        },
    };

    return {
        watermark,
        ...stylePDF,
        content: [
            {
                fontSize: 6.5,
                headerRows: 1,
                table: {
                    widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
                    body: [
                        [
                            {
                                colSpan: 7,
                                image: logo.message.message,
                                fit: [130, 130],
                                alignment: "center",
                                margin: [0, 2],
                            },
                            "", "", "", "", "", "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 7,
                                text: [
                                    { text: "Libro de Viaje:  ", bold: true },
                                    parseInt(data.nro_lvia.trim()),
                                ],
                                style: "center",
                                margin: [0, 2],
                            },
                            "", "", "", "", "", "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 7,
                                text: [
                                    { text: "Origen:  ", bold: true },
                                    data.origen_lvia.trim(),
                                ],
                            },
                            "", "", "", "", "", "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 7,
                                text: [
                                    { text: "Destino:  ", bold: true },
                                    data.destino_lvia.trim(),
                                ],
                            },
                            "", "", "", "", "", "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 4,
                                text: [
                                    { text: "Fecha viaje:  ", style: "center" },
                                    data.fecha_lvia,
                                ],
                            },
                            "", "", "",
                            {
                                fontSize: 10,
                                colSpan: 3,
                                text: [
                                    { text: "Hora:  ", style: "center" },
                                    data.hora_lvia
                                ],
                            },
                            "", "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 3,
                                text: [
                                    { text: "Número de cargue:  ", style: "center" },
                                    parseFloat(data.nrocargue_lvia),
                                ],
                            },
                            "", "",
                            {
                                fontSize: 10,
                                colSpan: 4,
                                text: [
                                    { text: "Vehículo:  ", style: "center" },
                                    data.placa_lvia,
                                ],
                            },
                            "", "", "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 7,
                                text: [
                                    { text: "Conductor:  ", bold: true },
                                    `${data.idconductor_lvia
                                    } - ${data.conductor_lvia.trim()}`,
                                ],
                            },
                            "", "", "", "", "", "",
                        ],
                        ...pasajerosV2,
                        [
                            {
                                colSpan: 2,
                                text: "Total seguro:",
                                style: "right",
                                fontSize: 10,
                            },
                            "",
                            {
                                colSpan: 2,
                                text: "$" + format_num(data.vlrseguro_lvia),
                                alignment: "right",
                                fontSize: 8,
                            },
                            "",
                            { text: "Total", style: "right", fontSize: 10 },
                            {
                                text: format_num(data.cantpasajeros_lvia),
                                alignment: "right",
                                fontSize: 8,
                            },
                            {
                                text: "$" + format_num(totalvlr_lvia),
                                alignment: "right",
                                fontSize: 8,
                            },
                        ],
                        [
                            { colSpan: 5, text: "Efectivo", style: "right", fontSize: 8 },
                            "",
                            "",
                            "",
                            "",
                            {
                                colSpan: 2,
                                text: "$" + format_num(data.vlrefectivo_lvia.trim() || 0),
                                fontSize: 8,
                                alignment: "center",
                            },
                            "",
                        ],
                        [
                            { colSpan: 5, text: "Redbus", style: "right", fontSize: 8 },
                            "",
                            "",
                            "",
                            "",
                            {
                                colSpan: 2,
                                text: "$" + format_num(data.vlrredbus_lvia.trim() || 0),
                                fontSize: 8,
                                alignment: "center",
                            },
                            "",
                        ],
                        [
                            { colSpan: 5, text: "Pinbus", style: "right", fontSize: 8 },
                            "",
                            "",
                            "",
                            "",
                            {
                                colSpan: 2,
                                text: "$" + format_num(data.vlrpinbus_lvia.trim() || 0),
                                fontSize: 8,
                                alignment: "center",
                            },
                            "",
                        ],
                        [
                            { colSpan: 5, text: "Gamarra", style: "right", fontSize: 8 },
                            "",
                            "",
                            "",
                            "",
                            {
                                colSpan: 2,
                                text: "$" + format_num(data.vlrgamarra_lvia.trim() || 0),
                                fontSize: 8,
                                alignment: "center",
                            },
                            "",
                        ],
                        [
                            { colSpan: 5, text: "Avance", style: "right", fontSize: 8 },
                            "",
                            "",
                            "",
                            "",
                            {
                                colSpan: 2,
                                text: format_num(avances_lvia),
                                fontSize: 8,
                                alignment: "center",
                            },
                            "",
                        ],
                        [
                            { colSpan: 5, text: "Recaudo", style: "right", fontSize: 8 },
                            "",
                            "",
                            "",
                            "",
                            {
                                colSpan: 2,
                                text: format_num(recaudo_lvia),
                                fontSize: 8,
                                alignment: "center",
                            },
                            "",
                        ],
                        [
                            {
                                colSpan: 5,
                                text: "Seguridad social",
                                style: "right",
                                fontSize: 8,
                            },
                            "",
                            "",
                            "",
                            "",
                            {
                                colSpan: 2,
                                text: format_num(ssocial_lvia),
                                fontSize: 8,
                                alignment: "center",
                            },
                            "",
                        ],
                        [
                            {
                                colSpan: 5,
                                text: "TOTAL LIBRO DE VIAJE",
                                style: "right",
                                fontSize: 10,
                            },
                            "",
                            "",
                            "",
                            "",
                            {
                                colSpan: 2,
                                text: "$" + format_num(totalPagar_lvia),
                                fontSize: 8,
                                alignment: "center",
                            },
                            "",
                        ],
                        [
                            {
                                colSpan: 7,
                                text: [
                                    { text: "Observaciones:\n  ", bold: true },
                                    data.observaciones_lvia.trim(),
                                ],
                                fontSize: 8,
                            },
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                        ],
                        [
                            {
                                colSpan: 7,
                                text: [
                                    "Taquilla de despacho: ",
                                    { text: data.descagencia_lvia, bold: true },
                                ],
                                fontSize: 8,
                            },
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                        ],
                        [
                            {
                                colSpan: 7,
                                text: [
                                    "Despachador: ",
                                    { text: data.despachador_lvia.trim(), bold: true },
                                ],
                                fontSize: 8,
                            },
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                        ],
                    ],
                },
                layout,
            },
        ],
        styles: {
            center: {
                bold: true,
                alignment: "center",
            },
            right: {
                bold: true,
                alignment: "right",
            },
        }
    };
}

const close_box = async (data) => {
    let logo = await getBase64(data.id_logo)

    let stylePDF = {
        pageSize: {
            width: 200,
            height: "auto",
        },
        pageMargins: [20, 10, 10, 10],
    };

    let ventas = parseFloat(data.ventas_cua.replace(/\,/g, "").trim()) || 0;
    let seguro = parseFloat(data.seguro_cua.replace(/\,/g, "").trim()) || 0;
    let rpc = parseFloat(data.rpc_cua.replace(/\,/g, "").trim()) || 0;
    let egresos = parseFloat(data.egresos_cua.replace(/\,/g, "").trim()) || 0;
    let avances = parseFloat(data.avances_cua.replace(/\,/g, "").trim()) || 0;
    let saldo = parseFloat(data.saldoini_cua.replace(/\,/g, "").trim()) || 0;
    let redBus = parseFloat(data.redbus_cua.replace(/\,/g, "").trim()) || 0
    let pinbus = parseFloat(data.pinbus_cua.replace(/\,/g, "").trim()) || 0

    let totalcuadre = ventas + rpc - egresos + seguro - avances + saldo

    let cant100 = parseFloat(data.cant100_cua.replace(/\,/g, "")) || 0;
    let vlr100 = cant100 * 100000;
    let cant50 = parseFloat(data.cant50_cua.replace(/\,/g, "")) || 0;
    let vlr50 = cant50 * 50000;
    let cant20 = parseFloat(data.cant20_cua.replace(/\,/g, "")) || 0;
    let vlr20 = cant20 * 20000;
    let cant10 = parseFloat(data.cant10_cua.replace(/\,/g, "")) || 0;
    let vlr10 = cant10 * 10000;
    let cant5 = parseFloat(data.cant5_cua.replace(/\,/g, "")) || 0;
    let vlr5 = cant5 * 5000;
    let cant2 = parseFloat(data.cant2_cua.replace(/\,/g, "")) || 0;
    let vlr2 = cant2 * 2000;
    let cant1 = parseFloat(data.cant1_cua.replace(/\,/g, "")) || 0;
    let vlr1 = cant1 * 1000;
    let vlrmon = parseFloat(data.vlrmonedas_cua.replace(/\,/g, "")) || 0;

    let totalefectivo = vlr100 + vlr50 + vlr20 + vlr10 + vlr5 + vlr2 + vlr1 + vlrmon
    let diferencia = totalcuadre - totalefectivo

    let layout = {
        vLineColor: "#A4A4A4",
        hLineColor: "#A4A4A4",
        hLineWidth: function (i, node) {
            return 0.3;
        },
        vLineWidth: function (i, node) {
            return 0.3;
        },
    };

    return {
        ...stylePDF,
        content: [
            {
                fontSize: 6.5,
                headerRows: 1,
                table: {
                    widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
                    body: [
                        [
                            {
                                colSpan: 7,
                                image: logo.message.message,
                                fit: [100, 100],
                                alignment: "center",
                                margin: [0, 2],
                            },
                            "", "", "", "", "", "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 7,
                                text: [
                                    { text: "Cierre de Caja:  ", bold: true },
                                    parseInt(data.nro_cua.trim()),
                                ],
                                style: "center",
                                margin: [0, 2],
                            },
                            "", "", "", "", "", "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 4,
                                text: [
                                    { text: "Fecha Caja:  ", style: "center" },
                                    data.fecha_cua,
                                ],
                            },
                            "", "", "",
                            {
                                fontSize: 10,
                                colSpan: 3,
                                text: [
                                    { text: "Turno:  ", style: "center" },
                                    data.turno_cua
                                ],
                            },
                            "", "",
                        ],
                        [
                            {
                                colSpan: 7,
                                text: [
                                    "Despachador: ",
                                    { text: data.taquillero_cua.trim(), bold: true },
                                ],
                                fontSize: 8,
                            },
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 7,
                                text: [
                                    { text: "Tiquete Inicial:  ", bold: true },
                                    parseInt(data.tiqini_cua.trim()),
                                ],
                            },
                            "", "", "", "", "", "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 7,
                                text: [
                                    { text: "Tiquete Final:  ", bold: true },
                                    parseInt(data.tiqfin_cua.trim()),
                                ],
                            },
                            "", "", "", "", "", "",
                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 7,
                                text: [
                                    { text: "Ingresos Intermunicipales", fontSize: 10, bold: true, style: "center" },

                                ],
                            },
                            "", "", "", "", "", "",
                        ],

                        [
                            {
                                fontSize: 8,
                                colSpan: 4,
                                text: [
                                    { text: "CONCEPTO:  ", style: "center", bold: false },
                                ],
                            },
                            "", "", "",
                            {
                                fontSize: 8,
                                colSpan: 3,
                                text: [
                                    { text: "VALOR", style: "center", bold: false },
                                ],
                            },
                            "", "",
                        ],
                        [
                            { colSpan: 4, text: "Saldo Inicial", style: "left", fontSize: 8 },
                            "",
                            "",
                            "",
                            {
                                colSpan: 3,
                                text: "$ " + format_num(saldo || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            "",
                        ],
                        [
                            { colSpan: 4, text: "Ventas", style: "left", fontSize: 8 },
                            "",
                            "",
                            "",
                            {
                                colSpan: 3,
                                text: "$ " + format_num(ventas || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            "",
                        ],

                        [
                            { colSpan: 4, text: "Seguro", style: "left", fontSize: 8 },
                            "",
                            "",
                            "",
                            {
                                colSpan: 3,
                                text: "$ " + format_num(seguro || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            "",
                        ],
                        [
                            { colSpan: 4, text: "RPC", style: "left", fontSize: 8 },
                            "",
                            "",
                            "",
                            {
                                colSpan: 3,
                                text: "$ " + format_num(rpc || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            "",
                        ],

                        [
                            { colSpan: 4, text: "Egresos", style: "left", fontSize: 8 },
                            "",
                            "",
                            "",
                            {
                                colSpan: 3,
                                text: "$ " + format_num(egresos || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            "",
                        ],
                        [
                            { colSpan: 4, text: "Avances", style: "left", fontSize: 8 },
                            "",
                            "",
                            "",
                            {
                                colSpan: 3,
                                text: "$ " + format_num(avances || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            "",
                        ],

                        [
                            { colSpan: 4, text: "Redbus", style: "left", fontSize: 8 },
                            "",
                            "",
                            "",
                            {
                                colSpan: 3,
                                text: "$ " + format_num(redBus || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            "",
                        ],
                        [
                            { colSpan: 4, text: "Pinbus", style: "left", fontSize: 8 },
                            "",
                            "",
                            "",
                            {
                                colSpan: 3,
                                text: "$ " + format_num(pinbus || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            "",
                        ],
                        [
                            {
                                colSpan: 4,
                                text: "Total Cierre de Caja",
                                style: "right",
                                fontSize: 10,
                            },
                            "",
                            "",
                            "",
                            {
                                colSpan: 3,
                                text: "$ " + format_num((totalcuadre) || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            "",

                        ],
                        [
                            {
                                fontSize: 10,
                                colSpan: 7,
                                text: [
                                    { text: "Efectivo Entregado", fontSize: 10, bold: true, style: "center" },

                                ],
                            },
                            "", "", "", "", "", "",
                        ],

                        [
                            {
                                fontSize: 8,
                                colSpan: 3,
                                text: [
                                    { text: "Denominación", style: "center", bold: false },
                                ],
                            },
                            "", "",
                            {
                                fontSize: 8,
                                colSpan: 2,
                                text: [
                                    { text: "Cant", style: "center", bold: false },
                                ],
                            },
                            "",
                            {
                                fontSize: 8,
                                colSpan: 2,
                                text: [
                                    { text: "Total", style: "center", bold: false },
                                ],
                            },
                            "",
                        ],

                        [
                            {
                                fontSize: 8,
                                colSpan: 3,
                                text: [
                                    { text: "$100.000", style: "center", bold: false },
                                ],
                            },
                            "", "",
                            {
                                colSpan: 2,
                                text: format_num(cant100),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            {
                                colSpan: 2,
                                text: "$ " + format_num(vlr100),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                        ],
                        [
                            {
                                fontSize: 8,
                                colSpan: 3,
                                text: [
                                    { text: "$50.000", style: "center", bold: false },
                                ],
                            },
                            "", "",
                            {
                                colSpan: 2,
                                text: format_num(cant50),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            {
                                colSpan: 2,
                                text: "$ " + format_num(vlr50),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                        ],
                        [
                            {
                                fontSize: 8,
                                colSpan: 3,
                                text: [
                                    { text: "$20.000", style: "center", bold: false },
                                ],
                            },
                            "", "",
                            {
                                colSpan: 2,
                                text: format_num(cant20),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            {
                                colSpan: 2,
                                text: "$" + format_num(vlr20),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                        ],

                        [
                            {
                                fontSize: 8,
                                colSpan: 3,
                                text: [
                                    { text: "$10.000", style: "center", bold: false },
                                ],
                            },
                            "", "",
                            {
                                colSpan: 2,
                                text: format_num(cant10),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            {
                                colSpan: 2,
                                text: "$" + format_num(vlr10),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                        ],
                        [
                            {
                                fontSize: 8,
                                colSpan: 3,
                                text: [
                                    { text: "$5.000", style: "center", bold: false },
                                ],
                            },
                            "", "",
                            {
                                colSpan: 2,
                                text: format_num(cant5),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            {
                                colSpan: 2,
                                text: "$" + format_num(vlr5),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                        ],
                        [
                            {
                                fontSize: 8,
                                colSpan: 3,
                                text: [
                                    { text: "$2.000", style: "center", bold: false },
                                ],
                            },
                            "", "",
                            {
                                colSpan: 2,
                                text: format_num(cant2),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            {
                                colSpan: 2,
                                text: "$ " + format_num(vlr2),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                        ],
                        [
                            {
                                fontSize: 8,
                                colSpan: 3,
                                text: [
                                    { text: "$1.000", style: "center", bold: false },
                                ],
                            },
                            "", "",
                            {
                                colSpan: 2,
                                text: format_num(cant1),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                            {
                                colSpan: 2,
                                text: "$ " + format_num(vlr1),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                        ],
                        [
                            {
                                fontSize: 8,
                                colSpan: 3,
                                text: [
                                    { text: "Moneda", style: "center", bold: false },
                                ],
                            },
                            "", "",
                            {
                                colSpan: 2,
                                text: " ",
                                fontSize: 8,
                                alignment: "center",
                            },
                            "",
                            {
                                colSpan: 2,
                                text: "$ " + format_num(vlrmon),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                        ],

                        [
                            {
                                colSpan: 5,
                                text: "Total Efectivo Entregado",
                                style: "right",
                                fontSize: 10,
                            },
                            "",
                            "",
                            "",
                            "",
                            {
                                colSpan: 2,
                                text: "$ " + format_num((totalefectivo) || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                        ],

                        [
                            {
                                colSpan: 5,
                                text: "Diferencia",
                                style: "right",
                                fontSize: 10,
                            },
                            "",
                            "",
                            "",
                            "",
                            {
                                colSpan: 2,
                                text: "$ " + format_num((diferencia) || 0),
                                fontSize: 8,
                                alignment: "right",
                            },
                            "",
                        ],
                        [
                            {
                                colSpan: 7,
                                text: [
                                    { text: "Observaciones:\n  ", bold: true },
                                    data.observacion_cua.trim(),
                                ],
                                fontSize: 8,
                            },
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                        ],


                    ],
                },
                layout,
            },
        ],
        styles: {
            center: {
                bold: true,
                alignment: "center",
            },
            right: {
                bold: true,
                alignment: "right",
            },
        },
        // pageSize: {
        //   width: 300,
        //   height: "auto",
        // },
        // pageMargins: [10, 10, 10, 10],
    }
}

export { ticket, travel_book, close_box }