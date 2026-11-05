import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (!this.username.trim() || !this.password) {
      alert('Please enter username and password');
      return;
    }

    if (this.loading) {
      return;
    }

    this.loading = true;

    this.auth.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: (response: any) => {
        this.loading = false;

        if (response?.role !== 'CUSTOMER') {
          alert('Please use the PrimeMart Admin application for admin login.');
          return;
        }

        this.auth.saveToken(response.token);
        this.auth.saveUser(
          response.username,
          response.role,
          response.userId
        );

        this.router.navigate(['/home']);
      },
      error: error => {
        console.error('Login error:', error);
        this.loading = false;
        alert(error?.error?.message || 'Invalid username/password');
      }
    });
  }
}
