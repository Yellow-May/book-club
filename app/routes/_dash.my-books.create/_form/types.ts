export interface MediaType {
  url: string;
  name: string;
  size: number;
}

export interface FormType {
  title: string;
  // cover?: MediaType;
  synopsis: string;
  collaborators_ids: string[];
  genres_ids: string[];
}

export interface FormErrorType {
  title: string;
  synopsis: string;
  genres_ids: string;
}
