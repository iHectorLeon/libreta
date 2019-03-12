import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from './../../shared/sharedservices/user.service';
import { CourseService } from './../../shared/sharedservices/course.service';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';

import { TaskGrade } from './../../models/course/taskgrade';
import { GradeTask } from './../models/course';
import { Doubt } from './../../models/temp/doubt';
import { Objects } from './../../user/models/Objects';
import { Notification } from './../../user/models/notification';

@Component({
  selector: 'app-tasksview',
  templateUrl: './tasksview.component.html',
  providers:[UserService,ServiceisorgService, CourseService]
})
export class TasksviewComponent implements OnInit {

  tasksStudents:any;
  loading:boolean=false;
  isGradeOk:boolean=true;

  groupCode:any;

  courseid:any;
  groupid:string;
  studentid:string;
  blockid:any;
  roosterid:any;
  messageSuccess:any;
  messageTasks:any[]=[];

  taskGrade:TaskGrade;
  gradeTask:GradeTask []=[];
  comment:Doubt;
  notification:Notification;

  objectCourse:Objects;
  objectGroup:Objects;
  objectTutor:Objects;
  objects:Objects[]=[];
  file:any;

  constructor(private _router:Router, private _activeRouter:ActivatedRoute, private _user:UserService, private serviceisorg:ServiceisorgService, private courseservice:CourseService) {
    this._activeRouter.params.subscribe(params=>{
      if(params['groupCode']!=null){
        this.groupCode = params['groupCode'];
      }
      if(params['courseid']!=null){
        this.courseid = params['courseid'];
      }
      if(params['groupid']!=null){
        this.groupid = params['groupid'];
      }
      if(params['studentid']!=null){
        this.studentid = params['studentid'];
      }
      if(params['blockid']!=null){
        this.blockid = params['blockid'];
      }
    });
  }

  ngOnInit() {
    this.getTask();
  }

  /*
  metodo para obtener las tareas
  */
  public getTask(){
    this.loading = true
    this.serviceisorg.getTask(this.groupid, this.studentid, this.blockid).subscribe(data=>{
      this.tasksStudents = data.message;
      for(let id of this.tasksStudents.tasks){
        if(id.type == 'file'){
          this.downloadTask(id.content);
        }
      }
      this.loading = false;
    },error=>{
      this.loading = false;
    });
  }

  /*
  Metodo para guardar la calificacion de la tarea
  */
  saveGradetask(taskid:any, grade:number){
    this.taskGrade = new TaskGrade(this.tasksStudents.rosterid, this.blockid, taskid, grade);
    this.serviceisorg.setgradeTask(this.taskGrade).subscribe(data=>{
      let message = "Se guardó la calificación correctamente"
      this.messageTasks.push({taskid, message});
    },error=>{
      let er = error;
      this.messageTasks.push({taskid,er})
    });
  }

  /*
  metodo para enviar las calificaciones al api
  */
  sendGrades(comment?:string){
    this.objects = [];
    for(let grade of this.gradeTask){
      this.saveGradetask(grade.id, grade.grade);
    }
    if(comment){
      this.comment = new Doubt(this.courseid,this.groupid,'root','Mensaje del tutor',comment,'tutor',this.blockid,this.studentid);
      this.courseservice.setDiscusion(this.comment).subscribe(data=>{
        this.objectCourse = new Objects('courses',this.courseid);
        this.objects.push(this.objectCourse);
        this.objectGroup = new Objects('groups',this.groupid);
        this.objects.push(this.objectGroup);
        this.objectTutor = new Objects('blocks',this.blockid);
        this.objects.push(this.objectTutor);
        let message = "Calificó tu tarea y agregó un comentario"
        this.notification = new Notification(this.studentid, message, 'user', this.objects,'instructor');
        this._user.setNotification(this.notification).subscribe(data=>{
          console.log(data)
        },error=>{
          console.log(error);
        });
      },error=>{
        console.log(error);
      });
    }else{
      let message = "Calificó tu tarea"
      this.objectCourse = new Objects('courses',this.courseid);
      this.objects.push(this.objectCourse);
      this.objectGroup = new Objects('groups',this.groupid);
      this.objects.push(this.objectGroup);
      this.objectTutor = new Objects('blocks',this.blockid);
      this.objects.push(this.objectTutor);

      this.notification = new Notification(this.studentid, message, 'user', this.objects, 'instructor');

      this._user.setNotification(this.notification).subscribe(data=>{
        console.log(data)
      },error=>{
        console.log(error);
      });
    }
  }

  /*
  metodo para guardar las calificaciones que captura el tutor
  */
  setGrade(id:number, grade:number, label:any){
    if(grade<=100){
      this.isGradeOk = true;
      if(this.gradeTask.length > 0 ){
        if(this.gradeTask.find(id => id.label === label)){
          let indexRepeat = this.gradeTask.indexOf(this.gradeTask.find(id => id.label === label));
          this.gradeTask.splice(indexRepeat,1);
          this.gradeTask.push({id,grade,label});
        }else{
          this.gradeTask.push({id,grade,label});
        }
      }else{
        this.gradeTask.push({id,grade,label});
      }
    }else{
      this.isGradeOk = false;
    }
  }

  /*

  */
  downloadTask(idTask){
    this.serviceisorg.downloadFile(idTask).subscribe(
      (res) => {
        this.file = res.file.url;
      });
  }

  /*
  metodo para regresar a la vista de tareas del tutor
  */
  returnTaskReview(){
    this._router.navigate(['/taskreview', this.groupCode]);
  }
}
