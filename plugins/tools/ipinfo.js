const axios = require('axios');

exports.run = {
   usage: ['ipinfo <ip_address>'],
   category: 'tools',
   async: async (m, {
      client,
      text
   }) => {
      try {
         // Memeriksa apakah pengguna memberikan alamat IP
         if (!text) return client.reply(m.chat, 'Silakan masukkan alamat IP yang ingin dicari.', m);
         
         // Mengambil informasi IP dari API
         const response = await axios.get(`https://api.caliph.biz.id/api/tools/ipinfo?ip=${text}&apikey=691ef8759b3c68d8`);
         
         if (response.data.status !== 200) return client.reply(m.chat, '🚩 Terjadi kesalahan saat mengambil data. Pastikan alamat IP valid.', m);
         
         const result = response.data.result;

         // Menyusun pesan hasil
         const message = `
**Informasi IP:**
- **IP**: ${result.ip}
- **Hostname**: ${result.hostname}
- **Kota**: ${result.city}
- **Wilayah**: ${result.region}
- **Negara**: ${result.country}
- **Lokasi**: ${result.loc}
- **Organisasi**: ${result.org}
- **Kode Pos**: ${result.postal}
- **Zona Waktu**: ${result.timezone}
- **Anycast**: ${result.is_anycast ? 'Ya' : 'Tidak'}
- **Mobile**: ${result.is_mobile ? 'Ya' : 'Tidak'}
- **Anonim**: ${result.is_anonymous ? 'Ya' : 'Tidak'}
- **Hosting**: ${result.is_hosting ? 'Ya' : 'Tidak'}

**ASN:**
- **ASN**: ${result.asn.asn}
- **Nama**: ${result.asn.name}
- **Domain**: ${result.asn.domain}
- **Route**: ${result.asn.route}
- **Tipe**: ${result.asn.type}

**Perusahaan:**
- **Nama**: ${result.company.name}
- **Domain**: ${result.company.domain}
- **Tipe**: ${result.company.type}

**Privasi:**
- **VPN**: ${result.privacy.vpn ? 'Ya' : 'Tidak'}
- **Proxy**: ${result.privacy.proxy ? 'Ya' : 'Tidak'}
- **Tor**: ${result.privacy.tor ? 'Ya' : 'Tidak'}
- **Hosting**: ${result.privacy.hosting ? 'Ya' : 'Tidak'}

**Laporan Penyalahgunaan:**
- **Alamat**: ${result.abuse.address}
- **Negara**: ${result.abuse.country}
- **Email**: ${result.abuse.email}
- **Nama**: ${result.abuse.name}
- **Jaringan**: ${result.abuse.network}
- **Telepon**: ${result.abuse.phone}
         `;

         // Mengirimkan pesan hasil
         client.reply(m.chat, message, m);
      } catch (e) {
         console.log(e);
         return client.reply(m.chat, '🚩 Terjadi kesalahan saat memproses permintaan.', m);
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}