import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { personmuir,studentmuir,usermuir, userexternalmuir, studentexternalmuir, corporate} from './../manager.models';

import { ManagerserviceService } from './../managerservice.service';
import { UserService } from './../../shared/sharedservices/user.service';
import * as XLSX from 'xlsx';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-addusers',
  templateUrl: './addusers.component.html',
  providers: [UserService,ManagerserviceService]
})
export class AddusersComponent implements OnInit {

  loadingprocess:boolean;
  loading:boolean;
  reasonOk:boolean = false;
  uservalite:boolean=false;
  personcheck:boolean;
  userindividual:number=0;
  typeregister:any;
  resulttrue:number;
  resultfalse:number;
  resultfind:number;
  resultrepeat:number;

  idrequest:any;
  numberrequest:any;
  request:any;
  labelrequest:any;
  idgroup:any;
  codegroup:any;
  course:any;
  orgName:any;

  carrerList:any[]=[];
  termnList:any[]=['Semestre I','Semestre II','Semestre III','Semestre IV','Semestre V','Semestre VI','Semestre VII']
  csvContent:any[]=[];
  csvResult:any[]=[];

  studenstTemp:any[]=[];
  studentscsvfile:any[]=[];

  messageErrorFile:any;
  messageSuccessFile:any;

  messageSuccess:any;
  messageError:any;

  user:usermuir;
  userexternal:userexternalmuir;
  person:personmuir;
  student:studentmuir;
  personsinglemuir:personmuir;
  studentsinglemuir:studentmuir;
  studentexternalmuir:studentexternalmuir;
  typecorporate:corporate;
  closemodal:NgbModalRef;

  numberRegex = /^([0-9])*$/
  stringRegex = /^([A-Za-z])+$/
  stringRegexBlank = /([A-Za-z])\s([A-Za-z])/
  termnRegex = /^Semestre\s([I,II,III,IV,V,VI,VII])/

  emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  identiti:any;

  personsingle:any;
  studentsingle:any;
  idusersingle:any;
  persontmp:any;
  typestudent:any;
  corptype:any;
  termn:any;
  career:any;

  datosOkString:boolean=false;
  datosOkname:boolean=false;
  datosOkafather:boolean=false;
  datosOkamother:boolean=false;
  datosOkemails:boolean=false;
  datosOk:boolean=false;
  datosOktype:boolean=false;
  datosOkCorptype:boolean=false;
  datosOkcarrer:boolean=false;
  datosOktermn:boolean=false;
  userfind:boolean;
  userfinder:boolean;
  file:File;
  arrayBuffer:any;

  constructor(private modalService:NgbModal, private activatedroute:ActivatedRoute,private managerServices:ManagerserviceService, private userService:UserService) {
    this.activatedroute.params.subscribe(params=>{
      if(params['idrequest']!=null){
        this.idrequest = params['idrequest'];
      }
      if(params['numberrequest']!=null){
        this.numberrequest = params['numberrequest'];
      }
      if(params['labelrequest']!=null){
        this.labelrequest = params['labelrequest'];
      }
      if(params['idgroup']!=null){
        this.idgroup = params['idgroup'];
      }
      if(params['codegroup']!=null){
        this.codegroup = params['codegroup'];
      }
      if(params['orgUnit']!=null){
        this.orgName = params['orgUnit']
      }
    });
    this.userindividual = 0;
    this.personsinglemuir = new personmuir('','','','');
  }

  ngOnInit() {
    this.getCarreras();
    this.getRequestDetails();
  }

  /*
  metodo para validar el tipo de registro por parte del supervisor
  */
  gettyperegister(type){
    this.typeregister = ''
    if(type!=''){
      this.typeregister = type;
    }
  }

  getRequestDetails(){
    this.loading = true;
    this.managerServices.getRequestFinder(this.numberrequest).subscribe(
      data => {
        let restemp = data.request.temp2
        this.request = restemp.find(res => res.idgroup == this.idgroup);
        this.course = data.request.details.find(res => res.item._id == this.idgroup);
        this.loading = false;
      }
    );
  }

