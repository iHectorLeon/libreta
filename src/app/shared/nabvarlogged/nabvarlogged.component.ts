import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './../../shared/sharedservices/user.service';
import { Roles } from './../models/roles';
import { NotificationClose } from './../models/notificationClose';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-nabvarlogged',
  templateUrl: './nabvarlogged.component.html',
  providers:[UserService]
})
export class NabvarloggedComponent implements OnInit, DoCheck {

  identiti:any;
  token:any;
  sesionExpired:boolean=false;
  rolesUser:any[]=[];
  notificationid:NotificationClose;
  responseRoles:any;
  rolOrg:boolean =  false;
  rolSup:boolean =  false;
  rolUser:boolean = false;
  rolAdmin:boolean = false;
  rolAutho:boolean = false;
  rolRequester:boolean = false;
  rolInstructor : boolean = false;

  notifications:number;
  messagesNotifications:any[]=[];
  messaError:string;

  courseid:any;
  coursetitle:any;
  groupid:any;
  itemid:any;
  studentid:any;
  production:any;

  constructor(private userService:UserService, private router:Router) {
    this.token = this.userService.getToken();
    this.identiti = this.userService.getIdentiti();
    this.production = environment.production;
    this.getRolesUser();
  }

  ngOnInit() {
    this.token =this.userService.getToken();
    this.identiti = this.userService.getIdentiti();
    this.getNumberNotifications();
  }

  ngDoCheck(){
    this.identiti = this.userService.getIdentiti();
  }

  /*
  metodo para consultar los roles del usuario
  */
  getRolesUser(){
     this.userService.getRoles().subscribe(data=>{
      this.rolUser = data.message.isUser;
      this.rolSup = data.message.isSupervisor;
      this.rolAdmin = data.message.isAdmin;
      this.rolAutho = data.message.isAuthor;
      this.rolInstructor = data.message.isInstructor;
      this.rolOrg = data.message.isOrg;
      this.rolRequester = data.message.isRequester;
    },error=>{
      if(error._body == '{"status":401,"message":"Error 204: Token expired"}'){
        this.sesionExpired = true;
      }else{
        this.messaError = error;
      }
    });
  }

  /*
  funcion para el cierre de sesion del usuario
  */
  logout(){
    localStorage.removeItem('identiti');
    localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  /*
  metodo para obtener el numero de notificaciones
  */
  getNumberNotifications(){
    this.userService.getNotifications().subscribe(data=>{
      this.messagesNotifications = [];
      if(data.newNotifications > 0){
        this.notifications = data.newNotifications;
        this.userService.getMyNotificationsBell().subscribe(data=>{
          let messages = data.message;
          for(let idmessage of messages){
            if(!idmessage.read){
              this.messagesNotifications.push(idmessage);
            }
          }
        },error=>{
          console.log(error);
        });
      }else{
        this.notifications = 0;
      }
    },error=>{
      console.log(error);
    });
  }

  /*
  metodo para redireccionar al mensaje de la notificacion de el FAQ del curso
  */
  public getviewnotification(objects:any[], sourceRole:any, notificationid:any, studentid:any, type:any){
    this.studentid = studentid;
    this.reloadConst();
    for(let idObject of objects){
      if(idObject.kind === "courses"){
        if(type == 'system'){
          this.coursetitle = idObject.item.title;
        }
        this.courseid = idObject.item._id;
      }
      if(idObject.kind === "groups"){
        this.groupid = idObject.item._id;
      }
      if(idObject.kind === "blocks"){
        this.itemid = idObject.item._id;
      }
      if(idObject.kind === "discussions"){
        this.itemid = idObject.item._id;
      }
    }

    if(type == 'system'){
      this.router.navigate(['/mycourses',this.coursetitle,this.groupid,this.courseid,this.itemid]);
      this.notificationid = new NotificationClose(notificationid);
      this.closeNotification(this.notificationid);
    }else{
      this.router.navigate(['viewNotification', this.courseid, this.groupid, this.itemid, sourceRole, this.studentid]);
      this.notificationid = new NotificationClose(notificationid);
      this.closeNotification(this.notificationid);
    }
  }

  /*
  metodo para redireccionar al mensaje de la notificacion de un bloque
  */
  public getviewnotificationblock(blockid, id, type, notificationid){
    this.router.navigate(['viewNotificationB',blockid,id,type])
    this.notificationid = new NotificationClose(notificationid);
    this.closeNotification(this.notificationid);
  }

  /*
  metodo para visualizar la tarea del usuario
  */
  public getTaskUser(blockid, id, type, notificationid){
    this.router.navigate(['viewNotificationB',blockid,id,type])
    this.notificationid = new NotificationClose(notificationid);
    this.closeNotification(this.notificationid);
  }

  /*
  metodo para actualizar una notificacion como vista
  */
  public closeNotification(notificationid){
    this.userService.closeNotification(notificationid).subscribe(data=>{
      this.getNumberNotifications();
    },error=>{
      console.log(error);
    });
  }

  /*

  */
  reloadConst(){
    this.courseid="";
    this.groupid="";
    this.itemid="";
  }
}
