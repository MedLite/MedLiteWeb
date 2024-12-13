import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent  implements OnInit {
  public breadcrumbs!: Breadcrumb[];
 
  VisibleBreadCrmb : boolean = false; 
  constructor(private router: Router, private route: ActivatedRoute , private i18nService: I18nService ) {
   
  }


 
   
 
 


  ngOnInit() {
    this.  MethodeVisbileBreadCrumb();
    let breadcrumb: Breadcrumb = {
      label: this.i18nService.getString('Home'),
      url: '',
      icon: 'fas fa-home'  

    };
 

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => { 
        let root: ActivatedRoute = this.route.root;
        this.breadcrumbs = this.getBreadcrumbs(root);
        this.breadcrumbs = [breadcrumb, ...this.breadcrumbs];
      });
  }


  MethodeVisbileBreadCrumb(){   
    var count=0;
    console.log(sessionStorage.getItem("auth-token"));
    var intervalId = setInterval(() =>{if(sessionStorage.getItem("auth-token") == '' ||  sessionStorage.getItem("auth-token") === null ){ 
      this.VisibleBreadCrmb = false;
    }else{
      this.VisibleBreadCrmb = true; 
    } 
    count=count+1;
    if (count==100) clearInterval(intervalId);
    }, 10); 
  }

  private getBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'title';
    const ROUTE_Icon_BREADCRUMB = 'icon';
    // debugger;
    //get the child routes
    let children: ActivatedRoute[] = route.children;
    // console.log(route);
    // console.log(route.children);

    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (child.outlet !== PRIMARY_OUTLET || child.snapshot.url.length == 0) {
        continue;
      }

      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      //get the route's URL segment
      let routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');

      //append route URL to URL
      url += `/${routeURL}`;

      //add breadcrumb
      let breadcrumb: Breadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        url: url,
        icon: child.snapshot.data[ROUTE_Icon_BREADCRUMB],
         
      };
      breadcrumbs.push(breadcrumb);

      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}

export interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;  
}
