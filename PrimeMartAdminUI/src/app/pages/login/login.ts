import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    // this.router.navigate(['/admin/products']);
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        if (res.role !== 'ADMIN' && res.role !== 'SUPER_ADMIN') {
          alert('Only ADMIN or SUPER_ADMIN users can access this application.');
          return;
        }
        this.auth.saveToken(res.token);
        this.auth.saveUser(res.username, res.role, res.userId);
        this.router.navigate(['/admin/products']);
      },
      error: () => alert('Invalid username/password')
    });
  }
}
