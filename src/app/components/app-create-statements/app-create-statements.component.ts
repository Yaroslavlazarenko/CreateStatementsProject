import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  FormControl
} from '@angular/forms';
import { StatementsService } from '../../services/statements-service/statements.service';
import { StudentDto } from '../../types/interfaces/student.dto.i';
import { StatementDto } from '../../types/interfaces/statement.dto';
import { DisciplineDto } from '../../types/interfaces/discipline.dto.i';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-app-create-statements',
  templateUrl: './app-create-statements.component.html',
  styleUrls: ['./app-create-statements.component.css'],
  standalone: true,
  imports: [NgIf, NgForOf, ReactiveFormsModule]
})
export class AppCreateStatementsComponent implements OnInit {
  form: FormGroup;
  disciplineInfo: DisciplineDto | null = null;
  loading = true;
  errorMessage = '';
  dateTouched = false;

  constructor(
    private fb: FormBuilder,
    private statementsService: StatementsService
  ) {
    this.form = this.fb.group({
      selectedDate: ['', Validators.required],
      students: this.fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.statementsService.getDisciplineData(1).subscribe({
      next: (data: DisciplineDto) => {
        this.disciplineInfo = data;
        this.loadStudents();
      },
      error: () => this.setError('Error loading discipline data')
    });
  }

  private loadStudents(): void {
    if (!this.disciplineInfo) return;

    this.statementsService.getStudentsData(this.disciplineInfo.subjectId, this.disciplineInfo.professorId).subscribe({
      next: (students: StudentDto[]) => {
        this.studentsFormArray.clear();
        students.forEach(student => this.studentsFormArray.push(this.createStudentFormGroup(student)));
        this.loading = false;
      },
      error: () => this.setError('Error loading students')
    });
  }

  private createStudentFormGroup(student: StudentDto): FormGroup {
    return this.fb.group({
      studentId: [student.studentId],
      name: [student.name],
      grade: [null, [Validators.min(0), Validators.max(100), this.nullOrGradeValidator()]],
    });
  }

  private nullOrGradeValidator(): Validators {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null) return null;
      return value >= 0 && value <= 100 ? null : { invalidGrade: true };
    };
  }

  get studentsFormArray(): FormArray {
    return this.form.get('students') as FormArray;
  }

  isFormInvalid(): boolean {
    return this.form.invalid || this.studentsFormArray.controls.some(control => control.get('grade')?.invalid);
  }

  saveGrades(): void {
    if (this.isFormInvalid()) {
      this.setError('Please fix form errors before saving.');
      return;
    }

    const grades: StatementDto[] = this.studentsFormArray.controls
      .filter(control => control.get('grade')?.value !== null)
      .map(control => ({
        studentId: control.get('studentId')?.value,
        professorId: this.disciplineInfo!.professorId,
        subjectId: this.disciplineInfo!.subjectId,
        date: this.form.get('selectedDate')?.value,
        value: control.get('grade')?.value,
      }));

    if (!grades.length) {
      alert('Please enter grades for at least one student.');
      return;
    }

    this.statementsService.saveGrades(grades).subscribe({
      next: () => alert('Data saved successfully'),
      error: () => alert('Error saving data'),
    });
  }

  handleGradeInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');
    const gradeControl = this.studentsFormArray.at(index).get('grade') as FormControl;

    gradeControl.setValue(value ? Math.max(0, Math.min(100, Number(value))) : null);
    gradeControl.markAsTouched();
    gradeControl.updateValueAndValidity();

    input.value = gradeControl.value !== null ? String(gradeControl.value) : '';
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.loading = false;
  }
}




