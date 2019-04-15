import * as $ from 'jquery';
import * as jsPDF from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarComponent } from 'ng-fullcalendar';
import { Comment } from './../../models/course/comment';
import {
  Component,
  DoCheck,
  OnInit,
  ViewChild
  } from '@angular/core';
import { constancias } from './../models/docsconalep';
import { CourseService } from './../../shared/sharedservices/course.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Discussion } from './../../models/course/discussion';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Doubt } from './../../models/temp/doubt';
import { FollowId, Follows } from './../models/follow';
import { GeneratedocsService } from './generatedocs.service';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
  NgbModule
  } from '@ng-bootstrap/ng-bootstrap';
import { Notification } from './../models/notification';
import { Objects } from './../models/Objects';
import { Options } from 'fullcalendar';
import { Reply } from './../../models/course/reply';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { UserService } from './../../shared/sharedservices/user.service';



//import { IMGCONSTCONA } from './../../models/temp/imgconstancias';

@Component({
  selector: 'app-mycourses',
  templateUrl: './mycourses.component.html',
  providers: [CourseService, UserService, ServiceisorgService, DatePipe, DecimalPipe, GeneratedocsService]
})
export class MycoursesComponent implements OnInit, DoCheck {

  public identiti;
  public token;

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;


  public data:any;

  public objectCourse:Objects;
  public objectComment:Objects;
  public objectReply:Objects;
  public objectGroup:Objects;
  public objects:Objects[]=[];

  public doubt:Doubt;
  public comment:Comment;
  public reply:Reply;
  public follow:Follows;
  public followid:FollowId;
  public notification:Notification;

  public titleDoubt:string;
  public titleComment:string;
  public descDoubt:string;

  public rootcomment:any;
  public userid:any;
  public replytocomment:any;
  public blockcomment:any;

  public rootreply:any;
  public commentidreply:any;
  public replytoreply:any;
  public blockreply:any;

  public descComment:string;
  public discussion:Discussion;
  public replyEnt:Reply;
  public discussions:any[]=[];
  public comments:any[]=[];
  public replys:any[]=[];
  public grades:number[]=[];
  public announcements:any[]=[];
  public dataevents:any[]=[]

  public imgconalogo:any;
  public groupid:string;
  public courseid:string;
  public blockid:string;
  public curso:string;
  public minGrade:any;
  public minTrack:any;
  public finalGrade:any;
  public pass:boolean = false;
  public certificateActive:boolean=false;

  public certificateNumber:string;
  public rolUser:boolean;

  public nameStudent:string;
  public date:any;
  public duration:any;
  public durationUnit:any;
  public course:string;

  public block:any = [];
  public blockgrades:any[];
  public sections:any [] = [];
  public contcourse:any [];
  public idc:string;
  public totalgrades:number=0;
  public gradefinal:number=0;

  public testn: number;
  public trackPercent:number;
  public trackblock:any;
  public urlResource:string;
  public arrayblocks:any[];
  public contentblock:any;
  public resources:any[];
  public endDate:Date;
  public beginDate:Date;
  public endCourse:boolean;
  public endDateSpa:any;
  public beginDateSpa:any;

  public closemodal:NgbModalRef;

  public autofollow:boolean=false;
  loading:boolean= false;

  /*
  constructor de la clase
  */
  constructor(private _router:Router,
              private _activeRouter:ActivatedRoute,
              private _cursosService:CourseService,
              private _userService:UserService,
              private modalService:NgbModal,
              private domnsanitizer:DomSanitizer,
              public datePipe:DatePipe,
              public serviceorg:ServiceisorgService,
              private generateDocs:GeneratedocsService) {
    this.rolUser = true;
    this._activeRouter.params.subscribe( params =>{
      if(params['curso']!=null){
        this.curso = params['curso'];
      }
      if(params['groupid']!=null){
        this.groupid = params['groupid'];
      }
      if(params['courseid']!=null){
        this.courseid=params['courseid'];
      }
      if(params['blockid']!=null){
        this.blockid=params['blockid'];
      }
    });
  }