  /*
  Metodo para la carga del archivo
  */
  public loadFile(evt){
    this.csvContent=[];
    this.csvResult = [];
    this.file = evt.target.files[0];
    if(this.file.size>0){
      let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.csvContent = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            console.log(this.csvContent)
        }
      fileReader.readAsArrayBuffer(this.file);
      this.messageSuccessFile = "Se cargó el archivo: "+this.file.name+" correctamente"
    }
  }

  /*
  Metodo para validar la informacion del archivo
  */
  public processFiles(){
    let indice = 0;
    let result;
    this.resulttrue=0;
    this.resultfalse=0;
    this.resultfind=0;
    this.resultrepeat=0;
    this.csvResult = [];
    this.studenstTemp=[];
    this.studentscsvfile=[];
    this.loadingprocess = true;
    let usertmp;
    if(this.csvContent.length<=200){
      for(let id of this.csvContent){
        if(id.Numero!=''||id.Nombre_Completo!=''||id.Apellido_Paterno!=''||id.Apellido_Materno!=''||id.Correo_electronico!=''||id.Usuario!=''||id.Tipo!=''){
          console.log("Hola mundo si aplica");
          if(this.validateEmails(id.Correo_electronico)){
            this.person = new personmuir(id.Nombre_Completo,id.Apellido_Paterno,id.Apellido_Materno,id.Correo_electronico);
            if(id.Usuario=='Interno' || id.Usuario=='interno'){
              if(id.Carrera!=''&& id.Semestre!=''){
                if(this.validateCareer(id.Carrera) && this.validateTermn(id.Semestre)){
                  this.studentsinglemuir = new studentmuir('internal',id.Carrera,id.Semestre);
                }else{
                  this.studentsinglemuir = new studentmuir('internal');
                }
              }else{
                this.studentsinglemuir = new studentmuir('internal');
              }
              this.typecorporate = new corporate(this.parsetypeStudent(id.Tipo));
              this.user = new usermuir(this.person,this.passwordGenerator(id.Numero,this.person.name, this.person.fatherName), 'conalep',this.orgName,this.codegroup,this.numberrequest,this.studentsinglemuir,this.typecorporate);
              usertmp = this.user;
            }else if(id.Usuario=='Externo' || id.Usuario=='externo'){
              this.studentexternalmuir = new studentexternalmuir('external',this.parsetypeStudent(id.Tipo));
              this.userexternal = new userexternalmuir(this.person,this.passwordGenerator(id.Numero,this.person.name, this.person.fatherName), 'conalep',this.orgName,this.codegroup,this.numberrequest,this.studentexternalmuir);
              usertmp = this.userexternal;
            }
            this.managerServices.createuserbymanager(usertmp).subscribe(
              data=>{
                if(this.studentscsvfile.find(scsv=> scsv.correoElectronico == id.Correo_electronico) || this.request.students.find(st => st.correoElectronico == id.Correo_electronico)){
                  result = {'value':id,"flag":'secondary'}
                  this.resultrepeat++;
                  this.csvResult.push(result);
                }else if(data.uri!=null){
                  result = {'value':id,"flag":'success'}
                  this.resulttrue++;
                  this.csvResult.push(result);
                  this.studenstTemp.push(data.userid);
                  this.studentscsvfile.push({
                    'nombreCompleto':usertmp.person.name,
                    'apellidoPaterno':usertmp.person.fatherName,
                    'apellidoMaterno':usertmp.person.motherName,
                    'correoElectronico':usertmp.person.email,
                    'contraseña':usertmp.password
                  });
                }else{
                  result = {'value':id,"flag":'warning'}
                  this.resultfind++;
                  this.csvResult.push(result);
                  this.studenstTemp.push(data.user.id);
                  this.studentscsvfile.push({
                    'nombreCompleto':data.user.person.name,
                    'apellidoPaterno':data.user.person.fatherName,
                    'apellidoMaterno':data.user.person.motherName,
                    'correoElectronico':data.user.person.email,
                    'contraseña':'Usuario existente'
                  });
                }
                this.loadingprocess = false
              },error=>{
                console.log(error);
                this.loadingprocess = false
              }
            );
          }else{
            result = {'value':id,"flag":'danger'}
            this.resultfalse++;
            this.csvResult.push(result);
          }
        }else{
          let result = {'id':id[0],'flag':false, 'result':"el registro no cumple con los estandares de informacion"}
          this.csvResult.push(result);
          this.resultfalse++;
        }
        console.log(this.csvResult);
      }
    }else{
      this.messageErrorFile = "El archivo solo puede contener como máximo 200 registros";
    }
  }

  /*
  metodo para actualizar la solicitud
  */
  updateRequestManager(){
    this.loadingprocess = true;
    this.managerServices.getRequestFinder(this.numberrequest).subscribe(
      data=>{
        let tmparray = data.request.temp1;
        let tmparray2 = data.request.temp2;
        let valuetemp = tmparray.find(id => id.idgroup == this.idgroup);
        let valuetemp2 = tmparray2.find(id => id.idgroup == this.idgroup);
        let indexrepeat = tmparray.indexOf(tmparray.find(id => id.idgroup == this.idgroup));
        let indexrepeat2 = tmparray2.indexOf(tmparray2.find(id => id.idgroup == this.idgroup));

        if(valuetemp.studentsforgroup.length > 0){
          let index = this.studenstTemp.length;
          let contador = 0;
          for(let id of this.studenstTemp){
            valuetemp.studentsforgroup.push(id);
            contador++;
            if(contador == index){
              tmparray.splice(indexrepeat,1);
              tmparray.push({"idgroup":this.idgroup,"studentsforgroup":valuetemp.studentsforgroup,"codecourse":valuetemp.codecourse,"apiexternal":valuetemp.apiexternal});
              let requestUpdate = {
                'number':this.numberrequest,
                'temp1':tmparray
              }
              this.managerServices.updateRequestManager(requestUpdate).subscribe(data=>{
                this.loadingprocess=false;
              },error=>{
                this.loadingprocess=false;
              });
            }
          }
        }else{
          tmparray.splice(indexrepeat,1);
          tmparray.push({"idgroup":this.idgroup,"studentsforgroup":this.studenstTemp,"codecourse":valuetemp.codecourse,"apiexternal":valuetemp.apiexternal});
          let requestUpdate = {
            'number':this.numberrequest,
            'temp1':tmparray
          }
          console.log(requestUpdate);
          this.managerServices.updateRequestManager(requestUpdate).subscribe(data=>{
            this.loadingprocess=false;
          },error=>{
            this.loadingprocess=false;
          });
        }
        if(valuetemp2.students.length > 0){
          let index = this.studentscsvfile.length;
          let contador = 0;
          for(let id of this.studentscsvfile){
            valuetemp2.students.push(id);
            contador++;
            if(contador == index){
              tmparray2.splice(indexrepeat2,1);
              tmparray2.push({"idgroup":this.idgroup,"students":valuetemp2.students,"codecourse":valuetemp2.codecourse});
              let requestUpdate = {
                'number':this.numberrequest,
                'temp2':tmparray2
              }
              console.log(requestUpdate);
              this.managerServices.updateRequestManager(requestUpdate).subscribe(data=>{
                this.loadingprocess=false;
              },error=>{
                this.loadingprocess=false;
              });
            }
          }
        }else{
          tmparray2.splice(indexrepeat2,1);
          tmparray2.push({"idgroup":this.idgroup,"students":this.studentscsvfile,"codecourse":valuetemp2.codecourse});
          let requestUpdate = {
            'number':this.numberrequest,
            'temp2':tmparray2
          }
          console.log(requestUpdate);

          this.managerServices.updateRequestManager(requestUpdate).subscribe(data=>{
            this.loadingprocess=false;
          },error=>{
            this.loadingprocess=false;
          });
        }
        this.loadingprocess=false;
      }
    );
  }

  /*
  metodo para actualizar un grupo por cada usuario nuevo
  */
  updateRequestManagerSingle(newuserid, user){
    this.loadingprocess = true;
    this.managerServices.getRequestFinder(this.numberrequest).subscribe(
      data=>{
        let tmparray = data.request.temp1;
        let tmparray2 = data.request.temp2;
        let valuetemp = tmparray.find(id => id.idgroup == this.idgroup);
        let valuetemp2 = tmparray2.find(id => id.idgroup == this.idgroup);
        let indexrepeat = tmparray.indexOf(tmparray.find(id => id.idgroup == this.idgroup));
        let indexrepeat2 = tmparray2.indexOf(tmparray2.find(id => id.idgroup == this.idgroup));

        if(valuetemp.studentsforgroup.length > 0){
          valuetemp.studentsforgroup.push(newuserid);
          tmparray.splice(indexrepeat,1);
          tmparray.push({"idgroup":this.idgroup,"studentsforgroup":valuetemp.studentsforgroup,"codecourse":valuetemp.codecourse,"apiexternal":valuetemp.apiexternal});
        }else{
          valuetemp.studentsforgroup.push(newuserid);
          tmparray.splice(indexrepeat,1);
          tmparray.push({"idgroup":this.idgroup,"studentsforgroup":valuetemp.studentsforgroup,"codecourse":valuetemp.codecourse,"apiexternal":valuetemp.apiexternal});
        }
        if(valuetemp2.students.length > 0){
          valuetemp2.students.push(user);
          tmparray2.splice(indexrepeat2,1);
          tmparray2.push({"idgroup":this.idgroup,"students":valuetemp2.students,"codecourse":valuetemp2.codecourse});
          let requestUpdate = {
            'number':this.numberrequest,
            'temp1':tmparray,
            'temp2':tmparray2
          }
          this.managerServices.updateRequestManager(requestUpdate).subscribe(data=>{
            console.log(data);
            this.messageSuccess = "Se agregó el usuario exitosamente"
            this.userindividual++;
            this.loadingprocess=false;
            this.uservalite = false;
          },error=>{
            this.loadingprocess=false;
            this.messageError = "Ocurrio un error interno de la plataforma: "+error;
            this.uservalite = false;
          });
        }else{
          valuetemp2.students.push(user);
          tmparray2.splice(indexrepeat2,1);
          tmparray2.push({"idgroup":this.idgroup,"students":valuetemp2.students,"codecourse":valuetemp2.codecourse});
          let requestUpdate = {
            'number':this.numberrequest,
            'temp1':tmparray,
            'temp2':tmparray2
          }
          this.managerServices.updateRequestManager(requestUpdate).subscribe(data=>{
            console.log(data);
            this.messageSuccess = "Se agregó el usuario exitosamente"
            this.userindividual++;
            this.loadingprocess=false;
            this.uservalite = false;
          },error=>{
            this.loadingprocess=false;
            this.messageError = "Ocurrio un error interno de la plataforma: "+error;
            this.uservalite = false;
          });
        }
      },error=>{
        console.log(error);
      }
    );
  }

  /*
  Metodo para validar las cadenas de texto
  */
  public validateStrings(value):boolean{
    this.datosOk= false;
    this.datosOk = this.stringRegex.test(value)
    return this.datosOk;
  }

  /*
  metodo para validar el correo electronico del usuario
  */
  public validateEmails(value):boolean{
    this.datosOk = false;
    this.datosOk = this.emailRegex.test(value);
    this.personsinglemuir.email = value;
    return this.datosOk;
  }

  /*
  Metodo para validar los semestres del alumno
  */
  public validateTermn(value):boolean{
    this.datosOktermn = false;
    this.datosOktermn = this.termnRegex.test(value);
    this.termn = value;
    return this.datosOktermn
  }

  /*
  Metodo para validar espacios en blanco
  */
  public validateSpaceBlank(value):boolean{
    this.reasonOk = false;
    this.reasonOk = this.stringRegexBlank.test(value) || this.stringRegex.test(value);
    return this.reasonOk
  }


  public validateName(value):boolean{
    this.datosOkname = false;
    this.datosOkname = this.stringRegex.test(value);
    this.personsinglemuir.name = value;
    return this.datosOkname;
  }

  public validateafather(value):boolean{
    this.datosOkafather = false;
    this.datosOkafather = this.stringRegex.test(value);
    this.personsinglemuir.fatherName = value;
    return this.datosOkafather;
  }
  public validateamother(value):boolean{
    this.datosOkamother = false;
    this.datosOkamother = this.stringRegex.test(value);
    this.personsinglemuir.motherName = value;
    return this.datosOkamother;
  }

  public validatetypestudent(value):boolean{
    this.datosOktype = false;
    this.datosOkCorptype = false;
    this.typestudent = '';
    if(value!=''){
      this.datosOktype = true;
      this.typestudent = value;
    }
    return this.datosOktype
  }

  public validatecorptypestudent(value):boolean{
    this.datosOkCorptype = false;
    this.corptype = '';
    this.termn = '';
    this.career = '';
    if(value!=''){
      this.datosOkCorptype = true;
      this.corptype = value;
    }
    return this.datosOkCorptype
  }

  /*
  Metodo para validar las carreras que vienen en el Excel del usuario
  */
  public validateCareer(value):boolean{
    this.datosOkcarrer = false;
    this.datosOkcarrer = this.carrerList.find(id => id.longName == value);
    this.career = value;
    return this.datosOkcarrer;
  }

  /*
  Metodo para generar el password del usuarios
  */
  public passwordGenerator(consecutivo, name:string, fatherName:string):string{
    let elementsPass = ['.','+','-','*','$','&','#'];
    let password = fatherName.substring(0,1).toUpperCase() + elementsPass[Math.floor(Math.random() * elementsPass.length)] + consecutivo + name.substring(0,3)
    return password;
  }

  /*
  Metodo para obtener el listado de carreras
  */
  getCarreras(){
    this.managerServices.getCarreras('conalep').subscribe(
      data=>{
        console.log(data);
        //this.carrerList = data.message.results;
      },error=>{
        console.log(error);
      }
    );
  }

  /*
  metodo para validar si el usuario esta o no dentro de la base de datos
  */
  validateUser(useremail):boolean{
    this.uservalite = false;
    if(this.emailRegex.test(useremail)){
      this.uservalite = true;
      this.userfinder = false;
      this.personsinglemuir.email = useremail;
      if(this.request.students.find(st => st.correoElectronico == useremail)){
        this.userfinder = true;
      }else{
        this.findUserSingle(useremail);
        this.userfinder = false;
      }
    }else{
      this.uservalite = false;
    }
    return this.uservalite;
  }

  findUserSingle(useremail){
    this.userfind = true;
    this.personcheck = false;
    this.managerServices.getUserDetailsByManager(useremail).subscribe(data=>{
      this.personsingle =  data.person;
      this.studentsingle = data.student;
      this.idusersingle = data.userid;
      if(this.personsingle!=null){
        this.persontmp = {
          'nombreCompleto':this.personsingle.name,
          'apellidoPaterno':this.personsingle.fatherName,
          'apellidoMaterno':this.personsingle.motherName,
          'correoElectronico':this.personsingle.email,
          'contraseña':"Usuario existente"
        }
      }
      this.personcheck = true;
      this.userfind = false;
    });
  }

  newusersingle(){
    if(this.typestudent == 'internal'){
      this.studentsinglemuir = new studentmuir(this.typestudent, this.career, this.termn);
      this.typecorporate = new corporate(this.corptype);
      this.user = new usermuir(this.personsinglemuir,this.passwordGenerator('0',this.personsinglemuir.name, this.personsinglemuir.fatherName), 'conalep',this.orgName,this.codegroup,this.numberrequest,this.studentsinglemuir,this.typecorporate);
      this.newregister(this.user, this.user.password);
    }else if(this.typestudent == 'external'){
      this.studentexternalmuir = new studentexternalmuir(this.typestudent, this.corptype);
      this.userexternal = new userexternalmuir(this.personsinglemuir,this.passwordGenerator('0',this.personsinglemuir.name, this.personsinglemuir.fatherName), 'conalep',this.orgName,this.codegroup,this.numberrequest,this.studentexternalmuir);
      this.newregister(this.userexternal, this.userexternal.password);
    }
  }

  /*
  metodo para agregar un alumno individualmente
  */
  newregister(user, password){
    this.managerServices.createuserbymanager(user).subscribe(
      data=>{
        this.persontmp = {
          'nombreCompleto':this.personsinglemuir.name,
          'apellidoPaterno':this.personsinglemuir.fatherName,
          'apellidoMaterno':this.personsinglemuir.motherName,
          'correoElectronico':this.personsinglemuir.email,
          'contraseña':password
        }
        this.updateRequestManagerSingle(data.userid, this.persontmp);
      },error=>{
        console.log(error);
      }
    );
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

  public parsetypeStudent(type){
    if(type=='Docente'||type=='docente'){
      return 'teacher';
    }
    if(type=='alumno'||type=='Alumno'){
      return 'student'
    }
    if(type=='administrativo'||type=='Administrativo'){
      return 'administrative'
    }
    if(type=='Publico'||type=='publico'){
      return 'public'
    }
    if(type=='Privado'||type=='privado'){
      return 'private'
    }
    if(type=='Particular'||type=='particular'){
      return 'particular'
    }
  }
}
