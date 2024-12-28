const axios = require('axios');

const API_URL = 'https://virtusim.com/api/json.php';
const API_KEY = 'sb8lRNAh9fT2FGeL4JHIyg6zSqn5cx';

exports.run = {
    usage: ['services', 'order', 'status'],
    async: async (m, { client, isPrefix, command, Func }) => {
        try {
            if (command === 'services') {
                // Menampilkan daftar layanan
                const response = await axios.get(`${API_URL}?api_key=${API_KEY}&action=services&country=indo`);
                if (response.data.status) {
                    let services = response.data.data.map(service => ({
                        title: `${service.name} - Price: ${service.price} - ID: ${service.id}`,
                        id: `${isPrefix}order ${service.id}`
                    }));

                    const buttons = [{
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: 'Pilih Layanan',
                            sections: [{
                                rows: services
                            }]
                        })
                    }];

                    client.sendIAMessage(m.chat, buttons, m, {
                        header: 'Daftar Layanan',
                        content: 'Silakan pilih layanan yang ingin Anda pesan:',
                        footer: global.footer,
                        media: global.db.setting.cover
                    });
                } else {
                    client.reply(m.chat, `🚩 ${response.data.data.msg}`, m);
                }
            } else if (command === 'order') {
                // Memesan nomor
                if (!args[0]) return client.reply(m.chat, 'Silakan masukkan ID layanan yang ingin dipesan.', m);
                const serviceId = args[0];
                const orderResponse = await axios.get(`${API_URL}?api_key=${API_KEY}&action=order&service=${serviceId}&operator=any`);
                if (orderResponse.data.status) {
                    client.reply(m.chat, `*Pesanan Berhasil:*\n\nNomor: ${orderResponse.data.data.number}\nService: ${orderResponse.data.data.service_name}`, m);
                } else {
                    client.reply(m.chat, `🚩 ${orderResponse.data.data.msg}`, m);
                }
            } else if (command === 'status') {
                // Mengecek status pesanan
                if (!args[0]) return client.reply(m.chat, 'Silakan masukkan ID pesanan yang ingin dicek.', m);
                const orderId = args[0];
                const statusResponse = await axios.get(`${API_URL}?api_key=${API_KEY}&action=status&id=${orderId}`);
                if (statusResponse.data.status) {
                    client.reply(m.chat, `*Status Pesanan:*\n\nID: ${statusResponse.data.data.id}\nStatus: ${statusResponse.data.data.status}`, m);
                } else {
                    client.reply(m.chat, `🚩 ${statusResponse.data.data.msg}`, m);
                }
            }
        } catch (error) {
            console.error(error);
            client.reply(m.chat, 'Terjadi kesalahan. Silakan coba lagi.', m);
        }
    },
    error: false,
    cache: true,
    location: __filename
};