import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from './../../shared/sharedservices/user.service';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { CourseService } from './../../shared/sharedservices/course.service';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Doubt } from './../../models/temp/doubt';
import { Reply } from './../../models/course/reply';
import { Comment } from './../../models/course/comment';
import { Discussion } from './../../models/course/discussion';
import { Notification } from './../../user/models/notification';
import { Objects } from './../../user/models/Objects';
import { Follows, FollowId } from './../../user/models/follow';


@Component({
  selector: 'app-taskreview',
  templateUrl: './taskreview.component.html',
  providers:[UserService,ServiceisorgService,CourseService]
})
export class TaskreviewComponent implements OnInit {

  public token;
  loading:boolean=false
  loadingbtn:boolean=false;
  closemodal:NgbModalRef;

  doubt:Doubt;
  comment:Comment;
  reply:Reply;
  notification:Notification;

  follow:Follows;
  followid:FollowId;


  objectCourse:Objects;
  objectComment:Objects;
  objectReply:Objects;
  objectGroup:Objects;
  objects:Objects[]=[];

  replytoreply:any;
  rootreply:any;
  commentidreply:any;
  userid:any;
  titleComment:any;
  blockreply:any;
  rootcomment:any;
  replytocomment:any;
  titleDoubt:any;
  blockcomment:any;


  public listRooster:any[]=[];
  public idrooster:any;
  public curso:string;
  public grupo:string;
  public beginDate:Date;
  public endDate:Date;
  public totalStudents:number;
  public courseid:any;
  public groupid:any;
  public dataGrades:any[]=[];
  public students:any[]=[];
  public grades:any[]=[];
  public tasksStudent:any[]=[];
  public labelGrades:any;
  public labelGradesList:any[]=[];

  public studentid:any;
  public announcement:Doubt;
  public announcements:any[]=[];

  discussions:any[];
  comments:any[];
  replys:any[];

  public messageSuccess:any;
  public messageError:any;

  groupCode:string;

  constructor(private modalService:NgbModal, private _router:Router, private _activeRouter:ActivatedRoute, private _user:UserService, private serviceisorg:ServiceisorgService, private courseService:CourseService) {
    this.token = this._user.getToken();
    this._activeRouter.params.subscribe(params=>{
      this.groupCode = params['groupCode'];
    });
  }
  ngOnInit() {
    this.getTasks();
  }

  /*
  Metodo para obtener el listado de los alumnos por grupo con sus respectivas tareas
  */
  public getTasks(){
    this.loading = true;
    this.labelGradesList =[];
    this.serviceisorg.getlistroster(this.groupCode).subscribe(data=>{
      this.listRooster = data.message;
      this.courseid = data.message.courseid;
      this.groupid = data.message.groupid;
      this.getAnnouncementCourse();
      this.getDiscussionCourse();
      this.getCommentsCourses();
      this.getReplysCourses();
      for(let item of data.message.students){
        if(item.grades.length==0){
          this.labelGrades ="sin tareas";
        }else{
          for(let itemGrades of item.grades){
            if(!itemGrades.taskGrade){
              this.labelGrades = "sin revisar tarea";
            }else{
              this.labelGrades="tareas";
            }
          }
        }
        this.labelGradesList.push(this.labelGrades);
      }
      this.loading = false;
    },error=>{
      this.loading = false;
    });
  }

  /*
  Metodo para enviar a la vista de tareas
  */
  setTaskReview(grupo:any,courseid:any, groupid:any, blockid:any){
    this._router.navigate(['/tasksview', grupo, courseid, groupid, this.studentid, blockid]);
  }

  /*
  metodo para recibir las tareas
  */
  viewTask(tasks:any, studentid:any, content){
    this.tasksStudent = [];
    this.tasksStudent = tasks;
    this.studentid = studentid;
    this.showModal(content);
  }

  /*
  metodo para traer el historial de calificaciones del alumno
  */
  viewGrades(groupid, userid, content){
    this.serviceisorg.getGradesStudent(groupid,userid).subscribe(data=>{
      this.dataGrades = data.message.blocks
      this.showModal(content);
    },error=>{
      console.log(error);
    });
  }

  /*

  */
  public setAnnouncement(descr:any){
    this.loadingbtn = true;
    this.announcement= new Doubt(this.courseid, this.groupid, 'root', 'Aviso del instructor', descr, 'announcement');
    this.courseService.setDiscusion(this.announcement).subscribe(data=>{
      this.getAnnouncementCourse();
      this.loadingbtn = false;
      this.messageSuccess="Se agregó el aviso exitosamente";
    },error=>{
      console.log(error);
      this.loadingbtn = false;
      this.messageError="Ocurrió el siguiente error al publicar el aviso: "+error
    });
  }

  /*

  */
  public getAnnouncementCourse(){
    this.courseService.getAnnouncementCourse(this.courseid, this.groupid).subscribe(
      data=>{
        this.announcements = data.message
      },error=>{
        console.log(error);
      })
  }

