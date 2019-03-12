import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
})
export class ErrorComponent {

  typeError:any;
  closemodal:NgbModalRef;

  constructor(private router:Router, private route:ActivatedRoute, private modalService:NgbModal) {
    this.route.params.subscribe(params=>{
      if( params ['typeError']!=null){
        this.typeError = params ['typeError'];
      }
    });
  }

  public showError(data){
    console.log(data);
  }

}
