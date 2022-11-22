import { f7 } from 'framework7-vue'
import imask from 'imask'
import { request_titan } from './request_titan'

let toast = (text) => {
    f7.toast
        .create({
            position: 'bottom',
            text,
            closeTimeout: 5000,
            closeButton: true,
            closeButtonText:
                '<i class="icon f7-icons" style="font-size: 24px; width: 24px; height: 24px; color: #FFF">multiply_circle </i>',
        })
        .open()
}

let loader = (estado, text) => {
    if (estado) return f7.dialog.preloader(text || 'Cargando...')
    else f7.dialog.close()
}

let notification = ({
    titulo,
    titleRightText,
    subtitle,
    text,
    closeTimeout,
}) => {
    return f7.notification.create({
        icon:
            '<i class="icon f7-icons margin-left-half" style="font-size: 14px; width: 14px; height: 14px; color: green;">checkmark_alt</i>',
        title: titulo || 'Notificación',
        // titleRightText: titleRightText || new Date().getDate(),
        subtitle: subtitle || '',
        text: text || '',
        closeOnClick: true,
        closeTimeout: closeTimeout || 3000,
        closeButton: true,
    })
}

let progress = ({ title, progress }) => {
    return f7.dialog.progress(title, progress)
}

let format_num = (val = 0, scale = 0) => {
    let mask = imask.createMask({
        mask: Number,
        scale,
        min: -9999999999999,
        thousandsSeparator: ',',
        radix: '.',
    })

    let val_num = typeof val == 'string' ? val.trim() : val
    let num = parseFloat(val_num || 0).toString()
    mask.resolve(num)
    return `${mask.value}`
}

function getBase64(nit) {
    return new Promise((resolve, reject) => {
        let url = 'https://server1ts.net/Financiero/INC/imgbase64.php?file=' + nit + ".png"
        request_titan({ url })
            .then(resolve)
            .catch(reject)
    })
}

const current_date = () => {
    return new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

const capitalize = (str = "", all = false) => {
    const array = str.toLowerCase().split(" ");

    if (all) {

        for (var i = 0; i < array.length; i++) {
            array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1);
        }

    } else {
        array[0] = array[0].charAt(0).toUpperCase() + array[0].slice(1);
    }

    return array.join(" ");
};

const textValue = (obj = [], id, field = "value", resolve = "text") => {
    if (obj.length) {

        let retornar = obj?.find((e) => e[field] == id);

        if (!retornar || retornar?.text) return retornar?.text || "";
        else return retornar[resolve] || "";

    }

    return ""
}

export {
    toast,
    loader,
    format_num,
    notification,
    progress,
    getBase64,
    current_date,
    capitalize,
    textValue
}