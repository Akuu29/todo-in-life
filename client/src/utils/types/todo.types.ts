export type Todo = {
  id: string;
  title: string;
  content: string;
  category: string;
  date_limit: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: number | null;
}

export type TodosByCategory = {
  [category: string]: Array<Todo>;
}