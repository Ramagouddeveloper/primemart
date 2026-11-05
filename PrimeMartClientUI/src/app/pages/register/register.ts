import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  name = '';
  email = '';
  username = '';
  password = '';

  loading = false;

  constructor(private auth: AuthService, private router: Router) { }

  register() {

    if (!this.name || !this.email || !this.username || !this.password) {
      alert("Please fill all fields");
      return;
    }

    this.loading = true;

    const payload = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    };

    this.auth.register(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        alert(res.message || "Registered Successfully");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        alert("Register failed. Check backend / CORS.");
        console.log(err);
      }
    });
  }

}
