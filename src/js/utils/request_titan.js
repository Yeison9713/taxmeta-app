const error_console = (form, error, data = null) => {
    console.debug('-> Error:', form, error, data)
}

const clear_text = (data) => {
    let encode = encodeURI(data);
    encode = encode.replace(/%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20/g, "");
    encode = encode.replace(/%0A/g, "");
    return decodeURI(encode).replace(/\s\s+/g, ' ');
}

const default_msj = (data = {}) => {
    let response = { status: -1, message: null }

    response.status = data.Code == '0' ? 0 : -1
    response.message = data?.Mensaje ? data.Mensaje : data;

    return response
}

const request_titan = ({ url, data = {}, method = 'POST', header = {} }) => {
    return new Promise(async (resolve, reject) => {

        let formData = new FormData();
        for (var i in data) {
            if (i == 'url') { formData.append(i, data[i]) }
            else if (i == 'data') { formData.append(i, data[i]) }
            else { formData.append(i, JSON.stringify(data[i])) }
        }

        formData.append('method', data.method || '')

        fetch(url, { body: formData, method })
            .then(e => e.text())
            .then(res => {
                try {
                    let response = default_msj(JSON.parse(clear_text(res)));

                    if (response.status != 0 && data.method != 'GET') reject(response);
                    else resolve(response)


                } catch (error) {
                    error_console('trycatch', error)
                }
            })
            .catch(error => {
                let response = default_msj(error);

                error_console('global', error)
                reject(response)
            })
    })
}

export { request_titan, default_msj }