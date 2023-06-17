import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public authForm!: FormGroup;
  public enableRegister: boolean = true;

  constructor(
    private formbuilder : FormBuilder,
    private authService : AuthService,
    private route : Router,
  ) {
    localStorage.clear();
  }

  ngOnInit() {
    this.authForm = this.formbuilder.group({
      userId: ['', Validators.required],
      pass: ['', Validators.required]
    })
  }

  public onSubmit() {
    let data = {
      userId: this.authForm.controls["userId"].value,
      pass: this.authForm.controls["pass"].value
    }

    if (this.authForm.invalid) {
      return;
    }

    this.authService.login(data).subscribe((res) => {
      console.log("Res", res);
      this.route.navigate(["/"]);
    },(error) => {
      console.log("error", error);
    })

  }

}
