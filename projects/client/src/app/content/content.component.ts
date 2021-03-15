import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.addEventListener('resize', this.logWindowSize);
  }

  logWindowSize() {
    console.log(window.innerWidth / window.innerHeight);
  }

}
