import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './../../shared/sharedservices/user.service';
import { CourseService } from './../../shared/sharedservices/course.service';
import { Roles } from './../models/roles';
import { Person } from './../../models/person/person';
import { UserValidate } from './../../models/userlms/userlms';
import { environment } from './../../../environments/environment';

declare var $:any;
@Component({
  selector: 'app-consoleuser',
  templateUrl: './consoleuser.component.html',
  providers:[UserService, CourseService]
})
export class ConsoleuserComponent implements OnInit {

  identiti:any;
  token:any;
  userlms:any;
  sesionExpired:boolean=false;
  rolesUser:Roles;
  roles:any;
  rolOrg:boolean =  false;
  rolSup:boolean =  false;
  rolUser:boolean = false;
  rolAdmin:boolean = false;
  rolAutho:boolean = false;
  rolInstructor : boolean = false;
  rolRequester:boolean = false;
  messaError:string;
  loading:boolean = false;

  name:string;
  fathername:string;
  mothername:string;
  person:Person;
  uservalidate:UserValidate;
  isDataOk:boolean = false;
  messageSuccess:string;
  messageError:string;
  production:any;

  mycourses:any[]=[];
  datacourses:any[]=[];
  coursesearch:any[];
  isFindOk:boolean;
  messageNotFound:any;

  constructor(private userService:UserService, private course:CourseService, private router:Router) {
    this.token = this.userService.getToken();
    this.identiti = this.userService.getIdentiti();
    this.production = environment.production;
  }

  ngOnInit() {
    this.token =this.userService.getToken();
    this.identiti = this.userService.getIdentiti();
    this.getRolesUser();
    this.getDetailsUser();
    this.getCourses();
  }

  /*
  metodo para consultar los roles del usuario
  */
  getRolesUser(){
    this.loading = true
  }

  /*
  Metodo para obtener los cursos de los usuarios
  */
  getCourses(){
    this.course.getCourses(this.token).subscribe(data =>{
      let mygroups = data.message.groups
      this.course.getCoursesOrg().subscribe(data=>{
        this.datacourses = data.message.courses
          if(mygroups!=null){
            for(let idmg of mygroups){
              for(let idcr of this.datacourses){
                if(idcr.id == idmg.courseid){
                  this.mycourses.push({
                    curso: idmg,
                    imagen: idcr.image
                  })
                }
              }
            }
          }
      });
    },error=>{
      if(error._body.includes('"message":"No groups found"')){

      }else if(error._body.includes('"message":"No groups found"')){

      }
      this.loading = false
    });
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

  /*
  metodo para obtener la informacion del usuario
  */
  public getDetailsUser(){
    this.loading = true;
    let name = this.identiti.name;
    this.userService.getUser(name).subscribe(data=>{
      this.userlms = data;
      console.log(this.userlms)
      this.loading = false;
    },error=>{
      console.log(error);
      this.loading = false;
    });
  }

  /*
  Metodo de validación de datos personales del usuario
  */
  public getData($event, namecheck:string, fname:string, mname:string){
    if($event.target.checked){
      this.isDataOk = true;
      this.name = namecheck;
      this.fathername = fname;
      this.mothername = mname;
    }
    if(!$event.target.checked){
      this.isDataOk = false;
    }
  }

  /*
  funcion para la confirmacion de usuario y contraseña
  */
  public sendData(){
    let name = this.identiti.name;
    this.loading = true;
    this.person = new Person(this.name,this.fathername,this.mothername);
    this.uservalidate = new UserValidate(name, this.person);
    this.userService.userModify(this.uservalidate).subscribe(
      data=>{
        console.log(data);
        this.getDetailsUser();
      });
  }

  /*
  metodo de busqueda para los cursos
  */
  findCourse(wordcode:string){
    console.log(wordcode)
    this.loading = true;
    this.coursesearch = [];
    if(wordcode!=''){
      for(let id of this.datacourses){
        if(id.title.toLowerCase().includes(wordcode.toLowerCase())){
          this.coursesearch.push(id);
        }
      }
      if(this.coursesearch.length!=0){
        this.loading = false;
        this.isFindOk = true;
      }else{
        this.isFindOk = false;
        this.loading = false;
        this.messageNotFound = "No se encontraron resultados para la busqueda de: "+wordcode
        console.log(this.messageNotFound);
      }
    }else{
      this.isFindOk = false;
      this.loading = false;
      this.messageNotFound = null
    }
  }

  public verCurso(curso){
    this.router.navigate(['/curso',curso]);
  }

  /*
  Metodo para redireccionar al usuario al curso que selecciono
  */
  public getMycourse(course:string, groupid:string, courseid:string, lastSeenBlock:string, firstBlock:string){
    if(!lastSeenBlock){
      this.router.navigate(['/mycourses',course,groupid,courseid,firstBlock]);
    }else{
      this.router.navigate(['/mycourses',course,groupid,courseid,lastSeenBlock]);
    }
  }

}