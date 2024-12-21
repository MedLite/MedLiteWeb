

import { Injectable } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
@Injectable({
    providedIn: 'root' // Make the service available application-wide
})
export class CalanderTransService {


    constructor(public primengConfig: PrimeNGConfig) {
        // this.setLangAR();
    }
    // selectedLang: any;
    setLangAR() {
        let LangOfSession = sessionStorage.getItem("lang");
        if (LangOfSession == "ar") {
            this.primengConfig.setTranslation(this.ar);
        } else if (LangOfSession == "en") {
            this.primengConfig.setTranslation(this.en);
        } else {
            this.primengConfig.setTranslation(this.fr);
        }
 
    }
    ar = {
        firstDayOfWeek: 6, // Sunday (Adjust based on your region's convention)
        dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        dayNamesShort: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        dayNamesMin: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        today: 'اليوم',
        clear: 'مسح',
        apply: 'بحث',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'أسبوع'
    };

    fr = {
        firstDayOfWeek: 6, // Sunday (Adjust based on your region's convention)
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesMin: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        monthNamesShort: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        today: "Aujourd'hui",
        clear: 'Supprimer',
        apply: 'Recherche',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'Semaine'
    };
    en = {
        firstDayOfWeek: 6, // Sunday (Adjust based on your region's convention)
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        today: 'Today',
        clear: 'Clear',
        apply: 'Apply',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'Week'
    };


}

