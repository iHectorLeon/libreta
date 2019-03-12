import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecoverPass } from './../models/temp/recoverpass';

import { UserService } from './../shared/sharedservices/user.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html'
})
export class RecoverComponent implements OnInit {

  passwordRecover:RecoverPass;

  password:any;
  tokentemp:any;
  emailuser:any;
  isPassOk:boolean=false;

  public messageSuccess:string;
  public messageError:string;

  constructor(private router:Router, private route:ActivatedRoute, private user:UserService) {
    this.route.params.subscribe(params=>{
      if( params ['tokentemp']!=null){
        this.tokentemp = params ['tokentemp'];
      }
      if( params['username']!=null){
        this.emailuser = params ['username'];
      }
    });
  }

  ngOnInit() {
  }

  /*
  Metodo de validacion para las contraseñas del usuario
  */
  public getPassword(passOne:string, passTwo:string){
    if(passOne==passTwo){
      this.password = passOne;
      this.isPassOk = true;
    }else{
      this.isPassOk = false;
    }
  }

  /*
  funcion para hacer el cambio de contraseña desde el landignpage
  */
  public recoverPass(){
    if(this.isPassOk){
      this.passwordRecover = new RecoverPass(this.emailuser, this.tokentemp, this.password);
      this.user.recoverPass(this.passwordRecover).subscribe(data=>{
        this.messageSuccess="Se actualizo la contraseña correctamente"
      },error=>{
        console.log(error);
        this.messageError = error;
      });
    }
  }
}
