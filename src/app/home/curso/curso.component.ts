import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HomeService } from './../homeservices/home.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  providers:[HomeService]
})
export class CursoComponent implements OnInit {

  public identiti;
  public token;
  loading:boolean
  public curso:any = [];
  public block:any = [];
  public sections:any [] = [];
  public contents:any [] = [];
  public idc:string;

  constructor(private _activeRouter:ActivatedRoute, private homeService:HomeService) {
    this.identiti = this.homeService.getIdentiti();
    this.token = this.homeService.getToken();
    this._activeRouter.params.subscribe( params =>{
      if(params['id']!=null){
        this.idc = params['id']
      }
    });
  }
  ngOnInit() {
    this.getCourse(this.idc);
  }

  public getCourse(id){
    this.loading = true;
    this.homeService.getCoursesOrg().subscribe(data=>{
      this.curso = data.body.message.courses.find(c => c.id == id);
      this.loading = false;
    },error=>{
      console.log(error);
    });
    this.homeService.showBlocks(id).subscribe(data=>{
      this.block = data.body.message.blocks;;
      this.loading = false;
    },error=>{
      console.log(error);
    });
  }
}
