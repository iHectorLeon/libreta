import { Injectable } from '@angular/core';
//import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { environment } from './../../../environments/environment';
import { UserService } from './user.service';
import 'rxjs/add/operator/map' ;

@Injectable()
export class CourseService {

  public url:string;
  public token;
  public resultQueryCours:any[];
  public idRQ:string;

  youtubeUrl : string = "https://www.googleapis.com/youtube/v3";
  apikey : string     = "AIzaSyD0yRdoVfZWhISHwYu1j758Phg6jZggvrQ"

  constructor(public _http:HttpClient, private _user:UserService){
    this.url = environment.url;
    this.token = this._user.getToken();
  }

  /*
  metodo para enviar los archivos de la tareas
  */
  setAttachment(file, dir1:any, dir2:any, token:any):Observable<any>{
    let formData = new FormData();
    formData.append('file',file);
    formData.append('fileName',file.name);
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.post(this.url + 'api/v1/file/upload?dir1='+dir1+'&dir2='+dir2, formData,{headers:headers})//.map(res=>res.json());
  }

  /*
  Metodo para enviar las tareas
  */
  setTasks(task):Observable<any>{
    let params = JSON.stringify(task);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });

    return this._http.put(this.url +'api/v1/user/savetask' ,params ,{headers:headers})//.map(res=>res.json());
  }
  /*
  Metodo para obtener los recursos de un curso
  */
  getResources(groupid:any, token:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':token
    });

    return this._http.get(this.url+'api/v1/user/getresource?groupid='+groupid,{headers:headers})//.map(res=>res.json());
  }

  /*
  funcion para obtener el material de apoyo de los cursos
  */
  getAssetsCourse():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });

    return this._http.get(this.url+'');
  }

  /*
  obtener las respuestas en la pestaña de dudas y preguntas de los bloques
  */
  getReplysBlock(blockid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/user/comment/get?query={"pubtype":"discussion","type":"reply","block":"'+blockid+'"}&order=1&skip=0&limit=500',{headers:headers})//.map(res=>res.json());
  }

  /*
  obtener las respuestas en la pestaña de dudas y preguntas de los bloques
  */
  getReplysCourses(courseid:any,groupid:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/user/comment/get?query={"course":"'+courseid+'","group":"'+groupid+'","pubtype":"discussion","type":"reply"}&order=1&skip=0&limit=500',{headers:headers})//.map(res=>res.json());
  }

  /*
  obtener los comentarios en la pestaña de dudas y preguntas de los bloques
  */
  getCommentsBlock(blockid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/user/comment/get?query={"pubtype":"discussion","type":"comment","block":"'+blockid+'"}&order=1&skip=0&limit=500',{headers:headers})//.map(res=>res.json());
  }

  /*
  obtener los comentarios en la pestaña de dudas y preguntas de los cursos
  */
  getCommentsCourses(courseid:any, groupid:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/user/comment/get?query={"course":"'+courseid+'","group":"'+groupid+'","pubtype":"discussion","type":"comment"}&order=1&skip=0&limit=500',{headers:headers})//.map(res=>res.json());
  }

  /*
  listar las dudas y comentarios de los bloques
  */
  getDiscussion(blockid):Observable<any>{
    //api/v1/user/comment/get?query={"pubtype":"discussion", "block":
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/user/comment/get?query={"pubtype":"discussion","type":"root","block":"'+blockid+'"}&order=-1&skip=0&limit=500',{headers:headers})//.map(res=>res.json());
  }

  /*
  listar las dudas y comentarios de los cursos
  */
  getDiscussionCourse(courseid:any, groupid:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/user/comment/get?query={"course":"'+courseid+'","group":"'+groupid+'","pubtype":"discussion","type":"root"}&order=-1&skip=0&limit=500',{headers:headers})//.map(res=>res.json());
  }

  /*
  listar los avisos de los cursos
  */
  getAnnouncementCourse(courseid:any, groupid:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/user/comment/get?query={"course":"'+courseid+'","group":"'+groupid+'","pubtype":"announcement","type":"root"}&order=-1&skip=0&limit=500',{headers:headers})//.map(res=>res.json());
  }

  /*
  comentar en un tema del foro de discusion
  */
  setReplytto(reply):Observable<any>{
    let params = JSON.stringify(reply);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.post(this.url+"api/v1/user/comment/create",params,{headers:headers});
  }

  /*
  crear un tema para el foro de discusión
  */
  setDiscusion(discusion):Observable<any>{
    let params = JSON.stringify(discusion);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.post(this.url+"api/v1/user/comment/create",params,{headers:headers});
  }

  /*
  Mostrar la información de avance en el curso al alumno
  */
  getMyGrades(groupid:any, token:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':token
    });
    return this._http.get(this.url+'api/v1/user/mygrades?groupid='+groupid,{headers:headers})//.map(res=>res.json());
  }

  /*
  guardar las calificaciones del alumno en el mongodb
  */
  setAttempt(attempt):Observable<any>{
    let params = JSON.stringify(attempt);
    console.log(params);
    let headers = new HttpHeaders(
      {
        'Content-Type':'application/json',
        'x-access-token':this.token
      }
    );
    return this._http.put(this.url+'api/v1/user/createattempt',params,{headers:headers})//.map(res=>res.json());
  }

  getCourses(token:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':token
    });
    return this._http.get(this.url+'api/v1/user/mygroups',{headers:headers})//.map(res=>res.json());
  }

  getCoursesOrg():Observable<any>{
    return this._http.get(this.url+'api/course/list?org=conalep')//.map(res=>res.json());
  }

  showBlocks(id:any):Observable<any>{
    return this._http.get(this.url+'api/course/getblocklist?id='+id)//.map(res=>res.json());
  }


  /*
  funcion para mostrar el listado del temario en base al track
  */

  showBlocksTrack(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':token
    });
    return this._http.get(this.url+'api/v1/user/mygroup?groupid='+id,{headers:headers})//.map(res=>res.json());
  }


  /*
  Metodo para traer la informacion del bloque
  */
  getBlock(groupid:string,courseid:string,blockid:string, prev?:boolean):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    if(prev){
      return this._http.get(this.url+'api/v1/user/nextblock?groupid='+groupid+'&courseid='+courseid+'&blockid='+blockid+'&lastid='+blockid,{headers:headers})//.map(res=>res.json());
    }else{
      return this._http.get(this.url+'api/v1/user/nextblock?groupid='+groupid+'&courseid='+courseid+'&blockid='+blockid,{headers:headers})//.map(res=>res.json());
    }
  }

  getBlockNext(groupid:string,courseid:string,blockid:string):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/user/nextblock?groupid='+groupid+'&courseid='+courseid+'&blockid='+blockid+'&lastid='+blockid,{headers:headers})//.map(res=>res.json());
  }

  /*
  getVideos(id:any):Observable<any>{
    let url = `${this.youtubeUrl}/videos`;
    let params = new URLSearchParams();
    params.set('part','snippet');
    params.set('id',id);
    params.set('key',this.apikey);

    return this._http.get(url).map(res=> {
      let videos : any []=[];
      for(let video of res.json().items){
        let snippet = video.id;
        videos.push(snippet);
      }
        return videos;
    });
  }
  */

  getMyGradesTask(groupid:any, blockid:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    })
    return this._http.get(this.url+'api/v1/user/getgrade?groupid='+groupid+'&blockid='+blockid,{headers:headers})//.map(res=>res.json());
  }

}
