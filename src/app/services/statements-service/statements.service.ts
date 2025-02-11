import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DisciplineDto} from '../../types/interfaces/discipline.dto.i';
import {StudentDto} from '../../types/interfaces/student.dto.i';
import {StatementDto} from '../../types/interfaces/statement.dto';

@Injectable({
  providedIn: 'root'
})
export class StatementsService {
  private baseUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  getDisciplineData(subjectId: number): Observable<DisciplineDto> {
      const data: DisciplineDto = {
        subjectId: 101,
        subjectTitle: "Математический анализ",
        professorId: 12,
        professorName: "Иванов Иван Иванович",
        groupId: 5,
        groupName: "А-2025"
      };

      return new Observable<DisciplineDto>(observer => {
        observer.next(data);
        observer.complete();
      });
  }

  getStudentsData(subjectId: number, professorId: number): Observable<StudentDto[]> {
      const students: StudentDto[] = [
        { studentId: 1, name: "Иванов Иван" },
        { studentId: 2, name: "Петров Петр" },
        { studentId: 3, name: "Сидоров Алексей" },
        { studentId: 4, name: "Кузнецов Дмитрий" },
        { studentId: 5, name: "Смирнова Анна" },
        { studentId: 6, name: "Михайлова Ольга" },
        { studentId: 7, name: "Козлова Екатерина" },
        { studentId: 8, name: "Новиков Максим" },
        { studentId: 9, name: "Федоров Сергей" },
        { studentId: 10, name: "Васильева Мария" },
        { studentId: 11, name: "Зайцева Ирина" },
        { studentId: 12, name: "Попов Павел" },
        { studentId: 13, name: "Волков Игорь" },
        { studentId: 14, name: "Соловьев Артем" },
        { studentId: 15, name: "Тихонов Андрей" },
        { studentId: 16, name: "Ершова Наталья" },
        { studentId: 17, name: "Борисов Константин" },
        { studentId: 18, name: "Григорьева Алина" },
        { studentId: 19, name: "Макаров Олег" },
        { studentId: 20, name: "Алексеев Николай" },
        { studentId: 21, name: "Фролова Ксения" },
        { studentId: 22, name: "Романов Илья" },
        { studentId: 23, name: "Дмитриев Владимир" },
        { studentId: 24, name: "Медведева Полина" },
        { studentId: 25, name: "Антонов Евгений" },
        { studentId: 26, name: "Никитина Елена" },
        { studentId: 27, name: "Гусев Виктор" },
        { studentId: 28, name: "Киселева Оксана" },
        { studentId: 29, name: "Лебедев Тимур" },
        { studentId: 30, name: "Широков Арсений" }
      ];

      return new Observable<StudentDto[]>(observer => {
        observer.next(students);
        observer.complete();
      });
  }


  saveGrades(grades: StatementDto[]): Observable<void> {
    const invalidGrades = grades.filter(grade => !this.isValidGrade(grade.value));
    if (invalidGrades.length > 0) {
      return new Observable<void>(observer => {
        observer.error('Some grades are invalid. Ensure that grades are between 0 and 100.');
        observer.complete();
      });
    }

    return new Observable<void>(observer => {
      setTimeout(() => {
        console.log(grades);
        observer.next();
        observer.complete();
      }, 1000);
    });
  }

  private isValidGrade(grade: number): boolean {
    return grade >= 0 && grade <= 100;
  }

}