  /*
  Metodo init de la clase
  */
  ngOnInit() {
    this.identiti = this._userService.getIdentiti();
    this.token = this._userService.getToken();
    this.informationCourse(this.courseid);
    this.getMyGrades();
    this.getDiscussionCourse();
    this.getCommentsCourses();
    this.getReplysCourses();
    this.getAnnouncementCourse();

    this._cursosService.showBlocksTrack(this.groupid, this.token).subscribe(data=>{
      this.block = data.message.blocks;
      for(let idevent of data.message.groupDates){
        this.dataevents.push({
          title: idevent.label,
          start: this.datePipe.transform(idevent.beginDate,'yyyy-MM-dd'),
          end:this.datePipe.transform(idevent.endDate,'yyyy-MM-dd'),
          color:this.colorevents(idevent.type)
        });
      }
      this.calendarOptions ={
        locale:'es',
        height:500,
        editable: true,
        eventLimit: false,
        header: {
          left: 'prev,next',
          center: 'title',
          right: ''
        },
        selectable: true,
        events:this.dataevents
      }
    },error=>{
      console.log(error)
    });

    this._cursosService.getResources(this.groupid, this.token).subscribe(data=>{
      this.resources = data.message;
    },error=>{
      console.log(error);
    });
    this.percentTrack();
  }

  ngDoCheck(){
    this.identiti = this._userService.getIdentiti();
    this.token = this._userService.getToken();
  }
  informationCourse(courseid){
    this._cursosService.getCoursesOrg().subscribe(data=>{
      let objr = data.message.courses;
      this.contcourse = objr.find(id=> id.id == courseid);
    },error=>{
      console.log("Error interno de la aplicacion en la busqueda de curso por id")
    });
  }

  public colorevents(type):string{
    let color;
    if(type=='activity'){
      color = 'red'
    }
    if(type=='exam'){
      color = 'green'
    }
    if(type=='general'){
      color = 'blue'
    }
    return color;
  }

  /*

  */
  public getAnnouncementCourse(){
    this._cursosService.getAnnouncementCourse(this.courseid, this.groupid).subscribe(
      data=>{
        this.announcements = data.message
      },error=>{
        console.log(error);
      })
  }

