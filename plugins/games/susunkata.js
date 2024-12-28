const axios = require('axios');

exports.run = {
   usage: ['susunkata'],
   category: 'games',
   async: async (m, {
      client,
      Func
   }) => {
      try {
         // Mengambil soal dari API
         const response = await axios.get('https://api.caliph.biz.id/api/susunkata?apikey=691ef8759b3c68d8');
         
         if (!response.data.status) return client.reply(m.chat, Func.texted('bold', `🚩 Error fetching data.`), m);
         
         const { soal, tipe, jawaban, bantuan } = response.data;

         // Membuat tombol bantuan
         const buttons = [
            {
               buttonId: `bantuan`,
               buttonText: { displayText: 'Bantuan' },
               type: 1
            }
         ];

         const buttonMessage = {
            text: `Soal: ${soal}\nTipe: ${tipe}\n\nSilakan coba susun kata!`,
            footer: 'Ketik jawaban Anda!',
            buttons: buttons,
            headerType: 1
         };

         // Mengirim pesan dengan tombol
         await client.sendMessage(m.chat, buttonMessage, { quoted: m });
         
         // Menyimpan jawaban dan bantuan untuk digunakan nanti
         client.susunkata = {
            jawaban: jawaban,
            bantuan: bantuan
         };
      } catch (e) {
         console.log(e);
         return client.reply(m.chat, Func.jsonFormat(e), m);
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}

// Fitur untuk menangani tombol bantuan
exports.bantuan = {
   async: async (m, {
      client,
      text
   }) => {
      try {
         if (!client.susunkata) return client.reply(m.chat, Func.texted('bold', `🚩 Tidak ada soal yang aktif.`), m);
         
         const { bantuan } = client.susunkata;
         client.reply(m.chat, `Bantuan: ${bantuan}`, m);
      } catch (e) {
         console.log(e);
         return client.reply(m.chat, Func.jsonFormat(e), m);
      }
   },
   error: false,
   cache: true,
   location: __filename
}