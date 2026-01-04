export interface CreateClassBody {
  name: string;
  managerId: number;
}

export interface UpdateClassBody {
  name?: string;
  managerId?: number;
}

export interface ClassWithRelations {
  id: number;
  name: string;
  managerId: number;
  manager: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
  students?: {
    id: number;
    firstname: string;
    classId: number;
  }[];
  sessions?: {
    id: number;
    date: Date;
    classId: number;
    subjectId: number;
    teacherId: number;
  }[];
  _count?: {
    students: number;
    sessions: number;
  };
}