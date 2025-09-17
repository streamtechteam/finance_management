export type DataEditMode = AddMode | UpdateMode | DeleteMode | GetMode;
export type GetMode = { mode: 'get'; type: DataType };
export type AddMode = { mode: 'add'; data: User | Project | Finance; type: DataType };
export type UpdateMode = { mode: 'edit'; data : User | Project | Finance; type: DataType  };
export type DeleteMode = { mode: 'delete'; id: string; type: DataType };
export type DataType = 'projects' | 'finances' | 'users' | 'me';
export type EditDataType = 'projects' | 'finances' | 'users';

export type FormDataType = {
  phonenumber: string;
  password: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  budget: number;
  owner: string;
};

export type Finance = {
  id: string;
  project_id: string;
  amount: number;
  category: string;
  date: string;
};

export type User = {

  id: string;
  name: string;
  last_name: string;
  password: string;
  phone: string;
  role: string;
};

export type LoginRequest = {
  phone: string;
  password: string;
};

export type LoginResponse = {
  status: number;
  token: string;
  user: User;
};

export type DialogData = {
  hidden : boolean;
  title: string;
  items: any[];
}