import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from '../print/vfs.js';
pdfMake.vfs = pdfFonts;

import { ticket, travel_book } from "./tickets.js";

const print = {
    ticket,
    travel_book
}

const imprimir = ({ data = {}, formato = '', nit = 0 }) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!formato) throw new error('Formato no definido');
            let dd = await print[formato](data)

            const pdf = pdfMake.createPdf(dd);

            if (window.Capacitor) {

                pdf.getBase64(base64 => {

                    window.plugins.PrintPDF.print({
                        data: base64,
                        type: "Data",
                        title: "test print",
                        success: function () {
                            console.log("success");
                            resolve('');
                        },
                        error: function (data) {
                            data = JSON.parse(Data);
                            console.log("failed" + data.error);
                        },
                    });

                });

            } else {
                pdf.print()
                resolve('')
            }

        } catch (error) {
            console.log('Ocurrio un error generando la impresion: ' + error)
            reject(error)
        }

    })


}

export { imprimir }
