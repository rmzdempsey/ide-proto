import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { LoginPanelComponent } from './ui/dialogs/login-panel/login-panel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(
    public dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.dialog.open(LoginPanelComponent, {
      width: '400px',
      disableClose:true
    });
  }
}
