import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignupPageComponent {
  constructor(private router: Router, private http: HttpClient){}
  
  formSignup: any = {
    name: '',
    rollNo: '',
    year: '',
    email: '',
    password: '',
    conformPassword: '',
  }
  
  signUp() {
    this.http.post('http://localhost:5000/api/auth/signup', this.formSignup).subscribe(
      (response: any) =>{
        if (response.message === 'User created successfully') {
          console.log('Signup successful');
          this.router.navigate(['/login'])
        } else {
          console.error('Signup failed:', response.message);
        }
      },(error) =>{
        console.log("Signup Error: " + error.message);
        
      }
    )
  }

}