  /*
  metodo para mostrar el modal de la cancelación de la solicitud
  */
  public showModal(content){
    this.closemodal = this.modalService.open(content);
  }
  public closeModal(){
    this.closemodal.dismiss();
  }

  /*
  Metodo para los temas del foro de discusion
  */
  public getDiscussionCourse(){
    this.courseService.getDiscussionCourse(this.courseid, this.groupid).subscribe(data=>{
      this.discussions = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*

  */
  public getCommentsCourses(){
    this.courseService.getCommentsCourses(this.courseid, this.groupid).subscribe(data=>{
      this.comments = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*

  */
  public getReplysCourses(){
    this.courseService.getReplysCourses(this.courseid,this.groupid).subscribe(data=>{
      this.replys = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*
  funcion para agregar una nueva discusion en FAQ
  */
  shownewDoubt(content){
    this.closemodal = this.modalService.open(content);
  }

  /*
  Funcion que muestra el modal para agregar un comentario
  */
  public showComment(content, id_root, userId, doubTitle, block?){
    this.closemodal = this.modalService.open(content);
    this.rootcomment = id_root;
    this.replytocomment = id_root;
    this.userid = userId;
    this.titleDoubt = doubTitle;
    this.blockcomment = block;
  }

  /*
  Funcion que muestra el modal para agregar un comentario
  */
  public showReply(content, id, root, userId, commentTitle, block?){
    this.closemodal = this.modalService.open(content);
    this.replytoreply = id;
    this.rootreply = root;
    this.commentidreply = id;
    this.userid = userId;
    this.titleComment = commentTitle;
    this.blockreply = block;
  }

  /*
  Metodo para agregar las dudas y comentarios
  */
  setDoubt(title:any, descr:any){
    this.doubt= new Doubt(this.courseid,this.groupid,'root',title,descr,'discussion');
    this.courseService.setDiscusion(this.doubt).subscribe(data=>{
      this.courseService.getDiscussionCourse(this.courseid, this.groupid).subscribe(data=>{
        this.discussions = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeModal();
  }

  /*
  Metodo para agregar un comentario a una discusion del tema
  */
  setComment(descr:any){
    if(this.blockcomment){
      this.comment = new Comment(this.courseid,this.groupid,'comment',this.rootcomment, this.replytocomment,descr, this.blockcomment);
    }else{
      this.comment = new Comment(this.courseid,this.groupid,'comment',this.rootcomment, this.replytocomment,descr);
    }
    this.courseService.setDiscusion(this.comment).subscribe(data=>{
      let message = "Agrego un comentario sobre tu duda: '"+this.titleDoubt+"'";
      this.setNotificationComment(this.userid, message, this.rootcomment);
      this.courseService.getCommentsCourses(this.courseid, this.groupid).subscribe(data=>{
        this.comments = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeModal();
  }

  /*
  Metodo para agregar una respuesta de un comentario
  */
  setReply(text:any){
    if(this.blockreply){
      this.reply = new Reply(this.courseid,this.groupid,'reply',this.rootreply,this.commentidreply,this.replytoreply,text, this.blockreply);
    }else{
      this.reply = new Reply(this.courseid,this.groupid,'reply',this.rootreply,this.commentidreply,this.replytoreply,text);
    }
    this.courseService.setReplytto(this.reply).subscribe(data=>{
      let message ="Respondio a tu comentario: '"+this.titleComment+"'";
      this.setNotificationComment(this.userid, message, this.commentidreply)
      this.courseService.getReplysCourses(this.courseid,this.groupid).subscribe(data=>{
        this.replys = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeModal();
  }

  /*
  Metodo para agregar las notificaciones de comentarios
  */
  setNotificationComment(destination:any,message:string, rootcomment:any){

    this.objectCourse = new Objects ('courses',this.courseid);
    this.objects.push(this.objectCourse);

    this.objectGroup = new Objects('groups',this.groupid);
    this.objects.push(this.objectGroup);

    this.objectComment = new Objects('discussions', rootcomment);
    this.objects.push(this.objectComment);

    this.notification = new Notification(destination, message, 'user', this.objects);

    this._user.setNotification(this.notification).subscribe(data=>{
      console.log(data);
    }, error=>{
      console.log(error);
    });
  }

  /*
  metodo para la notificación del follow
  */
  setFollow(discussionId){
    this.follow = new Follows(discussionId,'discussions');
    this._user.setFollow(this.follow).subscribe(data=>{
      this.getDiscussionCourse();
    },error=>{
      console.log(error);
    });
  }

  /*

  */
  deleteFollow(followid){
    console.log(followid);
    this.followid = new FollowId(followid);
    this._user.quitFollow(this.followid).subscribe(data=>{
      this.getDiscussionCourse();
    },error=>{
      console.log(error);
    });
  }
}
