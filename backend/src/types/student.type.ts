// types/student.type.ts
export interface CreateStudentBody {
  firstname: string;
  classId: number;
}

export interface UpdateStudentBody {
  firstname?: string;
  classId?: number;
}
