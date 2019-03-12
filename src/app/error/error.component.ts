import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styles: []
})
export class ErrorComponent implements OnInit {

  typeError:any;

  constructor(private router:Router, private route:ActivatedRoute) {
    this.route.params.subscribe(params=>{
      if( params ['typeError']!=null){
        this.typeError = params ['typeError'];
      }
    });
  }

  ngOnInit() {
  }

  /*
  funcion para el cierre de sesion del usuario
  */
  logoutExpired(){
    localStorage.removeItem('identiti');
    localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
