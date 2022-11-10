import { default_msj } from './request_titan'
import Dexie from 'dexie'

const DB_NAME = 'titan_db'
const DB_VERSION = 1

const idb = {
    bulkPut: ({ table, data }) => {
        let db = idb.get_db()
        return db[table].bulkPut(data)
    },
    clearTable: ({ table }) => {
        let db = idb.get_db()
        return db[table].clear()
    },
    put: ({ table, data }) => {
        let db = idb.get_db()
        return db[table].put(data)
    },
    get: (table) => {
        let db = idb.get_db()
        return db[table].toArray()
    },
    getIndex: ({ table, index }) => {
        let db = idb.get_db()
        return db[table].get(index)
    },
    update: ({ table, index, data }) => {
        let db = idb.get_db()
        return db[table].update(index, data)
    },

    get_db: () => {
        let db = new Dexie(DB_NAME)
        db.version(DB_VERSION).stores({
            user: '++id',
            setting: '++id',
            products: '&[codigo_list+codigopr_list]',
            presentations: '&codigo_rep',
            customers: '&identificacion_rut',
            cities: '&codigo',
            remisiones: '&consecutivo'
        })

        return db
    },

    set_db: function ({ table, data }) {

        return new Promise(async (resolve, reject) => {

            try {
                await this.clearTable({ table })
                let update = await this.bulkPut({ table, data })

                if (!update) {
                    reject(default_msj(`Error actualizando la tabla: ${table}`));
                } else {
                    resolve()
                }

            } catch (error) {
                reject(default_msj(error))
            }

        })
    }
}

export {
    idb
}