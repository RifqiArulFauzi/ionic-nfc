import { Component } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';;
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tagContent: string = '';

  constructor(private nfc: NFC, private ndef: Ndef) {}

  ionViewDidEnter() {
    this.initializeNfc();
  }

  initializeNfc() {
    this.nfc.enabled().then(() => {
      this.addNfcListener();
    }).catch(error => {
      console.error('Error enabling NFC', error);
    });
  }

  addNfcListener() {
    this.nfc.addNdefListener().subscribe(nfcEvent => {
      const tag = nfcEvent.tag;
      const message = this.parseNdefMessage(tag.ndefMessage);

      this.tagContent = message;
      console.log('NFC Tag Content:', this.tagContent);

      this.sendToTelegram(this.tagContent);
    }, error => {
      console.error('Error reading NFC tag', error);
    });
  }

  sendToTelegram(tag: string) {
    const botToken = '<YOUR_BOT_TOKEN>';
    const chatId = '<YOUR_CHAT_ID>';

    const message = `NFC Tag: ${tag}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const params = {
      chat_id: chatId,
      text: message
    };

    axios.post(url, params)
      .then(response => {
        console.log('Message sent to Telegram:', response.data);
      })
      .catch(error => {
        console.error('Error sending message to Telegram:', error);
      });
  }
}