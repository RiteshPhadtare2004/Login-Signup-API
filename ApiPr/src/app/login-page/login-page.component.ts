import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule, RouterOutlet],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{
  
  formLogin: any = {
    email: '',
    password: ''
  }
  
  constructor(private router: Router, private http: HttpClient){}
  
  ngOnInit(): void {}
  
  onLoin() {
    this.http.post('http://localhost:5000/api/auth/login',this.formLogin).subscribe(
      (response: any) =>{
        if(response.token){
          this.router.navigate(['/home'])
        }
      },(error) =>{
        console.log("Login Error: " + error.message);
        
      }
    )
  }
  navigateSignup() {
    this.router.navigate(['/signup'])
  }
}
