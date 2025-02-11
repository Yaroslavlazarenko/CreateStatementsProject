import {Component, OnInit} from '@angular/core';
import {StatementsService} from '../../services/statements-service/statements.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StudentDto} from '../../types/interfaces/student.dto.i';
import {StatementDto} from '../../types/interfaces/statement.dto';
import {DisciplineDto} from '../../types/interfaces/discipline.dto.i';

@Component({
  selector: 'app-app-create-statements',
  templateUrl: './app-create-statements.component.html',
  styleUrls: ['./app-create-statements.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
})

export class AppCreateStatementsComponent implements OnInit {
  disciplineInfo: DisciplineDto = {
    subjectId: 0,
    subjectTitle: '',
    professorId: 0,
    professorName: '',
    groupId: 0,
    groupName: ''
  };
  students: StudentListInfo[] = [];
  selectedDate: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  dateTouched: boolean = false;

  constructor(private statementsService: StatementsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.statementsService.getDisciplineData(1).subscribe({
      next: (data) => {
        this.disciplineInfo = data;
        this.loadStudents();
      },
      error: () => {
        this.setError('Error loading discipline data');
      }
    });
  }

  private loadStudents(): void {
    this.statementsService.getStudentsData(this.disciplineInfo.subjectId, this.disciplineInfo.professorId).subscribe({
      next: (studentsData: StudentDto[]) => {
        this.students = studentsData.map((student: StudentDto) => ({
          name: student.name,
          studentId: student.studentId,
          grade: null,
          gradeIsValid: true
        }));
        this.loading = false;
      },
      error: () => {
        this.setError('Error loading students');
      }
    });
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.loading = false;
  }

  validateGrade(student: StudentListInfo): void {
    student.gradeIsValid = student.grade === null || (student.grade >= 0 && student.grade <= 100);
  }

  isFormInvalid(): boolean {
    return !this.selectedDate || this.students.some(student => !student.gradeIsValid);
  }

  saveGrades(): void {
    if (!this.selectedDate) {
      this.setError('Please select a date before saving.');
      return;
    }

    const grades: StatementDto[] = this.students
      .filter(student => student.grade !== null && student.gradeIsValid)
      .map(student => ({
        studentId: student.studentId,
        professorId: this.disciplineInfo.professorId,
        subjectId: this.disciplineInfo.subjectId,
        date: this.selectedDate,
        value: student.grade as number
      }));

    if (grades.length > 0) {
      this.statementsService.saveGrades(grades).subscribe({
        next: () => alert('Data saved successfully'),
        error: () => alert('Error saving data')
      });
    } else {
      alert('Please enter grades for at least one student');
    }
  }

  handleGradeInput(event: Event, student: StudentListInfo): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    if (value === '') {
      student.grade = null;
    } else {
      student.grade = Math.max(0, Math.min(100, Number(value)));
    }

    this.validateGrade(student);
    input.value = student.grade !== null ? student.grade.toString() : '';
  }
}




