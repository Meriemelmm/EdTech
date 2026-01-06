// types/session.type.ts
export interface CreateSessionBody {
  date: string; // ISO string
  classId: number;
  subjectId: number;
  teacherId: number;
}

export interface UpdateSessionBody {
  date?: string;
  classId?: number;
  subjectId?: number;
  teacherId?: number;
}
