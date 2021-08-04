import * as adminSdk from 'firebase-admin'


export function initAdmin() {
    const data = JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG_BASE64, 'base64').toString('ascii'))
    adminSdk.initializeApp({
        credential: adminSdk.credential.cert(data)
    })
}