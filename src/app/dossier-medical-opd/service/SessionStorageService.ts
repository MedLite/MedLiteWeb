import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor(private router: Router, private route: ActivatedRoute) {}

  cleanupOnUnload() {
    window.addEventListener('beforeunload', (event) => {
      sessionStorage.setItem('intentionallyLeft', 'true');
    });
    // sessionStorage.removeItem("codeAdmissionSelected");
  }

  clearSessionStorageIfNecessary() {
    const intentionallyLeft = sessionStorage.getItem('intentionallyLeft');
    if (intentionallyLeft === 'true') {
      sessionStorage.removeItem('intentionallyLeft');
      sessionStorage.removeItem('codeAdmissionSelected');  
    }
  }

  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Improved JSON handling with error checking
  setJsonItem(key: string, value: object): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting JSON item:", error);
    }
  }

  getJsonItem(key: string): object | null {
    const item = sessionStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error parsing JSON item:", error);
      return null; // Return null on parsing error
    }
  }
 
}