import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Adjust this path/name if your Students component lives elsewhere
import { Students } from './students/students';

type Status = 'Present' | 'Absent' | 'Leave';

interface RegisteredUser {
  name: string;
  email: string;
  mobile: string;
  studentId: string;
  password: string;
}

@Component({
  selector: 'app-root',
  imports: [NgIf, FormsModule, Students],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // ---------- Auth / page state ----------
  page: 'login' | 'register' | 'dashboard' = 'login';
  message = '';
  isSuccess = false;

  loginId = '';
  loginPassword = '';

  studentName = '';
  email = '';
  mobile = '';
  regId = '';
  regPassword = '';
  confirmPassword = '';

  currentUser = '';

  private readonly storageKey = 'sms_users';

  // ---------- Layout ----------
  selectedPage = 'Dashboard';
  today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  menu = [
    { page: 'Dashboard', icon: '🏠', label: 'Dashboard' },
    { page: 'Student List', icon: '👨‍🎓', label: 'Student List' },
    { page: 'Attendance', icon: '📝', label: 'Attendance' },
    { page: 'Course Management', icon: '📚', label: 'Course Management' },
    { page: 'Fees Management', icon: '💰', label: 'Fees Management' },
    { page: 'Reports', icon: '📊', label: 'Reports' },
    { page: 'Settings', icon: '⚙️', label: 'Settings' },
  ];

  private implementedPages = [
    'Dashboard',
    'Student List',
    'Attendance',
    'Course Management',
    'Fees Management',
    'Reports',
  ];

  // ---------- Dashboard data ----------
  stats = [
    { label: 'Total Students', value: 1250, icon: '👨‍🎓', color: '#17a2b8' },
    { label: 'Total Teachers', value: 85, icon: '👩‍🏫', color: '#28a745' },
    { label: 'Total Courses', value: 12, icon: '📚', color: '#f0ad4e' },
    { label: 'Fees Collected', value: '₹12.5L', icon: '💰', color: '#dc3545' },
  ];

  weekly = [
    { day: 'Mon', percent: 92 },
    { day: 'Tue', percent: 88 },
    { day: 'Wed', percent: 95 },
    { day: 'Thu', percent: 85 },
    { day: 'Fri', percent: 90 },
    { day: 'Sat', percent: 78 },
  ];

  courses = [
    { name: 'BCA', count: 320, color: '#17a2b8' },
    { name: 'BBA', count: 280, color: '#28a745' },
    { name: 'B.Com', count: 410, color: '#f0ad4e' },
    { name: 'B.Sc', count: 240, color: '#dc3545' },
  ];

  fees = [
    { label: 'Collected', amount: '₹12,50,000', percent: 70, color: '#28a745' },
    { label: 'Pending', amount: '₹4,20,000', percent: 25, color: '#f0ad4e' },
    { label: 'Overdue', amount: '₹1,10,000', percent: 10, color: '#dc3545' },
  ];

  notices = [
    { title: 'Mid-term exams start from 10 Nov', time: '2 hours ago' },
    { title: 'Diwali holidays: 1 Nov - 5 Nov', time: 'Yesterday' },
    { title: 'Fee payment last date is 15 Nov', time: '2 days ago' },
  ];

  activities = [
    { icon: '🧑‍🎓', text: 'New student registered', time: '10 min ago' },
    { icon: '💳', text: 'Fee payment received', time: '1 hour ago' },
    { icon: '📝', text: 'Attendance marked for BCA', time: '3 hours ago' },
  ];

  reports = [
    { icon: '📈', title: 'Attendance Report', desc: 'Daily and monthly attendance summary.' },
    { icon: '💵', title: 'Fees Report', desc: 'Collected, pending and overdue fees.' },
    { icon: '🎓', title: 'Student Report', desc: 'Course-wise student statistics.' },
    { icon: '📚', title: 'Course Report', desc: 'Course enrollment and performance.' },
  ];

  // ---------- Attendance ----------
  attDate = new Date().toISOString().substring(0, 10);
  attCourse = 'All Courses';
  attSearch = '';
  attSaved = '';
  attCourses = ['All Courses', 'BCA', 'BBA', 'B.Com', 'B.Sc'];

  attendance: { roll: number; name: string; course: string; status: Status }[] = [
    { roll: 101, name: 'Atharv Patil', course: 'BCA', status: 'Present' },
    { roll: 102, name: 'Riya Sharma', course: 'BCA', status: 'Present' },
    { roll: 103, name: 'Rohan Desai', course: 'BBA', status: 'Absent' },
    { roll: 104, name: 'Sneha Kulkarni', course: 'B.Com', status: 'Leave' },
    { roll: 105, name: 'Amit Jadhav', course: 'B.Sc', status: 'Present' },
    { roll: 106, name: 'Pooja More', course: 'BBA', status: 'Present' },
  ];

  // ---------- Course management ----------
  newCourse = { name: '', duration: '', fees: null as number | null };
  courseList = [
    { name: 'BCA', duration: '3 Years', fees: 45000 },
    { name: 'BBA', duration: '3 Years', fees: 40000 },
    { name: 'B.Com', duration: '3 Years', fees: 30000 },
    { name: 'B.Sc', duration: '3 Years', fees: 35000 },
  ];

  // ---------- Fees management ----------
  newFee = { studentId: '', total: null as number | null, paid: null as number | null };
  feeList: { studentId: string; total: number; paid: number }[] = [
    { studentId: 'S101', total: 45000, paid: 45000 },
    { studentId: 'S102', total: 40000, paid: 20000 },
  ];

  // ---------- Getters used by the template ----------
  get initials(): string {
    return this.getInitial(this.currentUser);
  }

  get isComingSoon(): boolean {
    return !this.implementedPages.includes(this.selectedPage);
  }

  get totalCourseStudents(): number {
    return this.courses.reduce((sum, c) => sum + c.count, 0);
  }

  get donut(): string {
    const total = this.totalCourseStudents || 1;
    let start = 0;
    const parts = this.courses.map((c) => {
      const end = start + (c.count / total) * 100;
      const part = `${c.color} ${start}% ${end}%`;
      start = end;
      return part;
    });
    return `conic-gradient(${parts.join(', ')})`;
  }

  get recentUsers(): { name: string; studentId: string; email: string }[] {
    const users = this.getUsers().slice(-5).reverse();
    if (users.length) return users;
    return [
      { name: 'Atharv Patil', studentId: 'S101', email: 'atharv@example.com' },
      { name: 'Riya Sharma', studentId: 'S102', email: 'riya@example.com' },
    ];
  }

  get filteredAttendance() {
    const q = this.attSearch.trim().toLowerCase();
    return this.attendance.filter((r) => {
      const courseOk = this.attCourse === 'All Courses' || r.course === this.attCourse;
      const searchOk =
        !q || r.name.toLowerCase().includes(q) || String(r.roll).includes(q);
      return courseOk && searchOk;
    });
  }

  get attPercent(): number {
    const list = this.filteredAttendance;
    if (!list.length) return 0;
    const present = list.filter((r) => r.status === 'Present').length;
    return Math.round((present / list.length) * 100);
  }

  // ---------- Methods: auth ----------
  login(): void {
    const id = this.loginId.trim();
    const pass = this.loginPassword;

    if (id === 'admin' && pass === '1234') {
      return this.enterDashboard('Admin');
    }

    const user = this.getUsers().find((u) => u.studentId === id && u.password === pass);
    if (user) {
      return this.enterDashboard(user.name);
    }

    this.setMessage('Invalid Student ID or Password', false);
  }

  register(): void {
    if (this.regPassword !== this.confirmPassword) {
      return this.setMessage('Passwords do not match', false);
    }

    const users = this.getUsers();
    if (users.some((u) => u.studentId === this.regId.trim())) {
      return this.setMessage('Student ID already exists', false);
    }

    users.push({
      name: this.studentName.trim(),
      email: this.email.trim(),
      mobile: this.mobile.trim(),
      studentId: this.regId.trim(),
      password: this.regPassword,
    });
    this.saveUsers(users);

    this.studentName = this.email = this.mobile = '';
    this.regId = this.regPassword = this.confirmPassword = '';
    this.page = 'login';
    this.setMessage('Registration successful! Please login.', true);
  }

  openRegister(): void {
    this.message = '';
    this.page = 'register';
  }

  openLogin(): void {
    this.message = '';
    this.page = 'login';
  }

  logout(): void {
    this.currentUser = '';
    this.loginId = '';
    this.loginPassword = '';
    this.selectedPage = 'Dashboard';
    this.message = '';
    this.page = 'login';
  }

  // ---------- Methods: navigation / helpers ----------
  changePage(p: string): void {
    this.selectedPage = p;
  }

  getInitial(name: string): string {
    return name ? name.trim().charAt(0).toUpperCase() : '?';
  }

  // ---------- Methods: attendance ----------
  countStatus(status: Status): number {
    return this.filteredAttendance.filter((r) => r.status === status).length;
  }

  markAll(status: Status): void {
    this.filteredAttendance.forEach((r) => (r.status = status));
  }

  setStatus(roll: number, status: Status): void {
    const row = this.attendance.find((r) => r.roll === roll);
    if (row) row.status = status;
  }

  saveAttendance(): void {
    this.attSaved = `Attendance saved for ${this.attDate}`;
    setTimeout(() => (this.attSaved = ''), 3000);
  }

  // ---------- Methods: courses ----------
  addCourse(): void {
    const { name, duration, fees } = this.newCourse;
    if (!name || !duration || fees === null) return;
    this.courseList.push({ name: name.trim(), duration: duration.trim(), fees });
    this.newCourse = { name: '', duration: '', fees: null };
  }

  deleteCourse(name: string): void {
    this.courseList = this.courseList.filter((c) => c.name !== name);
  }

  // ---------- Methods: fees ----------
  addFee(): void {
    const { studentId, total, paid } = this.newFee;
    if (!studentId || total === null || paid === null) return;
    this.feeList.push({ studentId: studentId.trim(), total, paid });
    this.newFee = { studentId: '', total: null, paid: null };
  }

  // ---------- Private helpers ----------
  private enterDashboard(name: string): void {
    this.currentUser = name;
    this.selectedPage = 'Dashboard';
    this.message = '';
    this.page = 'dashboard';
  }

  private setMessage(text: string, success: boolean): void {
    this.message = text;
    this.isSuccess = success;
  }

  // localStorage is unavailable during server-side rendering, so guard it
  private getUsers(): RegisteredUser[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  private saveUsers(users: RegisteredUser[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }
}