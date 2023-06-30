import axios from "axios";
import { config } from "dotenv";
import express from "express";
import { GoogleSpreadsheet } from "google-spreadsheet";

config();
const app = express();

const TELEGRAM_URI = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage`;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
await doc.useServiceAccountAuth({
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
});

app.post("/new-message", async (req, res) => {
    const { message } = req.body

    const messageText = message?.text?.toLowerCase()?.trim()
    const chatId = message?.chat?.id
    if (!messageText || !chatId) {
      return res.sendStatus(400)
    }
  
    // google spreadsheet
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    const rows = await sheet.getRows()
    const dataFromSpreadsheet = rows.reduce((obj, row) => {
      if (row.date) {
        const answer = { text: row.text }
      }
      return obj
    }, {})
    console.log(dataFromSpreadsheet, rows);
    let responseText = 'Прошу прощения, я вас не понял, спросите иначе'
    // generate responseText
    if (messageText === 'price') {
        responseText = 'Первое занятие бесплатно! Абонемент на месяц стоит 5000 рублей'
    } else if (true) {        // Написать проверку по гугл таблице
      responseText = ' Раз, раз, раз два три'
    }
  
    // send response
    try {
      await axios.post(TELEGRAM_URI, {
        chat_id: chatId,
        text: responseText
      })
      res.send('Done')
    } catch (e) {
      console.log(e)
      res.send(e)
    }
});


