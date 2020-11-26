import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Application } from 'src/app/model/application';

@Component({
  selector: 'app-app-panel',
  templateUrl: './app-panel.component.html',
  styleUrls: ['./app-panel.component.scss']
})
export class AppPanelComponent implements OnInit {

  @Input() app : Application;
  fg: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.fg = new FormGroup({})
    if(this.app.template.appType=='springboot'){
      this.fg.addControl('runLocal',new FormControl(false));
      this.fg.addControl('server',new FormControl({value:this.app.template.remoteUrl,disabled:true}));
      this.fg.addControl('port',new FormControl({value:this.app.template.port,disabled:true}));
      this.fg.addControl('debugPort',new FormControl({value:this.app.template.debugPort,disabled:true}));
      this.fg.addControl('debugWait',new FormControl(false));
      this.fg.addControl('selectedBranch',new FormControl(undefined));
    }
  }

  onRunLocalChange(evt){
    this.fg.get('runLocal').setValue(evt.source.checked)
  }

  onDebugWaitChange(evt){
    this.fg.get('debugWait').setValue(evt.source.checked)
  }

}
