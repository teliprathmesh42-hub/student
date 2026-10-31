import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', children: [] },
  { path: 'register', children: [] },
  { path: 'dashboard', children: [] },
  { path: 'students', children: [] },
  { path: 'teachers', children: [] },
  { path: 'parents', children: [] },
  { path: 'academics', children: [] },
  { path: 'attendance', children: [] },
  { path: 'examinations', children: [] },
  { path: 'assignments', children: [] },
  { path: 'fees', children: [] },
  { path: 'timetable', children: [] },
  { path: 'library', children: [] },
  { path: 'transport', children: [] },
  { path: 'hostel', children: [] },
  { path: 'reports', children: [] },
  { path: '**', redirectTo: 'login' }
];