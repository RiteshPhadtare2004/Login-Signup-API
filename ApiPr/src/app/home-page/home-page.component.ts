import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HttpClientModule,FormsModule,CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  users: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5000/api/auth/home').subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  editUser(user: any) {
    user.editing = true;
  }

  saveUser(user: any) {
    this.http.put<any>('http://localhost:5000/api/auth/profile/update/' + user._id, { name: user.name, email: user.email }).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        user.editing = false;
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }
  
  cancelEdit(user: any) {
    user.editing = false;
    // Refresh the user list to discard changes
    this.refreshUserList();
  }
  refreshUserList() {
    throw new Error('Method not implemented.');
  }
  
}
