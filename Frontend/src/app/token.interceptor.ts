import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';

//  Injectable
//  HttpRequest เรียกใช้งาน get put post delete
//  HttpHandler ส่ง  HTTP requests ไปยัง server เเล้วส่ง HTTP responses กลับมากจาก server


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var token = localStorage.getItem('token');
    // var lang = localStorage.getItem('lang');
    // var campus = localStorage.getItem('campus');
    // request = request.clone({
    //   setHeaders: {
    //     "App-key": environment.APP_KEY
    //   }
    // });
    request = request.clone({
      setHeaders: {
        Test: `****** TEST ******`
      }
    });
    if (token) {
      // Logged in so return true
      request = request.clone({
        setHeaders: {
          'Authorization': token
        }
      });
    }
    // if (lang) {
    //   request = request.clone({
    //     setHeaders: {
    //       pagelang: lang,
    //     }
    //   });
    // }
    // if (campus) {
    //   request = request.clone({
    //     setHeaders: {
    //       campus: campus
    //     }
    //   });
    // }

    return next.handle(request);
  }
}
