import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService } from './../../shared/sharedservices/user.service';
import { CourseService } from './../../shared/sharedservices/course.service';



@Component({
  selector: 'app-mygroups',
  templateUrl: './mygroups.component.html',
  providers:[UserService,CourseService]
})
export class MygroupsComponent implements OnInit {

  public identiti;
  public token;

  public cursoslist:any[]=[];
  public loading:boolean = false;
  public messageNewUser : boolean = false;

  constructor(private _router:Router, private _activeRouter:ActivatedRoute, private _user:UserService, private _course:CourseService) {
    this.identiti = this._user.getIdentiti();
    this.token = this._user.getToken();
  }

  ngOnInit() {
    this.loading = true
    this.identiti = this._user.getIdentiti();
    this.getCourseUser();
  }

  getCourseUser(){
    this._course.getCourses(this.token).subscribe(data =>{
      let mycursos = data.message.groups;
      this._course.getCoursesOrg().subscribe(data=>{
        for(let idcr of data.message.courses){
          for(let idmg of mycursos){
            if(idcr.id == idmg.courseid){
              this.cursoslist.push({
                curso: idmg,
                imagen: idcr.image
              })
            }
          }
        }
      });
      this.messageNewUser = false;
      this.loading = false
    },error=>{
      if(error._body.includes('"message":"No groups found"')){

      }
      this.messageNewUser = error._body.includes('"message":"No groups found"');
      this.loading = false
    });
  }

  /*
  Metodo para redireccionar al usuario al curso que selecciono
  */
  public getMycourse(course:string, groupid:string, courseid:string, lastSeenBlock:string, firstBlock:string){
    if(!lastSeenBlock){
      this._router.navigate(['/mycourses',course,groupid,courseid,firstBlock]);
    }else{
      this._router.navigate(['/mycourses',course,groupid,courseid,lastSeenBlock]);
    }
  }

}
