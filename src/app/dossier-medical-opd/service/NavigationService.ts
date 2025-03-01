import { Injectable } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}
  navigateToAdmissionList() {
    this.router.navigate(['../list_admission_opd'], { relativeTo: this.activatedRoute }); // Navigate relative to the parent
  }
 
}