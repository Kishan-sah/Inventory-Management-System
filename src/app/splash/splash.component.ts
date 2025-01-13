import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.css'
})
export class SplashComponent implements OnInit {
  constructor(private route: Router) {}
  showSplash = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.showSplash = false;
      this.route.navigate(['loginPage'])
    }, 3000);
  }
}
