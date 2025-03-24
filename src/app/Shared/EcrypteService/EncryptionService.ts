import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private encryptionKey = '0123456789123456'; // Replace with a secure key

  encrypt(value: string): string {
    const ciphertext = CryptoJS.AES.encrypt(value, this.encryptionKey);
    return ciphertext.toString(); // Base64 encoding
  }

  decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}