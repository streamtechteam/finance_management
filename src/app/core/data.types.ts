export type DataEditMode = AddMode | UpdateMode | DeleteMode | GetMode;
export type GetMode = { mode: 'get'; type: DataType };
export type AddMode = { mode: 'add'; data: { name: string; type: DataType } };
export type UpdateMode = { mode: 'edit'; data: { id: string; name: string; type: DataType } };
export type DeleteMode = { mode: 'delete'; data: { id: string; type: DataType } };
export type DataType = 'projects' | 'finances' | 'users' | 'me';