  /*

  */
  public getReplysCourses(){
    this._cursosService.getReplysCourses(this.courseid,this.groupid).subscribe(data=>{
      this.replys = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*

  */
  public getCommentsCourses(){
    this._cursosService.getCommentsCourses(this.courseid, this.groupid).subscribe(data=>{
      this.comments = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para los temas del foro de discusion
  */
  public getDiscussionCourse(){
    this._cursosService.getDiscussionCourse(this.courseid, this.groupid).subscribe(data=>{
      this.discussions = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*
  metodo para obtener las calificaciones y avance del estudiante
  */
  public getMyGrades(){
    this.loading = true;
    var today = new Date();
    this._cursosService.getMyGrades(this.groupid, this.token).subscribe(data=>{
      let res = data.message
      this.data = data.message;
      this.finalGrade = res.finalGrade;
      this.minGrade = res.minGrade;
      this.minTrack = res.minTrack;
      this.blockgrades = res.blocks;
      this.certificateActive = res.certificateActive;

      this.nameStudent = res.name;
      this.date = res.passDate;
      this.duration = res.duration;
      this.durationUnit = res.durationUnits;
      this.course = res.course;
      this.endDate = new Date(res.endDate);
      this.beginDate = new Date(res.beginDate);
      this.endDateSpa = res.endDateSpa;
      this.beginDateSpa= res.beginDateSpa;
      this.certificateNumber = res.certificateNumber;

      if(this.endDate.getTime() < today.getTime()){
        this.endCourse = false;
      }else{
        this.endCourse = true;;
      }

      if(res.pass){
        this.pass = true;
      }else{
        this.pass = false;
      }

      for(let idgrade of this.blockgrades){
        this.totalgrades = this.totalgrades + idgrade.blockW;
        var values = (idgrade.grade*idgrade.blockW)/100;
        this.gradefinal = this.gradefinal+values;
        this.grades.push(values);
      }
      this.loading = false;
    },error=>{
      console.log(error);
      this.loading = false;
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
  Metodo para imprimir la constancia del curso
  */
  public getCertificated(){

    this.serviceorg.getUserConst(this.groupid).subscribe(data=>{
      console.log(data);
    },error=>{
      console.log(error);
    });

    if(this.data.finalGrade >= this.data.minGrade){
      this.generateDocs.printdocumentcredit(constancias.constancia_acreditacion, this.data.certificateNumber, this.data.name,this.data.course,this.data.finalGrade,this.data.duration,this.data.durationUnits, this.data.passDateSpa);
    }else{
      this.generateDocs.printdocassistance(constancias.constancia_participacion, this.data.certificateNumber, this.data.name,this.data.course,this.data.duration,this.data.durationUnits, this.data.passDateSpa);
    }
  }

  /*
  Metodo para ir al curso desde la pestaña de mi progreso actual
  */
  getLesson(){
    this._router.navigate(['/block',this.curso,this.groupid,this.courseid,this.blockid]);
  }

  /*
  Metodo para ir a la leccion desde el temario
  */
  getBlock(id:string){
    this._router.navigate(['/block',this.curso,this.groupid,this.courseid,id]);
  }

  /*
  Metodo para calcular el porcentaje de avance del alumno en el curso
  */
  public percentTrack(){
    this._cursosService.getCourses(this.token).subscribe(data=>{
      let res = data.message;
      for(let curso of res.groups){
        if(curso.courseid == this.courseid){
          this.trackPercent = curso.track;
        }
      }
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para hacer el calculo de las lecciones vistas en base al track
  */
  public observable(data:any){
    this.arrayblocks = data.message.groups;
    for(let crs of this.arrayblocks){
      let id = crs.groupid;
      if(id==this.groupid){
        this._cursosService.showBlocksTrack(id, this.token).subscribe(this.verNumeros.bind(this), this.catchError.bind(this));
      }
    }
  }

  /*

  */
  public verNumeros(data:any){
    let avT=0;
    this.testn = data.message.blockNum;
    this.contentblock = data.message.blocks;
    for (let _idT of this.contentblock) {
      let nT = _idT.track;
      if(nT){
        avT++
      }
    }
    let percent = 100/this.testn;
    this.trackPercent = avT*percent;
  }

  /*
  funcion para cerrar los modals del componente
  */
  closeDialog(){
    this.closemodal.dismiss();
  }

  /*
  Metodo para mostrar los errores en consola
  */
  public catchError(err){
    console.log(err);
  }

  /*
  Metodo para agregar las dudas y comentarios
  */
  setDoubt(title:any, descr:any){
    this.doubt= new Doubt(this.courseid,this.groupid,'root',title,descr,'discussion');
    this._cursosService.setDiscusion(this.doubt).subscribe(data=>{
      this._cursosService.getDiscussionCourse(this.courseid, this.groupid).subscribe(data=>{
        this.discussions = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
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
    this._cursosService.setDiscusion(this.comment).subscribe(data=>{
      let message = "Agrego un comentario sobre tu duda: '"+this.titleDoubt+"'";
      this.setNotificationComment(this.userid, message, this.rootcomment);
      this._cursosService.getCommentsCourses(this.courseid, this.groupid).subscribe(data=>{
        this.comments = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
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
    this._cursosService.setReplytto(this.reply).subscribe(data=>{
      let message ="Respondio a tu comentario: '"+this.titleComment+"'";
      this.setNotificationComment(this.userid, message, this.commentidreply)
      this._cursosService.getReplysCourses(this.courseid,this.groupid).subscribe(data=>{
        this.replys = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
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

    this._userService.setNotification(this.notification).subscribe(data=>{
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
    this._userService.setFollow(this.follow).subscribe(data=>{
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
    this._userService.quitFollow(this.followid).subscribe(data=>{
      this.getDiscussionCourse();
    },error=>{
      console.log(error);
    });
  }
}
