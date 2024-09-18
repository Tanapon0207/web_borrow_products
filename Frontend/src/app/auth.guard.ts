import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './components/login/login.service';



export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService); // ใช้ตัวแปรที่มีใน service
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const router = inject(Router);
  const userRole = localStorage.getItem('role'); // ดึงข้อมูลบทบาทจาก localStorage

  console.log('Token', token);
  console.log('11', userRole);
  console.log('15  user', user);
  if (user) {
    let exp = loginService.tokenExpired(token ?? '')
    console.log(exp)
    if (exp == true) {
      localStorage.clear()
      location.reload();
      router.navigate(['/login']);

      return false;
    }


    return true;
  } else {
    router.navigate(['/login']);
    // alert('คุณต้อง login เพื่อรับ Token ในการใช้งานเว็บไซต์');
    return false;
  }

};
